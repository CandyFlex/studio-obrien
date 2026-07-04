# Content Registry — how the Field Guide avoids repeating itself

`CONTENT-REGISTRY.json` is the machine-readable index of every published Field
Guide page. It exists to do two things every new article must respect:

1. **Dedup** — never re-make an angle, headline, stat, or question that already
   exists. Before drafting, scan the registry for the target keyword and topic.
2. **Interlink** — every new article links up to its cluster pillar and across to
   the right siblings. The registry shows each page's cluster, inbound count, and
   who it already links to, so we link deliberately instead of guessing.

## Generating / refreshing it

```bash
node production/build-registry.mjs
```

Derived, never hand-edited. Re-run it after shipping any article (the pipeline's
step 6). It parses `blog/*.html` directly, so it is always in sync with what is
actually live in the repo.

## What each article record holds

| Field | Use |
|---|---|
| `slug`, `title`, `h1`, `metaDesc` | dedup on headline + promise |
| `cluster`, `type` (article/pillar/trust) | where it belongs; pillars anchor clusters |
| `topicsCovered` | the article's H2s — the fastest way to see if an angle is taken |
| `linksToArticles`, `linksToPages` | its outbound internal links |
| `inboundFromArticles` | how many siblings link *to* it (orphan check: aim ≥2) |
| `titleLen`, `metaLen`, `wordCount` | quick SEO sanity (title <60, meta 140-160) |

Top of file: `clusters` (slug lists per cluster) and `pillars` (the pillar slug
for each cluster).

## The check to run before writing a new article

1. `node production/build-registry.mjs` (refresh).
2. Search the JSON for your target keyword across `title` / `metaDesc` /
   `topicsCovered`. If an existing piece already owns that promise, either pick a
   sharper distinct angle or enrich the existing article instead of adding a rival.
3. Note the cluster pillar (link up to it) and 2-3 siblings with the closest
   topic (link across). Confirm each new article ends with `inboundFromArticles`
   ≥2 after siblings are cross-linked, so nothing ships orphaned.

## Current shape (2026-07-04)

5 clusters, 4 pillars. `web-design-redesign-guide` anchors **Web Design &
Performance**, which is the active build target for the hiring / builders-vs-custom
/ pricing research branches. See `KEYWORD-STRATEGY.md` for the topic map and
`CONTENT-SYSTEM.md` for the full research-to-ship pipeline this registry plugs into.
