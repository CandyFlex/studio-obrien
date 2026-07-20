# Outreach CRM — the single source of truth for every target and touch

Rules of the file: every touch gets logged the moment it happens, and
**no row is ever allowed to have an empty Next-touch date unless its
stage is WON, CLOSED-NO, or DORMANT.** The Friday sweep (OUTREACH-SYSTEM.md
section 13) exists to enforce that. Sequence timings and re-approach
rules live in OUTREACH-SYSTEM.md section 8; this file is where they
become dates.

Claude maintains this file; Jarred sends the messages. When a batch of
targets outgrows markdown (~75 active rows), migrate to
`crm-data.json` + a render script - not before.

---

## Stages

| Stage | Meaning | Exit |
|---|---|---|
| BENCH | Sourced + qualified, not yet contacted | → OPENED when opener sends |
| OPENED | Opener sent, awaiting reply | → ASSET-YES / NUDGED / CLOSED-NO |
| NUDGED | Day-7 nudge sent | → ASSET-YES / SWITCHED / CLOSED-NO |
| SWITCHED | Day-21 channel switch sent | → ASSET-YES / RE-APPROACH / CLOSED-NO |
| ASSET-YES | They said yes; asset ships same day | → ASSET-SENT |
| ASSET-SENT | Gap Read / offer delivered | → CALL (offer at +7) |
| CALL | Call scheduled or done | → PROPOSAL / NURTURE |
| PROPOSAL | Scoped work proposed | → WON / CLOSED-NO |
| NURTURE | Warm but not now; gets designed-email touches | periodic, real triggers only |
| RE-APPROACH | Waiting on day-60/120 touch (new evidence required) | → OPENED (new cycle) / DORMANT |
| DORMANT | Sequence exhausted; resurfaces only on a real trigger | → BENCH on trigger |
| CLOSED-NO | Said no or stop. **Permanent. Never re-contact.** | none |
| WON | Client. Moves to project pipeline + review engine. | none |

## Active pipeline

Legend: Route per OUTREACH-SYSTEM.md §3 (A = Gap Read, A2 = Route A
secondary, B2 = Storefront). Ch = planned first channel (EM email,
FB Messenger, IG, LI LinkedIn). Dates YYYY-MM-DD.

| # | Business | Niche | Town | Route | Ch | Contact point | Stage | Last touch | Next touch | Next action | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Miller & Condrey HVAC | HVAC | Shelby | A | EM | millercondreyhvac.com contact | BENCH | - | - | verify pos + send opener | "always behind someone" gap; avg pos 5.25 across 4 queries |
| 2 | Shelby Heating | HVAC | Shelby | A | EM | shelbyheating.com contact | BENCH | - | - | verify pos + send opener | wins "ac repair", loses "hvac shelby nc"; verify NOT same biz as #8 first |
| 3 | CSI Mechanical | HVAC | Shelby | A | EM | csimechanical.com contact | BENCH | - | - | verify pos + send opener | specialists at top-5, inches-away gap |
| 4 | Ballew's Heating and Air | HVAC | Shelby | A2 | EM | ballewsheatingandairllc.com | BENCH | - | - | hold for A2 warm-in | pos 8, one query only; opener soft, no gap read first |
| 5 | Bill Shuford HVAC | HVAC | Shelby | A2 | EM | billshufordhvac.com | BENCH | - | - | hold for A2 warm-in | pos 10, fragile |
| 6 | Childers Heating and Air | HVAC | Shelby | A2 | EM | childersheatingandairconditioning.com | BENCH | - | - | hold for A2 warm-in | "ac repair" only |
| 7 | Piedmont HVAC | HVAC | Shelby | A2 | EM | piedmonthvacpc.com | BENCH | - | - | hold for A2 warm-in | "hvac shelby" only |
| 8 | "Shelby Heating and Air" (FB page) | HVAC | Shelby | B2 | FB | facebook.com/p/Shelby-Heating-and-Air-100076236660230 | BENCH | - | - | VERIFY identity vs #2, then Storefront DM | ranks top-5 with no site; do not contact until identity confirmed |

Referral-partner bench (never first-pitched, per §11): Settle Heating
and Air (settlehvac.com, owns its SERP), GSM (gsmsince1927.com, verify
if actually local).

## Touch log

Append-only. Every send, reply, call - one line each.

| Date | # | Channel | Touch | Outcome / note |
|---|---|---|---|---|
| - | - | - | - | - |

## Weekly metrics (Friday sweep)

| Week of | Openers | Replies | Asset yes | Assets sent | Calls | Proposals | Wins | Posts | DMs | Reviews gained | Inbound leads | Note |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| - | - | - | - | - | - | - | - | - | - | - | - | - |

## Friday sweep checklist

1. Every active row has a Next-touch date (or a terminal stage). Fix any that don't.
2. Everything due next week is listed in Monday's send plan.
3. Fill the metrics row from the touch log + GA4 + platform insights.
4. Move exhausted sequences to RE-APPROACH/DORMANT with the date they resurface.
5. Bench count ≥ 30? If not, Monday sourcing block goes long.
