# Studio O'Brien — Outreach Operating System

Canonical doctrine for all outbound. This file is the "strategy-notes.md"
that `gap-read-template.md` and the gap-target files reference — section
numbers here match those references (4 = first-call protocol, 6 = copy
rules, 7 = evidence freshness, 8 = sequence protocol, 11 = route deferral,
12 = cross-reference framework). Do not renumber sections.

Companions:
- `INFRA-CHECKLIST.md` — what must exist before sending (ordered)
- `SOCIAL-PLAYBOOK.md` — social posting + DM cold-approach + GBP + reviews
- `CRM.md` — the pipeline tracker (every touch, every re-approach date)
- `email-templates/` — designed HTML email library + usage rules

Built 2026-07-16 from Jarred's answers: channels = cold email + social +
GBP/reviews; time = 10+ hrs/week; scope = any local business without a
good site, prioritized by SERP gap; infra = GBP verified, rest audited.

---

## 1. Ideology — what we believe about outreach

1. **The data is the asset, not the pitch.** We never open with "you need
   a website." We open with something true and verifiable about how their
   customers find them right now. The prospect can check it on their
   phone in 30 seconds. Trust comes from being right, not persuasive.
2. **Personal scale beats blast scale.** Every message is one-to-one,
   from Jarred, about their specific business. Zero mail-merge blasts,
   zero purchased lists, zero automation that sends without a human
   look. This is a deliverability strategy AND a brand strategy — in a
   town of 20,000, one "this guy spams" comment in a Facebook group
   costs more than 100 sends earn.
3. **Consistency beats intensity.** The system is sized so every week
   actually happens: same blocks, same counts, same days. A missed week
   is rescheduled, never doubled.
4. **Every touch is logged, every no has a date.** Nothing lives in
   memory. `CRM.md` records what was sent, what happened, and when the
   next touch fires. "No response" is a scheduled re-approach, not an
   ending. "Stop" is permanent and honored instantly.
5. **Proof stays honest.** No fabricated clients, testimonials, or
   outcomes anywhere — email, DM, social, GBP. Concept work is labeled
   concept work. This is a ROADMAP.md guardrail and it applies to
   outreach with zero exceptions.
6. **Give before asking.** The Gap Read is a free, useful document. The
   Storefront build is a free site. Social posts teach something real.
   The ask (a call, a reply) always follows something already given.

## 2. The market read (Shelby area, as of 2026-07-09 data)

- Pass 1 (`ad-gap-snapshots/pass1-shelby-2026-07-09.md`): NO niche passed
  the ad-saturation gate. This is a low-ad small market. The "stop paying
  for ads" framing is closed; the "your online market is empty" framing
  is open.
- Cross-reference (`ad-gap-snapshots/xref-2026-07-09.md`): HVAC and
  roofing sit in the top-right quadrant (high demand, thin specialists) —
  Route A gap reads apply. Auto-repair is top-left (archetype route).
- 7 ranked HVAC targets ready in `hvac-gap-targets-2026-07-09.md`, plus
  1 Storefront candidate (Facebook-only business ranking top-5).
- Broad-sweep mandate (Jarred, 2026-07-16): the funnel is ANY local
  business without a good site, prioritized by gap evidence — not
  trades-only. Sourcing process in section 5.

## 3. The plays

