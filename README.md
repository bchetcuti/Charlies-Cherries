# Charlies Cherries

A tiny static website for Charlie’s pretend restaurant: **Charlies Cherries**.

The site is designed to be playful, iPad-friendly and safe by default:

- no backend
- no analytics
- no real booking submission
- no personal surname, school, address or contact details
- noindex/nofollow headers and robots.txt included
- printable menu, chef certificate and launch card included
- local-only Boss Mode for pretend restaurant changes on one device

## Pages

- `/` — main restaurant website
- `/menu.html` — printable restaurant menu
- `/certificate.html` — printable Founder & Head Chef certificate
- `/launch-card.html` — printable grand opening card using `/assets/img/qr.png`
- `/boss-mode.html` — local-only pretend control panel for Chef Charlie

## QR code

The launch card expects a QR image at:

```text
/assets/img/qr.png
```

If the QR file is missing, the launch card falls back to a visible placeholder. The QR image is not required for the site to function.

## Boss Mode

`/boss-mode.html` lets Chef Charlie update three pretend details:

- opening announcement
- chef special
- favourite table name

These changes are saved only in the browser’s local storage on the device being used. They are not sent to a server and they do not change the public site for other visitors.

## Deploy to Cloudflare Pages

1. Create or use the GitHub repo.
2. Upload these files to the repo root.
3. In Cloudflare Pages, create a project from the repo.
4. Framework preset: **None**.
5. Build command: leave blank.
6. Build output directory: `/`.
7. Deploy.

Recommended first deployment: use the default `*.pages.dev` URL and keep the site unlinked from public websites.

## Suggested reveal

Print the launch card, menu and certificate.

Recommended reveal order:

1. Hand Charlie the Founder & Head Chef certificate.
2. Give her the launch card with the QR code.
3. Let her scan it on the iPad.
4. Open Boss Mode and let her change the first special herself.

## Small edits Charlie can request later

- Change the special of the day
- Add a dessert
- Rename the carpark tables
- Add a new review
- Add opening hours
- Add a party package
