# Session Handoff Notes

**Session Date:** 2026-07-01 → 2026-07-02
**Duration:** long single session (v2 launch → live → growth pipeline)
**Model(s) Used:** Claude Fable 5
**Tokens Used:** [see rtk gain]

---

## What Changed

**Modified Files:**
- index.html — IS NOW THE V2 HOMEPAGE (promoted from index-v2.html), plus: seam
  fades (desktop 3-layer + mobile pass-behind -220px), 1000–1199px masonry fix,
  GA4 conversion events, og-image ?v=2 metas, process img ?v=2 cache-busts
- index-v2.html — kept as synced reference copy (every index.html edit mirrored)
- contact.html — ?q= prefill, storefront ref subject, generate_lead event
- website-cost-calculator.html — calculator_engage event, og metas
- vercel.json — CSP fixed (GA was blocked site-wide!), sitemap.xml — lastmod bumped
- portfolio/darkthoughts-reel.webp (686→394KB), portfolio/og-image.png (1200×630)

**New Files:**
- ROADMAP.md (4-phase growth plan), production/PIPELINE.md (4-track build queue),
  production/BUSINESS-INTAKE.md (research→build loop), .vercelignore,
  preview/cases-v2-parked.html (parked testimonials slot + reel backup)

**Deleted/Archived:**
- Dead CSS/JS stripped from homepage (~450 lines); lightbox moved to body-end

---

## Verification Status

**Tested:**
- [x] Everything Playwright-verified: seams at 375/486/768/1000/1100/1440/1920,
      lightbox, GA4 events in dataLayer (incl. refresh guard), console clean
- [x] LIVE site audited: parity byte-identical, 41 assets OK, sitemap 65 URLs
      zero dead, CSP allows GA (collect fires), www redirect, test pages 404

**Unverified:**
- GA4 events appearing in GA UI (needs ~24h); Search Console indexing pickup

**Blocked/Incomplete:**
- User must: mark GA4 key events (generate_lead, phone_call_click,
  storefront_nomination_click) in Admin after ~24h; GBP optimization; review asks
- Track A business names not yet provided by user

---

## Next Safe Action

**Immediate next step:**
Build portfolio archetype #1: TRADES/CONTRACTOR (roofing or HVAC) per
production/PIPELINE.md Track B. Standalone polished page (hero + 2–3 sections,
dark+mint NOT required — archetype has own palette), export card webp (800×415
or 800×1100) + full webp for lightbox, wire into portfolio grid + lightbox
data-project, verify 375/768/1440. User approved: "build whatever you think is
gonna best develop into this."

**If blocked:**
Draft blog posts #1 + #3 outlines (PIPELINE.md Track C), then one batched
DeepSeek call to draft both.

**Do NOT:**
- Touch `master` branch (stale June experiments, GitHub default — leave it)
- Deploy via git push alone — site ships ONLY via `vercel deploy --prod --yes`
- Change image/CSS content without bumping ?v= (1-year immutable cache)
- Re-read whole index.html (115KB) — use Grep+Edit; edit BOTH index.html and
  index-v2.html identically (kept in sync)
- Open a browser for the user — they refresh themselves; verify via Playwright

---

## Context Preservation

**Critical context to remember:**
- Deploy recipe: commit → git push origin main → vercel deploy --prod --yes →
  curl live title to confirm (memory: obrien_deployment)
- GA data starts 2026-07-02 (CSP blocked it before — permanent gap prior)
- No fabricated testimonials/proof; no em dashes in copy; Storefront = signature
- Seam system is 3 coupled fades + -500px/-220px overlap constants (memory:
  obrien_v2_conversion_build has exact details)

**Files in active work:**
- production/PIPELINE.md (the queue), ROADMAP.md (the plan)

**Dependencies/warnings:**
- vercel.json CSP is strict — new third-party scripts need CSP entries FIRST
- Playwright available (python) + local http.server pattern for verification

---

## Session Quality

**Efficiency (rtk gain):** n/a
**Compactions needed:** 0 (fresh start requested instead)
**Notes for future self:** The live-site "mysteries" this session were all
caching or branch topology: Last-Modified on Vercel = Date−Age (not deploy
time), immutable cache needs ?v= busts, git push ≠ deploy. Check memory files
obrien_deployment + obrien_v2_conversion_build before touching anything.
