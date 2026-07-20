# Agent Brief — author ONE town's location-page content JSON

You are producing the content data file for one Studio O'Brien local SEO landing page
(studioobrien.com sells custom web design to small businesses). A build script turns your
JSON into the finished HTML page, so you ONLY write the JSON. Voice = confident, plain,
local, specific. No marketing fluff.

## Do this
1. **Read `production/geo-rollout/towns/cherryville.json`.** Copy its structure EXACTLY:
   same field names, same shape, same voice and length. You only change the VALUES.
2. **Research the town.** Use WebSearch to find real, verifiable facts: history, major
   employers/industries, 1-2 landmarks, whether it is the county seat, its identity. Find
   1-3 concrete facts you can cite. Put the facts + source URLs in a `_sources` array at the
   top of the JSON (the build script ignores unknown fields, so this is safe and required).
3. **Write the copy fields** using ONLY verified facts.
4. **Write the file** to `production/geo-rollout/towns/<slug>.json`.
5. **Reply** with the 1-3 facts you used, their source URLs, and confirm "0 dashes".

## Hard rules (a violation fails the build or the review)
- **NO em dashes (—) or en dashes (–) anywhere.** Use commas or periods.
- **NO fabricated local color.** If you cannot verify a specific fact, write honest general
  copy about small businesses in that town/county. NEVER invent landmarks, festivals,
  industries, nicknames, or "charm." Made-up facts are the worst possible outcome.
- Match cherryville.json's voice and field lengths closely. metaDesc <=160 characters.
  heroSub ~2 sentences. localP1 and localP2 ~3 sentences each.
- HTML is allowed inside copy exactly like cherryville.json: `<strong>...</strong>` in
  localP1/localP2/mapMetaLine, `<em>...</em>` in localH2. Write `&amp;` for ampersands and
  `&middot;` where needed. Do NOT use raw `&`.
- Do NOT edit any other file. Do NOT run the build or deploy. JSON only.

## Field-by-field
- `town`, `slug`, `county` — given to you in the task.
- `mapQuery` = `"<Town>,NC"`.
- `brandPlace` — short real phrase for where the town's businesses cluster: `"downtown"`,
  `"on Main Street"`, `"on the square"`. Pick the true one.
- `metaDesc`, `ogDesc`, `twDesc`, `schemaDesc` — mirror cherryville's patterns, swap town/county
  and business types to what's real for this town.
- `heroSub` — "Custom websites, SEO, and branding for the [real business types] of <Town> and
  <county/region>. No templates, no lock-in, and you own every line of it."
- `localH2` — "Built for <em><Town></em> and ..." (county seat -> "the county it anchors";
  otherwise a real sub-region or the county name).
- `localP1` — the town's real story (your researched facts, with `<strong>` on proper nouns).
- `localP2` — who you build for locally: mirror cherryville's "we build for the people who..."
  line with this town's real business mix and honest geography.
- `mapMetaLine` — `"Serving <strong><Town></strong>, N1, N2, N3, N4 &amp; <region>"` where region
  is what the task tells you (e.g. "the Charlotte metro", "the Catawba Valley", "the region").
- `areaServed` — array: the town first, then its real nearby cities from the task (do NOT add
  "North Carolina"; the script adds it). Include "Charlotte" ONLY if the task says it's in the
  Charlotte metro/commute orbit.
- `citiesIntro` = `"Rooted in <Town>, working across the region. Explore a nearby town:"`
- `hereCard` — one honest sentence about this town's businesses (mirror cherryville's here card).
- `neighborCards` — array of 3 objects `{slug, name, desc}` using the FIRST THREE neighbors from
  the task. `desc` = one honest line about that neighbor's businesses (real, no invented color).
- `faqOutsideAnswer` = `"Yes. We serve <County>, N1, N2, N3, N4, N5, and throughout North
  Carolina, all done remotely with recorded walkthroughs."`
- `faqBusinessesAnswer` — honest list of local business types + `"across <County>."`
- `footerNearby` — array of `{slug, name}` for ALL neighbors given in the task.

Neighbors (slugs, names, order) are supplied in your task. Use them verbatim; do not guess
geography.
