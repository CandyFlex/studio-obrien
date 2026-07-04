---
name: Studio O'Brien
description: A bold, opinionated portfolio for an independent web design practice rooted in western North Carolina
colors:
  bg: "#0f0f10"
  bg-deep: "#0a0a0b"
  surface: "#1c1c1d"
  surface-2: "#181819"
  surface-3: "#1d1d1e"
  ink: "#ffffff"
  ink-2: "#d4d4d4"
  ink-3: "#a8a8a8"
  ink-4: "#9a9a9a"
  ink-muted: "#888888"
  ink-faint: "#666666"
  border: "#2a2a2b"
  border-faint: "#1f1f20"
  workshop-mint: "#34d399"
  workshop-mint-strong: "#2ec48d"
  workshop-mint-soft: "#34d39919"
typography:
  hero:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(65px, 27vw, 580px)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontVariation: "'opsz' 32, 'wght' 750"
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(38px, 5.4vw, 72px)"
    fontWeight: 720
    lineHeight: 1
    letterSpacing: "-0.04em"
    fontVariation: "'opsz' 32, 'wght' 720"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(32px, 4vw, 56px)"
    fontWeight: 720
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(20px, 1.9vw, 28px)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(15px, 1.6vw, 19px)"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.005em"
rounded:
  none: "0"
  pill: "999px"
  video-frame: "16px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "56px"
  xxl: "80px"
  xxxl: "96px"
  section: "140px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.pill}"
    padding: "18px 28px 18px 32px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.workshop-mint}"
    textColor: "{colors.bg}"
  button-topbar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
    rounded: "{rounded.pill}"
    padding: "10px 16px 10px 18px"
    typography: "{typography.label}"
  chip-step:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  pill-case:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    rounded: "{rounded.none}"
    padding: "6px 14px"
  card-case:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0"
---

# Design System: Studio O'Brien

## 1. Overview

**Creative North Star: "The Loud Workshop"**

The studio is a workshop with the door open. Tools out, work in progress visible, no fluorescent showroom polish. Visitors see the practice the way they'd see it walking past the front window — confident, busy, opinionated, and not arranged for them. This site is not a brochure; it's the workshop with a hand-painted sign out front.

Design density is high in type and committed in shape, low in decorative chrome. The system rejects the editorial-typographic AI lane (display serif + tracked uppercase eyebrows + monochrome restraint), rejects template SaaS marketing (gradient hero → three feature cards → testimonial wall), and rejects the generic agency look (hero-metric template, identical card grids, "digital experiences" copy). What remains is a near-black surface, one mint-green accent that carries identity, big confident typography, and components that feel made — not configured.

**Key Characteristics:**
- Near-black canvas, one bold accent, no chromatic competition.
- Display type does the heavy lifting; the wordmark / hero is the loudest brand moment on every page.
- Components commit to one shape per role — true pill (999px) or hard square (0). Never the soft 12px middle.
- Motion carries depth; surfaces sit flat at rest and respond to interaction.
- Specificity is voice — real town names, real client names, real numbers.

## 2. Colors

A near-black surface anchors everything. One mint-green accent — Workshop Mint — does the heavy lifting alone. No secondary chromatic, no tertiary, no "supporting palette." The restraint is the point: one voice, one color, and the rest is ink-on-near-black ramp.

### Primary
- **Workshop Mint** (`#34d399`): The single chromatic color. Used as anchored accent bars under headings, link-hover undercolor, button-fill-slide on hover, status dots (the green "Live" indicator), pill backgrounds in rare emphasis, and the rotating green strip in the hero. Never used as a fill on body backgrounds, never as text on white, never alongside another saturated color.
- **Workshop Mint Strong** (`#2ec48d`): Pressed/active state of Workshop Mint. Lower lightness, same hue.
- **Workshop Mint Soft** (`rgba(52,211,153,0.1)`): 10% alpha mint, used sparingly as accent fills, subtle glows on case hovers.

