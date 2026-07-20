# Research Playbook — what Jarred gathers, so articles aren't model soup

The point: an LLM alone produces the average of the internet. Rankings and
GEO citations go to content carrying things the model CANNOT have: live SERP
evidence, verbatim customer language, fresh practitioner discourse, our own
numbers, and local ground truth. This doc is the shopping list.

## Automation split (updated 2026-07-19: Claude runs most of this)

**Claude handles autonomously (no Jarred needed):**
- **Live SERP + PAA + AI-overview data:** `node production/serp-track.mjs`
  (Apify google-search-scraper, token at `~/.config/studioobrien/`; ONE
  batched run ~$0.50, never loop keywords). Snapshots diff week-over-week
  in `production/serp-snapshots/`.
- **Top-article scrutiny:** WebSearch + WebFetch on whatever ranks for a
  target: extract their structure, gaps, claims, sources; we out-answer
  and out-specific them.
- **Practitioner discourse sweeps:** WebSearch across r/localseo, r/SEO,
  r/bigseo etc. (fetching some Reddit pages can be blocked; Apify's Reddit
  scraper is the fallback for bulk thread pulls).
- **First-party data:** gsc-report / gsc-index-audit pulls; article-eval
  sweeps; CONTENT-REGISTRY.
- **Competitor pages:** WebFetch their sites; LocalIntel holds the registry.

**Apify expansion (approved lane, use judiciously, batch always):**
- `apify/google-search-scraper` — localized SERPs (in use via serp-track).
- Google Maps scraper — competitor GBP intel for map-pack strategy
  (categories, review counts/velocity, photos) when we work a town.
- Reddit scraper — bulk customer-language mining when a manual thread
  paste isn't enough.
Rule: know the actor's pricing before a run; batch queries into one run;
save every raw result under `production/research/` so it's never re-bought.

**Still Jarred's (irreplaceable):**
- Local ground truth (Stream 5): conversations, photos, drive-by intel,
  press/Chamber contacts — the GEO moat.
- True from-town phone SERPs when proximity matters (map pack).
- Judgment calls on which threads/angles feel right for the brand.

**The bar for "additive":** raw beats summarized, every time. Paste the whole
thread, screenshot the whole SERP, quote the exact sentence. One line of
context is enough; structuring raw material is the studio's job (Track F).
Drop everything in `production/research/inbox/` (create folders per topic)
or paste directly in session.

---

## Stream 1 — Customer-language mining (the gold)

The words real owners use become our H2s, titles, and keywords. AI phrasing
loses to their phrasing every time.

**Where:** r/smallbusiness · r/sweatystartup · r/Entrepreneur ·
r/restaurantowners · r/hvacadvice + r/electricians + r/Plumbing (owner
threads, not tech questions) · local NC Facebook groups (Shelby/Cleveland
County buy-sell-trade, business owner groups) · Nextdoor recommendations
threads.

**Search these phrases (in-subreddit search):**
- "do I need a website" / "is a website worth it"
- "wix vs" / "squarespace worth it" / "godaddy website"
- "google business profile" + help/suspended/reviews/photos
- "customers can't find me" / "not showing up on google"
- "how much website cost" / "web designer quoted me"
- "yelp vs google" / "facebook page enough"

**Capture:** the exact sentences (screenshots or paste), especially
complaints, fears, and how they describe the problem BEFORE they know the
vocabulary. A thread of owners arguing about whether a Facebook page is
enough is a whole article handed to us in their own words.

## Stream 2 — Keyword validation (low-authority targeting)

We already hold `Desktop/Errors/keywords_cleaned.csv` (1234 scored keywords)
+ KEYWORD-STRATEGY.md. The research job is VALIDATING targets, not finding
more. The winnable-SERP test, per keyword:

1. Google it (incognito, and once from your phone in town).
2. Look at page 1. **We can win when it's:** Reddit/Quora/forum threads,
   thin directories (Yelp/Angi filler), generic national content not
   answering the local intent, or fewer than 3 strong direct answers.
   **Skip when it's:** Forbes/HubSpot/NerdWallet-class domains or 5+ real
   agencies answering the exact query well.
3. Screenshot the SERP + the People Also Ask box (expand a few).

**Shapes that favor low authority:** question-shaped ("why doesn't my
business show up on google maps") · local-modified ("web designer shelby nc",
"[service] + [town]") · cost/comparison intent ("website cost for small
business", "wix vs custom website") · tiny volume is FINE (10-50/mo with
buying intent beats 5k/mo informational).

## Stream 3 — SERP + PAA recon per target

For each keyword we commit to, before drafting: screenshot page 1, note the
format that ranks (listicle? FAQ? video? is there a map pack?), and harvest
every People Also Ask question (each PAA = an H2 candidate + AEO target).
Free tool worth using: AlsoAsked.com for the question tree. This tells the
Engine what SHAPE the article must take; we match intent, then beat it with
specificity.

## Stream 4 — Practitioner discourse (keep these coming)

Today's r/SEO thread changed doctrine. That class of input is high-value.

**Where:** r/SEO · r/bigseo · r/localseo (most aligned with us) ·
r/juststart (low-authority site case studies) · r/blogging.

**Searches:** "local seo low authority" / "rank without backlinks" /
"map pack ranking factors" / "google business profile ranking" / "AI content
indexed" / "programmatic seo penalty" / "AI overviews traffic" / "GEO
generative engine optimization" / "parasite seo local".

**Capture:** whole threads, especially where practitioners DISAGREE (the
disagreement marks what's actually uncertain) and anything with numbers or
before/after screenshots. Recency matters: sort by new/top past year.

## Stream 5 — Local ground truth (only you can get this)

The GEO moat. Nothing here can be generated:
- Real conversations: what an owner said about their website, quoted.
- Drive-by intel: businesses with no site, bad sites, new openings.
- Photos: storefronts, uptown, job sites (with permission where needed).
- Competitor observation: who's advertising, whose site broke, who bought
  a billboard (LocalIntel gets the structured version).
- Press/link contacts: Shelby Star, Cleveland County Chamber, town FB admins
  (feeds the Storefront link engine).
- Our own numbers once they exist: calculator usage, GSC queries, what
  prospects actually ask in emails. First-party data is unfakeable.

---

## The dev cycle (how research becomes a ranking article)

1. **You batch a drop** (one topic, any format, one line of context each).
2. **I structure it**: extract their language → angle map → check
   CONTENT-REGISTRY for overlap → winnable-SERP confirmation.
3. **Outline** with question-shaped H2s pulled from PAA + their phrasing →
   you approve.
4. **Draft** through ARTICLE-ENGINE: their words, our first-hand layer,
   sourced numbers, both gates.
5. **Ship with the signal plan** (internal links in, distribution move,
   watchlist entry) → tracked in SEO-STRATEGY PRESENT → checkpoint ladder
   decides what happens next.

One good research drop ≈ 2-3 articles. Raw is fine; that's the deal.

---
*Created 2026-07-19. Companions: SEO-STRATEGY.md (doctrine + ledger),
ARTICLE-ENGINE.md (development + gates), KEYWORD-STRATEGY.md (targets),
SOCIAL-PLAYBOOK.md (distribution).*
