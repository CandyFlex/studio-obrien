# Data reframe — 2026-07-20 (the wide-net pull that changed the strategy)

Jarred pushed: are we staring at a niche I selected, or the entire opportunity?
We cast the wide net (free first-party GSC + our scored keyword universe +
two DataForSEO probes). It overturned the core assumption. Evidence below;
decision folded into SEO-STRATEGY PRESENT/FUTURE.

## 1. GSC by QUERY (first-party truth, 90d — `gsc-reports/gsc-queries-*.txt`)
- **72 distinct queries, 385 impressions, 2 clicks in 90 DAYS.** Organic
  search is delivering ~nothing. The 2 clicks were branded ("obrien","studio").
- We "rank" TOP-3 for head terms — "web design" p2, "web designer" p1.3,
  "website design near me" p1.0 — but at **12/12/10 impressions per 90d.**
  Position is real; volume reaching us is a rounding error. Chasing these is
  a mirage.
- **Keyword cannibalization:** "web design shelby" impressions are split
  across 5+ of our own URLs (/shelby-nc-web-design p62, / p45, /small-business-
  websites p88, /website-redesign-migration p97, …). Our pages fight each
  other; none win. Self-inflicted (doctrine warned of exactly this).
- The blog gets impressions on informational terms (seo-migration, mobile-
  local-search, rank-velocity) but at **positions 80-95** (page 8-9) = indexed,
  not competitive. Some impressions are junk geo (Burien WA from an example).

## 2. Our scored universe (`Desktop/Errors/keywords_cleaned.csv`, 1,277 kw)
- We track 12 in serp-track — under 1% — and they aren't even the **19 "A -
  build first"** the scoring flagged. A-tier = "near me" (local_hire) +
  agency/service (hire_commercial) + a couple pricing. NOT geo-town terms.
- **CAVEAT that mattered:** every row reads volume "50/mo" — Google's masked
  floor bucket. The CSV's volume column is blind. Labs fixed that ↓.

## 3. DataForSEO Labs — real volume/difficulty (unmask test, cost $0.0127/8kw)
| keyword | real volume/mo | difficulty | intent |
|---|---|---|---|
| website designer near me | 22,200 | 53 | commercial |
| web design near me | 14,800 | 72 | commercial |
| web design agency | 12,100 | 41 | commercial |
| website design cost | 1,600 | **12** | commercial |
| cost to build a website | 1,000 | **17** | commercial |
| web design charlotte nc | 1,000 | 25 | commercial |
| **web design shelby nc** | **no data** | — | — |
| **local seo shelby nc** | **no data** | — | — |
- The terms we optimized (shelby geo) have **~0 real volume.** The masked "50"
  hid it. Real volume lives in (a) "near me" (15-22k, but kd 53-72 = map-pack
  turf) and (b) **the pricing cluster — real volume + LOW difficulty (kd 12-17)
  + commercial intent + we already own the calculator & cost articles.** That's
  the best organic content bet in the whole dataset, and it was invisible.

## 4. Google Maps pack — the battleground (probe, cost $0.002)
"web designer near me" @ Shelby NC, 33 results. Top of pack:
- #1 Grace & Grit Marketing — 5.0, **12 reviews**
- #2 Spencer Technology Group — 5.0, **3 reviews**
- #4 Dragonfly Marketing — 3.7, 3 reviews · #8 Electric Films — 4.8, 21 reviews
- several with **no rating at all**
- **Studio O'Brien: NOT in the pack.**
The pack answers the 15-22k/mo "near me" demand, the competition is weak
(single-digit review counts, beatable with a handful of real 5-star reviews),
and we're absent. Proximity/review-driven, NOT domain-authority-driven =
winnable for a new local site in a way organic is not.

**Full baseline (maps-track.mjs, 8 packs, `maps-snapshots/maps-2026-07-20-09-45.json`):**
- **ABSENT from 8/8 packs** (4 near-me terms x Shelby + Gastonia).
- **Shelby review ceiling = 12** (Grace & Grit at #1). Most of the pack sits at
  0-4 reviews; several #1-3 slots have ZERO reviews.
- **A #1 with 0 reviews exists** (Scarlett's Web, Inc. tops the Gastonia pack
  with 0 reviews) — proof that proximity + a well-optimized profile can rank
  BEFORE reviews accumulate. The GBP setup itself is the first ranking lever;
  reviews then cement it. This lowers the "chicken-and-egg" risk I flagged.