### Neutral
- **Bg** (`#0f0f10`): Body background. Near-black with a slightly warm bias.
- **Bg Deep** (`#0a0a0b`): Deeper background for full-bleed contrast sections.
- **Surface** (`#1c1c1d`): Card and panel surface. The case-hero, case-card, and step-float live here.
- **Surface 2** (`#181819`): Secondary surface, slightly recessed.
- **Surface 3** (`#1d1d1e`): Tertiary surface for portfolio cards.
- **Ink** (`#ffffff`): Primary text and headings.
- **Ink 2** (`#d4d4d4`): Strong body text.
- **Ink 3** (`#a8a8a8`): Supporting body copy.
- **Ink 4** (`#9a9a9a`): Quieter body.
- **Ink Muted** (`#888888`): Labels and meta text.
- **Ink Faint** (`#666666`): The lightest readable ink — hairlines, faint dividers.
- **Border** (`#2a2a2b`): Standard borders on cards and chips.
- **Border Faint** (`#1f1f20`): Hairline dividers between sections and list items.

### Named Rules

**The One Voice Rule.** Workshop Mint is the only chromatic color in the system. Never introduce a second hue. If a state needs to feel different (warning, success-vs-error, secondary action), express it through ink ramp value or through Workshop Mint at a different alpha — never through a new color.

**The Anchor Bar Rule.** The recurring 2px × 48px green bar that pins a heading is the single most-repeated brand element. It is never decorative, always positional — under or beside a section heading as the anchor. If a section has no anchor bar, that's a deliberate quiet moment, not a forgotten one.

## 3. Typography