**Route A — the Gap Read.** For businesses already visible in the SERP
but losing (never #1, wrong query, page-1 fragile). Deliverable: a
one-page personalized read of their search reality
(`gap-read-template.md`). The read is free; the call is optional; the
pitch happens only on the call, only if their three answers invite it.

**Route B1 — the Archetype.** For niches with strong incumbents (e.g.
auto-repair): build the portfolio archetype first (PIPELINE.md Track B),
then approach with "here is what better looks like in your industry" —
a shown thing, not a claimed thing.

**Route B2 — the Storefront.** For businesses with NO real site
(Facebook-only, Google-Maps-only, dead domain): offer the free Storefront
build. Easiest yes in the system; feeds the proof engine (ROADMAP Phase 2)
which feeds everything else.

**Route C — Warm inbound.** Social posting, GBP, blog, calculator. Not a
"play" run at a target; the ambient layer that makes Routes A/B land
warmer ("I've seen this guy's posts") and generates inbound on its own.

Every CRM target gets exactly one route assigned at qualification. Routes
can change after contact (section 11), never mid-sequence.

## 4. First-contact + first-call protocol

The opener is a **two-sentence plain-text email or DM** (never the full
asset, never an attachment first):

> Found something in how [Business] shows up when people around Shelby
> search for [their service] that I think you'd want to see. Want me to
> send it over? It's one page, it's free, and I'm not attaching anything
> until you say yes.

The asset (Gap Read) ships only after a yes. The call happens only if
they want one. **The call opens with their three answers, not a pitch.**
The three questions — identical for every Gap Read in every niche,
verbatim, because they are the trust gate:

1. When business is slow for a week, what's the first thing you check
   for? What does "we need more leads" look like at your shop?
2. What have you already tried to fix the online side? Website redo,
   Google ads, Angi/Thumbtack, Facebook posts, something else?
3. What would need to be true for you to want this conversation to
   continue? Sentence it however feels right.

Changing the questions changes the play. Don't.

## 5. Target sourcing — the broad-sweep funnel

Goal: a standing bench of 50+ qualified targets so outreach never stalls
on "who do I contact." Weekly sourcing block (section 13) feeds it.

**Sources, in priority order:**
1. **SERP scans** — `node production/ad-gap.mjs` + `ad-xref.mjs` for new
   niches/keywords; businesses visible-but-losing = Route A candidates.
2. **Facebook-only businesses** — search "[niche] Shelby NC" on Google
   and Facebook; any business whose only web presence is a Facebook page
   = Route B2 candidate. These are the highest-yield broad-sweep finds.
3. **Google Maps sweep** — browse a category on Maps; businesses with no
   website link, or a link to a dead/awful site = B2/A candidates. Note
   review count while there (high reviews + no site = priority).
4. **Drive-by list** — real storefronts Jarred passes (PIPELINE Track D:
   raw notes in, structure is the studio's job).
5. **Local news + FB groups** — new business announcements, "anyone know
   a good [trade]" threads (the answers with no site are targets; the
   thread itself is demand evidence).
6. **Chamber directory / Nextdoor businesses** — listed businesses
   without sites.

**Qualification bar (all must be true to enter the CRM):**
- Real, open, local (Cleveland County + adjacent).
- Site absent, broken, or demonstrably losing in the SERP.
- A findable owner/decision-maker contact (email, FB page, IG, or phone).
- Not a direct competitor of an existing client/target in the same
  block (don't run two HVAC gap reads in the same week — space them).

**Priority score (1–3 each, sum):** searched-for niche · proof-slot fit
(matches a portfolio piece or archetype) · reachability · visible
revenue (reviews, trucks, storefront). Work the bench top-down.

## 6. Copy rules (all channels)

**The voice (Jarred, 2026-07-16):** professional but down to earth.
Friendly, approachable, understanding - never stiff-corporate, never
jokey. The through-line is community uplift: a longtime entrepreneur
who has started and tried plenty of businesses himself, talking to
other owners as a peer who has been in their seat, helping small
businesses in his own community prove simple things work. Warmth comes
from understanding their situation, not from exclamation points.
Calibration test: it should read like a capable neighbor who happens
to do this for a living, not like an agency and not like a comedian.
When a line could go "polished" or "human," pick human.

- **No em dashes** in anything that ships to a prospect. Hyphens only.
- **No fabricated stats, clients, testimonials, or outcomes.** A field
  you can't verify gets "(unknown - let's talk)", never a guess.
- **No competitor smears.** Naming who occupies a SERP slot above them
  is data. "X is your downfall" is a smear. Name positions, name the
  gap, let them draw the conclusion.
- **Specificity is voice** (DESIGN.md): real towns, real queries, real
  positions. "Your customers" not "users." "When someone's AC dies" not
  "in today's digital landscape."
- **Plain language.** Grade-7 readable. No "leverage," "optimize,"
  "digital presence," "solutions."
- **Every message must pass the barstool test:** could Jarred say this
  sentence out loud to the owner at a bar without sounding like a
  brochure? Rewrite until yes.
- **Length discipline:** opener = 2 sentences. DM = 3 sentences max.
  Follow-up = shorter than the message before it.

## 7. Evidence freshness (the stale-evidence rule)

SERP evidence expires. A Gap Read built on stale positions destroys the
exact trust it exists to build.

- SERP scrapes are refreshed **quarterly** (re-run `ad-gap.mjs` /
  `ad-xref.mjs`); target files carry their scrape date in the filename.
- Before ANY send, hand-verify the target's current position for at
  least the lead query (one incognito search). If it moved, update the
  read or pull the send.
- An asset older than 45 days is not sent without re-verification.
- Manual observations ("site loads slow", "copyright 2019") are checked
  the same day the asset ships.

## 8. Sequence + re-approach protocol

The full contact sequence per target. Every step and date goes in CRM.md
the moment it happens; the next-touch date is set at the same time.

| Step | Day | Action |
|---|---|---|
| 1 | 0 | Two-sentence opener (email or DM per target's best channel) |
| 2 | +7 | If no reply: one-line nudge ("Still happy to send it - one page, no attachment until you say yes.") |
| 3 | +21 | If no reply: channel switch (opener went email → try FB/IG DM, or vice versa). New angle, same offer. |
| 4 | +60 | Re-approach: NEW evidence only (fresh SERP move, their new review, a season hook). Never resend the old message. |
| 5 | +120 | Final touch, then status = DORMANT. Dormant targets resurface only on a real trigger (they post "need a website guy", niche re-scan shows movement). |

- **Yes at any step** → send asset same day → follow-up call offer 7
  days after the asset → call opens with their three answers (section 4).
- **"Stop" / any negative** → status = CLOSED-NO, permanent, same day.
  Reply once: "Done - file closed. Good luck out there." Nothing else, ever.
- **Max 2 unanswered touches per channel** per target. The +60 and +120
  touches must carry genuinely new information or they don't send.
- Never two touches to the same target inside 5 days, any channel.

## 9. Email channel doctrine

**Two kinds of email, never confused:**

1. **The opener + follow-ups: plain text, always.** No HTML, no images,
   no signature block beyond name/studio/phone/site. Reasons:
   deliverability (image-heavy mail from a fresh sender = promotions
   tab or spam), and authenticity (a real person writing one email
   doesn't use a template header).
2. **The asset + warm/nurture mail: designed HTML** from
   `email-templates/`. Once a prospect said "yes, send it," the designed
   Gap Read email IS the product demo — it should look like the site:
   near-black, Workshop Mint anchor bar, Inter, stat-ledger tables.
   Also used for: Storefront offers post-conversation, the Field Guide
   digest, proposal/handoff mail.

**Volume caps (deliverability):** max 10 cold openers/day, max 25/week,
from the real `studioobrien.com` mailbox (never a burner domain — the
domain's reputation is the studio's reputation). Warm-up: week 1 = 5/day
ceiling. SPF/DKIM/DMARC verified before the first send
(INFRA-CHECKLIST.md, step 1).

**Compliance (CAN-SPAM, B2B):** real from-name, real reply-to, no
deceptive subject, physical mailing city in the signature of asset-class
mail, and every "stop" honored immediately and logged. One-to-one
personal mail is low-risk but we meet the bar anyway.

## 10. Social + DM channel doctrine

Full detail in `SOCIAL-PLAYBOOK.md`. The doctrine layer:

- **Posting builds the warm field; DMs harvest it.** Never DM cold on a
  platform where the studio has zero visible activity — post first,
  participate first, DM second week onward.
- **Platform roles:** Facebook = where Shelby business owners actually
  are (groups + pages). Instagram = the visual portfolio feed. LinkedIn
  = referral partners and professional-services targets, not trades.
  GBP = the map-pack engine (posts + reviews + Q&A).
- **DMs follow the same sequence protocol as email** (section 8) and log
  to the same CRM with channel noted.
- **The reviews engine is outreach:** every real past client (Upwork
  years included, where they're real relationships) gets a personal
  review ask; every future client gets one at handoff, built into the
  process.

## 11. Play route deferral rules

- **Route A primary** = open with the Gap Read framing (specialist-
  absence). For targets visible in multiple queries but never winning.
- **Route A secondary** = warm into Route A only after first contact,
  if they signal frustration (with ads, directories, or lead flow).
  For targets barely visible (one query, position 6+).
- **Tier-B dominant specialists are never first-pitched** — a business
  winning its SERP has no gap to read. They become referral-partner
  candidates after the play runs elsewhere in their niche.
- **Route B2 outranks Route A when both apply** — "you have no site and
  you're STILL ranking" is a stronger, kinder opener than any gap read.
- Ambiguous identity (e.g. a Facebook page that might be an existing
  client of someone) = verify before any pitch. Never guess.

## 12. Cross-reference framework (niche selection)

Four dimensions per niche, computed by `production/ad-xref.mjs`:
- **DD** Directory Dominance — % of keywords where directories crowd the
  top-5. Higher = displacement opportunity.
- **SA** Specialist Absence — 10 minus mean real-specialist count in
  top-10. Higher = thinner real competition.
- **DR** Demand Richness — mean PAA + related queries per keyword.
  Higher = more active demand.
- **CNAF** Cross-Niche Advertiser Frequency — domains appearing across
  niches. CNAF > 0 targets multiply one pitch's value.

Quadrant reads (SA × DR): top-right = Route A gap. Top-left = Route B1
archetype. Bottom-right = outbound only. Bottom-left = closed. The
matrix is an output, not a verdict — pick the niche whose shape fits
the play you can run this month.

## 13. Weekly operating rhythm (sized to 10–12 hrs)

| Block | When | Time | What |
|---|---|---|---|
| Sourcing + qualification | Mon | 2h | L4 fresh-lead feed check (INTEL-SYSTEM.md section 2, ~25 min: SoS new filings, permits, inspections, chamber), then verify-queue batch -> apply-verify -> promote survivors to CRM bench (source-targets.mjs cycle) |
| Outreach block | Tue/Wed/Thu | 3×1h | 3-5 openers/day + ALL due follow-ups first (follow-ups before new sends, always) |
| Social/content batch | Wed | 2h | Draft + schedule the week's posts (SOCIAL-PLAYBOOK), 1 GBP post, group participation seeds |
| Daily social presence | Mon-Fri | 5×20min | FB group participation, comment replies, DM conversations in flight |
| Review + metrics | Fri | 1h | CRM sweep (set every next-touch date), metrics log (section 14), 1 review ask, plan next week's targets |

Weekly output at full rhythm: ~12-15 openers, ~10 follow-ups, 4-5 social
posts, 1 GBP post, 1 review ask, 10 new bench targets.

**Ramp (don't start at full speed):**
- Week 1: infra checklist only + first 5 openers (HVAC Tier-A, already
  researched) + first 3 social posts. Prove the loop end to end.
- Week 2: half rhythm (7 openers). Week 3+: full rhythm.

## 14. Metrics + review cadence

Logged Fridays in `CRM.md`'s metrics table. The funnel:

openers sent → reply rate → asset-yes rate → assets sent → calls →
proposals → wins. Plus: social posts, DMs sent, reviews gained, inbound
inquiries (GA4 `generate_lead`).

- Healthy early signals: opener reply rate ≥ 15% (it's hyper-local and
  personal; below 10% = rewrite the opener, don't raise volume).
- Asset-yes → call rate is the play's health metric. If people take the
  free read and vanish, the read isn't landing — fix the asset.
- Monthly: kill or fix the worst-performing channel; double the best.
- Quarterly: re-run SERP scans (section 7), re-score the niche matrix.

## 15. Non-negotiables (the do-not list)

- No purchased email lists, scrapers-to-blast, or cold email SaaS
  sending on our behalf. Ever.
- No fake scarcity ("2 slots left this month" when false), no fake
  personalization (a template pretending to be bespoke).
- No pitching in Facebook groups (participation yes, self-promo only
  where group rules explicitly allow, and even then rarely).
- No review gating or incentivized reviews (violates Google policy);
  asks go to real clients only, unconditionally worded.
- No sending anything Jarred hasn't personally approved this week's
  batch of. Claude drafts; Jarred sends. The from-line is a real person.
