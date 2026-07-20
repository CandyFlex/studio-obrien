# SEO Strategy Ledger — past, present, future

The single place that answers: what have we done, how is it performing, and
what do we do next. Updated at every SEO working session; superseding nothing,
CONNECTING everything. If a decision changes strategy, it gets a line here.

**The system map (the poignant systems, and when to reach for each):**

| System | File / tool | Use when |
|---|---|---|
| Article development + AEO/GEO/SEO gates | `production/ARTICLE-ENGINE.md` + `article-eval.mjs` | writing or auditing any article |
| Article structure/template law | `production/ARTICLE-SPEC.md` + `blog/article-template.html` | drafting |
| Content dedup + interlink truth | `production/build-registry.mjs` → `CONTENT-REGISTRY.json` | before AND after every article |
| Ranking operating model | `production/RANKING-OPERATING-MODEL.md` | cadence, cluster, interlink rules |
| Keyword targets | `production/KEYWORD-STRATEGY.md` + `Desktop/Errors/keywords_cleaned.csv` (1234 scored) | picking the next target |
| Performance data (facts, not vibes) | `production/gsc-report.mjs` (Search Console pull) · `gsc-index-audit.mjs` (index coverage) · `serp-track.mjs` (position checks) · `seo-opportunities.mjs` | the Present section below |
| Competitor intel | LocalIntel (`Desktop/DEV OPS`, registry.json) | gap analysis, pitch research |
| Research handoff (Jarred → Claude) | `production/RESEARCH-PLAYBOOK.md` | what to gather on Reddit/SERPs/locally + how to drop it |
| Research chain (target → validated brief) | `production/RESEARCH-CHAIN.md` + `production/research/` artifacts | before developing ANY article: kill gates, SERP evidence, uniqueness ledger |
| Voice law | `POSITIONING.md` | every word that ships |
| Trust chain | `/about` + `/blog/editorial-standards` | byline/E-E-A-T questions |
| Build queue | `production/PIPELINE.md` | what gets built next |

Provider drafting (cc-fleet/DeepSeek) is RETIRED from this pipeline entirely
(Jarred, 2026-07-19). Claude develops; the evaluator gates; Jarred approves.

---

## DOCTRINE — ranking AI-developed work from a low-authority site

Adopted 2026-07-19 from field discourse (r/SEO practitioner thread incl.
WebLinkr, whose Signal×Factor model we already run) + our own read. This is
the honest operating theory; revisit only against data.

**1. Google does not grade prose.** It ranks signals: authority, links,
intent-match, engagement. Content quality exists for three OTHER reasons:
converting the humans who land, earning AI citations (GEO), and earning the
links/shares that ARE ranking signals. "Publish good articles" is therefore
half a strategy; every article ships with a signal plan or it's a diary entry.

**2. AI is the intern, never the author.** Human-owned outline and thinking,
AI-assisted drafting, first-hand local material layered in (the thing no
scraper has), full edit pass, both gates. Never mass-publish. This is already
ARTICLE-ENGINE law; it stays law.

**3. The low-authority playbook (where a low-DR site can actually win):**
- **Fight where authority matters least:** long-tail, question-shaped,
  locally-modified queries (keywords_cleaned.csv low-competition picks) and
  the **map pack** (GBP), which is proximity/relevance-driven, not DR-driven.
- **Concentrate, don't sprawl:** deep clusters on few topics beat thin
  coverage of many. Internal links funnel authority to the money pages.
- **Earn real links locally:** the Storefront Project is our link engine
  (local press, chamber, the businesses themselves linking back). One real
  local link outweighs ten directory listings.
- **Engagement is a signal we control:** titles/metas written to earn the
  click; distribution to where locals already are (FB groups, per
  SOCIAL-PLAYBOOK.md) so pages get real visitors before rankings exist.
- **Don't index garbage:** weak/duplicative pages get improved, consolidated,
  or noindexed. Dilution is self-inflicted.

