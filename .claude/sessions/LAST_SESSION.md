# Session Handoff — 2026-07-12 (Queen City Comfort retro pass + logo + form)

## What changed
All in `queen-city-comfort/index.html` (qc-override block + inline swaps), modeled on live stansac.com screenshots:
- **Retro pass:** photos (section-2 / testimonials / section-8) clipped into Stan's-style wobbly trapezoids via SVG `clipPath` defs `#qcClipR`/`#qcClipL` (objectBoundingBox, injected before `.wrapper`), max-height 420px, drop-shadow; offset hand-drawn outline = same path stroked, as bg-image on container `::before` (gold / soft-teal / deep-teal).
- **Star patterns:** atomic 4-point star SVG tiles on offer coupons (+ dashed inset outline) and footer; value-props section → cream `#f6f0e2` with 2 big corner starbursts (dots-on-tips later removed per user — long lines only).
- **Icon chips:** teal rounded squares rotated -3°, gold outline ::before rotated +6° offset down-right (needs `z-index:0` on chip), gold sparkle ::after top-right.
- **Logo (final = Logo 02 of 5 mockups in `logo-designs.html`):** Yellowtail script "Queen City" (Google Fonts link in head), -2° tilt, 41px header / 30px mobile, "COMFORT CO." gold caps pulled in from the tail. User first picked 03 (slab+plate), then switched.
- **Finance card SVG:** contactless arcs removed, 0%/APR* moved to x=222/270 (was overlapping).
- **Request Service band:** now financing.jpg (residential condenser) under teal overlay + the FULL Gravity Forms form unhidden (`#gform_wrapper_5{display:block !important}` — GF JS never runs in static clone) + custom-styled Service Needed select. Matches Stan's form layout.
- **Footer:** "Site by Studio O'Brien" added after Privacy Policy (new standing rule in memory: `studio_signature_footer`).
- Memory `qcc_hvac_clone.md` updated throughout; committed to git this session.

## Verification
- Tested: every visual change Playwright-verified against http://127.0.0.1:8787 (batch screenshots, sections compared to stansac.com reference shots in scratchpad).
- Untested: form is display-only (no backend — submits to nonexistent WP; would need Formspree or similar to go live). Site not deployed anywhere; local only. Yellowtail/Google Fonts needs internet.

## Next action (and why)
- User said "save and move on." Nothing owed. If QCC resumes: candidates are mobile pass (shapes/logo at small widths only spot-checked via CSS sizes, not screenshotted), wiring the form, or deleting mockup pages `logo-designs.html`/`review-designs.html` (user hasn't answered; keep for now).

## Do NOT
- Do NOT touch the minified theme `main.css` — ALL restyling goes in the `<style id="qc-override">` block.
- Do NOT "clean up" the wobbly photo shapes back to plain rounded rects — retro IS the direction (user-driven). Keep clip path + outline path in sync if reshaping.
- Do NOT re-add balls/dots to the starburst tips, the crown-circle logo, or the contactless arcs on the finance card — all removed per user.
- Do NOT re-hide `#gform_wrapper_5`.
- impeccable hook findings on this file (~117) are the scraped theme's own values + QCC brand palette — classified intentional all session; don't churn on them.

## Blockers / carried items
- Preview server: `python -m http.server 8787` from `queen-city-comfort/` (was running in background this session; restart if dead). Hard-refresh rule applies (cache).
- Playwright scripts: CJS + `NODE_PATH="$(npm root -g)"` (ESM import fails); scroll before full-page shots (lazy images).
- O'Brien portfolio site work (geo re-index Day 2/3, GBP post) still pending from earlier sessions — see `obrien_geo_reindex_progress` memory.
