# Studio O'Brien — Remotion preview videos

Frame-driven (React) reproductions of the coded `/preview` animation, for
exporting MP4/WebM to use in ads and on social. The **in-page** animation on the
site is the coded one in `/preview` — these videos are the *secondary*, exportable
version. They're rendered at 2× the largest on-page size so they never pixelate.

| Composition     | Size        | Aspect  | Matches            | Cursor |
| --------------- | ----------- | ------- | ------------------ | ------ |
| `DesktopPreview`| 3420 × 1800 | 19:10   | `.v5-screen`       | yes    |
| `MobilePreview` | 540 × 1170  | 9:19.5  | `.v5-phone-screen` | no     |

## Setup

```bash
cd remotion
npm install          # pulls Remotion + a headless Chromium (~a few hundred MB)
```

## Preview / tune in the browser

```bash
npm run studio       # opens Remotion Studio; scrub the timeline, nudge beats
```

## Render

```bash
npm run render:desktop   # -> out/preview-desktop.mp4 (h264, CRF 18)
npm run render:mobile    # -> out/preview-mobile.mp4
npm run render:all       # both
# WebM variants (smaller, alpha-capable): render:desktop-webm / render:mobile-webm
# Poster stills: still:desktop / still:mobile -> out/*.png
```

## Notes

- The choreography beats (scroll → click → section change → drag highlight, and
  the mobile scroll → tap → load → tap → back-slide) mirror the CSS keyframes in
  [`../preview/preview.css`](../preview/preview.css). Timings are the same
  fractions of the loop, so edits can be kept in sync by hand.
- Framing constants (page scroll distance, card/marquee positions) are easy to
  nudge live in `npm run studio` — that's the fastest way to fine-tune.
- Licensing: Remotion is free for individuals and small teams; a company license
  is required past a size threshold. A one-person studio is within the free tier —
  see remotion.dev/license.
