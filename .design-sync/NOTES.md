# design-sync notes — Studio O'Brien

## Shape: tokens-only (hand-produced, no converter)

This repo is a static HTML site, **not** a React component library, so the standard
`/design-sync` converter (esbuild/ts-morph/playwright) does not apply. The upload is a
hand-produced **tokens-only** bundle: an empty-bodied `_ds_bundle.js` plus
`styles.css` → `tokens/` + `fonts/` closure, `guidelines/`, and `README.md`.

- **Project:** `Studio Obrien Design System` — `6b5d7cbc-8895-464b-ac49-f97c3bc50f30`
  (pinned in config.json). Type PROJECT_TYPE_DESIGN_SYSTEM.
- **2026-07-20:** replaced the project's earlier hand-built component kit
  (`ui_kits/studio-obrien-website/*`, `preview/*`, `assets/photos/*`,
  `colors_and_type.css`, `SKILL.md`) with this tokens-only system, per Jarred's
  explicit "replace the existing one" call. The old kit is GONE from the project.

## Source of truth for the tokens

`DESIGN.md` (frontmatter + prose) is the design-system spec; `index.css` + `fonts.css`
are the live implementation. `ds-bundle/tokens/tokens.css` is derived by hand from
these. If DESIGN.md changes, update `tokens/tokens.css` and `guidelines/loud-workshop.md`
to match, then re-upload.

## How to re-sync (by hand — there is no converter run)

1. Edit files under `ds-bundle/` (gitignored build output; rebuild if missing — see
   CLOUD-DESIGN.md for the exact file contents / structure).
2. `DesignSync(finalize_plan)` on the pinned projectId, `localDir: ./ds-bundle`,
   writes = the produced files, deletes = whatever's stale.
3. Upload order: sentinel `_ds_needs_recompile` first → content writes → deletes →
   sentinel re-arm last. (Tokens-only omits `_ds_sync.json`; next sync just re-verifies.)
4. `list_files` to confirm the project matches the build.

## Re-sync risks / watch-list

- `ds-bundle/` is **gitignored**, so a fresh clone has no build output — it must be
  re-created by hand from DESIGN.md before re-uploading. CLOUD-DESIGN.md documents the
  layout so this is reproducible.
- No `_ds_sync.json` anchor is uploaded, so every re-sync re-uploads in full (fine —
  the bundle is tiny). Not a bug.
- Fonts: only Inter 400/700 + Inter Tight 700 are shipped (matches fonts.css). If the
  site adds weights, copy the new `.woff2` into `ds-bundle/fonts/` and add `@font-face`
  rules to `fonts/fonts.css`.
