// Shared palette — mirrors the tokens in /preview/preview.css so the exported
// video matches the coded in-page animation.
export const C = {
  paper: '#f6f7f9',
  ink: '#12141a',
  muted: '#c7ccd6',
  line: '#e6e9ef',
  card: '#ffffff',
  mint: '#12b981',
  mintSoft: '#d3f4e6',
  accent: '#5b7cfa',
};

export const FONT =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// interpolate helper default (clamp both ends)
export const CLAMP = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};
