import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const F = { display: "'Archivo Black', sans-serif", body: "'DM Sans', sans-serif" };
const C = {
  coral: "#ff5f5d", lime: "#c8f542", indigo: "#2b2d6e",
  lavender: "#c4b5fd", cream: "#fef9ef", dark: "#1a1a2e",
  pink: "#ff8fab", teal: "#0fd9b0",
};

const STYLE_ID = "d4-kf";
const css = `
@keyframes d4-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes d4-wiggle{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
`;
function injectStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style"); s.id = STYLE_ID; s.textContent = css; document.head.appendChild(s);
}

const vp = { once: true, margin: "-50px" as const };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const patterns = {
  dots: (c: string) => `radial-gradient(circle,${c} 3px,transparent 3px)`,
  stripes: (c: string) => `repeating-linear-gradient(45deg,${c} 0px,${c} 8px,transparent 8px,transparent 16px)`,
  checker: (c: string) => `repeating-conic-gradient(${c} 0% 25%,transparent 0% 50%)`,
};

function Marquee({ text, bg, fg, speed = 30 }: { text: string; bg: string; fg: string; speed?: number }) {
  const r = Array(12).fill(text).join(" ★ ");
  return (
    <div className="overflow-hidden py-3 whitespace-nowrap" style={{ background: bg, color: fg }}>
      <div className="inline-block text-sm font-bold uppercase tracking-[0.15em]" style={{ fontFamily: F.body, animation: `d4-marquee ${speed}s linear infinite` }}>
        {r}&nbsp;&nbsp;{r}
      </div>
    </div>
  );
}

