import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, CLAMP } from './theme';

/**
 * Mobile website-preview (9:19.5) — NO cursor.
 * Timeline (p = frame/duration): 0-8 home top · 8-26 scroll home · 26-33 tap ·
 * 33-43 detail slides in + loads · 43-52 shimmer→content · 52-64 scroll detail ·
 * 64-70 tap (loop) · 70-82 back-slide · 82-100 settle. Mirrors /preview/preview.css.
 * Dark UI to match the phone-in-frame look on the site.
 */
const M = { paper: '#0f1116', ink: '#f4f6fa', muted: '#3a4150', line: '#232734', card: '#171a22' };

const Line: React.FC<{ w: string; mt?: number }> = ({ w, mt = 0 }) => (
  <div style={{ width: w, height: 14, borderRadius: 4, background: M.muted, marginTop: mt }} />
);

export const MobilePreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, height: H } = useVideoConfig();
  const p = frame / durationInFrames;
  const vp = H * 0.92; // viewport below the 8% topbar

  const homeScroll = interpolate(p, [0, 0.08, 0.26, 0.82, 0.94, 1], [0, 0, -vp * 0.4, -vp * 0.4, 0, 0], CLAMP);
  const homeX = interpolate(p, [0, 0.33, 0.43, 0.7, 0.82, 1], [0, 0, -14, -14, 0, 0], CLAMP);
  const homeDim = interpolate(p, [0.33, 0.43, 0.7, 0.82], [1, 0.62, 0.62, 1], CLAMP);
  const detailX = interpolate(p, [0, 0.33, 0.43, 0.7, 0.82, 1], [100, 100, 0, 0, 100, 100], CLAMP);
  const shimmerO = interpolate(p, [0, 0.43, 0.52, 1], [1, 1, 0, 0], CLAMP);
  const spin = (frame % 24) / 24 * 360;

  const tapA = interpolate(p, [0.26, 0.28, 0.33], [0, 0.9, 0], CLAMP);
  const tapAS = interpolate(p, [0.26, 0.28, 0.33], [0.3, 0.6, 1.6], CLAMP);
  const tapB = interpolate(p, [0.62, 0.66, 0.72], [0, 0.9, 0], CLAMP);
  const tapBS = interpolate(p, [0.62, 0.66, 0.72], [0.3, 0.6, 1.6], CLAMP);

  return (
    <AbsoluteFill style={{ background: M.paper, fontFamily: FONT, overflow: 'hidden' }}>
      {/* topbar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8%', background: M.card, borderBottom: `1px solid ${M.line}`, display: 'flex', alignItems: 'center', padding: '0 6%', zIndex: 4 }}>
        <div style={{ width: '34%', height: '38%', borderRadius: 5, background: `linear-gradient(90deg,${C.mint},${C.accent})` }} />
      </div>

      <div style={{ position: 'absolute', top: '8%', left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        {/* HOME */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${homeX}%) scale(${homeDim === 1 ? 1 : 0.97})`, filter: `brightness(${homeDim})`, background: M.paper }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '210%', padding: '7% 6%', transform: `translateY(${homeScroll}px)` }}>
            <div style={{ height: '26%', borderRadius: 16, background: `linear-gradient(140deg,${C.mint},${C.accent})`, marginBottom: '7%' }} />
            <div style={{ display: 'flex', gap: '5%', marginBottom: '6%' }}>
              <div style={{ flex: 1, aspectRatio: '1 / 1', borderRadius: 14, background: M.card, border: `1px solid ${M.line}` }} />
              <div style={{ flex: 1, aspectRatio: '1 / 1', borderRadius: 14, background: M.card, border: `1px solid ${M.line}` }} />
            </div>
            <Line w="100%" /><Line w="64%" mt={16} />
            <div style={{ height: '22%', borderRadius: 16, background: M.card, border: `1px solid ${M.line}`, margin: '7% 0' }} />
            <Line w="100%" /><Line w="64%" mt={16} />
            <div style={{ height: '22%', borderRadius: 16, background: M.card, border: `1px solid ${M.line}`, margin: '7% 0' }} />
          </div>
        </div>

        {/* DETAIL (slides in from right) */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${detailX}%)`, background: M.paper, boxShadow: '-18px 0 40px -20px rgba(0,0,0,.7)' }}>
          <div style={{ height: '30%', background: `linear-gradient(160deg,${C.accent},${C.mint})` }} />
          <div style={{ position: 'absolute', top: '3%', left: '6%', width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.14)', zIndex: 3 }} />
          <div style={{ padding: '7% 6%' }}>
            <Line w="80%" /><Line w="55%" mt={18} /><Line w="90%" mt={18} /><Line w="48%" mt={18} />
          </div>
          {/* loading shimmer + spinner */}
          <div style={{ position: 'absolute', inset: 0, background: M.paper, opacity: shimmerO, zIndex: 4 }}>
            <div style={{ position: 'absolute', top: '44%', left: '50%', width: '14%', aspectRatio: '1 / 1', marginLeft: '-7%', border: `3px solid ${M.line}`, borderTopColor: C.mint, borderRadius: '50%', transform: `rotate(${spin}deg)` }} />
          </div>
        </div>

        {/* tap ripples (no cursor) */}
        <div style={{ position: 'absolute', left: '34%', top: '50%', width: '20%', aspectRatio: '1 / 1', marginLeft: '-10%', marginTop: '-10%', border: `3px solid ${C.mint}`, borderRadius: '50%', transform: `scale(${tapAS})`, opacity: tapA, zIndex: 7 }} />
        <div style={{ position: 'absolute', left: '50%', top: '58%', width: '20%', aspectRatio: '1 / 1', marginLeft: '-10%', marginTop: '-10%', border: `3px solid ${C.mint}`, borderRadius: '50%', transform: `scale(${tapBS})`, opacity: tapB, zIndex: 7 }} />
      </div>
    </AbsoluteFill>
  );
};
