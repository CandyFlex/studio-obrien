# GEOBUILD Runbook — build one town to the Shelby template

When the user types **`GEOBUILD`** (or `GEOBUILD <town>`), execute this for ONE town,
deploy, then stop for review. Reference file to clone = `shelby-nc-web-design.html`.

## 0. Pick the town
Read `PROGRESS.md`; take the top `pending` town in tier order (A→B→C). `cherryville` is
next (status `content` → it already has real copy; mainly needs the template DESIGN applied).

## 1. Research (real facts only)
`WebSearch "<Town> NC history economy major employers landmarks <County> County"`.
Capture: county, county-seat?, real industries/employers, 1–2 landmarks, identity hook.
Tier C hamlets: if data is thin, write honest general copy — do NOT invent "color".
Record the identity hook back into `PROGRESS.md`.

## 2. Build the page — USE THE PIPELINE (preferred)
Write `production/geo-rollout/towns/<slug>.json` (copy `cherryville.json` as the field guide),
then run:
```
node production/geo-rollout/build-geo.mjs <slug>          # writes <slug>-nc-web-design.html
node production/geo-rollout/build-geo.mjs <slug> --check   # diff-only, writes .check-<slug>.html
```
The template source IS `shelby-nc-web-design.html`. The script swaps every variable region,
asserts each anchor is present (fails loudly on drift), and self-validates: 0 em/en dashes,
3 valid JSON-LD blocks, no `aggregateRating`/`review`. Derived fields (title, canonical,
og/twitter titles, hero tag/headline, section heads, breadcrumb, footer copyright) come from
`town`/`slug`/`county` automatically — you only author the local copy fields in the JSON.
JSON fields: metaDesc, ogDesc, twDesc, schemaDesc, heroSub, localH2, localP1, localP2,
mapMetaLine, brandPlace ("on the square"-slot), mapQuery, areaServed[], citiesIntro, hereCard,
neighborCards[3] (slug/name/desc), faqOutsideAnswer, faqBusinessesAnswer, footerNearby[6].
Neighbors come from `ADJACENCY.md` (first 3 → city cards, first 6 → footer/areaServed).

### Manual fallback (only if the pipeline can't be used)
Copy `shelby-nc-web-design.html` → overwrite the target file, then swap every Shelby-specific
string for the town's. Sections to localize:
- **Head:** `<title>` (≤60), meta description (≤160), canonical, og:url/title/description,
  twitter:*. 
- **Hero:** `.hero-tag` ("<Town> · <County> County, North Carolina"), display `<h1 sr-only>`
  + visible `.display` headline, `.hero-sub`.
- **Benefit strip:** unchanged (own/launch/rank/skip) — it's brand, not local.
- **Local section:** the 2 `.local-copy` paragraphs (REAL town facts), map `<iframe src>`
  (swap to the town — `https://www.google.com/maps?q=<Town>,NC&output=embed` is safe),
  `.map-meta` neighbor list (from `ADJACENCY.md`), keep phone + email.
- **Services:** unchanged except any "<Town>/<County>" mentions in copy.
- **Process / testimonials:** unchanged (testimonials stay per guardrail).
- **Cities section:** the 3 neighbor cards → real neighbors from `ADJACENCY.md` (first 3),
  the `.here` card = this town.
- **FAQ:** town name in Q/A + FAQPage schema; keep the same 6 questions.
- **CTA:** swap "<Town>" in the sub.
- **Footer nearby:** 6 real neighbors from `ADJACENCY.md`.

## 3. SEO / schema
Update the ProfessionalService JSON-LD: `url`, `addressLocality`, `areaServed` (this town +
its real neighbors + NC), `description`. Update BreadcrumbList (name + item). Update FAQPage
answers for the town. Keep `telephone: +1-704-974-3372`. Do NOT add `aggregateRating`/`review`.

## 4. Interlinking (the geo cluster) — DO NOT SKIP
- Footer nav already has a **Service Area** link back to `/service-area` (part of template).
- Cities + footer-nearby use `ADJACENCY.md` neighbors (real, page-backed).
- Anchor text pattern: "Web Design in <Town>, NC" where natural.
- After the town ships, ensure `service-area.html` lists it (hub → all 26).

## 5. Verify
```
grep -c '—\|–' <town>-nc-web-design.html        # must be 0
node -e '...JSON-LD parse...'                     # 3 blocks valid (see prior commits)
```
Deploy: `vercel deploy --prod`. Then:
```
curl -s -o /dev/null -w '%{http_code}' https://studioobrien.com/<town>-nc-web-design   # 200
```
Spot-check a real local fact is live.

## 6. Close out
- Mark town `done` in `PROGRESS.md` + append to its Log with the date.
- One-screen summary to the user; stop (cadence = 1/trigger).

## One-time cluster fixes (do alongside the first GEOBUILD)
- `service-area.html`: add the 5 missing town links so the hub → all 26.
- Confirm the template footer's `/service-area` hub link is present (re-add if missing).
