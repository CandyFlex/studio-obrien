# Article Engine — Claude-native development + AEO/GEO/SEO evaluation

The system for developing Field Guide articles end-to-end in Claude, with a
hard evaluation gate before anything ships. **Supersedes the delegation model**
in ARTICLE-SPEC.md §7 and CONTENT-SYSTEM.md: no DeepSeek/provider drafting in
this pipeline. Claude develops; the evaluator judges; Jarred approves.

ARTICLE-SPEC.md's structural rules (template slots, image rules, humanizer
bans) still apply in full. This doc adds the three-engine optimization
doctrine and the scoring gates.

---

## 1. The three engines (what we optimize for, all at once)

**SEO — classic search.** Ranking a page in Google's blue links and map pack.
Won by: keyword-shaped titles, internal link architecture, schema, page speed,
local entity signals, links up to cluster pillars.

**AEO — answer engines.** Being the extracted answer: featured snippets,
People Also Ask, voice answers. Won by: question-shaped headings, a direct
40-70 word answer immediately under the question before any elaboration,
FAQ blocks with FAQPage schema, lists and tables where the answer is
enumerable. Rule of thumb: every H2 section works as a standalone
question-and-answer card.

**GEO — generative engines.** Being quoted and cited by AI assistants
(AI Overviews, ChatGPT, Perplexity) when they answer a reader's question.
Won by: citable claims with named sources inline, first-hand observations
no aggregator has ("here's what I see in Cleveland County"), clean
declarative sentences an LLM can lift whole, defined terms, unambiguous
entity statements (who we are, where we are), fresh dateModified, and being
the original source of something specific rather than a summary of summaries.

The three don't conflict. An article that answers fast, cites named sources,
teaches its terms, and carries real local observation wins all three engines
with one draft. When a tradeoff appears, the reader wins first, then GEO
(citations outlive rankings), then classic SEO.

## 2. The development flow (one article)

0. **Strategy check** — open `production/SEO-STRATEGY.md` (the past/present/
   future ledger). The next article comes from its FUTURE queue unless data
   in PRESENT says otherwise; targets come from KEYWORD-STRATEGY.md.
1. **Target** — pick cluster + pillar + one primary question-shaped keyword
   (ARTICLE-SPEC §1). Check `CONTENT-REGISTRY.json` for overlap: if an
   existing article covers >50% of the ground, extend it instead.
2. **Research** — gather real sources (primary where possible). Every number
   gets a resolving URL before drafting, not after. No source, no claim.
3. **Skeleton** — H2s written as the actual questions the reader asks
   (mirror PAA phrasing). Under each H2, write the direct answer first
   (40-70 words), then the elaboration. TL;DR block up top when the piece
   runs long.
4. **Draft** — into `blog/article-template.html` per ARTICLE-SPEC. Voice =
   POSITIONING.md (capable neighbor, teach the term, never condescending).
   Include at least one first-hand section: what we actually see locally.
5. **Mechanical gate** — `node production/article-eval.mjs blog/<slug>.html
   --keyword "<primary>"`. Fix every FAIL; justify or fix every WARN.
6. **Judgment gate** — score §3 rubric honestly. Anything under threshold
   goes back to step 4.
7. **Wire + ship** — registry rebuild, index card, clusters line, sitemap,
   deploy, then registry rebuild again (per RANKING-OPERATING-MODEL).
8. **Signal plan (mandatory, per SEO-STRATEGY doctrine)** — an article
   without distribution is a diary entry. Before closing the task: add
   contextual links TO the new piece from 2+ existing relevant pages;
   note the distribution move (which local channel, per SOCIAL-PLAYBOOK);
   add the article + target query to the SEO-STRATEGY PRESENT watchlist.

## 3. The judgment rubric (what the script can't measure)

Score 1-5 each. Ship threshold: **no dimension below 3, average ≥ 4.**

| Dimension | 5 looks like |
|---|---|
| **Direct-answer quality** | Each H2's first two sentences answer the question completely; a snippet built from them would satisfy the searcher |
| **First-hand value** | At least one observation, number, or pattern that exists nowhere else online; labeled as ours |
| **Quotability** | 3+ clean declarative sentences an AI could cite with attribution and no surgery |
| **Teach-the-term** | Every technical term is used, taught in ten seconds, and tied to why it matters to this owner |
| **Local specificity** | Real towns, real queries, real situations; nothing that could run unchanged on a Phoenix agency's blog |
| **Voice fidelity** | Passes the POSITIONING three-register test; warm, plain, never condescending, zero agency-speak |

## 4. Standing gates (inherited, enforced by the evaluator)

Zero em dashes · zero invented statistics · every stat sourced inline ·
opinion labeled as opinion · byline + author.url=/about · BlogPosting +
Breadcrumb schema · ≥3 internal links incl. pillar · self-hosted webp imagery
with real alt text · title <60 chars · meta 140-160.

---
*Created 2026-07-19 (Jarred: retire provider drafting, build the evaluation
system). Evaluator: `production/article-eval.mjs`. Registry:
`production/build-registry.mjs`. Voice: `POSITIONING.md`.*