**4. The pivot ladder (decide by checkpoint, not by mood):**
- **C1, ~2 weeks post geo-v2 (early Aug):** GSC clicks should move off zero
  on geo/blog queries. If impressions high + clicks still 0 → CTR title/meta
  pass on top-impression pages. Not a pivot, a tune.
- **C2, ~6 weeks:** tracked long-tail articles should reach page 1-2. Stuck
  on page 2 → AEO retrofit + internal-link boost + pursue 1-2 real links to
  those pages. Still nothing → cut new-article cadence in half, shift the
  freed effort to link earning + GBP.
- **C3, ~12 weeks:** if blog search traffic still isn't materially arriving
  while other channels (maps, social, outreach) produce leads → **pivot:**
  content becomes support material for outreach/social/Storefront PR (which
  become primary demand-gen), cadence drops to maintenance, and we revisit
  the whole theory with the data in hand.
Each checkpoint gets a dated line in PRESENT when it's called.

**Pre-registered pass conditions (written 2026-07-20, BEFORE the data —
judge against these, don't move the goalposts after):**
- **C1 (2026-08-02) PASSES if:** GSC shows >=1 click on a geo page or blog
  article query (homepage clicks don't count — 6 already exist). FAIL →
  CTR title/meta pass on the top-10-impression pages, per ladder.
- **C2 (2026-08-30) PASSES only if BOTH:** (a) >=1 tracked long-tail term
  holds page 1-2 across >=2 snapshot readings (stability rule — one reading
  is a sample), AND (b) >=3 Signal-executed lines in OPS-LOG by then show
  real links/distribution actually happened. If (b) is false, the verdict is
  "experiment not yet run" — fix signal execution before judging content.
- **Scale triggers (earned, not scheduled):** article cadence scales only
  after quality column = 5 AND one piece holds page 1-2; keyword tracking
  scales only after 2 consecutive clean stable weekly snapshots; autonomous
  scheduled cycles only after 3 clean manual cycles AND the cloud auditor
  has landed >=1 report. Meta-layer (new docs/instruments) is FROZEN —
  improvements target output friction only.

---

## PAST — what has shipped (the record)

- **2026-07-03** — Blog authority build: Field Guide hub, bylines on 28
  articles, /about + /editorial-standards E-E-A-T chain, sitemap 67 URLs.
- **2026-07-04/05** — Content registry + 6 ownership/cost articles; geo
  rollout: all 26 location pages on the Shelby template with real researched
  town copy.
- **2026-07-08** — GSC re-index push Day 1 (12 geo URLs requested).
- **2026-07-14** — Ahrefs audit cleanup shipped; Shelby-keyword consolidation;
  CTR title/meta pass. Deliberate no-fixes documented in `SEO-AUDIT.md`.
- **2026-07-18/19** — Location template v2 (tape hero, map bleed, specimen
  services, mosaic, marquee) shipped to ALL 26 geo pages via retargeted
  build-geo.mjs. About + editorial-standards rewritten in the neighbor voice,
  credentials removed. Committed `12fd541`.

## PRESENT — current state + how to check it (facts beat vibes)

**2026-07-20 (later, cycle 2) — junk re-run + volatility finding + FIRST CLICKS.**
Three same-day Apify readings (run1 = `-run1.bak`, run2 = `-run2.bak`, run3 =
`serp-2026-07-20.json` canonical): the junk artifact did NOT recur (Shelby
readings now genuine: not in top ~13-30, Yelp/Thumbtack/jessicaleigh on top —
soft). But ranks FLICKER run-to-run: lincolnton #13 (run1) → out of top 30
(runs 2-3); kings-mountain #25 (run2 only). Read: post-recrawl re-evaluation,
not stable positions. RULE: a single SERP reading is a sample, not a fact;
never report a rank off one run. **GSC 28d (first saved pull,
`gsc-reports/gsc-2026-07-20.txt`): homepage 6 CLICKS / 209 impressions /
p29.4** — clicks are off zero (C1 signal arriving early); belmont geo p7.0 on
1 impression. Chain: lincolnton-retrofit passed Gates 1+2 (soft SERP; opening
= pricing vacuum + unanswered cost-PAA + local specificity parity with
maidenwebdesign, the real #1). Artifacts in `research/lincolnton-retrofit/`.
DECISION (same day, system audit): SERP provider switching Apify → Serper.dev
(~$0.07/reading w/ 2,500 free credits vs $0.50 minimum/run; makes the
multi-sample consensus the volatility rule requires affordable). serp-track
v2 auto-uses serper once the key exists (`~/.config/studioobrien/
serper-key.txt` — Jarred signs up at serper.dev, free); Apify stays as
fallback. Signal-executed line now mandatory in OPS-LOG (diag enforces);
C1/C2 pass conditions pre-registered below; meta-layer frozen.

**2026-07-20 — first Apify SERP snapshot** (run 1, preserved as
`serp-2026-07-20-run1.bak`): first observed rank = **#13 "web design
lincolnton nc"** (geo page). Other money terms: not in top ~29, BUT the SERPs
above us are soft (Thumbtack/Yelp/Facebook/small freelancers) = winnable per
doctrine. PAA harvested (AEO targets): cost-to-hire-a-designer cluster, "is
web design still worth it", "is local SEO worth it". Junk-artifact bug on 2
keywords resolved by re-run same day (see cycle-2 entry above).

**Snapshot (last updated 2026-07-19):**
- Impressions up ~18x since early July; **clicks still ~0** (as of 7/14 pull).
  Diagnosis: visibility arriving, CTR/position not yet. The v2 geo redesign +
  re-crawl is the active treatment.
- ~90% of sitemap indexed (7/10 baseline). 3 known crawled-not-indexed pages:
  deliberately NOT rewritten (seed doc rule).
- #1 keyword opportunity: the "web design shelby" split (see SEO-AUDIT.md).
- GA data only exists from July 2 onward (CSP blocked it before); lead all
  trend analysis with GSC, not GA.

**The cycle ritual (run at each session start):**
1. `node production/system-diag.mjs` — the one-command audit: SERP freshness
   + rank deltas + junk detection, GSC freshness, chain state (serial
   vetting), article-quality sweep (`--full`), checkpoint deadlines, ops-log
   discipline. It prints the next actions; do them.
2. Data pulls as the diag directs (gsc-report / serp-track / index-audit).
3. Close the cycle with an entry in `production/OPS-LOG.md` — incomplete
   without a **System improvement** line (the self-improving requirement).

**Blog ranking watchlist (start tracking per-article):** after each GSC pull,
note the top query per money article + its position band. Articles that sit
on page 2 for a real query get an AEO retrofit pass (question H2s +
answer-first openings, per ARTICLE-ENGINE §1) before any new article ships.

## FUTURE — the strategy queue (in order)

1. **Finish the geo re-crawl** (Jarred, manual): GSC Request Indexing days
   2-3 for the remaining v2 pages, ~12/day.
2. **Convert impressions to clicks**: watch the 7-day post-v2 GSC window; if
   CTR stays flat on queries where we rank <20, run a title/meta CTR pass on
   the top-impression pages (data first, then edits).
3. **AEO retrofit of the existing library**: evaluator now exists; run
  `article-eval.mjs` across `blog/*.html`, rank by warn count, retrofit the
  top movers (question H2s, answer-first, FAQ schema where blocks exist).
4. **New articles via ARTICLE-ENGINE** (Track B queue in PIPELINE.md):
   contractor post, Storefront post, then auto shop / salon. Cadence target
   from RANKING-OPERATING-MODEL: 2-4/week only when each passes both gates.
5. **service-area.html hub completion** (links 21/26 towns; finish it).
6. **Case studies as ranking assets** (Slim's, Ben's): real local proof pages
   targeting "[business type] website [town]" patterns.
7. Revisit `NEXT-ROADMAP-SEED.md` (analytics-geo doubling-down) once geo v2
   has 2+ weeks of GSC data to judge.

---
*Created 2026-07-19 on Jarred's direction: one system managing past, present,
and future SEO strategy and how articles are actually ranking. Keep the PAST
list append-only; rewrite PRESENT freely; reorder FUTURE as data dictates.*
