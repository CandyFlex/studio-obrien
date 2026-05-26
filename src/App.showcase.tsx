import { useRef, useEffect, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "motion/react";
import {
  Globe,
  Target,
  Bot,
  Sparkles,
  Search,
  Megaphone,
  BookOpen,
  Cog,
  BarChart3,
} from "lucide-react";

/* ─── DESIGN TOKENS ─── */
const F = {
  display: "'Cinzel Decorative', serif",
  heading: "'Cinzel', serif",
  body: "'Cormorant Garamond', serif",
};

/* ─── BODY FONT PAIRINGS (10 options for card descriptions) ─── */
const bodyFonts = [
  { name: "Lora", css: "'Lora', serif", weight: 400, size: "15.5px", lh: "1.65", italic: true },
  { name: "Spectral", css: "'Spectral', serif", weight: 300, size: "15px", lh: "1.7", italic: false },
  { name: "EB Garamond", css: "'EB Garamond', serif", weight: 400, size: "16px", lh: "1.6", italic: false },
  { name: "Crimson Text", css: "'Crimson Text', serif", weight: 400, size: "15.5px", lh: "1.65", italic: false },
  { name: "Libre Baskerville", css: "'Libre Baskerville', serif", weight: 400, size: "14px", lh: "1.7", italic: false },
  { name: "Josefin Sans", css: "'Josefin Sans', sans-serif", weight: 300, size: "14px", lh: "1.7", italic: false },
  { name: "Raleway", css: "'Raleway', sans-serif", weight: 300, size: "14.5px", lh: "1.7", italic: false },
  { name: "Nunito Sans", css: "'Nunito Sans', sans-serif", weight: 300, size: "14.5px", lh: "1.7", italic: false },
  { name: "Cardo", css: "'Cardo', serif", weight: 400, size: "15.5px", lh: "1.65", italic: false },
  { name: "Quattrocento", css: "'Quattrocento', serif", weight: 400, size: "15px", lh: "1.65", italic: false },
];

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
@keyframes hg-glow{0%,100%{opacity:0.35;transform:scale(1)}50%{opacity:0.55;transform:scale(1.04)}}
@keyframes nav-shine{0%{left:-100%}100%{left:200%}}
@keyframes nav-pulse-border{0%,100%{border-color:rgba(201,168,76,0.3)}50%{border-color:rgba(201,168,76,0.8)}}
.nav-btn{position:relative;overflow:hidden;transition:all 0.4s cubic-bezier(0.4,0,0.2,1)}
.nav-btn-1::after{content:'';position:absolute;inset:3px;border:1px solid ${C.gold}50;border-radius:inherit;transition:all 0.35s ease;opacity:0;transform:scale(0.92)}.nav-btn-1:hover::after{opacity:1;transform:scale(1)}
.nav-btn-2::after{content:'';position:absolute;inset:2px;border:0.5px solid ${C.gold}40;border-radius:inherit;transition:all 0.35s ease;opacity:0}.nav-btn-2:hover::after{opacity:1}
.nav-btn-3:hover{box-shadow:inset 0 0 0 3px ${C.parchment},inset 0 0 0 4.5px ${C.gold}60,0 2px 8px ${C.deepForest}15 !important}
.nav-btn-4::after{content:'';position:absolute;inset:3px;border:1px solid ${C.gold}40;border-radius:6px;transition:all 0.35s ease;opacity:0}.nav-btn-4:hover::after{opacity:1}
.nav-btn-5:hover{transform:scale(1.04);box-shadow:inset 0 0 0 3px ${C.parchment},inset 0 0 0 4.5px ${C.deepForest}25,0 4px 16px ${C.deepForest}15 !important}
.nav-btn-6:hover{box-shadow:inset 0 0 0 4px ${C.parchment},inset 0 0 0 5.5px ${C.deepForest}40,inset 0 0 0 7px ${C.parchment},inset 0 0 0 8px ${C.gold}30 !important}
.nav-btn-7::after{content:'';position:absolute;inset:3px;border:1px solid ${C.deepForest}20;border-radius:inherit;transition:all 0.35s ease}.nav-btn-7:hover::after{border-color:${C.gold}60;box-shadow:0 0 8px ${C.gold}15}
.nav-btn-8::after{content:'';position:absolute;inset:2px;border:1.5px solid ${C.gold}50;border-radius:inherit;opacity:0;transition:all 0.3s ease}.nav-btn-8::before{content:'';position:absolute;inset:5px;border:0.5px solid ${C.gold}30;border-radius:inherit;opacity:0;transition:all 0.3s ease 0.05s}.nav-btn-8:hover::after,.nav-btn-8:hover::before{opacity:1}
.nav-btn-9::after{content:'';position:absolute;inset:2px;border:1px solid ${C.gold}40;border-radius:inherit;transition:all 0.3s ease;opacity:0;transform:scale(0.95)}.nav-btn-9:hover::after{opacity:1;transform:scale(1)}.nav-btn-9:hover{transform:translateY(-2px)}
.nav-btn-10:hover{box-shadow:inset 0 0 0 3px ${C.parchment},inset 0 0 0 4px ${C.deepForest}30,0 2px 0 ${C.deepForest}15,0 -2px 0 ${C.deepForest}08 !important}
.nav-link{position:relative;transition:all 0.3s ease}
.nav-link-underline::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:1px;background:${C.gold};transition:width 0.3s ease}.nav-link-underline:hover::after{width:100%}
.nav-link-bracket::before,.nav-link-bracket::after{transition:all 0.3s ease;opacity:0}.nav-link-bracket::before{content:'[ '}.nav-link-bracket::after{content:' ]'}.nav-link-bracket:hover::before,.nav-link-bracket:hover::after{opacity:1;color:${C.gold}}
.nav-link-dot::before{content:'';position:absolute;left:-10px;top:50%;width:4px;height:4px;border-radius:50%;background:${C.gold};transform:translateY(-50%) scale(0);transition:transform 0.3s ease}.nav-link-dot:hover::before{transform:translateY(-50%) scale(1)}
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
function ContactForm() {
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

    /* 0.3s — brief hold, then hedges start parting */
    const startTimer = setTimeout(() => setPhase("opening"), 300);

    /* 0.7s — hedges parting → hero text starts appearing through the gap */
    const revealTimer = setTimeout(() => onReveal(), 700);

    /* 1.5s — hedges fully offscreen → unlock scroll, clean up */
    const doneTimer = setTimeout(() => {
      setPhase("open");
      document.body.style.overflow = "";
      onComplete();
    }, 1500);

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
    duration: 1.1,
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
          // @ts-expect-error fetchPriority is valid HTML
          fetchPriority="low"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "right 56%", contentVisibility: "auto" as string }}
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
          // @ts-expect-error fetchPriority is valid HTML
          fetchPriority="low"
          loading="eager"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "left 44%", contentVisibility: "auto" as string }}
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
  const [heroVariant, setHeroVariant] = useState(0);
  const [cardCombo, setCardCombo] = useState(9);
  const emblemNames = [
    "Soft Centered", "Dome Crown", "Blurred Halo", "Ghost Echo", "Radial Burst",
    "Corner Drift", "Double Layer", "Etched Ring", "Scattered Seeds", "Monumental",
  ];
  const [navCombo, setNavCombo] = useState(1);
  const [btnCombo, setBtnCombo] = useState(7);
  const [linkSize, setLinkSize] = useState(1);
  const [philCombo, setPhilCombo] = useState(4);
  const [processCombo, setProcessCombo] = useState(0);
  const [contactCombo, setContactCombo] = useState(0);
  const [heroCtaCombo, setHeroCtaCombo] = useState(0);
  const [contactStep, setContactStep] = useState(0);
  const [selectedService, setSelectedService] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [tourStep, setTourStep] = useState(-1);
  const [stepInfoVisible, setStepInfoVisible] = useState(false);

  const tourActiveRef = useRef(false);
  const tourTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const linkSizeNames = [
    "Playfair Display", "Cormorant SC", "Marcellus", "Forum", "Tenor Sans",
    "Sorts Mill Goudy", "Gilda Display", "Bellefair", "Mate SC", "Almendra",
  ];
  const navNames = [
    "Etched Original", "Thinner Frame", "Gold Inner", "Rounded Etch", "Wide Plate",
    "Deep Inset", "Soft Etch", "Double Gold", "Tight Etch", "Beveled Plate",
  ];
  const philNames = [
    "Built Not Assembled", "Details Are Design", "Good Enough Never Is", "One Maker Zero Shortcuts", "Craft Is Strategy",
    "What Templates Can't", "Obsession Is Method", "Every Pixel Earned", "Brand Deserves Maker", "Craft Meets Conviction",
  ];
  const processNames = [
    "The Constellation", "The Forge Path", "The Wheel",
  ];
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 640,
  );

  const [screenW, setScreenW] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );
  const [screenH, setScreenH] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 900,
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
      setScreenH(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 50]);
  const heroContentOpacity = useTransform(heroProgress, [0, 0.5, 0.85], [1, 1, 0]);
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
  const proc = [
    { n: "01", name: "Listen", desc: "Who are your best customers? What makes them call you instead of the other guy? We start with a real conversation. Not a questionnaire. The answers shape everything that follows." },
    { n: "02", name: "Research", desc: "We pull up your top five competitors and find what they're missing. Keyword gaps, slow load times, weak calls to action. Their blind spots become your advantages." },
    { n: "03", name: "Architect", desc: "Every page needs a job. We map the sitemap, decide what goes where, and plan how a visitor moves from landing to contact. Skipping this step is why most sites underperform." },
    { n: "04", name: "Design", desc: "You see three different creative directions, not one take-it-or-leave-it mockup. Each one is built around your brand and your audience. You pick the winner. We refine from there." },
    { n: "05", name: "Build", desc: "Hand-written code. No WordPress, no Squarespace, no drag-and-drop page builders. The result loads in under two seconds, works on every screen size, and scores 90+ on Google PageSpeed." },
    { n: "06", name: "Refine", desc: "Pixel-level adjustments. Button spacing, font weights, color contrast, scroll timing. This is where a site stops looking \"made\" and starts looking like it was always supposed to exist." },
    { n: "07", name: "Test", desc: "We open it on iPhones, Androids, Chrome, Safari, Firefox, and a throttled 3G connection. If something breaks on a six-year-old phone, we fix it before you ever see it." },
    { n: "08", name: "Launch", desc: "Domain connected. SSL certificate active. Google Analytics and Search Console configured. Sitemap submitted. You don't touch a single dashboard. It goes live and it works." },
    { n: "09", name: "Measure", desc: "Within the first week, real data starts coming in. Which pages get traffic, where people leave, what they click. Every decision after launch is based on what visitors actually do." },
    { n: "10", name: "Evolve", desc: "Your business will change. New services, new locations, seasonal pushes. Your site stays current. Monthly updates, performance checks, and fresh content keep it working as hard as you do." },
  ];

  /* ─── Constellation Geometry (static, used for tour zoom) ─── */
  const cxP = 400, cyP = 400, cR = 280, cOverlapR = 120;
  const cNodes = Array.from({ length: 10 }, (_, i) => {
    const angle = (2 * Math.PI * i) / 10 - Math.PI / 2;
    return { x: cxP + cR * Math.cos(angle), y: cyP + cR * Math.sin(angle), angle };
  });
  const cStarPath = (indices: number[]) => indices.map((idx, j) => `${j === 0 ? "M" : "L"}${cNodes[idx].x.toFixed(2)},${cNodes[idx].y.toFixed(2)}`).join(" ") + " Z";
  const cPhases = [
    { label: "DISCOVER", from: 0, to: 1 },
    { label: "PLAN", from: 2, to: 3 },
    { label: "CREATE", from: 4, to: 5 },
    { label: "PERFECT", from: 6, to: 7 },
    { label: "GROW", from: 8, to: 9 },
  ];
  const cPhaseArcs = cPhases.map(p => {
    const midAngle = (cNodes[p.from].angle + cNodes[p.to].angle) / 2;
    const labelR = cR + 52;
    return {
      label: p.label,
      x: cxP + labelR * Math.cos(midAngle),
      y: cyP + labelR * Math.sin(midAngle),
      rotate: (midAngle * 180) / Math.PI + (midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2 ? 180 : 0),
    };
  });
  const cRosePoints = Array.from({ length: 16 }, (_, i) => {
    const a = (2 * Math.PI * i) / 16;
    const len = i % 4 === 0 ? 28 : i % 2 === 0 ? 18 : 10;
    return { x1: cxP, y1: cyP, x2: cxP + len * Math.cos(a), y2: cyP + len * Math.sin(a) };
  });
  const cTicks = Array.from({ length: 60 }, (_, i) => {
    const a = (2 * Math.PI * i) / 60;
    const inner = i % 5 === 0 ? 42 : 46;
    return { x1: cxP + inner * Math.cos(a), y1: cyP + inner * Math.sin(a), x2: cxP + 50 * Math.cos(a), y2: cyP + 50 * Math.sin(a) };
  });

  /* ─── Tour auto-cycling effect ─── */
  useEffect(() => {
    if (processCombo !== 0) {
      tourActiveRef.current = false;
      tourTimers.current.forEach(clearTimeout);
      tourTimers.current = [];
      setTourStep(-1);
      setStepInfoVisible(false);
      return;
    }

    tourActiveRef.current = true;
    const schedule = (fn: () => void, ms: number) => {
      const t = setTimeout(() => { if (tourActiveRef.current) fn(); }, ms);
      tourTimers.current.push(t);
    };

    const runStep = (step: number) => {
      if (!tourActiveRef.current) return;
      setTourStep(step);
      setStepInfoVisible(false);

      // Info appears after zoom settles (1.2s)
      schedule(() => {
        setStepInfoVisible(true);
        // Hold for reading (2.4s), then hide
        schedule(() => {
          setStepInfoVisible(false);
          // Advance after hide animation (0.35s)
          schedule(() => {
            if (step >= 9) {
              setTourStep(-1);
              schedule(() => runStep(0), 1600);
            } else {
              runStep(step + 1);
            }
          }, 350);
        }, 2400);
      }, 1200);
    };

    // Start tour after initial reveal
    schedule(() => runStep(0), 1800);

    return () => {
      tourActiveRef.current = false;
      tourTimers.current.forEach(clearTimeout);
      tourTimers.current = [];
    };
  }, [processCombo]);

  /* ─── Zoom transform calculation ─── */
  /* Portrait vs landscape drives SVG sizing:
     - Portrait (H > W): SVG = screenW square. Prevents X-axis distortion
       from the SVG being wider than the screen.
     - Landscape (W >= H): SVG = max(vw,vh) square. Covers full section.
     Three layout tiers control zoom, target position, and overview scale:
     - Mobile (<640w): Smaller zoom, node in upper-third, compact info panel
     - Tablet (640-1279): Medium zoom, moderate node position
     - Desktop (1280+): Full zoom experience */
  const isPortrait = screenH > screenW;
  const safeIdx = tourStep >= 0 ? tourStep : 0;
  const nodeXPct = cNodes[safeIdx].x * 100 / 800;
  const nodeYPct = cNodes[safeIdx].y * 100 / 800;
  const svgSize = isPortrait ? screenW : Math.max(screenW, screenH);
  const aspectX = svgSize / screenW;   // 1 on portrait, 1 on square landscape, ~1 always now
  const aspectY = svgSize / screenH;   // <1 on portrait, >=1 on landscape
  /* Per-tier zoom, target Y (% from top where node lands), and overview scale */
  let zoomScale: number, targetY: number, overviewScale: number;
  if (screenW < 640) {
    /* ── Mobile ── */
    zoomScale = 5.5;
    targetY = 28;
    overviewScale = 1.15;
  } else if (screenW < 1280) {
    /* ── Tablet / small laptop ── */
    zoomScale = 2.3;
    targetY = isPortrait ? 30 : 35;
    overviewScale = isPortrait ? 0.6 : Math.min(screenW, screenH) / svgSize * 0.72;
  } else {
    /* ── Desktop ── */
    zoomScale = 2.6;
    targetY = 38;
    overviewScale = Math.min(screenW, screenH) / svgSize * 0.72;
  }
  const tourTx = tourStep === -1 ? 0 : zoomScale * (50 - nodeXPct) * aspectX;
  const tourTy = tourStep === -1 ? 0 : (targetY - 50) + zoomScale * (50 - nodeYPct) * aspectY;
  const tourScale = tourStep === -1 ? overviewScale : zoomScale;
  const tourRotate = 0;
  /* SVG CSS dimension — portrait: width-based, landscape: max(vw,vh) */
  const svgDim = isPortrait ? `${screenW}px` : "max(100vw, 100vh)";

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
          { label: "Services", href: "#craft" },
          { label: "Process", href: "#journey" },
          { label: "Work", href: "#portfolio" },
          { label: "Contact", href: "#contact" },
        ];
        const hF = { fontFamily: F.heading };
        const v = navCombo;

        /* shared hamburger — morphs to X */
        const burger = (color: string) => (
          <button
            className="md:hidden relative flex items-center justify-center w-10 h-10 z-[71]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-6 h-5 flex flex-col justify-center items-center">
              {/* Top line — rotates to first arm of X */}
              <span
                className="absolute block h-[1.5px] rounded-full"
                style={{
                  background: mobileMenuOpen ? C.gold : color,
                  width: mobileMenuOpen ? "22px" : "20px",
                  transform: mobileMenuOpen ? "rotate(45deg)" : "translateY(-6px)",
                  transition: "all 0.4s cubic-bezier(0.77, 0, 0.175, 1)",
                }}
              />
              {/* Middle line — collapses to nothing */}
              <span
                className="absolute block h-[1.5px] rounded-full"
                style={{
                  background: mobileMenuOpen ? C.gold : color,
                  width: "20px",
                  opacity: mobileMenuOpen ? 0 : 1,
                  transform: mobileMenuOpen ? "scaleX(0)" : "scaleX(1)",
                  transition: "all 0.3s cubic-bezier(0.77, 0, 0.175, 1)",
                }}
              />
              {/* Bottom line — rotates to second arm of X */}
              <span
                className="absolute block h-[1.5px] rounded-full"
                style={{
                  background: mobileMenuOpen ? C.gold : color,
                  width: mobileMenuOpen ? "22px" : "14px",
                  transform: mobileMenuOpen ? "rotate(-45deg)" : "translateY(6px)",
                  transition: "all 0.4s cubic-bezier(0.77, 0, 0.175, 1)",
                }}
              />
            </div>
          </button>
        );

        /* shared logo */
        const logo = (h: string) => <img src="/images/logo.webp" alt="Studio O'Brien" className={`${h} w-auto absolute left-1/2 -translate-x-1/2`} />;
        const orn = (
          <div className="flex items-center gap-2 pb-1.5 -mt-0.5">
            <div className="w-12 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${C.gold})` }} />
            <div className="w-1 h-1 rotate-45" style={{ background: C.gold }} />
            <div className="w-12 h-[1px]" style={{ background: `linear-gradient(270deg, transparent, ${C.gold})` }} />
          </div>
        );

        /* 10 stylized button + menu combos on Tight Crest base */
        /* Links — locked to Cormorant SC bold */
        const linkClass = "nav-link";
        const linkFont = { family: "'Cormorant SC', serif", size: "16px", tracking: "0.18em", weight: 700 };

        /* Button cycles through 10 combos via btnCombo */
        const b = btnCombo;
        const btnClass = `nav-btn nav-btn-${b + 1}`;

        const btnStyle: Record<string, string | number> = {
          fontFamily: F.heading,
          fontSize: "13px",
          letterSpacing: "0.1em",
          fontWeight: 700,
        };

        const btnShape: Record<string, string> = (() => {
          switch (b) {
            /* 1: Etched Original — parchment, dark border, inner double frame */
            case 0: return { background: C.parchment, color: C.deepForest, borderRadius: "2px", padding: "8px 24px", border: `1.5px solid ${C.deepForest}`, boxShadow: `inset 0 0 0 3px ${C.parchment}, inset 0 0 0 4px ${C.deepForest}30` };
            /* 2: Thinner Frame — lighter outer border, subtler inset */
            case 1: return { background: C.parchment, color: C.deepForest, borderRadius: "2px", padding: "8px 24px", border: `1px solid ${C.deepForest}60`, boxShadow: `inset 0 0 0 3px ${C.parchment}, inset 0 0 0 3.5px ${C.deepForest}18` };
            /* 3: Gold Inner — dark outer, gold inner frame */
            case 2: return { background: C.parchment, color: C.deepForest, borderRadius: "2px", padding: "8px 24px", border: `1.5px solid ${C.deepForest}`, boxShadow: `inset 0 0 0 3px ${C.parchment}, inset 0 0 0 4px ${C.gold}50` };
            /* 4: Rounded Etch — same double frame but with rounded corners */
            case 3: return { background: C.parchment, color: C.deepForest, borderRadius: "8px", padding: "8px 24px", border: `1.5px solid ${C.deepForest}`, boxShadow: `inset 0 0 0 3px ${C.parchment}, inset 0 0 0 4px ${C.deepForest}25` };
            /* 5: Wide Plate — extra horizontal padding, wider look */
            case 4: return { background: C.parchment, color: C.deepForest, borderRadius: "2px", padding: "8px 36px", border: `1.5px solid ${C.deepForest}`, boxShadow: `inset 0 0 0 3px ${C.parchment}, inset 0 0 0 4px ${C.deepForest}25` };
            /* 6: Deep Inset — thicker gap between borders, triple frame feel */
            case 5: return { background: C.parchment, color: C.deepForest, borderRadius: "2px", padding: "9px 26px", border: `1.5px solid ${C.deepForest}`, boxShadow: `inset 0 0 0 4px ${C.parchment}, inset 0 0 0 5px ${C.deepForest}20` };
            /* 7: Soft Etch — lighter border, softer shadow, more gentle */
            case 6: return { background: C.parchment, color: C.deepForest, borderRadius: "4px", padding: "8px 24px", border: `1px solid ${C.deepForest}40`, boxShadow: `inset 0 0 0 3px ${C.parchment}, inset 0 0 0 4px ${C.deepForest}12` };
            /* 8: Double Gold — both frames in gold, dark text */
            case 7: return { background: C.parchment, color: C.deepForest, borderRadius: "2px", padding: "8px 24px", border: `1.5px solid ${C.gold}`, boxShadow: `inset 0 0 0 3px ${C.parchment}, inset 0 0 0 4px ${C.gold}40` };
            /* 9: Tight Etch — smaller padding, compact, sharp */
            case 8: return { background: C.parchment, color: C.deepForest, borderRadius: "1px", padding: "6px 20px", border: `1.5px solid ${C.deepForest}`, boxShadow: `inset 0 0 0 2px ${C.parchment}, inset 0 0 0 3px ${C.deepForest}30` };
            /* 10: Beveled Plate — subtle top-light bottom-dark bevel effect */
            case 9: return { background: C.parchment, color: C.deepForest, borderRadius: "2px", padding: "8px 24px", border: `1.5px solid ${C.deepForest}`, boxShadow: `inset 0 0 0 3px ${C.parchment}, inset 0 0 0 4px ${C.deepForest}25, inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -1px 0 ${C.deepForest}10` };
            default: return { background: C.parchment, color: C.deepForest, borderRadius: "2px", padding: "8px 24px", border: `1.5px solid ${C.deepForest}`, boxShadow: `inset 0 0 0 3px ${C.parchment}, inset 0 0 0 4px ${C.deepForest}30` };
          }
        })();

        const navContent = (
          <div className="w-full flex flex-col items-center" style={{ background: C.parchment }}>
            <div className="w-full flex justify-between items-center px-6 md:px-12 py-2">
              {/* Spacer for hamburger position on mobile */}
              <div className="md:hidden w-10 h-10" />
              <div className="hidden md:flex gap-7 uppercase ml-16" style={{ color: C.deepForest, fontFamily: linkFont.family, fontSize: linkFont.size, letterSpacing: linkFont.tracking, fontWeight: linkFont.weight }}>
                {navLinks.slice(0, 3).map(l => (
                  <a key={l.label} href={l.href} className={linkClass} style={{ color: C.deepForest }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.deepForest)}
                  >{l.label}</a>
                ))}
              </div>
              {logo("h-7 md:h-11")}
              <div className="hidden md:flex items-center gap-4 ml-auto mr-16">
                <a href="#contact" className={`${btnClass} uppercase`} style={{ ...btnStyle, ...btnShape, textTransform: "uppercase" } as React.CSSProperties}>Let's Talk</a>
              </div>
            </div>
            <div className="hidden md:block">{orn}</div>
          </div>
        );

        return (
          <>
            <motion.nav style={{ opacity: headerBlur, y: headerY }} className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center">
              {navContent}
            </motion.nav>

            {/* Hamburger — fixed, above everything including menu overlay */}
            <motion.div
              className="md:hidden fixed top-0 left-0 z-[75]"
              style={{ opacity: headerBlur, y: headerY, padding: "8px 16px" }}
            >
              {burger(mobileMenuOpen ? C.gold : C.deepForest)}
            </motion.div>

            {/* Mobile fullscreen menu — animated */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  key="mobile-menu"
                  className="fixed inset-0 z-[70] flex flex-col items-center justify-center"
                  style={{ background: C.deepForest }}
                  initial={{ clipPath: "circle(0% at 28px 28px)" }}
                  animate={{ clipPath: "circle(150% at 28px 28px)" }}
                  exit={{ clipPath: "circle(0% at 28px 28px)" }}
                  transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
                >
                  {/* Background texture */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: leafPattern, backgroundSize: "80px 80px" }} />
                  {/* Subtle radial glow */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${C.emerald}15, transparent)` }} />

                  <nav className="relative flex flex-col items-center gap-10">
                    {navLinks.map((l, i) => (
                      <motion.a
                        key={l.label}
                        href={l.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-2xl tracking-[0.3em] uppercase"
                        style={{ fontFamily: F.heading, color: C.parchment }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: "easeOut" }}
                        whileHover={{ color: C.gold, x: 4 }}
                      >
                        {l.label}
                      </motion.a>
                    ))}
                  </nav>

                  {/* Ornament — fades in last */}
                  <motion.div
                    className="mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.4 }}
                  >
                    <Ornament className="w-32" color={C.gold} />
                  </motion.div>

                  {/* Gold hairline at top */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${C.gold}40, transparent)` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );
      })()}

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-start overflow-hidden" style={{ background: C.parchment }}>
        <h1 className="sr-only">Studio O'Brien — Web Design, Development & Strategy in Shelby, NC</h1>
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: leafPattern, backgroundSize: "80px 80px" }} />
        <motion.div style={{ y: heroY, opacity: heroContentOpacity }} className="relative z-10 flex flex-col items-center px-4 w-full pt-[12vh] sm:pt-[14vh]">
          {/* Motif top */}
          <motion.img
            src="/images/motif-top.webp" alt=""
            className="w-[180px] sm:w-[240px] md:w-[300px] mb-4"
            initial={{ opacity: 0, y: -8 }} animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          />
          {/* Gold hairline */}
          <motion.div
            initial={{ scaleX: 0 }} animate={heroVisible ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            style={{ width: "min(70vw, 660px)", height: 1, background: `${C.gold}50`, transformOrigin: "center" }}
          />
          {/* Est label */}
          <motion.span
            className="text-[9px] tracking-[0.6em] uppercase my-5"
            style={{ fontFamily: F.heading, color: C.gold }}
            initial={{ opacity: 0 }} animate={heroVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Est. 2025
          </motion.span>
          {/* Logo */}
          <motion.img
            src="/images/logo.webp" alt="Studio O'Brien"
            // @ts-expect-error fetchPriority is valid HTML
            fetchPriority="high"
            className="w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[720px] max-w-[780px]"
            initial={{ opacity: 1, y: 16 }} animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Location label */}
          <motion.span
            className="mt-5 text-[9px] tracking-[0.6em] uppercase"
            style={{ fontFamily: F.heading, color: C.sage }}
            initial={{ opacity: 0 }} animate={heroVisible ? { opacity: 0.6 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Shelby, North Carolina
          </motion.span>
          {/* Gold hairline */}
          <motion.div
            className="mt-5"
            initial={{ scaleX: 0 }} animate={heroVisible ? { scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
            style={{ width: "min(70vw, 660px)", height: 1, background: `${C.gold}50`, transformOrigin: "center" }}
          />
          {/* Motif bottom */}
          <motion.img
            src="/images/motif-bottom.webp" alt=""
            className="w-[180px] sm:w-[240px] md:w-[300px] mt-4 mb-6"
            initial={{ opacity: 0, y: 8 }} animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          />
          {/* Animated ornament */}
          <AnimatedOrnament
            className="w-40 sm:w-52 md:w-60 mb-5"
            color={C.gold}
            active={scrollUnlocked}
            delay={0.1}
          />
          {/* Services tagline */}
          <motion.p
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{ fontFamily: F.heading, color: C.deepForest, opacity: 0.4 }}
            initial={{ opacity: 0 }} animate={scrollUnlocked ? { opacity: 0.4 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Design &bull; Development &bull; Strategy
          </motion.p>
          {/* Mobile-only CTAs — Gilt Frame */}
          <motion.div
            className="flex md:hidden gap-4 mt-16"
            initial={{ opacity: 0, y: 12 }}
            animate={scrollUnlocked ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <a
              href="#contact"
              className="uppercase"
              style={{ fontFamily: F.heading, fontWeight: 700, background: C.gold, color: C.deepForest, borderRadius: "2px", padding: "10px 28px", fontSize: "11px", letterSpacing: "0.15em", border: "none", boxShadow: `0 1px 4px ${C.deepForest}25` }}
            >Let's Talk</a>
            <a
              href="#portfolio"
              className="uppercase"
              style={{ fontFamily: F.heading, fontWeight: 700, background: "transparent", color: C.deepForest, borderRadius: "2px", padding: "10px 28px", fontSize: "11px", letterSpacing: "0.15em", border: `1px solid ${C.deepForest}30` }}
            >See Our Work</a>
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={scrollUnlocked ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} style={{ opacity: scrollUnlocked ? scrollPromptOpacity : 0 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: F.heading, color: C.sage }}>Scroll</span>
          <div className="w-5 h-8 rounded-full border flex justify-center pt-1.5" style={{ borderColor: `${C.sage}60` }}><div className="w-1 h-2 rounded-full" style={{ background: C.sage, animation: "hg-scroll-bounce 2s ease-in-out infinite" }} /></div>
        </motion.div>
      </section>


      {/* ═══════════════════ SERVICES / OUR CRAFT ═══════════════════ */}
      <section
        id="craft"
        className="relative overflow-visible"
        style={{
          background: C.deepForest,
          color: C.parchment,
          zIndex: 30,
          height: "220vh",
          marginTop: "-1px",
        }}
      >
        {/* ── Section transition — gold hairline ── */}
        <div className="absolute left-0 right-0 z-[3] pointer-events-none" style={{ top: "-1px" }}>
          <div style={{ height: "1px", background: C.gold }} />
        </div>

        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: leafPattern, backgroundSize: "80px 80px" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${C.emerald}20, transparent)` }}
        />

        {/* ── Section Header ── */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="relative z-30 pt-[492px] sm:pt-[357px] pb-6 px-2 sm:px-6" style={{ overflow: "visible" }}>
          <div className="text-center" style={{ overflow: "visible" }}>
            <p className="text-[11px] sm:text-[13px] tracking-[0.6em] uppercase mb-3 sm:mb-5" style={{ fontFamily: F.heading, color: C.gold }}>What We Do</p>
            <div className="relative" style={{ marginTop: isMobile ? "12px" : "31px", overflow: "visible" }}>
              <h2 className="text-[29vw] sm:text-[12rem] md:text-[19.2rem] tracking-[-0.02em] sm:tracking-[0.14em] uppercase leading-[0.85] font-bold" style={{
                fontFamily: F.heading,
                color: C.gold,
                maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
                textIndent: isMobile ? "-5px" : "0",
              }}>
                CRAFT
              </h2>
              <p className="relative text-[14.3px] sm:text-xl tracking-[0.15em] sm:tracking-[0.2em] uppercase opacity-60" style={{ fontFamily: F.heading, color: C.parchment, marginTop: isMobile ? "-10px" : "-22px" }}>
                Design · Development · Strategy
              </p>
            </div>
          </div>
        </motion.div>

        {/* Gradient mask — top dissolve */}
        <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{
          top: "540px",
          height: "200px",
          background: `linear-gradient(to bottom, ${C.deepForest} 0%, ${C.deepForest} 20%, transparent 100%)`,
        }} />
        {/* Gradient mask — bottom dissolve */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none" style={{
          height: "120px",
          background: `linear-gradient(to top, ${C.deepForest}, transparent)`,
        }} />

        {/* ── 3-TRACK INFINITE CONVEYOR BELT ── */}
        {(() => {
          const trackItems = [...services, ...services, ...services, ...services];
          const track1 = trackItems;
          const track2 = [...services.slice(2), ...services.slice(0, 2), ...services, ...services, ...services.slice(2), ...services.slice(0, 2)];
          const track3 = [...services.slice(1), ...services.slice(0, 1), ...services, ...services, ...services.slice(1), ...services.slice(0, 1)];

          /* ── FIXED DIMENSIONS — identical at every breakpoint ── */
          const cardW = 380;
          const cardH = 520;
          const gap = 42;
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

          /* ─── Lucide icon map for services ─── */
          const lucideIcon = (key: string, color: string, size: number) => {
            const props = { color, size, strokeWidth: 1.5 };
            switch (key) {
              case "tower": return <Globe {...props} />;
              case "scroll": return <Target {...props} />;
              case "brain": return <Bot {...props} />;
              case "quill": return <Sparkles {...props} />;
              case "lens": return <Search {...props} />;
              case "compass": return <Megaphone {...props} />;
              case "book": return <BookOpen {...props} />;
              case "gears": return <Cog {...props} />;
              case "crystal": return <BarChart3 {...props} />;
              default: return <Globe {...props} />;
            }
          };

          /* ─── 10 emblem treatments — only the watermark changes ─── */

          const renderEmblem = (s: typeof services[0], ac: string, v: number) => {
            const ico = (size: number, extra?: React.CSSProperties) => (
              <div className="absolute pointer-events-none" style={extra}>
                {lucideIcon(s.iconKey, ac, size)}
              </div>
            );

            /* 1: Soft Centered — current default, clean centered watermark */
            if (v === 0) return ico(160, { left: "50%", top: "50%", transform: "translate(-50%, -45%)", opacity: 0.07 });

            /* 2: Dome Crown — icon sits in the arch dome area, large and proud */
            if (v === 1) return ico(200, { left: "50%", top: "8%", transform: "translateX(-50%)", opacity: 0.06 });

            /* 3: Blurred Halo — icon with heavy blur creating a soft glow */
            if (v === 2) return (
              <div className="absolute pointer-events-none" style={{ left: "50%", top: "45%", transform: "translate(-50%, -50%)", opacity: 0.12, filter: "blur(12px)" }}>
                {lucideIcon(s.iconKey, ac, 180)}
              </div>
            );

            /* 4: Ghost Echo — two icons stacked, offset, different sizes */
            if (v === 3) return (<>
              {ico(200, { left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: 0.04 })}
              {ico(100, { left: "50%", top: "48%", transform: "translate(-50%, -50%)", opacity: 0.09 })}
            </>);

            /* 5: Radial Burst — icon with radiating concentric circles */
            if (v === 4) return (<>
              <div className="absolute pointer-events-none" style={{ left: "50%", top: "42%", transform: "translate(-50%, -50%)", width: "260px", height: "260px", borderRadius: "50%", border: `1px solid ${ac}`, opacity: 0.04 }} />
              <div className="absolute pointer-events-none" style={{ left: "50%", top: "42%", transform: "translate(-50%, -50%)", width: "190px", height: "190px", borderRadius: "50%", border: `1px solid ${ac}`, opacity: 0.06 }} />
              <div className="absolute pointer-events-none" style={{ left: "50%", top: "42%", transform: "translate(-50%, -50%)", width: "120px", height: "120px", borderRadius: "50%", border: `1px solid ${ac}`, opacity: 0.08 }} />
              {ico(80, { left: "50%", top: "42%", transform: "translate(-50%, -50%)", opacity: 0.1 })}
            </>);

            /* 6: Corner Drift — icon floats in top-right, rotated, atmospheric */
            if (v === 5) return ico(180, { right: "-15%", top: "5%", transform: "rotate(15deg)", opacity: 0.05 });

            /* 7: Double Layer — sharp small icon over massive blurred one */
            if (v === 6) return (<>
              <div className="absolute pointer-events-none" style={{ left: "50%", top: "40%", transform: "translate(-50%, -50%)", opacity: 0.04, filter: "blur(8px)" }}>
                {lucideIcon(s.iconKey, ac, 240)}
              </div>
              {ico(70, { left: "50%", top: "25%", transform: "translate(-50%, -50%)", opacity: 0.12 })}
            </>);

            /* 8: Etched Ring — icon inside a thin decorative circle with dots */
            if (v === 7) return (<>
              <div className="absolute pointer-events-none" style={{ left: "50%", top: "38%", transform: "translate(-50%, -50%)", width: "180px", height: "180px", borderRadius: "50%", border: `1.5px dashed ${ac}`, opacity: 0.08 }} />
              <div className="absolute pointer-events-none" style={{ left: "50%", top: "38%", transform: "translate(-50%, -50%)", width: "160px", height: "160px", borderRadius: "50%", border: `0.5px solid ${ac}`, opacity: 0.06 }} />
              {ico(90, { left: "50%", top: "38%", transform: "translate(-50%, -50%)", opacity: 0.09 })}
            </>);

            /* 9: Scattered Seeds — three small icons scattered at different angles */
            if (v === 8) return (<>
              {ico(60, { left: "15%", top: "15%", transform: "rotate(-20deg)", opacity: 0.06 })}
              {ico(90, { left: "55%", top: "35%", transform: "rotate(10deg)", opacity: 0.05 })}
              {ico(45, { right: "10%", top: "60%", transform: "rotate(25deg)", opacity: 0.07 })}
            </>);

            /* 10: Monumental — fills entire card height, ultra faint */
            return ico(340, { left: "50%", top: "50%", transform: "translate(-50%, -50%)", opacity: 0.035 });
          };

          const renderCard = (s: typeof services[0], filled: boolean) => {
            const tc = filled ? C.deepForest : C.parchment;
            const ac = filled ? C.deepForest : C.gold;
            const bf = bodyFonts[4]; /* Locked: Libre Baskerville */

            return (
              <div className="relative z-10 flex flex-col items-center h-full px-6 overflow-hidden">
                {/* Spacer */}
                <div style={{ flex: "1 1 0", minHeight: "22%" }} />
                {/* Emblem — swappable treatment */}
                {renderEmblem(s, ac, cardCombo)}
                {/* Title — Cinzel bold, locked */}
                <h3 className="text-[28px] tracking-[0.06em] uppercase text-center leading-tight mb-4 relative" style={{ fontFamily: F.heading, color: tc, fontWeight: 700 }}>{s.title}</h3>
                {/* Divider */}
                <div className="w-16 mb-4 relative" style={{ height: "2px", background: `${ac}35` }} />
                {/* Body — Libre Baskerville, locked */}
                <p className="text-center max-w-[90%] relative" style={{
                  fontFamily: bf.css,
                  fontWeight: bf.weight,
                  fontSize: bf.size,
                  lineHeight: bf.lh,
                  color: tc,
                  opacity: 0.85,
                }}>{s.desc}</p>
                <div style={{ flex: "1 1 0", minHeight: "8%" }} />
              </div>
            );
          };

          return (
            <div className="absolute inset-0 z-10 flex items-start justify-center" style={{ paddingTop: "620px" }}>
              <div className="flex h-full" style={{ width: `${containerW}px`, gap: `${gap}px` }}>
                {tracks.map((trackServices, colIdx) => {
                  const filled = colCount === 1 ? true : colIdx !== 1;
                  const dir = trackDirections[colIdx] ?? "up";
                  const dur = trackDurations[colIdx] ?? "35s";

                  return (
                    <div key={colIdx} className="craft-track relative" style={{ width: `${cardW}px`, overflow: "hidden", maskImage: "linear-gradient(to bottom, transparent 0%, black 3%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 3%, black 92%, transparent 100%)" }}>
                      <div
                        className="craft-track-inner flex flex-col"
                        style={{
                          gap: `${gap}px`,
                          animation: `hg-track-${dir} ${dur} linear infinite`,
                        }}
                      >
                        {trackServices.map((s, i) => {
                          const isFilled = colCount === 1 ? i % 2 === 0 : filled;

                          const filledBg = { background: `linear-gradient(175deg, ${C.brightGold}, ${C.gold} 30%, ${C.paleGold} 55%, ${C.gold} 75%, ${C.brightGold})`, boxShadow: `inset 0 2px 8px ${C.deepForest}15, inset 0 -2px 8px ${C.deepForest}10` };
                          const outlinedBg = { background: C.deepForest, border: `1.5px solid ${C.gold}50`, boxShadow: `inset 0 0 30px ${C.gold}06` };

                          return (
                            <div
                              key={`${colIdx}-${i}`}
                              className="relative flex-shrink-0 overflow-hidden cursor-default"
                              style={{
                                borderRadius: archRadius,
                                width: `${cardW}px`,
                                height: `${cardH}px`,
                                minHeight: `${cardH}px`,
                                ...(isFilled ? filledBg : outlinedBg),
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
      <Section bg={C.deepForest} color={C.parchment} className="!py-64 md:!py-80" overlay={<div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: leafPattern, backgroundSize: "80px 80px" }} />}>
        <div className="flex flex-col md:flex-row items-start gap-10 md:gap-14">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="w-[70%] mx-auto md:w-[28%] md:mx-0 flex-shrink-0">
            <div className="relative aspect-[3/4] rounded-sm overflow-hidden" style={{ border: `2px solid ${C.gold}` }}>
              <img src="/images/portrait.webp" alt="J. O'Brien, Founder" className="w-full h-full object-cover" loading="lazy" decoding="async" width={700} height={700} />
              <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: `linear-gradient(to top, ${C.deepForest}, transparent)` }} />
            </div>
            <div className="mt-4 text-center">
              <span className="block text-base tracking-[0.2em] uppercase font-bold" style={{ fontFamily: F.heading, color: C.parchment }}>J. O'Brien</span>
              <span className="text-sm tracking-wider opacity-65" style={{ fontFamily: "'Crimson Text', serif", fontStyle: "italic" }}>Founder</span>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ delay: 0.15 }} className="flex-1 md:pt-0">
            {philCombo === 0 && (<>
              {/* 1 — "Built, Not Assembled" + Fraunces 900 */}
              <p className="text-[11px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
              <h2 className="text-4xl md:text-6xl tracking-tight mb-3 leading-[1]" style={{ fontFamily: "'Fraunces', serif", color: C.parchment, fontWeight: 900 }}>Built, Not Assembled</h2>
              <p className="text-xs tracking-[0.3em] uppercase mb-8 opacity-40" style={{ fontFamily: F.heading, color: C.parchment }}>Design · Development · Strategy</p>
              <div className="w-16 mb-8" style={{ height: "1px", background: C.gold }} />
              <p className="text-lg md:text-xl leading-[1.75] opacity-80 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Every website we create starts from nothing. No templates, no themes, no drag-and-drop shortcuts. Just intention, craft, and an obsessive refusal to settle.</p>
              <p className="text-base leading-[1.7] opacity-55 mb-8" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Studio O'Brien exists because most of the web looks the same. Your business deserves something that was actually made for it. Not adapted from a kit that ten thousand other sites already use.</p>
              <Ornament className="w-32 md:w-48" color={C.gold} />
            </>)}
            {philCombo === 1 && (<>
              {/* 2 — "The Details Are the Design" + Instrument Serif */}
              <p className="text-[11px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
              <h2 className="text-4xl md:text-6xl tracking-tight mb-3 leading-[1]" style={{ fontFamily: "'Instrument Serif', serif", color: C.parchment, fontWeight: 400 }}>The Details Are the Design</h2>
              <p className="text-xs tracking-[0.3em] uppercase mb-8 opacity-40" style={{ fontFamily: F.heading, color: C.parchment }}>Design · Development · Strategy</p>
              <div className="w-16 mb-8" style={{ height: "1px", background: C.gold }} />
              <p className="text-lg md:text-xl leading-[1.75] opacity-80 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>We obsess over the things most people never notice. The weight of a font. The timing of an animation. The way a page makes you feel before you've read a single word. When everything is intentional, people feel it.</p>
              <p className="text-base leading-[1.7] opacity-55 mb-8" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Studio O'Brien builds websites that feel considered. Crafted. Like someone actually gave a damn. Because someone did.</p>
              <Ornament className="w-32 md:w-48" color={C.gold} />
            </>)}
            {philCombo === 2 && (<>
              {/* 3 — "Good Enough Never Is" + DM Serif Display */}
              <p className="text-[11px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
              <h2 className="text-4xl md:text-6xl tracking-tight mb-3 leading-[1]" style={{ fontFamily: "'DM Serif Display', serif", color: C.parchment, fontWeight: 400 }}>Good Enough Never Is</h2>
              <p className="text-xs tracking-[0.3em] uppercase mb-8 opacity-40" style={{ fontFamily: F.heading, color: C.parchment }}>Design · Development · Strategy</p>
              <div className="w-16 mb-8" style={{ height: "1px", background: C.gold }} />
              <p className="text-lg md:text-xl leading-[1.75] opacity-80 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Templates are fast. Themes are cheap. And you can always tell. We build from scratch because the businesses we work with deserve more than "close enough."</p>
              <p className="text-base leading-[1.7] opacity-55 mb-8" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Every pixel, every interaction, every word. Placed with purpose. Studio O'Brien exists for businesses that refuse to blend in.</p>
              <Ornament className="w-32 md:w-48" color={C.gold} />
            </>)}
            {philCombo === 3 && (<>
              {/* 4 — "One Maker. Zero Shortcuts." + Playfair Display 500 */}
              <p className="text-[11px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
              <h2 className="text-4xl md:text-6xl tracking-tight mb-3 leading-[1]" style={{ fontFamily: "'Playfair Display', serif", color: C.parchment, fontWeight: 500 }}>One Maker. Zero Shortcuts.</h2>
              <p className="text-xs tracking-[0.3em] uppercase mb-8 opacity-40" style={{ fontFamily: F.heading, color: C.parchment }}>Design · Development · Strategy</p>
              <div className="w-16 mb-8" style={{ height: "1px", background: C.gold }} />
              <p className="text-lg md:text-xl leading-[1.75] opacity-80 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>You won't be handed off to a junior designer or run through a production line. Every project gets my full attention, my actual taste, and more revisions than is probably healthy.</p>
              <p className="text-base leading-[1.7] opacity-55 mb-8" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Studio O'Brien is a one-person studio by design. Smaller means more care, more craft, and a final product that actually reflects who you are. Not who your template vendor decided you should be.</p>
              <Ornament className="w-32 md:w-48" color={C.gold} />
            </>)}
            {philCombo === 4 && (<>
              {/* 5 — "craft is the strategy" + Cinzel 700 */}
              <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
              <h2 className="text-5xl md:text-7xl tracking-[0.04em] mb-4 leading-[0.95]" style={{ fontFamily: F.heading, color: C.parchment, fontWeight: 700 }}>craft is the strategy</h2>
              <p className="text-sm tracking-[0.3em] uppercase mb-8 opacity-40" style={{ fontFamily: F.heading, color: C.parchment }}>Design · Development · Strategy</p>
              <div className="w-20 mb-5" style={{ height: "1px", background: C.gold }} />
              <p className="text-xl md:text-2xl leading-[1.7] opacity-80 mb-3" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>The most strategic thing you can do is build something real. Something one person actually made, with intent behind every decision and purpose behind every pixel.</p>
              <div className="w-10 my-2" style={{ height: "1px", background: `${C.gold}30` }} />
              <p className="text-lg leading-[1.7] opacity-55 mb-5" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Studio O'Brien merges design instinct with modern capability. Work that performs, yes. But more than that, work that resonates. That's what turns visitors into believers.</p>
              <Ornament className="w-32 md:w-48" color={C.gold} />
            </>)}
            {philCombo === 5 && (<>
              {/* 6 — "We Build What Templates Can't" + Young Serif */}
              <p className="text-[11px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
              <h2 className="text-4xl md:text-6xl tracking-tight mb-3 leading-[1]" style={{ fontFamily: "'Young Serif', serif", color: C.parchment, fontWeight: 400 }}>We Build What Templates Can't</h2>
              <p className="text-xs tracking-[0.3em] uppercase mb-8 opacity-40" style={{ fontFamily: F.heading, color: C.parchment }}>Design · Development · Strategy</p>
              <div className="w-16 mb-8" style={{ height: "1px", background: C.gold }} />
              <p className="text-lg md:text-xl leading-[1.75] opacity-80 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>There's a ceiling to what pre-made solutions can do. It shows in the layouts that all look the same, the interactions that all feel the same. We start from zero so you don't end up at average.</p>
              <p className="text-base leading-[1.7] opacity-55 mb-8" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Every Studio O'Brien project is built by hand. Designed, coded, and refined until it's something only your business could own.</p>
              <Ornament className="w-32 md:w-48" color={C.gold} />
            </>)}
            {philCombo === 6 && (<>
              {/* 7 — "Obsession Is the Method" + Bodoni Moda 700 */}
              <p className="text-[11px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
              <h2 className="text-4xl md:text-6xl tracking-tight mb-3 leading-[1]" style={{ fontFamily: "'Bodoni Moda', serif", color: C.parchment, fontWeight: 700 }}>Obsession Is the Method</h2>
              <p className="text-xs tracking-[0.3em] uppercase mb-8 opacity-40" style={{ fontFamily: F.heading, color: C.parchment }}>Design · Development · Strategy</p>
              <div className="w-16 mb-8" style={{ height: "1px", background: C.gold }} />
              <p className="text-lg md:text-xl leading-[1.75] opacity-80 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>We don't have a "good enough" threshold. Every font weight, every color value, every hover state gets the same unreasonable attention. That's not a bug. It's the entire point.</p>
              <p className="text-base leading-[1.7] opacity-55 mb-8" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Studio O'Brien builds for businesses that understand something simple. The details aren't decoration. They're what separates forgettable from unforgettable.</p>
              <Ornament className="w-32 md:w-48" color={C.gold} />
            </>)}
            {philCombo === 7 && (<>
              {/* 8 — "Every Pixel Earned" + Literata 900 */}
              <p className="text-[11px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
              <h2 className="text-4xl md:text-6xl tracking-tight mb-3 leading-[1]" style={{ fontFamily: "'Literata', serif", color: C.parchment, fontWeight: 900 }}>Every Pixel Earned</h2>
              <p className="text-xs tracking-[0.3em] uppercase mb-8 opacity-40" style={{ fontFamily: F.heading, color: C.parchment }}>Design · Development · Strategy</p>
              <div className="w-16 mb-8" style={{ height: "1px", background: C.gold }} />
              <p className="text-lg md:text-xl leading-[1.75] opacity-80 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Nothing in our work is default. No auto-generated layouts, no stock solutions, no "that'll do." Every element exists because it was chosen, tested, and refined.</p>
              <p className="text-base leading-[1.7] opacity-55 mb-8" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Studio O'Brien is a craft studio. Small by choice, meticulous by nature. We build digital experiences that feel like someone actually cared. Because someone did.</p>
              <Ornament className="w-32 md:w-48" color={C.gold} />
            </>)}
            {philCombo === 8 && (<>
              {/* 9 — "Your Brand Deserves a Maker" + Cormorant Infant 700 */}
              <p className="text-[11px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
              <h2 className="text-4xl md:text-6xl tracking-tight mb-3 leading-[1]" style={{ fontFamily: "'Cormorant Infant', serif", color: C.parchment, fontWeight: 700 }}>Your Brand Deserves a Maker</h2>
              <p className="text-xs tracking-[0.3em] uppercase mb-8 opacity-40" style={{ fontFamily: F.heading, color: C.parchment }}>Design · Development · Strategy</p>
              <div className="w-16 mb-8" style={{ height: "1px", background: C.gold }} />
              <p className="text-lg md:text-xl leading-[1.75] opacity-80 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Not an agency. Not a template marketplace. A maker. Someone who treats your business like their own and builds something worthy of it.</p>
              <p className="text-base leading-[1.7] opacity-55 mb-8" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Studio O'Brien combines design instinct, development skill, and genuine care into work that stands apart. One person. Full attention. No shortcuts.</p>
              <Ornament className="w-32 md:w-48" color={C.gold} />
            </>)}
            {philCombo === 9 && (<>
              {/* 10 — "Where Craft Meets Conviction" + Noto Serif Display 900 */}
              <p className="text-[11px] tracking-[0.35em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>Our Philosophy</p>
              <h2 className="text-4xl md:text-6xl tracking-tight mb-3 leading-[1]" style={{ fontFamily: "'Noto Serif Display', serif", color: C.parchment, fontWeight: 900 }}>Where Craft Meets Conviction</h2>
              <p className="text-xs tracking-[0.3em] uppercase mb-8 opacity-40" style={{ fontFamily: F.heading, color: C.parchment }}>Design · Development · Strategy</p>
              <div className="w-16 mb-8" style={{ height: "1px", background: C.gold }} />
              <p className="text-lg md:text-xl leading-[1.75] opacity-80 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>The best work comes from caring too much. About the typography, the timing, the way a page makes someone feel before they've read a single word.</p>
              <p className="text-base leading-[1.7] opacity-55 mb-8" style={{ fontFamily: "'Crimson Text', serif", fontWeight: 400 }}>Studio O'Brien builds websites that convince. When craft is real, people trust it.</p>
              <Ornament className="w-32 md:w-48" color={C.gold} />
            </>)}
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════ PROCESS / THE JOURNEY ═══════════════════ */}
      <LeafReveal side="left">
      <section
        id="journey"
        className="relative overflow-hidden"
        style={{ background: C.forest, color: C.parchment, minHeight: "100vh" }}
      >
        {/* Leaf pattern underlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: leafPattern,
            backgroundSize: "80px 80px",
          }}
        />

        {/* ── Full-bleed constellation background ── */}
        {processCombo === 0 && (
          <div className="absolute inset-0" style={{ zIndex: 1 }}>
            {/* Transformable SVG wrapper — zooms & rotates to each node */}
            <motion.div
              animate={{ scale: tourScale, x: `${tourTx}%`, y: `${tourTy}%` }}
              transition={{ duration: tourStep === -1 ? 1 : 1.1, ease: [0.4, 0, 0.1, 1] }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ willChange: "transform", transformOrigin: "50% 50%", backfaceVisibility: "hidden" as const }}
            >
                <svg viewBox="0 0 800 800" style={{ width: svgDim, height: svgDim, shapeRendering: "geometricPrecision" }}>
                  <defs>
                    <pattern id="hatchGold" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="6" stroke={C.gold} strokeWidth="0.5" opacity="0.18" />
                    </pattern>
                    <pattern id="hatchFine" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(-45)">
                      <line x1="0" y1="0" x2="0" y2="4" stroke={C.gold} strokeWidth="0.3" opacity="0.1" />
                    </pattern>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={C.gold} stopOpacity={0.12} />
                      <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                    </radialGradient>
                    <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={C.brightGold} stopOpacity={0.35} />
                      <stop offset="60%" stopColor={C.gold} stopOpacity={0.08} />
                      <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                    </radialGradient>
                    {cNodes.map((node, i) => (
                      <clipPath key={`vp-clip-${i}`} id={`vpClip${i}`}>
                        <circle cx={node.x} cy={node.y} r={cOverlapR} />
                      </clipPath>
                    ))}
                  </defs>

                  {/* Interlocking overlap circles */}
                  {cNodes.map((node, i) => (
                    <circle key={`overlap-${i}`} cx={node.x} cy={node.y} r={cOverlapR}
                      fill="none" stroke={C.gold} strokeWidth="0.5"
                      opacity={tourStep === i ? 0.25 : 0.08}
                      style={{ transition: "opacity 0.8s ease" }}
                    />
                  ))}

                  {/* Vesica piscis hatched fills */}
                  {cNodes.map((_node, i) => {
                    const next = cNodes[(i + 1) % 10];
                    return (
                      <circle key={`vp-${i}`} cx={next.x} cy={next.y} r={cOverlapR}
                        fill="url(#hatchGold)" clipPath={`url(#vpClip${i})`} opacity="0.6"
                      />
                    );
                  })}

                  {/* Radial web — lines from each node to center */}
                  {cNodes.map((node, i) => (
                    <line key={`web-${i}`} x1={node.x} y1={node.y} x2={cxP} y2={cyP}
                      stroke={C.gold} strokeWidth={tourStep === i ? 1 : 0.5}
                      opacity={tourStep === i ? 0.3 : 0.08}
                      style={{ transition: "all 0.8s ease" }}
                    />
                  ))}

                  {/* Star pentagon A (nodes 0,2,4,6,8) */}
                  <path d={cStarPath([0, 2, 4, 6, 8])}
                    fill="none" stroke={C.gold} strokeWidth="1" opacity="0.18"
                  />
                  {/* Star pentagon B (nodes 1,3,5,7,9) */}
                  <path d={cStarPath([1, 3, 5, 7, 9])}
                    fill="none" stroke={C.brightGold} strokeWidth="0.8" opacity="0.12"
                  />

                  {/* Decagon outline */}
                  <polygon
                    points={cNodes.map(n => `${n.x.toFixed(2)},${n.y.toFixed(2)}`).join(" ")}
                    fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.12"
                  />

                  {/* ═══ Center Medallion — Architectural Blueprint Hub ═══ */}
                  <g>
                    {/* Outer glow halo */}
                    <circle cx={cxP} cy={cyP} r="90" fill="url(#centerGlow)" />

                    {/* Outermost ring — 60 precision tick marks (clock/compass face) */}
                    {cTicks.map((t, i) => (
                      <line key={`tick-${i}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                        stroke={C.gold} strokeWidth={i % 5 === 0 ? 1.2 : 0.3} opacity={i % 5 === 0 ? 0.45 : 0.12} />
                    ))}

                    {/* Triple concentric border rings */}
                    <circle cx={cxP} cy={cyP} r="78" fill="none" stroke={C.gold} strokeWidth="0.4" opacity="0.12" />
                    <circle cx={cxP} cy={cyP} r="68" fill="none" stroke={C.gold} strokeWidth="0.3" opacity="0.08" strokeDasharray="2 3" />
                    <circle cx={cxP} cy={cyP} r="58" fill="none" stroke={C.gold} strokeWidth="1.5" opacity="0.35" />
                    <circle cx={cxP} cy={cyP} r="56" fill="none" stroke={C.gold} strokeWidth="0.4" opacity="0.15" />

                    {/* Hatched annulus between r=56 and r=50 */}
                    <circle cx={cxP} cy={cyP} r="53" fill="url(#hatchFine)" />
                    <circle cx={cxP} cy={cyP} r="50" fill={C.deepForest} />
                    <circle cx={cxP} cy={cyP} r="50" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.3" />

                    {/* 8-pointed architectural star (two overlapping rotated squares) */}
                    {[0, 45].map(rot => (
                      <rect key={`star-sq-${rot}`} x={cxP - 32} y={cyP - 32} width="64" height="64"
                        fill="none" stroke={C.gold} strokeWidth="0.6" opacity="0.2"
                        transform={`rotate(${rot}, ${cxP}, ${cyP})`}
                      />
                    ))}
                    {/* Inner diamond from the star intersection */}
                    <polygon
                      points={[0, 90, 180, 270].map(deg => {
                        const r = 24;
                        return `${cxP + r * Math.cos(deg * Math.PI / 180)},${cyP + r * Math.sin(deg * Math.PI / 180)}`;
                      }).join(" ")}
                      fill="none" stroke={C.gold} strokeWidth="0.8" opacity="0.25"
                    />

                    {/* 16-point compass rose — graduated spokes */}
                    {cRosePoints.map((r, i) => (
                      <line key={`rose-${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                        stroke={C.brightGold} strokeWidth={i % 4 === 0 ? 1.8 : i % 2 === 0 ? 1 : 0.4} opacity={i % 4 === 0 ? 0.55 : 0.2} />
                    ))}

                    {/* 4 cardinal arrowhead ornaments */}
                    {[0, 4, 8, 12].map(idx => {
                      const a = (2 * Math.PI * idx) / 16;
                      const tipX = cxP + 42 * Math.cos(a), tipY = cyP + 42 * Math.sin(a);
                      const lx = cxP + 6 * Math.cos(a + Math.PI / 2), ly = cyP + 6 * Math.sin(a + Math.PI / 2);
                      const rx = cxP + 6 * Math.cos(a - Math.PI / 2), ry = cyP + 6 * Math.sin(a - Math.PI / 2);
                      return <polygon key={`card-${idx}`} points={`${tipX},${tipY} ${lx},${ly} ${cxP},${cyP} ${rx},${ry}`} fill={C.gold} opacity="0.1" />;
                    })}

                    {/* Inner filled hub */}
                    <circle cx={cxP} cy={cyP} r="20" fill={C.deepForest} />
                    <circle cx={cxP} cy={cyP} r="20" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.45" />
                    <circle cx={cxP} cy={cyP} r="17" fill="none" stroke={C.gold} strokeWidth="0.3" opacity="0.2" />

                    {/* 5 service offering labels around inner ring */}
                    {(() => {
                      const offerings = ["DESIGN", "BUILD", "STRATEGY", "LAUNCH", "GROW"];
                      const labelR = 63;
                      return offerings.map((label, i) => {
                        const a = (2 * Math.PI * i) / 5 - Math.PI / 2;
                        const lx = cxP + labelR * Math.cos(a);
                        const ly = cyP + labelR * Math.sin(a);
                        const rotDeg = (a * 180) / Math.PI + (a > Math.PI / 2 && a < (3 * Math.PI) / 2 ? 180 : 0);
                        return (
                          <text key={`off-${i}`} x={lx} y={ly}
                            textAnchor="middle" dominantBaseline="middle"
                            fontSize="5" letterSpacing="2.5" fill={C.paleGold} opacity="0.45"
                            fontFamily="'Cormorant SC', serif" fontWeight="400"
                            transform={`rotate(${rotDeg.toFixed(1)},${lx.toFixed(1)},${ly.toFixed(1)})`}
                          >{label}</text>
                        );
                      });
                    })()}

                    {/* 10 small dots on the r=56 ring at step angles */}
                    {cNodes.map((_, i) => {
                      const a = (2 * Math.PI * i) / 10 - Math.PI / 2;
                      return (
                        <circle key={`hub-dot-${i}`} cx={cxP + 56 * Math.cos(a)} cy={cyP + 56 * Math.sin(a)} r="1.5"
                          fill={C.gold} opacity={tourStep === i ? 0.8 : 0.2}
                          style={{ transition: "opacity 0.4s ease" }}
                        />
                      );
                    })}

                    {/* Center crosshair — architectural precision mark */}
                    <line x1={cxP - 10} y1={cyP} x2={cxP + 10} y2={cyP} stroke={C.gold} strokeWidth="0.6" opacity="0.4" />
                    <line x1={cxP} y1={cyP - 10} x2={cxP} y2={cyP + 10} stroke={C.gold} strokeWidth="0.6" opacity="0.4" />
                    <circle cx={cxP} cy={cyP} r="3" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.35" />
                    <circle cx={cxP} cy={cyP} r="1.2" fill={C.gold} opacity="0.5" />
                  </g>

                  {/* Phase labels along outer edge */}
                  {cPhaseArcs.map((p, i) => (
                    <text key={`phase-${i}`} x={p.x} y={p.y}
                      textAnchor="middle" dominantBaseline="middle"
                      fontSize="8" letterSpacing="3.5" fill={C.paleGold} opacity="0.35"
                      fontFamily="'Cormorant SC', serif" fontWeight="400"
                      transform={`rotate(${p.rotate.toFixed(1)},${p.x.toFixed(1)},${p.y.toFixed(1)})`}
                    >{p.label}</text>
                  ))}

                  {/* Active node glow rings — CSS transitions only, no remount */}
                  {cNodes.map((node, i) => (
                    <circle
                      key={`glow-${i}`}
                      cx={node.x} cy={node.y} r="36"
                      fill="url(#nodeGlow)" stroke={C.brightGold} strokeWidth="1"
                      opacity={tourStep === i ? 0.45 : 0}
                      style={{ transition: "opacity 0.6s ease" }}
                    />
                  ))}

                  {/* Node badges at each decagon vertex */}
                  {cNodes.map((node, i) => {
                    const isActive = tourStep === i;
                    return (
                      <g key={`badge-${i}`}>
                        {/* Outer decorative ring */}
                        <circle cx={node.x} cy={node.y} r="26" fill="none" stroke={C.gold} strokeWidth="0.4"
                          opacity={isActive ? 0.5 : 0.12}
                          style={{ transition: "opacity 0.6s ease" }}
                        />
                        {/* Main ring */}
                        <circle cx={node.x} cy={node.y} r="22" fill="none" stroke={C.gold}
                          strokeWidth={isActive ? 2.5 : 1.5}
                          opacity={isActive ? 1 : 0.5}
                          style={{ transition: "all 0.6s ease" }}
                        />
                        {/* Inner fill */}
                        <circle cx={node.x} cy={node.y} r="18" fill={C.deepForest} stroke={C.gold} strokeWidth="0.5" opacity="0.95" />
                        {/* Step number */}
                        <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="middle"
                          fontSize={isActive ? 12 : 10} fontWeight="300" fill={isActive ? C.brightGold : C.gold} fontFamily="'Cormorant Garamond', serif"
                          letterSpacing="0.5" style={{ transition: "all 0.4s ease" }}
                        >{proc[i].n}</text>
                        {/* Step name (below badge — visible at zoom) */}
                        <text x={node.x} y={node.y + 34} textAnchor="middle" dominantBaseline="middle"
                          fontSize="7" fill={C.parchment} fontFamily="'Cormorant SC', serif"
                          letterSpacing="2" fontWeight="400"
                          opacity={isActive ? 0.85 : 0.4}
                          style={{ transition: "opacity 0.4s ease" }}
                        >{proc[i].name.toUpperCase()}</text>
                      </g>
                    );
                  })}

                  {/* Connecting arc highlight for active phase — CSS transition only */}
                  {cPhases.map((phase, pi) => {
                    const n1 = cNodes[phase.from], n2 = cNodes[phase.to];
                    const isActive = tourStep >= 0 && Math.floor(tourStep / 2) === pi;
                    return (
                      <line key={`arc-${pi}`}
                        x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                        stroke={C.brightGold} strokeWidth="1.5" strokeDasharray="4 4"
                        opacity={isActive ? 0.4 : 0}
                        style={{ transition: "opacity 0.5s ease" }}
                      />
                    );
                  })}
                </svg>
            </motion.div>
          </div>
        )}

        {/* ── Content overlay layer (above constellation) ── */}
        <div className="relative" style={{ zIndex: 2, minHeight: "100vh" }}>
          {/* ── Section Header — drop-shadowed overlay ── */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="text-center pt-10 sm:pt-16 md:pt-20 pb-4 sm:pb-6 px-6 sm:px-4">
            <p className="text-[9px] sm:text-[10px] tracking-[0.45em] uppercase mb-2 sm:mb-4" style={{ fontFamily: "'Cormorant SC', serif", color: C.gold, fontWeight: 400, textShadow: `0 2px 12px rgba(0,0,0,0.8)` }}>Our Process</p>
            <h2 className="text-[22px] sm:text-3xl md:text-5xl tracking-[0.02em] sm:tracking-[0.04em] leading-[1.1] sm:leading-[1]" style={{ fontFamily: F.heading, color: C.parchment, fontWeight: 700, textShadow: `0 2px 20px rgba(0,0,0,0.9), 0 4px 40px rgba(0,0,0,0.5)` }}>Ten Steps to Something Real</h2>
            <p className="text-[9px] sm:text-[11px] tracking-[0.25em] uppercase mt-2 sm:mt-4 opacity-35" style={{ fontFamily: "'Cormorant SC', serif", color: C.parchment, fontWeight: 400, textShadow: `0 2px 8px rgba(0,0,0,0.9)` }}>From First Conversation to Final Pixel</p>
          </motion.div>

          {/* ── Info overlay panel — fixed position below node circle ── */}
          {processCombo === 0 && (
            <>
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none px-4 sm:px-6"
                style={{ top: screenW < 640 ? "52%" : isPortrait ? "55%" : "62%", width: "100%" }}
                animate={{ opacity: stepInfoVisible ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {tourStep >= 0 && (() => {
                  const phase = cPhases[Math.floor(tourStep / 2)].label;
                  const num = proc[tourStep].n;
                  const name = proc[tourStep].name;
                  const desc = proc[tourStep].desc;

                  return (
                    <motion.div
                      className="text-left pointer-events-none mx-auto"
                      style={{
                        width: screenW < 640 ? "min(320px, 92%)" : "min(380px, 90%)",
                        background: `linear-gradient(135deg, ${C.deepForest}, ${C.darkBark})`,
                        borderLeft: `2px solid ${C.gold}`,
                        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${C.gold}0a`,
                        padding: screenW < 640 ? "14px 16px 12px" : "20px 24px 18px",
                      }}
                      initial={{ y: 14, opacity: 0.8 }} animate={{ y: stepInfoVisible ? 0 : 14, opacity: stepInfoVisible ? 1 : 0.8 }} transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      {/* Top row: number + phase + mini progress bar */}
                      <div className="flex items-end gap-4 mb-3">
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", color: C.gold, fontSize: screenW < 640 ? "26px" : "34px", fontWeight: 300, lineHeight: 0.85, letterSpacing: "-1px" }}>{num}</span>
                        <div style={{ paddingBottom: "2px" }}>
                          <p style={{ fontFamily: "'Cormorant SC', serif", color: C.gold, fontSize: "10px", letterSpacing: "3px", lineHeight: 1, marginBottom: "4px", opacity: 0.75 }}>{phase}</p>
                          <div className="flex items-center gap-1.5">
                            {Array.from({ length: 10 }, (_, i) => (
                              <div key={i} style={{ width: i === tourStep ? "14px" : "5px", height: "3px", borderRadius: "1.5px", background: i === tourStep ? C.gold : `${C.gold}35`, transition: "all 0.3s ease" }} />
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Step name */}
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: C.parchment, fontSize: screenW < 640 ? "19px" : "24px", fontWeight: 600, fontStyle: "italic", lineHeight: 1.1, marginBottom: screenW < 640 ? "6px" : "10px", letterSpacing: "0.3px" }}>{name}</h3>
                      {/* Gold rule */}
                      <div style={{ width: "32px", height: "1px", background: `linear-gradient(to right, ${C.gold}50, ${C.gold}00)`, marginBottom: "10px" }} />
                      {/* Description */}
                      <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.parchment, fontSize: screenW < 640 ? "12px" : "13.5px", lineHeight: screenW < 640 ? 1.55 : 1.7, opacity: 0.78, fontWeight: 400 }}>{desc}</p>
                    </motion.div>
                  );
                })()}
              </motion.div>

              {/* ── Step progress bar with prev/next arrows ── */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center">
                <div className="flex items-center gap-3 px-3 py-2 rounded-full" style={{ background: `${C.deepForest}cc`, backdropFilter: "blur(10px)", border: `1px solid ${C.gold}18` }}>
                  {/* Prev arrow */}
                  <button
                    onClick={() => {
                      tourActiveRef.current = false;
                      tourTimers.current.forEach(clearTimeout);
                      tourTimers.current = [];
                      const prev = tourStep <= 0 ? 9 : tourStep - 1;
                      setTourStep(prev);
                      setStepInfoVisible(true);
                    }}
                    className="cursor-pointer transition-opacity duration-200 hover:opacity-100 flex items-center justify-center"
                    style={{ opacity: 0.5, width: "32px", height: "32px" }}
                    aria-label="Previous step"
                  >
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                      <path d="M7 1L3 5L7 9" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Dots */}
                  <div className="flex items-center gap-0">
                    {proc.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          tourActiveRef.current = false;
                          tourTimers.current.forEach(clearTimeout);
                          tourTimers.current = [];
                          setTourStep(i);
                          setStepInfoVisible(true);
                        }}
                        className="relative cursor-pointer transition-all duration-400 flex items-center justify-center"
                        style={{ width: "24px", height: "24px", padding: 0 }}
                        aria-label={`Step ${i + 1}: ${proc[i].name}`}
                      >
                        <span style={{ display: "block", width: tourStep === i ? "22px" : "6px", height: "6px", borderRadius: "3px", background: tourStep === i ? C.gold : `${C.gold}30`, opacity: tourStep === i ? 1 : 0.5, transition: "all 0.4s" }} />
                      </button>
                    ))}
                  </div>

                  {/* Next arrow */}
                  <button
                    onClick={() => {
                      tourActiveRef.current = false;
                      tourTimers.current.forEach(clearTimeout);
                      tourTimers.current = [];
                      const next = tourStep >= 9 ? 0 : tourStep + 1;
                      setTourStep(next);
                      setStepInfoVisible(true);
                    }}
                    className="cursor-pointer transition-opacity duration-200 hover:opacity-100 flex items-center justify-center"
                    style={{ opacity: 0.5, width: "32px", height: "32px" }}
                    aria-label="Next step"
                  >
                    <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                      <path d="M3 1L7 5L3 9" stroke={C.gold} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── Overview / Play toggle — centered above progress bar ── */}
              <div className="absolute bottom-[68px] left-1/2 -translate-x-1/2 flex justify-center">
                <button
                  onClick={() => {
                    if (tourStep >= 0) {
                      /* Zoom out to overview */
                      tourActiveRef.current = false;
                      tourTimers.current.forEach(clearTimeout);
                      tourTimers.current = [];
                      setTourStep(-1);
                      setStepInfoVisible(false);
                    } else {
                      /* Start tour from step 0 */
                      tourActiveRef.current = true;
                      tourTimers.current.forEach(clearTimeout);
                      tourTimers.current = [];
                      const schedule = (fn: () => void, ms: number) => {
                        const t = setTimeout(() => { if (tourActiveRef.current) fn(); }, ms);
                        tourTimers.current.push(t);
                      };
                      const runStep = (step: number) => {
                        if (!tourActiveRef.current) return;
                        setTourStep(step);
                        setStepInfoVisible(false);
                        schedule(() => {
                          setStepInfoVisible(true);
                          schedule(() => {
                            setStepInfoVisible(false);
                            schedule(() => {
                              if (step >= 9) {
                                setTourStep(-1);
                                schedule(() => runStep(0), 1600);
                              } else {
                                runStep(step + 1);
                              }
                            }, 350);
                          }, 2400);
                        }, 1200);
                      };
                      runStep(0);
                    }
                  }}
                  className="px-4 py-1.5 rounded-full text-[9px] tracking-[0.25em] uppercase cursor-pointer transition-all duration-300 hover:opacity-100"
                  style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 400, color: C.gold, background: `${C.deepForest}cc`, border: `1px solid ${C.gold}25`, opacity: 0.65, backdropFilter: "blur(8px)" }}
                >
                  {tourStep >= 0 ? "Overview" : "Play"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* 2 — The Forge Path: medieval cartographic winding journey map */}
        {processCombo === 1 && (() => {
          const wp = [
            { x: 350, y: 80 }, { x: 200, y: 190 }, { x: 500, y: 300 },
            { x: 200, y: 410 }, { x: 500, y: 520 }, { x: 200, y: 630 },
            { x: 500, y: 740 }, { x: 200, y: 850 }, { x: 500, y: 960 },
            { x: 350, y: 1070 },
          ];
          const forgePhases = [
            { label: "DISCOVERY", i1: 0, i2: 1, shape: "scroll" as const },
            { label: "BLUEPRINT", i1: 2, i2: 3, shape: "cartouche" as const },
            { label: "CREATION", i1: 4, i2: 5, shape: "shield" as const },
            { label: "PERFECTION", i1: 6, i2: 7, shape: "medallion" as const },
            { label: "GROWTH", i1: 8, i2: 9, shape: "diamond" as const },
          ];
          let pathD = `M ${wp[0].x} ${wp[0].y}`;
          for (let i = 0; i < wp.length - 1; i++) {
            const curr = wp[i]; const next = wp[i + 1];
            const midY = (curr.y + next.y) / 2;
            pathD += ` C ${curr.x} ${midY}, ${next.x} ${midY}, ${next.x} ${next.y}`;
          }
          const forgeDiamonds: { x: number; y: number }[] = [];
          for (let i = 0; i < wp.length - 1; i++) {
            forgeDiamonds.push({ x: (wp[i].x + wp[i + 1].x) / 2, y: (wp[i].y + wp[i + 1].y) / 2 });
          }
          const forgeChevrons: { x: number; y: number; angle: number }[] = [];
          for (let i = 0; i < wp.length - 1; i++) {
            const curr = wp[i]; const next = wp[i + 1];
            forgeChevrons.push({
              x: curr.x + (next.x - curr.x) * 0.35,
              y: curr.y + (next.y - curr.y) * 0.35,
              angle: Math.atan2(next.y - curr.y, next.x - curr.x) * (180 / Math.PI),
            });
          }
          const forgeLeaves = [
            { x: 120, y: 140, r: 20, flip: false },
            { x: 580, y: 250, r: -15, flip: true },
            { x: 100, y: 480, r: 30, flip: false },
            { x: 600, y: 680, r: -25, flip: true },
            { x: 130, y: 920, r: 10, flip: false },
          ];
          const totalLen = 2800;
          return (
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8 }}>
              <svg viewBox="0 0 700 1200" className="w-full h-auto" style={{ maxWidth: "700px", margin: "0 auto", display: "block" }}>
                <defs>
                  <pattern id="forgeDotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="0.8" fill={C.gold} opacity="0.12" />
                  </pattern>
                  <filter id="forgeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="forgeShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={C.darkBark} floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Background dot grid */}
                <rect width="700" height="1200" fill="url(#forgeDotGrid)" opacity="0.5" />

                {/* Corner flourishes */}
                {[
                  "",
                  "translate(700, 0) scale(-1, 1)",
                  "translate(0, 1200) scale(1, -1)",
                  "translate(700, 1200) scale(-1, -1)",
                ].map((t, ci) => (
                  <g key={`corner-${ci}`} opacity="0.25" stroke={C.gold} strokeWidth="1.5" fill="none" transform={t || undefined}>
                    <path d="M 15 50 Q 15 15 50 15" />
                    <path d="M 15 60 Q 15 10 60 10" />
                    <circle cx="15" cy="15" r="2" fill={C.gold} />
                    <line x1="15" y1="18" x2="15" y2="35" />
                    <line x1="18" y1="15" x2="35" y2="15" />
                  </g>
                ))}

                {/* S-curve path — outer glow road */}
                <path d={pathD} fill="none" stroke={`${C.gold}15`} strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
                {/* Main road stroke */}
                <motion.path d={pathD} fill="none" stroke={C.gold} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"
                  initial={{ strokeDasharray: totalLen, strokeDashoffset: totalLen }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
                {/* Inner road dashed line */}
                <motion.path d={pathD} fill="none" stroke={C.paleGold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" strokeDasharray="8 12"
                  initial={{ strokeDashoffset: totalLen }}
                  whileInView={{ strokeDashoffset: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.8, ease: "easeInOut", delay: 0.3 }}
                />

                {/* Diamond markers along path */}
                {forgeDiamonds.map((d, i) => (
                  <motion.rect key={`fdiam-${i}`} x={d.x - 4} y={d.y - 4} width="8" height="8" fill={C.gold} opacity="0.35" transform={`rotate(45 ${d.x} ${d.y})`}
                    initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 0.35, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.8 + i * 0.15 }}
                  />
                ))}

                {/* Directional chevron arrows */}
                {forgeChevrons.map((ch, i) => (
                  <g key={`fchev-${i}`} transform={`translate(${ch.x}, ${ch.y}) rotate(${ch.angle})`} opacity="0.18">
                    <path d="M -5 -4 L 2 0 L -5 4" fill="none" stroke={C.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                ))}

                {/* Start emblem — pennant/flag */}
                <motion.g initial={{ opacity: 0, y: -15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <line x1={wp[0].x} y1={wp[0].y - 52} x2={wp[0].x} y2={wp[0].y - 18} stroke={C.gold} strokeWidth="2" opacity="0.7" />
                  <path d={`M ${wp[0].x} ${wp[0].y - 52} L ${wp[0].x + 28} ${wp[0].y - 44} L ${wp[0].x} ${wp[0].y - 36} Z`} fill={C.gold} opacity="0.6" />
                  <path d={`M ${wp[0].x} ${wp[0].y - 52} L ${wp[0].x + 28} ${wp[0].y - 44} L ${wp[0].x} ${wp[0].y - 36}`} fill="none" stroke={C.brightGold} strokeWidth="0.8" opacity="0.8" />
                  <text x={wp[0].x + 34} y={wp[0].y - 42} fill={C.gold} fontSize="9" fontFamily={F.heading} letterSpacing="0.2em" opacity="0.6">START</text>
                  <circle cx={wp[0].x} cy={wp[0].y - 54} r="3" fill={C.gold} opacity="0.5" />
                </motion.g>

                {/* Finish emblem — crown/laurel */}
                <motion.g initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 2.2 }}>
                  {/* Laurel left */}
                  <path d={`M ${wp[9].x - 25} ${wp[9].y + 25} Q ${wp[9].x - 30} ${wp[9].y + 45} ${wp[9].x - 10} ${wp[9].y + 55}`} fill="none" stroke={C.sage} strokeWidth="1.5" opacity="0.5" />
                  <path d={`M ${wp[9].x - 28} ${wp[9].y + 32} Q ${wp[9].x - 22} ${wp[9].y + 30} ${wp[9].x - 24} ${wp[9].y + 26}`} fill={C.sage} opacity="0.35" />
                  <path d={`M ${wp[9].x - 30} ${wp[9].y + 40} Q ${wp[9].x - 24} ${wp[9].y + 38} ${wp[9].x - 26} ${wp[9].y + 34}`} fill={C.sage} opacity="0.35" />
                  <path d={`M ${wp[9].x - 28} ${wp[9].y + 48} Q ${wp[9].x - 22} ${wp[9].y + 46} ${wp[9].x - 24} ${wp[9].y + 42}`} fill={C.sage} opacity="0.35" />
                  {/* Laurel right */}
                  <path d={`M ${wp[9].x + 25} ${wp[9].y + 25} Q ${wp[9].x + 30} ${wp[9].y + 45} ${wp[9].x + 10} ${wp[9].y + 55}`} fill="none" stroke={C.sage} strokeWidth="1.5" opacity="0.5" />
                  <path d={`M ${wp[9].x + 28} ${wp[9].y + 32} Q ${wp[9].x + 22} ${wp[9].y + 30} ${wp[9].x + 24} ${wp[9].y + 26}`} fill={C.sage} opacity="0.35" />
                  <path d={`M ${wp[9].x + 30} ${wp[9].y + 40} Q ${wp[9].x + 24} ${wp[9].y + 38} ${wp[9].x + 26} ${wp[9].y + 34}`} fill={C.sage} opacity="0.35" />
                  <path d={`M ${wp[9].x + 28} ${wp[9].y + 48} Q ${wp[9].x + 22} ${wp[9].y + 46} ${wp[9].x + 24} ${wp[9].y + 42}`} fill={C.sage} opacity="0.35" />
                  {/* Crown motif */}
                  <path d={`M ${wp[9].x - 14} ${wp[9].y + 22} L ${wp[9].x - 10} ${wp[9].y + 16} L ${wp[9].x - 4} ${wp[9].y + 22} L ${wp[9].x} ${wp[9].y + 14} L ${wp[9].x + 4} ${wp[9].y + 22} L ${wp[9].x + 10} ${wp[9].y + 16} L ${wp[9].x + 14} ${wp[9].y + 22}`} fill="none" stroke={C.gold} strokeWidth="1.5" opacity="0.6" />
                  <line x1={wp[9].x - 14} y1={wp[9].y + 24} x2={wp[9].x + 14} y2={wp[9].y + 24} stroke={C.gold} strokeWidth="1.5" opacity="0.5" />
                  <text x={wp[9].x} y={wp[9].y + 65} fill={C.gold} fontSize="9" fontFamily={F.heading} letterSpacing="0.2em" opacity="0.5" textAnchor="middle">COMPLETE</text>
                </motion.g>

                {/* Compass rose — top-right */}
                <motion.g initial={{ opacity: 0, rotate: -30 }} whileInView={{ opacity: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }}>
                  <g transform="translate(610, 90)">
                    <circle cx="0" cy="0" r="38" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.25" />
                    <circle cx="0" cy="0" r="35" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.15" strokeDasharray="3 3" />
                    <circle cx="0" cy="0" r="12" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.3" />
                    <circle cx="0" cy="0" r="3" fill={C.gold} opacity="0.35" />
                    {/* N */}
                    <polygon points="0,-32 -4,-18 4,-18" fill={C.gold} opacity="0.55" />
                    <polygon points="0,-32 -2.5,-20 2.5,-20" fill={C.brightGold} opacity="0.3" />
                    {/* S */}
                    <polygon points="0,32 -4,18 4,18" fill={C.gold} opacity="0.35" />
                    {/* E */}
                    <polygon points="32,0 18,-4 18,4" fill={C.gold} opacity="0.35" />
                    {/* W */}
                    <polygon points="-32,0 -18,-4 -18,4" fill={C.gold} opacity="0.35" />
                    {/* NE */}
                    <polygon points="22,-22 10,-14 14,-10" fill={C.gold} opacity="0.2" />
                    {/* NW */}
                    <polygon points="-22,-22 -10,-14 -14,-10" fill={C.gold} opacity="0.2" />
                    {/* SE */}
                    <polygon points="22,22 10,14 14,10" fill={C.gold} opacity="0.2" />
                    {/* SW */}
                    <polygon points="-22,22 -10,14 -14,10" fill={C.gold} opacity="0.2" />
                    <text x="0" y="-40" fill={C.gold} fontSize="8" fontFamily={F.heading} textAnchor="middle" opacity="0.5">N</text>
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                      <line key={`ctick-${a}`} x1="0" y1="-36" x2="0" y2="-33" stroke={C.gold} strokeWidth="0.7" opacity="0.3" transform={`rotate(${a})`} />
                    ))}
                  </g>
                </motion.g>

                {/* Botanical leaf motifs */}
                {forgeLeaves.map((leaf, i) => (
                  <motion.g key={`fleaf-${i}`} initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.0 + i * 0.2 }}
                    transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.r}) ${leaf.flip ? "scale(-1,1)" : ""}`}>
                    <path d="M 0 0 Q 5 -8 3 -18" fill="none" stroke={C.sage} strokeWidth="1" opacity="0.4" />
                    <path d="M 3 -18 Q 10 -22 8 -14 Q 12 -16 3 -18" fill={C.sage} opacity="0.2" />
                    <path d="M 3 -18 Q -2 -24 0 -12 Q -4 -16 3 -18" fill={C.sage} opacity="0.15" />
                    <path d="M 2 -8 Q 7 -12 6 -6" fill={C.sage} opacity="0.15" />
                  </motion.g>
                ))}

                {/* Phase banners */}
                {forgePhases.map((phase, pi) => {
                  const p1 = wp[phase.i1]; const p2 = wp[phase.i2];
                  const bx = (p1.x + p2.x) / 2;
                  const by = (p1.y + p2.y) / 2;
                  const pushX = bx < 350 ? -65 : bx > 350 ? 65 : 0;
                  const fbx = bx + pushX; const fby = by;
                  return (
                    <motion.g key={`fphase-${pi}`} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1.2 + pi * 0.25 }} filter="url(#forgeShadow)">
                      {phase.shape === "scroll" && (
                        <g transform={`translate(${fbx}, ${fby})`}>
                          <path d="M -42 -12 Q -48 -12 -48 -6 Q -48 0 -42 0 L -42 -4 L 42 -4 L 42 0 Q 48 0 48 -6 Q 48 -12 42 -12 Z" fill={C.deepForest} stroke={C.gold} strokeWidth="1" opacity="0.85" />
                          <path d="M -42 0 Q -46 2 -44 5 Q -42 3 -42 0" fill={C.gold} opacity="0.2" />
                          <path d="M 42 0 Q 46 2 44 5 Q 42 3 42 0" fill={C.gold} opacity="0.2" />
                          <text x="0" y="-5" fill={C.gold} fontSize="7.5" fontFamily={F.heading} textAnchor="middle" letterSpacing="0.25em" opacity="0.8">{phase.label}</text>
                        </g>
                      )}
                      {phase.shape === "cartouche" && (
                        <g transform={`translate(${fbx}, ${fby})`}>
                          <rect x="-44" y="-13" width="88" height="18" rx="2" fill={C.deepForest} stroke={C.gold} strokeWidth="1" opacity="0.85" />
                          <line x1="-44" y1="-13" x2="-38" y2="-7" stroke={C.gold} strokeWidth="0.7" opacity="0.4" />
                          <line x1="44" y1="-13" x2="38" y2="-7" stroke={C.gold} strokeWidth="0.7" opacity="0.4" />
                          <line x1="-44" y1="5" x2="-38" y2="-1" stroke={C.gold} strokeWidth="0.7" opacity="0.4" />
                          <line x1="44" y1="5" x2="38" y2="-1" stroke={C.gold} strokeWidth="0.7" opacity="0.4" />
                          <text x="0" y="-1" fill={C.gold} fontSize="7.5" fontFamily={F.heading} textAnchor="middle" letterSpacing="0.25em" opacity="0.8">{phase.label}</text>
                        </g>
                      )}
                      {phase.shape === "shield" && (
                        <g transform={`translate(${fbx}, ${fby})`}>
                          <path d="M -35 -14 L 35 -14 L 35 2 Q 35 14 0 20 Q -35 14 -35 2 Z" fill={C.deepForest} stroke={C.gold} strokeWidth="1" opacity="0.85" />
                          <path d="M -30 -10 L 30 -10 L 30 0 Q 30 10 0 15 Q -30 10 -30 0 Z" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.25" />
                          <text x="0" y="-1" fill={C.gold} fontSize="7.5" fontFamily={F.heading} textAnchor="middle" letterSpacing="0.25em" opacity="0.8">{phase.label}</text>
                        </g>
                      )}
                      {phase.shape === "medallion" && (
                        <g transform={`translate(${fbx}, ${fby})`}>
                          <circle cx="0" cy="0" r="24" fill={C.deepForest} stroke={C.gold} strokeWidth="1" opacity="0.85" />
                          <circle cx="0" cy="0" r="20" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.25" />
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                            <circle key={`fmed-${a}`} cx={22 * Math.cos(a * Math.PI / 180)} cy={22 * Math.sin(a * Math.PI / 180)} r="1.2" fill={C.gold} opacity="0.3" />
                          ))}
                          <text x="0" y="3" fill={C.gold} fontSize="6.5" fontFamily={F.heading} textAnchor="middle" letterSpacing="0.2em" opacity="0.8">{phase.label}</text>
                        </g>
                      )}
                      {phase.shape === "diamond" && (
                        <g transform={`translate(${fbx}, ${fby})`}>
                          <polygon points="0,-22 45,0 0,22 -45,0" fill={C.deepForest} stroke={C.gold} strokeWidth="1" opacity="0.85" />
                          <polygon points="0,-17 38,0 0,17 -38,0" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.25" />
                          <text x="0" y="3" fill={C.gold} fontSize="7" fontFamily={F.heading} textAnchor="middle" letterSpacing="0.2em" opacity="0.8">{phase.label}</text>
                        </g>
                      )}
                    </motion.g>
                  );
                })}

                {/* Decorated waypoints */}
                {wp.map((p, i) => {
                  const isLeft = p.x < 350;
                  const isCentered = p.x === 350;
                  const labelX = isCentered ? p.x : isLeft ? p.x - 55 : p.x + 55;
                  const anchor = isCentered ? "middle" as const : isLeft ? "end" as const : "start" as const;
                  return (
                    <motion.g key={`fwp-${i}`} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.5 + i * 0.18, type: "spring", stiffness: 200 }}>
                      {/* 8 radiating lines */}
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                        <line key={`fray-${i}-${angle}`} x1={p.x + 24 * Math.cos(angle * Math.PI / 180)} y1={p.y + 24 * Math.sin(angle * Math.PI / 180)} x2={p.x + 32 * Math.cos(angle * Math.PI / 180)} y2={p.y + 32 * Math.sin(angle * Math.PI / 180)} stroke={C.gold} strokeWidth="1" opacity="0.3" />
                      ))}
                      {/* Outer decorative ring */}
                      <circle cx={p.x} cy={p.y} r="30" fill="none" stroke={C.gold} strokeWidth="1" opacity="0.25" />
                      <circle cx={p.x} cy={p.y} r="27" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.12" strokeDasharray="2 4" />
                      {/* Inner circle */}
                      <circle cx={p.x} cy={p.y} r="18" fill={C.deepForest} stroke={C.gold} strokeWidth="1.5" opacity="0.9" filter="url(#forgeGlow)" />
                      {/* Step number */}
                      <text x={p.x} y={p.y + 4} fill={C.gold} fontSize="12" fontFamily={F.heading} textAnchor="middle" fontWeight="bold" opacity="0.9">{proc[i].n}</text>
                      {/* Step name */}
                      <text x={labelX} y={isCentered ? p.y + 48 : p.y + 5} fill={C.parchment} fontSize="11" fontFamily={F.heading} textAnchor={anchor} letterSpacing="0.15em" opacity="0.7">{proc[i].name.toUpperCase()}</text>
                    </motion.g>
                  );
                })}
              </svg>
            </motion.div>

            {/* Detail strip — 2-column grid below SVG */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-2xl mx-auto">
              {proc.map((s, i) => (
                <motion.div key={`fdetail-${i}`} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-20px" }} transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="relative pl-10" style={{ borderLeft: `1px solid ${C.gold}20` }}>
                  <span className="absolute left-2 top-0 text-xs font-bold" style={{ color: C.gold, fontFamily: F.heading }}>{s.n}</span>
                  <p className="text-sm tracking-[0.15em] uppercase mb-1" style={{ fontFamily: F.heading, color: C.parchment }}>{s.name}</p>
                  <p className="text-xs leading-[1.7] opacity-50" style={{ fontFamily: "'Crimson Text', serif" }}>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          );
        })()}

        {/* 3 — The Wheel: cathedral rose window / alchemical clock diagram */}
        {processCombo === 2 && (() => {
          const cxW = 400, cyW = 400;
          const toRad = (deg: number) => deg * Math.PI / 180;
          const pxW = (c: number, r: number, deg: number) => c + r * Math.cos(toRad(deg));
          const pyW = (c: number, r: number, deg: number) => c + r * Math.sin(toRad(deg));
          const arcPath = (r: number, startDeg: number, endDeg: number, sweep = 1) => {
            const x1 = pxW(cxW, r, startDeg), y1 = pyW(cyW, r, startDeg);
            const x2 = pxW(cxW, r, endDeg), y2 = pyW(cyW, r, endDeg);
            const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
            return `M ${x1} ${y1} A ${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`;
          };
          const segPath = (innerR: number, outerR: number, startA: number, endA: number) => {
            const p1x = pxW(cxW, innerR, startA), p1y = pyW(cyW, innerR, startA);
            const p2x = pxW(cxW, outerR, startA), p2y = pyW(cyW, outerR, startA);
            const p3x = pxW(cxW, outerR, endA), p3y = pyW(cyW, outerR, endA);
            const p4x = pxW(cxW, innerR, endA), p4y = pyW(cyW, innerR, endA);
            return `M ${p1x} ${p1y} L ${p2x} ${p2y} A ${outerR} ${outerR} 0 0 1 ${p3x} ${p3y} L ${p4x} ${p4y} A ${innerR} ${innerR} 0 0 0 ${p1x} ${p1y}`;
          };
          const wheelPhases = [
            { name: "DISCOVER", icon: "M0,-8 L3,-3 L8,0 L3,3 L0,8 L-3,3 L-8,0 L-3,-3 Z" },
            { name: "PLAN", icon: "M-6,-6 L6,-6 L6,6 L-6,6 Z M0,-8 L0,8 M-8,0 L8,0" },
            { name: "CREATE", icon: "M0,-8 L4,0 L8,8 L-8,8 L-4,0 Z" },
            { name: "PERFECT", icon: "M0,-9 L3,-3 L9,-3 L4,2 L6,9 L0,5 L-6,9 L-4,2 L-9,-3 L-3,-3 Z" },
            { name: "GROW", icon: "M0,-9 L0,6 M-5,0 L0,-4 L5,0 M-7,4 L0,-1 L7,4" },
          ];
          return (
          <div className="max-w-5xl mx-auto">
            {/* ── SVG Rose Window ── */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="flex justify-center mb-12 md:mb-16">
              <motion.svg viewBox="0 0 800 800" className="w-full max-w-[600px] md:max-w-[700px]" style={{ filter: `drop-shadow(0 0 40px ${C.gold}15)` }}>
                <defs>
                  {/* Cross-hatch pattern for outer border */}
                  <pattern id="whlCrossHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke={`${C.gold}18`} strokeWidth="0.5" />
                    <line x1="0" y1="0" x2="6" y2="0" stroke={`${C.gold}12`} strokeWidth="0.5" />
                  </pattern>
                  {/* Gold radial gradient for background glow */}
                  <radialGradient id="whlGoldRadial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={C.brightGold} stopOpacity="0.3" />
                    <stop offset="70%" stopColor={C.gold} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={C.gold} stopOpacity="0.05" />
                  </radialGradient>
                  {/* Inner ring gradient */}
                  <linearGradient id="whlInnerRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={C.gold} stopOpacity="0.6" />
                    <stop offset="25%" stopColor={C.brightGold} stopOpacity="0.9" />
                    <stop offset="50%" stopColor={C.paleGold} stopOpacity="0.6" />
                    <stop offset="75%" stopColor={C.brightGold} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={C.gold} stopOpacity="0.6" />
                  </linearGradient>
                  {/* Arc paths for step name text */}
                  {proc.map((_, i) => {
                    const startA = i * 36 - 90 - 15;
                    const endA = i * 36 - 90 + 15;
                    return <path key={`whlStpArc${i}`} id={`whlStpArc${i}`} d={arcPath(322, startA, endA)} fill="none" />;
                  })}
                  {/* Arc paths for phase labels */}
                  {wheelPhases.map((_, j) => {
                    const startA = j * 72 - 90 - 30;
                    const endA = j * 72 - 90 + 30;
                    return <path key={`whlPhArc${j}`} id={`whlPhArc${j}`} d={arcPath(212, startA, endA)} fill="none" />;
                  })}
                </defs>

                {/* Background glow */}
                <circle cx={cxW} cy={cyW} r="390" fill="url(#whlGoldRadial)" />

                {/* ═══ LAYER 1: Outermost decorative border ═══ */}
                <motion.g initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.0, delay: 0.1 }}>
                  {/* Outer + inner circles of border ring */}
                  <circle cx={cxW} cy={cyW} r="380" fill="none" stroke={C.gold} strokeWidth="1.5" strokeOpacity="0.5" />
                  <circle cx={cxW} cy={cyW} r="360" fill="none" stroke={C.gold} strokeWidth="1" strokeOpacity="0.4" />
                  {/* Cross-hatch fill between the two border circles */}
                  <path d={`M ${cxW} ${cyW - 380} A 380 380 0 1 1 ${cxW - 0.01} ${cyW - 380} Z M ${cxW} ${cyW - 360} A 360 360 0 1 0 ${cxW - 0.01} ${cyW - 360} Z`} fillRule="evenodd" fill="url(#whlCrossHatch)" opacity="0.6" />
                  {/* 40 small tick marks every 9° (skip step positions) */}
                  {Array.from({ length: 40 }, (_, i) => {
                    const angle = i * 9;
                    if (angle % 36 === 0) return null;
                    return <line key={`whlTk${i}`} x1={pxW(cxW, 361, angle)} y1={pyW(cyW, 361, angle)} x2={pxW(cxW, 376, angle)} y2={pyW(cyW, 376, angle)} stroke={C.gold} strokeWidth="0.6" strokeOpacity="0.35" />;
                  })}
                  {/* 10 major ticks with diamonds at step positions */}
                  {Array.from({ length: 10 }, (_, i) => {
                    const angle = i * 36 - 90;
                    const dmx = pxW(cxW, 388, angle), dmy = pyW(cyW, 388, angle);
                    return (
                      <g key={`whlMj${i}`}>
                        <line x1={pxW(cxW, 358, angle)} y1={pyW(cyW, 358, angle)} x2={pxW(cxW, 382, angle)} y2={pyW(cyW, 382, angle)} stroke={C.gold} strokeWidth="1.2" strokeOpacity="0.6" />
                        <path d={`M ${dmx} ${dmy - 4} L ${dmx + 3} ${dmy} L ${dmx} ${dmy + 4} L ${dmx - 3} ${dmy} Z`} fill={C.gold} fillOpacity="0.5" />
                      </g>
                    );
                  })}
                  {/* Cardinal arrow markers at top, right, bottom, left */}
                  {[-90, 0, 90, 180].map((angle, ci) => {
                    const tipR = 396, baseR = 385, spread = 4;
                    const tx = pxW(cxW, tipR, angle), ty = pyW(cyW, tipR, angle);
                    const blx = pxW(cxW, baseR, angle - spread), bly = pyW(cyW, baseR, angle - spread);
                    const brx = pxW(cxW, baseR, angle + spread), bry = pyW(cyW, baseR, angle + spread);
                    return <path key={`whlCd${ci}`} d={`M ${tx} ${ty} L ${blx} ${bly} L ${brx} ${bry} Z`} fill={C.brightGold} fillOpacity="0.7" />;
                  })}
                </motion.g>

                {/* ═══ PETAL OVERLAYS (behind step ring for depth) ═══ */}
                <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3 }}>
                  {Array.from({ length: 10 }, (_, i) => {
                    const a1 = i * 36 - 90, a2 = (i + 1) * 36 - 90;
                    const mid = (a1 + a2) / 2;
                    const iR = 140, oR = 300, bulge = 40;
                    const p1x = pxW(cxW, iR, a1), p1y = pyW(cyW, iR, a1);
                    const p2x = pxW(cxW, oR, a1), p2y = pyW(cyW, oR, a1);
                    const p3x = pxW(cxW, oR, a2), p3y = pyW(cyW, oR, a2);
                    const p4x = pxW(cxW, iR, a2), p4y = pyW(cyW, iR, a2);
                    const c1x = pxW(cxW, (iR + oR) / 2 + bulge, mid - 8);
                    const c1y = pyW(cyW, (iR + oR) / 2 + bulge, mid - 8);
                    const c2x = pxW(cxW, (iR + oR) / 2 + bulge, mid + 8);
                    const c2y = pyW(cyW, (iR + oR) / 2 + bulge, mid + 8);
                    return (
                      <path key={`whlPt${i}`} d={`M ${p1x} ${p1y} Q ${c1x} ${c1y} ${p2x} ${p2y} A ${oR} ${oR} 0 0 1 ${p3x} ${p3y} Q ${c2x} ${c2y} ${p4x} ${p4y} A ${iR} ${iR} 0 0 0 ${p1x} ${p1y}`} fill={i % 2 === 0 ? C.gold : C.paleGold} fillOpacity={i % 2 === 0 ? 0.04 : 0.06} stroke={C.gold} strokeWidth="0.3" strokeOpacity="0.08" />
                    );
                  })}
                </motion.g>

                {/* ═══ RADIAL SPOKES ═══ */}
                <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                  {Array.from({ length: 10 }, (_, i) => {
                    const angle = i * 36 - 90;
                    return <line key={`whlSp${i}`} x1={pxW(cxW, 88, angle)} y1={pyW(cyW, 88, angle)} x2={pxW(cxW, 348, angle)} y2={pyW(cyW, 348, angle)} stroke={C.gold} strokeWidth="0.5" strokeOpacity="0.2" />;
                  })}
                </motion.g>

                {/* ═══ LAYER 2: Step ring (r~270–345) ═══ */}
                <motion.g initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}>
                  {/* 10 arc segments */}
                  {proc.map((s, i) => {
                    const startA = i * 36 - 90 - 18;
                    const endA = i * 36 - 90 + 18;
                    return (
                      <g key={`whlSS${i}`}>
                        <path d={segPath(270, 345, startA, endA)} fill={i % 2 === 0 ? `${C.forest}30` : `${C.deepForest}40`} stroke={C.gold} strokeWidth="0.5" strokeOpacity="0.25" />
                      </g>
                    );
                  })}
                  {/* Gold radial dividers between segments */}
                  {Array.from({ length: 10 }, (_, i) => {
                    const angle = i * 36 - 90 - 18;
                    return <line key={`whlSD${i}`} x1={pxW(cxW, 270, angle)} y1={pyW(cyW, 270, angle)} x2={pxW(cxW, 345, angle)} y2={pyW(cyW, 345, angle)} stroke={C.gold} strokeWidth="0.7" strokeOpacity="0.3" />;
                  })}
                  {/* Step numbers centered in each segment */}
                  {proc.map((s, i) => {
                    const angle = i * 36 - 90;
                    return (
                      <text key={`whlSN${i}`} x={pxW(cxW, 295, angle)} y={pyW(cyW, 295, angle)} textAnchor="middle" dominantBaseline="central" fill={C.gold} fillOpacity="0.8" fontSize="13" fontFamily={F.heading} fontWeight="bold">{s.n}</text>
                    );
                  })}
                  {/* Step names along outer arc edge via textPath */}
                  {proc.map((s, i) => (
                    <text key={`whlSL${i}`} fill={C.paleGold} fillOpacity="0.7" fontSize="9" fontFamily={F.heading} letterSpacing="1.5">
                      <textPath href={`#whlStpArc${i}`} startOffset="50%" textAnchor="middle">{s.name.toUpperCase()}</textPath>
                    </text>
                  ))}
                </motion.g>

                {/* ═══ LAYER 3: Phase ring (r~145–260) ═══ */}
                <motion.g initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }}>
                  {wheelPhases.map((phase, j) => {
                    const startA = j * 72 - 90 - 36;
                    const endA = j * 72 - 90 + 36;
                    const fillColors = [`${C.emerald}20`, `${C.sage}18`, `${C.leaf}20`, `${C.moss}18`, `${C.forest}22`];
                    const midAngle = j * 72 - 90;
                    const iconX = pxW(cxW, 190, midAngle);
                    const iconY = pyW(cyW, 190, midAngle);
                    return (
                      <g key={`whlPS${j}`}>
                        <path d={segPath(145, 260, startA, endA)} fill={fillColors[j]} stroke={C.gold} strokeWidth="0.6" strokeOpacity="0.3" />
                        {/* Phase segment divider */}
                        <line x1={pxW(cxW, 145, startA)} y1={pyW(cyW, 145, startA)} x2={pxW(cxW, 260, startA)} y2={pyW(cyW, 260, startA)} stroke={C.gold} strokeWidth="0.8" strokeOpacity="0.35" />
                        {/* Phase icon motif */}
                        <g transform={`translate(${iconX}, ${iconY})`} opacity="0.35">
                          <path d={phase.icon} fill="none" stroke={C.paleGold} strokeWidth="1" />
                        </g>
                      </g>
                    );
                  })}
                  {/* Phase name labels along arcs */}
                  {wheelPhases.map((phase, j) => (
                    <text key={`whlPL${j}`} fill={C.paleGold} fillOpacity="0.65" fontSize="11" fontFamily={F.heading} letterSpacing="3" fontWeight="600">
                      <textPath href={`#whlPhArc${j}`} startOffset="50%" textAnchor="middle">{phase.name}</textPath>
                    </text>
                  ))}
                </motion.g>

                {/* ═══ LAYER 4: Inner decorative ring (r~130–135) ═══ */}
                <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.7 }}>
                  <circle cx={cxW} cy={cyW} r="135" fill="none" stroke="url(#whlInnerRingGrad)" strokeWidth="2" />
                  <circle cx={cxW} cy={cyW} r="130" fill="none" stroke="url(#whlInnerRingGrad)" strokeWidth="0.8" strokeOpacity="0.5" />
                  {/* 20 dots, alternating thick-thin */}
                  {Array.from({ length: 20 }, (_, i) => {
                    const angle = i * 18;
                    const dotR = i % 2 === 0 ? 2.5 : 1.5;
                    return <circle key={`whlID${i}`} cx={pxW(cxW, 132.5, angle)} cy={pyW(cyW, 132.5, angle)} r={dotR} fill={C.gold} fillOpacity={i % 2 === 0 ? 0.6 : 0.35} />;
                  })}
                </motion.g>

                {/* ═══ LAYER 5: Center hub (r~85) ═══ */}
                <motion.g initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                  {/* Outer thin gold circle */}
                  <circle cx={cxW} cy={cyW} r="85" fill="none" stroke={C.gold} strokeWidth="1" strokeOpacity="0.5" />
                  {/* 8-pointed star: two overlapping rotated squares */}
                  <rect x={cxW - 50} y={cyW - 50} width="100" height="100" fill="none" stroke={C.gold} strokeWidth="0.8" strokeOpacity="0.3" />
                  <rect x={cxW - 50} y={cyW - 50} width="100" height="100" fill="none" stroke={C.gold} strokeWidth="0.8" strokeOpacity="0.3" transform={`rotate(45, ${cxW}, ${cyW})`} />
                  {/* Filled center circle */}
                  <circle cx={cxW} cy={cyW} r="45" fill={C.deepForest} stroke={C.gold} strokeWidth="1.5" strokeOpacity="0.6" />
                  {/* Inner decorative circle */}
                  <circle cx={cxW} cy={cyW} r="38" fill="none" stroke={C.gold} strokeWidth="0.5" strokeOpacity="0.3" />
                  {/* 4-pointed star ornament (behind monogram) */}
                  <path d={`M ${cxW} ${cyW - 12} L ${cxW + 2.5} ${cyW} L ${cxW} ${cyW + 12} L ${cxW - 2.5} ${cyW} Z`} fill={C.gold} fillOpacity="0.15" />
                  <path d={`M ${cxW - 12} ${cyW} L ${cxW} ${cyW - 2.5} L ${cxW + 12} ${cyW} L ${cxW} ${cyW + 2.5} Z`} fill={C.gold} fillOpacity="0.15" />
                  {/* Studio monogram "O" */}
                  <text x={cxW} y={cyW + 2} textAnchor="middle" dominantBaseline="central" fill={C.brightGold} fontSize="36" fontFamily={F.display} fontWeight="400" opacity="0.9">O</text>
                </motion.g>
              </motion.svg>
            </motion.div>

            {/* ── Detail strip: 2x5 grid of all 10 steps ── */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.7, delay: 0.3 }} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-8">
              {proc.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ border: `1.5px solid ${C.gold}50`, background: `${C.deepForest}80` }}>
                    <span className="text-xs font-bold" style={{ color: C.gold, fontFamily: F.heading }}>{s.n}</span>
                  </div>
                  <div>
                    <p className="text-sm tracking-[0.18em] uppercase mb-1" style={{ fontFamily: F.heading, color: C.paleGold }}>{s.name}</p>
                    <p className="text-sm leading-[1.75] opacity-55" style={{ fontFamily: "'Crimson Text', serif", color: C.parchment }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          );
        })()}

      </section>
      </LeafReveal>

      {/* ═══════════════════ PORTFOLIO / PAST WORK — Roller Conveyor ═══════════════════ */}
      {(() => {
        const pieces = [
          { src: "/images/portfolio/crestview-property.webp", name: "Crestview Property Group", tag: "Real Estate", href: "/mock-sites/crestview-property.html" },
          { src: "/images/portfolio/carolina-arcade.webp", name: "Carolina Arcade Museum", tag: "Entertainment", href: "/for/carolina-arcade.html" },
          { src: "/images/portfolio/mason-jar.webp", name: "The Mason Jar Provisions", tag: "Restaurant", href: "/mock-sites/mason-jar.html" },
          { src: "/images/portfolio/foothills-chiro.webp", name: "Foothills Family Chiropractic", tag: "Healthcare", href: "/mock-sites/foothills-chiro.html" },
          { src: "/images/portfolio/wahoos-sports.webp", name: "Wahoo's Sports & Collectibles", tag: "Retail", href: "/for/wahoos-sports.html" },
          { src: "/images/portfolio/keller-built.webp", name: "Keller Built", tag: "Construction", href: "/mock-sites/keller-built.html" },
          { src: "/images/portfolio/carolina-brewing.webp", name: "Carolina Craft Brewing Co.", tag: "Brewery", href: "/mock-sites/carolina-brewing.html" },
          { src: "/images/portfolio/hoot-nannie.webp", name: "The Hoot Nannie", tag: "Restaurant", href: "/for/hoot-nannie.html" },
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

      {/* ═══════════════════ CONTACT — 10 Deep CTA Variants ═══════════════════
        ┌─────────────────────────────────────────────────────────────────────┐
        │  THREE RUBRICS (independent axes of variation):                     │
        │                                                                     │
        │  A · CONVERSION PSYCHOLOGY (why they act)                          │
        │    1. Low Friction — remove every barrier, just email              │
        │    2. Qualifying Funnel — filter for serious leads                 │
        │    3. Value Exchange — give before asking (audit, strategy)        │
        │    4. Social Authority — proof & credibility first                 │
        │    5. Scarcity Signal — limited slots, exclusivity                 │
        │                                                                     │
        │  B · INFORMATION ARCHITECTURE (what & how we gather)               │
        │    1. Single Field — email only, zero friction                     │
        │    2. Standard Form — name/email/message                          │
        │    3. Interactive Selection — click-to-choose pills/cards          │
        │    4. Multi-Step Wizard — progressive disclosure                   │
        │    5. Diagnostic — answer → score → capture                       │
        │                                                                     │
        │  C · VISUAL PATTERN (layout & presence)                            │
        │    1. Split Panel — asymmetric left/right                         │
        │    2. Centered Monument — full-width stacked                      │
        │    3. Card Overlay — floating container                           │
        │    4. Step Flow — sequential inline                               │
        │    5. Editorial Magazine — text-heavy, minimal chrome             │
        │                                                                     │
        │  MATRIX:                                                           │
        │   1. A1+B1+C2  The Drop        (low friction, email, monument)    │
        │   2. A5+B4+C4  The Application (scarcity, wizard, step flow)      │
        │   3. A3+B3+C1  The Quick Match (value, interactive, split)        │
        │   4. A4+B2+C5  The Proof Wall  (authority, standard, editorial)   │
        │   5. A2+B4+C3  The Brief       (qualifying, wizard, card)         │
        │   6. A3+B5+C2  The Diagnostic  (value, diagnostic, monument)      │
        │   7. A1+B2+C1  The Conversation(low friction, standard, split)    │
        │   8. A5+B3+C5  The Studio Select(scarcity, interactive, editorial)│
        │   9. A4+B1+C3  The Signal      (authority, single field, card)    │
        │  10. A2+B3+C2  The Architect   (qualifying, interactive, monument)│
        └─────────────────────────────────────────────────────────────────────┘
      ═══════════════════════════════════════════════════════════════════════ */}
      <LeafReveal side="left">
      <section id="contact" className="relative overflow-hidden" style={{ background: C.deepForest, color: C.parchment }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: foliagePattern, backgroundSize: "120px 120px" }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 60% at 50% 50%, ${C.gold}08, transparent)` }} />


        {/* ════════ 1. THE DROP — A1+B1+C2 ════════ */}
        {/* Low friction · Email only · Centered monument */}
        {contactCombo === 0 && (
          <div className="relative z-10 py-40 md:py-56 px-6 flex flex-col items-center text-center">
            <Ornament className="w-32 md:w-44 mb-10" color={C.gold} />
            <p className="text-[10px] tracking-[0.5em] uppercase mb-4 opacity-40" style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 600 }}>One Step</p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl tracking-[0.03em] leading-[0.85] mb-6" style={{ fontFamily: F.heading, color: C.parchment, fontWeight: 700 }}>
              drop your email.<br /><span style={{ color: C.gold }}>we'll take it from here.</span>
            </h2>
            <div className="w-20 mb-8" style={{ height: "1px", background: C.gold }} />
            <p className="text-lg md:text-xl leading-[1.7] opacity-60 max-w-xl mb-10" style={{ fontFamily: "'Crimson Text', serif" }}>No forms. No twenty questions. Just your email — and a personal reply within 24 hours from the person who'll actually build your site.</p>
            <form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); await fetch("https://formsubmit.co/ajax/hello@studioobrien.com", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email: fd.get("email"), _subject: "The Drop — new email from studioobrien.com" }) }); e.currentTarget.reset(); }} className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-lg">
              <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} />
              <input type="email" name="email" required placeholder="Email Address" className="flex-1 w-full px-5 py-4 rounded-sm text-sm tracking-wider outline-none transition-all duration-300 focus:ring-2" style={{ fontFamily: F.heading, background: "rgba(255,255,255,0.07)", border: `1px solid ${C.gold}30`, color: C.parchment, letterSpacing: "0.08em", ["--tw-ring-color" as string]: C.gold }} />
              <button type="submit" className="px-12 py-4 text-sm tracking-[0.15em] uppercase font-bold rounded-sm transition-all duration-500 hover:scale-105 whitespace-nowrap" style={{ fontFamily: "'Crimson Text', serif", background: C.gold, color: C.deepForest, fontWeight: 600, letterSpacing: "0.12em" }}>Send</button>
            </form>
            <p className="text-xs opacity-30 mt-4" style={{ fontFamily: "'Crimson Text', serif", fontStyle: "italic" }}>We respond to every message personally.</p>
          </div>
        )}

        {/* ════════ 2. THE APPLICATION — A5+B4+C4 ════════ */}
        {/* Scarcity · Multi-step wizard · Step flow */}
        {contactCombo === 1 && (
          <div className="relative z-10 py-32 md:py-44 px-6 max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full" style={{ background: C.gold }} />
                <span className="text-[10px] tracking-[0.4em] uppercase" style={{ fontFamily: "'Cormorant SC', serif", color: C.gold, fontWeight: 600 }}>2 of 3 spots remaining this quarter</span>
                <div className="w-2 h-2 rounded-full" style={{ background: C.gold }} />
              </div>
              <h2 className="text-4xl md:text-6xl tracking-[0.02em] leading-[0.9] mb-4" style={{ fontFamily: F.heading, fontWeight: 700 }}>Apply to Work<br /><span style={{ color: C.gold }}>With Us</span></h2>
              <p className="text-base opacity-50 max-w-md mx-auto" style={{ fontFamily: "'Crimson Text', serif" }}>We take on a limited number of projects to give each one full attention. Three steps — takes under two minutes.</p>
            </div>
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-0 mb-10">
              {["What", "When", "You"].map((label, i) => (
                <div key={label} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300" style={{ fontFamily: F.heading, background: contactStep >= i ? C.gold : "transparent", color: contactStep >= i ? C.deepForest : C.parchment, border: `2px solid ${contactStep >= i ? C.gold : C.gold + "40"}` }}>{i + 1}</div>
                    <span className="text-[9px] tracking-[0.2em] uppercase mt-2 opacity-50" style={{ fontFamily: F.heading }}>{label}</span>
                  </div>
                  {i < 2 && <div className="w-16 md:w-24 h-px mx-3" style={{ background: contactStep > i ? C.gold : `${C.gold}20` }} />}
                </div>
              ))}
            </div>
            {/* Step content */}
            <div className="p-8 md:p-10 rounded-lg" style={{ background: `${C.forest}80`, border: `1px solid ${C.gold}15` }}>
              {contactStep === 0 && (<div>
                <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: F.heading, color: C.gold }}>What do you need?</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Full Website", "Landing Page", "Redesign", "Branding", "E-Commerce", "Strategy Only"].map(s => (
                    <button key={s} onClick={() => { setSelectedService(s); setContactStep(1); }} className="px-4 py-4 rounded-sm text-sm tracking-wider transition-all duration-300 hover:scale-[1.02]" style={{ fontFamily: F.heading, background: selectedService === s ? C.gold : "rgba(255,255,255,0.05)", color: selectedService === s ? C.deepForest : C.parchment, border: `1px solid ${selectedService === s ? C.gold : C.gold + "20"}` }}>{s}</button>
                  ))}
                </div>
              </div>)}
              {contactStep === 1 && (<div>
                <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: F.heading, color: C.gold }}>Timeline & budget range</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {["This Month", "1–2 Months", "3+ Months", "Flexible"].map(t => (
                    <button key={t} onClick={() => setSelectedTimeline(t)} className="px-4 py-3 rounded-sm text-sm tracking-wider transition-all duration-300" style={{ fontFamily: F.heading, background: selectedTimeline === t ? C.gold : "rgba(255,255,255,0.05)", color: selectedTimeline === t ? C.deepForest : C.parchment, border: `1px solid ${selectedTimeline === t ? C.gold : C.gold + "20"}` }}>{t}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {["Under $2k", "$2k–$5k", "$5k–$10k", "$10k+"].map(b => (
                    <button key={b} onClick={() => setSelectedBudget(b)} className="px-4 py-3 rounded-sm text-sm tracking-wider transition-all duration-300" style={{ fontFamily: F.heading, background: selectedBudget === b ? C.gold : "rgba(255,255,255,0.05)", color: selectedBudget === b ? C.deepForest : C.parchment, border: `1px solid ${selectedBudget === b ? C.gold : C.gold + "20"}` }}>{b}</button>
                  ))}
                </div>
                <button onClick={() => setContactStep(2)} className="px-8 py-3 text-sm tracking-[0.15em] uppercase font-bold rounded-sm transition-all duration-300 hover:scale-105" style={{ fontFamily: F.heading, background: C.gold, color: C.deepForest }}>Continue</button>
              </div>)}
              {contactStep === 2 && (<div>
                <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: F.heading, color: C.gold }}>Almost there — how do we reach you?</p>
                <ContactForm />
              </div>)}
            </div>
            <button onClick={() => contactStep > 0 && setContactStep(contactStep - 1)} className="mt-4 text-xs tracking-[0.2em] uppercase opacity-30 hover:opacity-60 transition-opacity" style={{ fontFamily: F.heading, visibility: contactStep > 0 ? "visible" : "hidden" }}>&larr; Back</button>
          </div>
        )}

        {/* ════════ 3. THE QUICK MATCH — A3+B3+C1 ════════ */}
        {/* Value exchange · Interactive selection · Split panel */}
        {contactCombo === 2 && (
          <div className="relative z-10 py-28 md:py-40 px-6 md:px-16 lg:px-20">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="md:w-[50%]">
                <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>Project Match</p>
                <h2 className="text-4xl md:text-6xl tracking-[0.02em] leading-[0.9] mb-4" style={{ fontFamily: "'Fraunces', serif", fontWeight: 900, color: C.parchment }}>Tell us what<br />you need</h2>
                <p className="text-base leading-[1.7] opacity-60 mb-8" style={{ fontFamily: "'Crimson Text', serif" }}>Select everything that applies. We'll tailor our response to exactly what you're looking for — no guesswork on either side.</p>
                <p className="text-xs tracking-[0.3em] uppercase mb-4 opacity-40" style={{ fontFamily: F.heading }}>I need help with:</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["New Website", "Redesign", "Landing Page", "Branding", "SEO & Strategy", "E-Commerce", "Ongoing Support", "Not Sure Yet"].map(tag => (
                    <button key={tag} onClick={() => setSelectedService(prev => prev.includes(tag) ? prev.replace(tag + ",", "").replace(tag, "") : prev + tag + ",")} className="px-4 py-2.5 rounded-full text-xs tracking-wider transition-all duration-300 hover:scale-105" style={{ fontFamily: F.heading, background: selectedService.includes(tag) ? C.gold : "rgba(255,255,255,0.06)", color: selectedService.includes(tag) ? C.deepForest : C.parchment, border: `1px solid ${selectedService.includes(tag) ? C.gold : C.gold + "25"}`, fontWeight: selectedService.includes(tag) ? 700 : 400 }}>{tag}</button>
                  ))}
                </div>
                <div className="space-y-3 text-sm opacity-50">
                  <div className="flex items-center gap-3"><span style={{ color: C.gold }}>&#9993;</span> hello@studioobrien.com</div>
                  <div className="flex items-center gap-3"><span style={{ color: C.gold }}>&#9670;</span> Shelby, NC</div>
                </div>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ delay: 0.2 }} className="flex-1">
                <ContactForm />
              </motion.div>
            </div>
          </div>
        )}

        {/* ════════ 4. THE PROOF WALL — A4+B2+C5 ════════ */}
        {/* Authority · Standard form · Editorial magazine */}
        {contactCombo === 3 && (
          <div className="relative z-10 py-28 md:py-40 px-6 md:px-16 lg:px-20">
            <div className="max-w-5xl mx-auto">
              {/* Proof strip */}
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="grid grid-cols-2 md:grid-cols-4 gap-px mb-16" style={{ background: `${C.gold}15` }}>
                {[
                  { num: "15+", label: "Sites Built" },
                  { num: "100%", label: "Hand-Coded" },
                  { num: "<24h", label: "Response Time" },
                  { num: "0", label: "Templates Used" },
                ].map(stat => (
                  <div key={stat.label} className="p-6 md:p-8 text-center" style={{ background: C.deepForest }}>
                    <div className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: F.heading, color: C.gold }}>{stat.num}</div>
                    <div className="text-[10px] tracking-[0.25em] uppercase opacity-45" style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 500 }}>{stat.label}</div>
                  </div>
                ))}
              </motion.div>
              <div className="flex flex-col md:flex-row gap-12 md:gap-16">
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="md:w-[40%] flex-shrink-0">
                  <p className="text-[10px] tracking-[0.5em] uppercase mb-4" style={{ fontFamily: "'Cormorant SC', serif", color: C.gold, fontWeight: 600 }}>Trusted Craft</p>
                  <h2 className="text-4xl md:text-6xl tracking-tight leading-[0.9] mb-5" style={{ fontFamily: "'Bodoni Moda', serif", fontWeight: 700 }}>The work<br /><span style={{ color: C.gold }}>speaks.</span></h2>
                  <div className="w-16 mb-6" style={{ height: "1px", background: C.gold }} />
                  <p className="text-base leading-[1.7] opacity-60 mb-6" style={{ fontFamily: "'Crimson Text', serif" }}>Every site in our portfolio was built from scratch — designed, coded, and refined by one person who refuses to cut corners. That person will build yours.</p>
                  <div className="space-y-3 text-sm opacity-50">
                    <a href="mailto:hello@studioobrien.com" className="flex items-center gap-3 hover:opacity-80 transition-opacity"><span style={{ color: C.gold }}>&#9993;</span> hello@studioobrien.com</a>
                    <div className="flex items-center gap-3"><span style={{ color: C.gold }}>&#9670;</span> Shelby, NC</div>
                  </div>
                </motion.div>
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ delay: 0.2 }} className="flex-1">
                  <ContactForm />
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* ════════ 5. THE BRIEF — A2+B4+C3 ════════ */}
        {/* Qualifying · Multi-step wizard · Card overlay */}
        {contactCombo === 4 && (
          <div className="relative z-10 py-32 md:py-44 px-6 flex flex-col items-center">
            <div className="w-full max-w-2xl p-8 md:p-12 rounded-lg relative" style={{ background: `linear-gradient(135deg, ${C.forest}dd, ${C.deepForest}f0)`, border: `1px solid ${C.gold}20`, boxShadow: `0 24px 80px rgba(0,0,0,0.5)` }}>
              <div className="absolute top-0 left-8 right-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}40, transparent)` }} />
              <div className="text-center mb-8">
                <Ornament className="w-24 mx-auto mb-6" color={C.gold} />
                <h2 className="text-3xl md:text-5xl tracking-tight leading-[0.95] mb-3" style={{ fontFamily: F.heading, fontWeight: 700 }}>Project Brief</h2>
                <p className="text-sm opacity-50" style={{ fontFamily: "'Crimson Text', serif" }}>The better we understand your goals, the sharper our first conversation will be.</p>
              </div>
              {/* Progress */}
              <div className="flex gap-1 mb-8">
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500" style={{ background: contactStep >= i ? C.gold : `${C.gold}15` }} />
                ))}
              </div>
              {contactStep === 0 && (<div>
                <p className="text-xs tracking-[0.25em] uppercase mb-5" style={{ fontFamily: F.heading, color: C.gold }}>What are you looking for?</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "New Website", desc: "Starting from zero" },
                    { val: "Redesign", desc: "Rebuild what you have" },
                    { val: "Landing Page", desc: "One focused page" },
                    { val: "Branding", desc: "Identity & visuals" },
                    { val: "E-Commerce", desc: "Sell online" },
                    { val: "Consultation", desc: "Strategy session" },
                  ].map(s => (
                    <button key={s.val} onClick={() => { setSelectedService(s.val); setContactStep(1); }} className="p-4 rounded-sm text-left transition-all duration-300 hover:scale-[1.02] group" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.gold}15` }}>
                      <span className="block text-sm font-bold tracking-wider" style={{ fontFamily: F.heading, color: C.parchment }}>{s.val}</span>
                      <span className="block text-xs opacity-40 mt-1" style={{ fontFamily: "'Crimson Text', serif" }}>{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>)}
              {contactStep === 1 && (<div>
                <p className="text-xs tracking-[0.25em] uppercase mb-5" style={{ fontFamily: F.heading, color: C.gold }}>What's your timeline?</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {["ASAP", "1–2 Months", "3–6 Months", "Just Exploring"].map(t => (
                    <button key={t} onClick={() => { setSelectedTimeline(t); setContactStep(2); }} className="px-4 py-4 rounded-sm text-sm tracking-wider transition-all duration-300" style={{ fontFamily: F.heading, background: "rgba(255,255,255,0.04)", color: C.parchment, border: `1px solid ${C.gold}15` }}>{t}</button>
                  ))}
                </div>
                <button onClick={() => setContactStep(0)} className="text-xs tracking-[0.15em] uppercase opacity-30 hover:opacity-60 transition-opacity" style={{ fontFamily: F.heading }}>&larr; Back</button>
              </div>)}
              {contactStep === 2 && (<div>
                <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ fontFamily: F.heading, color: C.gold }}>Last step — your details</p>
                <p className="text-xs opacity-30 mb-5" style={{ fontFamily: "'Crimson Text', serif" }}>Selected: {selectedService} · {selectedTimeline}</p>
                <ContactForm />
                <button onClick={() => setContactStep(1)} className="mt-3 text-xs tracking-[0.15em] uppercase opacity-30 hover:opacity-60 transition-opacity" style={{ fontFamily: F.heading }}>&larr; Back</button>
              </div>)}
            </div>
          </div>
        )}

        {/* ════════ 6. THE DIAGNOSTIC — A3+B5+C2 ════════ */}
        {/* Value exchange · Diagnostic assessment · Centered monument */}
        {contactCombo === 5 && (
          <div className="relative z-10 py-32 md:py-44 px-6 max-w-3xl mx-auto text-center">
            <p className="text-[10px] tracking-[0.5em] uppercase mb-4" style={{ fontFamily: "'Cormorant SC', serif", color: C.gold, fontWeight: 600 }}>Free Assessment</p>
            <h2 className="text-4xl md:text-6xl tracking-tight leading-[0.9] mb-4" style={{ fontFamily: "'Literata', serif", fontWeight: 900 }}>How's your website<br /><span style={{ color: C.gold }}>actually performing?</span></h2>
            <p className="text-base opacity-55 max-w-lg mx-auto mb-10" style={{ fontFamily: "'Crimson Text', serif" }}>Answer three quick questions. We'll give you an honest read — and a recommendation you can act on, whether you hire us or not.</p>
            <div className="max-w-xl mx-auto text-left">
              {contactStep === 0 && (<div>
                <p className="text-xs tracking-[0.3em] uppercase mb-5" style={{ fontFamily: F.heading, color: C.gold }}>Do you have a website right now?</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { val: "none", label: "No website yet", desc: "Starting fresh — need the whole thing built" },
                    { val: "outdated", label: "Yes, but it's outdated", desc: "Looks old, doesn't represent us anymore" },
                    { val: "template", label: "Yes, it's a template", desc: "Wix / Squarespace / WordPress theme" },
                    { val: "custom", label: "Yes, custom-built", desc: "But something isn't working" },
                  ].map(opt => (
                    <button key={opt.val} onClick={() => { setSelectedService(opt.val); setContactStep(1); }} className="p-5 rounded-sm text-left transition-all duration-300 hover:scale-[1.01] flex items-start gap-4" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.gold}15` }}>
                      <div className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" style={{ border: `2px solid ${C.gold}40` }} />
                      <div>
                        <span className="block text-sm font-bold" style={{ fontFamily: F.heading }}>{opt.label}</span>
                        <span className="block text-xs opacity-40 mt-1" style={{ fontFamily: "'Crimson Text', serif" }}>{opt.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>)}
              {contactStep === 1 && (<div>
                <p className="text-xs tracking-[0.3em] uppercase mb-5" style={{ fontFamily: F.heading, color: C.gold }}>What's the #1 thing you wish your site could do better?</p>
                <div className="grid grid-cols-2 gap-3">
                  {["Attract customers", "Look professional", "Rank on Google", "Convert visitors", "Tell our story", "Just exist"].map(goal => (
                    <button key={goal} onClick={() => { setSelectedTimeline(goal); setContactStep(2); }} className="px-4 py-4 rounded-sm text-sm tracking-wider transition-all duration-300" style={{ fontFamily: F.heading, background: "rgba(255,255,255,0.04)", color: C.parchment, border: `1px solid ${C.gold}15` }}>{goal}</button>
                  ))}
                </div>
                <button onClick={() => setContactStep(0)} className="mt-4 text-xs tracking-[0.15em] uppercase opacity-30 hover:opacity-60" style={{ fontFamily: F.heading }}>&larr; Back</button>
              </div>)}
              {contactStep === 2 && (<div className="text-center">
                <div className="inline-block p-8 rounded-lg mb-8" style={{ background: `${C.gold}10`, border: `1px solid ${C.gold}25` }}>
                  <p className="text-xs tracking-[0.3em] uppercase mb-3 opacity-50" style={{ fontFamily: F.heading }}>Your Situation</p>
                  <p className="text-2xl font-bold mb-2" style={{ fontFamily: F.heading, color: C.gold }}>You're leaving money on the table.</p>
                  <p className="text-sm opacity-60" style={{ fontFamily: "'Crimson Text', serif" }}>A {selectedService === "none" ? "missing" : selectedService === "template" ? "template-based" : "dated"} website that can't {selectedTimeline?.toLowerCase()} is costing you customers every day.</p>
                </div>
                <p className="text-sm opacity-50 mb-6" style={{ fontFamily: "'Crimson Text', serif" }}>Drop your email for a free, personalized assessment of what a purpose-built site could do for your business.</p>
                <form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); await fetch("https://formsubmit.co/ajax/hello@studioobrien.com", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email: fd.get("email"), situation: selectedService, goal: selectedTimeline, _subject: "Diagnostic — free assessment request" }) }); e.currentTarget.reset(); }} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                  <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} />
                  <input type="email" name="email" required placeholder="your@email.com" className="flex-1 w-full px-5 py-4 rounded-sm text-base outline-none" style={{ fontFamily: F.body, background: "rgba(255,255,255,0.07)", border: `1px solid ${C.gold}30`, color: C.parchment }} />
                  <button type="submit" className="px-8 py-4 text-sm tracking-[0.15em] uppercase font-bold rounded-sm" style={{ fontFamily: F.heading, background: C.gold, color: C.deepForest }}>Get My Assessment</button>
                </form>
              </div>)}
            </div>
          </div>
        )}

        {/* ════════ 7. THE CONVERSATION — A1+B2+C1 ════════ */}
        {/* Low friction · Standard form · Split panel — classic refined */}
        {contactCombo === 6 && (
          <div className="relative z-10 py-28 md:py-40 px-6 md:px-16 lg:px-20">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 md:gap-16">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="md:w-[40%] flex-shrink-0">
                <div className="w-40 mb-8"><Ornament /></div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.9] mb-6" style={{ fontFamily: F.heading, fontWeight: 700 }}>
                  let us build<br /><span style={{ color: C.gold }}>your kingdom</span>
                </h2>
                <div className="w-16 mb-6" style={{ height: "1px", background: C.gold }} />
                <p className="text-lg leading-[1.7] opacity-65 mb-8" style={{ fontFamily: "'Crimson Text', serif" }}>Every great legacy begins with a single step. Take yours — tell us about your business and what you're trying to build.</p>
                <div className="space-y-3 text-sm opacity-50">
                  <a href="mailto:hello@studioobrien.com" className="flex items-center gap-3 hover:opacity-80 transition-opacity"><span style={{ color: C.gold }}>&#9993;</span> hello@studioobrien.com</a>
                  <div className="flex items-center gap-3"><span style={{ color: C.gold }}>&#9670;</span> Shelby, NC</div>
                </div>
              </motion.div>
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ delay: 0.2 }} className="flex-1">
                <ContactForm />
              </motion.div>
            </div>
          </div>
        )}

        {/* ════════ 8. THE STUDIO SELECT — A5+B3+C5 ════════ */}
        {/* Scarcity · Interactive selection · Editorial */}
        {contactCombo === 7 && (
          <div className="relative z-10 py-28 md:py-40 px-6 md:px-16 lg:px-20">
            <div className="max-w-5xl mx-auto">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="mb-14">
                <div className="flex items-center gap-6 mb-6">
                  <div className="h-px flex-1" style={{ background: `${C.gold}20` }} />
                  <p className="text-[10px] tracking-[0.5em] uppercase" style={{ fontFamily: "'Cormorant SC', serif", color: C.gold, fontWeight: 600 }}>Limited Availability</p>
                  <div className="h-px flex-1" style={{ background: `${C.gold}20` }} />
                </div>
                <h2 className="text-5xl md:text-7xl tracking-tight leading-[0.9] text-center mb-4" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400 }}>Select your service</h2>
                <p className="text-center text-base opacity-50 max-w-lg mx-auto" style={{ fontFamily: "'Crimson Text', serif" }}>Choose what you're after, then tell us the details. We'll confirm availability within one business day.</p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
                {[
                  { name: "Full Website", price: "From $3,500", desc: "Complete design, development, and launch. The whole thing, built by hand.", icon: "&#9733;" },
                  { name: "Landing Page", price: "From $1,200", desc: "One high-converting page designed to drive a single action.", icon: "&#9670;" },
                  { name: "Redesign", price: "From $2,500", desc: "Tear it down and rebuild it right. Same brand, better everything.", icon: "&#8634;" },
                ].map(svc => (
                  <button key={svc.name} onClick={() => setSelectedService(svc.name)} className="p-6 md:p-8 rounded-sm text-left transition-all duration-300 hover:scale-[1.02]" style={{ background: selectedService === svc.name ? `${C.gold}15` : "rgba(255,255,255,0.03)", border: `1px solid ${selectedService === svc.name ? C.gold : C.gold + "15"}` }}>
                    <span className="text-2xl block mb-3" style={{ color: C.gold }} dangerouslySetInnerHTML={{ __html: svc.icon }} />
                    <span className="block text-lg font-bold tracking-wider mb-1" style={{ fontFamily: F.heading, color: C.parchment }}>{svc.name}</span>
                    <span className="block text-xs tracking-[0.2em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>{svc.price}</span>
                    <span className="block text-sm leading-relaxed opacity-50" style={{ fontFamily: "'Crimson Text', serif" }}>{svc.desc}</span>
                  </button>
                ))}
              </div>
              <div className="max-w-xl mx-auto">
                <ContactForm />
              </div>
            </div>
          </div>
        )}

        {/* ════════ 9. THE SIGNAL — A4+B1+C3 ════════ */}
        {/* Authority · Single field · Card overlay */}
        {contactCombo === 8 && (
          <div className="relative z-10 py-36 md:py-48 px-6 flex items-center justify-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="w-full max-w-lg text-center p-10 md:p-14 rounded-lg relative" style={{ background: `linear-gradient(180deg, ${C.forest}e0, ${C.deepForest}f8)`, border: `1px solid ${C.gold}18`, boxShadow: `0 32px 80px rgba(0,0,0,0.6)` }}>
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-24 h-px" style={{ background: C.gold }} />
              <Ornament className="w-20 mx-auto mb-6" color={C.gold} />
              <p className="text-[10px] tracking-[0.5em] uppercase mb-3 opacity-40" style={{ fontFamily: "'Cormorant SC', serif", fontWeight: 600 }}>15 Sites Built · 0 Templates Used</p>
              <h2 className="text-3xl md:text-5xl tracking-tight leading-[0.95] mb-4" style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>Ready when<br /><span style={{ color: C.gold }}>you are</span></h2>
              <p className="text-base leading-[1.7] opacity-55 mb-8" style={{ fontFamily: "'Crimson Text', serif" }}>One email starts the conversation. We'll respond personally within 24 hours with our honest take on what we can build together.</p>
              <form onSubmit={async (e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); await fetch("https://formsubmit.co/ajax/hello@studioobrien.com", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email: fd.get("email"), _subject: "The Signal — new contact from studioobrien.com" }) }); e.currentTarget.reset(); }} className="space-y-3">
                <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} />
                <input type="email" name="email" required placeholder="your@email.com" className="w-full px-5 py-4 rounded-sm text-base text-center outline-none" style={{ fontFamily: F.body, background: "rgba(255,255,255,0.07)", border: `1px solid ${C.gold}30`, color: C.parchment }} />
                <button type="submit" className="w-full px-8 py-4 text-sm tracking-[0.2em] uppercase font-bold rounded-sm transition-all duration-500 hover:scale-105" style={{ fontFamily: F.heading, background: C.gold, color: C.deepForest }}>Start the Conversation</button>
              </form>
              <p className="text-xs opacity-25 mt-4" style={{ fontFamily: "'Crimson Text', serif", fontStyle: "italic" }}>hello@studioobrien.com · Shelby, NC</p>
            </motion.div>
          </div>
        )}

        {/* ════════ 10. THE ARCHITECT — A2+B3+C2 ════════ */}
        {/* Qualifying · Interactive selection · Centered monument */}
        {contactCombo === 9 && (
          <div className="relative z-10 py-28 md:py-40 px-6 max-w-4xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="text-center mb-14">
              <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: F.heading, color: C.gold }}>New Project</p>
              <h2 className="text-5xl md:text-7xl tracking-[0.03em] leading-[0.85] mb-5" style={{ fontFamily: F.heading, fontWeight: 700 }}>architect<br /><span style={{ color: C.gold }}>your vision</span></h2>
              <p className="text-base opacity-50 max-w-md mx-auto" style={{ fontFamily: "'Crimson Text', serif" }}>Configure your project below. The more we know upfront, the faster we can show you what's possible.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ fontFamily: F.heading, color: C.gold }}>Project Type</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Full Website", "Redesign", "Landing Page", "E-Commerce"].map(s => (
                    <button key={s} onClick={() => setSelectedService(s)} className="px-3 py-3 rounded-sm text-xs tracking-wider transition-all duration-300" style={{ fontFamily: F.heading, background: selectedService === s ? C.gold : "rgba(255,255,255,0.04)", color: selectedService === s ? C.deepForest : C.parchment, border: `1px solid ${selectedService === s ? C.gold : C.gold + "15"}` }}>{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ fontFamily: F.heading, color: C.gold }}>Budget Range</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Under $2k", "$2k–$5k", "$5k–$10k", "$10k+"].map(b => (
                    <button key={b} onClick={() => setSelectedBudget(b)} className="px-3 py-3 rounded-sm text-xs tracking-wider transition-all duration-300" style={{ fontFamily: F.heading, background: selectedBudget === b ? C.gold : "rgba(255,255,255,0.04)", color: selectedBudget === b ? C.deepForest : C.parchment, border: `1px solid ${selectedBudget === b ? C.gold : C.gold + "15"}` }}>{b}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ fontFamily: F.heading, color: C.gold }}>Timeline</p>
                <div className="grid grid-cols-2 gap-2">
                  {["ASAP", "1–2 Months", "3–6 Months", "Flexible"].map(t => (
                    <button key={t} onClick={() => setSelectedTimeline(t)} className="px-3 py-3 rounded-sm text-xs tracking-wider transition-all duration-300" style={{ fontFamily: F.heading, background: selectedTimeline === t ? C.gold : "rgba(255,255,255,0.04)", color: selectedTimeline === t ? C.deepForest : C.parchment, border: `1px solid ${selectedTimeline === t ? C.gold : C.gold + "15"}` }}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] uppercase mb-4" style={{ fontFamily: F.heading, color: C.gold }}>Must-Haves</p>
                <div className="grid grid-cols-2 gap-2">
                  {["SEO", "Mobile-First", "Animations", "CMS", "Analytics", "Speed"].map(feat => (
                    <button key={feat} onClick={() => setSelectedService(prev => prev.includes("+" + feat) ? prev.replace("+" + feat, "") : prev + "+" + feat)} className="px-3 py-3 rounded-sm text-xs tracking-wider transition-all duration-300" style={{ fontFamily: F.heading, background: selectedService.includes("+" + feat) ? `${C.gold}30` : "rgba(255,255,255,0.04)", color: C.parchment, border: `1px solid ${selectedService.includes("+" + feat) ? C.gold + "60" : C.gold + "15"}` }}>{feat}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="max-w-xl mx-auto">
              <ContactForm />
            </div>
          </div>
        )}

      </section>
      </LeafReveal>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      {/* ═══════════════════ FOOTER — Grand Banner ═══════════════════ */}
      {(() => {
        const navLinks = [
          { label: "Services", href: "#craft" },
          { label: "Process", href: "#journey" },
          { label: "Work", href: "#portfolio" },
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
              <p className="text-sm md:text-base italic opacity-75 max-w-md mb-10" style={{ fontWeight: 400, color: C.forest }}>
                Where timeless craft meets the art of the digital age.
              </p>
              <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-xs tracking-[0.25em] uppercase mb-10" style={fStyle}>
                {navLinks.map((l) => (
                  <a key={l.label} href={l.href} className="opacity-70 hover:opacity-100 transition-all duration-300" style={{ color: C.deepForest }}>{l.label}</a>
                ))}
              </div>
              <div className="flex gap-8 text-xs tracking-[0.2em] uppercase opacity-65 mb-10" style={{ ...fStyle, color: C.deepForest }}>
                {socials.map((s) => <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined} className="hover:opacity-100 transition-opacity">{s.label}</a>)}
              </div>
              <Ornament className="w-32 md:w-40 mb-6" color={C.gold} />
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs opacity-70" style={{ color: C.deepForest }}>
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
