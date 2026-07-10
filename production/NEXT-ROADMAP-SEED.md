# Next Roadmap Seed — Analytics-Driven Geo Doubling-Down

**Captured 2026-07-10.** Starting point for the next ROADMAP phase. This is a
seed, not a committed plan — fold it into ROADMAP.md when we lock the next phase.
Division of labor: **[J]** Jarred · **[C]** Claude · **[D]** DeepSeek bulk.

---

## Where we are (baseline as of 2026-07-10)

- **Site age:** ~3.5 weeks of history. Day zero = geo pages + first sitemap,
  June 17–18, 2026. 80 commits June 18 → July 8.
- **Indexing is healthy — no SEO defect.** GSC live audit of all 73 sitemap URLs:
  - **66 / 73 (90%) Submitted and indexed.**
  - 4 "URL unknown to Google" (never crawled — new posts, just need discovery).
  - 3 "Crawled – currently not indexed" (`/about`,
    `surviving-restaurant-cost-increases-nc`, `website-redesign-roi-small-business`).
    Checked all three — 1,520 / 2,220 / 3,280 words, proper titles/meta/canonical.
    **Not a quality problem.** Authority-based deferral typical of a young domain;
    the longest post being in this bucket is the tell. Do NOT rewrite them.
  - No canonical mismatches, robots.txt + both sitemaps wired correctly.
- **Data windows differ — this gates the analysis:**
  - **GA4: only since July 2** (CSP blocked it until then — earlier is a permanent
    gap). ~8 days of data today. Too young for confident geo/navigation bets until
    ~late July. Give it a 2–3 week baseline first.
  - **GSC: since mid-June** (~3+ weeks). This is the source of truth for the geo
    decision below — it has the query/geo/impression depth GA lacks right now.

## Pending actions carried in from today (do these first)

- [ ] **[J]** Deploy staged `sitemap.xml` change — `lastmod` bumped to 2026-07-10 on
      the 7 unindexed URLs to re-queue them. Needs `vercel deploy --prod --yes`
      (git push alone does NOT ship).
- [ ] **[J]** GSC → URL Inspection → Request Indexing for these 7:
      - `/about`
      - `/blog/facebook-only-trap-small-town-restaurants`
      - `/blog/uncaptured-email-revenue-restaurants`
      - `/blog/google-business-profile-category-ranking`
      - `/blog/review-velocity-vs-total-count-local-seo`
      - `/blog/surviving-restaurant-cost-increases-nc`
      - `/blog/website-redesign-roi-small-business`
- [ ] **[C]** Re-run `node production/gsc-index-audit.mjs` ~2–3 weeks out. If the 3
      "crawled not indexed" are still excluded, only THEN check for near-duplicate
      overlap with sibling articles. Until then, leave them alone.

## The next-phase intent (Jarred's goal, 2026-07-10)

Use real analytics to **(a) double down where we're already getting views in the
area, and (b) broaden into adjacent areas we can credibly approach** — and let that
data reshape site navigation.

Proposed approach when we start the phase:

- [ ] **[C]** Pull GSC report (`production/gsc-report.mjs`) → rank pages & queries by
      impressions/clicks; flag page-2 (positions 8–20) pages that are "close" —
      those are the double-down targets (small push = ranking gains).
- [ ] **[C]** Map impressions to towns → identify which geo pages are earning search
      interest vs. which are dead weight. Broaden into adjacent towns that share
      demand signals with the winners.
- [ ] **[C→J]** Feed that into a navigation revision: surface the areas/pages actually
      pulling traffic; consider internal-link boosts from winners to broaden targets.
- [ ] Cross-check against GA4 once it has a ~3-week baseline (late July) before making
      conversion-based nav calls.

**Guardrail:** GSC leads the geo/nav decisions right now; GA4 is too young to trust
for expansion until late July. No fabricated proof/testimonials (standing rule).
