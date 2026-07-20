# Content System — The Field Guide

How raw research becomes ranking articles on studioobrien.com/blog. This is the
repeatable pipeline: you dump the research, it gets chopped into pieces, each
piece ships with the trust signals Google actually rewards.

Companion docs: `PIPELINE.md` (build queue), `../PRODUCT.md` (voice),
`../DESIGN.md` (tokens). Live pages: `/blog` (hub), `/blog/clusters` (topic hub),
`/about` (author), `/blog/editorial-standards` (trust page).

---

## 1. Why this system exists (the strategy in one screen)

The model that matters: **Rank Position = Rank Signal × Rank Factor.**

- **Signals** are on-page: title, headings, text, schema, internal anchors,
  speed. Every article is mostly signal. Signals are necessary and cheap.
- **Factors** are multipliers: topical authority, real author identity (E-E-A-T),
  external links, click behavior. Without factors, signal alone spikes for ~3
  months then collapses. That collapse is the documented failure mode of mass
  AI content on zero-authority sites.

We already have the hard part most sites lack: **topical clustering** (4 clusters,
pillar pages) and a **real named author**. This system's job is to keep feeding
the clusters while making the *factors* visible on every piece:

1. **Author identity** is now the #1 amplifier (Google's 2026 updates). Every
   article shows a visible byline + face linking to `/about`, not just JSON-LD.
2. **Internal linking** turns isolated posts into an authority cluster. Mature
   clusters pull 2–3× the traffic of the same articles left unlinked.
3. **AI-assisted is fine** when edited, fact-checked, and grounded in real
   experience by a human. That's disclosed on `/blog/editorial-standards`.
   Fabricated authors/editors are the one thing that gets you the *lowest*
   quality rating. We never do that.

---

## 2. The pipeline: research dump → published articles

```
[1] DUMP        You drop raw research into production/research/<topic>.md
                 (pasted studies, stats, notes, source URLs, your own take)
      │
[2] CHOP        Claude splits the dump into a headline plan: 1 pillar angle +
      │          N cluster angles, each with a target question + primary stat
      │          + which existing articles it links to. You approve/cut.
      │
[3] DRAFT       Claude drafts each article into the HTML template (§4), pulling
      │          real stats with inline source links. Facts only from the dump
      │          or verifiable sources — no invented numbers.
      │
[4] HUMANIZE    Run /humanizer on the draft prose. Kills AI cadence (em-dash
      │          overuse, rule-of-three, "serves as", signposting). Voice =
      │          PRODUCT.md: direct, specific, names real towns/clients.
      │
[5] CHECK       Run the E-E-A-T checklist (§5). Every stat sourced, byline
      │          present, ≥3 internal links, schema valid.
      │
[6] SHIP        Save to /blog/<slug>.html, add card to /blog/index.html + a
                 line in /blog/clusters.html, then `vercel deploy --prod`.
```

**Your job is step 1 and the approvals.** Everything else is Claude's. To start a
batch, say: *"Chop production/research/<topic>.md into articles."*

### The dump format (step 1)

Keep it loose. A useful dump has: the core claim, 3–10 stats with their sources,
any first-hand experience you want woven in ("I saw this with a Shelby client…"),
and 2–3 competitor URLs if you have them. Bullet points are fine. The messier the
raw material, the more valuable the chop.

---

## 3. Topic strategy — where new articles go

Four live clusters. Every new article joins one and links up to its pillar.

| Cluster | Pillar page | Feeds |
|---|---|---|
| Restaurants & Digital Strategy | `restaurant-website-guide` | restaurant ops, menus, reviews, email |
| Local SEO & GBP | `local-seo-guide` | GBP, Map Pack, reviews, AI search |
| Web Design & Performance | `web-design-redesign-guide` | redesign ROI, speed, mobile |
| Technical SEO & Compliance | `technical-seo-compliance-guide` | Core Web Vitals, migrations, ADA |

**Picking the next topic:** low-competition, high-intent, question-shaped
("how do I…", "why is my…", "does X really…"), and answerable with a real number.
Prefer topics where a Shelby / Cleveland County angle makes the piece specific
and hard to commoditize. Specificity is the anti-AI tell (PRODUCT.md principle 4).

**Cadence:** steady beats bursts. A few pieces a month, published on a rhythm,
signals an active site — which lifts *older* posts too (observed 17–19× on
follow-up publishing). Don't dump 30 at once then go quiet; that's the pattern
that reads as scaled content abuse.

