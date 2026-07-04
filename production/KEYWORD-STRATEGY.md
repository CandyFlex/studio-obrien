# Keyword Strategy & Research Prompts

Source: `Desktop/Errors/keywords_cleaned.csv` (1,234 clean keywords, intent +
priority scored) + LocalIntel keyword-gap + the crawl audit. Companion:
`ARTICLE-SPEC.md`, `CONTENT-SYSTEM.md`, `PAGE-MANIFEST.json`.

## The read on the data

Volumes cluster at ~50/mo — this is a **small local market**. Don't chase volume;
**own the low-competition commercial + "near me" terms and win on topical
authority** (competitors have no blog/schema). Tier A is only 19 keywords, almost
all commercial. Intent split: generic 669, diy_low_value 218 (avoid), hire_commercial
125, pricing 114, local_hire 54, niche_vertical 31, redesign 13, seo_adjacent 5.

## Best keywords, by where they go

**Tier 1 — money pages (home + location + service):**
- Local-hire (highest intent, Tier A): `web design near me`, `website designer near me`,
  `web designers near me`, `near me web designer`, `web design agency near me`,
  `website design services near me`, `local web developers`, `web design north carolina`
- Commercial hire (Tier A, growing): `web design agency`, `web development agency`,
  `website design service`, `website services`, `responsive web design agency`
- Programmatic (already live): `{town} nc web design` across the 26 location pages
- → Inject into homepage + `seo-services` + `small-business-websites` + location titles/H1/meta

**Tier 2 — pricing (cost calculator + a pricing article):**
- `cost to build a website`, `typical website cost`, `website design cost`,
  `cost to build a business website`

**Tier 3 — redesign (redesign cluster):**
- `website redesign`, `website redesign near me`, `website revamp`, `web redesign`

**Tier 4 — SEO-adjacent bridge (blog ↔ services):**
- `web design and seo`, `web design with seo`

**Tier 5 — comparison / informational (blog capture, defuse DIY):**
- `web design platforms`, `website builder site`, `custom website` vs template →
  the builders-vs-custom article

**Avoid:** the 218 `diy_low_value` builder terms (`web builder`, `website builder site`
at vol 500 but high competition + wrong intent — someone who wants a free builder
isn't hiring). Reference them only inside comparison content, don't target them.

## Blog topic map (→ the 5 gap articles + research prompts below)

| Topic | Keyword cluster | Intent |
|---|---|---|
| How to choose a web design company | hire_commercial + "how to choose" gap | commercial-investigation |
| Website builders vs custom design | diy/comparison + `custom website` | comparison |
| What a website actually costs | pricing cluster | pricing |
| When a website redesign is worth it | redesign cluster | redesign |
| Local SEO for small business (what/why) | seo_adjacent + "benefits of local SEO" gap | informational |
| AI in web design (2026) | LocalIntel "AI-powered website" | informational |

---

# Gemini Deep Research prompts (hand these off, one per topic)

Each is built to return **current, cited, comprehensive** source material — the
"vital information + references" that reinforces the blog writing. Paste one per
Deep Research run. Bring the output back and it becomes the sourced backbone of
the article (drafted via `article-template.html` + `ARTICLE-SPEC.md`).

## Shared instruction (prepend to any prompt if the tool allows)
> You are a research analyst compiling a sourced brief for a US small-business
> audience in 2026. Prioritize authoritative, recent (2024–2026) sources:
> industry studies, Google/official documentation, reputable trade publications,
> government/academic data. For every statistic or claim, give the exact figure
> and a working source URL. Flag anything where sources disagree. End with a
> numbered reference list. Avoid marketing fluff and vendor blogspam.

## 1 — How to choose a web design company (small business)
> Research how a US small-business owner should choose a web design company or
> freelancer in 2026. Cover: the real decision criteria (portfolio, ownership of
> code/domain, pricing models, timeline, ongoing support, red flags), the specific
> questions to ask before hiring, freelancer vs agency vs template tradeoffs, how
> to vet local vs remote providers, and common ways owners get burned (lock-in,
> hidden costs, no source-code handoff). Include statistics with sources on
> small-business web spending, satisfaction, and project outcomes. Numbered references.

## 2 — Website builders vs. custom web design
> Research a 2026 comparison of DIY website builders (Wix, Squarespace, GoDaddy,
> Shopify) versus custom-built websites for US small businesses. Cover: true total
> cost of ownership over 3–5 years, performance/SEO differences (Core Web Vitals,
> speed, schema control), ownership and portability, scalability, and the point at
> which custom becomes worth it. Include cited statistics on builder market share,
> load-speed and conversion impact, and SEO limitations of hosted builders.
> Present a balanced, sourced tradeoff table. Numbered references.

## 3 — What a small-business website actually costs
> Research realistic 2026 pricing for US small-business websites. Break down cost
> ranges by type (template setup, freelancer, independent studio, agency, custom
> app), what drives price (page count, copywriting, custom design, e-commerce,
> integrations), one-time vs ongoing costs (hosting, maintenance, domain), and
> typical payback/ROI. Include cited averages and ranges from multiple reputable
> sources, and note why "cheap" sites often cost more long-term. Numbered references.

## 4 — When a website redesign is worth it (and the ROI)
> Research when a US small business should redesign its website in 2026 and the
> measurable return. Cover: the signals a site is costing customers (speed, mobile,
> dated design, poor conversion), average conversion/traffic lift from redesigns,
> payback periods, redesign vs incremental improvement, and migration risks (traffic
> loss, redirects). Include cited statistics on redesign ROI, conversion uplift,
> and website lifespan. Numbered references.

## 5 — Local SEO for small businesses: what it is and why it matters
> Research local SEO for US small businesses in 2026 for a non-technical owner.
> Cover: what local SEO is, how the Google local pack and Google Business Profile
> work, the biggest ranking factors (GBP, reviews, on-page, citations) with current
> weightings, how AI Overviews change local discovery, and the concrete revenue
> impact of ranking locally. Emphasize small/rural/micropolitan markets. Cite
> Whitespark/BrightLocal-style studies and Google documentation. Numbered references.

## 6 — AI in web design and development (2026)
> Research the state of AI in web design and development in 2026 for a small-business
> audience. Cover: what AI actually does well vs poorly in building/managing websites,
> AI-assisted design and content (and Google's stance on AI content + E-E-A-T),
> AI-powered site analysis/optimization tools, risks (generic output, hallucinated
> facts, accessibility gaps), and how a small business should think about AI-built
> vs human-built sites. Include cited data and Google's official guidance. Numbered references.
