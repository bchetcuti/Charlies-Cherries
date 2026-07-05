# Charlies Cherries

A tiny static website for Charlie’s pretend restaurant: **Charlies Cherries**.

The site is designed to be playful, iPad-friendly and safe by default:

- no backend
- no analytics
- no real booking submission
- no personal surname, school, address or contact details
- noindex/nofollow headers and robots.txt included
- printable menu, chef certificate and launch card included
- local-only Chef Desk for pretend restaurant changes on one device
- local-only sticker book and opening checklist

## Pages

- `/` — main restaurant website
- `/menu.html` — printable restaurant menu
- `/certificate.html` — printable Founder & Head Chef certificate
- `/launch-card.html` — printable grand opening card using `/assets/img/qr.png`
- `/chef-desk.html` — local-only pretend Restaurant HQ for Chef Charlie
- `/boss-mode.html` — compatibility copy of Chef Desk
- `/opening-day.html` — local-only opening day checklist and print station

## v1.2 features

v1.2 is about making the site more explorable for an 8-year-old restaurant founder.

Included:

- Chef Desk, replacing the adult-sounding Boss Mode language
- specials board controls for announcement, special dish, table name and restaurant mood
- Menu invention lab for one local-only secret menu item
- the invented item appears on the home page and in the booking meal list on the same device
- pretend booking now creates a printable kitchen order ticket
- Opening Day checklist for launch preparation
- sticker book with local-only unlocks for exploring the site

Everything is stored in browser `localStorage`. Nothing is sent to a server and changes do not update the public site for other visitors.

## QR code

The launch card expects a QR image at:

```text
/assets/img/qr.png
```

If the QR file is missing, the launch card falls back to a visible placeholder. The QR image is not required for the site to function.

## Chef Desk

`/chef-desk.html` lets Chef Charlie update pretend details:

- opening announcement
- chef special
- favourite table name
- restaurant mood
- invented dish emoji/name/price/note/stamp

These changes are saved only in the browser’s local storage on the device being used. They are not sent to a server and they do not change the public site for other visitors.

## Opening Day

`/opening-day.html` gives Charlie a launch checklist:

- menu printed
- chef certificate displayed
- QR launch card ready
- napkins ready for rib sauce
- taste tester appointed
- dessert decision made
- dining room approved by the boss

When all jobs are complete, the site unlocks the “Restaurant ready” sticker.

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
4. Open Chef Desk and let her change the first special herself.
5. Let her invent one new secret menu item.
6. Make a pretend booking and print the kitchen order ticket.
7. Open Opening Day and tick off the restaurant jobs together.

## Small edits Charlie can request later

- Change the special of the day
- Add a dessert
- Rename the carpark tables
- Add a new review
- Add opening hours
- Add a party package
- Add more stickers
- Add printable staff badges
