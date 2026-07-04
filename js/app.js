(() => {
  "use strict";

  const data = window.BOARD_DATA;
  const config = window.BOARD_CONFIG;
  const i18n = window.BOARD_I18N;
  const quickBriefs = window.BOARD_QUICK;

  if (!data) {
    throw new Error("BOARD_DATA is missing. Check js/data.js.");
  }

  if (!config) {
    throw new Error("BOARD_CONFIG is missing. Check js/data.js.");
  }

  if (!i18n) {
    throw new Error("BOARD_I18N is missing. Check js/data.js.");
  }

  if (!quickBriefs) {
    throw new Error("BOARD_QUICK is missing. Check js/data.js.");
  }

  const elements = {
    brandHome: document.querySelector("#brand-home"),
    eventEyebrow: document.querySelector("#event-eyebrow"),
    eventTitle: document.querySelector("#event-title"),
    eventMeta: document.querySelector("#event-meta"),
    scheduleStatus: document.querySelector("#schedule-status"),
    languageLabel: document.querySelector("#language-label"),
    languageSelect: document.querySelector("#language-select"),
    controlDeck: document.querySelector("#control-deck"),
    chooseDayLabel: document.querySelector("#choose-day-label"),
    chooseRoundLabel: document.querySelector("#choose-round-label"),
    dayTabs: document.querySelector("#day-tabs"),
    roundTabs: document.querySelector("#round-tabs"),
    dayHeatStrip: document.querySelector("#day-heat-strip"),
    fieldToggle: document.querySelector("#field-toggle"),
    fieldToggleTitle: document.querySelector("#field-toggle-title"),
    fieldToggleSubtitle: document.querySelector("#field-toggle-subtitle"),
    allClientsButton: document.querySelector("#all-clients-button"),
    eventScheduleButton: document.querySelector("#event-schedule-button"),
    venueEyebrow: document.querySelector("#venue-eyebrow"),
    venueHeading: document.querySelector("#venue-heading"),
    videoFilterButton: document.querySelector("#video-filter-button"),
    videoFilterLabel: document.querySelector("#video-filter-label"),
    activeRound: document.querySelector("#active-round"),
    quickCommand: document.querySelector("#quick-command"),
    roundBriefing: document.querySelector("#round-briefing"),
    secondFloorLabel: document.querySelector("#second-floor-label"),
    secondFloorSubtitle: document.querySelector("#second-floor-subtitle"),
    secondFloorHeading: document.querySelector("#second-floor-heading"),
    secondFloor: document.querySelector("#second-floor"),
    stairsBridge: document.querySelector(".stair-bridge"),
    stairsLabel: document.querySelector("#stairs-label"),
    stairsSubtitle: document.querySelector("#stairs-subtitle"),
    groundFloorLabel: document.querySelector("#ground-floor-label"),
    groundFloorSubtitle: document.querySelector("#ground-floor-subtitle"),
    groundFloorHeading: document.querySelector("#ground-floor-heading"),
    groundFloor: document.querySelector("#ground-floor"),
    footerSchedule: document.querySelector("#footer-schedule"),
    footerBuiltFor: document.querySelector("#footer-built-for"),
    databaseButton: document.querySelector("#database-button"),
    easiestButton: document.querySelector("#easiest-button"),
    financeButton: document.querySelector("#finance-button"),
  };

  const urlState = new URLSearchParams(window.location.search);
  const initialDay = data.days.some((day) => day.id === urlState.get("day"))
    ? urlState.get("day")
    : data.days[0].id;
  const requestedRound = urlState.get("round");
  const initialRound = getDay(initialDay).rounds.some((round) => round.time === requestedRound)
    ? requestedRound
    : getDay(initialDay).rounds[0].time;
  const savedLanguage = (() => {
    try {
      return window.localStorage.getItem("coverage-board-language");
    } catch {
      return null;
    }
  })();
  const initialLanguage = Object.hasOwn(i18n, savedLanguage) ? savedLanguage : "en";
  const defaultRoleByLanguage = {
    en: "constantin",
    ro: "iulian",
    th: "june",
  };
  const savedRole = (() => {
    try {
      return window.localStorage.getItem("coverage-board-role");
    } catch {
      return null;
    }
  })();
  const crewIds = data.crew.map((member) => member.id);
  const hasSavedRole = crewIds.includes(savedRole);

  const state = {
    day: initialDay,
    round: initialRound,
    showField: true,
    videoIncludedOnly: false,
    language: initialLanguage,
    role: hasSavedRole ? savedRole : defaultRoleByLanguage[initialLanguage],
    rolePinned: hasSavedRole,
    briefingExpanded: false,
    easiestSortMode: "fit",
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

  const eventScheduleOverlay = document.createElement("div");
  eventScheduleOverlay.className = "event-schedule-overlay";
  eventScheduleOverlay.hidden = true;
  eventScheduleOverlay.innerHTML = `
    <section class="event-schedule-panel" role="dialog" aria-modal="true" aria-labelledby="event-schedule-heading">
      <header class="event-schedule-header">
        <div>
          <p class="eyebrow" id="event-schedule-eyebrow">Official programme</p>
          <h2 id="event-schedule-heading">Full event schedule</h2>
        </div>
        <button class="event-schedule-close" type="button" aria-label="Close event schedule">Close</button>
      </header>
      <div class="event-schedule-content" id="event-schedule-content"></div>
    </section>
  `;

  const databaseOverlay = document.createElement("div");
  databaseOverlay.className = "database-overlay";
  databaseOverlay.hidden = true;
  databaseOverlay.innerHTML = `
    <section class="database-panel" role="dialog" aria-modal="true" aria-labelledby="database-heading">
      <header class="database-header">
        <div>
          <p class="eyebrow" id="database-eyebrow">Sales check</p>
          <h2 id="database-heading">Competition database</h2>
        </div>
        <button class="database-close" type="button" aria-label="Close database">Close</button>
      </header>
      <div class="database-content">
        <label class="database-search-label" for="database-search">
          <span id="database-search-label">Search participant</span>
          <input id="database-search" type="search" autocomplete="off" placeholder="Type a name">
        </label>
        <p class="database-hint" id="database-hint">Tap a predicted name to check whether that person lands in calm or difficult rounds.</p>
        <div class="database-suggestions" id="database-suggestions"></div>
        <div class="database-result" id="database-result"></div>
      </div>
    </section>
  `;

  const easiestOverlay = document.createElement("div");
  easiestOverlay.className = "easiest-overlay";
  easiestOverlay.hidden = true;
  easiestOverlay.innerHTML = `
    <section class="easiest-panel" role="dialog" aria-modal="true" aria-labelledby="easiest-heading">
      <header class="easiest-header">
        <div>
          <p class="eyebrow" id="easiest-eyebrow">Sales targets</p>
          <h2 id="easiest-heading">Easiest additions</h2>
        </div>
        <button class="easiest-close" type="button" aria-label="Close easiest additions">Close</button>
      </header>
      <div class="easiest-content" id="easiest-content"></div>
    </section>
  `;

  const financeOverlay = document.createElement("div");
  financeOverlay.className = "finance-overlay";
  financeOverlay.hidden = true;
  financeOverlay.innerHTML = `
    <section class="finance-panel" role="dialog" aria-modal="true" aria-labelledby="finance-heading">
      <header class="finance-header">
        <div>
          <p class="eyebrow" id="finance-eyebrow">Confidential</p>
          <h2 id="finance-heading">Private totals</h2>
        </div>
        <button class="finance-close" type="button" aria-label="Close private totals">Close</button>
      </header>
      <div class="finance-content">
        <form class="finance-gate" id="finance-gate">
          <label class="database-search-label" for="finance-password">
            <span id="finance-password-label">Password</span>
            <input id="finance-password" type="password" autocomplete="off" placeholder="Private password">
          </label>
          <p class="database-hint" id="finance-hint">Enter the private password to see gross income, expenses, and net income.</p>
          <p class="finance-error" id="finance-error" hidden>Wrong password</p>
          <button class="database-button finance-unlock" id="finance-unlock" type="submit">Unlock totals</button>
        </form>
        <div class="finance-body" id="finance-body" hidden></div>
      </div>
    </section>
  `;

  document.body.append(cardOverlay, rosterOverlay, eventScheduleOverlay, databaseOverlay, easiestOverlay, financeOverlay);

  const rosterContent = rosterOverlay.querySelector("#roster-content");
  const rosterClose = rosterOverlay.querySelector(".roster-close");
  const eventScheduleContent = eventScheduleOverlay.querySelector("#event-schedule-content");
  const eventScheduleClose = eventScheduleOverlay.querySelector(".event-schedule-close");
  const databaseClose = databaseOverlay.querySelector(".database-close");
  const databaseSearch = databaseOverlay.querySelector("#database-search");
  const databaseSuggestions = databaseOverlay.querySelector("#database-suggestions");
  const databaseResult = databaseOverlay.querySelector("#database-result");
  const easiestClose = easiestOverlay.querySelector(".easiest-close");
  const easiestContent = easiestOverlay.querySelector("#easiest-content");
  const financeClose = financeOverlay.querySelector(".finance-close");
  const financeGate = financeOverlay.querySelector("#finance-gate");
  const financePassword = financeOverlay.querySelector("#finance-password");
  const financeError = financeOverlay.querySelector("#finance-error");
  const financeUnlock = financeOverlay.querySelector("#finance-unlock");
  const financeBody = financeOverlay.querySelector("#finance-body");
  let cardOverlayTimer;
  let rosterOverlayTimer;
  let eventScheduleOverlayTimer;
  let databaseOverlayTimer;
  let easiestOverlayTimer;
  let financeOverlayTimer;
  let cardReturnFocus;
  let rosterReturnFocus;
  let eventScheduleReturnFocus;
  let databaseReturnFocus;
  let easiestReturnFocus;
  let financeReturnFocus;
  let financeUnlocked = false;
  let selectedDatabasePerson = null;

  function languagePack() {
    return i18n[state.language] || i18n.en;
  }

  function t(key, values = {}) {
    const template = languagePack().ui[key] ?? i18n.en.ui[key] ?? key;
    return Object.entries(values).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      template,
    );
  }

  function levelLabel(levelKey, short = false) {
    const group = short ? "levelShort" : "levels";
    return languagePack()[group]?.[levelKey] ?? i18n.en[group][levelKey] ?? levelKey;
  }

  function qualityLabel(qualityKey) {
    const keyByQuality = {
      "photo-only": "photoOperationOnly",
      diverse: "diverseLikely",
      disciplined: "twoPassNeeded",
      thin: "singlePassRisk",
    };
    return t(keyByQuality[qualityKey] || "primaryVideoRoute");
  }

  function localizedRoomName(room) {
    return languagePack().rooms?.[room.id] || room.name;
  }

  function localizedFloorLabel(floor) {
    return floor === "second" ? t("secondFloor") : t("groundFloor");
  }

  function localizedCategory(category) {
    return languagePack().categories?.[category] || category;
  }

  function localizedCountry(country) {
    return languagePack().countries?.[country] || country;
  }

  function localizedDay(day) {
    if (day.id === "sat") {
      return { label: t("satLabel"), shortLabel: t("satShort"), mini: t("satMini") };
    }
    return { label: t("sunLabel"), shortLabel: t("sunShort"), mini: t("sunMini") };
  }

  function localizedRoundLabel(day, round) {
    if (round.label === "Wellness final") return t("wellnessFinal");
    const roundIndex = day.rounds.findIndex((candidate) => candidate.time === round.time);
    return `${t("round")} ${roundIndex + 1}`;
  }

  function localizedRoundPlan(dayId, roundTime) {
    const plan = getRoundPlan(dayId, roundTime);
    const translated = languagePack().plans?.[`${dayId}-${roundTime}`];

    if (!translated) return plan;

    return {
      ...plan,
      ...translated,
      assignments: {
        ...plan.assignments,
        ...translated.assignments,
      },
      tips: translated.tips || plan.tips,
    };
  }

  function localizedQuickBrief(dayId, roundTime, roleId) {
    const languageBriefs = quickBriefs[state.language] || quickBriefs.en;
    return languageBriefs?.[`${dayId}-${roundTime}`]?.[roleId]
      || quickBriefs.en?.[`${dayId}-${roundTime}`]?.[roleId];
  }

  function localizedDoctrine() {
    return languagePack().doctrine || data.doctrine;
  }

  function localizedCrewRole(member, neckCamOperator) {
    if (neckCamOperator) return t("stabilisedNeckCamVideo");
    if (member.id === "constantin") return t("cinemaVideo");
    if (member.id === "iulian") return t("volumePhoto");
    return t("targetedPhoto");
  }

  function setText(element, value) {
    if (element) element.textContent = value;
  }

  function applyStaticTranslations() {
    const pack = languagePack();
    document.documentElement.lang = pack.lang;
    document.title = t("pageTitle");
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("metaDescription"));
    elements.brandHome.setAttribute("aria-label", t("brandHome"));
    setText(elements.eventEyebrow, t("liveCoverageControl"));
    setText(elements.eventTitle, t("eventTitle"));
    setText(elements.eventMeta, t("eventMeta"));
    setText(elements.scheduleStatus, t("scheduleLocked"));
    setText(elements.languageLabel, t("language"));
    elements.languageSelect.value = state.language;
    elements.controlDeck.setAttribute("aria-label", t("scheduleControls"));
    setText(elements.chooseDayLabel, t("chooseDay"));
    setText(elements.chooseRoundLabel, t("chooseRound"));
    elements.dayTabs.setAttribute("aria-label", t("eventDay"));
    elements.roundTabs.setAttribute("aria-label", t("roundTime"));
    elements.dayHeatStrip.setAttribute("aria-label", t("dayDifficulty"));
    setText(elements.fieldToggleTitle, t("fullField"));
    setText(elements.fieldToggleSubtitle, t("showEveryCompetitor"));
    setText(elements.allClientsButton, t("allClients"));
    setText(elements.eventScheduleButton, t("eventSchedule"));
    setText(elements.venueEyebrow, t("venueMap"));
    setText(elements.venueHeading, t("coveragePositions"));
    elements.roundBriefing.setAttribute("aria-label", t("roundPlaybook"));
    elements.quickCommand.setAttribute("aria-label", t("yourJobNow"));
    setText(elements.secondFloorLabel, t("secondFloor"));
    setText(elements.secondFloorSubtitle, t("fourRooms"));
    setText(elements.secondFloorHeading, t("secondFloorRooms"));
    setText(elements.videoFilterLabel, t("videoIncluded"));
    setText(elements.stairsLabel, t("stairs"));
    setText(elements.stairsSubtitle, t("groundFloorBelow"));
    elements.stairsBridge.setAttribute("aria-label", t("stairsBetween"));
    setText(elements.groundFloorLabel, t("groundFloor"));
    setText(elements.groundFloorSubtitle, t("groundRoomsSubtitle"));
    setText(elements.groundFloorHeading, t("groundFloorRooms"));
    setText(elements.footerSchedule, t("footerSchedule"));
    setText(elements.footerBuiltFor, t("builtFor"));
    setText(elements.databaseButton, t("database"));
    setText(elements.easiestButton, t("easiestAdditions"));
    setText(elements.financeButton, t("privateTotals"));
    setText(rosterOverlay.querySelector(".roster-header .eyebrow"), t("bookedCoverage"));
    setText(rosterOverlay.querySelector("#roster-heading"), t("allClients"));
    setText(rosterClose, t("close"));
    rosterClose.setAttribute("aria-label", t("closeAllClients"));
    setText(eventScheduleOverlay.querySelector("#event-schedule-eyebrow"), t("eventScheduleEyebrow"));
    setText(eventScheduleOverlay.querySelector("#event-schedule-heading"), t("eventScheduleTitle"));
    setText(eventScheduleClose, t("close"));
    eventScheduleClose.setAttribute("aria-label", t("closeEventSchedule"));
    setText(databaseOverlay.querySelector("#database-eyebrow"), t("databaseEyebrow"));
    setText(databaseOverlay.querySelector("#database-heading"), t("databaseTitle"));
    setText(databaseOverlay.querySelector("#database-search-label"), t("databaseSearchLabel"));
    setText(databaseOverlay.querySelector("#database-hint"), t("databaseHint"));
    databaseSearch.placeholder = t("databasePlaceholder");
    setText(databaseClose, t("close"));
    databaseClose.setAttribute("aria-label", t("closeDatabase"));
    setText(easiestOverlay.querySelector("#easiest-eyebrow"), t("easiestEyebrow"));
    setText(easiestOverlay.querySelector("#easiest-heading"), t("easiestTitle"));
    setText(easiestClose, t("close"));
    easiestClose.setAttribute("aria-label", t("closeEasiest"));
    setText(financeOverlay.querySelector("#finance-eyebrow"), t("financeEyebrow"));
    setText(financeOverlay.querySelector("#finance-heading"), t("financeTitle"));
    setText(financeOverlay.querySelector("#finance-password-label"), t("financePasswordLabel"));
    setText(financeOverlay.querySelector("#finance-hint"), t("financeHint"));
    setText(financeError, t("financeError"));
    setText(financeUnlock, t("unlockFinance"));
    financePassword.placeholder = t("financePasswordPlaceholder");
    setText(financeClose, t("close"));
    financeClose.setAttribute("aria-label", t("closeFinance"));
  }

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
    const farthestGroundRoomId = Object.entries(config.VENUE)
      .filter(([, room]) => room.floor === "ground")
      .sort(([, roomA], [, roomB]) => roomB.distToStairs - roomA.distToStairs)[0]?.[0];
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

    function scoutFarthestGroundIfEmpty() {
      if (farthestGroundRoomId && !videoRoomSet.has(farthestGroundRoomId)) {
        visit(farthestGroundRoomId, true);
      }
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
        scoutFarthestGroundIfEmpty();
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
      scoutFarthestGroundIfEmpty();
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

  function computeRoundDifficulty(dayId, roundTime, extraClients = []) {
    const model = config.COVERAGE_MODEL;
    const clients = data.clients.concat(extraClients).filter(
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
    if (state.language === "ro") {
      return `${count} ${count === 1 ? "rezervat" : "rezervați"}`;
    }
    if (state.language === "th") {
      return `${count} จอง`;
    }
    return `${count} ${t("booked")}`;
  }

  function roomDisplayName(roomId) {
    const room = getRoom(roomId);
    return `${localizedRoomName(room)} ${room.code}`;
  }

  function coveragePhrase(difficulty) {
    const parts = [];
    const judgeCount = difficulty.judges.length;

    if (state.language === "ro") {
      if (difficulty.videoCount) {
        parts.push(`${difficulty.videoCount} ${difficulty.videoCount === 1 ? "client video" : "clienți video"}`);
      }
      if (difficulty.photoCount) {
        parts.push(`${difficulty.photoCount} ${difficulty.photoCount === 1 ? "client doar foto" : "clienți doar foto"}`);
      }
      let phrase = parts.join(" și ");
      if (judgeCount) {
        const judgePhrase = `${judgeCount} ${judgeCount === 1 ? "oprire la jurat" : "opriri la jurați"}`;
        phrase = phrase ? `${phrase} plus ${judgePhrase}` : judgePhrase;
      }
      return phrase;
    }

    if (state.language === "th") {
      if (difficulty.videoCount) parts.push(`${difficulty.videoCount} ลูกค้าวิดีโอ`);
      if (difficulty.photoCount) parts.push(`${difficulty.photoCount} ลูกค้าภาพนิ่งเท่านั้น`);
      let phrase = parts.join(" และ ");
      if (judgeCount) {
        const judgePhrase = `${judgeCount} จุดเก็บภาพกรรมการ`;
        phrase = phrase ? `${phrase} รวม ${judgePhrase}` : judgePhrase;
      }
      return phrase;
    }

    if (difficulty.videoCount) {
      parts.push(`${difficulty.videoCount} video client${difficulty.videoCount === 1 ? "" : "s"}`);
    }
    if (difficulty.photoCount) {
      parts.push(`${difficulty.photoCount} photo-only client${difficulty.photoCount === 1 ? "" : "s"}`);
    }

    let phrase = parts.join(" and ");
    if (judgeCount) {
      const judgePhrase = `${judgeCount} judge grab${judgeCount === 1 ? "" : "s"}`;
      phrase = phrase ? `${phrase} plus ${judgePhrase}` : judgePhrase;
    }
    return phrase;
  }

  function difficultySummary(difficulty) {
    const level = levelLabel(difficulty.level.key);

    if (state.language === "ro") {
      if (!difficulty.clients.length) {
        return `${level}: nu sunt clienți rezervați în această rundă. Toate cele ${config.CAMERA_COUNT} camere sunt libere.`;
      }
      if (!difficulty.coverageClients.length) {
        return `${level}: ${coveragePhrase(difficulty)}. Nu este nevoie de o cameră dedicată.`;
      }

      const roomCount = difficulty.occupiedRoomIds.length;
      const spread = difficulty.floorCount > 1
        ? `${roomCount} săli pe ${difficulty.floorCount} etaje`
        : `${roomCount} ${roomCount === 1 ? "sală" : "săli"} la același etaj`;
      let passPhrase = "June și Iulian pot rămâne complet pe fotografii";

      if (difficulty.videoCount) {
        if (difficulty.primaryPassesPerClient >= 3) {
          passPhrase = "Sunt posibile cel puțin trei vizite video diferite pentru fiecare client";
        } else if (difficulty.primaryPassesPerClient >= 2) {
          passPhrase = "Sunt posibile două vizite video diferite pentru fiecare client";
        } else if (difficulty.primaryPassesPerClient >= 1) {
          passPhrase = "Planifică o vizită video clară pentru fiecare client";
        } else {
          passPhrase = "Unii clienți riscă să primească doar o vizită video foarte scurtă";
        }
      }

      return `${level}: ${coveragePhrase(difficulty)} în ${spread}. ${passPhrase}.`;
    }

    if (state.language === "th") {
      if (!difficulty.clients.length) {
        return `${level}: รอบนี้ไม่มีลูกค้าที่จอง กล้องทั้ง ${config.CAMERA_COUNT} ตัวว่าง`;
      }
      if (!difficulty.coverageClients.length) {
        return `${level}: ${coveragePhrase(difficulty)} ไม่ต้องใช้กล้องประจำ`;
      }

      const roomCount = difficulty.occupiedRoomIds.length;
      const spread = difficulty.floorCount > 1
        ? `${roomCount} ห้อง บน ${difficulty.floorCount} ชั้น`
        : `${roomCount} ห้อง ในชั้นเดียว`;
      let passPhrase = "June และ Iulian ทำงานภาพนิ่งได้เต็มที่";

      if (difficulty.videoCount) {
        if (difficulty.primaryPassesPerClient >= 3) {
          passPhrase = "มีเวลาถ่ายวิดีโอต่างช่วงอย่างน้อยสามครั้งต่อคน";
        } else if (difficulty.primaryPassesPerClient >= 2) {
          passPhrase = "มีเวลาถ่ายวิดีโอต่างช่วงสองครั้งต่อคน";
        } else if (difficulty.primaryPassesPerClient >= 1) {
          passPhrase = "วางแผนถ่ายวิดีโอให้ครบคนละหนึ่งช่วง";
        } else {
          passPhrase = "ลูกค้าบางคนเสี่ยงได้วิดีโอเพียงช่วงสั้นมาก";
        }
      }

      return `${level}: ${coveragePhrase(difficulty)} ใน ${spread} ${passPhrase}`;
    }

    if (!difficulty.clients.length) {
      return `${level}: no booked clients this round, so all ${config.CAMERA_COUNT} cameras are free.`;
    }

    if (!difficulty.coverageClients.length) {
      return `${level}: ${coveragePhrase(difficulty)} with no dedicated camera needed.`;
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

    return `${level}: ${coverage} in ${spread}. ${passPhrase}.`;
  }

  function splitNeededMessage(difficulty, roundPlan) {
    if (state.language === "ro") {
      if (roundPlan?.neckCam) {
        return "A doua cameră este pregătită: June face clipuri scurte pe etajul separat, iar Constantin protejează punctul principal. Iulian rămâne pe volum și clienți foto.";
      }
      if (difficulty.helperRequired) {
        return "Este recomandată a doua cameră video: June o folosește periodic pentru clipuri scurte.";
      }
      if (difficulty.helperStandby) {
        return "Ajutor video pregătit: a doua cameră trebuie să fie gata pentru June.";
      }
      return "Plan echipă: June urmărește clienții, iar Iulian face volum și clienți foto.";
    }

    if (state.language === "th") {
      if (roundPlan?.neckCam) {
        return "เตรียมกล้องตัวที่สอง: June ถ่ายคลิปสั้นเป็นช่วงๆ ที่อีกชั้น ส่วน Constantin ดูจุดหลัก และ Iulian ถ่ายภาพทุกคนกับลูกค้าภาพนิ่ง";
      }
      if (difficulty.helperRequired) {
        return "ควรใช้กล้องวิดีโอตัวที่สอง: June ใช้ถ่ายคลิปสั้นเป็นช่วงๆ";
      }
      if (difficulty.helperStandby) {
        return "เตรียมช่วยวิดีโอ: เตรียมกล้องกันสั่นไว้ให้ June";
      }
      return "แผนทีม: June ตามลูกค้า ส่วน Iulian ถ่ายภาพทุกคนและลูกค้าภาพนิ่ง";
    }

    if (roundPlan?.neckCam) {
      return "Secondary camera ready: June takes periodic short clips on the split floor while Constantin protects the anchor. Iulian stays on volume and photo clients.";
    }
    if (difficulty.helperRequired) {
      return "Second video recommended: June uses the secondary camera periodically for short clips.";
    }
    if (difficulty.helperStandby) {
      return "Video assist on standby: keep the stabilised camera ready for June.";
    }
    return "Crew plan: June hunts booked stills while Iulian keeps full-field volume and photo clients.";
  }

  function routeSummary(difficulty) {
    if (!difficulty.videoCount || !difficulty.route.priorityRoom) {
      if (state.language === "ro") return "Nu este nevoie de o rută video dedicată.";
      if (state.language === "th") return "ไม่ต้องมีเส้นทางวิดีโอเฉพาะ";
      return "No dedicated video route required.";
    }
    if (difficulty.routeMetres < 10) {
      if (state.language === "ro") {
        return `Rămâi în ${roomDisplayName(difficulty.route.priorityRoom)} · nu este nevoie să schimbi sala`;
      }
      if (state.language === "th") {
        return `อยู่ที่ ${roomDisplayName(difficulty.route.priorityRoom)} · ไม่ต้องเปลี่ยนห้อง`;
      }
      return `Hold ${roomDisplayName(difficulty.route.priorityRoom)} · no room change required`;
    }
    const routeMetres = Math.round(difficulty.routeMetres / 10) * 10;
    if (state.language === "ro") {
      return `Începe în ${roomDisplayName(difficulty.route.priorityRoom)} · aproximativ ${routeMetres} m în două tururi`;
    }
    if (state.language === "th") {
      return `เริ่มที่ ${roomDisplayName(difficulty.route.priorityRoom)} · ประมาณ ${routeMetres} เมตร ในการวนสองรอบ`;
    }
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
      const dayText = localizedDay(day);
      elements.dayTabs.append(
        makeButton("day-button", dayText.label, day.id === state.day, () => {
          if (state.day === day.id) return;
          state.day = day.id;
          state.round = day.rounds[0].time;
          state.briefingExpanded = false;
          render();
        }),
      );
    });

    elements.roundTabs.replaceChildren();
    elements.dayHeatStrip.replaceChildren();
    getDayPressureProfile(state.day).forEach(({ round, difficulty }) => {
      const roundPlan = getRoundPlan(state.day, round.time);
      const day = getDay(state.day);
      const roundText = localizedRoundLabel(day, round);
      const difficultyLabel = levelLabel(difficulty.level.key);
      const difficultyShort = levelLabel(difficulty.level.key, true);
      const label = `
        ${roundPlan?.neckCam ? `<span class="round-neck-cam" title="${t("neckCamPlanned")}">2ND</span>` : ""}
        <span class="round-button-label">${roundText}</span>
        <strong class="round-button-time">${round.time}</strong>
        <span class="round-difficulty-meta">
          <i class="difficulty-shape" aria-hidden="true"></i>
          <span>${difficultyShort}</span>
          <b>#${difficulty.rank} · ${bookedCountLabel(difficulty.clients.length)}</b>
        </span>
        <span class="round-pressure-track" aria-hidden="true"><i></i></span>
      `;
      const roundButton = makeButton("round-button", label, round.time === state.round, () => {
        if (state.round === round.time) return;
        state.round = round.time;
        state.briefingExpanded = false;
        render();
      });
      setDifficultyStyle(roundButton, difficulty);
      if (roundPlan?.neckCam) roundButton.dataset.neckCam = "true";
      roundButton.setAttribute(
        "aria-label",
        `${roundText}, ${round.time}, ${difficultyLabel}, ${bookedCountLabel(difficulty.clients.length)}, ${t("difficultyRank")} ${difficulty.rank} ${t("ofToday", { count: difficulty.roundCount })}${roundPlan?.neckCam ? `, ${t("neckCamPlanned")}` : ""}`,
      );
      elements.roundTabs.append(roundButton);

      const heatCell = document.createElement("button");
      heatCell.type = "button";
      heatCell.className = "heat-cell";
      heatCell.setAttribute("aria-pressed", String(round.time === state.round));
      heatCell.setAttribute(
        "aria-label",
        `${round.time}, ${difficultyLabel}, ${bookedCountLabel(difficulty.clients.length)}, ${t("difficultyRank")} ${difficulty.rank} ${t("ofToday", { count: difficulty.roundCount })}${roundPlan?.neckCam ? `, ${t("neckCamPlanned")}` : ""}`,
      );
      setDifficultyStyle(heatCell, difficulty);
      if (roundPlan?.neckCam) heatCell.dataset.neckCam = "true";
      heatCell.innerHTML = `
        <span class="heat-cell-time">${round.time}<span>${roundPlan?.neckCam ? '<em class="neck-cam-mini">2ND</em>' : ""}<b>#${difficulty.rank}</b></span></span>
        <span class="heat-bar" aria-hidden="true"><i></i></span>
        <span class="heat-cell-level"><i class="difficulty-shape" aria-hidden="true"></i>${difficultyShort}</span>
        <span class="heat-cell-count">${bookedCountLabel(difficulty.clients.length)} · ${difficulty.videoCount} ${t("video")}</span>
      `;
      heatCell.addEventListener("click", () => {
        if (state.round === round.time) return;
        state.round = round.time;
        state.briefingExpanded = false;
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
        const day = getDay(appearance.day);
        groups.set(key, {
          day: localizedDay(day).mini,
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
      ? `${appearances.length} ${t("bookedAppearances")}`
      : `${localizedCategory(client.category)}, ${client.round}`;
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
    ribbon.textContent = client.role === "Official event judge"
      ? t("judgeRibbon")
      : t("bookedRibbon");

    const portraitFrame = document.createElement("div");
    portraitFrame.className = "portrait-frame";

    const fallback = document.createElement("span");
    fallback.className = "portrait-fallback";
    fallback.textContent = initials(client.name);
    fallback.setAttribute("aria-hidden", "true");

    const image = document.createElement("img");
    image.src = `img/${client.portrait}`;
    image.alt = `${client.name} ${t("portrait")}`;
    image.loading = "eager";
    image.addEventListener("load", () => {
      card.classList.add("portrait-loaded");
      card.classList.remove("portrait-missing");
    });
    image.addEventListener("error", () => card.classList.add("portrait-missing"));

    const copy = document.createElement("div");
    copy.className = "card-copy";
    const categories = appearances
      ? [...new Set(appearances.map((appearance) => localizedCategory(appearance.category)))]
      : [client.category];
    const categoryText = categories.length > 1
      ? `${categories.length} ${t("categories")}`
      : localizedCategory(categories[0]);
    const roundText = appearances
      ? `${appearances.length} ${t("slots")}`
      : client.round;
    const tableText = appearances
      ? formatRosterAppearances(appearances)
      : officialEntry?.table
        ? `${t("officialSchedule")} · ${t("table")} ${officialEntry.table}`
        : client.role === "Official event judge"
          ? t("officialJudge")
          : t("confirmedClient");
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
      !cardOverlay.hidden || !rosterOverlay.hidden || !eventScheduleOverlay.hidden || !databaseOverlay.hidden || !easiestOverlay.hidden || !financeOverlay.hidden,
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
      `${client.name} ${t("enlargedCard")}. ${t("tapClose")}`,
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
        <span>${group.people.length} ${group.people.length === 1 ? t("client") : t("clients")}</span>
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

  function renderEventSchedule() {
    const days = data.eventProgram || [];
    eventScheduleContent.innerHTML = `
      <p class="event-schedule-hint">${escapeHtml(t("eventScheduleHint"))}</p>
      <div class="event-schedule-days">
        ${days.map((day) => `
          <article class="event-day-card" data-day="${escapeHtml(day.id)}">
            <header>
              <span>${escapeHtml(day.date)}</span>
              <h3>${escapeHtml(day.label)}</h3>
            </header>
            <ol class="event-timeline">
              ${(day.items || []).map((item) => `
                <li data-type="${escapeHtml(item.type || "general")}">
                  <time>${escapeHtml(item.time)}</time>
                  <div>
                    <strong>${escapeHtml(item.title)}</strong>
                    ${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}
                  </div>
                </li>
              `).join("")}
            </ol>
          </article>
        `).join("")}
      </div>
    `;
  }

  function openEventSchedule() {
    window.clearTimeout(eventScheduleOverlayTimer);
    eventScheduleReturnFocus = document.activeElement;
    renderEventSchedule();
    eventScheduleOverlay.hidden = false;
    syncBodyLock();
    window.requestAnimationFrame(() => eventScheduleOverlay.classList.add("is-open"));
    eventScheduleClose.focus();
  }

  function closeEventSchedule() {
    if (eventScheduleOverlay.hidden) return;
    eventScheduleOverlay.classList.remove("is-open");
    eventScheduleOverlayTimer = window.setTimeout(() => {
      eventScheduleOverlay.hidden = true;
      syncBodyLock();
      if (eventScheduleReturnFocus?.isConnected) eventScheduleReturnFocus.focus();
    }, 140);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    }[character]));
  }

  function bookedAppearanceKey(item) {
    return [
      normalize(item.officialName || item.name),
      item.day,
      item.round,
      item.room,
    ].join("|");
  }

  function scheduleOrder(entry) {
    const dayIndex = data.days.findIndex((day) => day.id === entry.day);
    const roundIndex = getDay(entry.day).rounds.findIndex((round) => round.time === entry.round);
    const roomIndex = data.rooms.findIndex((room) => room.id === entry.room);
    return dayIndex * 1000 + roundIndex * 100 + roomIndex * 10 + Number(entry.table || 0);
  }

  function getDatabasePeople() {
    const people = new Map();

    data.schedule.forEach((entry) => {
      const key = normalize(entry.name);
      if (!people.has(key)) {
        people.set(key, {
          key,
          name: entry.name,
          countries: new Set(),
          categories: new Set(),
          entries: [],
        });
      }

      const person = people.get(key);
      person.countries.add(entry.country);
      person.categories.add(entry.category);
      person.entries.push(entry);
    });

    const bookedNames = new Set(data.clients.map((client) => normalize(client.officialName)));

    return [...people.values()]
      .map((person) => ({
        ...person,
        countries: [...person.countries],
        categories: [...person.categories],
        entries: person.entries.sort((entryA, entryB) => scheduleOrder(entryA) - scheduleOrder(entryB)),
        alreadyBooked: bookedNames.has(person.key),
      }))
      .sort((personA, personB) => personA.name.localeCompare(personB.name));
  }

  function getDatabasePerson(key) {
    return getDatabasePeople().find((person) => person.key === key) || null;
  }

  function unbookedEntriesForPerson(person) {
    const bookedKeys = new Set(data.clients.map(bookedAppearanceKey));
    return person.entries.filter((entry) => !bookedKeys.has(bookedAppearanceKey(entry)));
  }

  function candidateClientsForPerson(person, packageName) {
    return unbookedEntriesForPerson(person).map((entry, index) => ({
      id: `candidate-${packageName.toLowerCase()}-${person.key}-${index}`,
      name: entry.name,
      officialName: entry.name,
      package: packageName,
      day: entry.day,
      round: entry.round,
      room: entry.room,
      category: entry.category,
      portrait: "",
    }));
  }

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function fitLabel(score) {
    if (score >= 80) return t("easyAdd");
    if (score >= 64) return t("manageableAdd");
    if (score >= 44) return t("tightAdd");
    return t("hardAdd");
  }

  function fitTone(score) {
    if (score >= 78) return "green";
    if (score >= 52) return "orange";
    return "red";
  }

  function fitColor(score) {
    if (score >= 78) return "#45c6b8";
    if (score >= 52) return "#e58a3a";
    return "#d94a35";
  }

  function splitCountryMarketParts(country) {
    return String(country || "")
      .split(/\s*&\s*|\s+and\s+|,\s*/i)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function countryMarketScore(country) {
    const market = config.MARKET_PRICING || {};
    const scores = market.COUNTRY_SCORES || {};

    if (Object.hasOwn(scores, country)) return scores[country];

    const parts = splitCountryMarketParts(country);
    const partScores = parts
      .filter((part) => Object.hasOwn(scores, part))
      .map((part) => scores[part]);

    if (partScores.length) {
      return Math.round(partScores.reduce((sum, score) => sum + score, 0) / partScores.length);
    }

    return market.DEFAULT_SCORE || 52;
  }

  function personMarketProfile(person) {
    const countries = person.countries.length ? person.countries : [""];
    const countryScores = countries.map((country) => ({
      country,
      score: countryMarketScore(country),
    }));
    const score = Math.round(
      countryScores.reduce((sum, entry) => sum + entry.score, 0) / countryScores.length,
    );
    const strongest = [...countryScores].sort((entryA, entryB) => entryB.score - entryA.score)[0];

    return {
      score,
      strongestCountry: strongest?.country || "",
      tone: fitTone(score),
    };
  }

  function marketFitScore(row) {
    const market = config.MARKET_PRICING || {};
    const fitWeight = market.FIT_WEIGHT ?? 0.68;
    const marketWeight = market.MARKET_WEIGHT ?? 0.27;
    const photoWeight = market.PHOTO_WEIGHT ?? 0.05;
    const videoFit = row.videoImpact.score;
    const photoFit = row.photoImpact.score;
    const marketScore = row.marketProfile.score;
    const fitGate =
      videoFit < 52 ? -18 :
        videoFit < 64 ? -8 :
          videoFit < 78 ? -2 : 0;

    return clamp(
      Math.round(
        videoFit * fitWeight +
          marketScore * marketWeight +
          photoFit * photoWeight +
          fitGate,
      ),
      3,
      99,
    );
  }

  function detailChronology(detail) {
    const dayIndex = data.days.findIndex((day) => day.id === detail.dayId);
    const roundIndex = getDay(detail.dayId).rounds.findIndex(
      (round) => round.time === detail.roundTime,
    );
    return dayIndex * 100 + roundIndex;
  }

  function roundFitScore(detail, isPhotoOnly) {
    const after = detail.after;
    const totalClients = detail.totalAfterAdd;
    const videoCount = after.videoCount;
    const roomCount = after.occupiedRoomIds.length;
    const easyVideoCapacity = config.CAMERA_COUNT * 3;
    const difficultRankPenalty = detail.rank === 1 ? 2 : detail.rank === 2 ? 1 : 0;

    if (isPhotoOnly) {
      const crowdPenalty =
        Math.max(0, totalClients - 10) * 1.4 +
        Math.max(0, totalClients - 16) * 5.5;
      const roomPenalty = Math.max(0, roomCount - 4) * 2;
      const floorPenalty = after.floorCount > 1 ? 2 : 0;
      const pressurePenalty = Math.max(0, after.ratio - 0.9) * 8;
      const rankPenalty = detail.rank === 1 ? 2 : detail.rank === 2 ? 1 : 0;

      return clamp(
        Math.round(98 - crowdPenalty - roomPenalty - floorPenalty - pressurePenalty - rankPenalty),
        8,
        99,
      );
    }

    const normalLoadPenalty = Math.max(0, videoCount - config.CAMERA_COUNT) * 0.8;
    const overflowPenalty = Math.max(0, videoCount - easyVideoCapacity) * 18;
    const totalCrowdPenalty = Math.max(0, totalClients - easyVideoCapacity - 2) * 1.5;
    const roomPenalty = Math.max(0, roomCount - config.CAMERA_COUNT) * 2.5;
    const floorPenalty = after.videoFloorCount > 1 ? 3 : 0;
    const routePenalty =
      after.routeMetres > 900 ? 5 :
        after.routeMetres > 650 ? 4 :
          after.routeMetres > 380 ? 2 : 0;
    const helperPenalty = after.helperRequired ? 2 : after.helperStandby ? 1 : 0;
    const qualityPenalty =
      after.quality.key === "thin" ? 6 :
        after.quality.key === "disciplined" ? 1 : 0;
    const deltaPenalty = Math.max(0, detail.delta) * 8;

    return clamp(
      Math.round(
        96 -
          normalLoadPenalty -
          overflowPenalty -
          totalCrowdPenalty -
          roomPenalty -
          floorPenalty -
          routePenalty -
          helperPenalty -
          qualityPenalty -
          deltaPenalty -
          difficultRankPenalty,
      ),
      5,
      99,
    );
  }

  function computeDatabaseImpact(person, packageName) {
    const additions = candidateClientsForPerson(person, packageName);

    if (!additions.length) {
      return {
        packageName,
        score: 100,
        label: t("alreadyBooked"),
        tone: "green",
        fitColor: "#45c6b8",
        noNewImpact: true,
        details: [],
        worst: null,
      };
    }

    const roundKeys = [...new Set(additions.map((client) => `${client.day}|${client.round}`))];
    const details = roundKeys.map((key) => {
      const [dayId, roundTime] = key.split("|");
      const roundAdditions = additions.filter(
        (client) => client.day === dayId && client.round === roundTime,
      );
      const profileEntry = getDayPressureProfile(dayId).find(
        (entry) => entry.round.time === roundTime,
      );
      const before = computeRoundDifficulty(dayId, roundTime);
      const after = computeRoundDifficulty(dayId, roundTime, roundAdditions);

      return {
        dayId,
        roundTime,
        before,
        after,
        rank: profileEntry?.difficulty.rank || 1,
        delta: Math.max(0, after.ratio - before.ratio),
        additions: roundAdditions,
        otherBookedCount: before.coverageClients.length,
        totalAfterAdd: after.coverageClients.length,
      };
    });

    const isPhotoOnly = packageName === "Essential";
    const scoredDetails = details.map((detail) => ({
      ...detail,
      roundScore: roundFitScore(detail, isPhotoOnly),
    }));
    const worst = [...scoredDetails].sort(
      (detailA, detailB) =>
        detailA.roundScore - detailB.roundScore ||
        detailB.after.ratio - detailA.after.ratio ||
        detailChronology(detailA) - detailChronology(detailB),
    )[0];
    const multiRoundPenalty = Math.max(0, scoredDetails.length - 1) * (isPhotoOnly ? 0.5 : 1);
    const score = clamp(
      Math.round(Math.min(...scoredDetails.map((detail) => detail.roundScore)) - multiRoundPenalty),
      3,
      99,
    );

    return {
      packageName,
      score,
      label: fitLabel(score),
      tone: fitTone(score),
      fitColor: fitColor(score),
      noNewImpact: false,
      details: scoredDetails,
      worst,
    };
  }

  function databaseRoundLabel(detail) {
    const day = getDay(detail.dayId);
    const round = day.rounds.find((candidate) => candidate.time === detail.roundTime);
    return `${localizedDay(day).mini} ${detail.roundTime} · ${localizedRoundLabel(day, round)}`;
  }

  function databaseRoundCrowdLine(detail) {
    const other = detail.otherBookedCount;
    const total = detail.totalAfterAdd;

    if (state.language === "ro") {
      return other === 1
        ? `Pică lângă 1 alt participant rezervat, ${total} în total după adăugare.`
        : `Pică lângă ${other} alți participanți rezervați, ${total} în total după adăugare.`;
    }

    if (state.language === "th") {
      return `อยู่พร้อมกับลูกค้าที่จองอีก ${other} คน, รวม ${total} คนหลังเพิ่ม`;
    }

    return other === 1
      ? `Lands alongside 1 other booked participant, ${total} total after add.`
      : `Lands alongside ${other} other booked participants, ${total} total after add.`;
  }

  function renderDatabaseRoundCrowd(impact) {
    const roundItems = [...impact.details]
      .sort((detailA, detailB) => detailChronology(detailA) - detailChronology(detailB))
      .map((detail) => `
        <li>
          <b>${escapeHtml(databaseRoundLabel(detail))}</b>
          <span>${escapeHtml(databaseRoundCrowdLine(detail))}</span>
        </li>
      `)
      .join("");

    return `
      <div class="database-round-crowd">
        <strong>${escapeHtml(t("roundCrowd"))}</strong>
        <ul>${roundItems}</ul>
      </div>
    `;
  }

  function renderDatabaseImpactCard(impact, title) {
    if (impact.noNewImpact) {
      return `
        <article class="database-impact-card" data-fit="${impact.tone}" style="--fit-percent: 100%; --difficulty-color: ${impact.fitColor};">
          <header><span>${escapeHtml(title)}</span><strong>100%</strong></header>
          <div class="database-fit-meter" aria-hidden="true"><i></i></div>
          <b>${escapeHtml(impact.label)}</b>
          <p>${escapeHtml(t("noNewImpact"))}</p>
        </article>
      `;
    }

    const worst = impact.worst;
    const worstRoom = worst.additions[0] ? roomDisplayName(worst.additions[0].room) : "";
    const currentLevel = levelLabel(worst.before.level.key, true);
    const afterLevel = levelLabel(worst.after.level.key, true);

    return `
      <article class="database-impact-card" data-fit="${impact.tone}" style="--fit-percent: ${impact.score}%; --difficulty-color: ${impact.fitColor};">
        <header><span>${escapeHtml(title)}</span><strong>${impact.score}%</strong></header>
        <div class="database-fit-meter" aria-label="${escapeHtml(title)} ${impact.score}%"><i></i></div>
        <b>${escapeHtml(impact.label)}</b>
        <p>${escapeHtml(t("worstLanding"))}: ${escapeHtml(databaseRoundLabel(worst))} · ${escapeHtml(worstRoom)}</p>
        <p>${escapeHtml(t("current"))}: ${escapeHtml(currentLevel)} · ${escapeHtml(t("afterAdding"))}: ${escapeHtml(afterLevel)}</p>
        <small>${escapeHtml(t("affectsRounds", { count: impact.details.length }))}</small>
        ${renderDatabaseRoundCrowd(impact)}
      </article>
    `;
  }

  function renderDatabaseResult(person) {
    selectedDatabasePerson = person;
    const photoImpact = computeDatabaseImpact(person, "Essential");
    const videoImpact = computeDatabaseImpact(person, "Showcase");
    const countries = person.countries.map(localizedCountry).join(" · ");
    const categories = person.categories.map(localizedCategory).join(" · ");
    const appearances = person.entries
      .map((entry) => {
        const day = getDay(entry.day);
        return `
          <li>
            <b>${escapeHtml(localizedDay(day).mini)} ${escapeHtml(entry.round)}</b>
            <span>${escapeHtml(roomDisplayName(entry.room))} · ${escapeHtml(t("table"))} ${escapeHtml(entry.table)}</span>
            <small>${escapeHtml(localizedCategory(entry.category))}</small>
          </li>
        `;
      })
      .join("");

    databaseResult.innerHTML = `
      <section class="database-person">
        <header>
          <div>
            <p class="eyebrow">${escapeHtml(t("databaseEyebrow"))}</p>
            <h3>${escapeHtml(person.name)}</h3>
            <span>${escapeHtml(countries)}</span>
          </div>
          ${person.alreadyBooked ? `<em>${escapeHtml(t("alreadyBooked"))}</em>` : ""}
        </header>
        <p>${escapeHtml(categories)}</p>
        <ul class="database-appearance-list">${appearances}</ul>
      </section>
      <section class="database-impact-grid">
        ${renderDatabaseImpactCard(photoImpact, t("photoOnlyFit"))}
        ${renderDatabaseImpactCard(videoImpact, t("photoVideoFit"))}
      </section>
    `;
  }

  function renderDatabasePrompt() {
    databaseResult.innerHTML = `<p class="database-empty">${escapeHtml(t("databasePrompt"))}</p>`;
  }

  function renderDatabaseSuggestions() {
    const query = normalize(databaseSearch.value);
    databaseSuggestions.replaceChildren();

    if (!query) {
      renderDatabasePrompt();
      return;
    }

    const terms = query.split(/\s+/).filter(Boolean);
    const matches = getDatabasePeople()
      .filter((person) => {
        const haystack = normalize([
          person.name,
          ...person.countries,
          ...person.categories,
        ].join(" "));
        return terms.every((term) => haystack.includes(term));
      })
      .slice(0, 8);

    if (!matches.length) {
      databaseResult.innerHTML = `<p class="database-empty">${escapeHtml(t("databaseNoMatches"))}</p>`;
      return;
    }

    matches.forEach((person) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "database-suggestion";
      button.dataset.personKey = person.key;
      button.innerHTML = `
        <strong>${escapeHtml(person.name)}</strong>
        <span>${escapeHtml(person.countries.map(localizedCountry).join(" · "))}</span>
        <small>${person.entries.length} ${escapeHtml(t("appearances"))}${person.alreadyBooked ? ` · ${escapeHtml(t("alreadyBooked"))}` : ""}</small>
      `;
      button.addEventListener("click", () => {
        const currentPerson = getDatabasePerson(button.dataset.personKey);
        if (currentPerson) renderDatabaseResult(currentPerson);
      });
      databaseSuggestions.append(button);
    });

    renderDatabaseResult(matches[0]);
  }

  function openDatabase() {
    window.clearTimeout(databaseOverlayTimer);
    databaseReturnFocus = document.activeElement;
    selectedDatabasePerson = null;
    databaseSearch.value = "";
    databaseSuggestions.replaceChildren();
    renderDatabasePrompt();
    databaseOverlay.hidden = false;
    syncBodyLock();
    window.requestAnimationFrame(() => databaseOverlay.classList.add("is-open"));
    databaseSearch.focus();
  }

  function closeDatabase() {
    if (databaseOverlay.hidden) return;
    databaseOverlay.classList.remove("is-open");
    databaseOverlayTimer = window.setTimeout(() => {
      databaseOverlay.hidden = true;
      syncBodyLock();
      if (databaseReturnFocus?.isConnected) databaseReturnFocus.focus();
    }, 140);
  }

  function renderEasiestRoundChips(impact) {
    return [...impact.details]
      .sort((detailA, detailB) => detailChronology(detailA) - detailChronology(detailB))
      .map((detail) => `
        <span>
          ${escapeHtml(databaseRoundLabel(detail))}
          <b>${detail.totalAfterAdd}</b>
        </span>
      `)
      .join("");
  }

  function getEasiestAdditionRows() {
    const rows = getDatabasePeople()
      .filter((person) => !person.alreadyBooked && candidateClientsForPerson(person, "Showcase").length)
      .map((person) => {
        const photoImpact = computeDatabaseImpact(person, "Essential");
        const videoImpact = computeDatabaseImpact(person, "Showcase");
        const marketProfile = personMarketProfile(person);
        const row = { person, photoImpact, videoImpact, marketProfile };
        return { ...row, valueScore: marketFitScore(row) };
      });

    if (state.easiestSortMode === "market") {
      return rows.sort(
        (rowA, rowB) =>
          rowB.valueScore - rowA.valueScore ||
          rowB.videoImpact.score - rowA.videoImpact.score ||
          rowB.marketProfile.score - rowA.marketProfile.score ||
          rowB.photoImpact.score - rowA.photoImpact.score ||
          rowA.person.name.localeCompare(rowB.person.name),
      );
    }

    return rows.sort(
        (rowA, rowB) =>
          rowB.videoImpact.score - rowA.videoImpact.score ||
          rowB.photoImpact.score - rowA.photoImpact.score ||
          rowB.marketProfile.score - rowA.marketProfile.score ||
          rowA.person.name.localeCompare(rowB.person.name),
    );
  }

  function renderEasiestAdditions() {
    const rows = getEasiestAdditionRows();
    const isMarketMode = state.easiestSortMode === "market";

    if (!rows.length) {
      easiestContent.innerHTML = `<p class="database-empty">${escapeHtml(t("noEasiestAdditions"))}</p>`;
      return;
    }

    easiestContent.innerHTML = `
      <div class="easiest-topbar">
        <p class="easiest-hint">${escapeHtml(isMarketMode ? t("easiestMarketHint") : t("easiestHint"))}</p>
        <div class="easiest-sort-toggle" role="group" aria-label="${escapeHtml(t("easiestSortLabel"))}">
          <button class="easiest-sort-button" type="button" data-easiest-sort="fit" aria-pressed="${state.easiestSortMode === "fit"}">
            ${escapeHtml(t("easiestSortFit"))}
          </button>
          <button class="easiest-sort-button" type="button" data-easiest-sort="market" aria-pressed="${state.easiestSortMode === "market"}">
            ${escapeHtml(t("easiestSortMarket"))}
          </button>
        </div>
      </div>
      <ol class="easiest-list" aria-label="${escapeHtml(t("bestAdditions"))}">
        ${rows.map((row, index) => {
          const countries = row.person.countries.map(localizedCountry).join(" · ");
          const categories = row.person.categories.map(localizedCategory).join(" · ");
          const rowTone = isMarketMode ? fitTone(row.valueScore) : row.videoImpact.tone;
          return `
            <li class="easiest-item" data-fit="${rowTone}">
              <span class="easiest-rank">${index + 1}</span>
              <div class="easiest-person">
                <strong>${escapeHtml(row.person.name)}</strong>
                <small>${escapeHtml(countries || categories)} · ${escapeHtml(t("marketSignal"))}: ${row.marketProfile.score}/100</small>
              </div>
              <div class="easiest-scores">
                <div class="easiest-score${isMarketMode ? "" : " is-muted"}">
                  <b>${row.valueScore}%</b>
                  <span>${escapeHtml(t("dmFitShort"))}</span>
                </div>
                <div class="easiest-score">
                  <b>${row.videoImpact.score}%</b>
                  <span>${escapeHtml(t("videoFitShort"))}</span>
                </div>
                <div class="easiest-score is-muted">
                  <b>${row.photoImpact.score}%</b>
                  <span>${escapeHtml(t("photoFitShort"))}</span>
                </div>
                <div class="easiest-score is-market">
                  <b>${row.marketProfile.score}</b>
                  <span>${escapeHtml(t("marketScoreShort"))}</span>
                </div>
              </div>
              <div class="easiest-rounds" aria-label="${escapeHtml(t("affectedRounds"))}">
                ${renderEasiestRoundChips(row.videoImpact)}
              </div>
            </li>
          `;
        }).join("")}
      </ol>
    `;
  }

  function openEasiest() {
    window.clearTimeout(easiestOverlayTimer);
    easiestReturnFocus = document.activeElement;
    renderEasiestAdditions();
    easiestOverlay.hidden = false;
    syncBodyLock();
    window.requestAnimationFrame(() => easiestOverlay.classList.add("is-open"));
    easiestClose.focus();
  }

  function closeEasiest() {
    if (easiestOverlay.hidden) return;
    easiestOverlay.classList.remove("is-open");
    easiestOverlayTimer = window.setTimeout(() => {
      easiestOverlay.hidden = true;
      syncBodyLock();
      if (easiestReturnFocus?.isConnected) easiestReturnFocus.focus();
    }, 140);
  }

  function formatChf(value) {
    return `${value.toLocaleString("en-CH", {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2,
    })} CHF`;
  }

  function getAccountingSummary() {
    const prices = config.FINANCE.PACKAGE_PRICES_CHF;
    const packageOrder = ["Signature", "Showcase", "Authority", "Essential"];
    const people = new Map();

    data.clients.forEach((client) => {
      const key = normalize(client.officialName || client.name);
      const current = people.get(key);
      if (!current || (prices[client.package] || 0) > (prices[current.package] || 0)) {
        people.set(key, client);
      }
    });

    const counts = Object.fromEntries(packageOrder.map((packageName) => [packageName, 0]));
    [...people.values()].forEach((client) => {
      counts[client.package] = (counts[client.package] || 0) + 1;
    });

    const packageRows = packageOrder.map((packageName) => {
      const count = counts[packageName] || 0;
      const price = prices[packageName] || 0;
      return {
        packageName,
        count,
        price,
        subtotal: count * price,
      };
    });
    const gross = packageRows.reduce((total, row) => total + row.subtotal, 0);
    const expenseGroups = config.FINANCE.EXPENSE_GROUPS.map((group) => ({
      ...group,
      total: group.costs.reduce((total, cost) => total + cost, 0),
    }));
    const expenses = expenseGroups.reduce((total, group) => total + group.total, 0);

    return {
      totalClients: people.size,
      packageRows,
      expenseGroups,
      gross,
      expenses,
      net: gross - expenses,
    };
  }

  function renderFinanceTotals() {
    const summary = getAccountingSummary();
    const packageRows = summary.packageRows
      .map((row) => `
        <li data-package="${row.packageName.toLowerCase()}">
          <span>${escapeHtml(row.packageName)}</span>
          <b>${row.count}</b>
          <small>${formatChf(row.price)} ${escapeHtml(t("priceEach"))}</small>
          <strong>${formatChf(row.subtotal)}</strong>
        </li>
      `)
      .join("");
    const expenseRows = summary.expenseGroups
      .map((group) => `
        <li>
          <span>${escapeHtml(group.label)}</span>
          <small>${group.costs.map(formatChf).join(" + ")}</small>
          <strong>${formatChf(group.total)}</strong>
        </li>
      `)
      .join("");

    financeBody.innerHTML = `
      <section class="finance-totals">
        <article>
          <span>${escapeHtml(t("totalClients"))}</span>
          <strong>${summary.totalClients}</strong>
        </article>
        <article>
          <span>${escapeHtml(t("grossIncome"))}</span>
          <strong>${formatChf(summary.gross)}</strong>
        </article>
        <article>
          <span>${escapeHtml(t("totalExpenses"))}</span>
          <strong>${formatChf(summary.expenses)}</strong>
        </article>
        <article class="is-net">
          <span>${escapeHtml(t("netIncome"))}</span>
          <strong>${formatChf(summary.net)}</strong>
        </article>
      </section>
      <section class="finance-breakdown">
        <h3>${escapeHtml(t("packageBreakdown"))}</h3>
        <ul>${packageRows}</ul>
      </section>
      <section class="finance-breakdown">
        <h3>${escapeHtml(t("expenseBreakdown"))}</h3>
        <ul>${expenseRows}</ul>
      </section>
    `;
  }

  function openFinance() {
    window.clearTimeout(financeOverlayTimer);
    financeReturnFocus = document.activeElement;
    financeOverlay.hidden = false;
    financeError.hidden = true;
    if (financeUnlocked) {
      financeGate.hidden = true;
      financeBody.hidden = false;
      renderFinanceTotals();
    } else {
      financeGate.hidden = false;
      financeBody.hidden = true;
      financePassword.value = "";
    }
    syncBodyLock();
    window.requestAnimationFrame(() => financeOverlay.classList.add("is-open"));
    if (financeUnlocked) {
      financeClose.focus();
    } else {
      financePassword.focus();
    }
  }

  function closeFinance() {
    if (financeOverlay.hidden) return;
    financeOverlay.classList.remove("is-open");
    financeOverlayTimer = window.setTimeout(() => {
      financeOverlay.hidden = true;
      syncBodyLock();
      if (financeReturnFocus?.isConnected) financeReturnFocus.focus();
    }, 140);
  }

  function unlockFinance() {
    if (financePassword.value !== config.FINANCE.ACCESS_CODE) {
      financeError.hidden = false;
      financePassword.select();
      return;
    }

    financeUnlocked = true;
    financeError.hidden = true;
    financeGate.hidden = true;
    financeBody.hidden = false;
    renderFinanceTotals();
    financeClose.focus();
  }

  function makeParticipantMarker(entry) {
    const marker = document.createElement("div");
    marker.className = "participant-marker";
    marker.title = `${entry.name} · ${localizedCountry(entry.country)} · ${localizedCategory(entry.category)}`;
    marker.innerHTML = `
      <span class="table-number">T${entry.table}</span>
      <strong>${entry.name}</strong>
      <small>${localizedCountry(entry.country)}</small>
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
          <h4>${localizedRoomName(room)}</h4>
          <p>${localizedFloorLabel(room.floor)}</p>
        </div>
      </div>
      <p class="room-count">${officialEntries.length} ${t("scheduled")}</p>
    `;

    const body = document.createElement("div");
    body.className = "room-body";

    clients.forEach((client) => body.append(makeClientCard(client)));

    if (state.showField && neutralEntries.length) {
      if (clients.length) {
        const note = document.createElement("span");
        note.className = "field-note";
        note.textContent = t("alsoInRoom");
        body.append(note);
      }
      neutralEntries.forEach((entry) => body.append(makeParticipantMarker(entry)));
    }

    if (!visibleCount) {
      const empty = document.createElement("p");
      empty.className = "room-empty";
      if (state.videoIncludedOnly && bookedClients.length && !clients.length) {
        empty.textContent = t("noVideoClients");
      } else {
        empty.textContent = officialEntries.length && !state.showField
          ? t("noBookedClients")
          : t("noCompetitors");
      }
      body.append(empty);
    }

    article.append(header, body);
    return article;
  }

  function renderRoundBriefing(roundPlan) {
    const doctrine = localizedDoctrine()
      .map((rule, index) => `<span><b>0${index + 1}</b>${rule}</span>`)
      .join("");
    const cameraPlan = data.crew
      .map((member) => {
        const neckCamOperator = member.id === "june" && roundPlan.neckCam;
        return `
          <article class="camera-assignment" data-camera="${member.id}" data-neck-cam="${neckCamOperator}">
            <header>
              <span>${member.camera}</span>
              <div>
                <h4>${member.name}</h4>
                <small>${localizedCrewRole(member, neckCamOperator)}</small>
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
    elements.roundBriefing.dataset.expanded = String(state.briefingExpanded);
    elements.roundBriefing.setAttribute("aria-labelledby", "round-briefing-heading");
    elements.roundBriefing.innerHTML = `
      <header class="briefing-header">
        <div>
          <p class="eyebrow">${t("roundPlaybook")} · ${roundPlan.callout}</p>
          <h3 id="round-briefing-heading">${roundPlan.title}</h3>
        </div>
        <span class="neck-cam-status" data-active="${roundPlan.neckCam}">
          <i aria-hidden="true"></i>${roundPlan.neckCam ? t("neckCamOn") : t("neckCamOff")}
        </span>
      </header>
      <div class="doctrine-strip" aria-label="${t("filmingRules")}">${doctrine}</div>
      <div class="briefing-command">
        <section class="briefing-anchor">
          <span>${t("anchor")}</span>
          <strong>${roundPlan.anchor}</strong>
          <p>${roundPlan.objective}</p>
        </section>
        <section class="briefing-loop">
          <span>${t("loopOrder")}</span>
          <strong>${roundPlan.loop}</strong>
        </section>
      </div>
      <div class="camera-plan" aria-label="${t("cameraAssignments")}">${cameraPlan}</div>
      <ul class="briefing-tips">${tips}</ul>
    `;
  }

  function renderQuickCommand(roundPlan) {
    const activeMember = data.crew.find((member) => member.id === state.role) || data.crew[0];
    const brief = localizedQuickBrief(state.day, state.round, activeMember.id);
    const roleButtons = data.crew
      .map((member) => `
        <button type="button" class="quick-role-button" data-role="${member.id}" aria-pressed="${member.id === activeMember.id}">
          <span>${member.camera.replace("CAM ", "C")}</span>
          <b>${member.name}</b>
        </button>
      `)
      .join("");
    const secondaryNote = roundPlan.neckCam && activeMember.id === "june"
      ? `<p class="quick-secondary-note"><i aria-hidden="true"></i>${t("secondaryCameraNote")}</p>`
      : "";

    elements.quickCommand.innerHTML = `
      <header class="quick-command-header">
        <div>
          <p class="eyebrow">${t("yourJobNow")}</p>
          <h3>${activeMember.name}</h3>
          <small>${t("threeActionsOnly")}</small>
        </div>
        <span>${activeMember.camera}</span>
      </header>
      <div class="quick-role-picker" aria-label="${t("chooseCrewMember")}">${roleButtons}</div>
      <div class="quick-actions">
        <article data-step="1">
          <span>1</span>
          <div><small>${t("whereToGo")}</small><strong>${brief?.where || roundPlan.anchor}</strong></div>
        </article>
        <article data-step="2">
          <span>2</span>
          <div><small>${t("whatToDo")}</small><strong>${brief?.action || roundPlan.assignments[activeMember.id]}</strong></div>
        </article>
        <article data-step="3">
          <span>!</span>
          <div><small>${t("doNotMiss")}</small><strong>${brief?.watch || roundPlan.tips[0]}</strong></div>
        </article>
      </div>
      ${secondaryNote}
      <button class="briefing-toggle" type="button" aria-controls="round-briefing" aria-expanded="${state.briefingExpanded}">
        ${state.briefingExpanded ? t("hideFullPlan") : t("viewFullPlan")}
        <i aria-hidden="true"></i>
      </button>
    `;

    elements.quickCommand.querySelectorAll(".quick-role-button").forEach((button) => {
      button.addEventListener("click", () => {
        const nextRole = button.dataset.role;
        if (!crewIds.includes(nextRole) || nextRole === state.role) return;
        state.role = nextRole;
        state.rolePinned = true;
        try {
          window.localStorage.setItem("coverage-board-role", nextRole);
        } catch {
          // The board still works when storage is unavailable.
        }
        renderQuickCommand(roundPlan);
      });
    });

    elements.quickCommand.querySelector(".briefing-toggle").addEventListener("click", () => {
      state.briefingExpanded = !state.briefingExpanded;
      elements.roundBriefing.dataset.expanded = String(state.briefingExpanded);
      renderQuickCommand(roundPlan);
      if (state.briefingExpanded) {
        elements.roundBriefing.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  function renderVenue() {
    const day = getDay(state.day);
    const dayText = localizedDay(day);
    const pressureEntry = getDayPressureProfile(state.day).find(
      (entry) => entry.round.time === state.round,
    );
    const round = pressureEntry.round;
    const roundText = localizedRoundLabel(day, round);
    const difficulty = pressureEntry.difficulty;
    const roundPlan = localizedRoundPlan(state.day, state.round);
    const difficultyText = levelLabel(difficulty.level.key);
    const filledSegments = difficulty.visualPercent > 0
      ? Math.max(1, Math.ceil((difficulty.visualPercent / 100) * config.METER_SEGMENTS))
      : 0;
    const meterSegments = Array.from({ length: config.METER_SEGMENTS }, (_, index) =>
      `<i class="${index < Math.min(config.METER_SEGMENTS, filledSegments) ? "is-filled" : ""}"></i>`,
    ).join("");
    const splitMessage = splitNeededMessage(difficulty, roundPlan);
    const plannedSecondVideo = roundPlan.neckCam;
    const helperDisplayKey = plannedSecondVideo ? "required" : difficulty.helperMode.key;
    const juneLabel = plannedSecondVideo
      ? t("neckCamVideo")
      : difficulty.helperRequired
        ? t("secondVideo")
        : difficulty.helperStandby
          ? t("videoStandby")
          : t("clientStills");
    const iulianLabel = t("volumePhotosPlusPhotoClients");

    elements.videoFilterButton.setAttribute(
      "aria-pressed",
      String(state.videoIncludedOnly),
    );
    elements.videoFilterButton.setAttribute(
      "aria-label",
      state.videoIncludedOnly
        ? t("showAllBooked")
        : t("showVideoOnly"),
    );

    setDifficultyStyle(elements.activeRound, difficulty);
    setDifficultyStyle(elements.quickCommand, difficulty);
    elements.activeRound.style.setProperty("--meter-segments", config.METER_SEGMENTS);
    elements.activeRound.innerHTML = `
      <div class="active-round-top">
        <div class="active-round-time">
          <span>${dayText.shortLabel} · ${roundText}</span>
          <strong>${round.time}</strong>
        </div>
        <span class="difficulty-badge"><i class="difficulty-shape" aria-hidden="true"></i>${difficultyText}</span>
        <span class="pressure-rank"><b>#${difficulty.rank}</b> ${difficulty.rank === 1 ? t("hardestToday") : t("ofToday", { count: difficulty.roundCount })}</span>
        <span class="coverage-quality" data-quality="${difficulty.quality.key}">${qualityLabel(difficulty.quality.key)}</span>
      </div>
      <div class="pressure-meter-heading"><span>${t("coveragePressure")}</span><strong>#${difficulty.rank} ${t("today")}</strong></div>
      <div class="difficulty-meter" aria-label="${t("coveragePressure")}: ${difficultyText}, ${t("difficultyRank")} ${difficulty.rank} ${t("ofToday", { count: difficulty.roundCount })}">${meterSegments}</div>
      <p class="difficulty-summary">${difficultySummary(difficulty)}</p>
      <div class="crew-strip" data-helper="${helperDisplayKey}" aria-label="${t("crewAllocation")}">
        <span><b>C1</b>${config.TEAM.PRIMARY_VIDEO_NAME} · ${t("cinema")}</span>
        <span><b>C2</b>${config.TEAM.VOLUME_PHOTO_NAME} · ${iulianLabel}</span>
        <span><b>C3</b>${config.TEAM.CLIENT_PHOTO_NAME} · ${juneLabel}</span>
      </div>
      <p class="route-note">${routeSummary(difficulty)}</p>
      <p class="split-needed" data-helper="${helperDisplayKey}"><i aria-hidden="true"></i>${splitMessage}</p>
    `;

    renderQuickCommand(roundPlan);
    renderRoundBriefing(roundPlan);

    elements.secondFloor.replaceChildren();
    elements.groundFloor.replaceChildren();

    data.rooms.forEach((room) => {
      const target = room.floor === "second" ? elements.secondFloor : elements.groundFloor;
      target.append(makeRoom(room));
    });
  }

  function render() {
    applyStaticTranslations();
    renderControls();
    renderVenue();
    updateUrl();
  }

  elements.languageSelect.addEventListener("change", () => {
    const nextLanguage = elements.languageSelect.value;
    if (!Object.hasOwn(i18n, nextLanguage) || nextLanguage === state.language) return;
    state.language = nextLanguage;
    if (!state.rolePinned) {
      state.role = defaultRoleByLanguage[nextLanguage];
    }
    try {
      window.localStorage.setItem("coverage-board-language", nextLanguage);
    } catch {
      // The board still works when storage is unavailable.
    }
    render();
    if (!rosterOverlay.hidden) renderRoster();
    if (!eventScheduleOverlay.hidden) renderEventSchedule();
    if (!databaseOverlay.hidden) {
      renderDatabaseSuggestions();
      if (selectedDatabasePerson) {
        const currentPerson = getDatabasePerson(selectedDatabasePerson.key);
        if (currentPerson) renderDatabaseResult(currentPerson);
      }
    }
    if (!easiestOverlay.hidden) renderEasiestAdditions();
    if (!financeOverlay.hidden && financeUnlocked) renderFinanceTotals();
  });

  elements.fieldToggle.addEventListener("change", () => {
    state.showField = elements.fieldToggle.checked;
    renderVenue();
  });

  elements.allClientsButton.addEventListener("click", openRoster);
  elements.eventScheduleButton?.addEventListener("click", openEventSchedule);
  elements.databaseButton.addEventListener("click", openDatabase);
  elements.easiestButton?.addEventListener("click", openEasiest);
  elements.financeButton?.addEventListener("click", openFinance);
  elements.videoFilterButton.addEventListener("click", () => {
    state.videoIncludedOnly = !state.videoIncludedOnly;
    renderVenue();
  });
  cardOverlay.addEventListener("click", closeCardOverlay);
  rosterClose.addEventListener("click", closeRoster);
  eventScheduleClose.addEventListener("click", closeEventSchedule);
  databaseClose.addEventListener("click", closeDatabase);
  easiestClose.addEventListener("click", closeEasiest);
  financeClose.addEventListener("click", closeFinance);
  financeGate.addEventListener("submit", (event) => {
    event.preventDefault();
    unlockFinance();
  });
  rosterOverlay.addEventListener("click", (event) => {
    if (event.target === rosterOverlay) closeRoster();
  });
  eventScheduleOverlay.addEventListener("click", (event) => {
    if (event.target === eventScheduleOverlay) closeEventSchedule();
  });
  databaseOverlay.addEventListener("click", (event) => {
    if (event.target === databaseOverlay) closeDatabase();
  });
  easiestOverlay.addEventListener("click", (event) => {
    if (event.target === easiestOverlay) closeEasiest();
  });
  easiestContent.addEventListener("click", (event) => {
    const button = event.target.closest("[data-easiest-sort]");
    if (!button) return;
    state.easiestSortMode = button.dataset.easiestSort === "market" ? "market" : "fit";
    renderEasiestAdditions();
  });
  financeOverlay.addEventListener("click", (event) => {
    if (event.target === financeOverlay) closeFinance();
  });
  databaseSearch.addEventListener("input", renderDatabaseSuggestions);
  databaseSearch.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    const suggestion = databaseSuggestions.querySelector(".database-suggestion");
    if (!suggestion) return;
    event.preventDefault();
    suggestion.click();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!cardOverlay.hidden) {
      closeCardOverlay();
    } else if (!rosterOverlay.hidden) {
      closeRoster();
    } else if (!eventScheduleOverlay.hidden) {
      closeEventSchedule();
    } else if (!databaseOverlay.hidden) {
      closeDatabase();
    } else if (!easiestOverlay.hidden) {
      closeEasiest();
    } else if (!financeOverlay.hidden) {
      closeFinance();
    }
  });

  render();
})();
