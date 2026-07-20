# Article Build Spec — The Field Guide

The rules for turning a research dump into a shipped article. Whoever drafts
(you, me, or a delegated agent) fills `blog/article-template.html` against THIS
doc. Companion: `CONTENT-SYSTEM.md` (the pipeline), `../PRODUCT.md` (voice),
`../DESIGN.md` (tokens).

**Golden rule:** the template carries the structure so drafting fills slots, not
re-invents shape. Never rename a `blog.css` class. Never invent a statistic.

---

## 1. Before writing — the setup

1. Pick the **cluster** and its **pillar** (`CONTENT-SYSTEM.md` §3). The article
   links up to that pillar with keyword-rich anchor text; the pillar links down.
2. Pick **one primary keyword** (question-shaped, low-competition, local angle)
   and 2-3 secondary keywords. The primary goes in: `<title>`, H1, meta
   description, first paragraph, one H2.
3. Choose the **hero image** per §5 (owned, local, self-hosted).
4. Copy `blog/article-template.html` → `blog/{{slug}}.html`. Slug = kebab-case,
   keyword-first (e.g. `google-business-profile-photos-increase-calls`).

## 2. Writing voice (humanizer rules are non-negotiable)

Voice = PRODUCT.md: **direct, specific, occasionally sharp. Names real towns,
clients, numbers.** Run `/humanizer` on the draft before ship. Hard bans:

- **No em dashes (—).** Use commas, colons, periods, or parentheses. This is the
  #1 thing the user flags. En dashes in ranges (`1–6%`) are fine.
- No "serves as / stands as / is a testament / vital/pivotal/crucial role /
  underscores its importance / evolving landscape / marks a shift."
- No **rule-of-three** padding ("faster, cleaner, and more efficient").
- No signposting ("Let's dive in", "In today's world", "It's worth noting").
- No superficial `-ing` tails ("...ensuring success", "...highlighting the need").
- Vary sentence rhythm. Short punchy line. Then a longer one. Have a POV; react
  to the data, don't just report it.
- **Label opinion as opinion.** "Here's what I see in Cleveland County" is fine;
  presenting a personal read as a cited fact is not.

## 3. Structure & length

- **1,200-2,000 words** for a cluster article; pillars run longer (3,000+).
- One `<h1>`. Sections use `<h2>`; sub-points `<h3>`. Front-load the answer.
- Required blocks: byline, opening with pillar link, at least one `<h2>` section,
  an FAQ block (feeds FAQ rich results), the sources callout, related grid, CTA.
- Optional blocks (use when the content earns it, delete otherwise): `.tldr`,
  `.stat-card-row`, `.infographic`, `.data-table`, `.callout`, `.key-point`.
  Don't force all of them; a wall of components reads as filler.

## 4. SEO rules

- **`<title>`** < 60 chars incl `| Studio O'Brien`, primary keyword first.
- **Meta description** 140-160 chars, leads with the hook stat + primary keyword,
  no em dash.
- **One canonical**, matching the clean URL `https://studioobrien.com/blog/{{slug}}`.
- **Internal links:** ≥3 in-body links to other blog articles / service pages /
  location pages, **including one up to the cluster pillar** with keyword anchor
  text. Prefer contextual links over a link dump.
- **Schema:** BlogPosting + Breadcrumb (already in the template). `author.url`
  MUST be `https://studioobrien.com/about`. Real `datePublished`; bump
  `dateModified` on edits. Add FAQPage schema if the FAQ is substantial.
- **Every statistic** has an inline `<sup>` source link; list all sources in the
  closing callout with real, resolving URLs.

## 5. Image rules (owned + local)

- **Self-host** under `blog/img/`. Do NOT hotlink `upload.wikimedia.org` (the old
  articles do; that is being migrated out in Stream D).
- Prefer a **real photo of the relevant NC place** (the town, a landmark, a
  street). Local imagery reinforces local relevance and feels authentic.
- Convert to `.webp`, target < 150 KB, set explicit `width`/`height`.
- **Alt text describes the place/subject**, not the filename:
  "Uptown Shelby streetscape at dusk", not "image1".
- License: public-domain / CC with attribution in the `<figcaption>`, or the
  studio's own photography. Verify the source URL resolves before shipping.
- Sourcing workflow (programmatic): search the specific place + landmark →
  confirm license → download → `webp` convert → drop in `blog/img/` → attribute.

## 6. Pre-ship E-E-A-T checklist

- [ ] Byline present, links `/about`, face loads.
- [ ] Schema `author.url` = `/about`; dates real; canonical correct.
- [ ] Every stat has an inline source; sources callout complete + URLs resolve.
- [ ] ≥3 internal links incl. one pillar link with keyword anchor.
- [ ] Ran `/humanizer`: zero em dashes, no banned phrases, varied rhythm, a POV.
- [ ] `<title>` <60 chars; meta desc 140-160 with hook stat.
- [ ] Hero image self-hosted, local, `.webp`, descriptive alt, attributed.
- [ ] Real town/client/number specificity (the anti-AI tell).
- [ ] Added card to `blog/index.html` (correct `data-group`) + line in
      `blog/clusters.html`.
- [ ] `node .claude/skills/impeccable/scripts/detect.mjs --json blog/{{slug}}.html`
      is clean.

## 7. Who drafts what

**Claude develops articles end-to-end** (outline, draft, edit, wire-in).
Provider/subagent drafting (DeepSeek, cc-fleet) is RETIRED from this pipeline
(Jarred, 2026-07-19). Every article passes the two gates in
`production/ARTICLE-ENGINE.md` before ship: the mechanical evaluator
(`production/article-eval.mjs`, AEO/GEO/SEO/voice) and the judgment rubric.
Scripts remain fine for pure mechanics (webp conversion, registry rebuild).
