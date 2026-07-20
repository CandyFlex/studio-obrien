# Session Handoff — 2026-07-15 (Portfolio showcase refresh — LOCAL DRAFT, paused for Jarred review)

## What changed
**Nothing is live. All work is in a LOCAL working copy: `portfolio-local.html`** (generated from
`index.html`, which is UNTOUCHED). Jarred is going to review/adjust, then we finalize + port to
`index.html` and deploy. The generator is `production/build-local-layout.mjs` — re-run
`node production/build-local-layout.mjs` to rebuild the local copy after edits.

Captured 6+6 built sites server-side (Playwright, load-gated: networkidle + fonts.ready + image
decode) into `preview/portfolio-review/` (`<slug>-hero.png` + `-full.png`). Converted the keepers to
webp via ffmpeg (libwebp) into `portfolio/` (production-ready assets, 84–724K each).

The refreshed showcase (5 changes, all in the local copy):
- **A. Top grid (#portfolio):** dense 20 cards / 8 businesses (old projects removed). Businesses:
  Crownline Electric, Cardinal Pest, Piedmont Concrete, Queen City Comfort, Queen City Landscaping
  (the 5 new trades) + Gameshelf + Dark Thoughts + Clover Dental. Trades×3, others×2. Distribution
  is spread so NO business repeats in a column or row, instances ≥2 rows apart (see COLS in generator).
- **B. Storefront (green "local business" section, `#storefront-project`):** Black Creek → **Ben's
  Smokehouse** (uses `portfolio/bens-full.webp`). Section now = Carolina Arcade, Slim's, Ben's.
- **C. The "computer" (`.wt-section` laptop + phone, "See your site on every screen"):** reels swapped
  Dark Thoughts → **Crownline Electric** (`portfolio/crownline-reel.webp` desktop,
  `crownline-reel-mobile.webp` phone).
- **D. Scrolling backdrop (`.show-fall`) behind laptop:** old projects → new sites (repeats OK).
- **E. Reel animation:** laptop 48s→**110s**, phone 20s→**210s** (phone now slower than laptop),
  keyframes reversed to `0 → -50%` so it scrolls **top→down** (hero first, footer last).

Local-only fixups baked into the generator so it renders under file://: strips `?v=` cache-busters and
rewrites root-absolute `/asset` paths to relative (both break on file://, not on the live server).

## Verification
- Tested: rendered `portfolio-local.html` headless at 1440 — grid, laptop (Crownline on both screens),
  and Storefront (Ben's) all screenshotted and confirmed; zero 404s; all webp load. Grid spread verified
  by the placement table.
- Untested: the reel SPEED/DIRECTION (110s/210s/top-down) is motion — verified in CSS only, not watched
  live. Jarred should eyeball it in a browser. Mobile/responsive breakpoints of the new grid not checked.

## Next action (and why)
- **Jarred reviews `portfolio-local.html` and gives adjustments** (his words: "save this… adjust… then
  clean up everything"). Do NOT port to `index.html` or deploy until he signs off.
- After sign-off: port A–E into real `index.html` (same edits the generator makes), update the noscript
  fallback + SEO image list (still reference old projects — not yet touched), then `vercel deploy --prod`.
- Open question he flagged: Ben's sits under the Storefront "Concept" tag but is a REAL Spindale business
  — may want relabel (e.g. "Live · BBQ"). Grid is 8 biz / 20 cards (some ×3) — he may want fewer repeats.

## Do NOT
- Do NOT edit `index.html` for this work yet — everything stays in `portfolio-local.html` until approved.
- Do NOT delete `preview/portfolio-review/` PNGs or the `portfolio/*.webp` new assets — source for the port.
- Do NOT re-open the browser to "show" him — just tell him to refresh `portfolio-local.html` (memory rule).
- Queen City Air was DROPPED (kept Queen City Comfort as the single HVAC piece) — don't re-add it.
- Terry Black's / stansac were excluded (real-biz clones); don't wire them into the portfolio.

## Blockers / carried items
- Playwright runs via GLOBAL install (`npm root -g`/playwright); scripts import it by absolute path.
  ffmpeg is the Gyan winget build (full path in `production/build-local-layout.mjs` sibling scripts). No
  sharp installed — webp conversion is ffmpeg libwebp.
- Electric brand renamed CWG → "Crownline Electric" in the source site; capture slug is still `cwg-electric`.
