# haileysilva.com

The website for Hailey Silva's birthday parties. The page up now is her first: **It's Fun to Be One**, Saturday, November 21, 2026 at 3:00 PM in Maple Ridge. The look follows the paper invite — cream paper, pink stripes, a scalloped edge, Fredoka, Quicksand, Dancing Script, and the same pink, lavender, and gold.

Each party is one folder of content. Shared components draw whatever the current folder says. When the next birthday starts, this one moves to `/archive/1` and stays there.

## Develop

```bash
npm install
npm run dev
```

Vite prints a local URL. These routes work in dev and in the production build:

| Route | What it shows |
| --- | --- |
| `/` | The current party |
| `/archive` | Little letters for each celebration, including the baby shower at [babysilva.com](https://babysilva.com) |
| `/archive/1` | Party 1 once it has been archived. Until then, a note that it is still the current party |
| anything else | A small not-found page inside the same frame |

## Build

```bash
npm test
npm run build
npm run preview
```

`npm test` checks the party files and the archive script. `npm run build` typechecks, validates the parties, builds the site, and copies `dist/index.html` to `dist/404.html` and `dist/200.html` so deep links survive static hosting.

## Deploy

The site is a static Vite build. Publish the `dist/` folder. Client routes such as `/archive/1` need the host to serve the app for unknown paths.

- **Netlify or Cloudflare Pages.** Build command `npm run build`, publish directory `dist`. `public/_redirects` and `netlify.toml` already send every path to `index.html`.
- **Vercel.** Build command `npm run build`, output directory `dist`. `vercel.json` at the repo root has the rewrite.
- **GitHub Pages** (user site or `haileysilva.com`). Build, then publish `dist`. `404.html` is the app, so a direct visit to `/archive/1` still loads. GitHub serves that file with a 404 status; the page itself renders.
- **Any other static server.** Fall back to `index.html`. Nginx: `try_files $uri $uri/ /index.html;`. Surge uses the generated `200.html`.

Point the domain at the host as you usually would. The app expects to live at the domain root.

## Where a party lives

```
src/parties/1/party.json          words, date, links
public/parties/1/hailey-head.webp transparent cutout of Hailey
```

`party.json` is the whole invitation. The portrait's first letter is the face: `heroWord` of `ONE` draws Hailey, then the letters NE. Shared pieces (the hat, the garland, the frame) are in `src/components` and read that file. They are not copied per year.

The date on the invite is Saturday, November 21, 3:00 PM. November 21, 2026 is a Saturday. `schedule.startsAt` is `2026-11-21T15:00:00-07:00`: 3:00 PM Pacific time in Maple Ridge. As of November 2026, B.C. stays on Pacific time year-round (UTC−7), so don't rewrite that offset to −08. The weekday, date, and time strings have to match the wall clock in `startsAt`. `npm run validate` rejects the build if they drift.

### RSVP

`rsvpUrl` is `null` on purpose. The home page shows a marked RSVP spot that says the Google Form is still coming. When you have the link, set it and rebuild:

```json
"rsvpUrl": "https://docs.google.com/forms/d/e/…/viewform"
```

The button then opens the form. Leave it `null` and the placeholder stays.

The registry button points at `https://getjoybox.com/registry/vGPDe9LZ-wishlist`.

## Archive this party and start the next one

From the repo root:

```bash
npm run archive
```

That command:

1. Sets the current party's `status` to `archived`, which publishes it at `/archive/<number>`.
2. Creates `src/parties/<next>/party.json` as the new current party, with the date cleared, `rsvpUrl` and `registryUrl` cleared, and `detailsPending: true`. The venue and address are copied so a party at the same house is easy to confirm.
3. Prints where to put the new cutout: `public/parties/<next>/hailey-head.webp`.

Then edit the new `party.json`, add the photo, and remove `detailsPending` (or set it to `false`) when the details are final. Check it with `npm run dev`. The home page shows the new party, and the previous one is listed on `/archive`.

Useful flags:

```bash
npm run archive -- --dry-run
npm run archive -- --theme "It's Fun to Be Two" --event-title "Hailey's Second Birthday" --hero-word TWO
```

`--dry-run` prints the next party and writes nothing. The script refuses to archive a party that is still `detailsPending` unless you pass `--force`.

Nothing is deleted. An archived `party.json` and its photo stay in the repo, which is what keeps `/archive/1` working after the move.
