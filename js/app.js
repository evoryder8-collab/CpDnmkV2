(() => {
  "use strict";

  const data = window.BOARD_DATA;
  const config = window.BOARD_CONFIG;

  if (!data) {
    throw new Error("BOARD_DATA is missing. Check js/data.js.");
  }

  if (!config) {
    throw new Error("BOARD_CONFIG is missing. Check js/data.js.");
  }

  const elements = {
    dayTabs: document.querySelector("#day-tabs"),
    roundTabs: document.querySelector("#round-tabs"),
    dayHeatStrip: document.querySelector("#day-heat-strip"),
    fieldToggle: document.querySelector("#field-toggle"),
    allClientsButton: document.querySelector("#all-clients-button"),
    videoFilterButton: document.querySelector("#video-filter-button"),
    activeRound: document.querySelector("#active-round"),
    roundBriefing: document.querySelector("#round-briefing"),
    secondFloor: document.querySelector("#second-floor"),
    groundFloor: document.querySelector("#ground-floor"),
  };

  const urlState = new URLSearchParams(window.location.search);
  const initialDay = data.days.some((day) => day.id === urlState.get("day"))
    ? urlState.get("day")
    : data.days[0].id;
  const requestedRound = urlState.get("round");
  const initialRound = getDay(initialDay).rounds.some((round) => round.time === requestedRound)
    ? requestedRound
    : getDay(initialDay).rounds[0].time;

  const state = {
    day: initialDay,
    round: initialRound,
    showField: true,
    videoIncludedOnly: false,
  };

  const cardOverlay = document.createElement("div");
  cardOverlay.className = "card-overlay";
  cardOverlay.hidden = true;
  cardOverlay.tabIndex = -1;
  cardOverlay.setAttribute("role", "dialog");
  cardOverlay.setAttribute("aria-modal", "true");

  const rosterOverlay = document.createElement("div");
  rosterOverlay.className = "roster-overlay";
  rosterOverlay.hidden = true;
  rosterOverlay.innerHTML = `
    <section class="roster-panel" role="dialog" aria-modal="true" aria-labelledby="roster-heading">
      <header class="roster-header">
        <div>
          <p class="eyebrow">Booked coverage</p>
          <h2 id="roster-heading">All clients</h2>
        </div>
        <button class="roster-close" type="button" aria-label="Close all clients">Close</button>
      </header>
      <div class="roster-content" id="roster-content"></div>
    </section>
  `;

  document.body.append(cardOverlay, rosterOverlay);

  const rosterContent = rosterOverlay.querySelector("#roster-content");
  const rosterClose = rosterOverlay.querySelector(".roster-close");
  let cardOverlayTimer;
  let rosterOverlayTimer;
  let cardReturnFocus;
  let rosterReturnFocus;

  function getDay(dayId) {
    return data.days.find((day) => day.id === dayId);
  }

  function getRoom(roomId) {
    return data.rooms.find((room) => room.id === roomId);
  }

  function getRoundPlan(dayId, roundTime) {
    return data.roundPlans.find(
      (plan) => plan.day === dayId && plan.round === roundTime,
    );
  }

  function normalize(value) {
    return value.trim().toLocaleLowerCase("en");
  }

  function getVenueRoom(roomId) {
    const venueRoom = config.VENUE[roomId];
    const room = getRoom(roomId);

    if (!venueRoom || !room) {
      throw new Error(`Unknown venue room: ${roomId}`);
    }

    return { ...venueRoom, room };
  }

  function travelCost(roomAId, roomBId) {
    if (roomAId === roomBId) return 0;

    const roomA = getVenueRoom(roomAId);
    const roomB = getVenueRoom(roomBId);

    if (roomA.floor === roomB.floor) {
      return Math.abs(roomA.distToStairs - roomB.distToStairs);
    }

    return roomA.distToStairs + config.STAIR_COST + roomB.distToStairs;
  }

  function packagePriority(packageName) {
    return config.PACKAGE_PRIORITY[packageName] || 0;
  }

  function routePoint(roomId) {
    const room = getVenueRoom(roomId);
    return {
      id: roomId,
      floor: room.floor,
      distToStairs: room.distToStairs,
    };
  }

  function pointTravelCost(pointA, pointB) {
    if (!pointA || !pointB) return 0;
    if (pointA.id === pointB.id) return 0;
    if (pointA.floor === pointB.floor) {
      return Math.abs(pointA.distToStairs - pointB.distToStairs);
    }
    return pointA.distToStairs + config.STAIR_COST + pointB.distToStairs;
  }

  function maxRoomBridge(roomIds) {
    const bridge = { cost: 0, roomA: null, roomB: null };

    for (let index = 0; index < roomIds.length; index += 1) {
      for (let compare = index + 1; compare < roomIds.length; compare += 1) {
        const cost = travelCost(roomIds[index], roomIds[compare]);
        if (cost > bridge.cost) {
          bridge.cost = cost;
          bridge.roomA = roomIds[index];
          bridge.roomB = roomIds[compare];
        }
      }
    }

    return bridge;
  }

  function estimatePrimaryRoute(videoClients) {
    const roomGroups = new Map();

    videoClients.forEach((client) => {
      if (!roomGroups.has(client.room)) roomGroups.set(client.room, []);
      roomGroups.get(client.room).push(client);
    });

    const roomIds = [...roomGroups.keys()];
    if (!roomIds.length) {
      return { metres: 0, priorityRoom: null, sequence: [], scoutStops: 0 };
    }

    const roomMeta = roomIds.map((roomId) => {
      const venue = getVenueRoom(roomId);
      const clients = roomGroups.get(roomId);
      return {
        id: roomId,
        floor: venue.floor,
        distToStairs: venue.distToStairs,
        priority: Math.max(...clients.map((client) => packagePriority(client.package))),
        clientCount: clients.length,
      };
    });
    const priorityRoom = [...roomMeta].sort(
      (roomA, roomB) =>
        roomB.priority - roomA.priority ||
        roomB.clientCount - roomA.clientCount ||
        roomB.distToStairs - roomA.distToStairs,
    )[0];
    const videoRoomSet = new Set(roomIds);
    const sequence = [];
    let currentPoint = null;
    let metres = 0;
    let scoutStops = 0;

    function visit(roomId, scout = false) {
      const nextPoint = routePoint(roomId);
      metres += pointTravelCost(currentPoint, nextPoint);
      currentPoint = nextPoint;
      sequence.push(roomId);
      if (scout) scoutStops += 1;
    }

    function roomById(roomId) {
      return roomMeta.find((room) => room.id === roomId);
    }

    visit(priorityRoom.id);

    const sameFloorFirstCycle = roomMeta
      .filter((room) => room.floor === priorityRoom.floor && room.id !== priorityRoom.id)
      .sort(
        (roomA, roomB) =>
          roomB.priority - roomA.priority ||
          Math.abs(roomA.distToStairs - currentPoint.distToStairs) -
            Math.abs(roomB.distToStairs - currentPoint.distToStairs),
      );
    sameFloorFirstCycle.forEach((room) => visit(room.id));

    const otherFloorFirstCycle = roomMeta.filter(
      (room) => room.floor !== priorityRoom.floor,
    );
    if (otherFloorFirstCycle.length) {
      if (otherFloorFirstCycle[0].floor === "ground") {
        if (!videoRoomSet.has("b086")) visit("b086", true);
        otherFloorFirstCycle
          .sort((roomA, roomB) => roomB.distToStairs - roomA.distToStairs)
          .forEach((room) => visit(room.id));
      } else {
        otherFloorFirstCycle
          .sort(
            (roomA, roomB) =>
              roomB.priority - roomA.priority ||
              roomA.distToStairs - roomB.distToStairs,
          )
          .forEach((room) => visit(room.id));
      }
    }

    const secondFloorRooms = roomIds
      .filter((roomId) => getVenueRoom(roomId).floor === "second")
      .sort(
        (roomA, roomB) =>
          getVenueRoom(roomA).distToStairs - getVenueRoom(roomB).distToStairs,
      );
    secondFloorRooms.forEach((roomId) => visit(roomId));
    if (secondFloorRooms.length) {
      metres += currentPoint.distToStairs;
      currentPoint = { id: "second-stairs", floor: "second", distToStairs: 0 };
    }

    const groundFloorRooms = roomIds
      .filter((roomId) => getVenueRoom(roomId).floor === "ground")
      .sort(
        (roomA, roomB) =>
          getVenueRoom(roomB).distToStairs - getVenueRoom(roomA).distToStairs,
      );
    if (groundFloorRooms.length) {
      if (!videoRoomSet.has("b086")) visit("b086", true);
      groundFloorRooms.forEach((roomId) => visit(roomId));
    }

    return {
      metres,
      priorityRoom: priorityRoom.id,
      sequence,
      scoutStops,
      roomMeta: roomIds.map(roomById),
    };
  }

  function computeRoundDifficulty(dayId, roundTime) {
    const model = config.COVERAGE_MODEL;
    const clients = data.clients.filter(
      (client) => client.day === dayId && client.round === roundTime,
    );
    const judges = clients.filter((client) => client.role === "Official event judge");
    const coverageClients = clients.filter((client) => client.role !== "Official event judge");
    const videoClients = coverageClients.filter((client) => client.package !== "Essential");
    const photoOnlyClients = coverageClients.filter((client) => client.package === "Essential");
    const videoCount = videoClients.length;
    const photoCount = photoOnlyClients.length;
    const occupiedRoomIds = [...new Set(coverageClients.map((client) => client.room))];
    const videoRoomIds = [...new Set(videoClients.map((client) => client.room))];
    const occupiedFloors = new Set(
      occupiedRoomIds.map((roomId) => getVenueRoom(roomId).floor),
    );
    const videoFloors = new Set(videoRoomIds.map((roomId) => getVenueRoom(roomId).floor));
    const route = estimatePrimaryRoute(videoClients);
    const bridge = maxRoomBridge(videoRoomIds);
    const photoBridge = maxRoomBridge(occupiedRoomIds);
    const routeMinutes = route.metres / model.RUN_METRES_PER_MINUTE;
    const videoServiceMinutes = videoClients.reduce(
      (total, client) => total + model.VIDEO_MINUTES_BY_PACKAGE[client.package],
      0,
    );
    const awardReserveMinutes =
      videoCount * model.AWARD_RESERVE_MINUTES_PER_VIDEO_CLIENT;
    const roomReentryMinutes =
      videoRoomIds.length * model.TARGET_ROOM_CYCLES * model.ROOM_REENTRY_MINUTES;
    const varietyReserveMinutes = videoCount ? model.VARIETY_RESERVE_MINUTES : 0;
    const judgeMinutes = judges.length * model.JUDGE_GRAB_MINUTES;
    const scoutMinutes = route.scoutStops * model.EMPTY_AUDITORIUM_SCOUT_MINUTES;
    const videoWorkloadMinutes =
      videoServiceMinutes +
      awardReserveMinutes +
      roomReentryMinutes +
      varietyReserveMinutes +
      judgeMinutes +
      scoutMinutes +
      routeMinutes;
    const primaryPressure = videoWorkloadMinutes / model.ROUND_WORK_MINUTES;
    const photoTravelMinutes = photoBridge.cost / model.RUN_METRES_PER_MINUTE;
    const photoWorkloadMinutes =
      coverageClients.length * model.PHOTO_MINUTES_PER_CLIENT + photoTravelMinutes;
    const photoPressure =
      photoWorkloadMinutes /
      (model.PHOTO_ROUND_MINUTES * config.TEAM.CLIENT_PHOTO_OPERATORS);
    const coordinationPressure =
      Math.max(0, coverageClients.length - config.CAMERA_COUNT) *
        model.COORDINATION_PER_EXTRA_CLIENT +
      Math.max(0, occupiedRoomIds.length - 2) * model.COORDINATION_PER_EXTRA_ROOM +
      (occupiedFloors.size > 1 ? model.CROSS_FLOOR_COORDINATION : 0);
    const ratio =
      primaryPressure + photoPressure * model.PHOTO_PRESSURE_SHARE + coordinationPressure;
    const nonCaptureMinutes =
      routeMinutes +
      roomReentryMinutes +
      varietyReserveMinutes +
      awardReserveMinutes +
      judgeMinutes +
      scoutMinutes;
    const primaryCaptureMinutes = Math.max(0, model.ROUND_WORK_MINUTES - nonCaptureMinutes);
    const primaryPassesPerClient = videoCount
      ? primaryCaptureMinutes / videoCount / model.VIDEO_VISIT_MINUTES
      : 0;
    const helperRequired =
      videoCount > 0 &&
      (ratio >= model.HELPER_REQUIRED_PRESSURE ||
        primaryPassesPerClient < model.MIN_DIVERSE_PASSES);
    const helperStandby =
      videoCount > 0 && !helperRequired && ratio >= model.HELPER_STANDBY_PRESSURE;
    const surgeVideoMinutes =
      model.ROUND_WORK_MINUTES * config.TEAM.SURGE_VIDEO_OPERATOR_SHARE;
    const supportedPassesPerClient = videoCount
      ? (primaryCaptureMinutes + (helperRequired ? surgeVideoMinutes : 0)) /
        videoCount /
        model.VIDEO_VISIT_MINUTES
      : 0;
    const quality =
      !videoCount
        ? { key: "photo-only", label: "Photo operation only" }
        : primaryPassesPerClient >= model.HEALTHY_DIVERSE_PASSES
          ? { key: "diverse", label: "Diverse repeat coverage likely" }
          : primaryPassesPerClient >= model.MIN_DIVERSE_PASSES
            ? { key: "disciplined", label: "Two-pass discipline needed" }
            : { key: "thin", label: "Single-pass coverage risk" };
    const helperMode = helperRequired
      ? { key: "required", label: "Second video recommended" }
      : helperStandby
        ? { key: "standby", label: "Video assist on standby" }
        : { key: "primary", label: "Primary video route" };
    const crossesFloors = videoFloors.size > 1;
    const level =
      config.LEVELS.find((item) => ratio <= item.maxRatio) ||
      config.LEVELS[config.LEVELS.length - 1];

    return {
      clients,
      judges,
      coverageClients,
      videoClients,
      photoOnlyClients,
      photoCount,
      videoCount,
      demand: videoServiceMinutes,
      occupiedRoomIds,
      videoRoomIds,
      floorCount: occupiedFloors.size,
      videoFloorCount: videoFloors.size,
      bridge,
      crossesFloors,
      route,
      routeMetres: route.metres,
      routeMinutes,
      videoServiceMinutes,
      videoWorkloadMinutes,
      photoWorkloadMinutes,
      photoPressure,
      coordinationPressure,
      primaryPressure,
      primaryPassesPerClient,
      supportedPassesPerClient,
      surgeVideoMinutes,
      helperRequired,
      helperStandby,
      helperMode,
      quality,
      load: videoWorkloadMinutes,
      ratio,
      overCapacity: helperRequired,
      level,
    };
  }

  window.computeRoundDifficulty = computeRoundDifficulty;

  function setDifficultyStyle(element, difficulty) {
    element.dataset.level = difficulty.level.key;
    element.style.setProperty("--difficulty-color", difficulty.level.color);
    element.style.setProperty(
      "--pressure-percent",
      `${difficulty.visualPercent ?? Math.min(100, (difficulty.ratio / config.METER_MAX_RATIO) * 100)}%`,
    );
  }

  function getDayPressureProfile(dayId) {
    const day = getDay(dayId);
    const entries = day.rounds.map((round) => ({
      round,
      difficulty: computeRoundDifficulty(dayId, round.time),
    }));
    const ranked = [...entries].sort(
      (entryA, entryB) =>
        entryB.difficulty.ratio - entryA.difficulty.ratio ||
        entryB.difficulty.clients.length - entryA.difficulty.clients.length,
    );
    const rankByTime = new Map(
      ranked.map((entry, index) => [entry.round.time, index + 1]),
    );
    const ratios = entries.map((entry) => entry.difficulty.ratio);
    const maximum = Math.max(...ratios, 0);
    const minimum = Math.min(...ratios);
    const spread = maximum - minimum;

    return entries.map((entry) => {
      const absolutePressure = Math.min(
        1,
        entry.difficulty.ratio / config.METER_MAX_RATIO,
      );
      const relativePressure = spread
        ? (entry.difficulty.ratio - minimum) / spread
        : absolutePressure;
      const visualPercent = entry.difficulty.clients.length
        ? Math.max(10, Math.round((absolutePressure * 0.68 + relativePressure * 0.32) * 100))
        : 0;

      return {
        ...entry,
        difficulty: {
          ...entry.difficulty,
          rank: rankByTime.get(entry.round.time),
          roundCount: entries.length,
          visualPercent,
        },
      };
    });
  }

  function bookedCountLabel(count) {
    return `${count} booked`;
  }

  function roomDisplayName(roomId) {
    const room = getRoom(roomId);
    return `${room.name} ${room.code}`;
  }

  function coveragePhrase(difficulty) {
    const parts = [];
    if (difficulty.videoCount) {
      parts.push(`${difficulty.videoCount} video client${difficulty.videoCount === 1 ? "" : "s"}`);
    }
    if (difficulty.photoCount) {
      parts.push(`${difficulty.photoCount} photo-only client${difficulty.photoCount === 1 ? "" : "s"}`);
    }

    let phrase = parts.join(" and ");
    if (difficulty.judges.length) {
      const judgePhrase = `${difficulty.judges.length} judge grab${difficulty.judges.length === 1 ? "" : "s"}`;
      phrase = phrase ? `${phrase} plus ${judgePhrase}` : judgePhrase;
    }
    return phrase;
  }

  function difficultySummary(difficulty) {
    if (!difficulty.clients.length) {
      return `${difficulty.level.label}: no booked clients this round, so all ${config.CAMERA_COUNT} cameras are free.`;
    }

    if (!difficulty.coverageClients.length) {
      return `${difficulty.level.label}: ${coveragePhrase(difficulty)} with no dedicated camera needed.`;
    }

    const coverage = coveragePhrase(difficulty);
    const roomCount = difficulty.occupiedRoomIds.length;
    const spread = difficulty.floorCount > 1
      ? `${roomCount} rooms across ${difficulty.floorCount} floors`
      : `${roomCount} room${roomCount === 1 ? "" : "s"} on one floor`;
    let passPhrase = "The assistants can stay fully on photos";

    if (difficulty.videoCount) {
      if (difficulty.primaryPassesPerClient >= 3) {
        passPhrase = "Three or more varied video passes each are realistic";
      } else if (difficulty.primaryPassesPerClient >= 2) {
        passPhrase = "Two varied video passes each are realistic";
      } else if (difficulty.primaryPassesPerClient >= 1) {
        passPhrase = "Plan one deliberate video pass per client";
      } else {
        passPhrase = "Some clients risk receiving only a flash video pass";
      }
    }

    return `${difficulty.level.label}: ${coverage} in ${spread}. ${passPhrase}.`;
  }

  function splitNeededMessage(difficulty, roundPlan) {
    if (roundPlan?.neckCam) {
      return "Neck cam planned: Iulian owns the split floor while Constantin protects the anchor.";
    }
    if (difficulty.helperRequired) {
      return "Second video recommended: give Iulian the stabilised neck camera for this round.";
    }
    if (difficulty.helperStandby) {
      return "Video assist on standby: keep the stabilised camera ready for Iulian.";
    }
    return "Crew plan: June hunts booked stills while Iulian keeps full-field photo volume.";
  }

  function routeSummary(difficulty) {
    if (!difficulty.videoCount || !difficulty.route.priorityRoom) {
      return "No dedicated video route required.";
    }
    if (difficulty.routeMetres < 10) {
      return `Hold ${roomDisplayName(difficulty.route.priorityRoom)} · no room change required`;
    }
    const routeMetres = Math.round(difficulty.routeMetres / 10) * 10;
    return `Start ${roomDisplayName(difficulty.route.priorityRoom)} · approximately ${routeMetres} m over two coverage cycles`;
  }

  function updateUrl() {
    const params = new URLSearchParams();
    params.set("day", state.day);
    params.set("round", state.round);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }

  function makeButton(className, text, selected, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(selected));
    button.innerHTML = text;
    button.addEventListener("click", onClick);
    return button;
  }

  function renderControls() {
    elements.dayTabs.replaceChildren();
    data.days.forEach((day) => {
      elements.dayTabs.append(
        makeButton("day-button", day.label, day.id === state.day, () => {
          if (state.day === day.id) return;
          state.day = day.id;
          state.round = day.rounds[0].time;
          render();
        }),
      );
    });

    elements.roundTabs.replaceChildren();
    elements.dayHeatStrip.replaceChildren();
    getDayPressureProfile(state.day).forEach(({ round, difficulty }) => {
      const roundPlan = getRoundPlan(state.day, round.time);
      const label = `
        ${roundPlan?.neckCam ? '<span class="round-neck-cam" title="Neck cam planned">NC</span>' : ""}
        <span class="round-button-label">${round.label}</span>
        <strong class="round-button-time">${round.time}</strong>
        <span class="round-difficulty-meta">
          <i class="difficulty-shape" aria-hidden="true"></i>
          <span>${difficulty.level.shortLabel || difficulty.level.label}</span>
          <b>#${difficulty.rank} · ${bookedCountLabel(difficulty.clients.length)}</b>
        </span>
        <span class="round-pressure-track" aria-hidden="true"><i></i></span>
      `;
      const roundButton = makeButton("round-button", label, round.time === state.round, () => {
        if (state.round === round.time) return;
        state.round = round.time;
        render();
      });
      setDifficultyStyle(roundButton, difficulty);
      if (roundPlan?.neckCam) roundButton.dataset.neckCam = "true";
      roundButton.setAttribute(
        "aria-label",
        `${round.label}, ${round.time}, ${difficulty.level.label}, ${bookedCountLabel(difficulty.clients.length)}, difficulty rank ${difficulty.rank} of ${difficulty.roundCount}${roundPlan?.neckCam ? ", neck cam planned" : ""}`,
      );
      elements.roundTabs.append(roundButton);

      const heatCell = document.createElement("button");
      heatCell.type = "button";
      heatCell.className = "heat-cell";
      heatCell.setAttribute("aria-pressed", String(round.time === state.round));
      heatCell.setAttribute(
        "aria-label",
        `${round.time}, ${difficulty.level.label}, ${bookedCountLabel(difficulty.clients.length)}, difficulty rank ${difficulty.rank} of ${difficulty.roundCount}${roundPlan?.neckCam ? ", neck cam planned" : ""}`,
      );
      setDifficultyStyle(heatCell, difficulty);
      if (roundPlan?.neckCam) heatCell.dataset.neckCam = "true";
      heatCell.innerHTML = `
        <span class="heat-cell-time">${round.time}<span>${roundPlan?.neckCam ? '<em class="neck-cam-mini">NC</em>' : ""}<b>#${difficulty.rank}</b></span></span>
        <span class="heat-bar" aria-hidden="true"><i></i></span>
        <span class="heat-cell-level"><i class="difficulty-shape" aria-hidden="true"></i>${difficulty.level.shortLabel || difficulty.level.label}</span>
        <span class="heat-cell-count">${difficulty.clients.length} booked · ${difficulty.videoCount} video</span>
      `;
      heatCell.addEventListener("click", () => {
        if (state.round === round.time) return;
        state.round = round.time;
        render();
      });
      elements.dayHeatStrip.append(heatCell);
    });
  }

  function initials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function findOfficialEntry(client) {
    return data.schedule.find(
      (entry) =>
        entry.day === client.day &&
        entry.round === client.round &&
        entry.room === client.room &&
        normalize(entry.name) === normalize(client.officialName),
    );
  }

  function formatRosterAppearances(appearances) {
    const groups = new Map();

    appearances.forEach((appearance) => {
      const key = `${appearance.day}|${appearance.room}`;
      if (!groups.has(key)) {
        groups.set(key, {
          day: appearance.day.toUpperCase(),
          room: getRoom(appearance.room).code,
          times: [],
        });
      }
      groups.get(key).times.push(appearance.round);
    });

    return [...groups.values()]
      .map((group) => `${group.day} ${group.times.join("/")} · ${group.room}`)
      .join("<br>");
  }

  function makeClientCard(client, options = {}) {
    const appearances = options.appearances || null;
    const officialEntry = findOfficialEntry(client);
    const card = document.createElement("article");
    const tier = client.package.toLowerCase();
    card.className = "client-card";
    card.dataset.tier = tier;
    if (appearances) card.classList.add("roster-card");

    const appearanceLabel = appearances
      ? `${appearances.length} booked appearance${appearances.length === 1 ? "" : "s"}`
      : `${client.category}, ${client.round}`;
    card.setAttribute("aria-label", `${client.name}, ${client.package}, ${appearanceLabel}`);

    if (options.interactive !== false) {
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-haspopup", "dialog");
      card.addEventListener("click", () => openCardOverlay(client, appearances));
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openCardOverlay(client, appearances);
      });
    }

    const inner = document.createElement("div");
    inner.className = "client-card-inner";

    const ribbon = document.createElement("span");
    ribbon.className = "booked-ribbon";
    ribbon.textContent = client.role === "Official event judge" ? "JUDGE" : "BOOKED";

    const portraitFrame = document.createElement("div");
    portraitFrame.className = "portrait-frame";

    const fallback = document.createElement("span");
    fallback.className = "portrait-fallback";
    fallback.textContent = initials(client.name);
    fallback.setAttribute("aria-hidden", "true");

    const image = document.createElement("img");
    image.src = `img/${client.portrait}`;
    image.alt = `${client.name} portrait`;
    image.loading = "eager";
    image.addEventListener("load", () => {
      card.classList.add("portrait-loaded");
      card.classList.remove("portrait-missing");
    });
    image.addEventListener("error", () => card.classList.add("portrait-missing"));

    const copy = document.createElement("div");
    copy.className = "card-copy";
    const categories = appearances
      ? [...new Set(appearances.map((appearance) => appearance.category))]
      : [client.category];
    const categoryText = categories.length > 1
      ? `${categories.length} categories`
      : categories[0];
    const roundText = appearances
      ? `${appearances.length} slot${appearances.length === 1 ? "" : "s"}`
      : client.round;
    const tableText = appearances
      ? formatRosterAppearances(appearances)
      : officialEntry?.table
        ? `Official schedule · Table ${officialEntry.table}`
        : client.role || "Confirmed coverage client";
    copy.innerHTML = `
      ${tier === "signature" ? '<span class="signature-mark" aria-hidden="true">◆</span>' : ""}
      <h5>${client.name}</h5>
      <span class="card-package">${client.package}</span>
      <div class="card-details">
        <span>${categoryText}</span>
        <strong>${roundText}</strong>
        <span class="card-table">${tableText}</span>
      </div>
    `;

    portraitFrame.append(fallback, image);
    inner.append(ribbon, portraitFrame, copy);
    card.append(inner);
    return card;
  }

  function syncBodyLock() {
    document.body.classList.toggle(
      "modal-open",
      !cardOverlay.hidden || !rosterOverlay.hidden,
    );
  }

  function openCardOverlay(client, appearances = null) {
    window.clearTimeout(cardOverlayTimer);
    cardReturnFocus = document.activeElement;
    const enlargedCard = makeClientCard(client, {
      appearances,
      interactive: false,
    });
    enlargedCard.classList.add("card-zoom-card");
    const zoomStage = document.createElement("div");
    zoomStage.className = "card-zoom-stage";
    zoomStage.append(enlargedCard);
    cardOverlay.replaceChildren(zoomStage);
    cardOverlay.setAttribute(
      "aria-label",
      `${client.name} enlarged card. Tap anywhere or press Escape to close.`,
    );
    cardOverlay.hidden = false;
    syncBodyLock();
    window.requestAnimationFrame(() => cardOverlay.classList.add("is-open"));
    cardOverlay.focus();
  }

  function closeCardOverlay() {
    if (cardOverlay.hidden) return;
    cardOverlay.classList.remove("is-open");
    cardOverlayTimer = window.setTimeout(() => {
      cardOverlay.hidden = true;
      cardOverlay.replaceChildren();
      syncBodyLock();
      if (cardReturnFocus?.isConnected) cardReturnFocus.focus();
    }, 140);
  }

  function getRosterGroups() {
    const people = new Map();

    data.clients
      .filter((client) => !state.videoIncludedOnly || client.package !== "Essential")
      .forEach((client) => {
        const key = normalize(client.officialName);
        if (!people.has(key)) {
          people.set(key, { client, appearances: [] });
        }
        people.get(key).appearances.push(client);
      });

    const packageOrder = ["Signature", "Showcase", "Authority", "Essential"];
    return packageOrder
      .map((packageName) => ({
        packageName,
        people: [...people.values()]
          .filter((person) => person.client.package === packageName)
          .sort((personA, personB) => personA.client.name.localeCompare(personB.client.name)),
      }))
      .filter((group) => group.people.length);
  }

  function renderRoster() {
    rosterContent.replaceChildren();

    getRosterGroups().forEach((group) => {
      const section = document.createElement("section");
      section.className = "roster-section";
      section.dataset.tier = group.packageName.toLowerCase();

      const heading = document.createElement("header");
      heading.className = "roster-section-heading";
      heading.innerHTML = `
        <h3>${group.packageName}</h3>
        <span>${group.people.length} client${group.people.length === 1 ? "" : "s"}</span>
      `;

      const grid = document.createElement("div");
      grid.className = "roster-grid";
      group.people.forEach((person) => {
        grid.append(makeClientCard(person.client, { appearances: person.appearances }));
      });

      section.append(heading, grid);
      rosterContent.append(section);
    });
  }

  function openRoster() {
    window.clearTimeout(rosterOverlayTimer);
    rosterReturnFocus = document.activeElement;
    renderRoster();
    rosterOverlay.hidden = false;
    syncBodyLock();
    window.requestAnimationFrame(() => rosterOverlay.classList.add("is-open"));
    rosterClose.focus();
  }

  function closeRoster() {
    if (rosterOverlay.hidden) return;
    rosterOverlay.classList.remove("is-open");
    rosterOverlayTimer = window.setTimeout(() => {
      rosterOverlay.hidden = true;
      syncBodyLock();
      if (rosterReturnFocus?.isConnected) rosterReturnFocus.focus();
    }, 140);
  }

  function makeParticipantMarker(entry) {
    const marker = document.createElement("div");
    marker.className = "participant-marker";
    marker.title = `${entry.name} · ${entry.country} · ${entry.category}`;
    marker.innerHTML = `
      <span class="table-number">T${entry.table}</span>
      <strong>${entry.name}</strong>
      <small>${entry.country}</small>
    `;
    return marker;
  }

  function isPromotedParticipant(entry, clients) {
    return clients.some((client) => normalize(client.officialName) === normalize(entry.name));
  }

  function makeRoom(room) {
    const bookedClients = data.clients.filter(
      (client) => client.day === state.day && client.round === state.round && client.room === room.id,
    );
    const clients = state.videoIncludedOnly
      ? bookedClients.filter((client) => client.package !== "Essential")
      : bookedClients;
    const officialEntries = data.schedule.filter(
      (entry) => entry.day === state.day && entry.round === state.round && entry.room === room.id,
    );
    const neutralEntries = officialEntries.filter(
      (entry) => !isPromotedParticipant(entry, bookedClients),
    );
    const visibleCount = clients.length + (state.showField ? neutralEntries.length : 0);

    const article = document.createElement("article");
    article.className = "room";
    article.dataset.room = room.id;

    const header = document.createElement("header");
    header.className = "room-header";
    header.innerHTML = `
      <div class="room-title">
        <span class="room-code">${room.code}</span>
        <div>
          <h4>${room.name}</h4>
          <p>${room.floorLabel}</p>
        </div>
      </div>
      <p class="room-count">${officialEntries.length} scheduled</p>
    `;

    const body = document.createElement("div");
    body.className = "room-body";

    clients.forEach((client) => body.append(makeClientCard(client)));

    if (state.showField && neutralEntries.length) {
      if (clients.length) {
        const note = document.createElement("span");
        note.className = "field-note";
        note.textContent = "Also in this room";
        body.append(note);
      }
      neutralEntries.forEach((entry) => body.append(makeParticipantMarker(entry)));
    }

    if (!visibleCount) {
      const empty = document.createElement("p");
      empty.className = "room-empty";
      if (state.videoIncludedOnly && bookedClients.length && !clients.length) {
        empty.textContent = "No video-included clients this round";
      } else {
        empty.textContent = officialEntries.length && !state.showField
          ? "No booked clients this round"
          : "No competitors scheduled";
      }
      body.append(empty);
    }

    article.append(header, body);
    return article;
  }

  function renderRoundBriefing(roundPlan) {
    const doctrine = data.doctrine
      .map((rule, index) => `<span><b>0${index + 1}</b>${rule}</span>`)
      .join("");
    const cameraPlan = data.crew
      .map((member) => {
        const neckCamOperator = member.id === "iulian" && roundPlan.neckCam;
        return `
          <article class="camera-assignment" data-camera="${member.id}" data-neck-cam="${neckCamOperator}">
            <header>
              <span>${member.camera}</span>
              <div>
                <h4>${member.name}</h4>
                <small>${neckCamOperator ? "Stabilised neck-cam video" : member.role}</small>
              </div>
            </header>
            <p>${roundPlan.assignments[member.id]}</p>
          </article>
        `;
      })
      .join("");
    const tips = roundPlan.tips
      .map((tip) => `<li><i aria-hidden="true"></i>${tip}</li>`)
      .join("");

    elements.roundBriefing.dataset.neckCam = String(roundPlan.neckCam);
    elements.roundBriefing.setAttribute("aria-labelledby", "round-briefing-heading");
    elements.roundBriefing.innerHTML = `
      <header class="briefing-header">
        <div>
          <p class="eyebrow">Round playbook · ${roundPlan.callout}</p>
          <h3 id="round-briefing-heading">${roundPlan.title}</h3>
        </div>
        <span class="neck-cam-status" data-active="${roundPlan.neckCam}">
          <i aria-hidden="true"></i>${roundPlan.neckCam ? "Neck cam on" : "Neck cam off"}
        </span>
      </header>
      <div class="doctrine-strip" aria-label="Standing filming rules">${doctrine}</div>
      <div class="briefing-command">
        <section class="briefing-anchor">
          <span>Anchor</span>
          <strong>${roundPlan.anchor}</strong>
          <p>${roundPlan.objective}</p>
        </section>
        <section class="briefing-loop">
          <span>Loop order</span>
          <strong>${roundPlan.loop}</strong>
        </section>
      </div>
      <div class="camera-plan" aria-label="Camera assignments">${cameraPlan}</div>
      <ul class="briefing-tips">${tips}</ul>
    `;
  }

  function renderVenue() {
    const day = getDay(state.day);
    const pressureEntry = getDayPressureProfile(state.day).find(
      (entry) => entry.round.time === state.round,
    );
    const round = pressureEntry.round;
    const difficulty = pressureEntry.difficulty;
    const roundPlan = getRoundPlan(state.day, state.round);
    const filledSegments = difficulty.visualPercent > 0
      ? Math.max(1, Math.ceil((difficulty.visualPercent / 100) * config.METER_SEGMENTS))
      : 0;
    const meterSegments = Array.from({ length: config.METER_SEGMENTS }, (_, index) =>
      `<i class="${index < Math.min(config.METER_SEGMENTS, filledSegments) ? "is-filled" : ""}"></i>`,
    ).join("");
    const splitMessage = splitNeededMessage(difficulty, roundPlan);
    const plannedSecondVideo = roundPlan.neckCam;
    const helperDisplayKey = plannedSecondVideo ? "required" : difficulty.helperMode.key;
    const iulianLabel = plannedSecondVideo
      ? "Neck-cam video"
      : difficulty.helperRequired
        ? "Second video"
        : difficulty.helperStandby
          ? "Video standby"
          : "Volume photos";

    elements.videoFilterButton.setAttribute(
      "aria-pressed",
      String(state.videoIncludedOnly),
    );
    elements.videoFilterButton.setAttribute(
      "aria-label",
      state.videoIncludedOnly
        ? "Showing video-included clients only. Show all booked clients"
        : "Show video-included clients only",
    );

    setDifficultyStyle(elements.activeRound, difficulty);
    elements.activeRound.style.setProperty("--meter-segments", config.METER_SEGMENTS);
    elements.activeRound.innerHTML = `
      <div class="active-round-top">
        <div class="active-round-time">
          <span>${day.shortLabel} · ${round.label}</span>
          <strong>${round.time}</strong>
        </div>
        <span class="difficulty-badge"><i class="difficulty-shape" aria-hidden="true"></i>${difficulty.level.label}</span>
        <span class="pressure-rank"><b>#${difficulty.rank}</b> ${difficulty.rank === 1 ? "hardest today" : `of ${difficulty.roundCount} today`}</span>
        <span class="coverage-quality" data-quality="${difficulty.quality.key}">${difficulty.quality.label}</span>
      </div>
      <div class="pressure-meter-heading"><span>Coverage pressure</span><strong>#${difficulty.rank} today</strong></div>
      <div class="difficulty-meter" aria-label="Coverage pressure: ${difficulty.level.label}, rank ${difficulty.rank} of ${difficulty.roundCount}">${meterSegments}</div>
      <p class="difficulty-summary">${difficultySummary(difficulty)}</p>
      <div class="crew-strip" data-helper="${helperDisplayKey}" aria-label="Crew allocation">
        <span><b>C1</b>${config.TEAM.PRIMARY_VIDEO_NAME} · Cinema</span>
        <span><b>C2</b>${config.TEAM.VOLUME_PHOTO_NAME} · ${iulianLabel}</span>
        <span><b>C3</b>${config.TEAM.CLIENT_PHOTO_NAME} · Client stills</span>
      </div>
      <p class="route-note">${routeSummary(difficulty)}</p>
      <p class="split-needed" data-helper="${helperDisplayKey}"><i aria-hidden="true"></i>${splitMessage}</p>
    `;

    renderRoundBriefing(roundPlan);

    elements.secondFloor.replaceChildren();
    elements.groundFloor.replaceChildren();

    data.rooms.forEach((room) => {
      const target = room.floor === "second" ? elements.secondFloor : elements.groundFloor;
      target.append(makeRoom(room));
    });
  }

  function render() {
    renderControls();
    renderVenue();
    updateUrl();
  }

  elements.fieldToggle.addEventListener("change", () => {
    state.showField = elements.fieldToggle.checked;
    renderVenue();
  });

  elements.allClientsButton.addEventListener("click", openRoster);
  elements.videoFilterButton.addEventListener("click", () => {
    state.videoIncludedOnly = !state.videoIncludedOnly;
    renderVenue();
  });
  cardOverlay.addEventListener("click", closeCardOverlay);
  rosterClose.addEventListener("click", closeRoster);
  rosterOverlay.addEventListener("click", (event) => {
    if (event.target === rosterOverlay) closeRoster();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!cardOverlay.hidden) {
      closeCardOverlay();
    } else if (!rosterOverlay.hidden) {
      closeRoster();
    }
  });

  render();
})();
