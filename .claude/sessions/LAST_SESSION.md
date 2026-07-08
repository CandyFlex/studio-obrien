# Session Handoff — 2026-07-05

## ✅ GEOBUILD ROLLOUT COMPLETE (2026-07-05)
All 26 `*-nc-web-design.html` location pages are LIVE on the Shelby template, with real cited
local facts, 0 dashes, valid schema. `service-area.html` hub links all 26. See
`production/geo-rollout/PROGRESS.md` (full log) and memory `obrien_location_template.md`.

Pipeline built + proven: `production/geo-rollout/build-geo.mjs` + `towns/<slug>.json` (template
source = the shelby page; asserts anchors, validates dashes/schema/meta). Authoring was done by
parallel background `general-purpose` agents at model=haiku reading `AGENT_BRIEF.md` +
cherryville.json; Opus verified facts + built + deployed per tier. To edit any page, change its
`towns/*.json` and run `node production/geo-rollout/build-geo.mjs <slug>`, then `vercel deploy --prod`.

Possible next work (NOT started): request GSC indexing for the 26 URLs (user-manual in GSC UI);
revisit the fake visible testimonials (still on all location pages per prior guardrail).

## Mission
Roll the new **Shelby template** out to the other 25 location pages, each with
**real local research** and identical formatting, so every geo page has the same
premium visual version + a strong internal-link geo cluster. Reference file =
`shelby-nc-web-design.html` (fully done, SEO-audited, live). Also standardize the nav logo
sitewide (see task 3). Interlink gaps to fix: `service-area.html` links only 21/26 towns;
template footer needs the `/service-area` hub link.

## What changed this session (all LIVE via `vercel deploy --prod`)
- **`shelby-nc-web-design.html` = THE TEMPLATE.** Full redesign + real localization.
  Dark+mint identity kept, craft elevated. Locked section decisions:
  - Hero: centered, container 1240px, big display headline, `.hero-tag` location line.
  - **Benefit strip**: style "E" glow icon cards (`.proof`/`.proof-item` w/ radial-glow
    icon), copy = "You own everything / You launch fast / You rank locally / You skip
    templates" (symmetric word counts). NO "5 years / $100k" metrics (user cut them).
  - **Local section**: split card (`.local`), prose left + map card right, tap-to-call
    **(704) 974-3372** + email in the map meta (hours removed).
  - **Services**: `.svc` glow cards, 2-col icon-left, richer keyword copy (custom website
    design, Cleveland County, Map Pack, Google Business Profile, preserve rankings).
  - **Process**: homepage-style image cards (`.prc-*`, reuses portfolio/process-*.webp).
  - "Why us" section REMOVED (redundant with benefit strip).
  - Testimonials KEPT as-is (see Do-NOT), Cities linked cards.
  - **FAQ**: centered panel accordion (`.faq details`), `<details>`/`<summary>` + FAQPage schema.
  - **CTA**: problem/solution, "Losing customers to a website that *doesn't sell*?",
    two actions (Start a project + Call), full section width, `.cta .cta-note` 40px gap
    (specificity fix: `.cta > p` was zeroing its margin-top).
  - **Footer**: utility strip (`.foot-strip`): logo + nav links + phone/email, then
    copyright + 6 nearby-town links. Small + balanced.
  - **Nav logo**: white "Studio O'Brien" + animated green underline (`.nav-logo::after`
    scaleX .32 -> 1 on hover). THIS is the sitewide standard now.
- **`cherryville-nc-web-design.html`**: content localized (Carolina Freight / trades /
  manufacturing, real neighbors) but STILL OLD DESIGN. Needs the template applied
  (content is a head start). Good first rollout page to validate the process.
- Phone **(704) 974-3372** added to Shelby (tel: links + `telephone` in schema).
- Removed the fake `aggregateRating`/`review` schema from Shelby (kept visible testimonials).

## SEO audit of the template (Shelby) — PASSED
title 51ch ✓ · meta 143ch ✓ · 1 keyword H1 (sr-only) + 7 H2/14 H3 ✓ · 7 imgs all alt ✓ ·
22 internal links ✓ · ProfessionalService + BreadcrumbList + FAQPage all valid ✓ · ~1044
unique local words ✓. Template is SEO-clean; clone with confidence.

## Per-page rollout process (repeat for each town)
1. **Research** the town: `WebSearch "<town> NC history economy major employers landmarks <county> County"`.
   Use Wikipedia + city site. Note: county, county-seat?, real industries/employers,
   landmarks, neighboring towns, notable identity.
2. **Copy Shelby template**, swap real local content into: hero-tag + display headline,
   local-intro 2 paragraphs (real facts), map embed `src` + NAP neighbor list, services
   local refs, cities/nearby cards (real adjacent towns), FAQ town name, CTA, footer towns.
3. **Update ALL SEO**: `<title>` (≤60), meta description (≤160), canonical, og/twitter,
   ProfessionalService schema (addressLocality, areaServed, description), BreadcrumbList,
   FAQPage. Keep the phone + tel links.
4. **Verify** before deploy: `grep -c '—\|–'` = 0; JSON-LD parses (node one-liner in prior
   commits); after deploy `curl -s -o /dev/null -w '%{http_code}'` = 200.
5. `vercel deploy --prod`.

## Priority order (traction + real identity first; hamlets last & honest)
- **A (do first):** cherryville (design only), gastonia, charlotte, hickory, kings-mountain,
  lincolnton, morganton, belmont, mount-holly, newton, conover.
- **B:** forest-city, rutherfordton, bessemer-city, dallas, cramerton, stanley,
  boiling-springs, denver (Lake Norman), maiden (Apple/Google data centers — real hook).
- **C (tiny hamlets — honest LIGHT treatment, do NOT invent local color):** waco, vale,
  crouse, iron-station, mcadenville.

## Task 3 — nav logo sitewide
Make every page's menu logo identical: white "Studio O'Brien" + the green underline
accent (`.nav-logo::after`, scaleX .32 rest / 1 hover). Non-location pages differ today:
homepage `index.html` + `index-v2.html` use `.nav-brand` "O'BRIEN"; blog + service pages
use `.topbar-logo`. Bring them all to the Shelby standard.

## Do NOT
- **No em dashes** (— or --). Grep every page; the location template had them and they
  were all removed. Run /humanizer principles on any new prose.
- **Do NOT invent local facts.** Research real ones. Hamlets get honest generic copy, not
  fabricated "agritourism"-style filler (that mistake was fixed on Cherryville).
- **Do NOT re-add fake review schema** (`aggregateRating`/`review`) — FTC/Google risk.
  User chose to LEAVE the visible testimonials "for now" (31 pages, fake names Marcus Reed
  / Sarah Lin / David Kim). Visible only; never in structured data. See [[obrien_jarred_bio_positioning]].
- Homepage edits go to BOTH `index.html` and `index-v2.html`.
- `vercel deploy --prod` is the ONLY thing that ships; git push does NOT. It deploys the
  whole working tree (`.vercelignore` covers harborlight/, remotion/, preview/, .claude/).
- Deploys are cache-busted for the user via Ctrl+Shift+R; tell them to hard-refresh.

## Blockers / carried items
- Testimonials cleanup deferred (needs real Upwork or local quotes from user).
- Request Indexing in GSC UI for changed pages = user-manual (API can't).
- Template's visible hero headline is a `<p>` + sr-only keyword H1 — intentional, keep.
