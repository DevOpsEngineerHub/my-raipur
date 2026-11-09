# My Raipur

A mobile-first city portal for Raipur. It is a static site with no dependencies: you need only Node 20 or newer.

## Run it on your computer

```bash
cd my-raipur
npm run dev
```

Open http://localhost:8080. The site rebuilds whenever you save a file in `data/`, `src/`, `public/`, `site.config.json` or `ads.json`. To test on your phone, connect it to the same Wi-Fi and open `http://<your-computer-ip>:8080`.

## Where things live

| What | File |
|---|---|
| Site name, tagline, contact email and WhatsApp | `site.config.json` |
| Cafes, places, schools, hospitals and every other listing | `data/listings.json` |
| Section names and the home page tiles | `data/categories.json` |
| Daily news, updated morning and evening | `data/news.json` |
| Events, this week's picks | `data/events.json`, `data/this-week.json` |
| Artists, Face of the Month, Old Raipur photos | `data/artists.json`, `data/faces.json`, `data/old-raipur.json` |
| Emergency numbers, portals, transport | `data/information.json` |
| History timeline and facts | `data/history.json`, `data/facts.json` |
| Ads | `ads.json` |
| Colours and layout | `public/assets/site.css` |

Each data file has a `_help` note at the top that explains its fields.

## Sample content

Anything marked `"sample": true` is placeholder content with a visible Sample badge. To build the live site without it, set the environment variable `SHOW_SAMPLES=0`. Sections with no real content then show a friendly empty state.

```bash
SHOW_SAMPLES=0 npm run build
```

Listings show a "Details being verified" label until you set `"verified": true` on them.

## Ads

Every ad space is a named slot in `ads.json`, and the space is always reserved so pages do not jump. A slot shows, in order:

1. A matching campaign from `campaigns` (image, text or your own HTML, with start and end dates).
2. A Google AdSense unit, if `adsense.enabled` is true and the slot has an `adsenseSlot` id.
3. A house placeholder that links to the Advertise page. Set `houseAds` to false to keep the space but hide the text.

To sell a space, add a campaign with the slot ids it should appear in and rebuild. Paid placements are labelled Sponsored. A campaign with `"category": "political"` is labelled Political advertisement with a Paid for by line. Check the rules for election advertising before you sell those.

Campaign dates are checked when the site is built. If you run dated campaigns, redeploy daily (see the deploy hook below).

The sticky phone banner is off by default. Turn it on with `"sticky": { "enabled": true }`.

## Deploy to Cloudflare Pages

**From GitHub (recommended).** Push this folder to a GitHub repository. In Cloudflare, go to Workers & Pages, then Create, then Pages, then Connect to Git. Use these settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: `SHOW_SAMPLES` = `0`, `NODE_VERSION` = `22`

**Direct upload.** Run `SHOW_SAMPLES=0 npm run build`, then `npx wrangler pages deploy dist`.

**Custom domain.** Add `myraipur.com` under the Pages project's Custom domains. Your domain is registered at Wix, so either move its nameservers to Cloudflare, or add the DNS record Cloudflare shows you in Wix's DNS settings.

**Daily rebuild (optional).** In the Pages project, create a deploy hook and call it from a scheduler each morning and evening. This refreshes dated ads and moves past events to the Past list.

## Daily news routine

Edit `data/news.json`: set `edition` to `morning` or `evening`, update `updated`, replace the items, then commit and push. Cloudflare redeploys in about a minute. Link to the original reporter, keep summaries to one line in your own words, and do not copy articles or images.

## Before you launch

- Set a real contact email in `site.config.json`. The one there is a placeholder. Add a WhatsApp number to switch on the WhatsApp button.
- Check every number and link in `data/information.json`, then set `lastChecked`.
- Have the Privacy page checked and expanded.
- Verify the listings, then set `"verified": true` on them.
- The site is English only. Fonts (Bricolage Grotesque and Instrument Sans, both open licence) are bundled in `public/assets/fonts/`, so nothing loads from Google and the site works offline when run locally.