---

## 4. Article template (the required shape)

Every article is a standalone `/blog/<slug>.html` built on `/blog/blog.css`.
Copy an existing article (e.g. `google-business-profile-ranking-factors-2026.html`)
as the skeleton. Non-negotiable parts:

- **`<head>`:** GA snippet, unique title (`<60 chars` + `| Studio O'Brien`), meta
  description with the primary stat, canonical, OG tags, **BlogPosting + Breadcrumb
  JSON-LD**.
- **BlogPosting schema:** `author` is `{"@type":"Person","name":"Jarred O'Brien",
  "url":"https://studioobrien.com/about"}` — the `/about` URL, not the homepage.
  Set real `datePublished`; update `dateModified` on edits.
- **Visible byline** under the H1 (this is the E-E-A-T fix — see §6):
  ```html
  <div class="article-byline">
    <img src="/portfolio/jarred.webp" width="40" height="40" alt="Jarred O'Brien">
    <div><a href="/about">Jarred O'Brien</a><span>Designer &amp; developer · Shelby, NC</span></div>
  </div>
  ```
- **Body components** (use as the content needs them, don't force all):
  `.tldr` (30-second summary), `.stat-card-row`, `.infographic` bar chart,
  `.data-table`, `.key-point`, `.callout`, `.faq-item` block, `.cta-block`.
- **Internal links:** ≥3 in-body links to other blog articles / service pages /
  location pages, plus **one contextual link up to the cluster pillar** using
  anchor text containing the pillar's keyword. Pillar links back down.
- **Sources callout** at the end listing every cited source with real URLs.
- **`.related` grid** of 3 sibling articles in the same cluster.

---

## 5. E-E-A-T checklist (run before every ship)

- [ ] Visible byline present, links to `/about`, face loads.
- [ ] BlogPosting schema `author.url` = `/about`; dates correct.
- [ ] Every statistic has an inline link to a primary/reputable source.
- [ ] Any first-person claim is genuinely ours; opinion is labeled as opinion.
- [ ] ≥3 internal links, including one up to the cluster pillar.
- [ ] Ran `/humanizer` — no em-dash overuse, no "serves as / vital role /
      testament", no rule-of-three padding, no "Let's dive in".
- [ ] Title < 60 chars, meta description has the hook stat, unique canonical.
- [ ] Reads like a person wrote it: real town names, a POV, varied sentence
      rhythm (PRODUCT.md voice).
- [ ] Card added to `/blog/index.html` with correct `data-group`; line added to
      `/blog/clusters.html`.

---

## 6. Status / open work

**Done (2026-07-03):**
1. ✅ Visible bylines retrofit onto all content articles (`.article-byline` block
   + CSS in `blog.css`). Scripted, not hand-edited.
2. ✅ Article schema `author.url` normalized to `https://studioobrien.com/about`
   across all `blog/*.html` (both the no-url and homepage-url variants).
3. ✅ `/about` + `/blog/editorial-standards` linked from the homepage footer
   (`index.html` + `index-v2.html`).
4. ✅ **Self-host local images** (Stream D): the 24 hotlinked `upload.wikimedia.org`
   images (94 refs across 30 blog files) downloaded, converted to webp, and
   self-hosted under `blog/img/`. Fixed the Ahrefs 7/17 "broken image" 429 errors.
   CC attribution links in figcaptions retained. `ARTICLE-SPEC.md` already forbids
   new hotlinks.

**Open:**
5. **Site-wide voice cleanup** (Stream C): ~625 em dashes across the 40 root
   location/service pages still need the humanizer/SEO pass.

Full plan: `.claude/plans/okay-now-i-need-valiant-harbor.md`. Build spec:
`ARTICLE-SPEC.md`.

---

## 7. Tooling

- **`/humanizer`** (installed at `.claude/skills/humanizer/`) — run on every draft
  before ship. Optionally feed it a sample of your own writing for voice match.
- **`/impeccable`** — the design detector hook is active; it audits UI files on
  edit. Inter / Inter Tight / the portrait gradient are recorded as intentional
  brand values in `.impeccable/config.json`.
- **Deploy:** `vercel deploy --prod` from the working dir. Git push does **not**
  deploy. Clean URLs are configured in `vercel.json` (`/blog/:slug` → `.html`).
