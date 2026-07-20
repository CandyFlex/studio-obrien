# Research Chain — target to unique-data brief, with kill gates

The long-chain system Claude runs to turn a candidate topic into a validated,
non-derivative article brief. Every stage produces a saved artifact under
`production/research/<target-slug>/`; every gate can KILL the target (killing
early is success, not failure — it protects the index from garbage).

Companions: RESEARCH-PLAYBOOK.md (sources + automation split),
SEO-STRATEGY.md (doctrine + ledger), ARTICLE-ENGINE.md (what consumes the
brief). Data is never re-bought: check `research/` and `serp-snapshots/`
before any paid pull.

---

## The chain

### Stage 0 — Candidate intake
Where targets come from: SEO-STRATEGY FUTURE queue · **`kw-research.mjs`
--expand of a money seed (real phrase-match long-tails, not the masked CSV)** ·
PAA questions from serp-snapshots · Jarred's research drops · **GSC query
dimension (`gsc-queries.mjs`) — terms we already get impressions for.**
Artifact: `00-candidate.md` (the query/topic + why it's on deck).
Retargeted 2026-07-20 (data-reframe): candidates now lead with the PRICING
cluster + real-volume commercial terms, not 0-volume geo towns. Note the
CHANNEL per candidate — organic article, map-pack/GBP, or both — because the
research differs (below).

### Stage 1 — Search-power evidence (the winnable test)
**Step 1a — VOLUME KILL GATE (new, cheap, first):** `node production/
kw-research.mjs --seeds "<candidate>"`. If DataForSEO Labs returns **no volume
data or volume ~0, the target DIES here** — this is the gate that would have
killed "web design shelby nc" before we ever built for it. Record volume +
keyword_difficulty + intent. Prefer difficulty <=25 with real volume; high-kd
terms are map-pack/long-haul, flag accordingly.
**Step 1b — SERP shape:** pull the live SERP (serp-track snapshot if covered,
else the DataForSEO SERP; for a LOCAL/near-me candidate use `maps-track.mjs`
to read the PACK, not just organic). Record: top 10 domains, format that ranks,
**map pack present + its review bar**, AI overview present?, full PAA set.
**GATE 1 — KILL IF:** volume is ~0 (1a), OR page 1 is 5+ strong direct answers
from real authorities. **PASS IF:** real volume AND forums/directories/thin
national/weak freelancer pages hold slots (organic), or a beatable review bar
holds the pack (local).
Artifact: `01-serp.md` (+ raw JSON, + the kw-research overview row).

### Stage 2 — Competitor autopsy
WebFetch the top 3-5 real contenders. For each: structure (H2s), what they
answer, what they DON'T (the gap), sources they cite, local specificity
(usually zero), word of the year check (is it stale?).
**GATE 2 — KILL IF:** the gap analysis finds nothing we can add beyond
phrasing. **PASS IF:** there's a missing angle, missing locality, missing
first-hand layer, or the ranking pages don't actually answer the PAA set.
Artifact: `02-autopsy.md` (per-competitor gaps + the opening we'll take).

### Stage 3 — Language mine
Harvest how real people phrase this problem: Jarred's drops (Stream 1),
Reddit sweeps (WebSearch; Apify Reddit scraper for bulk), PAA phrasings,
GSC query strings. Collect verbatim quotes.
Artifact: `03-language.md` (their words → title/H2 candidates).

### Stage 4 — Uniqueness ledger (the non-derivative gate)
List, explicitly, what this piece will contain that does NOT exist in the
model or the current SERP:
- first-hand local observation (ours)
- first-party numbers (GSC/calculator/LocalIntel/serp-snapshots)
- verbatim owner language (Stage 3)
- named-source stats the competitors don't cite
- the local specificity layer (real towns, real situations)
**GATE 3 — KILL (or send back for more research) IF:** the ledger has
fewer than 3 entries. An article that would be pure synthesis doesn't ship.
Artifact: `04-uniqueness.md`.

### Stage 5 — Validated brief
The handoff to ARTICLE-ENGINE: primary keyword + intent + the H2 skeleton
(question-shaped, from PAA + language mine) + the uniqueness ledger + the
source list (resolving URLs) + the signal plan sketch (which existing pages
will link in; which channel distributes it).
Artifact: `05-brief.md`. Jarred approves the brief, not raw drafts.

### Stage 6 — Post-ship feedback loop
After ship: entry in SEO-STRATEGY PRESENT watchlist → next weekly
serp-track + GSC pull reports movement → checkpoint ladder (C1/C2/C3)
decides retrofit/boost/pivot. Movement data feeds Stage 0 of the next
target. The chain is a loop, not a line.

---

## Standing infrastructure rules

- **Weekly ritual:** `node production/serp-track.mjs` + `node
  production/gsc-report.mjs`; log deltas in SEO-STRATEGY PRESENT. (Junk-actor
  issue of 2026-07-20 resolved by same-day re-run; did not recur.)
- **One reading is a sample, not a fact.** 2026-07-20: three same-day runs
  gave three different rank pictures (#13 → unranked → unranked). Report
  rank MOVEMENT across snapshots, never a single reading as "our rank".
  Snapshots are now timestamped (serp-YYYY-MM-DD-HH-MM.json) so re-runs
  never overwrite an earlier reading.
- **Batch every paid pull.** One actor run, many queries. Save raw JSON.
- **Artifacts are append-only evidence.** Future sessions read them instead
  of re-researching; registry + research/ dir are the institutional memory.
- **Kill gates are the quality system.** Publishing less, better-validated
  content beats cadence. (Doctrine: don't index garbage.)

*Created 2026-07-20 on Jarred's direction: a long-chain research system that
finds key places, validates search power, and produces unique non-derivative
data before anything is written.*
