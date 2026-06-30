// EDITING GUIDE
// Add one object to `clients` for each booked appearance.
// Required difficulty fields are package, day, round, and room.
// Packages map automatically: Essential is photo only. Authority, Showcase,
// and Signature are photo plus video. Use role: "Official event judge" for a
// stationary judge grab that needs no dedicated camera.
// Put the portrait in img/ and make its filename match client.portrait exactly,
// for example img/Name.webp with portrait: "Name.webp".
// Difficulty settings, venue distances, thresholds, and colors live below.
// TEAM and COVERAGE_MODEL mirror the live workflow: one primary video route,
// one booked-client photo assistant, and one volume photo assistant who can
// contribute part of a round as a second video operator when pressure demands it.
// Edit a value here and every round indicator will recompute on reload.
// The full official field follows in `schedule`.
window.BOARD_CONFIG = {
  CAMERA_COUNT: 3,
  TEAM: {
    PRIMARY_VIDEO_OPERATORS: 1,
    CLIENT_PHOTO_OPERATORS: 1,
    VOLUME_PHOTO_OPERATORS: 1,
    SURGE_VIDEO_OPERATOR_SHARE: 0.4,
  },
  COVERAGE_MODEL: {
    ROUND_WORK_MINUTES: 45,
    VIDEO_MINUTES_BY_PACKAGE: {
      Authority: 4.5,
      Showcase: 5,
      Signature: 5.5,
    },
    TARGET_ROOM_CYCLES: 2,
    ROOM_REENTRY_MINUTES: 0.6,
    AWARD_RESERVE_MINUTES_PER_VIDEO_CLIENT: 0.75,
    VARIETY_RESERVE_MINUTES: 6,
    JUDGE_GRAB_MINUTES: 0.35,
    EMPTY_AUDITORIUM_SCOUT_MINUTES: 1.5,
    RUN_METRES_PER_MINUTE: 170,
    VIDEO_VISIT_MINUTES: 2.25,
    PHOTO_MINUTES_PER_CLIENT: 1.4,
    PHOTO_ROUND_MINUTES: 45,
    PHOTO_PRESSURE_SHARE: 0.18,
    COORDINATION_PER_EXTRA_CLIENT: 0.025,
    COORDINATION_PER_EXTRA_ROOM: 0.025,
    CROSS_FLOOR_COORDINATION: 0.03,
    HELPER_STANDBY_PRESSURE: 0.82,
    HELPER_REQUIRED_PRESSURE: 1.08,
    MIN_DIVERSE_PASSES: 1.35,
    HEALTHY_DIVERSE_PASSES: 2.2,
  },
  PACKAGE_PRIORITY: {
    Essential: 0,
    Authority: 1,
    Showcase: 2,
    Signature: 3,
  },
  STAIR_COST: 45,
  METER_SEGMENTS: 12,
  METER_MAX_RATIO: 1.35,
  LEVELS: [
    { key: "calm", label: "Calm", shortLabel: "Calm", maxRatio: 0.38, color: "#45c6b8" },
    { key: "steady", label: "Steady", shortLabel: "Steady", maxRatio: 0.58, color: "#d5b65d" },
    { key: "busy", label: "Busy", shortLabel: "Busy", maxRatio: 0.84, color: "#d99a3e" },
    { key: "heavy", label: "Heavy", shortLabel: "Heavy", maxRatio: 1.05, color: "#e56f2f" },
    { key: "critical", label: "Critical", shortLabel: "Critical", maxRatio: 1.25, color: "#d94a35" },
    { key: "coverage-risk", label: "Coverage Risk", shortLabel: "Risk", maxRatio: Infinity, color: "#a92f3b" },
  ],
  VENUE: {
    c233: { floor: "second", distToStairs: 25 },
    c275: { floor: "second", distToStairs: 70 },
    d223: { floor: "second", distToStairs: 125 },
    d245: { floor: "second", distToStairs: 180 },
    gryden: { floor: "ground", distToStairs: 60 },
    b086: { floor: "ground", distToStairs: 150 },
  },
};

