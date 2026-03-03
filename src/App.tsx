import { useRef, useEffect, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";

/* ─── DESIGN TOKENS ─── */
const F = {
  display: "'Cinzel Decorative', serif",
  heading: "'Cinzel', serif",
  body: "'Cormorant Garamond', serif",
};

const C = {
  forest: "#1a3a2a",
  deepForest: "#0d2818",
  emerald: "#2d5a3d",
  sage: "#4a7c59",
  leaf: "#3d6b4f",
  gold: "#c9a84c",
  brightGold: "#d4af37",
  paleGold: "#e8d48b",
  parchment: "#f5f0e1",
  ivory: "#faf7ef",
  darkBark: "#0a1f14",
  moss: "#5a7d5a",
};

/* ─── SERVICE EMBLEM SVGs — medieval themed line art ─── */
const SVG = { w: "24", h: "24", vb: "0 0 24 24", sw: "1.4" } as const;

/* Website Design & Build — Castle gatehouse with portcullis */
function EmblemTower({ color }: { color: string }) {
  return (
    <svg width={SVG.w} height={SVG.h} viewBox={SVG.vb} fill="none" stroke={color} strokeWidth={SVG.sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Left tower */}
      <path d="M3 22V8h4v14" />
      <path d="M3 8h1v-1h1v1h1" />
      {/* Right tower */}
      <path d="M17 22V8h4v14" />
      <path d="M17 8h1v-1h1v1h1" />
      {/* Connecting wall */}
      <path d="M7 22V11h10v11" />
      {/* Central arch gate */}
      <path d="M9 22v-5a3 3 0 0 1 6 0v5" />
      {/* Portcullis grid */}
      <path d="M10 17v5" opacity="0.35" />
      <path d="M12 17v5" opacity="0.35" />
      <path d="M14 17v5" opacity="0.35" />
      <path d="M9 19h6" opacity="0.3" />
      <path d="M9 21h6" opacity="0.3" />
      {/* Pennant on left tower */}
      <path d="M5 8V4" />
      <path d="M5 4l3 1.5L5 7" fill={color} opacity="0.15" />
      <path d="M5 4l3 1.5L5 7" />
      {/* Window on wall */}
      <circle cx="12" cy="13.5" r="0.8" fill={color} opacity="0.2" />
    </svg>
  );
}

/* Landing Pages — Drawbridge with chains */
function EmblemScroll({ color }: { color: string }) {
  return (
    <svg width={SVG.w} height={SVG.h} viewBox={SVG.vb} fill="none" stroke={color} strokeWidth={SVG.sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Castle wall top */}
      <path d="M2 2h20" />
      <path d="M2 2v8" />
      <path d="M22 2v8" />
      {/* Battlements */}
      <path d="M2 2h2v1.5h2V2h2v1.5h2V2h2v1.5h2V2h2v1.5h2V2h2" />
      {/* Gate arch */}
      <path d="M6 10v-2a6 6 0 0 1 12 0v2" />
      {/* Drawbridge — lowered at angle */}
      <path d="M6 10l6 10h0l6-10" />
      <path d="M6 10h12" />
      {/* Planks on bridge */}
      <path d="M8.5 13.5l7-3.5" opacity="0.25" />
      <path d="M10 16l5-6" opacity="0.2" />
      {/* Chains */}
      <path d="M6 10l-2-4" strokeDasharray="1.5 1" />
      <path d="M18 10l2-4" strokeDasharray="1.5 1" />
      {/* Water line */}
      <path d="M1 22c2-1 4 1 6 0s4 1 6 0 4 1 6 0 4 1 5 0" opacity="0.25" />
    </svg>
  );
}

/* AI Chatbots — Enchanted mirror */
function EmblemBrain({ color }: { color: string }) {
  return (
    <svg width={SVG.w} height={SVG.h} viewBox={SVG.vb} fill="none" stroke={color} strokeWidth={SVG.sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Ornate mirror frame — shield shape */}
      <path d="M12 2C8 2 4 5 4 10c0 4 3 8 8 11 5-3 8-7 8-11 0-5-4-8-8-8z" />
      {/* Inner mirror surface */}
      <path d="M12 4.5c-3 0-5.5 2.5-5.5 5.5 0 3 2.5 6 5.5 8 3-2 5.5-5 5.5-8 0-3-2.5-5.5-5.5-5.5z" />
      {/* Reflection gleam */}
      <path d="M9 7c1-1 2-1.5 3.5-1.5" opacity="0.3" />
      {/* Face in mirror — simplified mystical features */}
      <circle cx="10.5" cy="10" r="0.6" fill={color} opacity="0.3" />
      <circle cx="13.5" cy="10" r="0.6" fill={color} opacity="0.3" />
      <path d="M10.5 12.5c.5.5 1 .8 1.5.8s1-.3 1.5-.8" opacity="0.3" />
      {/* Magic sparkles */}
      <path d="M4 4l1 1" opacity="0.25" />
      <path d="M20 4l-1 1" opacity="0.25" />
      <circle cx="3" cy="7" r="0.4" fill={color} opacity="0.2" />
      <circle cx="21" cy="7" r="0.4" fill={color} opacity="0.2" />
      <path d="M12 1v1" opacity="0.3" />
    </svg>
  );
}

/* AI Content Creation — Self-writing enchanted quill */
function EmblemQuill({ color }: { color: string }) {
  return (
    <svg width={SVG.w} height={SVG.h} viewBox={SVG.vb} fill="none" stroke={color} strokeWidth={SVG.sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Quill feather — full plume */}
      <path d="M19.5 1.5c-2 1.5-4 4-5.5 7l-1 2.5" />
      <path d="M19.5 1.5c-1 2.5-2.5 5-5 7" />
      <path d="M19.5 1.5c-.5 2-1 3.5-2 5" />
      {/* Feather barbs */}
      <path d="M17 4.5c-1 0-2 .5-2.5 1.5" opacity="0.25" />
      <path d="M16 6.5c-1 .2-1.8 1-2 2" opacity="0.2" />
      {/* Shaft to nib */}
      <path d="M13 11l-5.5 9" />
      {/* Nib point */}
      <path d="M13 11l-1.5.8.3 1.5" />
      {/* Parchment beneath — floating */}
      <path d="M2 17h12" opacity="0.2" />
      <path d="M3 19h10" opacity="0.15" />
      <path d="M4 21h8" opacity="0.1" />
      {/* Ink trail being written */}
      <path d="M4 17c1.5 0 3-.5 4.5-1" opacity="0.35" />
      {/* Magic sparkles around quill */}
      <circle cx="16.5" cy="3" r="0.5" fill={color} opacity="0.25" />
      <circle cx="20.5" cy="3.5" r="0.4" fill={color} opacity="0.2" />
      <circle cx="18" cy="6" r="0.35" fill={color} opacity="0.15" />
    </svg>
  );
}

/* SEO & Search — Watchtower with beacon fire */
function EmblemLens({ color }: { color: string }) {
  return (
    <svg width={SVG.w} height={SVG.h} viewBox={SVG.vb} fill="none" stroke={color} strokeWidth={SVG.sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Tower base — tapers up */}
      <path d="M8 22l1-12" />
      <path d="M16 22l-1-12" />
      {/* Foundation */}
      <path d="M6 22h12" />
      {/* Platform / lookout */}
      <path d="M7 10h10" />
      <path d="M8 10v-2h8v2" />
      {/* Crenellations */}
      <path d="M8 8h1.5v-1H11v1h2v-1h1.5v1H16" />
      {/* Beacon brazier */}
      <path d="M10 7h4" />
      <path d="M10.5 7v-1h3v1" />
      {/* Flame */}
      <path d="M12 6c-.8-1.5-.5-2.5 0-3.5.5 1 1.2 1.5.5 3.5" />
      <path d="M12 4c.3-.8.8-1 1-1.5" opacity="0.4" />
      {/* Light rays from beacon */}
      <path d="M8 4l-3-2" opacity="0.2" />
      <path d="M16 4l3-2" opacity="0.2" />
      <path d="M6.5 6H4" opacity="0.15" />
      <path d="M17.5 6H20" opacity="0.15" />
      {/* Window slit */}
      <path d="M12 13v3" opacity="0.35" />
      {/* Door */}
      <path d="M11 22v-2h2v2" opacity="0.3" />
    </svg>
  );
}

/* Paid Advertising — Trebuchet siege engine */
function EmblemCompass({ color }: { color: string }) {
  return (
    <svg width={SVG.w} height={SVG.h} viewBox={SVG.vb} fill="none" stroke={color} strokeWidth={SVG.sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Base frame */}
      <path d="M3 22h18" />
      <path d="M5 22l3-8" />
      <path d="M19 22l-3-8" />
      {/* Crossbar */}
      <path d="M8 14h8" />
      {/* Pivot post */}
      <path d="M12 14v-2" />
      {/* Throwing arm — cocked back */}
      <path d="M6 8l6 4" />
      <path d="M12 12l5-6" />
      {/* Counterweight */}
      <path d="M5 8h2v2H5z" fill={color} opacity="0.15" />
      <path d="M5 8h2v2H5z" />
      {/* Sling */}
      <path d="M17 6c1-1 1.5-2 2-3.5" />
      {/* Projectile */}
      <circle cx="19.5" cy="2" r="1" />
      {/* Arc trajectory */}
      <path d="M19.5 3c-1 2-3 3.5-5 4" strokeDasharray="1 1.5" opacity="0.25" />
      {/* Wheel */}
      <circle cx="8" cy="20" r="1.5" />
      <circle cx="16" cy="20" r="1.5" />
    </svg>
  );
}

/* Content Strategy — War table with battle map */
function EmblemBook({ color }: { color: string }) {
  return (
    <svg width={SVG.w} height={SVG.h} viewBox={SVG.vb} fill="none" stroke={color} strokeWidth={SVG.sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Table surface — angled perspective */}
      <path d="M2 8l10-4 10 4-10 4z" />
      {/* Table legs */}
      <path d="M2 8v3" />
      <path d="M22 8v3" />
      <path d="M12 12v3" />
      {/* Map terrain lines on table */}
      <path d="M7 7l3 1.5" opacity="0.3" />
      <path d="M14 6.5c1 .5 2 1 3.5 1" opacity="0.25" />
      <path d="M9 9l5-1" opacity="0.2" />
      {/* Banner flag markers */}
      <path d="M8 6V3" />
      <path d="M8 3l2.5 1L8 5" fill={color} opacity="0.2" />
      <path d="M8 3l2.5 1L8 5" />
      <path d="M16 5.5V2.5" />
      <path d="M16 2.5l2 .8-2 .8" fill={color} opacity="0.15" />
      <path d="M16 2.5l2 .8-2 .8" />
      {/* Sword laid on table */}
      <path d="M5 10l8-2" opacity="0.3" />
      <path d="M5 10l-.5.5" opacity="0.3" />
      {/* Table edge detail */}
      <path d="M2 11l10 4 10-4" opacity="0.15" />
      {/* Chess-like piece markers */}
      <circle cx="10" cy="7" r="0.6" fill={color} opacity="0.25" />
      <circle cx="15" cy="6" r="0.6" fill={color} opacity="0.2" />
    </svg>
  );
}

/* Workflow Automation — Watermill */
function EmblemGears({ color }: { color: string }) {
  return (
    <svg width={SVG.w} height={SVG.h} viewBox={SVG.vb} fill="none" stroke={color} strokeWidth={SVG.sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Mill building */}
      <path d="M11 10h9v12H11z" />
      {/* Roof */}
      <path d="M10 10l5-4 5 4" />
      {/* Door */}
      <path d="M17 22v-4h2v4" opacity="0.35" />
      {/* Window */}
      <rect x="13" y="12" width="2.5" height="2.5" rx="0.3" opacity="0.35" />
      {/* Waterwheel — large circle on left side */}
      <circle cx="8" cy="16" r="5.5" />
      <circle cx="8" cy="16" r="1" fill={color} opacity="0.2" />
      {/* Wheel spokes */}
      <path d="M8 10.5v3.5" />
      <path d="M8 18.5v2.5" />
      <path d="M2.5 16h3.5" />
      <path d="M9.5 16h3" />
      <path d="M4.1 12.1l2.5 2.5" opacity="0.5" />
      <path d="M9.4 17.4l2.5 2.5" opacity="0.5" />
      <path d="M4.1 19.9l2.5-2.5" opacity="0.5" />
      <path d="M9.4 14.6l2.5-2.5" opacity="0.5" />
      {/* Water flow */}
      <path d="M1 22c1.5-1 3 0 4.5-1s3 0 4.5-1" opacity="0.2" />
      {/* Paddle detail */}
      <path d="M3.5 12.5l-1-1.5" opacity="0.3" />
      <path d="M13 19.5l1 1.5" opacity="0.3" />
    </svg>
  );
}

/* Analytics & Insights — Astrolabe */
function EmblemCrystal({ color }: { color: string }) {
  return (
    <svg width={SVG.w} height={SVG.h} viewBox={SVG.vb} fill="none" stroke={color} strokeWidth={SVG.sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Suspension ring */}
      <circle cx="12" cy="3" r="1.5" />
      {/* Mater — outer ring */}
      <circle cx="12" cy="13" r="8.5" />
      <circle cx="12" cy="13" r="7" />
      {/* Degree ticks on limb */}
      <path d="M12 4.5v1.5" />
      <path d="M12 20v1.5" />
      <path d="M3.5 13h1.5" />
      <path d="M19 13h1.5" />
      <path d="M5.8 7l1 1" opacity="0.4" />
      <path d="M17.2 18l1 1" opacity="0.4" />
      <path d="M5.8 19l1-1" opacity="0.4" />
      <path d="M17.2 8l1-1" opacity="0.4" />
      {/* Rete — star pointer pattern */}
      <path d="M8 10l4 3 4-3" opacity="0.4" />
      <path d="M8 16l4-3 4 3" opacity="0.4" />
      {/* Rule / pointer arm */}
      <path d="M5 13h14" opacity="0.25" />
      {/* Center pin */}
      <circle cx="12" cy="13" r="1" fill={color} opacity="0.2" />
      {/* Star markers */}
      <circle cx="9" cy="10" r="0.5" fill={color} opacity="0.3" />
      <circle cx="15.5" cy="11" r="0.5" fill={color} opacity="0.25" />
      <circle cx="14" cy="16" r="0.5" fill={color} opacity="0.2" />
      <circle cx="8.5" cy="15" r="0.4" fill={color} opacity="0.15" />
    </svg>
  );
}

/* ─── INLINE KEYFRAMES ─── */
const STYLE_ID = "hidden-garden-kf";
const css = `
@keyframes hg-float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(3deg)}}
@keyframes hg-shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes hg-pulse{0%,100%{opacity:0.4}50%{opacity:1}}
@keyframes hg-sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@keyframes hg-scroll-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
@keyframes hg-grain{0%,100%{background-position:0 0}10%{background-position:-5% -10%}20%{background-position:-15% 5%}30%{background-position:7% -25%}40%{background-position:-5% 25%}50%{background-position:-15% 10%}60%{background-position:15% 0%}70%{background-position:0% 15%}80%{background-position:3% 35%}90%{background-position:-10% 10%}}
@keyframes hg-btn-shimmer{0%{left:-100%}100%{left:200%}}
@keyframes hg-btn-glow-pulse{0%,100%{box-shadow:0 0 8px rgba(201,168,76,0.2),0 0 20px rgba(201,168,76,0.1)}50%{box-shadow:0 0 20px rgba(201,168,76,0.5),0 0 50px rgba(201,168,76,0.25)}}
@keyframes hg-border-draw{0%{clip-path:inset(0 100% 0 0)}100%{clip-path:inset(0 0% 0 0)}}
@keyframes hg-track-up{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}
@keyframes hg-track-down{0%{transform:translateY(-50%)}100%{transform:translateY(0)}}
.craft-track:hover .craft-track-inner{animation-play-state:paused}
`;

function injectStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID))
    return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = css;
  document.head.appendChild(s);
}

