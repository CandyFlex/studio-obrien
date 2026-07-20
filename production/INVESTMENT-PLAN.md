# Token Investment Plan — where research capacity goes and why

The doctrine for spending Claude/Opus capacity on Studio O'Brien. Written
2026-07-16, the day the outreach landscape survey completed (990 businesses
verified, SEND 27). Companion to ROADMAP.md (what the business does) and
production/outreach/OUTREACH-SYSTEM.md (how outreach runs). Scheduled
research cycles follow THIS allocation; CYCLE-LOG.md records what each
cycle actually did.

---

## 1. The ideology of token spend

1. **Compounding assets beat consumables.** A verified database row decays;
   a portfolio piece, a case study, a ranking article, a reusable template
   pays forever. When two tasks compete, fund the one that still has value
   in six months.
2. **Research must end in an artifact.** No cycle ends with "learned some
   things." Every spend produces a file: a dossier, a draft, a scored row,
   a report. If the artifact can't be named before starting, don't start.
3. **The constraint is Jarred's send/build time, not lead supply.** 27
   verified targets is already more than one person can work in a month.
   Marginal tokens go to making each target CHEAPER TO ACT ON (dossiers,
   drafts) and to demand that arrives on its own (inbound), not to more
   raw supply.
4. **Measure by promotions and shipped drafts, not tokens burned.** Cycle
   value = SEND promotions + dossiers completed + drafts ready + rankings
   moved. A cycle that burns big and ships nothing gets its bucket
   demoted at the next rebalance.
5. **Nothing sends, ever.** All buckets produce research and drafts;
   Jarred alone converts them to action.

## 2. The five buckets (allocation per ~week of cycles)

### Bucket A — Proof engine (≈35%): the thing that converts everything else
The site's biggest conversion gap is real proof (ROADMAP Phase 2). Highest
long-term ROI per token in the whole business.
- Portfolio archetype builds per PIPELINE.md Track B priority order:
  trades/contractor first (Ridgeline completion), then auto, salon,
  landscaping. Full builds via agents: design + copy + responsive verify.
- Case-study pages from existing work (crownline template, memory:
  standard = Storyboard concept).
- Spec-site briefs for the top 3 Storefront candidates from the SEND list
  (The Social House, Phyllis' Sweet Shop, WorkShop Vintage) so a Storefront
  build can start the day Jarred picks one.
Artifacts: complete HTML pieces, webp crops, wired portfolio entries
(HOLD deploy until Jarred approves each, per PIPELINE rule).

### Bucket B — Inbound engine (≈25%): demand that arrives while sleeping
GSC shows impressions up 18x with ~0 clicks (memory, 7/14 audit) — the
gap is content depth + click-worthiness, and "web design shelby" is the
#1 named opportunity.
- Field Guide articles per PIPELINE Track C queue (contractor sites,
  auto shops, Storefront story), DeepSeek-drafted in batches, Claude
  voice-edited. 2/week drafted while cycles run.
- Industry landing pages (restaurant first - portfolio is strongest there).
- GSC-driven title/meta improvements on pages with impressions-no-clicks
  (run gsc-report.mjs weekly for the data).
Artifacts: publish-ready drafts + internal-link plans. Deploys wait for
Jarred (deploy = vercel CLI, his call).

### Bucket C — Outreach readiness (≈20%): make every target one-read-away
- Dossiers for SEND targets (HIGH tier first): current SERP checks, GBP
  state, site observations, route + angle + the filled Gap Read where
  route A applies. production/outreach/dossiers/.
- Near-miss enrichment (BENCH 60-69 reviews/owner fill) until that well
  dries (~15 rows).
- Capacity tiers for untiered SEND rows.
- Email variants per DESIGN-DIRECTION roadmap (niche skins next).
Artifacts: dossier files, updated db, ready-to-personalize drafts.

### Bucket D — Fresh intel (≈10%): the faucet, not the bucket
- Weekly L4 feed pass (env-health + chamber calendar + news - the
  automatable trio). New finds become db rows.
- Niche demand scans to fill the DEMAND_20 defaults (dental, jewelry,
  fitness, funeral, powersports...).
- Quarterly: OSM re-fetch + full re-score (doctrine section 7).
Artifacts: new db rows, updated demand map, feed-pass reports.

### Bucket E — Systems + measurement (≈10%): keep the machine honest
- Friday-style metrics assembly (GSC + GA4 + CRM state) into a one-page
  weekly brief Jarred can read in 2 minutes.
- CRM/db integrity audits (no empty next-touch, band drift, stale
  verifiedAt).
- Infra unblock prep: DNS records pre-written for the mailbox, UTM
  conventions applied to all draft links.
Artifacts: weekly brief in production/outreach/briefs/, audit notes.

## 3. What NOT to spend on (current low-ROI list)

- More raw OSM verification - the survey is done; tail retail is triaged.
- Exhaustive verification of DISCARD/LOW rows.
- Speculative niches with no demand evidence (fund Bucket D scans first).
- Rebuilding/polishing internal docs that already work.
- Any Apify/paid-API spend without Jarred's explicit OK.
- Anything that looks like contact: no DMs, no sends, no form fills.

## 4. The compounding loop (how allocation self-corrects)

Each cycle logs artifacts per bucket in CYCLE-LOG.md. Weekly (or when
Jarred returns): count promotions, dossiers, drafts, ranking moves ->
rebalance: the bucket with the most unshipped inventory gets throttled;
the bucket blocking Jarred's next action gets fed. Monthly: re-read this
plan against ROADMAP phase progress and rewrite allocations. This file
carries a changelog; allocations are decisions, not laws.

## 5. Standing backlog (cycles pull top-down within each bucket)

A: Ridgeline completion -> auto-shop archetype -> Social House spec brief
   -> Phyllis' spec brief -> case-study template fills.
B: Field Guide #1 (contractor) + #3 (Storefront story) -> restaurant
   landing page -> GSC title/meta pass -> blog byline retrofit (known debt).
C: Dossiers for the 7 HIGH-tier SENDs -> near-miss enrichment -> capacity
   tiers -> gap-read-restaurant email skin.
D: Weekly feed pass -> dental/jewelry/fitness demand scans -> DEMAND_20
   update.
E: Weekly brief #1 -> DNS record prep -> UTM sweep of all drafts.

## Changelog
- 2026-07-16: Created, day of landscape-survey completion. Initial
  allocation A35/B25/C20/D10/E10 reflects: proof is the conversion
  bottleneck, inbound is the highest-leverage passive channel, outreach
  supply is saturated but readiness is not.
