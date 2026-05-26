---
name: aesthetic-engine
description: "Builds complete single-page HTML mock business sites from archetypes and profiles. Use after copy-architect and seo-engine produce their outputs. Selects an archetype, applies business data, and generates a polished, professional HTML file indistinguishable from a real business website."
---

# Aesthetic Engine

You build complete single-page HTML mock business sites. Each site must look like a real, professionally designed business website — never like a template.

## Input
- `pipeline/targets/{slug}/profile.json` — business identity, brand colors, mood
- `pipeline/targets/{slug}/copy.md` — all site copy
- `pipeline/targets/{slug}/seo.json` — SEO metadata
- `pipeline/targets/{slug}/image-candidates.json` — sourced photos (from image-agent)
- `pipeline/images/{XX}-{name}-manifest.json` — image requirements for this archetype
- `src/archetypes/{XX}-{name}/design-spec.md` — selected archetype design system

## Image Pipeline (run BEFORE building)

Before building the HTML, images must be sourced. Check if `image-candidates.json` exists:

1. **If it exists:** Read the recommended image URLs and embed them directly in the HTML.
2. **If it does NOT exist:** Run the image sourcing flow:
   ```bash
   bun run pipeline/images/source.mjs {archetype-number} {slug}
   ```
   This requires PEXELS_API_KEY and/or PIXABAY_API_KEY environment variables.
   If API keys aren't available, search via web using the image-agent skill instructions.
3. **Fallback:** Use styled CSS gradient placeholders with `data-asset="id"` attributes. Images can be swapped in later.

### Image Placement in HTML
```html
<!-- For sourced images -->
<img src="{candidate.url}" alt="{descriptive alt text}" loading="lazy"
     style="width:100%; height:100%; object-fit:cover;" />

<!-- For unsourced slots — CSS placeholder -->
<div class="image-placeholder" data-asset="hero-bg"
     style="background: linear-gradient(135deg, var(--surface) 0%, var(--accent-pale) 100%);
            aspect-ratio: 16/9; display: grid; place-items: center;
            font-style: italic; color: var(--muted);">
  {slot role description}
</div>
```

### Footer Image Attribution
Every mock site must include image attribution in the footer:
```html
<p class="photo-credit">
  Photography: <a href="https://pexels.com">Pexels</a>
  <!-- Add individual photographer credits for each image used -->
</p>
```
This keeps the faux site compliant with free-use licenses.

## Output

Write `public/for/{slug}.html` — a complete, standalone HTML file with:
- All CSS inline or in a `<style>` block
- All copy from copy.md
- SEO metadata from seo.json in `<head>`
- No external dependencies except Google Fonts
- Fully responsive (mobile-first, 375px to 1440px+)
- 6-8 distinct sections

## The 10 Archetypes

| # | Name | Palette | Vibe | Best For |
|---|------|---------|------|----------|
| 1 | Retro Neon | #0a0a0a bg, #ff2d95 pink, #00e5ff cyan, #ffe53d yellow | 80s arcade, scanlines, pixel accents | Entertainment, arcades, gaming |
| 2 | Industrial Grill | #1a1a1a bg, #ff6b35 orange, #e8e8e8 text | Rough textures, bold condensed type | Restaurants, bars, grills |
| 3 | Rustic Smokehouse | #2c1810 bg, #d4a574 tan, #f5f0e8 cream | Wood grain, burlap texture, hand-lettered | BBQ, farm-to-table, country |
| 4 | Dark Gallery | #0d0d0d bg, #c41e3a red, #f0f0f0 white line art | Gallery aesthetic, ink splatter motifs | Tattoo, art studios, creative |
| 5 | Sports Heritage | #0f1923 bg, #c9a84c gold, #ffffff text | Card layout, trophy case, stats styling | Sports, memorabilia, collectibles |
| 6 | Sweet Nostalgia | #fff5f5 bg, #ff8fa3 pink, #98d8c8 mint, #f7dc6f vanilla | Soft, rounded, playful, ice cream drips | Bakeries, desserts, ice cream |
| 7 | Botanical Elegance | #faf8f5 bg, #8b9d83 sage, #d4a0a0 blush | Watercolor, serif type, delicate lines | Florists, wellness, spas |
| 8 | Forge & Steel | #121212 bg, #ff8c00 amber, #e0e0e0 text | Heavy industrial, sparks, raw metal textures | Welding, fabrication, trades |
| 9 | Dark Energy | #0a0a0a bg, #00ff41 green, #1a1a2e accent | Angular, aggressive, motion blur vibes | Gyms, fitness, training |
| 10 | Warm Friendly | #faf5ef bg, #d4956a terracotta, #7a9a7e sage | Rounded, paw prints, friendly illustrations | Pet stores, community shops |

## Site Structure (Every Site Must Have)

1. **Nav** — logo + links (minimal, 3-4 items + CTA button)
2. **Hero** — headline + subhead + CTA + hero image/visual
3. **About** — story, owner info, selling points
4. **Services/Menu** — what they offer, grid or cards
5. **Gallery** — 4-6 images with alt text
6. **Testimonials** — 3 quotes with attribution
7. **Location/Info** — address, hours, phone, map embed placeholder
8. **CTA Band** — repeat primary CTA before footer
9. **Footer** — business info + "Website designed by Studio O'Brien"

## Design Rules

- **Colors from the archetype, copy from the profile.** Never cross them.
- **No lorem ipsum.** Every word is real or derived from the profile.
- **Mobile-first responsive.** Test at 375px, 768px, 1024px, 1440px.
- **Subtle animations.** CSS-only: fade-in on scroll, gentle hover states. No JS animation libraries.
- **Images.** Use styled div placeholders with `data-asset="description"` attributes where real photos go later. Include descriptive alt text.
- **The footer credit.** Always include: `<p class="credit">Website designed by <a href="https://studioobrien.com">Studio O'Brien</a></p>` — small, subtle, bottom of footer.
- **Fonts.** Use Google Fonts only. Select fonts that match the archetype vibe. No external icon libraries — use emoji, CSS shapes, or SVG inline.

## Quality Checklist (Self-Check Before Output)

- [ ] Hero grabs attention in 3 seconds
- [ ] Copy sounds like the business owner wrote it
- [ ] No section feels empty or placeholder-y
- [ ] Color contrast passes WCAG AA (minimum)
- [ ] Works on mobile (no horizontal scroll, readable text)
- [ ] All links work (nav, CTAs, footer)
- [ ] Footer credit is present but subtle
- [ ] The site could pass for a real business at a glance

## Modes

**Archetype mode** (default): "Build a {archetype} site for {business}"
→ Pick archetype, load profile + copy + SEO, generate HTML

**Mirror mode**: "Here's a reference site. Build our version in {archetype} style."
→ Analyze reference structure, map to our section template, apply archetype styling

**Research mode**: "Analyze {industry} sites and propose a new archetype."
→ Study 5-10 real sites, extract patterns, write a new design-spec.md
