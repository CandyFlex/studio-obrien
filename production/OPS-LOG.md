# Ops Log — the self-improvement ledger

Append-only. One entry per working cycle (target: weekly). The diagnostic
(`node production/system-diag.mjs`) opens every cycle; this log closes it.
An entry is not complete without a **System improvement** line: every cycle
must leave the machine better than it found it, or say honestly why not.
Nor without a **Signal executed** line (added 2026-07-20): doctrine rule #1
is that Google ranks signals, not prose — so every cycle must move at least
one real signal (a link pursued/earned, a distribution post, GBP work, a
page shipped/changed) or say honestly why not. Ledger entries, artifacts,
and instruments do NOT count as signals.

Entry template:
```
## Cycle YYYY-MM-DD [on-demand|scheduled]
- Data pulled: (serp-track / gsc-report / other)
- Deltas vs last cycle: (ranks, clicks, impressions — facts only)
- Chain state: (targets advanced/killed/shipped this cycle)
- Decisions: (what changed and why, incl. checkpoint calls)
- Signal executed: (the real-world signal moved this cycle — or why not)
- System improvement: (the one thing fixed/upgraded in the system itself)
- Matrix: | date | data N | chain N | quality N | signals N | outcomes N | improvement N |
- Next cycle opens with: (the first action)
```

## The improvement matrix

Six dimensions, 0-5, one row per cycle (the diag auto-scores four of them
and prints the row; adjust the judgment dims before pasting):
- **data** — freshness of SERP + GSC pulls
- **chain** — stage artifacts advanced this week (serial throughput)
- **quality** — 5 minus articles with hard FAILs in the last eval sweep
- **signals** — judgment: were links-in + distribution actually executed
  for everything shipped?
- **outcomes** — rank/click movement vs last cycle (the only score that
  ultimately matters; the others exist to explain it)
- **improvement** — did the cycle upgrade the system itself?

Reading the matrix: a falling column across 2-3 cycles = that subsystem is
the next System improvement target. Outcomes flat while everything else is
5 = the strategy (not the execution) needs the change — escalate to the
checkpoint ladder early. This is the self-improvement instrument: the
matrix tells us WHERE to improve; the ops-log line proves we DID.

**Triggers:** on-demand = Jarred says **RUNCYCLE** (or asks for a cycle) in
any session → full diag-led cycle with him in the loop. Scheduled = the
automated routine runs the same loop autonomously and logs `[scheduled]`;
it never ships articles or deploys, it pulls data, scores the matrix,
advances chain research artifacts, and leaves decisions queued for Jarred.

---

## Cycle 2026-07-20
- Data pulled: first Apify SERP snapshot (12 keywords, batched, ~$0.50);
  WebSearch recon on "small business website cost" national SERP.
- Deltas vs last cycle: baseline cycle. First confirmed rank: #13
  "web design lincolnton nc" (geo page). Soft SERPs (Thumbtack/Yelp/FB/small
  freelancers) on most money terms. PAA harvest: cost-to-hire cluster,
  "is web design still worth it", "is local SEO worth it".
- Chain state: chain built this cycle; no targets in flight yet. Candidate
  queue seeded: (1) lincolnton retrofit+boost, (2) contractor post w/
  cost-PAA cluster, (3) "how much does a website designer charge" money post.
- Decisions: DeepSeek/provider drafting retired from content pipeline.
  Ridgeline killed. Low-authority doctrine + C1/C2/C3 pivot ladder adopted.
- System improvement: built the layer itself this cycle (article-eval.mjs,
  system-diag.mjs, RESEARCH-CHAIN, OPS-LOG). Known bug logged for next
  cycle: serp-track junk readings on "web design shelby nc" + "web design
  kings mountain nc" (actor artifact) — fix query handling or re-run.
- Next cycle opens with: `node production/system-diag.mjs --full` (first
  full article sweep), re-run the 2 junk keywords, then Stage 0-1 on the
  lincolnton retrofit target.

## Cycle 2026-07-20b [on-demand]
- Data pulled: SERP re-run (junk keywords now clean readings; 12 keywords,
  ~$0.50) + one accidental duplicate run (~$0.50 wasted — a `--help` probe on
  serp-track fired a real pull; scripts have no arg guard). First GSC pull
  saved to disk (`gsc-reports/gsc-2026-07-20.txt`). First `--full` article
  sweep saved.
- Deltas vs last cycle: **clicks off zero — homepage 6c/209i/p29.4 (28d)**,
  13 days before the C1 checkpoint. VOLATILITY finding: 3 same-day SERP
  readings disagree (lincolnton #13 → unranked ×2; kings-mtn #25 in one run
  only) = post-recrawl flicker, not stable rank. New rule in RESEARCH-CHAIN:
  one reading is a sample, never "our rank". Article sweep baseline: 6 of 34
  articles carry hard FAILs (worst: restaurant-website-guide, local-seo-guide).
- Chain state: lincolnton-retrofit advanced to stage 3/6 — Gate 1 PASS (soft
  SERP: directories + a location farm + wrong-town freelancers), Gate 2 PASS
  (opening: page-1 pricing vacuum + nobody answers the SERP's own cost-PAA +
  local-specificity parity with maidenwebdesign, the real #1). Artifacts in
  `research/lincolnton-retrofit/00-02`.
- Decisions: canonical snapshot for 7/20 = run 3 (clean); runs 1-2 preserved
  as `-run1/-run2.bak`. Junk-actor bug closed (did not recur on re-run).
- System improvement: **data-preservation fix** — serp-track snapshots now
  timestamped (same-day re-runs can never overwrite a reading again; today's
  overwrite destroyed run 1 until recovered from git) + gsc-report now
  self-saves every pull to `gsc-reports/` (diag sees GSC freshness
  automatically).
- Matrix: | 2026-07-20b | data 5 | chain 4 | quality 0 | signals 1 | outcomes 2 | improvement 4 |
  (quality 0 = 6 failing articles — the falling column; signals 1 = no
  distribution/links executed for anything shipped yet; outcomes 2 = clicks
  off zero is real progress but no stable rank held.)
- Next cycle opens with: lincolnton-retrofit 03-language (PAA phrasings +
  GSC queries) → 04 uniqueness → 05 retrofit brief for Jarred; quality
  column says schedule the AEO retrofit of the 6 failing articles right
  after. NOTE: cloud auditor's first report (due ~7:26am ET 7/20) had not
  landed in production/auto-audit/ as of this cycle — check it.