**Display & Body Font:** Inter Variable (with `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `'Segoe UI'`, `Roboto`, `sans-serif` fallbacks).

**Character:** Single-family system, leaning hard on weight contrast and variable axes (`opsz`, `wght`). Inter is chosen by use, not by reflex — the bold north-star demands big-clamped display, and Inter's variable weight range (500–750) plus `opsz` axis lets one family do everything from 12px label to 580px hero with confidence. The italic-500 in Workshop Mint inside headings is the one expressive flourish — used sparingly, never twice in a section.

### Hierarchy
- **Hero** (750, `clamp(65px, 27vw, 580px)`, line-height 1, letter-spacing -0.04em): The wordmark / above-the-fold scream. One per page. The Loud Workshop's loudest moment.
- **Display** (720, `clamp(38px, 5.4vw, 72px)`, line-height 1, letter-spacing -0.04em): h1 / intro heading on top-level pages.
- **Headline** (720, `clamp(32px, 4vw, 56px)`, line-height 1.05, letter-spacing -0.03em): Section-opening h2.
- **Title** (650, `clamp(20px, 1.9vw, 28px)`, line-height 1.2, letter-spacing -0.02em): h3, step headings, stat keys.
- **Body** (400, `clamp(15px, 1.6vw, 19px)`, line-height 1.65, max width 65–75ch): Long-form copy. Wrapping: `text-wrap: pretty`.
- **Label** (500, 13px, letter-spacing -0.005em): UI labels, meta text, nav links.

### Named Rules

**The Italic Mint Rule.** Italic 500-weight inside a heading, colored Workshop Mint, is the one expressive flourish in the type system. Use it on a single word per heading, never two. Never use italic body text. Never gradient-tint the italic. The rule lives because the move is so recognizable that overuse cheapens it.

**The Eyebrow Ban.** No tiny tracked uppercase eyebrows above section headings ("ABOUT" / "PROCESS" / "PRICING"). That cadence is the saturated AI scaffolding move and is explicitly banned. Section identity comes from the headline copy itself and the anchor bar.

**The Tight-Display Rule.** Display type runs at -0.04em letter-spacing. That floor is intentional — anything tighter cramps; anything looser reads as default. Headlines down to title sit at -0.02 to -0.03. Body stays at 0.

## 4. Elevation

**The system is flat by default. Depth appears only as a response to interaction.** Surfaces sit on the near-black canvas without ambient shadow. Cards hold their place through border, position, and contrast — not through a 24px-blur glow underneath. When depth shows up, it is doing a job: a hover state on a case card, a float panel attached to a process step, a lifted button on press.

This contradicts the current shipping state (which has solid offset shadows on most cards). The overhaul should reduce at-rest shadows and let the work be the depth.

### Shadow Vocabulary
- **Float-only** (`box-shadow: 0 8px 24px rgba(0,0,0,0.5)`): The single legal shadow. Used on step-float panels and only at-rest where the element must read as overlay (not part of the page flow). Anywhere else, no shadow at rest.
- **Press-down** (`transform: translateY(2px)`): The buttons and CTAs do not glow on hover; they fill (slide-in Workshop Mint) and translate slightly. Depth comes from motion, not blur.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows are reserved for floats (true overlay elements) and never used as decorative lift. If a card "needs a shadow to look right at rest," it actually needs a stronger border, better hierarchy, or different surface tone.

**The Border Replaces Shadow Rule.** When a card or component must read as lifted, use `1px solid var(--border)` and let the contrast against `--bg` do the work. The border becomes Workshop Mint on hover; that color change is the lift.

## 5. Components

The component language is **tactile and confident.** Buttons feel pressable, cards feel pickable, chips feel labelable. Hover responses are deliberate physical metaphors — fill-slide, scale-up, border-color shift — not subtle opacity changes. Every shape commits fully to its category: true capsule (999px) or hard square (0). The middle-radius softness (8–12px) is banned by reflex.

### Buttons

**Primary CTA — `cta-btn-primary`**
- **Shape:** True pill, `999px` radius.
- **Default:** `--ink` background, `--bg` text, font weight 600, 15px, padding `18px 28px 18px 32px`.
- **Hover:** Workshop Mint slides up from below via `::before` overlay (`transform: translateY(101%) → 0`, `0.4s ease-out-quart`). SVG arrow translates right `4px`. Text color stays `--bg` throughout.
- **Focus:** Standard `:focus-visible` ring (2px Workshop Mint outline, 3px offset).

**Topbar CTA — `topbar-cta`**
- Smaller variant of Primary CTA. Same shape, same fill-slide hover. Padding `10px 16px 10px 18px`, font size 13. Includes a 6px Workshop Mint dot that scales `1.4×` on hover.

**Inline Link with Arrow — `video-caption-link`**
- Workshop Mint text, weight 500, with a 35%-alpha mint underline (`border-bottom: 1px solid color-mix`). On hover: underline becomes full opacity, arrow translates right, gap widens.

### Chips

**Process Step Chip — `step-chip`**
- **Shape:** True pill, `999px`.
- **Style:** Transparent background, `1px solid var(--border)`, ink-muted text, font weight 500, size 12, padding `6px 12px`.
- **Hover:** Border color shifts toward Workshop Mint, text color brightens to ink-2.

**Case Pill — `case-pill`**
- **Shape:** Hard square, `0` radius. Deliberately not a pill — separates the case context label from the rest of the chip system.
- **Style:** Transparent, `1px solid var(--border)`, ink-3 text, weight 600, size 12, uppercase letter-spacing `0.02em`, padding `6px 14px`.
- **Variant:** `case-pill--green` uses Workshop Mint for the leading icon and text emphasis.

### Cards

**Case Hero — `case-hero`** and **Case Card — `case-card`**
- **Shape:** Hard square, `0` radius. The portfolio shots are presented like prints, not like rounded SaaS cards.
- **Background:** `--surface` with `1px solid var(--border)`.
- **At-rest depth:** None per the Flat-By-Default Rule (the current shipping state has `box-shadow: 0 6px 30px rgba(0,0,0,0.4)`; this should be removed during overhaul).
- **Hover:** Border becomes Workshop Mint. The inner image scales `1.03×` over `0.8s ease-out-quart`.

### Navigation

**Topbar**
- Sticky, slim. Background near-black with `1px solid var(--border-faint)` bottom.
- Brand wordmark (Inter 720, 16px, letter-spacing -0.02em) with a rotated 3px Workshop Mint underline via `::after` — the underline shortens on hover.
- Nav links (Inter 500, 13px, ink-3) with an expanding Workshop Mint 1px under-line on hover.

**Footer**
- Hairline top divider.
- Brand wordmark (Inter 700, 18px) on left, nav row on right (Inter 500, 14px, ink-3 → Workshop Mint on hover).
- Bottom row: copyright + geo line (Shelby, NC anchor) + circular back-to-top button.

### Signature Components

**The Anchor Bar** — 2px × 48px Workshop Mint bar, positioned as `::before` above or `::after` below a section heading. Recurring throughout the system as the section anchor. The single most-repeated brand element after the wordmark itself.

**The Hero Wordmark + Green Strip** — The above-fold treatment. The wordmark sits at clamp(65px, 27vw, 580px) in Inter 750. A 2.6vw-tall Workshop Mint strip rotates `-4°` and crosses the wordmark at the midline, carrying a continuous-loop marquee of label text. This is the most expressive brand moment on the site; do not water it down with a smaller strip or a less-tilted angle.

**The Video Frame Mockup** — Browser-window mockup at `94%` width, `16px` border-radius (the system's only mid-radius use, justified because it mimics a real browser chrome). Three colored window dots, a URL bar, and an animated cursor demonstrating an example flow. Use only for legitimate "see your site" moments.

**The Stat Ledger** — Three-cell grid with `1px solid var(--border)` hairline dividers between cells. Each cell: large numeric (animated count-up), period-ended key phrase ("Websites shipped."), and a detail paragraph below. Replaces the SaaS hero-metric template.

## 6. Do's and Don'ts

### Do:
- **Do** put Workshop Mint (`#34d399`) on the anchor bar, on hover undercurrents, and on the italic word inside a heading. Three places, with intent.
- **Do** commit to one shape per component role: true pill (`999px`) on buttons, hard square (`0`) on cards. Never soft 12px middle.
- **Do** use `clamp()` for every display-and-headline size, with the upper bound capped at 6rem (~96px) except the hero wordmark, which exists outside this rule deliberately.
- **Do** set body text in `--ink-3` (`#a8a8a8`) on `--bg` (`#0f0f10`) — verified ≥4.5:1 — and lean toward `--ink-2` whenever the content rewards it.
- **Do** test every animation under `prefers-reduced-motion: reduce` and provide a crossfade or instant-state fallback.
- **Do** name real towns, real clients, real numbers. Specificity is voice.
- **Do** use the Anchor Bar to pin a section. If a heading has no bar, that quiet is deliberate.

### Don't:
- **Don't** use template SaaS marketing patterns: gradient hero, three identical feature cards, testimonial wall, pricing tables. (From PRODUCT.md anti-references.)
- **Don't** build the generic agency layout: hero-metric template, identical case-card grids, "we craft digital experiences" copy. (From PRODUCT.md anti-references.)
- **Don't** drift into the editorial-typographic AI lane: display serif (Cormorant / Fraunces / Newsreader), small tracked uppercase eyebrows, ruled separators, monochrome restraint. **Banned explicitly** — the first draft of this very file was leaning here.
- **Don't** introduce a second chromatic color. One mint. If "we need a warning red" comes up, the answer is ink ramp + mint at a different alpha.
- **Don't** ship a soft 12px–8px border-radius on a card or button. Pick 0 or 999. The middle is the templated middle.
- **Don't** use `border-left` greater than 1px as a colored stripe — banned in the skill's absolute bans.
- **Don't** use gradient text (`background-clip: text`). Solid color, weight contrast, scale contrast.
- **Don't** use glassmorphism (`backdrop-filter: blur`) as decoration. If you reach for it, find another move.
- **Don't** put tracked uppercase eyebrows above every section. That cadence is the saturated AI scaffold. If a section needs identity, the headline does the work.
- **Don't** add at-rest shadows on cards. Use border contrast and let hover carry depth. (Per the Flat-By-Default Rule.)
- **Don't** rely on light gray text "for elegance." The 4.5:1 floor is non-negotiable; in this system the floor is `--ink-3 #a8a8a8`.
- **Don't** rotate scroll-driven asterisks or other geometric ornaments as section dividers. Bridges between sections come from heading anchors and the wordmark cadence, not decoration.
