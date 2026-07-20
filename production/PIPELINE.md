# Production Pipeline — the actual work queue

Companion to ROADMAP.md. That file says *why*; this file says *what gets built
next*. One item moves to "in progress" at a time per track. Update as things ship.

Reprioritized 2026-07-19 with Jarred: Ridgeline Roofing archetype KILLED
(concept stays in preview/, never wire it in). Portfolio showcase refresh is
DONE. New emphasis: content cadence, case studies, client-readiness docs,
and outreach activation.

---

## Track A — Spec sites for real local businesses (Storefront + pitch)

These fill the two open Storefront slots on the homepage and create pitch
opportunities. **Jarred: list the businesses you already picked** — one line
each here, then fill an intake (production/BUSINESS-INTAKE.md) for the first
one and the build starts.

| # | Business | Town | Class (Storefront/pitch) | Intake | Built | Live in slot |
|---|----------|------|--------------------------|--------|-------|--------------|
| 1 | *(name it)* | | | ☐ | ☐ | ☐ |
| 2 | *(name it)* | | | ☐ | ☐ | ☐ |
| 3 | *(name it)* | | | ☐ | ☐ | ☐ |

Selection criteria for which to build FIRST (score each 1–3, highest total wins):
visible location people recognize · no website at all (not just a bad one) ·
owner reachable through someone you know · photogenic product/space.

## Track B — Blog / web posts (lead-gen content, DeepSeek-drafted)

Now the lead build track. 30+ posts exist covering GBP, reviews, restaurants,
local SEO, speed. Next posts, in order:

| # | Working title | Target reader | Status |
|---|--------------|---------------|--------|
| 1 | What a contractor website needs to win jobs in small-town NC | trades owner | outline next |
| 2 | The Storefront Project: why we build free concept sites for local businesses | community/press | outline next |
| 3 | Your auto shop's phone rings from Google, not Facebook | auto shop owner | queued |
| 4 | Salon booking: stop losing appointments to Instagram DMs | salon owner | queued |
| 5 | Before/after: what changed when [Storefront business] got a real website | everyone | blocked on first Track A build |

Flow (Claude-native, no provider drafting — see production/ARTICLE-ENGINE.md):
strategy check (SEO-STRATEGY.md) → outline w/ question-shaped H2s → Jarred
approves → Claude drafts into the template → `article-eval.mjs` gate
(AEO/GEO/SEO/voice, zero FAILs) → judgment rubric (≥4 avg) → registry before
AND after → index card + clusters + sitemap → deploy → tracked in
SEO-STRATEGY.md PRESENT watchlist.

## Track C — Case studies (the proof engine)

Standard = the Concept C "Storyboard" template (case-studies/crownline-electric-c.html,
arcade shipped). Community spots only. Due now:

| # | Case study | Source project | Status |
|---|-----------|----------------|--------|
| 1 | Slim's Bar & Grill | slims build | next |
| 2 | Ben's Smokehouse | bens-smokehouse/ | queued |

Template rules live in the case-study memory: CSS-window crop math,
laptop-only rule for comp-only projects, honest concept labeling.

## Track D — Client-readiness (docs before clients, not after)

The essentials for handling inbound clientele, in build order:

| # | Deliverable | What it is | Status |
|---|-------------|-----------|--------|
| 1 | **Essential Offerings Sheet** (`production/OFFERINGS.md` → client-facing page/PDF later) | The studio's services, what's included, starting-at pricing posture, timeline expectations. One source of truth Jarred can quote from. | next |
| 2 | **Client Intake Protocol** (`production/CLIENT-INTAKE.md`) | What happens when someone emails/calls: response window, discovery questions, qualification (fit test from POSITIONING.md), quote flow, red flags. | next |
| 3 | **Onboarding & Delivery Protocol** (`production/CLIENT-DELIVERY.md`) | Kickoff → build → review → launch → handoff (ownership transfer checklist: domain, hosting, accounts) → post-launch support terms. | queued |

Voice for all three: capable neighbor, plain language, no agency-speak.
These feed the contact flow and outreach replies; keep them consistent.

## Track E — Outreach activation (runs from production/outreach/)

System already built: `OUTREACH-SYSTEM.md` (doctrine + weekly rhythm),
`CRM.md`, `INFRA-CHECKLIST.md`, `SOCIAL-PLAYBOOK.md`, `email-templates/`.

**Gate: Layer 1 infrastructure — jarred@studioobrien.com mailbox + SPF/DKIM/
DMARC. This is Jarred's move and it blocks all cold email.**

What proceeds WITHOUT the gate (Claude-side, next):
- CRM first-wave target list verified/refreshed (LocalIntel data)
- Templates re-checked against current site (About/editorial links, offerings sheet once it exists)
- Social playbook first-week posts drafted

## Track F — Research handoff (Jarred → Claude)

Anything you gather — voice notes, screenshots of competitor sites, a list of
businesses from driving around, overheard complaints about some Wix site —
gets dropped as files or pasted text with one line of context. Claude
structures it into intake docs (Track A), post outlines (Track B), or
case-study material (Track C). Raw is fine; structure is the studio's job.

---

## Immediate next actions
1. **[C]** Develop post #1 (contractor) through ARTICLE-ENGINE end-to-end
2. **[C]** AEO retrofit sweep: run article-eval.mjs across blog/*.html, rank, fix top movers
3. **[C]** Client Intake Protocol draft (OFFERINGS.md done, awaiting Jarred's two policy confirms)
4. **[C]** Slim's case study on the storyboard template
5. **[J]** GSC Request-Indexing days 2-3 (~12 geo URLs/day) + mailbox/DNS auth + Track A names

*Last updated: 2026-07-19 (Ridgeline killed, showcase refresh done, client-readiness track added)*