/* ─── SVG LEAF PATTERN (data URI) ─── */
const leafSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><path d='M40 10c-8 12-20 20-20 30s12 18 20 20c8-2 20-10 20-20S48 22 40 10z' fill='%231a3a2a' opacity='0.15'/><path d='M15 60c4-8 12-12 18-10-2 6-8 12-14 14-2 0-4-2-4-4z' fill='%232d5a3d' opacity='0.1'/><path d='M65 15c-4 8-12 12-18 10 2-6 8-12 14-14 2 0 4 2 4 4z' fill='%233d6b4f' opacity='0.08'/></svg>`;
const leafPattern = `url("data:image/svg+xml,${encodeURIComponent(leafSvg)}")`;

/* ─── DENSE FOLIAGE TEXTURE (for curtain) ─── */
const foliageSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><rect fill='%230d2818' width='120' height='120'/><path d='M20 10c-6 10-16 18-16 26s10 14 16 16c6-2 16-6 16-16S26 20 20 10z' fill='%231a3a2a' opacity='0.7'/><path d='M60 5c-10 14-24 22-24 34s14 20 24 22c10-2 24-10 24-22S70 19 60 5z' fill='%232d5a3d' opacity='0.5'/><path d='M100 20c-8 12-18 18-18 28s10 16 18 18c8-2 18-8 18-18S108 32 100 20z' fill='%231a3a2a' opacity='0.6'/><path d='M40 50c-8 10-18 16-18 24s10 14 18 16c8-2 18-6 18-16S48 60 40 50z' fill='%233d6b4f' opacity='0.4'/><path d='M85 55c-6 10-14 16-14 24s8 12 14 14c6-2 14-6 14-14S91 65 85 55z' fill='%232d5a3d' opacity='0.5'/><path d='M15 70c-4 8-10 14-10 20s6 10 10 12c4-2 10-4 10-12S19 78 15 70z' fill='%234a7c59' opacity='0.35'/><path d='M70 80c-6 8-14 12-14 20s8 12 14 14c6-2 14-6 14-14S76 88 70 80z' fill='%231a3a2a' opacity='0.45'/></svg>`;
const foliagePattern = `url("data:image/svg+xml,${encodeURIComponent(foliageSvg)}")`;