window.BOARD_DATA = {
  "days": [
    {
      "id": "sat",
      "label": "Sat July 4",
      "shortLabel": "Saturday July 4",
      "rounds": [
        {
          "label": "Round 1",
          "time": "10:00"
        },
        {
          "label": "Round 2",
          "time": "11:15"
        },
        {
          "label": "Round 3",
          "time": "12:35"
        },
        {
          "label": "Round 4",
          "time": "13:55"
        }
      ]
    },
    {
      "id": "sun",
      "label": "Sun July 5",
      "shortLabel": "Sunday July 5",
      "rounds": [
        {
          "label": "Round 1",
          "time": "09:30"
        },
        {
          "label": "Round 2",
          "time": "10:50"
        },
        {
          "label": "Round 3",
          "time": "12:10"
        },
        {
          "label": "Round 4",
          "time": "13:30"
        },
        {
          "label": "Wellness final",
          "time": "13:55"
        }
      ]
    }
  ],
  "rooms": [
    {
      "id": "c233",
      "name": "Swedish",
      "code": "C233",
      "floor": "second",
      "floorLabel": "2nd floor"
    },
    {
      "id": "c275",
      "name": "Wellness",
      "code": "C275",
      "floor": "second",
      "floorLabel": "2nd floor"
    },
    {
      "id": "d223",
      "name": "Sports",
      "code": "D223",
      "floor": "second",
      "floorLabel": "2nd floor"
    },
    {
      "id": "d245",
      "name": "Western",
      "code": "D245",
      "floor": "second",
      "floorLabel": "2nd floor"
    },
    {
      "id": "gryden",
      "name": "Floor Hall",
      "code": "Gryden",
      "floor": "ground",
      "floorLabel": "Ground floor"
    },
    {
      "id": "b086",
      "name": "Auditorium",
      "code": "B086",
      "floor": "ground",
      "floorLabel": "Ground floor"
    }
  ],
  "clients": [
    {
      "id": "gof-sat-chair",
      "name": "Gof",
      "officialName": "Panuwat Srisamajarn",
      "package": "Signature",
      "day": "sat",
      "round": "10:00",
      "room": "gryden",
      "category": "Chair massage",
      "portrait": "Gof.webp"
    },
    {
      "id": "gof-sun-chair",
      "name": "Gof",
      "officialName": "Panuwat Srisamajarn",
      "package": "Signature",
      "day": "sun",
      "round": "13:30",
      "room": "b086",
      "category": "Chair massage",
      "portrait": "Gof.webp"
    },
    {
      "id": "zoltan-sat-sports",
      "name": "Zoltán Kódor",
      "officialName": "Zoltán Kódor",
      "package": "Showcase",
      "day": "sat",
      "round": "12:35",
      "room": "d223",
      "category": "Sports massage",
      "portrait": "Zoltan.webp"
    },
    {
      "id": "zoltan-sun-western",
      "name": "Zoltán Kódor",
      "officialName": "Zoltán Kódor",
      "package": "Showcase",
      "day": "sun",
      "round": "12:10",
      "room": "d245",
      "category": "Freestyle massage - Western inspired",
      "portrait": "Zoltan.webp"
    },
    {
      "id": "hubert-sat-sports",
      "name": "Hubert",
      "officialName": "Kwok Shum Hubert Mak",
      "package": "Showcase",
      "day": "sat",
      "round": "12:35",
      "room": "d223",
      "category": "Sports massage",
      "portrait": "Hubert.webp"
    },
    {
      "id": "hubert-sun-western",
      "name": "Hubert",
      "officialName": "Kwok Shum Hubert Mak",
      "package": "Showcase",
      "day": "sun",
      "round": "13:30",
      "room": "d245",
      "category": "Freestyle massage - Western inspired",
      "portrait": "Hubert.webp"
    },
    {
      "id": "antonio-sat-western",
      "name": "Antonio Costea",
      "officialName": "Antonio Costea",
      "package": "Showcase",
      "day": "sat",
      "round": "11:15",
      "room": "d245",
      "category": "Freestyle massage - Western inspired",
      "portrait": "Antonio Costea.webp"
    },
    {
      "id": "antonio-sun-eastern",
      "name": "Antonio Costea",
      "officialName": "Antonio Costea",
      "package": "Showcase",
      "day": "sun",
      "round": "09:30",
      "room": "b086",
      "category": "Freestyle massage - Eastern inspired",
      "portrait": "Antonio Costea.webp"
    },
    {
      "id": "gogutsa-sat-western-1",
      "name": "Gogutsa Khopeira",
      "officialName": "Gogutsa Khopeira",
      "package": "Authority",
      "day": "sat",
      "round": "10:00",
      "room": "d245",
      "category": "Freestyle Western",
      "role": "Official event judge",
      "portrait": "Gogutsa.webp"
    },
    {
      "id": "gogutsa-sat-western-2",
      "name": "Gogutsa Khopeira",
      "officialName": "Gogutsa Khopeira",
      "package": "Authority",
      "day": "sat",
      "round": "11:15",
      "room": "d245",
      "category": "Freestyle Western",
      "role": "Official event judge",
      "portrait": "Gogutsa.webp"
    },
    {
      "id": "gogutsa-sat-western-3",
      "name": "Gogutsa Khopeira",
      "officialName": "Gogutsa Khopeira",
      "package": "Authority",
      "day": "sat",
      "round": "12:35",
      "room": "d245",
      "category": "Freestyle Western",
      "role": "Official event judge",
      "portrait": "Gogutsa.webp"
    },
    {
      "id": "gogutsa-sat-western-4",
      "name": "Gogutsa Khopeira",
      "officialName": "Gogutsa Khopeira",
      "package": "Authority",
      "day": "sat",
      "round": "13:55",
      "room": "d245",
      "category": "Freestyle Western",
      "role": "Official event judge",
      "portrait": "Gogutsa.webp"
    },
    {
      "id": "gogutsa-sun-western-1",
      "name": "Gogutsa Khopeira",
      "officialName": "Gogutsa Khopeira",
      "package": "Authority",
      "day": "sun",
      "round": "09:30",
      "room": "d245",
      "category": "Freestyle Western",
      "role": "Official event judge",
      "portrait": "Gogutsa.webp"
    },
    {
      "id": "gogutsa-sun-western-2",
      "name": "Gogutsa Khopeira",
      "officialName": "Gogutsa Khopeira",
      "package": "Authority",
      "day": "sun",
      "round": "10:50",
      "room": "d245",
      "category": "Freestyle Western",
      "role": "Official event judge",
      "portrait": "Gogutsa.webp"
    },
    {
      "id": "gogutsa-sun-western-3",
      "name": "Gogutsa Khopeira",
      "officialName": "Gogutsa Khopeira",
      "package": "Authority",
      "day": "sun",
      "round": "12:10",
      "room": "d245",
      "category": "Freestyle Western",
      "role": "Official event judge",
      "portrait": "Gogutsa.webp"
    },
    {
      "id": "gogutsa-sun-western-4",
      "name": "Gogutsa Khopeira",
      "officialName": "Gogutsa Khopeira",
      "package": "Authority",
      "day": "sun",
      "round": "13:30",
      "room": "d245",
      "category": "Freestyle Western",
      "role": "Official event judge",
      "portrait": "Gogutsa.webp"
    },
    {
      "id": "gerarda-sat-sports",
      "name": "Gerarda Cirully",
      "officialName": "GERARDA CIRULLI KOLEY",
      "package": "Authority",
      "day": "sat",
      "round": "13:55",
      "room": "d223",
      "category": "Sports massage",
      "portrait": "Gerarda.webp"
    },
    {
      "id": "gerarda-sun-chair",
      "name": "Gerarda Cirully",
      "officialName": "GERARDA CIRULLI KOLEY",
      "package": "Authority",
      "day": "sun",
      "round": "13:30",
      "room": "b086",
      "category": "Chair massage",
      "portrait": "Gerarda.webp"
    },
    {
      "id": "antoine-sat-western",
      "name": "Antoine Carlotti",
      "officialName": "Antoine CARLOTTI",
      "package": "Signature",
      "day": "sat",
      "round": "12:35",
      "room": "d245",
      "category": "Freestyle massage - Western inspired",
      "portrait": "Antoine.webp"
    },
    {
      "id": "antoine-sun-sports",
      "name": "Antoine Carlotti",
      "officialName": "Antoine CARLOTTI",
      "package": "Signature",
      "day": "sun",
      "round": "10:50",
      "room": "d223",
      "category": "Sports massage",
      "portrait": "Antoine.webp"
    },
    {
      "id": "pitiprapada-sat-facial",
      "name": "Pitiprapada",
      "officialName": "Pitiprapada Srikaew",
      "package": "Showcase",
      "day": "sat",
      "round": "12:35",
      "room": "gryden",
      "category": "Facial Massage",
      "portrait": "Pitiprapada.webp"
    },
    {
      "id": "pitiprapada-sun-wellness",
      "name": "Pitiprapada",
      "officialName": "Pitiprapada Srikaew",
      "package": "Showcase",
      "day": "sun",
      "round": "10:50",
      "room": "c275",
      "category": "Wellness massage",
      "portrait": "Pitiprapada.webp"
    },
    {
      "id": "henry-sat-swedish",
      "name": "Henry",
      "officialName": "CHIA-JUNG WANG",
      "package": "Authority",
      "day": "sat",
      "round": "10:00",
      "room": "c233",
      "category": "Swedish massage",
      "portrait": "Chia Henry.webp"
    },
    {
      "id": "henry-sun-sports",
      "name": "Henry",
      "officialName": "CHIA-JUNG WANG",
      "package": "Authority",
      "day": "sun",
      "round": "12:10",
      "room": "d223",
      "category": "Sports massage",
      "portrait": "Chia Henry.webp"
    },
    {
      "id": "victor-sat-wellness",
      "name": "Victor Fabian Martin",
      "officialName": "Victor F. Martin",
      "package": "Signature",
      "day": "sat",
      "round": "12:35",
      "room": "c275",
      "category": "Wellness massage",
      "portrait": "Victor.webp"
    },
    {
      "id": "victor-sun-eastern",
      "name": "Victor Fabian Martin",
      "officialName": "Victor F. Martin",
      "package": "Signature",
      "day": "sun",
      "round": "12:10",
      "room": "b086",
      "category": "Freestyle massage - Eastern inspired",
      "portrait": "Victor.webp"
    },
    {
      "id": "harpa-sat-sports",
      "name": "Harpa",
      "officialName": "Harpa Finnsdóttir",
      "package": "Essential",
      "day": "sat",
      "round": "12:35",
      "room": "d223",
      "category": "Sports massage",
      "portrait": "Harpa.webp"
    },
    {
      "id": "harpa-sun-sports",
      "name": "Harpa",
      "officialName": "Harpa Finnsdóttir",
      "package": "Essential",
      "day": "sun",
      "round": "13:30",
      "room": "d223",
      "category": "Sports massage",
      "portrait": "Harpa.webp"
    },
    {
      "id": "hege-sat-swedish",
      "name": "Hege Rokseth",
      "officialName": "Hege Rokseth",
      "package": "Authority",
      "day": "sat",
      "round": "11:15",
      "room": "c233",
      "category": "Swedish massage",
      "portrait": "Hege.webp"
    },
    {
      "id": "hege-sun-sports",
      "name": "Hege Rokseth",
      "officialName": "Hege Rokseth",
      "package": "Authority",
      "day": "sun",
      "round": "13:30",
      "room": "d223",
      "category": "Sports massage",
      "portrait": "Hege.webp"
    }
  ],
  "schedule": [
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "b086",
      "table": 1,
      "name": "Liu Hsnji tsao",
      "country": "Taiwan",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "b086",
      "table": 1,
      "name": "Eleftherios Plakidas",
      "country": "Germany",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "b086",
      "table": 1,
      "name": "Alexandre Begouen, Alison Cattani & Vanny Yon",
      "country": "Canada",
      "category": "Multi Hands"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "b086",
      "table": 2,
      "name": "Iwona Grzelec",
      "country": "Poland",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "b086",
      "table": 2,
      "name": "James Suther",
      "country": "United Kingdom",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "b086",
      "table": 2,
      "name": "Aram Muradyan & Stella Barseghyan",
      "country": "Lithuania & Armenia",
      "category": "Multi Hands"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "b086",
      "table": 3,
      "name": "KUAN-NIEN(Keith) LAI",
      "country": "Taiwan",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "b086",
      "table": 3,
      "name": "Marlene Christiansen",
      "country": "Denmark",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "b086",
      "table": 3,
      "name": "Lucie GUILLOU & Julie Bak",
      "country": "France",
      "category": "Multi Hands"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "b086",
      "table": 4,
      "name": "Mayu Iwai",
      "country": "Japan",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "b086",
      "table": 4,
      "name": "Milen Tomanov",
      "country": "Bulgaria",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "b086",
      "table": 4,
      "name": "IEVA KNIEŽIENĖ & Lijana Untulienė",
      "country": "Lithuania",
      "category": "Multi Hands"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "b086",
      "table": 5,
      "name": "Nafiye Ballikaya",
      "country": "Denmark",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "b086",
      "table": 5,
      "name": "Ubonrut Boromthongchum",
      "country": "Thailand",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "b086",
      "table": 5,
      "name": "Mickaël Denis & Nicolas Van Oel",
      "country": "France",
      "category": "Multi Hands"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "b086",
      "table": 6,
      "name": "YUKA SOMEYA",
      "country": "Japan",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "b086",
      "table": 6,
      "name": "Misuzu Kishigami",
      "country": "United States",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "b086",
      "table": 6,
      "name": "Nini Bagnasvili & Rolandas Jasilionis",
      "country": "Lithuania",
      "category": "Multi Hands"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "b086",
      "table": 7,
      "name": "Teppong Yindee",
      "country": "Germany",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "b086",
      "table": 7,
      "name": "HO YU CHIEH",
      "country": "Taiwan",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "b086",
      "table": 7,
      "name": "Anna Quercia & Eduard Zaldivar",
      "country": "Italy",
      "category": "Multi Hands"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "b086",
      "table": 8,
      "name": "Xaisongkhame Phonexaiya",
      "country": "United States",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "b086",
      "table": 8,
      "name": "Żaneta Porowska",
      "country": "Poland",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "b086",
      "table": 8,
      "name": "Coralie Venturin",
      "country": "France",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 1,
      "name": "Alexandru Modvala",
      "country": "Switzerland",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 1,
      "name": "Aliaksei Tsiareshchanka",
      "country": "Poland",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 1,
      "name": "Anthony Nguyen",
      "country": "Canada",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c233",
      "table": 1,
      "name": "Laura McAulay",
      "country": "United Kingdom",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 2,
      "name": "Elena Cerneaev",
      "country": "Moldova",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 2,
      "name": "Ciara Ni Dhiomasaigh",
      "country": "Ireland",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 2,
      "name": "Coco Elsøe Daugaard",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c233",
      "table": 2,
      "name": "IOANNIS DAFNAS",
      "country": "Greece",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 3,
      "name": "Emma Sofie Bach",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 3,
      "name": "Paraya Navon",
      "country": "United States",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 3,
      "name": "Florian Erdmann",
      "country": "Germany",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c233",
      "table": 3,
      "name": "Freja Hansen",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 4,
      "name": "Żaneta Sroka",
      "country": "Poland",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 4,
      "name": "Hege Rokseth",
      "country": "Norway",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 4,
      "name": "Pornnipa Smith",
      "country": "United Kingdom",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c233",
      "table": 4,
      "name": "ZOLTÁN CSABA HORVÁTH",
      "country": "Romania",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 5,
      "name": "Vladislav Kornash",
      "country": "Ukraine",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 5,
      "name": "Stine Langvad",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 5,
      "name": "Anna Kustova",
      "country": "Israel",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c233",
      "table": 5,
      "name": "Linda Olsen",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 6,
      "name": "Hanne Aaholm-Hansen",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 6,
      "name": "Nerijus Malijonis",
      "country": "Lithuania",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 6,
      "name": "Marie Andersen",
      "country": "Norway",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c233",
      "table": 6,
      "name": "Nishit Shah",
      "country": "Canada",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 7,
      "name": "CHIA-JUNG WANG",
      "country": "Taiwan",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 7,
      "name": "gabriel perroud",
      "country": "United States",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 7,
      "name": "John Podobnik",
      "country": "Canada",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c233",
      "table": 7,
      "name": "Raj Cuppoor",
      "country": "Ireland",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 8,
      "name": "Tomas Repečka",
      "country": "Lithuania",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 8,
      "name": "Rimantas Bruzbartas",
      "country": "Norway",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 8,
      "name": "Rotaru Cristinel",
      "country": "Romania",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c233",
      "table": 8,
      "name": "Signe Hansen",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 9,
      "name": "Kateryna Bohush",
      "country": "Lithuania",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 9,
      "name": "Stine Pedersen",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 9,
      "name": "Pamela Golden Moore",
      "country": "Ireland",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c233",
      "table": 9,
      "name": "Ulla Bojsen",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 10,
      "name": "Wioletta Cassagneres",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 10,
      "name": "Igor Mamenka",
      "country": "Ukraine",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 10,
      "name": "Karoline Thrysøe",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c233",
      "table": 11,
      "name": "Jana Havlínová",
      "country": "Czech Republic",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c233",
      "table": 11,
      "name": "Genti Musliu",
      "country": "Sweden",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c233",
      "table": 11,
      "name": "Anne Ravndal",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c275",
      "table": 1,
      "name": "Alexander Kluge",
      "country": "Germany",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c275",
      "table": 1,
      "name": "Yen Jung Lin",
      "country": "Taiwan",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c275",
      "table": 1,
      "name": "Ademir Santos",
      "country": "Brazil",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c275",
      "table": 2,
      "name": "Amy Hintze",
      "country": "Germany",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c275",
      "table": 2,
      "name": "Bella Bayar Enkhjargal",
      "country": "Sweden",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c275",
      "table": 2,
      "name": "Dina Kodatko",
      "country": "Belgium",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c275",
      "table": 3,
      "name": "Dmytro Kurinskyi",
      "country": "Ukraine",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c275",
      "table": 3,
      "name": "Emeline Remiot",
      "country": "France",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c275",
      "table": 3,
      "name": "Emilia Greenan",
      "country": "United Kingdom",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c275",
      "table": 4,
      "name": "Izabela Białek",
      "country": "Poland",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c275",
      "table": 4,
      "name": "Fanny MARDELLAT",
      "country": "France",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c275",
      "table": 4,
      "name": "John Feng",
      "country": "United States",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c275",
      "table": 5,
      "name": "Marzena Lisińska",
      "country": "Poland",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c275",
      "table": 5,
      "name": "Nadiia Minenko",
      "country": "Italy",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c275",
      "table": 5,
      "name": "Naiara Gatto",
      "country": "Brazil",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c275",
      "table": 6,
      "name": "Domenico Barin",
      "country": "Italy",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c275",
      "table": 6,
      "name": "Nicolae Prip",
      "country": "Romania",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c275",
      "table": 6,
      "name": "Salvatore Pio Polimeni",
      "country": "Italy",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c275",
      "table": 7,
      "name": "haojun qiu",
      "country": "China",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c275",
      "table": 7,
      "name": "Irosh Mendis",
      "country": "Czech Republic",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c275",
      "table": 7,
      "name": "Aleksandr Nikitchenko",
      "country": "Ireland",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c275",
      "table": 8,
      "name": "Sarah Skovgaard",
      "country": "Denmark",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c275",
      "table": 8,
      "name": "Milan Šimrak",
      "country": "Montenegro",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c275",
      "table": 8,
      "name": "Rebecca Moody",
      "country": "United States",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c275",
      "table": 9,
      "name": "Camilla Thyme Palbom",
      "country": "Denmark",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c275",
      "table": 9,
      "name": "Dana Vachulíková",
      "country": "Slovakia",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c275",
      "table": 9,
      "name": "Victor F. Martin",
      "country": "United States",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "c275",
      "table": 10,
      "name": "Manuela Reis",
      "country": "Portugal",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "c275",
      "table": 10,
      "name": "Riko “Fresh” Chirito",
      "country": "Peru",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "c275",
      "table": 10,
      "name": "Kornelia Dziubacka",
      "country": "Poland",
      "category": "Wellness massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d223",
      "table": 1,
      "name": "Wirada Innork",
      "country": "Thailand",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d223",
      "table": 1,
      "name": "Matej Vasilišin",
      "country": "Slovakia",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d223",
      "table": 1,
      "name": "Gil Peerspain",
      "country": "Spain",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d223",
      "table": 1,
      "name": "Tim LAUGHLIN",
      "country": "French Polynesia",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d223",
      "table": 2,
      "name": "Chan Tak Chi",
      "country": "China",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d223",
      "table": 2,
      "name": "Stéphanie DATIL",
      "country": "France",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d223",
      "table": 2,
      "name": "Sean-Michael Latimour",
      "country": "Canada",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d223",
      "table": 2,
      "name": "Simon Kindahl",
      "country": "Sweden",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d223",
      "table": 3,
      "name": "Yan Hung sun Frank",
      "country": "China",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d223",
      "table": 3,
      "name": "Naomi Holm",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d223",
      "table": 3,
      "name": "Monique Redman",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d223",
      "table": 3,
      "name": "Mark Vangkilde",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d223",
      "table": 4,
      "name": "Lisa-Maria Resch-Katholnig",
      "country": "Austria",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d223",
      "table": 4,
      "name": "Lene Rye",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d223",
      "table": 4,
      "name": "Ole Krüger",
      "country": "Germany",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d223",
      "table": 4,
      "name": "kevin Qian",
      "country": "Canada",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d223",
      "table": 5,
      "name": "Ali Arda Durmaz",
      "country": "Turkey",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d223",
      "table": 5,
      "name": "Josiane Serio",
      "country": "Brazil",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d223",
      "table": 5,
      "name": "Joshua Snow",
      "country": "Australia",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d223",
      "table": 5,
      "name": "Jorgedand Mogro",
      "country": "Canada",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d223",
      "table": 6,
      "name": "Sonya Keogh",
      "country": "Ireland",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d223",
      "table": 6,
      "name": "Ilona Skjoldshøj",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d223",
      "table": 6,
      "name": "Harpa Finnsdóttir",
      "country": "Iceland",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d223",
      "table": 6,
      "name": "GERARDA CIRULLI KOLEY",
      "country": "Italy",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d223",
      "table": 7,
      "name": "Dominik Bodo",
      "country": "Ireland",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d223",
      "table": 7,
      "name": "Dolorès Guillemet",
      "country": "France",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d223",
      "table": 7,
      "name": "Zoltán Kódor",
      "country": "Hungary",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d223",
      "table": 7,
      "name": "Damian Sipiorski",
      "country": "Poland",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d223",
      "table": 8,
      "name": "Chanette Jørgensen",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d223",
      "table": 8,
      "name": "Celso Serio",
      "country": "Brazil",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d223",
      "table": 8,
      "name": "Sofia Guimarães",
      "country": "Portugal",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d223",
      "table": 8,
      "name": "Barbara Gabbianelli",
      "country": "Italy",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d223",
      "table": 9,
      "name": "Arnaud Corbion",
      "country": "France",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d223",
      "table": 9,
      "name": "Alina Kuzmych",
      "country": "Ukraine",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d223",
      "table": 9,
      "name": "Kwok Shum Hubert Mak",
      "country": "Canada",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d223",
      "table": 10,
      "name": "Alexandra De Geest",
      "country": "Belgium",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d223",
      "table": 10,
      "name": "Aoife Fitzgerald",
      "country": "Ireland",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d223",
      "table": 10,
      "name": "Travis Fisher",
      "country": "United States",
      "category": "Sports massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d245",
      "table": 1,
      "name": "Attila Bodo",
      "country": "Ireland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d245",
      "table": 1,
      "name": "Alona Petrunia",
      "country": "Germany",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d245",
      "table": 1,
      "name": "Avetik Vanyan",
      "country": "Armenia",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d245",
      "table": 1,
      "name": "Ievgen Bokov",
      "country": "Ireland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d245",
      "table": 2,
      "name": "Pia Ørtoft",
      "country": "Denmark",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d245",
      "table": 2,
      "name": "Antonio Costea",
      "country": "Canada",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d245",
      "table": 2,
      "name": "Christopher de Wind",
      "country": "Netherlands Antilles",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d245",
      "table": 2,
      "name": "Carmen Liliana Pérez Canal",
      "country": "Peru",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d245",
      "table": 3,
      "name": "Cengizhan Tatar",
      "country": "Turkey",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d245",
      "table": 3,
      "name": "Linda Maria Giacometti",
      "country": "Italy",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d245",
      "table": 3,
      "name": "Jessi Luzius",
      "country": "United States",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d245",
      "table": 3,
      "name": "Kiyah Edwards",
      "country": "United States",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d245",
      "table": 4,
      "name": "Libio Carcasses",
      "country": "United States",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d245",
      "table": 4,
      "name": "Guillermo Gonzalez Soto",
      "country": "Chile",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d245",
      "table": 4,
      "name": "Antoine CARLOTTI",
      "country": "France",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d245",
      "table": 4,
      "name": "Masumi Negishi",
      "country": "Japan",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d245",
      "table": 5,
      "name": "Amornrat Wannaphong - Koch",
      "country": "Thailand",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d245",
      "table": 5,
      "name": "Wim Stultiens",
      "country": "Belgium",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d245",
      "table": 5,
      "name": "Nino Laitadze",
      "country": "Georgia",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d245",
      "table": 5,
      "name": "Pamela Locatelli",
      "country": "Italy",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d245",
      "table": 6,
      "name": "Ondine Sivell",
      "country": "France",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d245",
      "table": 6,
      "name": "Domenic Hacker",
      "country": "Austria",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d245",
      "table": 6,
      "name": "Recayi Corap",
      "country": "Denmark",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d245",
      "table": 6,
      "name": "Viktor Fisenko",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d245",
      "table": 7,
      "name": "Roxane Marais",
      "country": "France",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d245",
      "table": 7,
      "name": "Marlena Rolińska",
      "country": "Poland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d245",
      "table": 7,
      "name": "Sascha Lang",
      "country": "Germany",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d245",
      "table": 7,
      "name": "Kyrylo Halenkov",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d245",
      "table": 8,
      "name": "Yurii Popov",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d245",
      "table": 8,
      "name": "Ewa Wardega",
      "country": "Poland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d245",
      "table": 8,
      "name": "Andreea-Oana Dumitrescu",
      "country": "United Kingdom",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d245",
      "table": 8,
      "name": "Zhana Ivanova",
      "country": "Bulgaria",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d245",
      "table": 9,
      "name": "Gohar Sargsyan",
      "country": "Italy",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d245",
      "table": 9,
      "name": "Oksana Halenkova",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d245",
      "table": 9,
      "name": "Jasmine Chiu",
      "country": "Taiwan",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d245",
      "table": 9,
      "name": "Ralf Monno",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "d245",
      "table": 10,
      "name": "Roman Ionela Gabriela",
      "country": "Romania",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "d245",
      "table": 10,
      "name": "Emma Oyuntsetseg Buyan",
      "country": "Sweden",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "d245",
      "table": 10,
      "name": "Tyra Wigg",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "d245",
      "table": 10,
      "name": "Aleh Kamarou",
      "country": "Belarus",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "gryden",
      "table": 1,
      "name": "Jose Tanhueco",
      "country": "Canada",
      "category": "Thai massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "gryden",
      "table": 1,
      "name": "Alexandra Lind",
      "country": "Sweden",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "gryden",
      "table": 1,
      "name": "Bernadette Cunanan",
      "country": "Italy",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "gryden",
      "table": 1,
      "name": "Brice Avon",
      "country": "France",
      "category": "Body Shaping massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "gryden",
      "table": 2,
      "name": "Bobo Patthanawan",
      "country": "Slovakia",
      "category": "Thai massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "gryden",
      "table": 2,
      "name": "Petya Dimitrova",
      "country": "Italy",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "gryden",
      "table": 2,
      "name": "YVETTE PONS",
      "country": "Spain",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "gryden",
      "table": 2,
      "name": "Dircelia Canzano",
      "country": "Italy",
      "category": "Body Shaping massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "gryden",
      "table": 3,
      "name": "Pichchayaporn Sitte",
      "country": "Thailand",
      "category": "Thai massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "gryden",
      "table": 3,
      "name": "Irena Smirin",
      "country": "Canada",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "gryden",
      "table": 3,
      "name": "Isabelle Guillien",
      "country": "France",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "gryden",
      "table": 3,
      "name": "CHRISTMA NATHALI",
      "country": "Indonesia",
      "category": "Body Shaping massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "gryden",
      "table": 4,
      "name": "Alain Bianchini",
      "country": "United Kingdom",
      "category": "Chair massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "gryden",
      "table": 4,
      "name": "Rasa Sakaliene",
      "country": "Lithuania",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "gryden",
      "table": 4,
      "name": "Katarzyna Wiszniewska",
      "country": "Poland",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "gryden",
      "table": 4,
      "name": "Ivan Lyndiuk",
      "country": "Ukraine",
      "category": "Body Shaping massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "gryden",
      "table": 5,
      "name": "Anne Breinberg",
      "country": "Denmark",
      "category": "Chair massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "gryden",
      "table": 5,
      "name": "Ilona Łapczyńska",
      "country": "Poland",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "gryden",
      "table": 5,
      "name": "KRISTINA BURBULĖ",
      "country": "Lithuania",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "gryden",
      "table": 5,
      "name": "Laura Cavarischia",
      "country": "Italy",
      "category": "Body Shaping massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "gryden",
      "table": 6,
      "name": "Inese Volrate",
      "country": "Latvia",
      "category": "Chair massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "gryden",
      "table": 6,
      "name": "Emmanuelle ISHIBASHI",
      "country": "Australia",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "gryden",
      "table": 6,
      "name": "Pitiprapada Srikaew",
      "country": "United States",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "gryden",
      "table": 6,
      "name": "Patrick Maldonado",
      "country": "Germany",
      "category": "Body Shaping massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "gryden",
      "table": 7,
      "name": "Muhammet KESKİN",
      "country": "Turkey",
      "category": "Chair massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "gryden",
      "table": 7,
      "name": "Aleksandra Poprawska",
      "country": "Poland",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "gryden",
      "table": 7,
      "name": "Milica Radojičić",
      "country": "Serbia",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "13:55",
      "roundNumber": 4,
      "room": "gryden",
      "table": 7,
      "name": "Vicky Højgaard",
      "country": "Denmark",
      "category": "Body Shaping massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "gryden",
      "table": 8,
      "name": "Panuwat Srisamajarn",
      "country": "United States",
      "category": "Chair massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "gryden",
      "table": 8,
      "name": "Marzena Czyżewska",
      "country": "Poland",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "gryden",
      "table": 8,
      "name": "Serena Marie Licastro",
      "country": "United States",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "10:00",
      "roundNumber": 1,
      "room": "gryden",
      "table": 9,
      "name": "Sami Alireza Afshar",
      "country": "Afghanistan",
      "category": "Chair massage"
    },
    {
      "day": "sat",
      "round": "11:15",
      "roundNumber": 2,
      "room": "gryden",
      "table": 9,
      "name": "Carla Zamfir",
      "country": "Romania",
      "category": "Facial Massage"
    },
    {
      "day": "sat",
      "round": "12:35",
      "roundNumber": 3,
      "room": "gryden",
      "table": 9,
      "name": "Kamila Michalik",
      "country": "Poland",
      "category": "Facial Massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "b086",
      "table": 1,
      "name": "Serena Marie Licastro",
      "country": "United States",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "b086",
      "table": 1,
      "name": "Eleftherios Plakidas",
      "country": "Germany",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "b086",
      "table": 1,
      "name": "James Suther",
      "country": "United Kingdom",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "b086",
      "table": 1,
      "name": "Camilla Thyme Palbom",
      "country": "Denmark",
      "category": "Chair massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "b086",
      "table": 2,
      "name": "Marlene Christiansen",
      "country": "Denmark",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "b086",
      "table": 2,
      "name": "HO YU CHIEH",
      "country": "Taiwan",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "b086",
      "table": 2,
      "name": "Żaneta Porowska",
      "country": "Poland",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "b086",
      "table": 2,
      "name": "Nicolae Prip",
      "country": "Romania",
      "category": "Chair massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "b086",
      "table": 3,
      "name": "Antonio Costea",
      "country": "Canada",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "b086",
      "table": 3,
      "name": "Cengizhan Tatar",
      "country": "Turkey",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "b086",
      "table": 3,
      "name": "Jana Havlínová",
      "country": "Czech Republic",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "b086",
      "table": 3,
      "name": "Alain Bianchini",
      "country": "United Kingdom",
      "category": "Chair massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "b086",
      "table": 4,
      "name": "Marlena Rolińska",
      "country": "Poland",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "b086",
      "table": 4,
      "name": "Jasmine Chiu",
      "country": "Taiwan",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "b086",
      "table": 4,
      "name": "Victor F. Martin",
      "country": "United States",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "b086",
      "table": 4,
      "name": "Panuwat Srisamajarn",
      "country": "United States",
      "category": "Chair massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "b086",
      "table": 5,
      "name": "Chan Tak Chi",
      "country": "China",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "b086",
      "table": 5,
      "name": "Jose Tanhueco",
      "country": "Canada",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "b086",
      "table": 5,
      "name": "Kornelia Dziubacka",
      "country": "Poland",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "b086",
      "table": 5,
      "name": "GERARDA CIRULLI KOLEY",
      "country": "Italy",
      "category": "Chair massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "b086",
      "table": 6,
      "name": "Pichchayaporn Sitte",
      "country": "Thailand",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "b086",
      "table": 6,
      "name": "Salvatore Pio Polimeni",
      "country": "Italy",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "b086",
      "table": 6,
      "name": "Bernadette Cunanan",
      "country": "Italy",
      "category": "Body Shaping massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "b086",
      "table": 6,
      "name": "Anna Quercia",
      "country": "Italy",
      "category": "Chair massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "b086",
      "table": 7,
      "name": "Sarah Skovgaard",
      "country": "Denmark",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "b086",
      "table": 7,
      "name": "Dana Vachulíková",
      "country": "Slovakia",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "b086",
      "table": 7,
      "name": "Marzena Czyżewska",
      "country": "Poland",
      "category": "Body Shaping massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "b086",
      "table": 7,
      "name": "CHRISTMA NATHALI",
      "country": "Indonesia",
      "category": "Body Shaping massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "b086",
      "table": 8,
      "name": "haojun qiu",
      "country": "China",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "b086",
      "table": 8,
      "name": "Bobo Patthanawan",
      "country": "Slovakia",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "b086",
      "table": 8,
      "name": "Rolandas Jasilionis",
      "country": "Lithuania",
      "category": "Body Shaping massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "b086",
      "table": 8,
      "name": "Ivan Lyndiuk",
      "country": "Ukraine",
      "category": "Body Shaping massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "b086",
      "table": 9,
      "name": "Tim LAUGHLIN",
      "country": "French Polynesia",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "b086",
      "table": 9,
      "name": "Pamela Locatelli",
      "country": "Italy",
      "category": "Freestyle massage - Eastern inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "b086",
      "table": 9,
      "name": "Emeline Remiot",
      "country": "France",
      "category": "Body Shaping massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "b086",
      "table": 9,
      "name": "Vicky Højgaard",
      "country": "Denmark",
      "category": "Body Shaping massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 1,
      "name": "Anne Breinberg",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 1,
      "name": "Inese Volrate",
      "country": "Latvia",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 1,
      "name": "Rasa Sakaliene",
      "country": "Lithuania",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 2,
      "name": "Ievgen Bokov",
      "country": "Ireland",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 2,
      "name": "Christopher de Wind",
      "country": "Netherlands Antilles",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 2,
      "name": "Libio Carcasses",
      "country": "United States",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 3,
      "name": "Aram Muradyan",
      "country": "Lithuania",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 3,
      "name": "Vanny Yon",
      "country": "Canada",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 3,
      "name": "Simon Kindahl",
      "country": "Sweden",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 4,
      "name": "IEVA KNIEŽIENĖ",
      "country": "Lithuania",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 4,
      "name": "Mark Vangkilde",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 4,
      "name": "Ole Krüger",
      "country": "Germany",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 5,
      "name": "Lijana Untulienė",
      "country": "Lithuania",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 5,
      "name": "Josiane Serio",
      "country": "Brazil",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 5,
      "name": "Sonya Keogh",
      "country": "Ireland",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 6,
      "name": "Ilona Skjoldshøj",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 6,
      "name": "Alexandra De Geest",
      "country": "Belgium",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 6,
      "name": "Laura McAulay",
      "country": "United Kingdom",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 7,
      "name": "Ciara Ni Dhiomasaigh",
      "country": "Ireland",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 7,
      "name": "Freja Hansen",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 7,
      "name": "Hanne Aaholm-Hansen",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 8,
      "name": "Nishit Shah",
      "country": "Canada",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 8,
      "name": "Rotaru Cristinel",
      "country": "Romania",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 8,
      "name": "Karoline Thrysøe",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 9,
      "name": "Signe Hansen",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 9,
      "name": "Kateryna Bohush",
      "country": "Lithuania",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 9,
      "name": "Ralf Monno",
      "country": "Switzerland",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 10,
      "name": "Wioletta Cassagneres",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 10,
      "name": "Fanny MARDELLAT",
      "country": "France",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 10,
      "name": "Genti Musliu",
      "country": "Sweden",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 11,
      "name": "Anne Ravndal",
      "country": "Denmark",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 11,
      "name": "Naiara Gatto",
      "country": "Brazil",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c233",
      "table": 11,
      "name": "Rebecca Moody",
      "country": "United States",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c233",
      "table": 12,
      "name": "Pamela Golden Moore",
      "country": "Ireland",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c233",
      "table": 12,
      "name": "John Podobnik",
      "country": "Canada",
      "category": "Swedish massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c275",
      "table": 1,
      "name": "Katarzyna Wiszniewska",
      "country": "Poland",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c275",
      "table": 1,
      "name": "Pitiprapada Srikaew",
      "country": "United States",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c275",
      "table": 1,
      "name": "Milica Radojičić",
      "country": "Serbia",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c275",
      "table": 1,
      "name": "Emilia Greenan",
      "country": "United Kingdom",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c275",
      "table": 2,
      "name": "Iwona Grzelec",
      "country": "Poland",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c275",
      "table": 2,
      "name": "YUKA SOMEYA",
      "country": "Japan",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c275",
      "table": 2,
      "name": "Kiyah Edwards",
      "country": "United States",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c275",
      "table": 2,
      "name": "Nadiia Minenko",
      "country": "Italy",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c275",
      "table": 3,
      "name": "Domenico Barin",
      "country": "Italy",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c275",
      "table": 3,
      "name": "Ewa Wardega",
      "country": "Poland",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c275",
      "table": 3,
      "name": "Andreea-Oana Dumitrescu",
      "country": "United Kingdom",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c275",
      "table": 3,
      "name": "Roxane Marais",
      "country": "France",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c275",
      "table": 4,
      "name": "Alison Cattani",
      "country": "Canada",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c275",
      "table": 4,
      "name": "Lucie GUILLOU",
      "country": "France",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c275",
      "table": 4,
      "name": "Mickaël Denis",
      "country": "France",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "13:55",
      "roundNumber": 4,
      "room": "c275",
      "table": 4,
      "name": "John Feng",
      "country": "United States",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c275",
      "table": 5,
      "name": "Nicolas Van Oel",
      "country": "France",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c275",
      "table": 5,
      "name": "Stéphanie DATIL",
      "country": "France",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c275",
      "table": 5,
      "name": "Celso Serio",
      "country": "Brazil",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c275",
      "table": 6,
      "name": "Elena Cerneaev",
      "country": "Moldova",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c275",
      "table": 6,
      "name": "Coco Elsøe Daugaard",
      "country": "Denmark",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c275",
      "table": 6,
      "name": "Emma Sofie Bach",
      "country": "Denmark",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c275",
      "table": 7,
      "name": "Florian Erdmann",
      "country": "Germany",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c275",
      "table": 7,
      "name": "Pornnipa Smith",
      "country": "United Kingdom",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c275",
      "table": 7,
      "name": "Linda Olsen",
      "country": "Denmark",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "c275",
      "table": 8,
      "name": "Marie Andersen",
      "country": "Norway",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "c275",
      "table": 8,
      "name": "Stine Pedersen",
      "country": "Denmark",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "c275",
      "table": 8,
      "name": "Dina Kodatko",
      "country": "Belgium",
      "category": "Wellness massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d223",
      "table": 1,
      "name": "Patrick Maldonado",
      "country": "Germany",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d223",
      "table": 1,
      "name": "Sami Alireza Afshar",
      "country": "Afghanistan",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d223",
      "table": 1,
      "name": "Liu Hsnji tsao",
      "country": "Taiwan",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d223",
      "table": 1,
      "name": "Anthony Nguyen",
      "country": "Canada",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d223",
      "table": 2,
      "name": "KUAN-NIEN(Keith) LAI",
      "country": "Taiwan",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d223",
      "table": 2,
      "name": "Nafiye Ballikaya",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d223",
      "table": 2,
      "name": "Misuzu Kishigami",
      "country": "United States",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d223",
      "table": 2,
      "name": "Harpa Finnsdóttir",
      "country": "Iceland",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d223",
      "table": 3,
      "name": "Xaisongkhame Phonexaiya",
      "country": "United States",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d223",
      "table": 3,
      "name": "Attila Bodo",
      "country": "Ireland",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d223",
      "table": 3,
      "name": "Alexandru Modvala",
      "country": "Switzerland",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d223",
      "table": 3,
      "name": "Aliaksei Tsiareshchanka",
      "country": "Poland",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d223",
      "table": 4,
      "name": "Jessi Luzius",
      "country": "United States",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d223",
      "table": 4,
      "name": "Antoine CARLOTTI",
      "country": "France",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d223",
      "table": 4,
      "name": "Nino Laitadze",
      "country": "Georgia",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d223",
      "table": 4,
      "name": "Recayi Corap",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d223",
      "table": 5,
      "name": "Emma Oyuntsetseg Buyan",
      "country": "Sweden",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d223",
      "table": 5,
      "name": "Matej Vasilišin",
      "country": "Slovakia",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d223",
      "table": 5,
      "name": "Gil Peerspain",
      "country": "Spain",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d223",
      "table": 5,
      "name": "Yan Hung sun Frank",
      "country": "China",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d223",
      "table": 6,
      "name": "Lisa-Maria Resch-Katholnig",
      "country": "Austria",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d223",
      "table": 6,
      "name": "Lene Rye",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d223",
      "table": 6,
      "name": "kevin Qian",
      "country": "Canada",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d223",
      "table": 6,
      "name": "Hege Rokseth",
      "country": "Norway",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d223",
      "table": 7,
      "name": "Chanette Jørgensen",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d223",
      "table": 7,
      "name": "Arnaud Corbion",
      "country": "France",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d223",
      "table": 7,
      "name": "Aoife Fitzgerald",
      "country": "Ireland",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d223",
      "table": 7,
      "name": "Travis Fisher",
      "country": "United States",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d223",
      "table": 8,
      "name": "Paraya Navon",
      "country": "United States",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d223",
      "table": 8,
      "name": "Stine Langvad",
      "country": "Denmark",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d223",
      "table": 8,
      "name": "Nerijus Malijonis",
      "country": "Lithuania",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d223",
      "table": 8,
      "name": "Manuela Reis",
      "country": "Portugal",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d223",
      "table": 9,
      "name": "gabriel perroud",
      "country": "United States",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d223",
      "table": 9,
      "name": "Tomas Repečka",
      "country": "Lithuania",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d223",
      "table": 9,
      "name": "Amy Hintze",
      "country": "Germany",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d223",
      "table": 9,
      "name": "Aleh Kamarou",
      "country": "Belarus",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d223",
      "table": 10,
      "name": "Dmytro Kurinskyi",
      "country": "Ukraine",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d223",
      "table": 10,
      "name": "Milan Šimrak",
      "country": "Montenegro",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d223",
      "table": 10,
      "name": "CHIA-JUNG WANG",
      "country": "Taiwan",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d223",
      "table": 10,
      "name": "Coralie Venturin",
      "country": "France",
      "category": "Sports massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 1,
      "name": "Dircelia Canzano",
      "country": "Italy",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 1,
      "name": "Muhammet KESKİN",
      "country": "Turkey",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 1,
      "name": "Alona Petrunia",
      "country": "Germany",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d245",
      "table": 1,
      "name": "Avetik Vanyan",
      "country": "Armenia",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 2,
      "name": "Pia Ørtoft",
      "country": "Denmark",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 2,
      "name": "Carmen Liliana Pérez Canal",
      "country": "Peru",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 2,
      "name": "Guillermo Gonzalez Soto",
      "country": "Chile",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d245",
      "table": 2,
      "name": "Wim Stultiens",
      "country": "Belgium",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 3,
      "name": "Ondine Sivell",
      "country": "France",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 3,
      "name": "Domenic Hacker",
      "country": "Austria",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 3,
      "name": "Roman Ionela Gabriela",
      "country": "Romania",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d245",
      "table": 3,
      "name": "Sascha Lang",
      "country": "Germany",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 4,
      "name": "Gohar Sargsyan",
      "country": "Italy",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 4,
      "name": "Viktor Fisenko",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 4,
      "name": "Wirada Innork",
      "country": "Thailand",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d245",
      "table": 4,
      "name": "Naomi Holm",
      "country": "Denmark",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 5,
      "name": "Kyrylo Halenkov",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 5,
      "name": "Zhana Ivanova",
      "country": "Bulgaria",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 5,
      "name": "Alexandre Begouen",
      "country": "Canada",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d245",
      "table": 5,
      "name": "Stella Barseghyan",
      "country": "Armenia",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 6,
      "name": "Oksana Halenkova",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 6,
      "name": "Monique Redman",
      "country": "Denmark",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 6,
      "name": "Joshua Snow",
      "country": "Australia",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d245",
      "table": 6,
      "name": "Jorgedand Mogro",
      "country": "Canada",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 7,
      "name": "Sofia Guimarães",
      "country": "Portugal",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 7,
      "name": "Yurii Popov",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 7,
      "name": "Barbara Gabbianelli",
      "country": "Italy",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d245",
      "table": 7,
      "name": "Alina Kuzmych",
      "country": "Ukraine",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 8,
      "name": "Tyra Wigg",
      "country": "Switzerland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 8,
      "name": "Dominik Bodo",
      "country": "Ireland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 8,
      "name": "Zoltán Kódor",
      "country": "Hungary",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "13:30",
      "roundNumber": 4,
      "room": "d245",
      "table": 8,
      "name": "Kwok Shum Hubert Mak",
      "country": "Canada",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 9,
      "name": "Ali Arda Durmaz",
      "country": "Turkey",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 9,
      "name": "IOANNIS DAFNAS",
      "country": "Greece",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 9,
      "name": "Żaneta Sroka",
      "country": "Poland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 10,
      "name": "Vladislav Kornash",
      "country": "Ukraine",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 10,
      "name": "Raj Cuppoor",
      "country": "Ireland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 10,
      "name": "Rimantas Bruzbartas",
      "country": "Norway",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 11,
      "name": "Igor Mamenka",
      "country": "Ukraine",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 11,
      "name": "Irosh Mendis",
      "country": "Czech Republic",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 11,
      "name": "Aleksandr Nikitchenko",
      "country": "Ireland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "d245",
      "table": 12,
      "name": "Ademir Santos",
      "country": "Brazil",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "d245",
      "table": 12,
      "name": "ZOLTÁN CSABA HORVÁTH",
      "country": "Romania",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "d245",
      "table": 12,
      "name": "Damian Sipiorski",
      "country": "Poland",
      "category": "Freestyle massage - Western inspired"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 1,
      "name": "Brice Avon",
      "country": "France",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 1,
      "name": "Laura Cavarischia",
      "country": "Italy",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "gryden",
      "table": 1,
      "name": "Alexandra Lind",
      "country": "Sweden",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 2,
      "name": "Petya Dimitrova",
      "country": "Italy",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 2,
      "name": "YVETTE PONS",
      "country": "Spain",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "gryden",
      "table": 2,
      "name": "Irena Smirin",
      "country": "Canada",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 3,
      "name": "Isabelle Guillien",
      "country": "France",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 3,
      "name": "Ilona Łapczyńska",
      "country": "Poland",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "gryden",
      "table": 3,
      "name": "KRISTINA BURBULĖ",
      "country": "Lithuania",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 4,
      "name": "Emmanuelle ISHIBASHI",
      "country": "Australia",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 4,
      "name": "Aleksandra Poprawska",
      "country": "Poland",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "gryden",
      "table": 4,
      "name": "Carla Zamfir",
      "country": "Romania",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 5,
      "name": "Linda Maria Giacometti",
      "country": "Italy",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 5,
      "name": "Masumi Negishi",
      "country": "Japan",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "gryden",
      "table": 5,
      "name": "Nini Bagnasvili",
      "country": "Lithuania",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 6,
      "name": "Dolorès Guillemet",
      "country": "France",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 6,
      "name": "Anna Kustova",
      "country": "Israel",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "gryden",
      "table": 6,
      "name": "Ulla Bojsen",
      "country": "Denmark",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 7,
      "name": "Alexander Kluge",
      "country": "Germany",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 7,
      "name": "Yen Jung Lin",
      "country": "Taiwan",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "gryden",
      "table": 7,
      "name": "Bella Bayar Enkhjargal",
      "country": "Sweden",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 8,
      "name": "Izabela Białek",
      "country": "Poland",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 8,
      "name": "Marzena Lisińska",
      "country": "Poland",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "12:10",
      "roundNumber": 3,
      "room": "gryden",
      "table": 8,
      "name": "Kamila Michalik",
      "country": "Poland",
      "category": "Facial massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 9,
      "name": "Mayu Iwai",
      "country": "Japan",
      "category": "Thai massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 9,
      "name": "Milen Tomanov",
      "country": "Bulgaria",
      "category": "Thai massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 10,
      "name": "Ubonrut Boromthongchum",
      "country": "Thailand",
      "category": "Thai massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 10,
      "name": "Teppong Yindee",
      "country": "Germany",
      "category": "Thai massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 11,
      "name": "Amornrat Wannaphong - Koch",
      "country": "Thailand",
      "category": "Thai massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 11,
      "name": "Julie Bak",
      "country": "France",
      "category": "Thai massage"
    },
    {
      "day": "sun",
      "round": "09:30",
      "roundNumber": 1,
      "room": "gryden",
      "table": 12,
      "name": "Sean-Michael Latimour",
      "country": "Canada",
      "category": "Thai massage"
    },
    {
      "day": "sun",
      "round": "10:50",
      "roundNumber": 2,
      "room": "gryden",
      "table": 12,
      "name": "Riko “Fresh” Chirito",
      "country": "Peru",
      "category": "Thai massage"
    }
  ]
};
