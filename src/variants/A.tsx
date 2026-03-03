import { useRef, useEffect, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
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

/* ─── INLINE KEYFRAMES ─── */
const STYLE_ID = "hidden-garden-kf";
const css = `
@keyframes hg-float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(3deg)}}
@keyframes hg-shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes hg-pulse{0%,100%{opacity:0.4}50%{opacity:1}}
@keyframes hg-sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@keyframes hg-scroll-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
@keyframes hg-grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}20%{transform:translate(-15%,5%)}30%{transform:translate(7%,-25%)}40%{transform:translate(-5%,25%)}50%{transform:translate(-15%,10%)}60%{transform:translate(15%,0%)}70%{transform:translate(0%,15%)}80%{transform:translate(3%,35%)}90%{transform:translate(-10%,10%)}}
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

/* ─── ANIMATION VARIANTS ─── */
const vp = { once: true, margin: "-80px" as const };
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

/* ─── SCATTERED LEAVES ─── */
function ScatteredLeaves({ open }: { open: boolean }) {
  const leaves = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const dist = 300 + Math.random() * 500;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 200,
      rot: Math.random() * 720 - 360,
      size: 12 + Math.random() * 20,
      delay: Math.random() * 0.8,
    };
  });

  return (
    <div className="fixed inset-0 z-[52] pointer-events-none overflow-hidden">
      {leaves.map((l) => (
        <motion.div
          key={l.id}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            width: l.size,
            height: l.size * 1.4,
          }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0 }}
          animate={
            open
              ? {
                  x: l.x,
                  y: l.y,
                  opacity: [0, 1, 1, 0],
                  rotate: l.rot,
                  scale: [0, 1.2, 1, 0.5],
                }
              : {}
          }
          transition={{
            duration: 3.5,
            delay: l.delay + 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <svg viewBox="0 0 20 28" fill={C.emerald}>
            <path d="M10 0C6 8 0 14 0 20s6 6 10 8c4-2 10-2 10-8S14 8 10 0z" opacity="0.7" />
            <line x1="10" y1="4" x2="10" y2="24" stroke={C.sage} strokeWidth="0.5" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── CURTAIN PANELS (Cinematic Auto-Open) ─── */
function FoliageCurtain({ onOpen }: { onOpen: () => void }) {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const triggered = useRef(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Start animation after 1.5 seconds
    const startTimer = setTimeout(() => {
      if (!triggered.current) {
        triggered.current = true;
        setPhase("opening");
        document.body.style.overflow = "";
      }
    }, 1500);

    // Set phase to "open" and call onOpen after 4.5 seconds total
    const endTimer = setTimeout(() => {
      setPhase("open");
      onOpen();
    }, 4500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
      document.body.style.overflow = "";
    };
  }, [onOpen]);

  const isOpening = phase === "opening";
  const gone = phase === "open";

  /* Smooth TWEEN animation with material design decelerate curve */
  const tweenTransition = {
    type: "tween" as const,
    duration: 2.5,
    ease: [0.4, 0, 0.2, 1],
  };

  return (
    <>
      {/* ── LEFT PANEL (hedge image) ── */}
      <motion.div
        className="fixed top-0 bottom-0 left-0 z-[51] overflow-hidden"
        style={{
          width: "54%",
          pointerEvents: gone ? "none" : "auto",
        }}
        animate={{
          x: isOpening || gone ? "-100%" : "0%",
          scale: isOpening || gone ? 1.08 : 1.0,
          opacity: gone ? 0 : 1,
        }}
        transition={{
          x: tweenTransition,
          scale: tweenTransition,
          opacity: gone ? { duration: 0.01 } : { duration: 99 },
        }}
      >
        <img
          src="/images/side-one.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
      </motion.div>

      {/* ── RIGHT PANEL (hedge image, overlaps left) ── */}
      <motion.div
        className="fixed top-0 bottom-0 z-[52] overflow-hidden"
        style={{
          left: "46%",
          width: "54%",
          pointerEvents: gone ? "none" : "auto",
        }}
        animate={{
          x: isOpening || gone ? "100%" : "0%",
          scale: isOpening || gone ? 1.08 : 1.0,
          opacity: gone ? 0 : 1,
        }}
        transition={{
          x: tweenTransition,
          scale: tweenTransition,
          opacity: gone ? { duration: 0.01 } : { duration: 99 },
        }}
      >
        <img
          src="/images/side-two.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-left"
        />
      </motion.div>

      {/* ── CENTER SEAM LINE ── */}
      <motion.div
        className="fixed top-0 bottom-0 z-[52] pointer-events-none"
        style={{
          left: "50%",
          width: 2,
          marginLeft: -1,
          background: `linear-gradient(180deg, transparent 5%, ${C.gold}40, ${C.brightGold}70, ${C.gold}40, transparent 95%)`,
          boxShadow: `0 0 20px ${C.gold}30`,
        }}
        animate={{ opacity: gone || isOpening ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      />
    </>
  );
}

/* ═══════════════════════════════════════════ *
 *              MAIN APP COMPONENT             *
 * ═══════════════════════════════════════════ */
export default function App() {
  const [curtainOpen, setCurtainOpen] = useState(false);

  useEffect(() => {
    injectStyles();
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

  const services = [
    {
      title: "Website Creation",
      desc: "Bespoke digital estates crafted with precision and artistry, designed to captivate and convert.",
      icon: "🏰",
    },
    {
      title: "AI Integration",
      desc: "Ancient wisdom meets modern intelligence — automation that thinks and adapts.",
      icon: "⚔️",
    },
    {
      title: "Marketing Solutions",
      desc: "Strategic campaigns forged in data, tempered by creativity, wielded with purpose.",
      icon: "🛡️",
    },
    {
      title: "Business Automation",
      desc: "Invisible systems working tirelessly, so your kingdom runs itself.",
      icon: "👑",
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
      <FoliageCurtain onOpen={() => setCurtainOpen(true)} />

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
        className="fixed top-4 left-4 right-4 md:left-8 md:right-8 z-50 flex justify-between items-center px-8 py-4"
      >
        <div
          className="absolute inset-0 rounded-full backdrop-blur-md border"
          style={{
            background: `${C.deepForest}cc`,
            borderColor: `${C.gold}30`,
          }}
        />
        <span
          className="relative z-10 text-sm tracking-[0.25em] uppercase"
          style={{ fontFamily: F.heading, color: C.gold }}
        >
          Studio O'Brien
        </span>
        <div
          className="relative z-10 hidden md:flex gap-8 text-xs tracking-[0.2em] uppercase"
          style={{ fontFamily: F.heading, color: C.parchment }}
        >
          <a href="#craft" className="hover:opacity-70 transition-opacity">Our Craft</a>
          <a href="#journey" className="hover:opacity-70 transition-opacity">The Journey</a>
          <a href="#investment" className="hover:opacity-70 transition-opacity">Investment</a>
        </div>
        <a
          href="#contact"
          className="relative z-10 px-6 py-2 text-xs tracking-[0.15em] uppercase rounded-full transition-all duration-300 hover:scale-105"
          style={{
            fontFamily: F.heading,
            background: `linear-gradient(135deg, ${C.gold}, ${C.brightGold})`,
            color: C.deepForest,
          }}
        >
          Inquire
        </a>
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
          className="relative z-10 text-center px-6"
        >
          {/* Top ornament */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={curtainOpen ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="w-48 md:w-64 mx-auto mb-6"
          >
            <Ornament />
          </motion.div>

          {/* Welcome to */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={curtainOpen ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 1.0 }}
            className="text-sm md:text-base tracking-[0.4em] uppercase mb-2"
            style={{ fontFamily: F.heading, color: C.sage }}
          >
            Welcome to
          </motion.p>

          {/* Main Title - Studio line */}
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={curtainOpen ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 1.5,
              delay: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight"
            style={{ fontFamily: F.display, color: C.forest }}
          >
            Studio
          </motion.h1>

          {/* Main Title - O'Brien line */}
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={curtainOpen ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 1.5,
              delay: 2.0,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight"
            style={{
              fontFamily: F.display,
              color: C.gold,
              textShadow: `0 2px 30px ${C.gold}30`,
            }}
          >
            O'Brien
          </motion.h1>

          {/* Bottom ornament */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={curtainOpen ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 2.5 }}
            className="w-48 md:w-64 mx-auto mt-6"
          >
            <Ornament />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={curtainOpen ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 3.0 }}
            className="mt-8 text-lg md:text-xl max-w-md mx-auto leading-relaxed italic"
            style={{ fontFamily: F.body, color: C.emerald, fontWeight: 300 }}
          >
            Where ancient craft meets modern enchantment.
            <br />
            AI-powered digital artistry, one kingdom at a time.
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#craft"
            initial={{ opacity: 0, y: 20 }}
            animate={curtainOpen ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.0, delay: 3.5 }}
            className="inline-block mt-10 px-10 py-4 text-sm tracking-[0.2em] uppercase rounded-full transition-all duration-500 hover:scale-105"
            style={{
              fontFamily: F.heading,
              border: `1.5px solid ${C.gold}`,
              color: C.gold,
              background: "transparent",
            }}
            whileHover={{
              background: `linear-gradient(135deg, ${C.gold}, ${C.brightGold})`,
              color: C.deepForest,
            }}
          >
            Enter the Garden
          </motion.a>
        </motion.div>

        {/* Scroll prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={curtainOpen ? { opacity: 1 } : {}}
          transition={{ delay: 5, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
      <Section
        id="craft"
        bg={C.deepForest}
        color={C.parchment}
        overlay={
          <>
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: leafPattern,
                backgroundSize: "80px 80px",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 80% 50% at 50% 100%, ${C.emerald}20, transparent)`,
              }}
            />
          </>
        }
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: F.heading, color: C.gold }}
          >
            What We Do
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl tracking-tight"
            style={{ fontFamily: F.display }}
          >
            Our Craft
          </h2>
          <div className="w-40 mx-auto mt-6">
            <Ornament />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={vp}
              transition={{ duration: 1.2, delay: i * 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-8 md:p-10 rounded-sm group cursor-default transition-all duration-500"
              style={{
                background: `${C.forest}60`,
                border: `1px solid ${C.gold}15`,
              }}
              whileHover={{
                borderColor: `${C.gold}40`,
                background: `${C.forest}90`,
              }}
            >
              <CornerAccents color={`${C.gold}40`} />

              <span className="text-3xl mb-4 block">{s.icon}</span>
              <h3
                className="text-xl md:text-2xl tracking-wide mb-3"
                style={{ fontFamily: F.heading, color: C.paleGold }}
              >
                {s.title}
              </h3>
              <p
                className="text-base leading-relaxed opacity-70 group-hover:opacity-90 transition-opacity"
                style={{ fontWeight: 300 }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════ DIVIDER ═══════════════════ */}
      <div
        className="py-6 flex items-center justify-center"
        style={{ background: C.ivory }}
      >
        <div className="w-64">
          <Ornament color={C.emerald} />
        </div>
      </div>

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
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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
              transition={{ duration: 1.2, delay: i * 0.25, ease: [0.22, 1, 0.36, 1] }}
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

      {/* ═══════════════════ PRICING / THE INVESTMENT ═══════════════════ */}
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
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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
          transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
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

      {/* ═══════════════════ CTA ═══════════════════ */}
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
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 1.2, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
          <span
            className="text-base tracking-[0.15em]"
            style={{ fontFamily: F.display, color: C.gold }}
          >
            Studio O'Brien
          </span>
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
