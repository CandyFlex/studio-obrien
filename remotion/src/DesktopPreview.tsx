import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, CLAMP } from './theme';

/**
 * Desktop website-preview (19:10) WITH cursor.
 * Timeline (p = frame/duration): 0-6 rest · 6-28 scroll to cards · 28-84 HELD ·
 * 28-38 move to middle card · 38-42 click · 42-52 section swaps · 54-66 drag the
 * highlight box open · 66-86 hold · 86-90 fade · 90-100 scroll back.
 * The highlight box is a CHILD of the target card, so it always wraps the
 * section that actually changed. Mirrors /preview/preview.css.
 */
const Bar: React.FC<{ w: string; h: number; c?: string; mt?: number }> = ({ w, h, c = C.muted, mt = 0 }) => (
  <div style={{ width: w, height: h, background: c, borderRadius: 4, marginTop: mt }} />
);

const Card: React.FC<{ accent?: boolean }> = ({ accent }) => (
  <div style={{ flex: 1, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: '2.4%', boxShadow: '0 18px 50px -34px rgba(20,25,40,.5)' }}>
    <div style={{ width: '100%', height: 120, borderRadius: 10, marginBottom: 26, background: accent ? `linear-gradient(120deg,${C.mint},${C.accent})` : C.line }} />
    <Bar w="100%" h={14} c={accent ? C.mintSoft : C.muted} />
    <Bar w="62%" h={14} c={accent ? C.mintSoft : C.muted} mt={16} />
  </div>
);

