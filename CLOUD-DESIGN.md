# Studio O'Brien on Cloud Design

Studio O'Brien's design system — **"The Loud Workshop"** — is synced to Claude's
cloud design tool at **claude.ai/design**. This doc is the reusable reference: what's up
there, what you can build with it, and how to update it.

- **Project:** Studio Obrien Design System
- **URL:** https://claude.ai/design/p/6b5d7cbc-8895-464b-ac49-f97c3bc50f30
- **Type:** tokens + guidelines (design language, not a component library)
- **Synced:** 2026-07-20 (replaced the earlier hand-built component kit)

## What's uploaded

A **tokens + guidelines** system — the design language as machine-readable tokens plus
the rules for using them. It does *not* ship pre-built React components; the design
agent assembles new UI and styles it on-brand from these tokens.

| File (in the project) | What it is |
|---|---|
| `styles.css` | Entry point every design loads — imports the tokens + fonts |
| `tokens/tokens.css` | Every token as a CSS custom property: color, type, spacing, shape, elevation |
| `fonts/` | Self-hosted Inter (400/700) + Inter Tight (700) `.woff2` |
| `guidelines/loud-workshop.md` | The brand playbook — the 5 rules, type scale, component patterns, do/don't |
| `README.md` | Conventions header the design agent reads first |
| `_ds_bundle.js` | Empty bundle stub (tokens-only systems have no component exports) |

Local source of these files: `ds-bundle/` (gitignored build output). Design spec:
[`DESIGN.md`](DESIGN.md). Live implementation: [`index.css`](index.css) + [`fonts.css`](fonts.css).

## What you can do with it on cloud design

Open the project and prompt the design agent — every design it produces comes out in
the Studio O'Brien look automatically. Things it's set up to build well:

- **New landing / service / location pages** in the near-black + Workshop Mint system,
  correct type scale, correct shape rules (pill vs. hard square).
- **Section blocks** using the signature moves: hero wordmark, anchor bar, stat ledger,
  case cards, pressable CTAs, chips.
- **Marketing comps for clients** that inherit Studio O'Brien's house style — a fast way
  to mock a pitch before hand-building it in this repo.
- **On-brand variations** — the agent won't drift into generic SaaS/agency templates
  because the guidelines explicitly ban them.

Good prompt shape: *"A services page hero for a Shelby HVAC company — Loud Workshop
style, anchor bar, one italic-mint word in the headline, a pill CTA."* The agent already
knows the tokens and rules; you steer the content.

## The design language in one screen

- **Color:** near-black canvas (`#0f0f10`) + **one** accent, Workshop Mint (`#34d399`).
  No second hue, ever.
- **Type:** Inter Variable, big and clamped. Hero wordmark up to 580px, one per page.
  Italic-mint word = the one flourish.
- **Shape:** true pill (999px) or hard square (0). Never the soft 8–12px middle.
- **Elevation:** flat at rest; lift comes from a border that turns mint on hover.
- **Signature:** the 2px × 48px mint anchor bar that pins section headings.

Full detail lives in `guidelines/loud-workshop.md` (in the project) and [`DESIGN.md`](DESIGN.md).

## How to update what's on cloud design

The bundle is hand-produced (this repo has no component build), so updates are manual.
Full mechanics are in `.design-sync/NOTES.md`. Short version:

1. Change the design → update `ds-bundle/tokens/tokens.css` and
   `ds-bundle/guidelines/loud-workshop.md` to match `DESIGN.md`.
2. Re-upload to the pinned project (`.design-sync/config.json` has the project id):
   sentinel `_ds_needs_recompile` first → content writes → deletes → sentinel re-arm.
3. `DesignSync(list_files)` to confirm the project matches the build.

`ds-bundle/` is gitignored; if it's missing on a fresh clone, rebuild it from `DESIGN.md`
per `.design-sync/NOTES.md` before re-uploading.

## Growing this later

If Studio O'Brien ever gets a real React component library, it can be synced as a **full
component design system** instead of tokens-only — then the cloud design agent builds
with actual Studio O'Brien components (Hero, CTA, StatLedger, CaseCard…) rather than
assembling them from tokens each time. That's the natural next upgrade; it's a bigger
build (compile + type contracts + preview cards) and out of scope for the current
tokens-only sync.
