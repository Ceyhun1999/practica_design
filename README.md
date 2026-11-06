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

## Consultation form

Both consultation buttons open the native dialog in `index.html`. Styles are in
`assets/css/consult-form.css`; behavior is in `assets/js/consult-form.js`.

Telegram delivery is deferred. Set `data-endpoint` on `#consult-form` to the
server-side receiver URL once it is ready. The receiver accepts a JSON POST with
`name`, `phone`, `preferred_time`, `consent`, and `source`; return a successful HTTP
status and JSON `{ "success": true }` only after accepting the request. Keep bot
credentials on the server. Until connected, submission shows a Telegram contact
link and never claims the application was received.

## Course checkout

The tariff buttons open `#payment-modal`. `assets/js/payment-config.js` defines
seven variants: `basic.full`, `basic.months3`, `basic.months5`, `advanced.full`,
`advanced.months3`, `advanced.months5`, and `team.full`.

For each variant set `amount` to the confirmed **total** in rubles and `url` to its
HTTPS checkout link. Installment totals must already include the provider's
confirmed terms; no commission percentage is guessed in the browser. Monthly
amounts shown in the modal are approximate; the bank supplies the final schedule.
Until both amount and link are configured, checkout stays disabled and a Telegram
contact is offered. No payment is collected or marked successful on this site.

Full-payment prices currently match the page: 80,000 / 120,000 / 135,000 RUB.
The team price remains **per employee**, matching the existing tariff copy;
confirm the team billing unit with the provider before connecting its checkout.
If pricing changes, update both the configuration and tariff card copy.
