# practica_design

Landing page for an online course, "Academy of Management in Interior Design" by Oksana Fedorova. Built from the client's brief and revision notes. The page content itself is in Russian.

<p align="center">
  <img src="screenshots/desktop.png" width="640" alt="Desktop version">
  <img src="screenshots/mobile.png" width="200" alt="Mobile version">
</p>

## Features

- Responsive layout from 375 px up to wide screens, no horizontal scroll
- Sections: about the course, results, target audience, expert, curriculum, pricing, reviews
- Reviews open in a modal window
- Cookie consent banner
- Geologica font, inline SVG icons

## Project structure

```
practica_design/
├── index.html
├── assets/
│   ├── css/    # reset.css, styles.css
│   └── img/
└── screenshots/
```

The client's briefs (`.docx`) are in the repository root.

## Run locally

No build step. Open `index.html` in a browser, or start a local server:

```bash
python3 -m http.server 8000
```

## Tech stack

HTML · CSS · JavaScript
