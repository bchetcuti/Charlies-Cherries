# Charlies Cherries

A tiny static website for Charlie’s pretend restaurant: **Charlies Cherries**.

The site is designed to be playful, iPad-friendly and safe by default:

- no backend
- no analytics
- no real booking submission
- no personal surname, school, address or contact details
- noindex/nofollow headers and robots.txt included
- printable menu and chef certificate included

## Pages

- `/` — main restaurant website
- `/menu.html` — printable restaurant menu
- `/certificate.html` — printable Founder & Head Chef certificate
- `/launch-card.html` — printable grand opening card with QR-code placeholder

## Deploy to Cloudflare Pages

1. Create a new GitHub repo.
2. Upload these files to the repo root.
3. In Cloudflare Pages, create a project from the repo.
4. Framework preset: **None**.
5. Build command: leave blank.
6. Build output directory: `/`.
7. Deploy.

Recommended first deployment: use the default `*.pages.dev` URL and keep the site unlinked from public websites.

## Suggested reveal

Print the menu and certificate, then open `/launch-card.html` after deployment and add or paste a QR code if you want a physical reveal card:

> Scan to visit Charlies Cherries  
> Tiny boss. Big flavour.

## Small edits Charlie can request later

- Change the special of the day
- Add a dessert
- Rename the carpark tables
- Add a new review
- Add opening hours
- Add a party package
