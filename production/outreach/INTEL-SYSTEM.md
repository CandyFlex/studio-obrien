# Studio O'Brien — Business-Intelligence Layer

Third file in the outreach set. `OUTREACH-SYSTEM.md` is the doctrine (how we
talk, when we touch), `TARGETING.md` is the aim (who, where, the 100-point
scorecard). This file is the **intel**: where the scorecard's facts actually
come from, verified to real public-record and community sources, and the
cadence that keeps those facts fresh. Built 2026-07-16.

Every source below was checked against its live URL on the build date. A
source that could not be confirmed carries `(unverified - check)`. No invented
URLs, no invented data fields. Public records are public; the compliance line
(Section 5) governs how we use them.

Cross-file references: "scorecard" / "Part 4" / "Part 5" = `TARGETING.md`.
"Section N" = `OUTREACH-SYSTEM.md`. "The DB" = `source-targets.mjs` →
`targets-db.json`. "Ship-copy" = anything a prospect sees; **no em dashes in
ship-copy blocks**, ever (Section 6). Em dashes in this doc's prose are fine.

---

## Section 1 — The layered intel model

The DB pipeline (`source-targets.mjs`) already produces **L0**: a bulk OSM/
Overpass map of every categorized business in the territory, with a
web-presence classification and a *provisional* score. The provisional score
tops out around 74 because two scorecard factors (reviews, owner) score their
floor until a human fills them. The layers below are the human-and-source work
that lifts a row from provisional to real, in the order that costs the least
effort for the most score movement.

**Read the layers as a funnel, not a checklist.** L0 enumerates everyone. L1
kills the dead/duplicate/chain rows cheaply. Only rows that survive L1 are
worth L2. Only L2 survivors near the SEND band are worth the L3/L4 dig. Never
spend L3 owner-research time on a DISCARD-band row.

### Layer table

| Layer | What it establishes | Primary verified source(s) | Scorecard field(s) it fills | Effort / business | Batchable? |
|---|---|---|---|---|---|
| **L0 OSM base** *(exists)* | Name, niche, town, phone, website-present flag, chain flag | OSM via Overpass (`source-targets.mjs fetch`), free, one call | Seeds gap + demand + proof + route (all provisional) | ~0 (bulk) | Yes — whole territory in one call |
| **L1 Existence / web check** | Is it real, open, and does it truly have no good site? | `probe` HTTP check (in pipeline) + one manual Google/Maps look + GBP "permanently closed" flag | Confirms **gap severity (30)**, clears Stage-1 disqualifiers #2 (closed) & #3 (agency footer) | 1-2 min | Semi — probe is bulk; the eyeball is per-row |
| **L2 Revenue proxy** | Does it have real customers worth a site? | Google Business Profile / Maps listing: review **count** + **star rating** (manual read) | **Reviews / rating (20)** | 1 min | No — manual per row (see Places API note below) |
| **L3 Ownership** | Who owns it, and how do I reach that person? | NC SoS entity search (officers + registered agent); Assumed-name DB (DBA → real person); NC contractor license boards (qualifier name) | **Reachability of owner (15)** — named owner + email = 15 | 2-4 min | Partly — batch by niche (license boards) or by new-filing list |
| **L4 Freshness intel** | Is this a business at the *moment* it needs a site? | SoS "Search New & Dissolved"; county/state env-health new food permits; City/County building permits; Chamber new-members / ribbon cuttings; local news | New-signal flag → promotes a row / creates a fresh-lead row (Section 2) | 15-30 min per weekly sweep | Yes — feed-based, weekly |
| **L5 SERP evidence** | Where do they lose in search? (Route A only) | Existing `ad-gap.mjs` + `ad-xref.mjs` tooling (Section 12) | Sharpens **demand (20)** + is the Route-A opener's payload | Bulk scan + per-row read | Yes (scan) then per-row |

### Layer detail + verified URLs

