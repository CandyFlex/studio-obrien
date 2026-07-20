# Cycle Log — append-only record of research cycles

Each scheduled or manual research cycle appends an entry: what was done,
band counts after, and what the next cycle should pick up. Read this
FIRST at the start of every cycle; never repeat completed work.

---

## Cycle 0 — 2026-07-16 (manual, session buildout)

Done:
- Full system built: OUTREACH-SYSTEM.md, CRM.md, INFRA-CHECKLIST.md,
  SOCIAL-PLAYBOOK.md, TARGETING.md, INTEL-SYSTEM.md, REPLY-PLAYBOOK.md,
  email-templates/ (5 dark + 1 light + DESIGN-DIRECTION.md).
- Pipeline live (source-targets.mjs): OSM fetch 986 businesses, probe,
  TARGETING Part-4 scoring, verify-queue/apply-verify cycle.
- Verification batch #1 COMPLETE: all 40 top rows researched (two Opus
  agents), merged, applied. Catches: Red Bridges has bridgesbbq.com
  (good site — not a target), 3 closures dropped (Bill's Place, Sagebrush
  Shelby, Big Al's of Shiloh), 2 town fixes applied (Flying Pig -> Shelby,
  Young & Alexander -> Rutherfordton), 13 owner names captured.

Bands after: SEND 11, BENCH 483, DISCARD 46, DROP-chain 402, DROP-territory 44.

Flags for next cycle:
- Mitchem's Kitchen (Vale, score 77, 912 reviews) is in SEND but
  exists=null — Yelp says closed Apr 2026, FB active. Needs a phone-call
  or drive-by verification before ANY use. Do not treat as sendable.
- Doggett Heat and Air + Enzo's Pizzeria: recorded website URLs did not
  resolve on check — possible lapsed domains (strong angle if confirmed).
- SpotHopper/vendor-template sites (Copper Penny, Home Place, Big Dave's,
  Panda, Spin City) = "you don't own your site" vendor-lock angle, Route
  A2, NOT a no-site pitch.
- 5 sites returned 403/blank on fetch (Barley's, Circle B, Pancake House,
  Pie Safe, Panda) — liveSiteGrade null, needs browser-based grading
  (Playwright) not fetch.

Next cycle should:
1. verify-queue 40 (next provisional tranche) -> research -> apply.
2. First L4 fresh-lead feed pass (SoS new filings, env-health CTY=23).
3. Deep-dive rotation starts at: browser-grade the 5 fetch-blocked sites.

Standing mandate: RESEARCH AND DATABASE ONLY. Nothing sends, nobody is
contacted. Jarred owns every send decision.

---

## Cycle 1 — 2026-07-16 (manual, capacity + tranche 2)

Done:
- TARGETING.md Part 6 added (capacity & notability audit; tiers order the
  send list, never change the score). Pipeline: apply-capacity command,
  HIGH-first SEND ordering, durable `closed` flag in scorer.
- Capacity audit applied to 16 rows: 6 HIGH / 4 MID / 3 LOW / 3 null.
- Verification tranche 2 COMPLETE (40 rows, batches C+D): auto cluster,
  Cherryville, Boiling Springs, Kings Mountain. 13 more owner names.
- 8 durable closures (Louie's, Flying Pig->Thelma Lou's, Bill's Place,
  Sagebrush, Big Al's, Barnes Tire, Papa's Pizza Cherryville, Kind).
- 3 hidden chains dropped (Papa's Pizza Boiling Springs = Papa John's,
  Edge Express = Charlotte chain, Dixie Tire = Main Street Auto group).

Bands after: SEND 18, BENCH 457, DISCARD 54, DROP-closed 8, chains 405, SC 44.

