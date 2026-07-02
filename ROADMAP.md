# Studio O'Brien — Growth Roadmap

Working plan for growing studioobrien.com from a launched site into a lead engine.
Check items off as they land. Division of labor: **[J]** = Jarred, **[C]** = Claude
sessions, **[D]** = DeepSeek bulk drafting (batch calls, ~$0.10 baseline each —
volume work only, never precision edits or anything needing visual verification).

**Guardrails (always):** no fabricated testimonials, clients, or outcomes — proof
slots stay empty until real. No em dashes in site copy. Clarity-first, mobile-first
fold. Any image/CSS that changes content but keeps its filename needs a `?v=` bump
(1-year immutable cache). Deploys: commit → `git push` → `vercel deploy --prod --yes`.

---

## Phase 0 — Launch foundation ✅ (July 1–2, 2026)

- [x] V2 conversion homepage live (hero promise → portfolio → showcase → services
      → process → Storefront → about → FAQ → CTA)
- [x] Performance pass: reel −43%, GPU animation, eager LCP cards, font preloads,
      dead code stripped (140→110 KB)
- [x] Seamless section transitions (desktop + mobile pass-behind)
- [x] Google Analytics unblocked (CSP fix — data starts July 2; earlier = permanent gap)
- [x] Search Console verified, sitemap clean (65 URLs, zero dead links)
- [x] og-image 1200×630, contact form `?q=` prefill, Storefront nominations get
      their own email subject
- [x] `.vercelignore` keeps test/dev files out of production

## Phase 1 — Measure + local foundation (July, week 1–2)

The goal: know exactly which pages and buttons produce inquiries, and win the map pack.

- [ ] **[C]** GA4 conversion events site-wide: `generate_lead` (contact form success),
      `phone_call_click`, `email_click`, `cta_click` (with location param),
      `storefront_nomination_click`, `homepage_qualifier_submit`, `calculator_engage`
- [ ] **[J]** In GA4: Admin → Data display → Key events → mark `generate_lead`,
      `phone_call_click`, and `storefront_nomination_click` as key events
      (wait ~24h after events start flowing for them to appear in the list)
- [ ] **[J]** Search Console: URL-inspect + Request indexing for `/`, the calculator,
      and all five city pages
- [ ] **[J]** Google Business Profile: claim/verify, categories (Website Designer,
      Marketing Agency), link to site, services listed, 10+ photos, first post.
      This outranks everything on-site for "web designer near me" searches.
- [ ] **[J]** Ask 3–5 past/current clients for Google reviews (the single biggest
      missing ingredient — powers both map pack and future testimonial section)
- [ ] **[C]** After ~1 week of GSC data: first query report — what's getting
      impressions, what's almost ranking (page 2)

## Phase 2 — Proof engine (July–August)

Nothing converts like real proof. The site has the slots built and waiting.

- [ ] **[J]** Storefront Project cohort #1: pick the first real local business
      (or take the first nomination), build the concept into a real site
- [ ] **[C]** Case study page template (before/after, what was done, outcome) —
      first real case study fills the parked testimonials slot
      (`preview/cases-v2-parked.html` is the restore point)
- [ ] **[J]** Document the Storefront build: screenshots, owner quote, one photo
- [ ] **[J+C]** Local press push off the back of it: Shelby Star, Cleveland County
      Chamber newsletter, local Facebook groups. One community-interest story =
      local backlinks + map-pack signal + word of mouth.
- [ ] **[C]** Restore the testimonials/cases section with the first real quotes

## Phase 3 — Search expansion (August+, driven by GSC data)

Build pages that match how business owners actually search. DeepSeek drafts in
batches; Claude wires in and quality-controls; Jarred approves voice.

- [ ] **[D→C]** Industry landing pages (portfolio is restaurant-heavy — lean in):
      - /restaurant-website-design (Ember & Oak, Slim's, Black Creek as showcases)
      - /contractor-trades-website-design
      - /bakery-storefront-website-design (Butter + Bloom)
- [ ] **[C]** Internal links: services list on homepage → these industry pages
      (currently all five arrows go to /contact)
- [ ] **[D→C]** Blog cadence, 2/month, local-intent topics feeding the calculator:
      "how much does a website cost in NC", "Squarespace vs custom for restaurants",
      "why your Google Business Profile matters more than your website"
- [ ] **[C]** Strengthen (don't multiply) city pages based on GSC query data —
      only add Hickory/Asheville pages if impressions justify them
- [ ] **[J]** NAP citations: consistent name/address/phone on Yelp, BBB, Alignable,
      chamber directory, Nextdoor business

## Phase 4 — Compounding loop (ongoing)

- [ ] Weekly 10-min: GSC queries + key event counts (what moved?)
- [ ] Monthly: watch 5–10 Clarity session recordings; fix the one thing visitors
      visibly struggle with
- [ ] Monthly: one new review ask; one Storefront slot filled or nominated
- [ ] Quarterly: re-run the full site audit (assets, sitemap, CWV, console)
- [ ] Success metrics: inquiries/month (generate_lead), phone clicks, map-pack
      position for "web design shelby nc", indexed industry pages ranking

---

*Last updated: 2026-07-02 — next action: GA4 events (Phase 1, in progress)*
