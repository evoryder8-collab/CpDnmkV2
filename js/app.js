(() => {
  "use strict";

  const data = window.BOARD_DATA;

  if (!data) {
    throw new Error("BOARD_DATA is missing. Check js/data.js.");
  }

  const elements = {
    dayTabs: document.querySelector("#day-tabs"),
    roundTabs: document.querySelector("#round-tabs"),
    fieldToggle: document.querySelector("#field-toggle"),
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
  };

  function getDay(dayId) {
    return data.days.find((day) => day.id === dayId);
  }

  function getRoom(roomId) {
    return data.rooms.find((room) => room.id === roomId);
  }

  function normalize(value) {
    return value.trim().toLocaleLowerCase("en");
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
    getDay(state.day).rounds.forEach((round) => {
      const label = `<span>${round.label}</span>${round.time}`;
      elements.roundTabs.append(
        makeButton("round-button", label, round.time === state.round, () => {
          if (state.round === round.time) return;
          state.round = round.time;
          render();
        }),
      );
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

  function makeClientCard(client) {
    const officialEntry = findOfficialEntry(client);
    const card = document.createElement("article");
    const tier = client.package.toLowerCase();
    card.className = "client-card";
    card.dataset.tier = tier;
    card.setAttribute("aria-label", `${client.name}, ${client.package}, ${client.category}, ${client.round}`);

    const inner = document.createElement("div");
    inner.className = "client-card-inner";

    const ribbon = document.createElement("span");
    ribbon.className = "booked-ribbon";
    ribbon.textContent = "BOOKED";

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
    const tableText = officialEntry?.table ? `Official schedule · Table ${officialEntry.table}` : "Confirmed coverage client";
    copy.innerHTML = `
      <h5>${client.name}</h5>
      <span class="card-package">${client.package}</span>
      <div class="card-details">
        <span>${client.category}</span>
        <strong>${client.round}</strong>
        <span class="card-table">${tableText}</span>
      </div>
    `;

    portraitFrame.append(fallback, image);
    inner.append(ribbon, portraitFrame, copy);
    card.append(inner);
    return card;
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
    const clients = data.clients.filter(
      (client) => client.day === state.day && client.round === state.round && client.room === room.id,
    );
    const officialEntries = data.schedule.filter(
      (entry) => entry.day === state.day && entry.round === state.round && entry.room === room.id,
    );
    const neutralEntries = officialEntries.filter((entry) => !isPromotedParticipant(entry, clients));
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
      empty.textContent = officialEntries.length && !state.showField ? "No booked clients this round" : "No competitors scheduled";
      body.append(empty);
    }

    article.append(header, body);
    return article;
  }

  function renderVenue() {
    const day = getDay(state.day);
    const round = day.rounds.find((item) => item.time === state.round);
    elements.activeRound.innerHTML = `<span>${day.shortLabel} · ${round.label}</span><strong>${round.time}</strong>`;

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

  render();
})();
