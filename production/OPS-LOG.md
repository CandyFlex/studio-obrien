# Ops Log — the self-improvement ledger

Append-only. One entry per working cycle (target: weekly). The diagnostic
(`node production/system-diag.mjs`) opens every cycle; this log closes it.
An entry is not complete without a **System improvement** line: every cycle
must leave the machine better than it found it, or say honestly why not.

Entry template:
```
## Cycle YYYY-MM-DD
- Data pulled: (serp-track / gsc-report / other)
- Deltas vs last cycle: (ranks, clicks, impressions — facts only)
- Chain state: (targets advanced/killed/shipped this cycle)
- Decisions: (what changed and why, incl. checkpoint calls)
- System improvement: (the one thing fixed/upgraded in the system itself)
- Next cycle opens with: (the first action)
```

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