/* ─── ORNAMENT SVG ─── */
function Ornament({ className = "", color = C.gold }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="10" x2="60" y2="10" stroke={color} strokeWidth="0.5" />
      <path d="M60 10 L70 5 L80 10 L70 15 Z" fill={color} opacity="0.6" />
      <circle cx="80" cy="10" r="2" fill={color} />
      <circle cx="100" cy="10" r="4" fill={color} opacity="0.8" />
      <circle cx="120" cy="10" r="2" fill={color} />
      <path d="M120 10 L130 5 L140 10 L130 15 Z" fill={color} opacity="0.6" />
      <line x1="140" y1="10" x2="200" y2="10" stroke={color} strokeWidth="0.5" />
    </svg>
  );
}

/* ─── ANIMATED ORNAMENT (line-draw from center) ─── */
function AnimatedOrnament({
  className = "",
  color = C.gold,
  active = false,
  delay = 0,
}: {
  className?: string;
  color?: string;
  active?: boolean;
  delay?: number;
}) {
  return (
    <svg className={className} viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left line — draws outward from center */}
      <motion.path
        d="M60 10 L0 10"
        stroke={color}
        strokeWidth="0.5"
        pathLength={1}
        strokeDasharray={1}
        initial={{ strokeDashoffset: 1 }}
        animate={active ? { strokeDashoffset: 0 } : {}}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
      {/* Left diamond */}
      <motion.path
        d="M60 10 L70 5 L80 10 L70 15 Z"
        fill={color}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 0.6 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.3 }}
      />
      {/* Left inner circle */}
      <motion.circle
        cx="80" cy="10" r="2"
        fill={color}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: delay + 0.2 }}
      />
      {/* Center circle */}
      <motion.circle
        cx="100" cy="10" r="4"
        fill={color}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 0.8 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.1 }}
      />
      {/* Right inner circle */}
      <motion.circle
        cx="120" cy="10" r="2"
        fill={color}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: delay + 0.2 }}
      />
      {/* Right diamond */}
      <motion.path
        d="M120 10 L130 5 L140 10 L130 15 Z"
        fill={color}
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 0.6 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.3 }}
      />
      {/* Right line — draws outward from center */}
      <motion.path
        d="M140 10 L200 10"
        stroke={color}
        strokeWidth="0.5"
        pathLength={1}
        strokeDasharray={1}
        initial={{ strokeDashoffset: 1 }}
        animate={active ? { strokeDashoffset: 0 } : {}}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ─── GRAIN OVERLAY ─── */
