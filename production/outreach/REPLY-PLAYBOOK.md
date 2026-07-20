# Reply Playbook — what happens after someone answers

The missing half of the contact system. OUTREACH-SYSTEM.md gets a message
out; this file governs every moment after a reply lands. Doctrine applies
throughout: section 6 voice (capable neighbor, no em dashes in anything
sent, no exclamation points), section 8 timing, section 4 call protocol.
Jarred handles every reply personally; Claude drafts responses on request
and logs everything to CRM.md same-day.

---

## 1. Reply triage — seven reply types, one protocol each

| Type | What it sounds like | Protocol | Clock |
|---|---|---|---|
| YES | "sure, send it" | Asset ships same day (designed email per templates README). Stage -> ASSET-SENT. Call offer at +7. | same day |
| QUESTION | "what is this exactly?" / "how much do you charge?" | Answer the actual question plainly, then re-offer the asset. Never dodge a price question (see section 2). | within 1 day |
| SKEPTICAL | "is this a sales thing?" / "who are you?" | Validate the suspicion, restate the no-strings shape, point at studioobrien.com so they can check you out. One reply, then leave it with them. | within 1 day |
| NOT NOW | "busy season, try me in fall" | Thank them, log the date THEY named as the next touch. That date is a promise; hitting it exactly builds more trust than the original message. Stage -> RE-APPROACH. | log same day |
| NO | "not interested" | One line, warm, closed: acknowledge and wish them well. Stage -> CLOSED-NO, permanent. | same day |
| STOP | "stop" / anything hostile | "Done - file closed. Good luck out there." Nothing else, ever. Stage -> CLOSED-NO. | same day |
| REFERRAL | "we're set, but my cousin needs one" | Thank them genuinely, ask permission to say who sent you, open a new CRM row sourced "referral" (these skip the bench and go straight to OPENED priority). | same day |

Ship-ready response lines (adapt lightly, never lengthen):

- QUESTION (price): "Fair question. Most sites I build for local businesses
  land in the $X-$Y range depending on what you actually need, and the
  calculator on my site lets you rough it out yourself in about a minute.
  Happy to send that read over first though, it's free either way."
- SKEPTICAL: "Totally fair to ask. I run a web studio here in Shelby and
  the read is just a one-pager on how folks find you when they search.
  No pitch inside it. My site is studioobrien.com if you want to look me
  up first."
- NOT NOW: "That makes sense, [season] is no time to think about this
  stuff. I'll check back in [month they named] like you said. Good luck
  with the busy stretch."
- NO: "No problem at all, thanks for letting me know. Door's open if that
  ever changes."

Price anchors in the QUESTION line come from the live calculator (the
site's cost calculator is the single source of pricing truth; quote its
current ranges, never improvise numbers).

## 2. Pricing honesty rule

Never deflect a price question until a call. Deflection reads as agency
behavior and burns the peer-to-peer position. Give the honest range,
note what moves it, and let them self-qualify. Losing a price-shopper
early costs nothing; dodging costs trust with everyone else they talk to.

## 3. The first call — the call sheet

Booking: offer two concrete windows, not a calendar link ("Would Tuesday
after 5 or Wednesday morning work?"). Phone by default; owners answer
phones, not Zoom invites.

**Open with their three answers** (section 4 protocol - the call exists
because they answered; their answers are the agenda):

1. Reflect answer #1 back ("You said slow weeks look like X...") and let
   them talk. Target: they talk 70% of this call.
2. Walk answer #2 without judgment. What they already tried is the map of
   what they'll distrust. Never rubbish a past vendor or their own DIY.
3. Their answer #3 is the gate. If what they said "would need to be true"
   is now true, say so and ask if they want to hear what working together
   looks like. If it is not true, say that too, and end the call early
   with the door open. Ending early on honesty converts later; stretching
   the call converts never.

**Never on the first call:** a proposal, a discount, urgency, competitor
criticism, or the word "package."

**Close options (pick one, say it plainly):**
- Fit + they're ready: "I'll write up exactly what I'd do and what it
  costs, one page, no surprises in it. You'll have it by [day]."
- Fit but not ready: log their trigger + date, stage NURTURE.
- Not a fit: say so kindly, suggest the honest alternative (even if that
  is "your Facebook page is doing the job for now"), stage CLOSED-NO with
  a goodwill note. Small-town goodwill compounds.

## 4. Proposal — the one-pager skeleton

Sent as the proposal-recap email (build queued in
email-templates/DESIGN-DIRECTION.md roadmap). Structure, in order:

1. **What you told me** - three lines restating THEIR words from the call.
2. **What I'd build** - concrete scope in plain language (pages, features,
   who writes what, what they own at the end - ownership is a core
   differentiator, state it).
3. **What it costs** - one number or a tight range, what's included, what
   would cost more and why. Honest rounding, calculator-consistent.
4. **How it goes** - timeline in weeks, what you need from them, when they
   see the first look.
5. **What happens if you say no** - one line: nothing, the read and the
   call were free, no follow-up barrage. (This line closes more deals
   than the price does.)

Validity: proposals are good for 30 days, stated plainly, no fake urgency.
Follow-up: one nudge at +7, then the section 8 clock applies.

## 5. Won — the handoff ritual

The moment a client says yes, the outreach system's job is to set up the
NEXT client. Same-day: stage WON in CRM, open the project per
production/BUSINESS-INTAKE.md. Built into every project's completion:

- "Site by Studio O'Brien" in the footer copyright bar (standing rule).
- Review ask at the moment of delight (launch day or first "this looks
  great" message), personal, with the direct GBP review link. One ask.
- Case-study permission: one question at handoff ("mind if I show this
  build and say a line about what changed?"). Feeds ROADMAP Phase 2
  proof engine.
- Referral seed, planted once, 30 days post-launch: "If you know another
  owner around here wrestling with this stuff, I'd be glad to be the name
  you pass along."

## 6. Instrumentation

Every reply type is a reinforcement-loop signal (TARGETING.md Part 5):
log the reply type in the CRM touch log verbatim column, not just the
stage change. Friday sweep counts replies by type per profile-town cell;
SKEPTICAL-heavy cells get a softer opener variant next cycle, QUESTION
(price)-heavy cells get the calculator link moved earlier in the sequence.
Call outcomes log the same way (fit-ready / fit-later / no-fit). The
proposal-to-win rate is the studio's single most expensive metric; if
proposals stall three times running, the section 4 skeleton gets reviewed
before any more calls are booked.