**L1 — Existence / web verification.**
- The DB `probe` step already classifies `live / dead / social-only / none`.
- Manual confirm per surviving row: one Google search of the exact name +
  town, and open the GBP/Maps card. This is also where you catch
  "permanently closed" (Stage-1 disqualifier #2) and an agency footer on a
  live site (disqualifier #3). No new source needed; this is disciplined
  looking.

**L2 — Revenue proxy (reviews).**
- Source: the business's **Google Business Profile** card on Google Maps —
  read the review count and average rating by eye. This is the compliant
  default (Section 5).
- Automated route honestly assessed: Google **Places API (New)** pricing
  changed **March 1, 2025** — the old $200 pooled credit is gone, replaced by
  **per-SKU monthly free thresholds** (Essentials 10,000 / Pro 5,000 /
  **Enterprise 1,000** free calls per month). A Place Details call that
  requests `rating` bills at the **Enterprise** tier (~$35/1,000); requesting
  `reviews` pushes it to the atmosphere tier (~$40/1,000).
  ([Places usage & billing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing),
  [2026 pricing breakdown](https://www.woosmap.com/blog/google-places-api-pricing))
  - **The math:** ~100 lookups/week = ~430/month, which sits *under* the
    Enterprise 1,000 free calls — so a rating+count pull could be $0 in
    metered cost. **But** the deciding factor is terms, not price: caching/
    storing Places content and using it to build a prospecting list bumps
    against Google's Places API terms, and the whole system's rule (Section 5)
    is no bulk-scraping GBP against terms. **Verdict: manual GBP lookup is the
    compliant default.** An API pull is only clean for *live one-off
    verification at read time* (look, score, don't store the Google payload),
    and even then it is a convenience, not a mass-list engine. Keep it manual
    until volume genuinely hurts, then revisit with the terms open.

**L3 — Ownership (the 15-point reachability lever).** Three verified feeds,
best-yield first per niche:

1. **NC Secretary of State business entity search** — search a company by
   **name, SOSID, registered agent, or company officials**; the record
   exposes entity type, status, **registered agent** (name + address), and
   **company officials** (officers/directors/organizers) plus full filing
   history. Free.
   ([entity search](https://www.sosnc.gov/online_services/search/by_title/_Business_Registration),
   [Business Registration division](https://www.sosnc.gov/divisions/business_registration))
   - For an LLC this typically yields the owner/organizer name and the
     registered agent (often the owner or their attorney/CPA). That name is
     the input to "named owner + email = 15." The SoS record does **not**
     hand you an email; it hands you the name you then match to a contact.
2. **Assumed Business Name (DBA) database** — a Gmail-style trade name ("Joe's
   Diner") maps to the real filer. NC runs a **statewide searchable DB** of
   DBA certificates filed **on/after Dec 1, 2017**, at the SoS.
   ([Assumed Business Names](https://sosnc.gov/divisions/business_registration/assumed_business_names),
   [ABN search](https://www.sosnc.gov/online_services/assumed_name/search/id))
   Official county copy for Cleveland County: **Register of Deeds online
   search** back to 1945 at
   [us5.courthousecomputersystems.com/clevelandnc](https://us5.courthousecomputersystems.com/clevelandnc/)
   (ROD office: 311 E Marion St, Room 151, Shelby; rod.info@clevelandcountync.gov;
   704-484-4834). Pre-2017 DBAs live only in the county index.
3. **NC contractor license boards** (huge for P1/P2 trades reachability) —
   the license record carries the **qualifier's real name**:
   - **NC Licensing Board for General Contractors** — search by license name/
     number/company; shows classification, dollar limit, status.
     ([NCLBGC license search](https://nclbgc.org/license-search/)) GC license
     is required at **$40,000+** project cost.
   - **State Board of Examiners of Plumbing, Heating & Fire Sprinkler
     Contractors** — search by contractor name, business name, or number;
     shows license type, status, and the **qualifying Master Plumber**.
     ([public.nclicensing.org search](https://public.nclicensing.org/Public/Search),
     [Find License Near Me](https://public.nclicensing.org/Public/FindLicense))
   - Electrical: NC State Board of Examiners of Electrical Contractors has a
     public license lookup `(unverified - check ncbeec.org)`.

**L4 — Freshness intel.** Full play in Section 2. Verified feeds:

- **New business registrations** — SoS **"Search New & Dissolved"**:
  [/online_services/search/by_title/search_Business_Registration_Changes](https://www.sosnc.gov/online_services/search/by_title/search_Business_Registration_Changes).
  This is the freshest lead source in the whole system: a brand-new LLC with
  no site yet. **County/date filtering on this specific view is
  `(unverified - check)`** — the general entity search filters by name, and
  the "Nonprofits by County" report proves county filtering exists elsewhere,
  but confirm the New/Dissolved view supports a Cleveland-County or
  registered-agent-address filter before relying on it. Fallback if it does
  not: filter by registered-agent city or scan the county ROD/DBA feed
  instead. A **paid Data Subscriptions** program exists (Business Registration
  + UCC/Notary contracts, various frequencies) but no free daily/weekly bulk
  feed and no published price — contact the division (919-814-5400) only if
  the free New/Dissolved view proves too coarse.
  ([Reports & Listings](https://www.sosnc.gov/divisions/business_registration/reports_and_listings),
  [Data Subscriptions](https://www.sosnc.gov/online_services/data_subscriptions/business_registration_data_subscriptions))
- **New food-service establishments** — Cleveland County environmental-health
  **public inspection portal** (Custom Data Processing), searchable by name,
  establishment type, address, **inspection date range**, and grade:
  [public.cdpehs.com/NCENVPBL — Cleveland (CTY=23)](https://public.cdpehs.com/NCENVPBL/ESTABLISHMENT/ShowESTABLISHMENTTablePage.aspx?ESTTST_CTY=23).
  A new restaurant appears here at its *first* inspection, often before it is
  on Google. State-level lookup mirror:
  [ehids.eh.ncdhhs.gov/eh-lookup](https://ehids.eh.ncdhhs.gov/eh-lookup/).
  (Sort by most recent inspection date to find just-opened establishments.)
- **Building / commercial-upfit permits** — a commercial upfit permit = a
  business opening in 1-6 months.
  - City of Shelby: **GovWell PermitPortal** (live since 2024-09-23; all
    planning/zoning/building applications go through it):
    [cityofshelby.com/PermitPortal](https://www.cityofshelby.com/PermitPortal)
    → app.govwell.com/shelby. **Whether the public can browse issued permits
    without a login is `(unverified - check)`** — the portal shell did not
    render a public search on fetch.
  - Cleveland County (unincorporated): **Building Inspections permit search**
    at [clevelandcounty.com/ccbicmts/bicmts_search.php](https://www.clevelandcounty.com/ccbicmts/bicmts_search.php?page=search).
    Confirmed: permit-number search with match operators. **Address/date/
    permit-type filtering `(unverified - check)`** — the fetched page only
    exposed the permit-number field; the county also "posts issued permits in
    the document center," so a date-browsable list may live there instead.
    (Permits office: 1333 Fallston Rd, Shelby; 980-484-4997.)
  - ⚠️ **Do NOT use "Develop901" / the Accela `SHELBYCO` portal** that shows
    up in searches — that is **Shelby County, Tennessee (Memphis)**, not
    Shelby NC. Easy and costly mix-up.
- **Chamber of Commerce** — **Cleveland County Chamber** searchable member
  directory (browse by 50+ categories and by radius):
  [business.clevelandchamber.org/directory](https://business.clevelandchamber.org/directory);
  main site [clevelandcountychamber.org](https://clevelandcountychamber.org/).
  Live-tested 2026-07-16: the **events calendar**
  ([business.clevelandchamber.org/events](https://business.clevelandchamber.org/events))
  is public and headless-fetchable and lists ribbon cuttings. Only
  new-member announcements and unnamed cuttings are on the Chamber's
  **Facebook page** ([facebook.com/ClevelandCountyChamber](https://www.facebook.com/ClevelandCountyChamber/))
  and the directory's Events view; there is no verified email/RSS new-member
  feed, so this one is a manual weekly look. (200 S Lafayette St, Shelby;
  704-487-8521.)
- **Local news** — *The Shelby Star* business coverage
  (shelbystar.com, business section `(unverified - direct feed URL not
  confirmed)`); *Uptown Shelby* district investment news
  ([uptownshelby.com](https://www.uptownshelby.com/) + its Business Guides);
  Richland Source has covered Shelby revitalization (per TARGETING Part 2).
  Treat news as a *confirming* signal on top of a permit/registration, not a
  standalone feed.

**L5 — SERP evidence (Route A only).** No new source: run the existing
`ad-gap.mjs` + `ad-xref.mjs` tooling (Section 12; refresh cadence Section 3
quarterly). Fills the Route-A opener's payload and refreshes the demand factor.

### Other real sources found (lower priority, catalogued)

| Source | What it gives | Verified URL | Use |
|---|---|---|---|
| NC ABC permits | New bar/restaurant liquor permits = opening signal | abc.nc.gov `(unverified - check permit-lookup path)` | L4 supplement for P4 |
| UCC filings (SoS) | A business took equipment financing = investing/growing | Same SoS Data Subscriptions / [UCC search](https://www.sosnc.gov/online_services/search/by_title/_UCC) | Weak owner signal; skip unless easy |
| County tax / property records | Property owner, business real estate | [us5.courthousecomputersystems.com/clevelandnc](https://us5.courthousecomputersystems.com/clevelandnc/) (ROD) + county GIS `(unverified)` | L3 fallback for owner-of-record |
| Nextdoor business pages | Hyperlocal social-only businesses + demand threads | nextdoor.com (per Section 5, no scraping) | Manual, Section 3 sourcing only |

---

## Section 2 — The new-business surge play (L4)

A brand-new business is the cleanest lead in the system and the trickiest: it
has **no site, no agency relationship, and no SERP history** — but also **no
revenue yet** and no reviews. The scorecard *underrates* it (reviews factor
floors at 2, so a real new-business lead can look like a DISCARD). L4 handles
these on a separate track from the DB's scored bench.

### The weekly L4 sweep (priority order)

Run inside the Monday sourcing block (Section 13). ~20-30 min.
Order revised after the first live pass (sources/l4-feed-pass-2026-07-16.md):
**headless-automatable feeds lead; the bot-blocked SoS feed is an explicit
Jarred-manual browser step and must never stall the sweep.**

| # | Feed | What a "new-business signal" is | Automatable? | Verified source |
|---|---|---|---|---|
| 1 | **Env-health inspections** | A food establishment with its **first** inspection in the last 2-4 weeks. CAVEAT (live-tested): the portal date-sorts but never labels a *first* inspection — confirm per row (Maps age / inspection history) or routine re-inspections of chains read as noise. | YES — fully headless, 874-row table fetched | [CDP Cleveland portal](https://public.cdpehs.com/NCENVPBL/ESTABLISHMENT/ShowESTABLISHMENTTablePage.aspx?ESTTST_CTY=23) |
| 2 | **Chamber events calendar** | A scheduled ribbon cutting (named) | YES — calendar is public + fetchable; only new-member posts and unnamed cuttings need the login-gated FB page (manual) | [Chamber events](https://business.clevelandchamber.org/events) · [Chamber FB (manual)](https://www.facebook.com/ClevelandCountyChamber/) |
| 3 | **Local news / Uptown Shelby sweep** | An "opening soon / now open" mention that confirms another feed's hit | YES — WebSearch | [uptownshelby.com](https://www.uptownshelby.com/) |
| 4 | **County + City permits** | A **commercial** upfit / new-construction / change-of-use permit issued in the last 2 weeks | Untested headless | [County search](https://www.clevelandcounty.com/ccbicmts/bicmts_search.php?page=search) · [Shelby PermitPortal](https://www.cityofshelby.com/PermitPortal) |
| 5 | **SoS New & Dissolved** | An LLC/corp registered in the last 1-2 weeks with a Cleveland-County / adjacent registered-agent address | **NO — Cloudflare Turnstile bot challenge (live-tested twice: fetch 403 AND headless Playwright blocked, form never renders).** Human-browser-only: budget ~5 min of Jarred's browser weekly; confirm county/date filtering on first visit. Also blocks automated L3 officer lookups. Paid Data Subscriptions only if the free manual view proves too coarse. | [Search New & Dissolved](https://www.sosnc.gov/online_services/search/by_title/search_Business_Registration_Changes) |

A signal is **corroborated** when two feeds agree (e.g. a new LLC *and* a
commercial permit at the same address) — corroborated signals jump the queue.

**Web-status gate (added after first live pass):** every fresh-lead row
records web status as a required field before the strike read — the first
pass found 3 of 5 food hits already had sites. Branch: **none / social-only
= strike (build)** · **DIY-thin site = strike (upgrade angle)** · **good
site = drop, or review-ask goodwill only**.

**Kings Mountain concentration note:** the first pass found ALL live signal
in KM (casino corridor). Part 5e saturation caps will bind there fast —
work the best 1-2 KM leads per cycle, never all of them.

### Wait-vs-strike rule (per profile type)

The tension: strike too early and there is no business to build for yet; wait
too long and a competitor or a DIY Wix has already happened. Rule of thumb by
profile — a new business gets a **fresh-lead** record, not a scored bench row,
and its next-touch date is set to the strike window:

| Profile group | Signal | Rule | Why |
|---|---|---|---|
| **P4 food, P10 retail, P5 salon, P9 fitness** (storefront, opening-date driven) | Env-health permit / commercial upfit / "opening soon" | **Strike at signal.** These need a site *for the opening* — menu, hours, booking. Reach out the week you see the permit. | The site is part of launch; being early is the whole advantage. |
| **P1 trades, P2 roofing, P6 landscaping** (owner-operator, revenue-first) | New LLC + license-board qualifier | **Wait ~30-60 days**, then strike. Let them take a few jobs first so a site is a "next step," not an expense before dollar one. | No revenue day-one; a site pitch lands better once the phone has rung. |
| **P7 dental/medical, P8 professional** (practice launch) | New LLC / new practice permit | **Strike at signal** but formal-track. A new practice plans its web with its buildout; get in during planning. | Long sales cycle; being early beats being right later. |
| **P11 event/photo, P3 auto** | New LLC / DBA | **Wait ~30 days.** Confirm it is a real going concern (not a hobby LLC) before spending a touch. | High hobby-LLC noise; verify intent first. |

Corroboration overrides: a new LLC *plus* a signed commercial lease/permit is
a real going concern — treat as strike-eligible regardless of the wait default.

### The new-business opener (different from the gap read)

A new business has no SERP history, so there is nothing to "read." The angle
is **starting right**, peer-to-peer: you noticed they are getting going, and
you help local owners get the web part right from the start. Same voice as
Section 6 — capable neighbor, not an agency.

> Ship-copy opener variant — brand-new business (no em dashes, no exclamation points):

```
Saw that [Business] is getting up and running here in [Town], congratulations
on the new spot. I build websites for local businesses around Shelby, and the
early days are the easiest time to get that part set up right, so if you want a
simple starting site or just a second opinion on what you actually need yet, I
am happy to help.
```

Notes on the variant: two sentences, names the town, offers a low-commitment
"second opinion" so it is give-before-ask (Section 6/Ideology 6), and the
"what you actually need yet" line respects that a brand-new business may not
need a full build — honest, not upsell-y. Log it to CRM with channel and a
next-touch date per the strike window.

---

## Section 3 — Iterative cycles, unified

One cadence table merging contact-system upkeep, the verify-queue batch, the
L4 sweep, and the re-rank / re-verify rhythms. "Claude" = drafting, scanning,
scoring, list-building. "Jarred" = every send, every judgment call, final
approval (Section 15: Claude drafts, Jarred sends).

| Cycle | Trigger | Inputs | Outputs | Who |
|---|---|---|---|---|
| **Daily** (Mon-Fri, ~20 min) | Calendar / CRM next-touch dates | CRM due-today list, live DM/inbox threads | Follow-ups due sent, DM conversations advanced, any "stop" honored same-day + logged | Jarred sends; Claude drafts due follow-ups on request |
| **Weekly — verify batch** (Mon, sourcing block) | Monday block | DB top provisional rows (`verify-queue` output) | L1/L2/L3 fields filled → `apply-verify` merges + rescores → survivors ≥70 promote to CRM BENCH with route + next action | Claude runs queue/scan + fills what public sources allow; Jarred confirms owner contacts |
| **Weekly — L4 sweep** (Mon) | Monday block | The 5 L4 feeds (Section 2) | New fresh-lead records with strike-window next-touch dates | Claude scans feeds; Jarred approves which to work |
| **Weekly — Friday review** (Fri, 1h) | Friday block (Section 13/14) | Week's touch log, reply/asset-yes per profile-town cell | Part 5(a) modifiers applied; Part 5(b) three-question review; next week's send list from top eligible rows; metrics logged (Section 14) | Claude computes cells + drafts summary; Jarred reads/decides |
| **Monthly** (1st review Fri) | Month boundary | All bench/send scores, realized reply rates, template results | Part 5(c) profile-town re-rank with 20% decay; kill/scale the worst/best **channel** (Section 14); template A/B verdicts; changelog paragraph in TARGETING.md | Claude recomputes + drafts; Jarred approves kills/scales |
| **Quarterly** | Quarter boundary / any asset >45 days | Full territory | `ad-gap.mjs` + `ad-xref.mjs` re-scan (Section 7); OSM `fetch` re-pull + full DB `build/probe/score`; **this doc's source list re-verified** (URLs still live, portals unchanged); niche-matrix re-score | Claude runs pipeline + re-verifies URLs; Jarred spot-checks |

**Ordering rules that never bend:** follow-ups before new sends, every day
(Section 13). Verify-batch before the Friday send-list is set (a row must be
real-scored before it can be sent). L4 fresh-leads route through the same CRM
and the same saturation caps (Part 5e) as scored rows — a new-business surge
does not get to blanket a small town.

---

## Section 4 — Contact-system monitoring + testing

The machine stays honest only if it is checked. These run on the cadence above.

### Weekly deliverability check (Friday, ~10 min)
- Send one real opener-format test to a **Gmail** address you control; confirm
  it lands in **Primary**, not Promotions or Spam.
- Verify **SPF, DKIM, DMARC** still pass (check the received message's headers,
  or a mail-tester tool). INFRA-CHECKLIST step 1 set these; DNS drift or a
  provider change can silently break them.
- Watch the volume caps (Section 9): ≤10 openers/day, ≤25/week, from the real
  `studioobrien.com` mailbox only. A spike is a spam-flag risk.

### Template render spot-check (after any template edit)
- Send the edited HTML asset template to yourself in **Gmail + one other
  client** (Outlook/Apple Mail); confirm the Workshop Mint bar, Inter, and
  stat-ledger tables render and that it is not clipped/"[Message clipped]".
- Confirm plain-text openers stay plain text (no accidental HTML/signature
  bloat — Section 9 doctrine).

### CRM integrity audit (weekly, part of Friday sweep)
- **No-empty-next-touch rule:** every active target has a future next-touch
  date OR a terminal status (WON / CLOSED-NO / DORMANT / COLD-STORAGE). A row
  with neither is an orphan — fix on sight.
- **Orphaned-stage check:** no target stuck mid-sequence past its due date
  with no logged action; no asset-yes with no scheduled call; no "reply" with
  no captured objection line (Part 5b feeds on these).
- **Cap compliance:** no niche over 2 openers/week, no small town over its
  monthly cap (Part 5e).

### Metrics instrumentation checklist (which number comes from where)
| Metric | Source of truth |
|---|---|
| Openers sent, follow-ups, replies, asset-yes, calls, proposals, wins | **CRM.md touch log** (the only source; nothing lives in memory — Ideology 4) |
| Inbound inquiries / lead conversions | **GA4** `generate_lead`, via UTM'd links in assets/signature |
| Which asset/link got opened | GA4 UTM campaign tags on every sent link |
| Social reach / DM sends | **Platform insights** (FB/IG/LinkedIn) + CRM channel-tagged rows |
| Reviews gained | GBP dashboard + CRM review-ask log |
| Deliverability | Weekly Gmail placement test + header auth check |

### Escalation rule
**If opener reply rate < 10% over 3 consecutive weeks: stop new sends, diagnose
before spending more volume** (Section 14: below 10% = rewrite the opener, do
not raise volume). Diagnostic checklist, in order:
1. **Deliverability** — are openers even arriving? (Run the Gmail placement
   test; check SPF/DKIM/DMARC; check the mailbox isn't flagged.)
2. **Targeting** — are these real, open, in-territory, non-chain, gap-having
   businesses? (Sample 10 sent rows against Stage-1 disqualifiers.)
3. **Evidence freshness** — were the reads built on stale SERP data (Section
   7)? A wrong position destroys trust and kills replies.
4. **Copy** — does the opener pass the barstool test (Section 6)? Is it two
   sentences, specific, no jargon, no em dashes?
5. **Channel fit** — is email the right channel for this profile, or should it
   be FB/IG DM (P3/P4/P5/P6 live on social)?
6. **Saturation** — did a small town get over-touched and go cold on the
   studio (Part 5e)?
Fix the highest item that fails, then resume at reduced volume (Ramp, Section
13). Do not resume at full speed on a hunch.

---

## Section 5 — Compliance boundaries

Public records are public. The entire intel layer rests on one test: **would
this embarrass us if it came up in a small town?** Shelby is 20,000 people;
one "this guy is creepy about it" comment costs more than a hundred sends earn
(Ideology 2). So:

**What we do — plainly, and would say out loud:**
- Look up who owns a business (SoS officers/registered agent, assumed-name
  filer, contractor-license qualifier) **before writing to that person by
  name**, so outreach is one-to-one and personal, not "Dear business owner."
- Track **new registrations and new permits** from public government feeds to
  reach a new business at the moment it actually needs a site.
- Read a business's **own public GBP** to see its review count and rating.
- Use SERP evidence about **public search results** as the Route-A payload.

**What we never do:**
- **No bulk-scraping GBP/Maps against Google's terms.** Manual reads only;
  the Places API is at most live one-off read-time verification, never a
  stored mass-list engine (Section 1, L2).
- **No purchased email lists, no scraper-to-blast, no cold-email SaaS sending
  on our behalf** (Section 15, absolute).
- **No automated mass mail.** Every send is one human look, from a real
  person, this week's approved batch (Section 15). Public records tell us
  *who* and *when*; they never authorize *blast*.
- **CAN-SPAM honored** even though one-to-one B2B is low-risk: real from-name,
  real reply-to, no deceptive subject, physical city in asset-class mail
  (Section 9).
- **"Stop" is permanent and instant.** One reply ("Done - file closed. Good
  luck out there."), status CLOSED-NO, never contacted again on any channel
  (Section 8).
- **No fabricated facts** anywhere, including intel: an owner name we could not
  confirm is `(unknown - let's talk)`, never a guess (Section 6).

The line is simple: public records let us be **more personal and more
respectful** (right name, right timing), never more aggressive. Every use of
this layer has to survive being described, out loud, to the owner at a bar.

---

## Changelog

- 2026-07-16 — File created. Five-layer intel model (L0 OSM → L5 SERP) mapped
  to the Part 4 scorecard with verified public-record sources; new-business
  surge play with per-profile wait-vs-strike + ship-ready opener variant;
  unified daily/weekly/monthly/quarterly cadence; contact-system health checks
  + <10%-reply escalation checklist; compliance boundaries. Verified live:
  NC SoS entity + New/Dissolved + assumed-name search, Cleveland County ROD,
  CDP env-health portal (CTY=23), NCLBGC + nclicensing license lookups,
  Cleveland County Chamber directory, City of Shelby + County permit portals,
  Places API 2026 per-SKU pricing. Marked `(unverified - check)`: New/Dissolved
  county filter, GovWell public browse, county permit filters beyond permit#,
  Shelby Star direct feed, NCBEEC electrical lookup, ABC permit path.
```