Working notes / flags:
- SEND is HIGH-first: Jesse James RR Express, Jan's, Italian Garden,
  Shake Shop Spindale (+Mitchem's pending phone check). New strong adds:
  Willis Auto Electric (since 1961, Tommy Willis, edan.io microsite only),
  The Honey Hog (371@4.5, FB-only), White Tire Center Lawndale (154@4.8).
- Shake Shop CHERRYVILLE (separate from Spindale one): 763@4.2, "Best
  Burger in NC" per Our State, no site — sits at BENCH 68, one review-
  rating-tenth from SEND. Notability says treat as SEND-equivalent.
- Diversified Cabinetry (BENCH 55): 26 yrs, high-ticket, NO SITE; owner
  lookup needs MANUAL sosnc.gov (403s automated fetch). Phone conflict:
  704-473-2222 (directory) vs 704-487-1733 (OSM) — reconcile.
- Identity TRAPS recorded in db notes: wattsautomotive.com (Utah dealer,
  not Shelby shop), whitetirecenters.com (chain, not the Lawndale shop).
- Alston Bridges + Hendren Racing: real but weak/dated own sites →
  DISCARD by score; both are notability-heavy Route-A candidates if the
  live-site grading factor gets applied (liveSiteGrade "weak" = 12 pts
  didn't lift them past the band). Revisit when Route A opens.
- Thelma Lou's BBQ and Grill (new at old Flying Pig address, Shelby) not
  yet sourced — add as fresh row next cycle.

Next cycle should:
1. verify-queue 40 (tranche 3) -> research -> apply.
2. First L4 fresh-lead feed pass (still not done).
3. Manual-lookup shortlist for Jarred: sosnc.gov for Diversified
   Cabinetry + Shelby Transmission officers; phone checks Mitchem's +
   Young and Alexander.
4. Browser-grade the fetch-blocked sites (carried from Cycle 0).

---

## Cycle 2 — 2026-07-16 ~08:00 (manual "proceed with scraping" wave; tranche 3 + first L4 pass)

Done:
- Verification tranche 3 (40 rows, batches E+F): Ellenboro/Earl/Grover,
  Shelby, Cherryville, Kings Mountain.
- FIRST L4 registry feed pass (sources/l4-feed-pass-2026-07-16.md):
  env-health portal FULLY AUTOMATABLE (874 rows headless), Chamber events
  calendar automatable, SoS 403-bot-blocked (browser-only; try Playwright).
  INTEL-SYSTEM section 2 updated: feeds reordered, web-status gate added,
  KM saturation note added. 5 fresh leads harvested.
- Data hygiene: 5 more chains/corporate (Hunt Brothers, Fatz, Bantam Chef,
  Jellystone resort outlets x2), 6 closures, 3 SC mislabels (were "Kings
  Mountain", actually Clover SC), 5 Cherryville->Lincolnton relabels,
  El Taco Loco site marked dead (suspended domain).

Bands after: SEND 21, BENCH 437, DISCARD 59, closed 14, chains 410, SC 45.

New SEND-worthy finds:
- Dawgs Sports Bar + La Loma (Shelby, FB-only, clean B2).
- Fausto Coffee (LINCOLNTON not Cherryville): roaster+bakery since-1995
  story, named owners (Miriah Truluck-Rhodes & Jacob Rhodes), FB/IG only.
- The Social House by Royal T (Kings Mountain) — DOUBLE-corroborated
  (L4 feed + verification): new inspection 7/13, investment-grade fit-out,
  no site, public owner email. Best fresh lead in the system.
- El Taco Loco (Forest City) — 4.7 rating, own domain SUSPENDED. A2 gold.
- Court Street Grille (Lincolnton) — dated agency site, named owners.
- Images Sign Service LLC (Bostic) — B2B sign shop, owner Brian Collier,
  no site; referral-relevant (sign shops meet every new business).

Flags:
- Newgrass Brewing + Shelby Cafe: real sites that blocked fetch (410/403).
  Browser-grade both (Shelby Cafe = 1922 institution, 2300 reviews).
- Zippers (Lincolnton, 1109 reviews): owner died per news - hold.
- Phantom rows to purge next cycle: China Wall, Dixie Diner KM, Joy Wok
  Earl, Nagoya KM (real KM Japanese = Yamato Express - source it),
  House of Pizza Cherryville (real one = Pizza Inn franchise).
- Note for later cycles: OSM town labels near county lines are unreliable;
  verification agents should always confirm town.

Next cycle should:
1. verify-queue 40 (tranche 4) -> research -> apply.
2. Playwright attempt on SoS New/Dissolved (the one blocked feed).
3. Capacity audit of the 10 new SEND arrivals (Part 6) -> apply-capacity.
4. Source fresh rows: Yamato Express (KM), Rhodies Food Truck (KM),
   Chubby's BBQ (KM), The Social House (KM - add as db row + fresh-lead).
5. Browser-grade: Newgrass, Shelby Cafe, + Cycle-0 fetch-blocked list.

---

## Cycle 3 — 2026-07-16 ~09:00 (manual wave; tranche 4 + capacity + fresh rows)

Done:
- Verification tranche 4 (40 rows, batches G+H): Forest City/Rutherford
  depth, 3 dental practices, Shelby bakeries, KM rows.
- Capacity audit applied to 10 new SEND rows (2 HIGH / 6 MID / 1 LOW /
  1 null; Willis id-mismatch fixed manually - db id is
  wills-auto-electric-shelby).
- 4 fresh L4 rows added to db (source: l4-feed): The Social House KM
  (social-only - best fresh B2), Thelma Lou's (live thin site - A route),
  Yamato Express KM (none - but verify owner web-control, may be local
  multi-location), Chubby's BBQ KM (live x2 domains - low priority).
  Rhodies skipped (has site).
- 5 phantoms retired from queue rotation.
- Hygiene: 5 more chains (Wings Etc, Osaka, US Wings, Fatz FC, Mi Pueblito
  Shelby group), Don's Italian closing 7/27 (owners retiring), Larkins
  Union Mills nonexistent, 14 town corrections incl the "Boiling Springs/
  Earl" cluster resolving to SOUTH CAROLINA (Gaffney/Boiling Springs SC),
  'Boiling Springs SC' added to SC_TOWNS.

Bands after: SEND 22, BENCH 415, DISCARD 75, closed 16, chains 415, SC 47.
~160 businesses human-verified so far.

Standout new targets:
- Phyllis' Sweet Shop (Uptown Shelby, Tier 1): generational institution
  bakery, 4.9@~87, ZERO site. Textbook B2 + walkable Uptown cluster.
- Main Street Dental Partners (Rutherfordton): independent Dr. Michael
  Marshall, vendor-locked dental template ("TheDocSites" footer) -
  flagship P7 "you don't own your site" target.
- Forest City Family Dentistry (Dr. Jeffrey D. Hall): in-territory dental,
  site is JS-rendered - needs browser grade.
- Blanton Miller & Moore (Rutherfordton): 4-dentist practice, site 403 -
  needs browser grade.
- Kelly's Seafood, Slim's Bar & Grill (moved to bigger location 9/2025,
  case-study candidate), Corner BBQ, Dan's (owner Dan Boling), Carolina
  Farmhouse, West End Car Wash: verified FB-only gap targets.

Flags:
- Hope House Coffee = 501c3 nonprofit: goodwill only, never pitch.
- Flyboy Pizza + Flygirl Brewing = same owners, ONE target.
- Sweet House Bakery owner "Karren Walls" is INFERRED from Wix URL - confirm.
- Dental sites need browser grading (bmmdental 403, fcfdentistry JS-only).
- Review counts in batches G/H partly non-Google (Yelp/FB/Restaurantji) -
  noted per row; Google counts to confirm during send-list prep.

Next cycle should:
1. verify-queue 40 (tranche 5) -> research -> apply.
2. Browser-grade queue (Playwright): bmmdental.com, fcfdentistry.com,
   newgrassbrewing.com, theshelbycafe.com, 440barandgrill.com + Cycle-0
   fetch-blocked list. Also Playwright attempt on SoS New/Dissolved.
3. Capacity audit of newest SEND arrivals (Phyllis', Kelly's, Slim's,
   Corner BBQ, Dan's, Carolina Farmhouse, West End Car Wash...).
4. Confirm: Honey Hog identity (Johnny Rays?), Small Town Coffee town,
   Sweet House owner, Yamato owner web-control.

---

## Cycle 4 — 2026-07-16 ~10:00 (manual exhaustive waves; tranches 5-6 + browser grades)

Done:
- Tranche 5 (batches I+J, 40 rows): autos/salons/rural retail. 15 owner
  names incl the FIRST direct email (Frank Hamrick, fhamrick@mbhamrickins.com).
  R-S 4-way duplicate consolidated. 2 chains (Griffin Bros, Autobell).
  NCDOT facility + Zumba artifact dropped (new `dropped` flag / DROP-other).
- Tranche 6 (batch K, 40 rows, TRIAGE MODE - worked well, 1 agent): 29
  convenience/fuel LOWs, CLECO satellite + Wedgewood venue chain + town
  rec center + 2 more chains dropped, Folk's Cleaner BS closed.
- Browser deep-dive: MCP Playwright unavailable (extension not installed);
  agent used repo's global Playwright headless Chromium successfully.
  GRADES: bmmdental GOOD (PBHS-locked), fcfdentistry FLAWED, Shelby Cafe
  GOOD (Toast-locked), Rutherford H&A WEAK, NEWGRASS BREWING = DEAD
  (HTTP 410 archived!), 440 Bar & Grill = NXDOMAIN dead, Doggett = NXDOMAIN
  confirmed. Scorer now uses liveSiteGrade for gap pts (weak12/flawed5/good0).
- SoS FINAL VERDICT: Cloudflare Turnstile blocks even headless Playwright.
  Human-browser-only forever. INTEL-SYSTEM updated.

Bands after cycles 4: SEND 24, BENCH 381->(pending tranche 7), verified ~240.

Standouts: NEWGRASS BREWING (award-winning Shelby brewery, DEAD site -
premium target once reviews captured), El Acapulco (Shelby 560@4.5 no
site), Cowan Tire (4.9@190, Net Driven vendor-lock), Horn's Tire
(4.8@109 no site), The Camper Pros (RV trade, default WP hello-world),
Fashion Corner (est 1981, FB-only), Washburn General Store (1831, NC's
oldest family business - notability, has site).

In flight: tranche 7 (batches L+M, 80 rows - salons/professional/dealers,
triage rules for gov/ABC/franchise-dealer/chains). Direct-apply when
landed (NOT via verify-queue - queue still holds tranche 5).

Next: apply L+M -> ~189 unverified left (deep rural retail tail) ->
tranches 8-9 in triage mode -> then bench-dry pivot per cron prompt.

UPDATE ~10:15: tranche 7 (L+M) APPLIED - SEND 27, BENCH 338, 189 unverified.

---

## Cycle 5 — 2026-07-16 ~11:00 — LANDSCAPE SURVEY COMPLETE

Tranches 8 (N+O, 80 rows) + 9 (P+Q+R, 109 rows) applied.
**UNVERIFIED REMAINING: 0.** Every eligible row in the original 990-row
OSM pull is now verified or triaged (507 rows carry verifiedAt; the rest
are auto-excluded chains/SC/gov).

FINAL BANDS: SEND 27 · BENCH 220 (verified, mostly has-site or low-cap)
· DISCARD 149 · chains 446 · gov/artifacts 76 · SC 53 · closed 19.

Late-wave standout finds:
- WorkShop Vintage Market (uptown Shelby, county's largest vendor market,
  80+ vendors, FB-only) - top Tier-1 retail find.
- Matthew's Gym (Forest City) - site COMPROMISED w/ injected gambling
  spam. Urgent honest rebuild angle.
- Vassey & Hemphill Jewelers (since 1946, no site, Rutherford Co).
- Spindale Drug (independent pharmacy since 1925, owners Bill & Lesley
  Koonce, generic chain-template site).
- Game Haven (Forest City, 390@4.7, FB-only), Kingdom Fitness
  (2 locations, Weebly), Autumn Lanes (bowling, FB-only), Powersport
  Supply (big-ticket, no site), Peach Tree Racquet Club (no site),
  Today's Pro (Shelby construction, DEAD domain), Southern Carpets
  (31 yrs, dead domain), Frame House Gallery (since 1986, no site),
  Oakland Feed & Seed (37 yrs, no site).

NOTE: several of the above sit in BENCH 60-69 only because reviews or
owner data weren't captured in triage mode - the near-miss list (top of
TARGETS-REPORT BENCH section) is the FIRST enrichment queue for future
cycles, cheapest promotions available.

NEXT CYCLES (bench-dry pivot per cron prompt):
1. Enrichment pass on BENCH 60-69 near-misses (reviews+owner fill = SEND
   promotions): Shake Shop Cherryville, Phyllis' Sweet Shop, Kelly's
   Seafood, Smoov' Kutz, Doggett, WorkShop Vintage, Game Haven, Matthew's
   Gym, Vassey & Hemphill, Autumn Lanes, Powersport Supply etc.
2. Capacity audit (Part 6) of all SEND rows lacking capacity tier.
3. L4 registry feeds weekly rhythm (env-health + chamber automatable).
4. OSM re-fetch with expanded categories/bbox if more raw material wanted.
5. Manual queue for Jarred: SoS lookups (Turnstile-blocked), phone checks
   (Mitchem's, Young & Alexander, Honey Hog identity).
New: Hamrick Grocery (Shelby 254@4.5 no site), Richard P. Williams (solo
attorney 30yr no site), S&R Auto (Richie Canipe since 1992, dated site),
Smoov' Kutz (4.9@111 booking-app-only), Sammy's Barber + Shear Pleasure
(DEAD domains), Encore Cuts, Carolina Bridal (30yr, dated Wix). 15+ owner
names. IN FLIGHT NOW: tranche 8 = batches N+O (80 rows, aggressive triage,
ids listed in sources/ on landing) - if a scheduled cycle fires while these
run, do NOT start another tranche; wait, apply N+O per the direct-apply
pattern, then continue with tranche 9 (~109 rows remain after N+O).
