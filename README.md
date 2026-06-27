# CpDnmkV2

Interactive event coverage board for iConstantine at the 2026 World Championship in Massage in Copenhagen.

The site is plain HTML, CSS and JavaScript. There is no build step and no package installation.

## Folder structure

```text
CpDnmkV2/
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── data.js
│   └── app.js
└── img/
    ├── README.md
    ├── gof.jpg
    ├── zoltan-kodor.jpg
    ├── hubert-mak.jpg
    └── antonio-costea.jpg
```

The four JPG files are expected names. Until those images are added, the cards show an initials placeholder.

## Add a booked client

Open `js/data.js` and add one object to `clients` for each scheduled appearance:

```js
{
  id: "unique-client-round",
  name: "Display Name",
  officialName: "Exact schedule name",
  package: "Showcase",
  day: "sat",
  round: "12:35",
  room: "d223",
  category: "Sports massage",
  portrait: "display-name.jpg"
}
```

Valid room IDs are `c233`, `c275`, `d223`, `d245`, `gryden` and `b086`. Package names currently styled are `Signature` and `Showcase`.

## GitHub Pages

In the repository, open **Settings > Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.

The board will be available at:

```text
https://evoryder8-collab.github.io/CpDnmkV2/
```

## Source check

The data contains all 423 named schedule placements extracted from the two official PDFs. The four booked clients were visually checked against the source pages before being entered.