export const DesktopPreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, height: H } = useVideoConfig();
  const p = frame / durationInFrames;

  const scroll = interpolate(p, [0, 0.06, 0.28, 0.84, 0.9, 1], [0, 0, -H * 0.14, -H * 0.14, 0, 0], CLAMP);
  const curX = interpolate(p, [0, 0.06, 0.28, 0.38, 0.42, 0.52, 0.55, 0.66, 0.82, 0.92, 1], [60, 60, 55, 50, 50, 50, 37, 63, 63, 60, 60], CLAMP);
  const curY = interpolate(p, [0, 0.06, 0.28, 0.38, 0.42, 0.52, 0.55, 0.66, 0.82, 0.92, 1], [24, 24, 45, 49, 49, 49, 28, 70, 70, 35, 35], CLAMP);
  const clickS = interpolate(p, [0.39, 0.4, 0.44, 1], [0, 0.2, 2.4, 2.4], CLAMP);
  const clickO = interpolate(p, [0.39, 0.4, 0.44, 1], [0, 0.9, 0, 0], CLAMP);
  const afterO = interpolate(p, [0.44, 0.47, 0.88, 0.9], [0, 1, 1, 0], CLAMP);
  const badgeO = interpolate(p, [0.45, 0.5, 0.86, 0.9], [0, 1, 1, 0], CLAMP);
  // marquee wipes open from top-left via clip-path inset
  const mqProg = interpolate(p, [0.54, 0.55, 0.66, 0.9], [0, 0, 1, 1], CLAMP);
  const mqInset = (1 - mqProg) * 100;
  const mqO = interpolate(p, [0.54, 0.55, 0.88, 0.92], [0, 1, 1, 0], CLAMP);
  const mqLabelO = interpolate(p, [0.66, 0.7, 0.86, 0.9], [0, 1, 1, 0], CLAMP);

  const handle = (pos: React.CSSProperties): React.CSSProperties => ({ position: 'absolute', width: 12, height: 12, background: '#fff', border: `3px solid ${C.mint}`, borderRadius: 2, ...pos });

  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT, overflow: 'hidden' }}>
      {/* topbar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '9%', background: C.card, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: '2%', padding: '0 4%', zIndex: 4 }}>
        <div style={{ width: '14%', height: '34%', borderRadius: 8, background: `linear-gradient(90deg,${C.mint},${C.accent})` }} />
        <div style={{ flex: 1 }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ width: '6%', height: '24%', background: C.muted, borderRadius: 5 }} />)}
        <div style={{ width: '11%', height: '44%', background: C.mint, borderRadius: 10, marginLeft: '1.5%' }} />
      </div>

      {/* scrolling page */}
      <div style={{ position: 'absolute', top: '9%', left: 0, right: 0, height: H * 2.4, transform: `translateY(${scroll}px)`, willChange: 'transform' }}>
        {/* hero */}
        <div style={{ padding: '6% 8% 3%' }}>
          <Bar w="20%" h={16} c={C.mint} />
          <Bar w="74%" h={40} c={C.ink} mt={26} />
          <Bar w="52%" h={40} c={C.ink} mt={16} />
          <Bar w="60%" h={16} mt={40} />
          <Bar w="46%" h={16} mt={16} />
          <div style={{ display: 'flex', gap: 22, marginTop: 44 }}>
            <div style={{ width: '20%', height: 52, borderRadius: 12, background: C.mint }} />
            <div style={{ width: '16%', height: 52, borderRadius: 12, background: C.card, border: `1px solid ${C.line}` }} />
          </div>
        </div>
        {/* card row (middle = target) */}
        <div style={{ display: 'flex', gap: '3.5%', padding: '2% 8% 6%' }}>
          <Card />
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0 }}><Card /></div>
            <div style={{ position: 'absolute', inset: 0, opacity: afterO }}><Card accent /></div>
            <div style={{ position: 'absolute', top: 14, right: 14, padding: '4px 12px', borderRadius: 20, fontSize: 15, fontWeight: 700, color: '#fff', background: C.mint, opacity: badgeO }}>Updated</div>
            {/* highlight marquee — anchored to this card */}
            <div style={{ position: 'absolute', inset: -5, border: `3px solid ${C.mint}`, borderRadius: 20, background: 'rgba(18,185,129,.10)', opacity: mqO, clipPath: `inset(0 ${mqInset}% ${mqInset}% 0)` }}>
              <span style={handle({ top: -6, left: -6 })} />
              <span style={handle({ top: -6, right: -6 })} />
              <span style={handle({ bottom: -6, left: -6 })} />
              <span style={handle({ bottom: -6, right: -6 })} />
            </div>
            <div style={{ position: 'absolute', top: -34, left: -5, fontSize: 15, fontWeight: 700, color: '#fff', background: C.mint, padding: '3px 10px', borderRadius: 6, whiteSpace: 'nowrap', opacity: mqLabelO }}>Section · Featured</div>
          </div>
          <Card />
        </div>
        {/* band */}
        <div style={{ margin: '0 8% 8%', height: '18%', background: `linear-gradient(120deg,#0e1f17,${C.ink})`, borderRadius: 20, display: 'flex', alignItems: 'center', gap: '6%', padding: '0 6%' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <Bar w="70%" h={16} c="rgba(255,255,255,.22)" />
            <Bar w="52%" h={16} c="rgba(255,255,255,.22)" />
            <Bar w="40%" h={16} c="rgba(255,255,255,.22)" />
          </div>
          <div style={{ width: '34%', aspectRatio: '16 / 10', borderRadius: 12, background: `linear-gradient(135deg,${C.mint},transparent 70%),#1c2230` }} />
        </div>
      </div>

      {/* cursor + click ripple */}
      <div style={{ position: 'absolute', left: `${curX}%`, top: `${curY}%`, zIndex: 8, filter: 'drop-shadow(0 3px 5px rgba(0,0,0,.4))' }}>
        <div style={{ position: 'absolute', left: 6, top: 6, width: `${18 * clickS}px`, height: `${18 * clickS}px`, marginLeft: `-${9 * clickS}px`, marginTop: `-${9 * clickS}px`, border: `3px solid ${C.mint}`, borderRadius: '50%', opacity: clickO }} />
        <svg width="38" height="38" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 3l14 8.5-6 1.4 3.4 6.2-2.6 1.4-3.4-6.3L5 20V3z" fill="#fff" stroke={C.ink} strokeWidth={1.1} strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
