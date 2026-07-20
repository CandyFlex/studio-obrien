# Studio O'Brien — Targeting Strategy

Companion to `OUTREACH-SYSTEM.md`. That file is the doctrine (how we talk,
when we touch, what plays exist). This file is the aim: *who* we point the
plays at, *where* they live, *how* we score them, and *how the aim gets
sharper every week*. Built 2026-07-16.

Section map here is independent of OUTREACH-SYSTEM.md's numbering. When
this file says "section 5" it means OUTREACH-SYSTEM.md section 5 unless it
says "Part". Routes A / A2 / B1 / B2 are defined in doctrine section 3.

Primary bulk data source for everything below: the OSM/Overpass business
database being built in parallel at `production/outreach/source-targets.mjs`
→ `targets-db.json`. Where this file says "the DB," that is the file. The
scorecard in Part 4 is written to be computed by that pipeline, not by hand.

Hard rule inherited from doctrine section 6: no fabricated local facts.
Every economic claim in Part 2 carries a source link or is marked
`(unverified - check)`. Example outreach lines follow section 6 voice: no
em dashes, peer-entrepreneur neighbor voice.

---

## Part 1 — Ideal-target profiles

Twelve profiles. Value tiers are calibrated to a small NC market (Cleveland
County median household income ~$58.5k), not a metro. Anchors:
**low = ~$800-1,500** (single-page Storefront / very small operator),
**mid = ~$1,800-3,500** (multi-page site, real business),
**high = ~$4,000-8,000+** (professional practice, multi-location, or
site + ongoing care). "Reachability" is scored against the reality that
Shelby is a 20k town where drive-by and mutual-contact intros are real.

### P1 — Mechanical trades (HVAC / plumbing / electrical)

| Field | Read |
|---|---|
| Cluster | HVAC, plumbing, electrical contractors; solo-to-15-truck operators |
| Decision-maker | Owner-operator, often the person answering the phone. Reachable by phone from GBP, in person, FB page. Email often generic (info@ or a Gmail). |
| Pain shape | "Slow week" = phone stops ringing. They blame the season, not the SERP. They buy leads from Angi/Thumbtack and resent it. |
| Route | **A primary** (visible-but-losing) / **A2** for pos 6+ single-query / **B2** if Facebook-only |
| Evidence that lands | SERP positions across the 4 money queries (the HVAC gap file is the template). "You show up 4 times, never #1." |
| Value tier | **Mid-high**. High-ticket jobs = they can afford a real site + care plan. |
| Disqualifiers | Already ranks #1 across its queries (Settle HVAC pattern = referral partner, never first-pitch). National franchise (One Hour, Aire Serv). A site with a visible agency footer redesigned <18mo ago. |

### P2 — Roofing & exterior (roofing / siding / gutters / decks / fence)

| Field | Read |
|---|---|
| Cluster | Roofers, siding, gutters, decks, fencing, pressure-wash. Storm-driven demand. |
| Decision-maker | Owner or a sales lead. Reachable by phone/FB. Storm-chaser out-of-town crews exist here - verify local before pitch. |
| Pain shape | Feast/famine. After a hail event everyone's slammed; off-season the local guys starve while directories eat the searches. |
| Route | **A primary** (roofing was top-right quadrant with HVAC in xref-2026-07-09) |
| Evidence that lands | SERP gap + directory dominance (Angi/roofing-aggregators crowd top-5). "Yelp and Angi are the top 3 results, then you." |
| Value tier | **Mid-high**. Big job values; strong before/after visual material for the build. |
| Disqualifiers | Out-of-town storm crew with a PO box. Pure subcontractor (no direct consumer sales = no reason for a lead site). National exterior franchise. |

### P3 — Auto repair & detail

