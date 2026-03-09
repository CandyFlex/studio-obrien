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
@keyframes pw-scroll-left{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes pw-scroll-right{0%{transform:translateX(-50%)}100%{transform:translateX(0)}}
@keyframes pw-scroll-up{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}
@keyframes pw-scroll-down{0%{transform:translateY(-50%)}100%{transform:translateY(0)}}
.pw-row:hover .pw-inner{animation-play-state:paused}
.pw-col:hover .pw-inner{animation-play-state:paused}
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
    <div ref={ref} className="relative overflow-hidden" style={{ background: "#080e08" }}>
      {children}
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{
          top: 0,
          bottom: 0,
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

/* ─── CONTACT FORM ─── */
const inputStyle: React.CSSProperties = {
  fontFamily: F.body,
  fontSize: "1rem",
  background: "rgba(255,255,255,0.06)",
  border: `1px solid ${C.gold}30`,
  borderRadius: "4px",
  padding: "14px 16px",
  color: C.parchment,
  width: "100%",
  outline: "none",
  transition: "border-color 0.3s",
};

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formsubmit.co/ajax/hello@studioobrien.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
        <div className="text-4xl mb-4" style={{ color: C.gold }}>&#10003;</div>
        <p className="text-xl mb-2" style={{ fontFamily: F.heading, color: C.parchment }}>
          Message Received
        </p>
        <p className="text-sm opacity-60">We'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} />
      <input type="hidden" name="_subject" value="New inquiry from studioobrien.com" />

      <div className="flex flex-col sm:flex-row gap-5">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = C.gold)}
          onBlur={(e) => (e.target.style.borderColor = `${C.gold}30`)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = C.gold)}
          onBlur={(e) => (e.target.style.borderColor = `${C.gold}30`)}
        />
      </div>

      <input
        type="text"
        name="business"
        placeholder="Business Name (optional)"
        style={inputStyle}
        onFocus={(e) => (e.target.style.borderColor = C.gold)}
        onBlur={(e) => (e.target.style.borderColor = `${C.gold}30`)}
      />

      <select
        name="service"
        required
        style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
        defaultValue=""
        onFocus={(e) => (e.target.style.borderColor = C.gold)}
        onBlur={(e) => (e.target.style.borderColor = `${C.gold}30`)}
      >
        <option value="" disabled style={{ color: "#666" }}>What are you looking for?</option>
        <option value="Full Website">Full Website Design & Build</option>
        <option value="Landing Page">Landing Page</option>
        <option value="Redesign">Website Redesign</option>
        <option value="Branding">Branding & Identity</option>
        <option value="Other">Something Else</option>
      </select>

      <textarea
        name="message"
        placeholder="Tell us about your project..."
        rows={5}
        required
        style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
        onFocus={(e) => (e.target.style.borderColor = C.gold)}
        onBlur={(e) => (e.target.style.borderColor = `${C.gold}30`)}
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto px-14 py-4 text-sm tracking-[0.2em] uppercase font-bold rounded-sm transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          fontFamily: F.heading,
          background: C.gold,
          color: C.deepForest,
          boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
        }}
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {status === "error" && (
        <p className="text-sm" style={{ color: "#e55" }}>
          Something went wrong. Try emailing us directly at{" "}
          <a href="mailto:hello@studioobrien.com" className="underline">hello@studioobrien.com</a>
        </p>
      )}
    </form>
  );
}

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // ── VARIANT 5: 5-Step Pentagon Process ──
  const jProcess = [
    { num: 1, label: ["Discovery", "& Research"], note: "We learn your business, your customers, and your competition before touching any design." },
    { num: 2, label: ["Strategy", "& Planning"], note: "Architecture, content direction, and SEO targeting mapped out in advance." },
    { num: 3, label: ["Design", "& Build"], note: "Multiple design options built and tested at every screen size." },
    { num: 4, label: ["Testing", "& Validation"], note: "Quality checked on real phones, tablets, and desktops before launch." },
    { num: 5, label: ["Ongoing", "Support"], note: "Revisions, monitoring, and growth tracking included with every project." },
  ];

  // Pentagon geometry — self-contained SVG layout
  const pCx = 500, pCy = 530, pR = 260, pCr = 210;
  const pAngles = [-90, -18, 54, 126, 198];
  const pCircles = pAngles.map(a => ({
    x: pCx + pR * Math.cos((a * Math.PI) / 180),
    y: pCy + pR * Math.sin((a * Math.PI) / 180),
  }));
  // Badges pushed OUTWARD from each circle (just past the edge)
  const pBadgePush = pCr + 30;
  const pBadges = pAngles.map((a, i) => {
    const rad = (a * Math.PI) / 180;
    return {
      x: pCircles[i].x + pBadgePush * Math.cos(rad),
      y: pCircles[i].y + pBadgePush * Math.sin(rad),
    };
  });
  const pAdj: [number, number][] = [[0,1],[1,2],[2,3],[3,4],[4,0]];
  const pMids = pAdj.map(([a, b]) => ({
    x: (pCircles[a].x + pCircles[b].x) / 2,
    y: (pCircles[a].y + pCircles[b].y) / 2,
  }));
  const pInterLabels = ["Define", "Brief", "Review", "Monitor", "Iterate"];
  // Label positions inside circles — pushed outward from center
  const pLabelPush = 80;
  const pLabels = pAngles.map((a, i) => {
    const rad = (a * Math.PI) / 180;
    return {
      x: pCircles[i].x + pLabelPush * Math.cos(rad),
      y: pCircles[i].y + pLabelPush * Math.sin(rad),
    };
  });

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

      {/* ── STICKY HEADER + MOBILE NAV ── */}
      {(() => {
        const navLinks = [
          { label: "Our Craft", href: "#craft" },
          { label: "The Journey", href: "#journey" },
          { label: "Portfolio", href: "#portfolio" },
          { label: "Contact", href: "#contact" },
        ];
        const hF = { fontFamily: F.heading };

        return (
          <>
            <motion.nav style={{ opacity: headerBlur, y: headerY }} className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center">
              <div className="w-full flex justify-between items-center px-6 md:px-12 py-3" style={{ background: C.parchment, borderBottom: `1px solid ${C.gold}15` }}>
                {/* Mobile hamburger */}
                <button
                  className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <span className="block w-5 h-[1.5px]" style={{ background: C.deepForest }} />
                  <span className="block w-5 h-[1.5px]" style={{ background: C.deepForest }} />
                  <span className="block w-3.5 h-[1.5px]" style={{ background: C.deepForest }} />
                </button>
                {/* Desktop nav links */}
                <div className="hidden md:flex gap-7 text-xs tracking-[0.2em] uppercase font-bold" style={{ ...hF, color: C.deepForest }}>
                  {navLinks.slice(0, 3).map(l => <a key={l.label} href={l.href} className="hover:text-[#c9a84c] transition-colors duration-300">{l.label}</a>)}
                </div>
                <img src="/images/logo.webp" alt="Studio O'Brien" className="h-8 md:h-10 w-auto absolute left-1/2 -translate-x-1/2" />
                <div className="flex items-center gap-4 ml-auto">
                  <a href="#contact" className="px-5 py-2 text-xs tracking-[0.12em] uppercase font-bold rounded-sm transition-all duration-300 hover:scale-105" style={{ ...hF, background: C.deepForest, color: C.parchment }}>Get in Touch</a>
                </div>
              </div>
            </motion.nav>

            {/* Mobile fullscreen menu */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center" style={{ background: C.deepForest }}>
                <button
                  className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <span className="block w-6 h-[1.5px] rotate-45 absolute" style={{ background: C.gold }} />
                  <span className="block w-6 h-[1.5px] -rotate-45 absolute" style={{ background: C.gold }} />
                </button>
                <nav className="flex flex-col items-center gap-8">
                  {navLinks.map(l => (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl tracking-[0.3em] uppercase transition-colors duration-300 hover:text-[#c9a84c]"
                      style={{ fontFamily: F.heading, color: C.parchment }}
                    >
                      {l.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-12">
                  <Ornament className="w-32" color={C.gold} />
                </div>
              </div>
            )}
          </>
        );
      })()}

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
              className="group relative inline-block px-12 py-5 text-sm tracking-[0.2em] uppercase rounded-full overflow-hidden"
              style={{
                fontFamily: F.heading,
                border: `2px solid ${C.gold}`,
                color: C.gold,
                background: `${C.gold}10`,
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
              className="text-sm tracking-[0.2em] uppercase font-bold transition-all duration-300"
              style={{ fontFamily: F.heading, color: C.gold, opacity: 0.7 }}
              whileHover={{ opacity: 1, letterSpacing: "0.25em" }}
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
          const trackDurations = ["110s", "120s", "115s"];

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
      <Section bg={C.deepForest} color={C.parchment} overlay={<div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: leafPattern, backgroundSize: "80px 80px" }} />}>
        <div className="flex flex-col md:flex-row items-start gap-10 md:gap-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="w-full md:w-[29%] flex-shrink-0">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden" style={{ border: `2px solid ${C.gold}` }}>
              <img src="/images/portrait.webp" alt="J. O'Brien, Founder" className="w-full h-full object-cover" loading="lazy" decoding="async" width={700} height={700} />
              <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: `linear-gradient(to top, ${C.deepForest}, transparent)` }} />
            </div>
            <div className="mt-4 text-center">
              <span className="block text-sm tracking-wider uppercase" style={{ fontFamily: F.heading, color: C.parchment }}>J. O'Brien</span>
              <span className="text-xs opacity-50">Founder</span>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ delay: 0.15 }} className="flex-1 md:pt-8">
            <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
            <h2 className="text-3xl md:text-5xl tracking-tight mb-8" style={{ fontFamily: F.display, color: C.parchment }}>Craft Before<br /><span style={{ color: C.gold }}>Everything</span></h2>
            <div className="mb-6"><p className="text-lg md:text-xl leading-relaxed opacity-80" style={{ fontWeight: 300, fontStyle: "italic" }}><span className="float-left text-6xl leading-none mr-3 mt-1" style={{ fontFamily: F.display, color: C.gold, fontStyle: "normal" }}>W</span>e believe the finest digital craft is born where human artistry meets purposeful technology. Timeless design principles, amplified by modern tools and relentless attention to detail.</p></div>
            <p className="text-base leading-relaxed opacity-60 mb-8" style={{ fontWeight: 300 }}>Studio O'Brien merges deep design tradition with cutting-edge capability to forge digital experiences that feel both enduring and fresh. Every pixel placed with purpose, every interaction designed to resonate.</p>
            <Ornament className="w-32 md:w-48" color={C.gold} />
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
        {/* ── Section Header ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-5 md:gap-8">
            <div
              className="w-16 md:w-28 h-px"
              style={{ background: `linear-gradient(to right, transparent, ${C.gold}60)` }}
            />
            <h2
              className="text-xl md:text-2xl lg:text-3xl tracking-[0.35em] uppercase"
              style={{ fontFamily: F.heading, color: C.gold }}
            >
              Our Process
            </h2>
            <div
              className="w-16 md:w-28 h-px"
              style={{ background: `linear-gradient(to left, transparent, ${C.gold}60)` }}
            />
          </div>
        </motion.div>

        {/* ── Process: Large Diagram + 5-Column Strip Below ── */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ delay: 0.15 }}>
          {/* Mobile: stacked */}
          <div className="md:hidden">
            <div className="max-w-sm mx-auto mb-8">
              <svg viewBox="-10 0 1020 970" className="w-full h-auto" role="img" aria-label="Interconnected process diagram">
                <defs>
                  <pattern id="proc-hatch" width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1={0} y1={0} x2={0} y2={7} stroke={C.parchment} strokeWidth={0.8} opacity={0.22} />
                  </pattern>
                  {pCircles.map((_c, i) => (
                    <clipPath key={i} id={`pc-${i}`}><circle cx={pCircles[i].x} cy={pCircles[i].y} r={pCr} /></clipPath>
                  ))}
                </defs>
                {pBadges.map((b, i) => { const next = pBadges[(i + 1) % 5]; return (<line key={`pl-${i}`} x1={b.x} y1={b.y} x2={next.x} y2={next.y} stroke={C.gold} strokeWidth={1} strokeDasharray="6 4" opacity={0.3} />); })}
                <polygon points={pBadges.map((b) => `${b.x},${b.y}`).join(" ")} fill={C.gold} fillOpacity={0.04} stroke="none" />
                {pCircles.map((c, i) => (<circle key={`co-${i}`} cx={c.x} cy={c.y} r={pCr} fill="none" stroke={C.parchment} strokeWidth={1.5} opacity={0.25} />))}
                {pAdj.map(([a, b]) => (<circle key={`hz-${a}-${b}`} cx={pCircles[a].x} cy={pCircles[a].y} r={pCr} fill="url(#proc-hatch)" clipPath={`url(#pc-${b})`} />))}
                {pLabels.map((l, i) => (
                  <text key={`lt-${i}`} x={l.x} y={l.y - 12} textAnchor="middle" fill={C.parchment} fontSize={26} fontFamily={F.heading} letterSpacing="0.04em" fontWeight="bold" opacity={0.85}>
                    <tspan x={l.x} dy="0">{jProcess[i].label[0]}</tspan>
                    <tspan x={l.x} dy="30">{jProcess[i].label[1]}</tspan>
                  </text>
                ))}
                {pBadges.map((b, i) => (<g key={`bg-${i}`}><circle cx={b.x} cy={b.y} r={24} fill={C.gold} /><text x={b.x} y={b.y + 1} textAnchor="middle" dominantBaseline="central" fill={C.deepForest} fontSize={18} fontWeight="bold" fontFamily={F.heading}>{jProcess[i].num}</text></g>))}
                {pMids.map((m, i) => (<text key={`il-${i}`} x={m.x} y={m.y + 1} textAnchor="middle" dominantBaseline="central" fill={C.gold} fontSize={20} fontFamily={F.heading} letterSpacing="0.06em" fontWeight="bold" opacity={0.7}>{pInterLabels[i]}</text>))}
              </svg>
            </div>
            <div className="grid grid-cols-1 gap-5">
              {jProcess.map((p, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: C.gold, color: C.deepForest, fontFamily: F.heading }}>{p.num}</div>
                  <div>
                    <p className="text-base tracking-wider uppercase mb-1" style={{ fontFamily: F.heading, color: C.paleGold }}>{p.label.join(" ")}</p>
                    <p className="text-sm leading-relaxed opacity-50" style={{ fontWeight: 300 }}>{p.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Desktop: diagram + 5-column strip */}
          <div className="hidden md:block">
            <div className="max-w-5xl mx-auto">
              <svg viewBox="-10 0 1020 970" className="w-full h-auto" role="img" aria-label="Interconnected process diagram">
                <defs>
                  <pattern id="proc-hatch-d" width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1={0} y1={0} x2={0} y2={7} stroke={C.parchment} strokeWidth={0.8} opacity={0.22} />
                  </pattern>
                  {pCircles.map((_c, i) => (
                    <clipPath key={i} id={`pcd-${i}`}><circle cx={pCircles[i].x} cy={pCircles[i].y} r={pCr} /></clipPath>
                  ))}
                </defs>
                {pBadges.map((b, i) => { const next = pBadges[(i + 1) % 5]; return (<line key={`pl-${i}`} x1={b.x} y1={b.y} x2={next.x} y2={next.y} stroke={C.gold} strokeWidth={1} strokeDasharray="6 4" opacity={0.3} />); })}
                <polygon points={pBadges.map((b) => `${b.x},${b.y}`).join(" ")} fill={C.gold} fillOpacity={0.04} stroke="none" />
                {pCircles.map((c, i) => (<circle key={`co-${i}`} cx={c.x} cy={c.y} r={pCr} fill="none" stroke={C.parchment} strokeWidth={1.5} opacity={0.25} />))}
                {pAdj.map(([a, b]) => (<circle key={`hz-${a}-${b}`} cx={pCircles[a].x} cy={pCircles[a].y} r={pCr} fill="url(#proc-hatch-d)" clipPath={`url(#pcd-${b})`} />))}
                {pLabels.map((l, i) => (
                  <text key={`lt-${i}`} x={l.x} y={l.y - 12} textAnchor="middle" fill={C.parchment} fontSize={26} fontFamily={F.heading} letterSpacing="0.04em" fontWeight="bold" opacity={0.85}>
                    <tspan x={l.x} dy="0">{jProcess[i].label[0]}</tspan>
                    <tspan x={l.x} dy="30">{jProcess[i].label[1]}</tspan>
                  </text>
                ))}
                {pBadges.map((b, i) => (<g key={`bg-${i}`}><circle cx={b.x} cy={b.y} r={24} fill={C.gold} /><text x={b.x} y={b.y + 1} textAnchor="middle" dominantBaseline="central" fill={C.deepForest} fontSize={18} fontWeight="bold" fontFamily={F.heading}>{jProcess[i].num}</text></g>))}
                {pMids.map((m, i) => (<text key={`il-${i}`} x={m.x} y={m.y + 1} textAnchor="middle" dominantBaseline="central" fill={C.gold} fontSize={20} fontFamily={F.heading} letterSpacing="0.06em" fontWeight="bold" opacity={0.7}>{pInterLabels[i]}</text>))}
              </svg>
            </div>
            <div className="max-w-6xl mx-auto mt-12">
              <div className="grid grid-cols-5 gap-0">
                {jProcess.map((p, i) => (
                  <div key={i} className="text-left px-5 py-5" style={{ borderRight: i < 4 ? `1px solid ${C.gold}15` : "none" }}>
                    <div className="h-0.5 w-full mb-4" style={{ background: C.gold, opacity: 0.35 }} />
                    <span className="text-2xl font-bold block mb-2" style={{ color: C.gold, fontFamily: F.heading }}>{p.num}</span>
                    <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ fontFamily: F.heading, color: C.paleGold }}>{p.label.join(" ")}</p>
                    <p className="text-xs leading-relaxed opacity-80" style={{ fontWeight: 300, color: C.parchment }}>{p.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Section>
      </LeafReveal>

      {/* ═══════════════════ PORTFOLIO / PAST WORK — Roller Conveyor ═══════════════════ */}
      {(() => {
        const pieces = [
          { src: "/images/portfolio/crestview-property.webp", name: "Crestview Property Group", tag: "Real Estate", href: "/mock-sites/crestview-property.html" },
          { src: "/images/portfolio/carolina-arcade.webp", name: "Carolina Arcade Museum", tag: "Entertainment", href: "/mock-sites/carolina-arcade.html" },
          { src: "/images/portfolio/mason-jar.webp", name: "The Mason Jar Provisions", tag: "Restaurant", href: "/mock-sites/mason-jar.html" },
          { src: "/images/portfolio/foothills-chiro.webp", name: "Foothills Family Chiropractic", tag: "Healthcare", href: "/mock-sites/foothills-chiro.html" },
          { src: "/images/portfolio/wahoos-sports.webp", name: "Wahoo's Sports & Collectibles", tag: "Retail", href: "/mock-sites/wahoos-sports.html" },
          { src: "/images/portfolio/keller-built.webp", name: "Keller Built", tag: "Construction", href: "/mock-sites/keller-built.html" },
          { src: "/images/portfolio/carolina-brewing.webp", name: "Carolina Craft Brewing Co.", tag: "Brewery", href: "/mock-sites/carolina-brewing.html" },
          { src: "/images/portfolio/hoot-nannie.webp", name: "The Hoot Nannie", tag: "Restaurant", href: "/mock-sites/hoot-nannie.html" },
          { src: "/images/portfolio/morningside-coffee.webp", name: "Morningside Coffee", tag: "Cafe", href: "/mock-sites/morningside-coffee.html" },
          { src: "/images/portfolio/pinnacle-realty.webp", name: "Pinnacle Realty", tag: "Real Estate", href: "/mock-sites/pinnacle-realty.html" },
          { src: "/images/portfolio/hickory-dental.webp", name: "Hickory Dental Arts", tag: "Healthcare", href: "/mock-sites/hickory-dental.html" },
          { src: "/images/portfolio/iron-peak.webp", name: "Iron Peak Fitness", tag: "Fitness", href: "/mock-sites/iron-peak.html" },
          { src: "/images/portfolio/summit-legal.webp", name: "Summit Legal Group", tag: "Legal", href: "/mock-sites/summit-legal.html" },
          { src: "/images/portfolio/trailhead-outfitters.webp", name: "Trailhead Outfitters", tag: "Retail", href: "/mock-sites/trailhead-outfitters.html" },
          { src: "/images/portfolio/uptown-shelby.webp", name: "Uptown Shelby", tag: "Community", href: "/mock-sites/uptown-shelby.html" },
        ];

        /* 4 rows, alternating left/right — large cards filling the same vertical space */
        const rowConfigs = [
          { start: 0, count: 6, h: "h-[280px] md:h-[370px]", speed: "44s", dir: "left" as const },
          { start: 3, count: 6, h: "h-[280px] md:h-[370px]", speed: "52s", dir: "right" as const },
          { start: 7, count: 6, h: "h-[280px] md:h-[370px]", speed: "38s", dir: "left" as const },
          { start: 1, count: 6, h: "h-[280px] md:h-[370px]", speed: "48s", dir: "right" as const },
        ];

        return (
          <section
            id="portfolio"
            className="relative overflow-hidden pt-24 md:pt-36"
            style={{ background: C.deepForest }}
          >
            {/* Background texture */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: leafPattern, backgroundSize: "80px 80px" }}
            />

            {/* Heading */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              className="relative z-10 flex flex-col items-center px-6 mb-16 md:mb-20"
            >
              <h2
                className="text-5xl md:text-7xl lg:text-8xl tracking-tight"
                style={{ fontFamily: F.display, color: C.parchment }}
              >
                Portfolio
              </h2>
              <div className="flex items-center gap-4 mt-5 mb-0">
                <div className="h-px w-10 md:w-16" style={{ background: `${C.gold}40` }} />
                <p
                  className="text-[11px] md:text-xs tracking-[0.45em] uppercase"
                  style={{ fontFamily: F.heading, color: C.gold, fontWeight: 400 }}
                >
                  Selected Work
                </p>
                <div className="h-px w-10 md:w-16" style={{ background: `${C.gold}40` }} />
              </div>
            </motion.div>

            {/* Roller rows */}
            <div className="space-y-2">
              {rowConfigs.map((cfg, ri) => {
                const rowPieces = Array.from({ length: cfg.count }, (_, i) => pieces[(cfg.start + i) % pieces.length]);
                const track = [...rowPieces, ...rowPieces, ...rowPieces];
                return (
                  <div key={ri} className="pw-row overflow-hidden w-full">
                    <div
                      className="pw-inner flex gap-2"
                      style={{
                        animation: `pw-scroll-${cfg.dir} ${cfg.speed} linear infinite`,
                        width: "max-content",
                      }}
                    >
                      {track.map((p, i) => (
                        <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className={`w-[440px] md:w-[580px] flex-shrink-0 ${cfg.h} block cursor-pointer`}>
                          <div className="relative overflow-hidden group w-full h-full">
                            <img src={p.src} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                            <div
                              className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ background: `linear-gradient(to top, ${C.deepForest}ee 0%, transparent 50%)` }}
                            >
                              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: C.gold, fontFamily: F.heading }}>{p.tag}</span>
                              <span className="text-sm font-medium leading-tight" style={{ color: C.parchment, fontFamily: F.heading }}>{p.name}</span>
                              <span className="text-[10px] tracking-[0.2em] uppercase mt-2 opacity-60" style={{ color: C.paleGold, fontFamily: F.heading }}>View Project &rarr;</span>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* ═══════════════════ CONTACT FORM ═══════════════════ */}
      <LeafReveal side="left">
      <section
        id="contact"
        className="relative pt-24 md:pt-32 pb-32 md:pb-44 px-6 md:px-16 lg:px-20 overflow-hidden"
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

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            {/* Left column — headline + info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              transition={{ duration: 1 }}
              className="md:w-[40%] flex-shrink-0"
            >
              <div className="w-40 mb-8">
                <Ornament />
              </div>
              <h2
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.9] mb-6"
                style={{ fontFamily: F.display }}
              >
                Let Us Build
                <br />
                <span style={{ color: C.gold }}>Your Kingdom</span>
              </h2>
              <p
                className="text-base md:text-lg italic opacity-60 mb-8"
                style={{ fontWeight: 300 }}
              >
                Every great legacy begins with a single step.
                <br />
                Take yours today.
              </p>
              <div className="space-y-3 text-sm opacity-70">
                <a href="mailto:hello@studioobrien.com" className="flex items-center gap-3 hover:opacity-100 transition-opacity">
                  <span style={{ color: C.gold }}>&#9993;</span>
                  hello@studioobrien.com
                </a>
                <div className="flex items-center gap-3">
                  <span style={{ color: C.gold }}>&#9670;</span>
                  Shelby, NC
                </div>
              </div>
            </motion.div>

            {/* Right column — form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
      </LeafReveal>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      {/* ═══════════════════ FOOTER — Grand Banner ═══════════════════ */}
      {(() => {
        const navLinks = [
          { label: "Our Craft", href: "#craft" },
          { label: "The Journey", href: "#journey" },
          { label: "Portfolio", href: "#portfolio" },
          { label: "Contact", href: "#contact" },
        ];
        const yr = new Date().getFullYear();
        const fStyle = { fontFamily: F.heading };
        const socials = [
          { label: "GitHub", href: "https://github.com/CandyFlex" },
          { label: "Email", href: "mailto:hello@studioobrien.com" },
        ];

        return (
          <footer className="py-16 md:py-24 px-6 md:px-16" style={{ background: C.parchment, color: C.deepForest }}>
            <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
              <Ornament className="w-40 md:w-56 mb-8" color={C.gold} />
              <img src="/images/logo.webp" alt="Studio O'Brien" className="h-12 md:h-16 w-auto mb-6" />
              <p className="text-sm md:text-base italic opacity-60 max-w-md mb-10" style={{ fontWeight: 400, color: C.forest }}>
                Where timeless craft meets the art of the digital age.
              </p>
              <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs tracking-[0.25em] uppercase mb-10" style={fStyle}>
                {navLinks.map((l) => (
                  <a key={l.label} href={l.href} className="opacity-70 hover:opacity-100 transition-all duration-300" style={{ color: C.deepForest }}>{l.label}</a>
                ))}
              </div>
              <div className="flex gap-8 text-xs tracking-[0.2em] uppercase opacity-50 mb-10" style={{ ...fStyle, color: C.deepForest }}>
                {socials.map((s) => <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined} className="hover:opacity-100 transition-opacity">{s.label}</a>)}
              </div>
              <Ornament className="w-32 md:w-40 mb-6" color={C.gold} />
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs opacity-40" style={{ color: C.deepForest }}>
                <span>&copy; {yr} Studio O'Brien</span>
                <span className="hidden md:inline">&middot;</span>
                <span>Shelby, NC</span>
                <span className="hidden md:inline">&middot;</span>
                <span>All rights reserved</span>
              </div>
            </div>
          </footer>
        );
      })()}
    </div>
  );
}
