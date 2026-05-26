# Studio O'Brien — Agent Instructions

This project is a web design portfolio and mock site pipeline for Studio O'Brien (studioobrien.com).

## Stack
- Vite + React 19 + TypeScript + Tailwind CSS v4 + Bun
- Deployed on Vercel (project: `studio-obrien`)
- Dev server: `bun run dev` (port 4000)

## File Layout

```
src/
  App.tsx                ← Main portfolio site (Obsidian dark theme)
  main.tsx               ← React entry point
  index.css              ← Tailwind imports + base styles
  archetypes/            ← 10 design system specs (Phase 3)
    {01-10}-*/           ← Each archetype: design-spec.md + template.html + components/
public/
  for/                   ← Built mock sites served at /for/{slug}.html
  mock-sites/            ← Variant experiments and assets
  images/                ← Portfolio images and screenshots
  videos/                ← Walkthrough demo videos
pipeline/
  targets/               ← Business research (11 targets)
  agents/                ← Pipeline automation scripts
  process.md             ← 8-stage pipeline documentation
.agents/
  skills/                ← OpenCode agent skills
    copy-architect/      ← Derives copy from business profiles
    seo-engine/          ← Generates SEO metadata
    aesthetic-engine/    ← Builds HTML mock sites from archetypes
```

## Portfolio Site Aesthetic
- **Theme:** Obsidian dark (#131318 base, emerald #34d399 accent)
- **Font:** DM Sans
- **Design philosophy:** Clean, professional, dark — lets the mock site screenshots be the color
- **Sections:** Hero → Problem/Services → Portfolio → Process → FAQ → Contact

## Archetype System
10 design archetypes serve as templates for building mock sites:
1. Retro Neon (arcades/entertainment)
2. Industrial Grill (restaurants/bars)
3. Rustic Smokehouse (BBQ/farm-to-table)
4. Dark Gallery (tattoo/art studios)
5. Sports Heritage (cards/memorabilia)
6. Sweet Nostalgia (bakeries/desserts)
7. Botanical Elegance (florists/wellness)
8. Forge & Steel (trades/fabrication)
9. Dark Energy (fitness/gyms)
10. Warm Friendly (pet stores/community)

## Pipeline Workflow
1. Profile a business → `pipeline/targets/{slug}/profile.json`
2. Run Copy Architect → generates `copy.md`
3. Run SEO Engine → generates metadata + schema
4. Run Aesthetic Engine → builds HTML mock site
5. Deploy to `/for/{slug}.html` for portfolio