| Field | Read |
|---|---|
| Cluster | Independent mechanics, transmission/brake shops, detailers, tint, tire. |
| Decision-maker | Shop owner, in the bay, hard to reach by email. Best channels: in-person, phone, FB page DM. |
| Pain shape | Heavy phone-call intent, near-zero web sophistication. Many run on Facebook + word of mouth entirely. "We're busy enough" until a slow month. |
| Route | **B1 archetype** (auto was top-left in xref = strong incumbents, DD 0.75 directory-heavy) / **B2** for the many Facebook-only shops |
| Evidence that lands | The auto-shop archetype demo (PIPELINE Track B #2) - "here's what a shop site that rings the phone looks like." Gap read is weaker here because demand is not in question-form. |
| Value tier | **Low-mid**. Price-sensitive owners; lead with Storefront to prove value, upsell later. |
| Disqualifiers | Dealership (has corporate web). National chain (Firestone, Meineke, Take 5). Shop with no consumer-facing name (fleet-only). |

### P4 — Restaurants & food

| Field | Read |
|---|---|
| Cluster | Independent restaurants, BBQ, cafes, food trucks, caterers, bakeries. |
| Decision-maker | Owner/GM, reachable in person and via the very-active FB page. Notoriously slow email. |
| Pain shape | "We need more covers on weeknights." Menu lives on a Facebook photo from 2022; no online ordering; Google shows wrong hours. |
| Route | **B2 Storefront** (many are FB/Instagram-only) / **A2** for ones with a dead old site |
| Evidence that lands | This is the portfolio's deepest strength (steakhouse, BBQ, bar-grill, bakery already built). Show the archetype + "your menu isn't on Google." |
| Value tier | **Low-mid**. Thin margins, but highest portfolio-fit and easiest yes = volume + proof engine. |
| Disqualifiers | Franchise fast-food. Place already on a good ordering platform with a clean site. Closing/for-sale (churn risk). |

### P5 — Salon / barber / spa / nails

| Field | Read |
|---|---|
| Cluster | Hair salons, barbershops, nail/lash, day spas, med-spa-lite. |
| Decision-maker | Owner-stylist or booth-rent owner. Reachable via Instagram DM and FB. Very online personally, business often isn't. |
| Pain shape | Booking chaos. Appointments lost in Instagram DMs; no online booking; new-client discovery happens on IG, not Google. |
| Route | **B2 Storefront** primary (booking-page angle) / **B1** once a salon archetype exists (PIPELINE Track B #3) |
| Evidence that lands | "Stop losing appointments to DMs" (blog #4 exists as the hook). Booking-flow demo beats a SERP gap - salon-spa was bottom-left in xref (low urgency in search). |
| Value tier | **Low-mid**. Booking integration is the upsell that lifts it to mid. |
| Disqualifiers | Booth renters with no business identity of their own. Franchise (Sport Clips, Great Clips). Salon already on Vagaro/Booksy with a decent embedded site. |

### P6 — Landscaping / lawn / outdoor

| Field | Read |
|---|---|
| Cluster | Lawn care, landscaping, tree service, hardscape, irrigation, pest. |
| Decision-maker | Owner on a truck. Phone/FB only, essentially never email. |
| Pain shape | Seasonal quote-driven. Spring rush, winter drought. Competes on price because there's no site to establish quality. |
| Route | **B2 Storefront** / **A2** (landscaping was bottom-right in xref = weak specialists but low search demand, so outbound-led not gap-led) |
| Evidence that lands | Before/after imagery in an archetype demo (PIPELINE Track B #4). SERP gap is thin here; the pitch is "look professional enough to charge more," not "you're losing a search." |
| Value tier | **Low-mid**. Commodity perception; Storefront to differentiate. |
| Disqualifiers | One-man side-hustle with no intention to grow. National lawn franchise (TruGreen, Lawn Doctor). |

### P7 — Dental / medical / vet private practices

| Field | Read |
|---|---|
| Cluster | Independent dentists, orthodontists, optometrists, chiropractors, PT, vets, small private medical. |
| Decision-maker | Practice owner (doctor) or office manager. Office manager is the real gate; reachable by email + phone. Slower, more formal. |
| Pain shape | "We want more new patients, not just recalls." Often has a dated template site from a dental-vertical vendor; overpays for a locked platform they don't own. |
| Route | **A primary** (they rank but on a weak vendor site) / occasionally **B1** with the Clover Dental archetype already in portfolio |
| Evidence that lands | SERP gap + the "you don't own your site" angle (blog #5 exists). Clover Dental piece is direct proof-slot fit. |
| Value tier | **High**. Biggest budgets in the county for local service web; longest sales cycle. |
| Disqualifiers | DSO / corporate-owned practice (web controlled centrally - check for a group brand). Hospital-affiliated. Practice mid-contract with a dental-web vendor. |

### P8 — Professional services (law / accounting / insurance / financial)

| Field | Read |
|---|---|
| Cluster | Solo/small-firm attorneys, CPAs, bookkeepers, independent insurance agents, financial advisors, real-estate brokers. |
| Decision-maker | The principal. Reachable on LinkedIn (the one profile where LI is the right channel per doctrine section 10) + email. |
| Pain shape | Credibility gap, not volume gap. A weak site loses a client who is comparing three firms. Referral-driven but the site closes or kills the referral. |
| Route | **A primary** (they're findable, the site just underperforms) / referral-partner angle overlaps here |
| Evidence that lands | Less SERP-gap, more "your site is the handshake and it's dated." Trust/credibility framing. Their clients are also the studio's target businesses = referral flywheel. |
| Value tier | **Mid-high**. Values presentation, can pay, slow to decide. |
| Disqualifiers | Franchise agency (State Farm/Edward Jones offices run on corporate templates - usually a SKIP, see P12). National-firm branch. Attorney with an active bar-vendor contract. |

### P9 — Fitness / studios

| Field | Read |
|---|---|
| Cluster | Independent gyms, CrossFit boxes, yoga/pilates, martial arts, dance, personal training. |
| Decision-maker | Owner-coach. Reachable via IG + FB; personally online. |
| Pain shape | Membership churn and class-schedule confusion. Schedule lives on an app or a FB post; discovery and sign-up friction bleeds trials. |
| Route | **B2 Storefront** (schedule + trial-signup page) / **B1** later |
| Evidence that lands | Schedule/membership demo. Not a SERP play (low local search volume); it's a "make signing up frictionless" play. |
| Value tier | **Low-mid**. Membership-integration upsell lifts it. |
| Disqualifiers | Franchise (Planet Fitness, Anytime, Orangetheory, F45 - corporate web). Box already on a good vertical platform (Wodify/Mindbody with a clean front end). |

### P10 — Retail storefronts

| Field | Read |
|---|---|
| Cluster | Boutiques, gift shops, home decor, specialty food/wine, hardware, florists, uptown Shelby independents. |
| Decision-maker | Owner behind the counter. Best channel: walk in (drive-by list, PIPELINE Track D). |
| Pain shape | "Foot traffic is down." No e-commerce, hours wrong on Google, Instagram is the whole storefront online. |
| Route | **B2 Storefront** (hours/products/where-to-find-us) / e-comm is a bigger upsell, usually phase 2 |
| Evidence that lands | GBP + local-discovery angle ("people searching 'gift shop Shelby' can't find you"). Uptown Shelby has a walkable cluster of these - efficient drive-by yield. |
| Value tier | **Low** (info site) to **mid** (if they want to sell online). |
| Disqualifiers | Franchise/chain retail. Store already on Shopify with a decent theme. Antique-mall booth (no independent identity). |

### P11 — Event & photography services

| Field | Read |
|---|---|
| Cluster | Wedding/portrait photographers, videographers, event planners, DJs, venues, rentals, florists (event side). |
| Decision-maker | Owner-operator, image-conscious, reachable on IG + email. Understands "the site is the product." |
| Pain shape | Portfolio is scattered across Instagram; no inquiry form; loses booking to whoever has the cleaner site. Kings Mountain casino resort + county wedding-venue growth is a demand tailwind (see Part 2). |
| Route | **A2 / B2**. They often have *a* site (Wix/Squarespace) - the play is "it doesn't convert," not "you have none." |
| Evidence that lands | The designer-portfolio piece in the current portfolio is direct proof-fit. Conversion/inquiry-form framing. |
| Value tier | **Mid**. Design-literate, values craft, expects to pay for it. |
| Disqualifiers | Hobbyist with no LLC/booking intent. Photographer already on a strong purpose-built platform (Pixieset/ShootProof front end that works). |

### P12 — Franchise / chain locations — **SKIP profile**

| Field | Read |
|---|---|
| Cluster | Any location of a regional/national brand: fast food, franchise trades, franchise gyms/salons, chain retail, branch offices, DSO dental. |
| Why skip | The web presence is controlled by corporate. The local owner/manager **cannot buy a site** even if they want one - it's a brand-compliance violation. Zero close-ability regardless of how bad the local page is. |
| The one exception | A *multi-unit local franchisee* who owns the LLC and has latitude for a local landing/microsite (rare, and they'll tell you fast). Treat as a P1-P11 lead only after they confirm they control their own web. Default assumption is SKIP. |
| Action | Hard disqualifier in Part 4. Flag and drop at sourcing; do not spend a scorecard slot. |

---

## Part 2 — Geography: the rich-area map

Territory tiers. Every economic claim is sourced or marked unverified.
"Rich" here means *has spendable small-business owners with web-presence
gaps*, not household wealth alone.

### Tier 1 — Shelby + Cleveland County core (home turf)

The base. Local-trust is maximal ("a Shelby studio"), drive-by and
mutual-contact intros work, and the SERP evidence is already scanned.

- Cleveland County population ~100,991; median household income **$58,534**, average $76,018 (2024). ([Point2Homes](https://www.point2homes.com/US/Neighborhood/NC/Cleveland-County-Demographics.html))
- **Shelby uptown** is a Main Street America-accredited district with an active revitalization: the Shelby Foundation bought and is redeveloping historic Main St buildings (approved renderings June 2025), Buckeye Superstore expansion planned 2025, Shaw Building pre-planning grant. ([Uptown Shelby](https://www.uptownshelby.com/), [Richland Source 2025-06-28](https://www.richlandsource.com/2025/06/28/shelby-foundation-details-downtown-revitalization-effort/), [Richland Source 2025-02-05](https://www.richlandsource.com/2025/02/05/economic-development-housing-shelby-looks-ahead-to-2025-initiatives/)) → **retail/restaurant (P10/P4) cluster forming; walk the district.**
- **PPG** establishing a Cleveland County manufacturing center, ~$221.8M investment, announced May 2025 by Gov. Stein. ([NC Commerce](https://www.commerce.nc.gov/news/press-releases/2025/05/08/governor-stein-announces-ppg-will-establish-cleveland-county-manufacturing-center-creating-110-jobs)) → new payroll = downstream demand for trades/services, not a direct client, but a "the county is investing" talking point that is true.

**Tier-1 targeting note:** highest priority for every profile. Start here, saturate responsibly (Part 5 spacing rules), then step out.

### Tier 2 — Adjacent towns (ranked by opportunity, not distance)

| Town | Include? | Why (sourced) | Best profiles |
|---|---|---|---|
| **Kings Mountain** | **YES - Tier 2 top** | Pop 11,838 (Jul 2025); Catawba Two Kings Casino introductory phase open May 20 2026, permanent resort Spring 2027, ~**2,200 jobs**, $1B project off I-85. Housing boom: Lacey Orchard (400 townhomes/SFH + 9-acre commercial center on Hwy 74 Business), new homes $350-450k, prices doubled in 5yr. ([Census QuickFacts](https://www.census.gov/quickfacts/fact/table/kingsmountaincitynorthcarolina/PST045224), [WCNC 2026-02-09](https://www.wcnc.com/article/news/local/catawba-two-kings-casino-progress-update-2-9-2026/275-36f2a537-1314-4610-ad6c-f00001752bc1), [Post & Courier](https://www.postandcourier.com/spartanburg/business/catawba-two-kings-casino-resort-kings-mountain-nc/article_871a828e-c6af-4469-ae3c-b90a406cb883.html), [HouseCashin 2025](https://housecashin.com/investing-guides/investing-kings-mountain-nc/)) | Event/photo (P11), restaurants (P4), retail (P10), all trades (P1/P2) riding the housing + commercial build-out |
| **Boiling Springs** | **YES** | Gardner-Webb University, 3,000+ students (~1,840 on-campus undergrad + ~1,075 online), private Baptist. ([Wikipedia](https://en.wikipedia.org/wiki/Gardner%E2%80%93Webb_University), [US News](https://www.usnews.com/best-colleges/gardnerwebb-university-2929)) A college anchor = steady student/parent/faculty spend supporting food, fitness, salon, retail. Direct GWU economic-impact figure on the *town*: `(unverified - check)`. | Restaurants/food (P4), fitness (P9), salon (P5), retail (P10) |
| Kings Mountain / Grover / Earl (I-85 southern corridor) | YES (with KM) | Same casino/I-85 growth spillover; small but on the up-corridor. | Trades, food |
| Lawndale / Fallston / Polkville (northern county) | YES (opportunistic) | Rural Cleveland County; low business density, but zero local competition and full home-trust. Thin bench, work via DB sweep not drive-by. | Trades (P1/P2), landscaping (P6), auto (P3) |
| Mooresboro | YES (opportunistic) | County-edge, small. Same profile as northern towns. | Trades, auto |
| **Cherryville** | YES | Gaston County edge, ~6k, established small-business base, close to Shelby. | Trades, auto, retail, restaurants |
| **Lincolnton** | YES - Tier 2 mid | Pop 12,769; median HH income **$46,320**; manufacturing-heavy (largest industry 1,316 jobs); Lincoln County is on the growing Charlotte-metro edge. ([World Population Review](https://worldpopulationreview.com/us-cities/north-carolina/lincolnton), [Data USA](https://datausa.io/profile/geo/lincolnton-nc/)) Further from Shelby - "local studio" trust weaker; lead with portfolio, not neighborliness. | Trades, professional (P8), dental (P7), restaurants |
| **Forest City / Rutherfordton / Spindale** | YES (lower priority) | Forest City pop ~7,397, median HH income **$35,524**, poverty 25.6%; Rutherford County is a state **Tier One (economically distressed)** county. ([Census QuickFacts](https://www.census.gov/quickfacts/fact/table/forestcitytownnorthcarolina/PST045224), [Rutherford EDC](https://rutherfordncedc.com/)) Lower incomes = smaller budgets = lead with **B2 Storefront** (free), convert up later. | Restaurants, retail, trades - Storefront-first |
| **Gaffney, SC** | **EXCLUDE (default) / opportunistic-only** | Pop 12,450, median HH income $41,089, poverty 29%. ([World Population Review](https://worldpopulationreview.com/us-cities/south-carolina/gaffney)) **Reasons to exclude:** (1) across a state line - "Shelby NC studio" local-trust doesn't carry; (2) SC business licensing/sales-tax context differs; (3) lower incomes than Cleveland County; (4) the SERP/geo content strategy is built NC-first. Include a specific Gaffney business *only* if it's a warm inbound or a mutual-contact intro - never cold-source it. |

### Tier 3 — Metro edge (Gastonia / Hickory / Charlotte fringe)

Only when justified, never as base bench. The studio's whole advantage is
being *the local one*; in Gastonia or Charlotte it's one of hundreds of
agencies and the trust edge evaporates.

- **Justified when:** a warm referral, a niche where the studio has a
  standout archetype and can compete on portfolio alone, or a Kings-Mountain
  overflow client whose service area already reaches Gastonia.
- **Not justified for:** cold trade/retail sweeps. Do not spend sourcing
  hours here while Tier 1-2 bench is under 30.

**Rich-area one-line map:** Home base Shelby (invest here first) → Kings
Mountain is the growth story (casino + housing, chase it) → Boiling Springs
is the steady college-anchor town → Lincolnton/Cherryville are reachable
mid-tier → northern-county + Rutherford are Storefront-first low-budget →
Gaffney and the metro edge are referral-only.

---

## Part 3 — Sourceable areas ranked per profile

The DB (`source-targets.mjs` → `targets-db.json`) is the **primary bulk
source** for every profile: it pulls OSM/Overpass business records
(name, category, location, website-present flag, phone) for the whole
territory in one pass. Everything below is what *supplements* the DB to
fill the fields the DB can't (owner name, review count, site quality,
social-only status). Ranked by yield-per-hour, best first, per profile.

| Profile | 1st (highest yield/hr) | 2nd | 3rd | Notes |
|---|---|---|---|---|
| P1 Trades | SERP scan (`ad-gap.mjs`) - already ranks them by gap | Google Maps sweep (note "no website" + reviews) | FB "[trade] Shelby NC" for social-only | SERP-led: demand is in search. DB tags website-absent for B2 splits. |
| P2 Roofing/exterior | SERP scan (directory-heavy = clear gap) | Google Maps sweep | Storm-season FB groups / local news | Verify local vs storm-chaser before pitch. |
| P3 Auto | Google Maps category sweep (most are Maps-first) | FB pages (many social-only) | Drive-by (shops on main roads) | SERP weak; Maps + FB is where they live. |
| P4 Restaurants | Google Maps + FB (menus live on FB) | Drive-by (uptown Shelby cluster) | Nextdoor / "best [food] in Shelby" threads | Portfolio-fit is high; volume source. |
| P5 Salon/barber | **Instagram** (they market on IG) | FB pages | Google Maps | IG DM is the channel and the source. |
| P6 Landscaping | Google Maps (many no-site) | FB pages/groups | Drive-by (trucks, yard signs) | Phone/FB only; email near-useless. |
| P7 Dental/medical/vet | Google Maps + SERP (they rank, weakly) | Chamber directory (professional listings) | Practice site footer (vendor lock = angle) | Office manager is the gate; email works. |
| P8 Professional | **LinkedIn** (principals are there) | Chamber directory | SERP scan | Referral-partner overlap; LI is source + channel. |
| P9 Fitness | Instagram + FB | Google Maps | Drive-by (strip-mall studios) | Schedule-on-an-app = the tell. |
| P10 Retail | **Drive-by** (uptown Shelby walk) | Instagram | Google Maps | Walkable cluster = best yield/hr in the county. |
| P11 Event/photo | **Instagram** (portfolio lives there) | Wedding/venue directories, The Knot | Google (they have weak Wix sites) | Design-literate; judge their current site fast. |
| P12 Franchise | n/a - **flagged and dropped** at DB stage | - | - | The DB's brand-name match auto-flags chains. |

**Cross-source rule (yield discipline):** run the DB sweep first (one call,
whole territory), then spend human hours only on the top-scored rows it
returns. Never manually browse Maps for a category the DB already
enumerated - use the manual channels only for the fields the DB lacks
(owner, reviews, site quality, social-only confirmation).

---

## Part 4 — The worth-targeting rubric (computable scorecard)

Extends OUTREACH-SYSTEM.md section 5's 4-factor score into a scored
qualification. Written to be implemented by the DB pipeline. Two stages:
**hard disqualifiers (pass/fail) → scored factors (0-100) → band.**

### Stage 1 — Hard disqualifiers (any one = DROP, never scored)

1. **Chain / franchise / corporate-controlled web** (P12). DB brand-match + "part of a group" check.
2. **Closed, closing, or for-sale.** (GBP "permanently closed," listing, or no activity 12mo+.)
3. **Existing agency relationship visible.** Site footer credits an agency AND was built/redesigned < 18 months ago. (An old agency site is a *target*, not a disqualifier.)
4. **Direct-competitor conflict.** Same niche + same town as an active client or an in-flight target this cycle (doctrine section 5's "no two same-niche same-week," enforced as data). Hold, don't drop - re-eligible next cycle.
5. **Out of territory.** Beyond Tier 3, or Gaffney/SC without a warm intro (Part 2).

### Stage 2 — Scored factors (sum to 100)

| Factor | Max | How to score |
|---|---|---|
| **Web-presence gap severity** | 30 | Ranks-with-NO-site (B2 gold) = 30 · social-only (FB/IG only) = 25 · dead/broken domain = 20 · weak old site (dated, not mobile, vendor-locked) = 12 · decent site with a real flaw = 5 · good current site = 0 (→ likely drops below band) |
| **Search demand for the niche** | 20 | From `ad-xref.mjs` DR/SA for that niche: top-right quadrant (hvac/roofing) = 20 · top-left (auto) = 14 · other measured = 10 · unmeasured niche = 8 (neutral) |
| **Review count / rating (revenue proxy)** | 20 | 100+ reviews & ≥4.3 = 20 · 40-99 = 15 · 15-39 = 10 · <15 = 5 · none = 2. High reviews + weak site = the priority combo (real revenue, fixable gap). |
| **Reachability of owner** | 15 | Named owner + direct email = 15 · owner name + phone/DM = 11 · generic email/DM only = 7 · phone only = 4 · nothing findable = 0 |
| **Portfolio / proof-slot fit** | 10 | Direct archetype exists (restaurant, dental, trades concept) = 10 · adjacent = 6 · none yet = 2 |
| **Route clarity** | 5 | One obvious route (A/A2/B1/B2) = 5 · two plausible = 3 · unclear = 1 |

Total possible: 100.

### Stage 3 — Bands

| Score | Band | Action |
|---|---|---|
| **70-100** | **SEND** | Eligible for this week's send list (subject to Part 5 spacing). Hand-verify SERP freshness (doctrine section 7) before opener. |
| **45-69** | **BENCH** | Qualified, queued. Re-scored monthly; promotes on a new signal (fresh review spike, site goes dead, niche re-scan). |
| **< 45** | **DISCARD** | Not worth a touch now. Log the score so the monthly re-rank can catch movement; don't re-source it. |

**Tie-break for the send list** when more rows sit ≥70 than the weekly cap
allows: (1) higher gap-severity, (2) Tier-1 town over Tier-2/3, (3)
better proof-slot fit. The bench never empties; the cap does the throttling.

---

## Part 5 — The reinforcement loop (targeting gets smarter weekly)

Every outcome is a training signal. Kept as simple +/- adjustments, not
fake math. The unit that gets adjusted is a **profile-town cell** (e.g.
"P4 restaurants in Kings Mountain"), plus a lighter profile-wide and
town-wide roll-up.

### (a) Signal → adjustment table

Applied to the profile-town cell's **priority modifier** (starts at 0;
the modifier is added to that cell's rows' scores at re-rank, capped at
±15 so one win can't dominate forever).

| CRM outcome | Modifier change | Also do |
|---|---|---|
| **WON** | **+10** | Lock the archetype/route that won; clone the approach for that cell. |
| **CALL booked** | **+5** | Note which opener/evidence earned the call. |
| **ASSET-YES** (took the read) | **+3** | If asset-yes but then silence, the *asset* is the problem, not the target (doctrine section 14) - flag for asset review, don't penalize the profile. |
| **REPLY** (any, non-negative) | **+2** | Capture the objection/question; it's free copy research. |
| **NO-REPLY** through full sequence (5 touches) | **-2** | Roll into the silence review (b). |
| **STOP / negative** | **-3** | Record the *reason* verbatim; a reason ("we just rebuilt") is worth more than the -3. |

Guardrails: modifier is bounded ±15. A single WON does not auto-blast that
cell - Part 5(e) saturation still caps sends. Signals age out: at each
monthly re-rank, decay every modifier 20% toward 0 so stale wins/losses
fade and fresh data leads.

### (b) Weekly Friday review (add to the CRM Friday sweep)

Three questions, answered from the week's touch log:

1. **Which profile-town cells replied, which went silent?** (Reply rate per cell, not just overall.)
2. **What did the silent ones share?** (Same niche? Same town? Same channel? Same opener angle? A shared trait is the lesson.)
3. **What did any reply *say*?** (Objection, question, or interest - one line each into a running "objections" list that feeds opener rewrites.)

Output: apply the (a) modifiers, flag any asset-yes-then-silence for asset
review, and set next week's send list from the top-scored eligible rows.

### (c) Monthly re-rank

- Recompute all bench/send scores with the current modifiers applied and the 20% decay.
- Re-order the profile list and the town list by realized reply/asset-yes rate (not just theoretical score).
- Promote bench→send any cell whose realized rate beats the current send set; demote the reverse.
- One paragraph: "what changed and why," appended to this file's changelog (below).

### (d) Quarterly SERP re-scan (feeds fresh evidence)

- Re-run `ad-gap.mjs` + `ad-xref.mjs` (doctrine section 7). New scrape date in the filename; old assets over 45 days are dead until re-verified.
- Re-score the niche matrix; a niche that shifted quadrant changes its P-profile route (e.g. if auto moves top-right, P3 gains a Route-A option).
- Refresh the "search demand" factor (Part 4) for every profile from the new xref numbers.

### (e) Saturation rules (a small market must never feel blanketed)

Extends doctrine section 5's "no two same-niche same-week."

| Scope | Cap |
|---|---|
| Per niche, per **week** | Max 2 openers (doctrine's rule, hardened to a number). |
| Per niche, per **quarter** | Max 5-8 openers (matches the HVAC-file guidance). |
| Per **town under ~8k pop** (Boiling Springs, Cherryville, Forest City, rural county) | Max 3 openers/**month** across ALL niches - small towns talk. |
| Per **town 8k-15k** (Kings Mountain, Lincolnton, Gaffney-if-ever) | Max 5 openers/month across all niches. |
| Shelby (Tier 1) | Max 8 openers/week total (aligns with doctrine's 10/day, 25/week email cap; the town-trust is the asset to protect). |
| Same target, any channel | Never inside 5 days (doctrine section 8). |

The point: in a 20k town, one "this guy spams" comment costs more than 100
sends earn (doctrine section 1). The caps are a brand-protection instrument,
not just a deliverability one.

### (f) Kill criteria (retire a dead profile)

A **profile-town cell** goes to COLD STORAGE (stop sourcing it, stop
spending sends) when **all** hold:

- **≥ 12 openers** sent into the cell across **≥ 2 monthly cycles**, AND
- **0 asset-yes** (a reply-only-then-silence still counts as no-yes), AND
- No structural reason to expect a change (no new archetype shipped for it, no niche quadrant shift).

Cold storage is not deletion - it's "the aim was wrong here, stop feeding
it." Revisit a cold cell only on a real trigger: a new matching archetype
ships (changes proof-fit), the niche re-scan moves its quadrant, or a warm
inbound arrives from it. Log the kill with its numbers so the quarterly
review can tell a genuinely dead cell from one that was just under-fed.

---

## Part 6 — Capacity & notability audit (the budget lens)

The Part 4 scorecard proves the GAP is real. This audit proves the BUDGET
is real. It runs on SEND-band rows only (don't spend audit effort on
unverified bench), and it never changes the 0-100 score — it adds a
`capacity` field ({tier, signals[], notes}) that orders the send list and
picks the angle. Never guess income; record observable signals only,
tier stays null when signals are thin.

### Signals (observable, no fabrication)

| Signal | What it looks like | Weight |
|---|---|---|
| Longevity | 10+ years operating, "since 19xx", multi-generation | strong |
| Notability | press features, festival presence, "institution" status, landmark building, big FB following | strong |
| Review mass + velocity | 300+ reviews, recent reviews weekly | strong |
| Scale | second location, food truck/catering arm, visible staff count, fleet trucks | strong |
| Price level | $$ or $$$ on Google/Yelp; trades with big-ticket work (installs vs repairs) | medium |
| Investment behavior | recent renovation, new signage, hiring posts, equipment purchases | medium |
| Property | owns the building (county GIS/tax records show matching owner) | medium |
| Counter-signals | cash-only, "closing early - short staffed" posts, for-sale listing, hobby-scale hours | negative |

### Tiers and what they change

| Tier | Read | Angle |
|---|---|---|
| HIGH | Multiple strong signals; established money | Work FIRST. Full-project framing is honest here; gap read leads, real proposal expected. |
| MID | Steady, single-location, healthy | Standard play for its route. Most of the list. |
| LOW | Marginal, hobby-scale, or visibly strained | Stays in the list but gets ONLY low-commitment angles: Storefront, calculator, goodwill. Never pitch a full build at someone who can't afford it - that's the opposite of community uplift. |
| null | Signals too thin to call | Treat as MID, note what would resolve it. |

Ordering rule: within SEND, HIGH tier first, then by score. LOW never
leaves the list (today's hobby shop is next year's second location), it
just gets the angle that respects its reality.

---

## Changelog

- 2026-07-16 — File created. 12 profiles, territory tiered (KM casino +
  GWU + Rutherford Tier-One verified; Gaffney excluded-by-default),
  100-point scorecard, reinforcement loop with ±15-bounded decaying
  modifiers and kill criteria. No CRM outcomes yet, so all modifiers = 0.
- 2026-07-16 (later) — Part 6 capacity & notability audit added (budget
  lens on the SEND band; tiers order the list and pick the angle, score
  untouched).