- Toughest competitors are Charlotte-adjacent (Web Design Charlotte 68 rev, Go
  Digitals 40 rev) and only surface in the Gastonia pack; Shelby proper is soft.
- (Maps returns some junk businesses — "gaming studio", "Rick And Morty" — normal
  scraper noise; the real agencies are unambiguous.)

**Pricing target family (kw-research.mjs, `research/kw/`):** "how much does a
website cost" 1,900/mo **kd 8** (informational, best single target); "website
design cost" family 1,600/mo **kd 12** (+ dozens of phrase variants Google
clusters into one page); "how much does it cost to design a website" 1,300/mo
kd 19; "average website design cost" 320/mo kd 6-13; "website design cost
calculator" 260/mo kd 11 (we own the calculator). One pricing page/cluster can
target ~3,000+/mo aggregate at kd 6-25 — evidence-backed, assets already owned.

## GBP STATUS (found 2026-07-20 via DataForSEO Maps brand search)
The Studio O'Brien Google Business Profile EXISTS and is a strong-but-under-
optimized starting point — we are NOT at zero:
- Name "Studio Obrien" (no apostrophe), category **"Website designer"** (correct
  primary), phone 704-974-3372, domain studioobrien.com.
- **claimed: true**, **rating 5.0 with 6 reviews** — already HALF the Shelby
  pack ceiling (12), and better-rated than most of the pack.
- place_id: ChIJ7QCcNJL5PEMRMbvPN6vEImI.
- BUT: **address null, no service area visible, no hours, no description** — and
  it does NOT appear in any of the 8 near-me packs. Diagnosis: the profile is
  incomplete, so Google lacks the proximity/relevance signal to rank it for
  category ("near me") searches — it only surfaces on exact brand lookup.
**Implication:** the highest-leverage, lowest-effort move in the whole strategy
is COMPLETING this profile (service area, hours, description, services, photos),
not building content. We have category + 6 five-star reviews already; the gap is
profile completeness, which is a settings fix, not a months-long grind.

## THE REFRAME (evidence-backed)
1. **Organic search is not the near-term channel.** ~0 volume on our geo
   terms, 2 clicks/90d, blog buried page 8-9. Not a ranking bug — a demand/
   authority ceiling. This is the C3 pivot-ladder scenario arriving early.
2. **Map pack (GBP) is the highest-ROI lever** and we're not even listed.
3. **Pricing content cluster** is the one real organic bet (volume + low kd +
   we own the assets).
4. **Stop the shelby cannibalization** (5+ pages, and the term has ~0 volume
   anyway) — consolidate, redirect the rest.

## TOOLING — best-for-job (not just cheapest)
Consolidate on **DataForSEO as the backbone** (one vendor/auth/balance already
set up; $1 trial live). Its suite covers every job cost-effectively:
| Job | Tool | Cost | Status |
|---|---|---|---|
| Organic rank tracking | DataForSEO SERP live | $0.004/kw | have (serp-track v3) |
| Real volume + difficulty + intent | **DataForSEO Labs** | $0.025/1k | PROVEN — adopt (kills the masked-50 blindness) |
| **Map-pack rank + review tracking** | **DataForSEO Maps SERP** | ~$0.002/call | PROVEN — build next (the battleground) |
| Competitor GBP/reviews bulk + lead lists | Apify Google Maps Scraper | $0.50/1k places | for LocalIntel/outreach bulk only |
| Backlinks | DataForSEO Backlinks | pay-go | later |
Serper/Apify-SERP demoted to fallback. Apify used only where per-place bulk
scraping beats per-SERP (competitor/lead extraction), not for tracking.

## PIVOT AWAITING JARRED'S RATIFICATION (his channel call + his GBP)
Lead with **GBP/map pack** (claim+optimize profile, get in the pack, earn real
reviews) + **pricing/AEO content** + off-search (outreach/Storefront). Demote
new geo-page/organic-head effort to maintenance. Consolidate the shelby pages.
This is a channel-strategy change — recommended, not unilaterally executed.
