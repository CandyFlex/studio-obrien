# Session Handoff — 2026-07-04

## What changed (ALL LIVE on studioobrien.com via `vercel deploy --prod`, multiple deploys)

**6 new research-driven articles** (Web Design & Performance cluster), from 3 of the
6 Gemini research prompts (dumps archived in `production/research/`):
- how-to-choose-web-design-company, who-owns-your-website-domain-source-code,
  website-builder-vs-custom-cost, wix-squarespace-seo-limits,
  small-business-website-cost-2026, why-cheap-websites-cost-more
- Each: template-built, sourced stats, /humanizer voice (0 em dashes), byline+schema,
  self-hosted local NC hero image, wired into `/blog` cards + `/blog/clusters` + sitemap.

**Content registry infrastructure (the dedup + interlink system):**
- `production/build-registry.mjs` → `CONTENT-REGISTRY.json` (+ `.md` usage doc). Run
  before/after every article. `production/RANKING-OPERATING-MODEL.md` = the full
  reliable/unique/token-efficient playbook.
- Fixed: 3 of 4 cluster pillars were unlinked from `blog/clusters.html` (now linked).
- `web-design-redesign-guide` pillar now links down to all 11 cluster articles (was 5).

**Images:** self-host pipeline works via `ffmpeg` (no cwebp/magick/sharp). 6 verified
local NC covers in `blog/img/` (PD/CC0 + CC BY-SA 4.0 w/ attribution). GOTCHA: Wikimedia
1600px thumb 404s — use <=1280px, fall back 960px.

**Google Search Console connected (headless):** `node production/gsc-report.mjs` and
`production/gsc-index-audit.mjs`. Service account `gsc-reporter@studioobrien-seo-51528
.iam.gserviceaccount.com`, key at `~/.config/studioobrien/gsc-sa-key.json` (OUTSIDE repo).
Property `sc-domain:studioobrien.com`. See memory [[obrien_gsc_reporting]].

**SEO fixes from Ahrefs audit (`Desktop/Errors/*.csv`):**
- 5 broken 404 citations fixed (2 mine=yurin.dev removed/reattributed to Vizantir;
  3 existing → rudys.ai, digitalapplied, vwo — all verified live). Removed an unverified
  "15-40% price hike" stat from who-owns.
- 2 links-to-redirect fixed (www.slang.ai, www.mydoceo). NOTE: broken URLs appeared BOTH
  inline AND in sources callouts — used replace_all to catch all occurrences.
- Added `.html` -> clean URL 308 redirect in `vercel.json` (dedupes URLs; verified).
- Trimmed 5 meta descriptions to <=155. Recompressed 3 heroes (231-266kB -> 143-185kB).
- Footer redesigned to centered/compact (index.html + index-v2.html); nav is one-line
  scaling via container-query cqi.

## Verification (done live)
- All page types 200; .html->clean redirect works; all 7 fixed articles clean of broken
  domains (grep'd live HTML); sitemap 0 errors; robots fine (51/73 already indexed).
- GSC index audit: 51 indexed, 22 not — ALL "lastCrawl=never" (crawl-priority, NOT quality
  or technical rejection). No canonical/robots/noindex problems anywhere.

## Next action (most valuable)
- **Titles/H1 pass (P2 territory):** Ahrefs flags 28 page titles >60 chars + 15 H1s >70,
  mostly LOCATION/service pages. Needs the specific URL list (not in the CSVs read; pull
  from a fresh crawl or scan the location pages). Ties into keyword optimization.
- **USER manual in GSC:** Request Indexing for the 6 new articles + /about +
  restaurant-website-guide pillar (API can't do this). Submit sitemap if not already.
- **Remaining research:** 3 pending prompts (#4 redesign ROI, #5 local SEO, #6 AI) -> ~9
  more articles. Or write expanded 8-12 prompt pack toward a 30-40 article library.

## Do NOT
- Do NOT dump 30+ articles at once (scaled-content-abuse signal on young site) — cadence 2-4/wk.
- Do NOT use em dashes; run /humanizer. Do NOT invent stats (every stat needs a live source URL).
- Do NOT add alt text to the homepage marquee/reel or blog avatar images — empty alt is
  CORRECT there (decorative duplicates + avatars with adjacent name); meaningful images
  already have descriptive alt. Ahrefs "missing alt" on these = false positive.
- Homepage edits go to BOTH index.html and index-v2.html.
- `vercel deploy --prod` ships the WHOLE working tree (incl. pre-existing uncommitted edits).

## Blockers / carried items
- Work is LIVE but UNCOMMITTED to git (working tree has many pre-existing M files from prior
  sessions mixed with this session's work). Commit carefully if desired.
- New articles "Discovered - not indexed" = normal crawl timing; needs Request Indexing + time.
- Deploy is manual (`vercel deploy --prod`); git push does NOT deploy.