function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        animation: "hg-grain 8s steps(10) infinite",
      }}
    />
  );
}

/* ─── CORNER ACCENTS ─── */
function CornerAccents({ color = C.gold }: { color?: string }) {
  const corner = `2px solid ${color}`;
  return (
    <>
      <span className="absolute top-0 left-0 w-6 h-6 pointer-events-none" style={{ borderTop: corner, borderLeft: corner }} />
      <span className="absolute top-0 right-0 w-6 h-6 pointer-events-none" style={{ borderTop: corner, borderRight: corner }} />
      <span className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none" style={{ borderBottom: corner, borderLeft: corner }} />
      <span className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none" style={{ borderBottom: corner, borderRight: corner }} />
    </>
  );
}

/* ─── SECTION WRAPPER ─── */
function Section({
  id,
  bg,
  color,
  children,
  className = "",
  overlay,
}: {
  id?: string;
  bg: string;
  color: string;
  children: ReactNode;
  className?: string;
  overlay?: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative py-24 md:py-32 px-6 md:px-16 lg:px-20 overflow-hidden ${className}`}
      style={{ background: bg, color }}
    >
      {overlay}
      <div className="relative z-10 max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

/* ─── LEAF REVEAL — scroll-driven curtain over a section ─── */
function LeafReveal({
  children,
  side = "left",
}: {
  children: ReactNode;
  side?: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 40%"],
  });
  /* Use vw so the slide always clears even when the leaf image
     is wider than the container (min-width: 900px on mobile). */
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    side === "left" ? ["0vw", "-110vw"] : ["0vw", "110vw"],
  );

  return (
    <div ref={ref} className="relative overflow-hidden">
      {children}
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{
          top: 0,
          bottom: 0,
          /* Anchor to the trailing edge so natural leaf tips are visible;
             the excess extends past the exit side, clipped by the wrapper. */
          ...(side === "left"
            ? { right: 0 }
            : { left: 0 }),
          minWidth: "900px",
          width: "100%",
          x,
        }}
      >
        <img
          src={side === "left" ? "/images/side-one.webp" : "/images/side-two.webp"}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: side === "left" ? "right center" : "left center",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─── ANIMATION VARIANTS ─── */
const vp = { once: true, margin: "-80px" as const };
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

/* ─── CURTAIN PANELS (cinematic auto-open, scroll-locked until complete) ─── */
function FoliageCurtain({
  onReveal,
  onComplete,
}: {
  onReveal: () => void;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");

  /* More overlap on small screens so leaves cover fully */
  const [panelW, setPanelW] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 68 : 58,
  );
  useEffect(() => {
    const onResize = () => setPanelW(window.innerWidth < 768 ? 68 : 58);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    /* Lock scroll for the entire intro sequence */
    document.body.style.overflow = "hidden";

    /* 0.8s — brief hold, then hedges start parting */
    const startTimer = setTimeout(() => setPhase("opening"), 800);

    /* 1.8s — hedges ~40 % open → hero text starts appearing through the gap */
    const revealTimer = setTimeout(() => onReveal(), 1800);

    /* 3.5s — hedges fully offscreen → unlock scroll, clean up */
    const doneTimer = setTimeout(() => {
      setPhase("open");
      document.body.style.overflow = "";
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, [onReveal, onComplete]);

  const isOpening = phase === "opening";
  const gone = phase === "open";

  const tweenTransition = {
    type: "tween" as const,
    duration: 2.5,
    ease: [0.4, 0, 0.2, 1],
  };

  return (
    <>
      {/* ── LEFT PANEL ── */}
      <motion.div
        className="fixed top-0 bottom-0 left-0 z-[51] overflow-hidden"
        style={{
          width: `${panelW}%`,
          pointerEvents: gone ? "none" : "auto",
        }}
        animate={{
          x: isOpening || gone ? "-115%" : "0%",
          scale: isOpening || gone ? 1.06 : 1,
        }}
        transition={{
          x: tweenTransition,
          scale: tweenTransition,
        }}
      >
        <img
          src="/images/side-one.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "right 56%" }}
        />
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <motion.div
        className="fixed top-0 bottom-0 z-[52] overflow-hidden"
        style={{
          left: `${100 - panelW}%`,
          width: `${panelW}%`,
          pointerEvents: gone ? "none" : "auto",
        }}
        animate={{
          x: isOpening || gone ? "115%" : "0%",
          scale: isOpening || gone ? 1.06 : 1,
        }}
        transition={{
          x: tweenTransition,
          scale: tweenTransition,
        }}
      >
        <img
          src="/images/side-two.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "left 44%" }}
        />
      </motion.div>
    </>
  );
}

/* ═══════════════════════════════════════════ *
 *              MAIN APP COMPONENT             *
 * ═══════════════════════════════════════════ */
export default function App() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [scrollUnlocked, setScrollUnlocked] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 640,
  );
  const [screenW, setScreenW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );

  const handleReveal = useRef(() => setHeroVisible(true)).current;
  const handleComplete = useRef(() => setScrollUnlocked(true)).current;

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 640);
      setScreenW(window.innerWidth);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const { scrollYProgress: overallProgress, scrollY } = useScroll();

  const headerOpacity = useTransform(scrollY, [100, 250], [0, 1]);
  const headerY = useTransform(scrollY, [100, 250], [-20, 0]);
  const headerBlur = useSpring(headerOpacity, { stiffness: 100, damping: 20 });
  const scrollPromptOpacity = useTransform(scrollY, [0, 50], [1, 0]);

  const services = [
    {
      title: "Website Design & Build",
      desc: "Custom-built websites engineered to turn visitors into clients. Every page designed around your goals — fast, search-ready, and unmistakably yours.",
      iconKey: "tower" as const,
    },
    {
      title: "Landing Pages",
      desc: "Single-purpose pages built to convert. Whether you're launching a product, running ads, or capturing leads — one page, one goal, maximum impact.",
      iconKey: "scroll" as const,
    },
    {
      title: "AI Chatbots",
      desc: "Intelligent assistants trained on your business that answer questions, qualify leads, and book calls around the clock. Your front desk never sleeps.",
      iconKey: "brain" as const,
    },
    {
      title: "AI Content Creation",
      desc: "Blog posts, social captions, email sequences, and ad copy — written in your voice by AI, refined by humans. Consistent output without the bottleneck.",
      iconKey: "quill" as const,
    },
    {
      title: "SEO & Search",
      desc: "We get you found. Technical audits, keyword strategy, on-page optimization, and content that ranks. Built for long-term organic growth, not quick fixes.",
      iconKey: "lens" as const,
    },
    {
      title: "Paid Advertising",
      desc: "Google Ads, Meta, LinkedIn — targeted campaigns that reach your ideal customer. We manage the budget, test the creative, and scale what works.",
      iconKey: "compass" as const,
    },
    {
      title: "Content Strategy",
      desc: "A publishing plan built around your audience and business goals. We map the topics, set the cadence, and keep your brand visible across every channel.",
      iconKey: "book" as const,
    },
    {
      title: "Workflow Automation",
      desc: "Scheduling, invoicing, follow-ups, reporting — handled automatically. We connect your tools and build systems that run without oversight.",
      iconKey: "gears" as const,
    },
    {
      title: "Analytics & Insights",
      desc: "Clear dashboards that show what's working and what's not. We track the metrics that matter and turn raw data into decisions you can act on.",
      iconKey: "crystal" as const,
    },
  ];

  const steps = [
    {
      num: "I",
      title: "Discovery",
      desc: "We listen to your vision and map the landscape of possibility.",
    },
    {
      num: "II",
      title: "Creation",
      desc: "Our artisans forge your digital presence with meticulous care.",
    },
    {
      num: "III",
      title: "Revelation",
      desc: "Your creation emerges — refined, tested, and ready to enchant.",
    },
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: F.body }}>
      <Grain />

      {/* ── FOLIAGE CURTAIN ── */}
      <FoliageCurtain onReveal={handleReveal} onComplete={handleComplete} />

      {/* ── PROGRESS BAR ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60]"
        style={{
          scaleX: overallProgress,
          background: `linear-gradient(90deg, ${C.gold}, ${C.brightGold})`,
        }}
      />

      {/* ── STICKY HEADER ── */}
      <motion.nav
        style={{ opacity: headerBlur, y: headerY }}
        className="fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 md:left-8 md:right-8 z-50 flex justify-between items-center px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3"
      >
        <div
          className="absolute inset-0 rounded-full border"
          style={{
            background: C.ivory,
            borderColor: `${C.gold}25`,
            boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
          }}
        />
        <img
          src="/images/logo.webp"
          alt="Studio O'Brien"
          className="relative z-10 h-7 sm:h-8 md:h-10 w-auto"
        />
        <div
          className="relative z-10 hidden md:flex gap-8 text-sm tracking-[0.15em] uppercase font-bold"
          style={{ fontFamily: F.heading, color: C.deepForest }}
        >
          <a href="#craft" className="transition-colors duration-300 hover:text-[#c9a84c]">Our Craft</a>
          <a href="#journey" className="transition-colors duration-300 hover:text-[#c9a84c]">The Journey</a>
          <a href="#investment" className="transition-colors duration-300 hover:text-[#c9a84c]">Investment</a>
        </div>
        <div className="relative z-10 flex items-center gap-3 sm:gap-4">
          <a
            href="#login"
            className="text-[11px] sm:text-xs md:text-sm tracking-[0.12em] uppercase font-bold transition-colors duration-300 hover:text-[#c9a84c]"
            style={{ fontFamily: F.heading, color: C.deepForest }}
          >
            Login
          </a>
          <a
            href="#contact"
            className="px-4 sm:px-5 md:px-7 py-1.5 sm:py-2 md:py-2.5 text-[11px] sm:text-xs md:text-sm tracking-[0.12em] uppercase font-bold rounded-full transition-all duration-300 hover:scale-105"
            style={{
              fontFamily: F.heading,
              border: `1.5px solid ${C.gold}`,
              color: C.gold,
              background: "transparent",
            }}
          >
            Inquire
          </a>
        </div>
      </motion.nav>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: C.ivory }}
      >
        {/* Leaf pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: leafPattern, backgroundSize: "80px 80px" }}
        />

        {/* Radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${C.gold}12, transparent)`,
          }}
        />

        {/* Parallax inner */}
        <motion.div
          style={{ y: heroY }}
          className="relative z-10 text-center px-6 pb-16 md:pb-20"
        >
          {/* ── Framed logo block ── */}
          <img
            src="/images/motif-top.webp"
            alt=""
            className="w-[218px] sm:w-[250px] md:w-[310px] lg:w-[373px] mx-auto mb-1"
          />
          <h1 className="relative inline-block">
            <img
              src="/images/logo.webp"
              alt="Studio O'Brien"
              className="w-[520px] sm:w-[600px] md:w-[728px] lg:w-[884px]"
              style={{
                filter: `drop-shadow(0 4px 30px ${C.gold}50) drop-shadow(0 0 60px ${C.gold}20)`,
              }}
            />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute inset-0"
                initial={{ x: "-100%" }}
                animate={heroVisible ? { x: "200%" } : {}}
                transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                style={{
                  background: `linear-gradient(105deg, transparent 40%, ${C.paleGold}30 47%, #fff4 50%, ${C.paleGold}30 53%, transparent 60%)`,
                }}
              />
            </div>
          </h1>
          <img
            src="/images/motif-bottom.webp"
            alt=""
            className="w-[218px] sm:w-[250px] md:w-[310px] lg:w-[373px] mx-auto mt-0.5"
          />

          {/* ── Tagline ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={scrollUnlocked ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-center"
          >
            <div className="max-w-md mx-auto">
              <p
                className="text-xs md:text-sm uppercase tracking-[0.35em]"
                style={{ fontFamily: F.heading, color: C.gold, fontWeight: 400, lineHeight: 1.6 }}
              >
                Where brands come to life
              </p>
              <div className="mx-auto mt-3 mb-4 flex items-center justify-center gap-2">
                <div className="h-px w-8" style={{ background: `${C.gold}30` }} />
                <div className="w-1.5 h-1.5 rotate-45" style={{ background: `${C.gold}50` }} />
                <div className="h-px w-8" style={{ background: `${C.gold}30` }} />
              </div>
              <p
                className="text-base md:text-lg italic"
                style={{ fontFamily: F.body, color: C.emerald, fontWeight: 500, lineHeight: 1.7, letterSpacing: "0.01em" }}
              >
                Designed with craft, powered by the magic of modern technology.
              </p>
            </div>
          </motion.div>

          {/* ── CTAs ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={scrollUnlocked ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 sm:mt-6 md:mt-8 lg:mt-10 flex flex-col items-center gap-3 md:gap-4"
          >
            <motion.a
              href="#craft"
              className="group relative inline-block px-10 py-4 text-sm tracking-[0.2em] uppercase rounded-full overflow-hidden"
              style={{
                fontFamily: F.heading,
                border: `1.5px solid ${C.gold}`,
                color: C.gold,
                background: "transparent",
              }}
            >
              <span className="relative z-10 transition-colors duration-700 ease-out group-hover:text-white">
                Explore the Studio
              </span>
              {/* Circle that grows from center to fill the button */}
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full group-hover:w-[400px] group-hover:h-[400px] transition-all duration-700 ease-out"
                style={{
                  background: `radial-gradient(circle, ${C.brightGold} 0%, ${C.gold} 100%)`,
                }}
              />
            </motion.a>

            <motion.a
              href="#contact"
              className="text-sm tracking-[0.15em] uppercase transition-all duration-300"
              style={{ fontFamily: F.heading, color: C.sage, opacity: 0.6 }}
              whileHover={{ color: C.gold, opacity: 1, letterSpacing: "0.2em" }}
            >
              Let&#8217;s Create
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll prompt — appears after curtain, fades out on first scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={scrollUnlocked ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ opacity: scrollUnlocked ? scrollPromptOpacity : 0 }}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ fontFamily: F.heading, color: C.sage }}
          >
            Scroll
          </span>
          <div
            className="w-5 h-8 rounded-full border flex justify-center pt-1.5"
            style={{ borderColor: `${C.sage}60` }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{
                background: C.sage,
                animation: "hg-scroll-bounce 2s ease-in-out infinite",
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ SERVICES / OUR CRAFT ═══════════════════ */}
      <section
        id="craft"
        className="relative overflow-hidden"
        style={{
          background: C.deepForest,
          color: C.parchment,
          zIndex: 30,
          height: "115vh",
        }}
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: leafPattern, backgroundSize: "80px 80px" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${C.emerald}20, transparent)` }}
        />

        {/* Gradient mask — top */}
        <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none" style={{
          height: "140px",
          background: `linear-gradient(to bottom, ${C.deepForest}, transparent)`,
        }} />
        {/* Gradient mask — bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none" style={{
          height: "140px",
          background: `linear-gradient(to top, ${C.deepForest}, transparent)`,
        }} />

        {/* ── 3-TRACK INFINITE CONVEYOR BELT ── */}
        {(() => {
          const trackItems = [...services, ...services, ...services, ...services];
          const track1 = trackItems;
          const track2 = [...services.slice(2), ...services.slice(0, 2), ...services, ...services, ...services.slice(2), ...services.slice(0, 2)];
          const track3 = [...services.slice(1), ...services.slice(0, 1), ...services, ...services, ...services.slice(1), ...services.slice(0, 1)];

          /* ── FIXED DIMENSIONS — identical at every breakpoint ── */
          const cardW = 336;
          const cardH = 480;
          const gap = 36;
          const archRadius = "50% 50% 10px 10px / 42% 42% 10px 10px";

          /* Column count based purely on what fits at fixed card size */
          const need3 = cardW * 3 + gap * 2 + 80; /* ~1160px */
          const need2 = cardW * 2 + gap + 60;      /* ~768px */
          const colCount = screenW >= need3 ? 3 : screenW >= need2 ? 2 : 1;
          const containerW = cardW * colCount + gap * (colCount - 1);

          const tracks = colCount === 3
            ? [track1, track2, track3]
            : colCount === 2
              ? [track1, track2]
              : [track1];

          const trackDirections = ["up", "down", "up"];
          const trackDurations = ["60s", "70s", "65s"];

          const renderCard = (s: typeof services[0], filled: boolean) => {
            const tc = filled ? C.deepForest : C.paleGold;
            const ac = filled ? C.deepForest : C.gold;
            const lc = filled ? `${C.deepForest}20` : `${C.gold}18`;

            return (
              <div className="relative z-10 flex flex-col items-center h-full px-6">
                {/* ── Radiating lines from dome peak ── */}
                <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: "55%", borderRadius: "inherit" }}>
                  <div className="absolute left-1/2 -translate-x-1/2 top-[8%]" style={{
                    width: "1px", height: "80%",
                    background: `linear-gradient(to bottom, ${ac}30, ${ac}08, transparent)`,
                  }} />
                  <div className="absolute left-1/2 top-[8%] origin-top" style={{
                    width: "1px", height: "75%", transform: "rotate(-14deg)",
                    background: `linear-gradient(to bottom, ${ac}20, transparent 70%)`,
                  }} />
                  <div className="absolute left-1/2 top-[8%] origin-top" style={{
                    width: "1px", height: "65%", transform: "rotate(-28deg)",
                    background: `linear-gradient(to bottom, ${ac}14, transparent 60%)`,
                  }} />
                  <div className="absolute left-1/2 top-[8%] origin-top" style={{
                    width: "1px", height: "75%", transform: "rotate(14deg)",
                    background: `linear-gradient(to bottom, ${ac}20, transparent 70%)`,
                  }} />
                  <div className="absolute left-1/2 top-[8%] origin-top" style={{
                    width: "1px", height: "65%", transform: "rotate(28deg)",
                    background: `linear-gradient(to bottom, ${ac}14, transparent 60%)`,
                  }} />
                  <div className="absolute top-0 left-0 right-0" style={{
                    height: "60%",
                    background: `radial-gradient(ellipse 50% 45% at 50% 15%, ${ac}10, transparent)`,
                  }} />
                </div>

                {/* ── Emblem ── */}
                <div className="relative mt-[48%] mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    border: `1.5px solid ${filled ? `${C.deepForest}35` : `${C.gold}45`}`,
                    background: `radial-gradient(circle, ${ac}12, transparent 70%)`,
                    boxShadow: `0 0 20px ${ac}12`,
                  }}>
                    {s.iconKey === "tower" && <EmblemTower color={tc} />}
                    {s.iconKey === "brain" && <EmblemBrain color={tc} />}
                    {s.iconKey === "compass" && <EmblemCompass color={tc} />}
                    {s.iconKey === "gears" && <EmblemGears color={tc} />}
                    {s.iconKey === "scroll" && <EmblemScroll color={tc} />}
                    {s.iconKey === "quill" && <EmblemQuill color={tc} />}
                    {s.iconKey === "lens" && <EmblemLens color={tc} />}
                    {s.iconKey === "book" && <EmblemBook color={tc} />}
                    {s.iconKey === "crystal" && <EmblemCrystal color={tc} />}
                  </div>
                </div>

                {/* ── Title ── */}
                <h3 className="text-xl tracking-[0.12em] uppercase text-center leading-snug mb-2"
                  style={{ fontFamily: F.heading, color: tc, fontWeight: 700 }}>{s.title}</h3>

                {/* ── Divider ── */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px w-6" style={{ background: lc }} />
                  <div className="w-[5px] h-[5px] rotate-45" style={{ background: `${ac}45` }} />
                  <div className="h-px w-6" style={{ background: lc }} />
                </div>

                {/* ── Description ── */}
                <p className="text-[15px] leading-[1.55] text-center max-w-[90%]"
                  style={{ fontFamily: F.body, color: tc, opacity: 0.75, fontWeight: 500 }}>{s.desc}</p>

                {/* ── Bottom flourish ── */}
                <div className="mt-auto pb-5 pt-3 flex items-center gap-1.5">
                  <div className="h-px w-4" style={{ background: `${ac}15` }} />
                  <div className="w-[4px] h-[4px] rotate-45" style={{ background: `${ac}25` }} />
                  <div className="w-[3px] h-[3px] rounded-full" style={{ background: `${ac}30` }} />
                  <div className="w-[4px] h-[4px] rotate-45" style={{ background: `${ac}25` }} />
                  <div className="h-px w-4" style={{ background: `${ac}15` }} />
                </div>
              </div>
            );
          };

          return (
            <div className="absolute inset-0 z-10 flex items-start justify-center" style={{ paddingTop: 0 }}>
              <div className="flex h-full" style={{ width: `${containerW}px`, gap: `${gap}px` }}>
                {tracks.map((trackServices, colIdx) => {
                  const filled = colCount === 1 ? true : colIdx !== 1;
                  const dir = trackDirections[colIdx] ?? "up";
                  const dur = trackDurations[colIdx] ?? "35s";

                  return (
                    <div key={colIdx} className="craft-track overflow-hidden relative" style={{ width: `${cardW}px` }}>
                      <div
                        className="craft-track-inner flex flex-col"
                        style={{
                          gap: `${gap}px`,
                          animation: `hg-track-${dir} ${dur} linear infinite`,
                        }}
                      >
                        {trackServices.map((s, i) => {
                          const isFilled = colCount === 1 ? i % 2 === 0 : filled;
                          return (
                            <div
                              key={`${colIdx}-${i}`}
                              className="relative flex-shrink-0 overflow-hidden cursor-default"
                              style={{
                                borderRadius: archRadius,
                                width: `${cardW}px`,
                                height: `${cardH}px`,
                                minHeight: `${cardH}px`,
                                ...(isFilled
                                  ? {
                                      background: `linear-gradient(175deg, ${C.brightGold}, ${C.gold} 30%, ${C.paleGold} 55%, ${C.gold} 75%, ${C.brightGold})`,
                                      boxShadow: `inset 0 2px 8px ${C.deepForest}15, inset 0 -2px 8px ${C.deepForest}10`,
                                    }
                                  : {
                                      background: C.deepForest,
                                      border: `1.5px solid ${C.gold}50`,
                                      boxShadow: `inset 0 0 30px ${C.gold}06`,
                                    }),
                              }}
                            >
                              {isFilled && (
                                <div className="absolute inset-0 pointer-events-none" style={{
                                  background: `radial-gradient(ellipse 60% 35% at 50% 25%, rgba(255,255,255,0.12), transparent)`,
                                  borderRadius: "inherit",
                                }} />
                              )}
                              {!isFilled && (
                                <div className="absolute inset-0 pointer-events-none" style={{
                                  background: `linear-gradient(180deg, ${C.gold}04, transparent 40%, ${C.gold}02)`,
                                  borderRadius: "inherit",
                                }} />
                              )}
                              {renderCard(s, isFilled)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ═══════════════════ PHILOSOPHY ═══════════════════ */}
      <Section
        bg={C.ivory}
        color={C.forest}
        overlay={
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: leafPattern,
              backgroundSize: "80px 80px",
            }}
          />
        }
      >
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            className="w-full md:w-1/2"
          >
            <div
              className="relative w-full aspect-[4/5] rounded-sm overflow-hidden"
              style={{ border: `1px solid ${C.gold}30` }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${C.deepForest}, ${C.emerald}80)`,
                }}
              />
              {/* Decorative monogram */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-[12rem] md:text-[16rem] opacity-10"
                  style={{ fontFamily: F.display, color: C.gold }}
                >
                  O
                </span>
              </div>
              <CornerAccents color={C.gold} />
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={{ delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <p
              className="text-xs tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: F.heading, color: C.gold }}
            >
              Our Philosophy
            </p>
            <h2
              className="text-3xl md:text-5xl tracking-tight mb-6"
              style={{ fontFamily: F.display }}
            >
              Old World
              <br />
              <span style={{ color: C.gold }}>New Vision</span>
            </h2>
            <p
              className="text-lg md:text-xl leading-relaxed mb-6 opacity-80"
              style={{ fontWeight: 300, fontStyle: "italic" }}
            >
              We believe the finest digital craft is born where human artistry
              meets artificial intelligence — where timeless design principles
              are amplified by modern enchantment.
            </p>
            <p
              className="text-base leading-relaxed opacity-60"
              style={{ fontWeight: 300 }}
            >
              Studio O'Brien merges centuries of design tradition with
              cutting-edge AI to forge digital experiences that feel both
              ancient and revolutionary. Every pixel placed with purpose, every
              interaction designed to enchant.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm tracking-wider"
                style={{
                  fontFamily: F.heading,
                  border: `1.5px solid ${C.gold}`,
                  color: C.gold,
                }}
              >
                JO
              </div>
              <div>
                <span
                  className="block text-sm tracking-wider uppercase"
                  style={{ fontFamily: F.heading }}
                >
                  J. O'Brien
                </span>
                <span className="text-xs opacity-50">
                  Founder & Lead Artisan
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════ PROCESS / THE JOURNEY ═══════════════════ */}
      <LeafReveal side="left">
      <Section
        id="journey"
        bg={C.forest}
        color={C.parchment}
        overlay={
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: leafPattern,
              backgroundSize: "80px 80px",
            }}
          />
        }
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: F.heading, color: C.gold }}
          >
            How We Work
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl tracking-tight"
            style={{ fontFamily: F.display }}
          >
            The Journey
          </h2>
          <div className="w-40 mx-auto mt-6">
            <Ornament />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="relative p-8 md:p-10 text-center rounded-sm"
              style={{
                background: `${C.deepForest}80`,
                border: `1px solid ${C.gold}20`,
              }}
            >
              <CornerAccents color={`${C.gold}30`} />
              <span
                className="block text-5xl md:text-6xl mb-4 opacity-30"
                style={{ fontFamily: F.display, color: C.gold }}
              >
                {s.num}
              </span>
              <h3
                className="text-xl md:text-2xl tracking-wider mb-3"
                style={{ fontFamily: F.heading, color: C.paleGold }}
              >
                {s.title}
              </h3>
              <p
                className="text-base leading-relaxed opacity-60"
                style={{ fontWeight: 300 }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>
      </LeafReveal>

      {/* ═══════════════════ PRICING / THE INVESTMENT ═══════════════════ */}
      <LeafReveal side="right">
      <Section
        id="investment"
        bg={C.ivory}
        color={C.forest}
        overlay={
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: leafPattern,
              backgroundSize: "80px 80px",
            }}
          />
        }
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: F.heading, color: C.gold }}
          >
            Pricing
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl tracking-tight"
            style={{ fontFamily: F.display }}
          >
            The Investment
          </h2>
          <div className="w-40 mx-auto mt-6">
            <Ornament color={C.emerald} />
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative max-w-2xl mx-auto p-10 md:p-16 rounded-sm text-center"
          style={{
            background: C.deepForest,
            color: C.parchment,
            border: `1px solid ${C.gold}30`,
          }}
        >
          <CornerAccents color={C.gold} />

          <p
            className="text-xs tracking-[0.3em] uppercase mb-6 opacity-60"
            style={{ fontFamily: F.heading }}
          >
            All-Inclusive Retainer
          </p>

          <div
            className="text-6xl md:text-8xl tracking-tight mb-2"
            style={{ fontFamily: F.display, color: C.gold }}
          >
            $3,500
          </div>
          <p className="text-base mb-10 opacity-50" style={{ fontWeight: 300 }}>
            per month — everything included
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left mb-10 max-w-sm mx-auto">
            {[
              "Custom Website",
              "AI Chatbot",
              "SEO & Content",
              "Marketing",
              "Automation",
              "Analytics",
              "Revisions",
              "Support",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-2 text-sm"
                style={{ fontWeight: 400 }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: C.gold }}
                />
                {f}
              </div>
            ))}
          </div>

          <div className="w-32 mx-auto mb-8">
            <Ornament />
          </div>

          <motion.a
            href="#contact"
            className="inline-block px-10 py-4 text-sm tracking-[0.2em] uppercase rounded-full transition-all duration-500 hover:scale-105"
            style={{
              fontFamily: F.heading,
              background: `linear-gradient(135deg, ${C.gold}, ${C.brightGold})`,
              color: C.deepForest,
            }}
          >
            Begin Your Journey
          </motion.a>
        </motion.div>
      </Section>
      </LeafReveal>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <LeafReveal side="left">
      <section
        id="contact"
        className="relative py-32 md:py-44 px-6 md:px-16 lg:px-20 overflow-hidden text-center"
        style={{ background: C.deepForest, color: C.parchment }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: foliagePattern,
            backgroundSize: "120px 120px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 50% 60% at 50% 50%, ${C.gold}08, transparent)`,
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={{ duration: 1 }}
          >
            <div className="w-48 mx-auto mb-8">
              <Ornament />
            </div>
            <h2
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[0.9]"
              style={{ fontFamily: F.display }}
            >
              Let Us Build
              <br />
              <span style={{ color: C.gold }}>Your Kingdom</span>
            </h2>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl italic opacity-60 max-w-lg mx-auto"
            style={{ fontWeight: 300 }}
          >
            Every great legacy begins with a single step.
            <br />
            Take yours today.
          </motion.p>

          <motion.a
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={vp}
            transition={{ duration: 0.8, delay: 0.4 }}
            href="mailto:hello@studioobrien.com"
            className="inline-block mt-10 px-12 py-5 text-base tracking-[0.2em] uppercase rounded-full transition-all duration-500 hover:scale-105"
            style={{
              fontFamily: F.heading,
              background: `linear-gradient(135deg, ${C.gold}, ${C.brightGold})`,
              color: C.deepForest,
            }}
          >
            Contact Us
          </motion.a>
        </div>
      </section>
      </LeafReveal>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer
        className="py-8 px-6 md:px-16"
        style={{
          background: C.darkBark,
          color: C.parchment,
          borderTop: `1px solid ${C.gold}15`,
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img
            src="/images/logo.webp"
            alt="Studio O'Brien"
            className="h-7 w-auto brightness-110"
          />
          <div
            className="flex gap-8 text-xs tracking-[0.2em] uppercase opacity-40"
            style={{ fontFamily: F.heading }}
          >
            {["Our Craft", "The Journey", "Investment"].map((l) => (
              <a
                key={l}
                href={`#${l === "Our Craft" ? "craft" : l === "The Journey" ? "journey" : "investment"}`}
                className="hover:opacity-100 transition-opacity"
              >
                {l}
              </a>
            ))}
          </div>
          <span className="text-xs opacity-30">
            © {new Date().getFullYear()} Studio O'Brien
          </span>
        </div>
      </footer>
    </div>
  );
}
