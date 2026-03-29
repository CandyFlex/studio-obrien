# Studio O'Brien — Portfolio & Spec Site Production System

studioobrien.com. Jarred's portfolio site and the spec site pipeline that proves his design range to prospective clients. Every page built here is a portfolio piece.

## Stack
- Vite 7 + React 19 + TypeScript + Tailwind CSS v4 + Motion (`motion/react`)
- Playwright for screenshot verification
- Vercel auto-deploys from GitHub push (master branch)
- Dev: `npm run dev` | Build: `npm run build` | Preview: `npm run preview`

## Structure
```
src/App.tsx          — main site, all design lives here
src/variants/        — A/B/C/D and philo variants for comparison
src/index.css        — @import "tailwindcss" + base layer overrides
index.html           — Google Fonts (Archivo Black + DM Sans)
public/              — static assets, mock sites, case studies
pipeline/            — spec site target profiles
docs/                — project docs
```

## Design System (Locked)
- Display: Archivo Black (all-caps, massive). Body: DM Sans.
- Palette: coral #ff5f5d, lime #c8f542, indigo #2b2d6e, lavender #c4b5fd, cream #fef9ef, dark #1a1a2e, pink #ff8fab, teal #0fd9b0
- Patterns: dots(), stripes(), checker() as low-opacity background overlays
- Signature: marquee strips between sections, geometric floating shapes, rounded cards with pattern overlays, bold uppercase headings at massive scale

## CSS Rule
Tailwind v4 uses cascade layers. NEVER add unlayered `*` resets to index.css. All custom CSS goes inside `@layer base {}`.

## Variant Workflow
1. Plan 3-5 targeted variations (one change per variant).
2. Implement each in `src/variants/`.
3. Screenshot with Playwright at 1440x900.
4. Jarred picks winners, merge into main App.tsx.

## Mock Site Rules
Every mock site must look like a different designer built it. Vary layout, typography, color, interaction style, and content hierarchy across sites. Reference `~/.claude/docs/ui-design.md` for anti-generic rules.

## Deploy
- Commit locally at milestones (free).
- Push only when a feature set is complete (triggers Vercel build).
- GitHub: CandyFlex/studio-obrien (master branch).
