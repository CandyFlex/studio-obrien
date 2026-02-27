# Studio O'Brien — Maximalist Marketing Site

## Stack
- Vite + React 19 + TypeScript + Tailwind CSS v4 + Bun
- Motion library (`motion/react`) for animations
- Dev server: port 4000

## Design DNA — "Maximalist Pattern Collage"
This is the locked aesthetic direction. All iterations HEIGHTEN this, never veer away.

### Fonts
- Display: `'Archivo Black', sans-serif` — all-caps, massive, bold headings
- Body: `'DM Sans', sans-serif` — clean supporting text

### Color Palette
| Token     | Hex       | Role                        |
|-----------|-----------|-----------------------------|
| coral     | #ff5f5d   | Primary accent, CTA energy  |
| lime      | #c8f542   | Secondary pop, pricing      |
| indigo    | #2b2d6e   | Depth, authority, headers   |
| lavender  | #c4b5fd   | Soft accent, decorative     |
| cream     | #fef9ef   | Light background            |
| dark      | #1a1a2e   | Dark sections               |
| pink      | #ff8fab   | Tertiary accent             |
| teal      | #0fd9b0   | Unused — available for evolution |

### Pattern System
- `dots(color)` — radial-gradient polka dots
- `stripes(color)` — 45deg repeating stripes
- `checker(color)` — conic-gradient checkerboard
- Patterns always as background overlays at low opacity (0.03–0.10)

### Signature Elements
- **Marquee strips** between sections (scrolling text with ★ separators)
- **Geometric shapes** as floating decorative elements (circles, rotated squares)
- **Rounded cards** (rounded-2xl/3xl) with pattern overlays
- **Bold uppercase headings** at 4xl–10rem scale
- **Wiggle animation** on hero circle

### Animation Patterns
- `whileInView` with `variants={{ hidden, visible }}` and `viewport={{ once: true, margin: "-50px" }}`
- `fadeUp`: `{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }`
- Hero uses `useScroll` + `useTransform` for parallax
- Marquee uses CSS `translateX(-50%)` infinite loop
- Hover: `scale-105` on buttons, `translate-x-2` on arrows

### Section Structure
1. **Hero** — cream bg, giant title, floating shapes, dot pattern
2. **Marquee** — indigo bg, lime text
3. **Services** — coral bg, 2×2 card grid with unique bg colors per card
4. **Marquee** — lime bg, indigo text
5. **Process** — indigo bg, 3-col colored cards (coral/lime/pink)
6. **Pricing** — cream bg, centered indigo card with lime price
7. **Marquee** — coral bg, cream text
8. **CTA** — dark bg, huge multi-color text
9. **Footer** — indigo bg, minimal

## Iteration Workflow

### How to evolve
Each round: Opus plans 3–4 **targeted micro-refinements** (one concern per variant). Haiku agents implement each variant in an isolated worktree. Screenshots are taken and compared. User picks what they like, it gets merged into main App.tsx.

### What to refine (in priority order)
1. **Visual density** — fill empty space, add more texture/detail
2. **Typography** — sizing, weight, spacing, hierarchy
3. **Color harmony** — adjust tints, contrast, accent usage
4. **Motion** — entrance animations, hover states, scroll effects
5. **Micro-details** — borders, shadows, gradients, icon treatment
6. **Section composition** — layout balance, card sizing, spacing rhythm

### Rules
- Every change must be in `src/App.tsx` (single-file component)
- Never change the core palette or fonts — only adjust usage/application
- Never remove sections or change section order
- Keep all content/copy identical across variants
- Changes should be SUBTLE — the user should see the same site, just better
- Test with Playwright screenshots at 1440×900 viewport

## CSS Warning
Tailwind v4 uses cascade layers. NEVER add unlayered `*` resets to index.css — they override all Tailwind utilities. All custom CSS must go inside `@layer base {}`.

## File Structure
```
src/
  App.tsx      ← single component, all design lives here
  main.tsx     ← just renders <App />
  index.css    ← @import "tailwindcss" + base layer overrides
index.html     ← Google Fonts (Archivo Black + DM Sans)
```
