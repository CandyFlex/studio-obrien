# Ranking Operating Model — reliable, unique, token-efficient

How we turn research into ranked pages without duplicating work or overspending.
Ties together the existing docs: `CONTENT-SYSTEM.md` (pipeline), `KEYWORD-STRATEGY.md`
(targets), `CONTENT-REGISTRY.md` (dedup + interlink), `ARTICLE-SPEC.md` (build rules).

## The equation we optimize

**Rank = Signal x Factor.** Signals are on-page and cheap (title, headings,
schema, internal anchors, speed). Factors are multipliers that decide whether
signal holds: topical authority (clusters), real author identity (E-E-A-T),
internal link equity, and cadence. Mass content with signal but no factor spikes
for ~3 months then collapses. We build both, deliberately.

## 1. Uniqueness is enforced, not hoped for

Before any new article: `node production/build-registry.mjs`, then search
`CONTENT-REGISTRY.json` for the target keyword across `title` / `metaDesc` /
`topicsCovered`. If an angle is taken, sharpen to a distinct one or enrich the
existing piece. This is what prevents self-cannibalization as volume grows.

## 2. What actually makes these rank

- **Cluster + pillar interlink.** Every article links up to its cluster pillar
  with keyword anchor text and across to 2-3 siblings. The registry's
  `inboundFromArticles` must be >=2 before ship (no orphans).
- **E-E-A-T factor.** Visible byline + face -> `/about`, BlogPosting schema with
  `author.url = /about`, honest AI disclosure on `/blog/editorial-standards`.
  Never a fabricated author (lowest-quality trigger).
- **Keyword discipline.** One primary (question-shaped, low-competition, local),
  placed in title/H1/meta/first-para/one H2. Targets come from KEYWORD-STRATEGY.
- **Local specificity.** Real NC towns, verified local imagery, real numbers.
  This is the anti-AI, hard-to-commoditize signal.
- **Cadence, not bursts.** 2-4 pieces/week. Steady publishing lifts older posts
  too; a 30-at-once dump reads as scaled-content abuse on a young-authority site.

## 3. Token-efficient production (who does what)

| Step | Cheapest capable worker |
|---|---|
| Chop research -> headline plan; final QA | Opus main (judgment) |
| Draft prose into template from approved plan | Sonnet subagent, one article each |
| Slugs, card + cluster insertion, schema fills, image webp | script / Haiku / DeepSeek |
| Dedup + interlink check | `build-registry.mjs` (free) |

Rules: batch research (1 prompt -> ~2-3 articles). Reuse the template, never
re-invent shape. The registry prevents paying to write something we already have.
Scale throughput by fanning drafting out to subagents (parent does chop + QA),
which needs an explicit go since it spawns agents.

## 4. Realistic volume

- 1 research prompt ~= 2-3 non-overlapping articles.
- A strong library for this small local market is ~30-40 cluster articles,
  published on cadence, not a one-time dump.
- That is ~12-16 total research prompts. (6 exist -> ~15 articles; ~6-10 more
  prompts to reach the full library.)

## 5. Images (self-host pipeline)

Verified local NC photos, license-checked, converted with `ffmpeg` to webp and
stored in `blog/img/`. Gotchas learned: Wikimedia blocks the 1600px thumb for
these files (use <=1280px, fall back to 960px); a descriptive User-Agent avoids
the error page on some requests. CC BY-SA images need author + license link +
"cropped" note in the figcaption; PD/CC0 credited as courtesy.

## The per-article loop (the whole thing on one screen)

1. Pick target keyword from KEYWORD-STRATEGY (or the research topic).
2. `build-registry.mjs` -> confirm the angle is unused.
3. Chop -> approve plan.
4. Draft into template; every stat gets a real source link.
5. `/humanizer`; zero em dashes; run the E-E-A-T checklist.
6. Self-host a verified local image.
7. Wire: card in `index.html`, line in `clusters.html`, URL in `sitemap.xml`.
8. `build-registry.mjs` again -> confirm inbound >=2.
9. Ship on cadence: `vercel deploy --prod`.
