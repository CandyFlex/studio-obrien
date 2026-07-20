# Outreach Infrastructure Checklist — ordered, nothing sends until its layer is green

Audit date 2026-07-16. State per Jarred: GBP claimed + verified ✅;
everything else partial or unbuilt. Work top to bottom - each layer
gates the ones after it. [J] = Jarred must do it (accounts, identity),
[C] = Claude does it on request.

---

## Layer 0 — Identity (done)

- [x] Site live (studioobrien.com), portfolio populated
- [x] GBP claimed + verified
- [x] Real bio/positioning locked (capable studio built to grow; Top
      Rated Upwork, 4.9★/5yr, $100K+ - real credentials only)

## Layer 1 — Sending email (gates ALL cold email)

- [ ] **[J]** Mailbox on the real domain: `jarred@studioobrien.com`
      (Google Workspace Starter, ~$7/mo, is the boring right answer -
      Gmail deliverability + the app-password route for any send script).
      NOT a free gmail.com for outreach, NOT a new lookalike domain.
- [ ] **[J→C]** DNS auth on studioobrien.com (wherever DNS lives -
      likely Vercel or the registrar): **SPF** record includes the
      provider, **DKIM** enabled in the provider admin, **DMARC** record
      at `_dmarc` (start `p=none; rua=mailto:jarred@studioobrien.com`).
      Claude can generate the exact records once the provider is chosen.
- [ ] **[C]** Verify: send test to a Gmail account, open "Show original",
      confirm SPF=PASS, DKIM=PASS, DMARC=PASS.
- [ ] **[J]** Plain signature (name, Studio O'Brien, Shelby NC,
      studioobrien.com, 704-974-3372). No banner image, no quote.
- [ ] Warm-up discipline: week 1 max 5 cold sends/day; normal life mail
      (real correspondence) from the box helps. Caps in OUTREACH-SYSTEM §9.

## Layer 2 — Social accounts (gates DM outreach; posting starts as soon as each exists)

- [ ] **[J]** Facebook business Page: "Studio O'Brien" - category
      Website Designer, Shelby NC, phone, site link, cover image from a
      portfolio piece, 3 posts before any DM goes out from it.
- [ ] **[J]** Join 5-8 local Facebook groups from his personal profile
      (community/small-biz/buy-sell for Shelby + Cleveland County +
      adjacent towns). Participate one week before anything else
      (SOCIAL-PLAYBOOK doctrine).
- [ ] **[J]** Instagram business account (@studioobrien or nearest
      free), linked to the FB Page, 6-9 grid posts from existing
      portfolio crops BEFORE any IG DM (empty account DMs get blocked).
- [ ] **[J]** LinkedIn: personal profile refreshed (new positioning,
      Shelby location) + minimal company page so the studio link resolves.
- [ ] **[J]** Nextdoor business page (free, Shelby neighborhoods).
- [ ] Optional, later: Alignable, YouTube (reels of build breakdowns).
      SKIP until the core loop runs 4 weeks (see SOCIAL-PLAYBOOK verdicts).

## Layer 3 — GBP deepening (posting can start today)

- [ ] **[J]** 10+ photos (workshop, screens of real work, Shelby),
      services list filled, both categories set (Website Designer +
      Marketing Agency)
- [ ] **[C]** Draft first GBP post + weekly cadence (SOCIAL-PLAYBOOK §6)
- [ ] **[J]** Grab the direct review link (GBP dashboard → "Ask for
      reviews" → g.page short URL) - paste it into CRM.md header when
      obtained; the reviews engine needs it
- [ ] **[C]** Q&A seeding plan (honest owner-asked questions)

## Layer 4 — Tracking

- [x] CRM.md live (this folder)
- [ ] **[C]** UTM convention for every link that ships in outreach/social:
      `?utm_source={channel}&utm_medium={email|dm|post}&utm_campaign={play}`
      e.g. calculator link in a GBP post =
      `utm_source=gbp&utm_medium=post&utm_campaign=calculator`
- [ ] **[C]** GA4: confirm `generate_lead` + `email_click` +
      `phone_call_click` events fire (ROADMAP Phase 1 item - still open)
- [ ] **[J]** Platform insights access noted (FB Page insights, IG
      insights, GBP performance) for the Friday metrics row

## Layer 5 — Assets ready to send

- [ ] **[C]** email-templates/ library built + tested (Opus agent, in
      flight 2026-07-16) - test-send every template to self on Gmail web +
      phone before first prospect use
- [ ] **[C]** First 3 Gap Reads filled from hvac-gap-targets (targets
      #1-3) pending Layer-1 green + hand re-verification (§7)
- [ ] **[C]** DM scripts per platform (SOCIAL-PLAYBOOK, in flight)

## Go/no-go

Cold email may start when Layers 1 + 5 are green. DMs may start when
Layer 2's platform-specific line is green AND a week of posting exists
there. GBP posting + review asks may start immediately.
