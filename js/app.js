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

  function computeRoundDifficulty(dayId, roundTime) {
    const clients = data.clients.filter(
      (client) => client.day === dayId && client.round === roundTime,
    );
    const judges = clients.filter((client) => client.role === "Official event judge");
    const coverageClients = clients.filter((client) => client.role !== "Official event judge");
    let photoCount = 0;
    let videoCount = 0;
    let coverageDemand = 0;
    let tierBump = 0;

    coverageClients.forEach((client) => {
      const photoOnly = client.package === "Essential";
      const weight = photoOnly ? config.PHOTO_WEIGHT : config.VIDEO_WEIGHT;
      coverageDemand += weight;
      tierBump += config.TIER_BUMP[client.package] || 0;
      if (photoOnly) photoCount += 1;
      else videoCount += 1;
    });

    const demand = coverageDemand + tierBump + judges.length * config.JUDGE_WEIGHT;
    const occupiedRoomIds = [...new Set(coverageClients.map((client) => client.room))];
    const occupiedFloors = new Set(
      occupiedRoomIds.map((roomId) => getVenueRoom(roomId).floor),
    );
    const bridge = { cost: 0, roomA: null, roomB: null };

    for (let index = 0; index < occupiedRoomIds.length; index += 1) {
      for (let compare = index + 1; compare < occupiedRoomIds.length; compare += 1) {
        const roomA = occupiedRoomIds[index];
        const roomB = occupiedRoomIds[compare];
        const cost = travelCost(roomA, roomB);
        if (cost > bridge.cost) {
          const venueA = getVenueRoom(roomA);
          const venueB = getVenueRoom(roomB);
          const swapForReading =
            (venueA.floor === venueB.floor && venueA.distToStairs > venueB.distToStairs) ||
            (venueA.floor === "ground" && venueB.floor === "second");
          bridge.cost = cost;
          bridge.roomA = swapForReading ? roomB : roomA;
          bridge.roomB = swapForReading ? roomA : roomB;
        }
      }
    }

    // Tier nudges and opportunistic judge grabs shape the level without
    // manufacturing an extra dedicated camera.
    const camerasNeeded = Math.max(occupiedRoomIds.length, Math.ceil(coverageDemand));
    const travelPressure = Math.max(1, camerasNeeded / config.CAMERA_COUNT);
    const travelLoad =
      (bridge.cost / config.METRES_PER_UNIT) * config.BRIDGE_WEIGHT * travelPressure;
    const load = demand + travelLoad;
    const ratio = load / config.CAMERA_COUNT;
    const bridgeRooms = bridge.roomA && bridge.roomB
      ? [getVenueRoom(bridge.roomA), getVenueRoom(bridge.roomB)]
      : [];
    const crossesFloors =
      bridgeRooms.length === 2 && bridgeRooms[0].floor !== bridgeRooms[1].floor;
    const reachesFarAuditorium =
      bridgeRooms.length === 2 &&
      [bridge.roomA, bridge.roomB].includes("b086") &&
      bridge.cost >= config.FAR_GAP_METRES;
    const overCapacity =
      camerasNeeded > config.CAMERA_COUNT || crossesFloors || reachesFarAuditorium;
    const level =
      config.LEVELS.find((item) => ratio <= item.maxRatio) ||
      config.LEVELS[config.LEVELS.length - 1];

    return {
      clients,
      judges,
      coverageClients,
      photoCount,
      videoCount,
      demand,
      occupiedRoomIds,
      floorCount: occupiedFloors.size,
      bridge,
      crossesFloors,
      camerasNeeded,
      load,
      ratio,
      overCapacity,
      level,
    };
  }

  window.computeRoundDifficulty = computeRoundDifficulty;

  function setDifficultyStyle(element, difficulty) {
    element.dataset.level = difficulty.level.key;
    element.style.setProperty("--difficulty-color", difficulty.level.color);
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
      parts.push(`${difficulty.photoCount} photo client${difficulty.photoCount === 1 ? "" : "s"}`);
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
    const rooms = difficulty.occupiedRoomIds;
    let spread;

    if (rooms.length === 1) {
      spread = `in ${roomDisplayName(rooms[0])}`;
    } else if (difficulty.floorCount > 1) {
      spread = `across ${difficulty.floorCount} floors`;
    } else {
      const floor = getVenueRoom(rooms[0]).floor === "second" ? "second-floor" : "ground-floor";
      spread = `across ${rooms.length} ${floor} rooms`;
    }

    if (!difficulty.bridge.roomA) {
      return `${difficulty.level.label}: ${coverage} ${spread}, with no room change.`;
    }

    const route = difficulty.crossesFloors ? "via the stairs" : "along the hallway";
    return `${difficulty.level.label}: ${coverage} ${spread}, longest hop ${roomDisplayName(difficulty.bridge.roomA)} to ${roomDisplayName(difficulty.bridge.roomB)} (~${Math.round(difficulty.bridge.cost)} m ${route}).`;
  }

  function splitNeededMessage(difficulty) {
    if (!difficulty.overCapacity) return "";
    if (difficulty.bridge.roomA) {
      return `Split needed: hold ${roomDisplayName(difficulty.bridge.roomA)} and ${roomDisplayName(difficulty.bridge.roomB)} with separate operators.`;
    }
    return `Split needed: assign ${difficulty.camerasNeeded} camera positions for this round.`;
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
    getDay(state.day).rounds.forEach((round) => {
      const difficulty = computeRoundDifficulty(state.day, round.time);
      const label = `
        <span class="round-button-label">${round.label}</span>
        <strong class="round-button-time">${round.time}</strong>
        <span class="round-difficulty-meta">
          <i class="difficulty-shape" aria-hidden="true"></i>
          <span>${difficulty.level.shortLabel || difficulty.level.label}</span>
          <b>${bookedCountLabel(difficulty.clients.length)}</b>
        </span>
      `;
      const roundButton = makeButton("round-button", label, round.time === state.round, () => {
        if (state.round === round.time) return;
        state.round = round.time;
        render();
      });
      setDifficultyStyle(roundButton, difficulty);
      roundButton.setAttribute(
        "aria-label",
        `${round.label}, ${round.time}, ${difficulty.level.label}, ${bookedCountLabel(difficulty.clients.length)}`,
      );
      elements.roundTabs.append(roundButton);

      const heatCell = document.createElement("button");
      const heatPercent = Math.min(100, (difficulty.ratio / config.METER_MAX_RATIO) * 100);
      heatCell.type = "button";
      heatCell.className = "heat-cell";
      heatCell.setAttribute("aria-pressed", String(round.time === state.round));
      heatCell.setAttribute(
        "aria-label",
        `${round.time}, ${difficulty.level.label}, ${bookedCountLabel(difficulty.clients.length)}`,
      );
      heatCell.style.setProperty("--difficulty-heat", `${Math.max(difficulty.clients.length ? 18 : 8, heatPercent)}%`);
      setDifficultyStyle(heatCell, difficulty);
      heatCell.innerHTML = `
        <span class="heat-cell-time">${round.time}</span>
        <span class="heat-bar" aria-hidden="true"><i></i></span>
        <span class="heat-cell-level"><i class="difficulty-shape" aria-hidden="true"></i>${difficulty.level.shortLabel || difficulty.level.label}</span>
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

  function renderVenue() {
    const day = getDay(state.day);
    const round = day.rounds.find((item) => item.time === state.round);
    const difficulty = computeRoundDifficulty(state.day, state.round);
    const filledSegments = difficulty.ratio > 0
      ? Math.max(1, Math.ceil((difficulty.ratio / config.METER_MAX_RATIO) * config.METER_SEGMENTS))
      : 0;
    const meterSegments = Array.from({ length: config.METER_SEGMENTS }, (_, index) =>
      `<i class="${index < Math.min(config.METER_SEGMENTS, filledSegments) ? "is-filled" : ""}"></i>`,
    ).join("");
    const splitMessage = splitNeededMessage(difficulty);

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
      </div>
      <div class="difficulty-meter" aria-label="Difficulty meter: ${difficulty.level.label}">${meterSegments}</div>
      <p class="difficulty-summary">${difficultySummary(difficulty)}</p>
      ${splitMessage ? `<p class="split-needed"><i aria-hidden="true"></i>${splitMessage}</p>` : ""}
    `;

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
