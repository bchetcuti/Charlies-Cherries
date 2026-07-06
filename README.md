# Charlies Cherries

A tiny static website for Charlie’s pretend restaurant: **Charlies Cherries**.

The site is designed to be playful, iPad-friendly and safe by default:

- no backend
- no analytics
- no real booking submission
- no personal surname, school, address or contact details
- noindex/nofollow headers and robots.txt included
- printable menu, chef certificate, launch card and staff badges included
- local-only Chef Desk for pretend restaurant changes on one device

## Pages

- `/` — main restaurant website
- `/menu.html` — printable restaurant menu
- `/certificate.html` — printable Founder & Head Chef certificate
- `/launch-card.html` — printable grand opening card using `/assets/img/qr.png`
- `/chef-desk.html` — local-only pretend control panel for Chef Charlie
- `/boss-mode.html` — compatibility page for the Chef Desk experience
- `/opening-day.html` — opening checklist and sticker book
- `/staff-badges.html` — printable staff badges for Charlie, Mum, Dad and future helpers

## v1.3 Charlie-led additions

v1.3 adds the first set of requests Charlie made after using the app:

- standard menu additions: Fried Rice, Nana’s Sausage Rolls and Chicken Nuggets
- desserts: Banana Split, Donuts and Ice Cream
- named carpark tables: Vigo Views, Staggs Barber and Eat with Kim
- new review: “Best ribs I’ve had in Seddon.”
- opening hours field in Chef Desk
- party package: Weekend at Bernie’s Party Package
- extra stickers: points, coffee and ice cream
- printable staff badges: Charlie, Mum, Dad and a blank helper badge

All editable restaurant details remain local-only in browser storage.

## QR code

The launch card expects a QR image at:

```text
/assets/img/qr.png
```

If the QR file is missing, the launch card falls back to a visible placeholder. The QR image is not required for the site to function.

## Chef Desk

`/chef-desk.html` lets Chef Charlie update pretend details:

- opening announcement
- special of the day
- dessert of the day
- opening hours
- favourite table
- three carpark table names
- restaurant mood
- party package
- pretend review
- one secret menu invention

These changes are saved only in the browser’s local storage on the device being used. They are not sent to a server and they do not change the public site for other visitors.

## Deploy to Cloudflare Pages

1. Create or use the GitHub repo.
2. Upload these files to the repo root.
3. In Cloudflare Pages, create a project from the repo.
4. Framework preset: **None**.
5. Build command: leave blank.
6. Build output directory: `/`.
7. Deploy.

Recommended deployment: use the default `*.pages.dev` URL and keep the site unlinked from public websites.

## Suggested reveal/play flow

1. Open the site on Charlie’s iPad.
2. Visit Chef Desk and let her change the special, dessert and opening hours.
3. Show the named carpark tables.
4. Print the staff badges.
5. Use Opening Day to tick off the restaurant jobs.
6. Book a pretend table and print the kitchen ticket.

## Future roadmap

Keep the app static/local-only until there is a real reason to add infrastructure. Consider Cloudflare Worker + D1 + optional R2 later only if Charlie wants shared multi-device updates, saved menus across devices, or uploaded restaurant assets.