export default function Design4() {
  useEffect(() => { injectStyles(); }, []);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: F.body }}>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" style={{ background: C.cream }}>
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: patterns.dots(C.indigo), backgroundSize: "24px 24px" }} />
        <motion.div style={{ y: heroY }} className="absolute top-[8%] right-[8%] md:right-[10%] pointer-events-none">
          <div className="w-40 h-40 md:w-64 md:h-64 rounded-full" style={{ background: C.coral, opacity: 0.9, animation: "d4-wiggle 6s ease-in-out infinite" }} />
        </motion.div>
        <div className="absolute bottom-[12%] left-[6%] w-28 h-28 md:w-40 md:h-40 pointer-events-none" style={{ background: C.lime, transform: "rotate(12deg)" }} />
        <div className="absolute top-[50%] right-[30%] w-16 h-16 md:w-24 md:h-24 rounded-full border-4 pointer-events-none" style={{ borderColor: C.indigo }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[10rem] leading-[0.85] tracking-tight uppercase"
            style={{ fontFamily: F.display, color: C.indigo }}>
            Studio<br /><span style={{ color: C.coral }}>O'Brien</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center gap-4">
            <a href="#pricing" className="inline-block px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-full transition-transform duration-300 hover:scale-105"
              style={{ background: C.indigo, color: C.cream }}>Get Started</a>
            <span className="text-sm font-medium" style={{ color: C.indigo, opacity: 0.6 }}>AI-powered everything. One flat fee.</span>
          </motion.div>
        </div>
      </section>

      <Marquee text="WEBSITES • AI • MARKETING • AUTOMATION" bg={C.indigo} fg={C.lime} />

      {/* ── SERVICES ── */}
      <section id="services" className="relative py-20 md:py-28 px-8 md:px-16 lg:px-20 overflow-hidden" style={{ background: C.coral, color: C.cream }}>
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: patterns.stripes(C.cream) }} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl uppercase tracking-tight mb-12" style={{ fontFamily: F.display }}>What we do</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { t: "Website Creation", bg: C.indigo, fg: C.cream, p: patterns.dots(C.cream + "15") },
              { t: "AI Integration", bg: C.lime, fg: C.indigo, p: patterns.stripes(C.indigo + "08") },
              { t: "Marketing Solutions", bg: C.cream, fg: C.indigo, p: patterns.dots(C.coral + "15") },
              { t: "Business Automation", bg: C.dark, fg: C.lime, p: patterns.stripes(C.lime + "08") },
            ] as const).map((s, i) => (
              <motion.div key={s.t} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative p-8 md:p-12 overflow-hidden rounded-2xl group cursor-default" style={{ background: s.bg, color: s.fg }}>
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: s.p, backgroundSize: "16px 16px" }} />
                <h3 className="relative z-10 text-2xl md:text-3xl uppercase tracking-tight" style={{ fontFamily: F.display }}>{s.t}</h3>
                <div className="relative z-10 mt-6 text-2xl opacity-40 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">→</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Marquee text="ONE FEE • NO SURPRISES • CANCEL ANYTIME • FULL SERVICE" bg={C.lime} fg={C.indigo} speed={35} />

      {/* ── PROCESS ── */}
      <section className="relative py-20 md:py-28 px-8 md:px-16 lg:px-20" style={{ background: C.indigo, color: C.cream }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: patterns.checker(C.cream), backgroundSize: "30px 30px" }} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl uppercase tracking-tight mb-16" style={{ fontFamily: F.display }}>How it works</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([
              { n: "01", t: "Discover", c: C.coral },
              { n: "02", t: "Build", c: C.lime },
              { n: "03", t: "Launch", c: C.pink },
            ] as const).map((s, i) => (
              <motion.div key={s.n} variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="relative p-8 md:p-10 rounded-2xl overflow-hidden" style={{ background: s.c, color: s.c === C.lime ? C.indigo : C.cream }}>
                <span className="text-7xl md:text-8xl font-bold opacity-20 absolute top-2 right-4" style={{ fontFamily: F.display }}>{s.n}</span>
                <h3 className="relative z-10 text-3xl md:text-4xl uppercase" style={{ fontFamily: F.display }}>{s.t}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative py-20 md:py-28 px-8 md:px-16 lg:px-20 overflow-hidden" style={{ background: C.cream, color: C.indigo }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: patterns.dots(C.indigo), backgroundSize: "20px 20px" }} />
        <div className="absolute top-[10%] left-[5%] w-20 h-20 rounded-full pointer-events-none" style={{ background: C.lavender }} />
        <div className="absolute bottom-[10%] right-[8%] w-16 h-16 pointer-events-none" style={{ background: C.coral, transform: "rotate(15deg)" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ duration: 0.8 }}
            className="text-4xl md:text-7xl uppercase tracking-tight mb-4" style={{ fontFamily: F.display }}>One price.</motion.h2>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-10 p-10 md:p-16 rounded-3xl" style={{ background: C.indigo, color: C.cream }}>
            <div className="text-6xl md:text-8xl font-bold uppercase mb-2" style={{ fontFamily: F.display, color: C.lime }}>$3,500</div>
            <p className="text-base mb-10 opacity-60">/month — everything included</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left mb-10">
              {["Custom Website","AI Chatbot","SEO & Content","Marketing","Automation","Analytics","Revisions","Support"].map((f) => (
                <div key={f} className="text-sm font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: C.lime }} />{f}
                </div>
              ))}
            </div>
            <a href="#contact" className="inline-block px-10 py-4 text-sm font-bold uppercase tracking-wider rounded-full transition-transform duration-300 hover:scale-105"
              style={{ background: C.lime, color: C.indigo }}>Get Started Now</a>
          </motion.div>
        </div>
      </section>

      <Marquee text="LET'S BUILD SOMETHING INCREDIBLE TOGETHER" bg={C.coral} fg={C.cream} speed={25} />

      {/* ── CTA ── */}
      <section className="relative py-32 md:py-44 px-8 md:px-16 lg:px-20 overflow-hidden" style={{ background: C.dark, color: C.cream }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: patterns.stripes(C.lime) }} />
        <div className="absolute top-[20%] right-[10%] w-40 h-40 rounded-full pointer-events-none" style={{ background: C.coral, opacity: 0.15 }} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl uppercase tracking-tight leading-[0.85]" style={{ fontFamily: F.display }}>
            Let's<br /><span style={{ color: C.coral }}>make</span><br /><span style={{ color: C.lime }}>noise.</span>
          </motion.h2>
          <motion.a variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ delay: 0.2 }}
            href="mailto:hello@studioobrien.com" className="inline-block mt-10 px-10 py-5 text-base font-bold uppercase tracking-wider rounded-full transition-transform duration-300 hover:scale-105"
            style={{ background: C.coral, color: C.cream }}>Contact Us →</motion.a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-8 md:px-16" style={{ background: C.indigo, color: C.cream }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg uppercase tracking-tight" style={{ fontFamily: F.display }}>Studio O'Brien</span>
          <div className="flex gap-8 text-xs uppercase tracking-wider opacity-60">
            {["Services","Process","Pricing"].map((l) => (<a key={l} href={`#${l.toLowerCase()}`} className="hover:opacity-100 transition-opacity">{l}</a>))}
          </div>
          <span className="text-xs opacity-40">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
