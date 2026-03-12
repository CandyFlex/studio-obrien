import { useState, useEffect, useRef } from "react";
import {
  Search,
  BarChart3,
  ArrowRight,
  Check,
  ChevronDown,
  Menu,
  X,
  Star,
} from "lucide-react";

/* ═══════════════════════════════════════════ *
 *    THEME: OBSIDIAN                         *
 * ═══════════════════════════════════════════ */
const t = {
  accent: "#34d399",
  baseBg: "#131318",
  logoSrc: "/images/logo-obsidian.png",
  logoFilter: "none",
  motifFilter: "invert(1) sepia(1) saturate(3) hue-rotate(100deg) brightness(0.8)",
  hero: { bg: "linear-gradient(180deg, #131318 0%, #1a1a24 40%, #131318 100%)", text: "#f5f5f7", headingFont: "'DM Sans', sans-serif", labelFont: "'DM Sans', sans-serif" },
  problem: { bg: "#18181f", text: "#f5f5f7" },
  services: { bg: "#111116", cardBg: "#1a1a24", cardBorder: "#34d39910", text: "#f5f5f7" },
  portfolio: { bg: "#0d0d12", cardBg: "#16161e", text: "#e0e0e4" },
  process: { bg: "#141420", text: "#f5f5f7" },
  about: { bg: "#1a1a28", text: "#f5f5f7" },
  faq: { bg: "#111118", text: "#f5f5f7" },
  contact: { bg: "#131318", text: "#f5f5f7" },
  footer: { bg: "#0e0e12", text: "#f5f5f7" },
  nav: { solid: "#131318f0", mobileBg: "#131318f8" },
};

/* ─── CONTENT ─── */

const portfolio = [
  { name: "Carolina Arcade Museum", url: "/for/carolina-arcade.html", img: "/images/portfolio/carolina-arcade.png", tag: "Entertainment" },
  { name: "Wahoo's Sports Bar", url: "/for/wahoos-sports.html", img: "/images/portfolio/wahoos-sports.png", tag: "Restaurant" },
  { name: "Hoot Nannie", url: "/for/hoot-nannie.html", img: "/images/portfolio/hoot-nannie.png", tag: "Boutique" },
];

const faqs = [
  { q: "How much does a website cost?", a: "It depends on the scope of the project. We offer three tiers designed for different business needs, from single-page sites to full multi-page builds with ongoing support. We give you a clear quote after our first call.", link: "/pricing/", linkText: "See pricing tiers" },
  { q: "How long does it take to build a website?", a: "Most projects launch in two to three weeks. We handle the copy, design, and development so the timeline stays tight. Your only action items are one call, one form, and one review." },
  { q: "Do you write the content for my website?", a: "Yes. We research your market, study your competitors, and write every word on the site. You review it and tell us what to adjust. Most clients change very little." },
  { q: "Will my website show up on Google?", a: "Every site is built with search-ready fundamentals: clean code, fast load times, proper meta tags, and mobile-first design. For businesses that want a full local SEO strategy or Google Business Profile setup, we offer that as part of our higher-tier packages." },
  { q: "Do I own my website when it's done?", a: "Completely. You own the code, the design, the copy, and every file. There's no monthly lock-in and no proprietary platform. If you ever want to move it, you can." },
  { q: "What if I already have a website?", a: "We can audit your current site and show you exactly what's holding it back. Sometimes a few fixes are enough. Sometimes a full rebuild is the faster path. We'll be honest about which one makes sense." },
  { q: "Can you help with my Google Business Profile?", a: "Yes. Google Business Profile setup and optimization is available as part of our Professional and Growth tiers. We connect it to your website so your profile and your site work together when people search for your business." },
  { q: "Do you work with businesses outside Cleveland County?", a: "Yes. Most of our work is done remotely. We serve clients across North Carolina and can work with businesses anywhere. The process is the same whether you're in Shelby or out of state." },
];

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const yr = new Date().getFullYear();

const heroShowcaseImages = [
  "/images/portfolio/carolina-arcade.webp",
  "/images/portfolio/hoot-nannie.webp",
  "/images/portfolio/wahoos-sports.webp",
  "/images/portfolio/morningside-coffee.webp",
  "/images/portfolio/iron-peak.webp",
];

const compData = {
  heading: "Where your investment actually goes.",
  left: [
    "A base price that grows with every content request, revision round, and scope clarification",
    "SEO pitched as a separate monthly retainer, billed on top of the original project cost",
    "The site runs on their proprietary platform. Hosting fees are mandatory and you can't take your files elsewhere.",
    "Copywriting, photography direction, and brand work all treated as billable extras",
    "You pay to build it, then pay again every month just to keep it online",
    "A template layout dressed up with your colors. The same structure as dozens of their other clients.",
  ],
  right: [
    "The price covers everything. Design, code, copy, and launch. No line-item surprises.",
    "One person builds your entire site. No handoffs between departments, no game of telephone with your feedback.",
    "You get a recorded walkthrough of the finished site. Watch it on your time, send back notes. No meetings required.",
    "Every word on your site is written after researching your market, your competitors, and your customers.",
    "You own all of it. The code, the files, the design. Move hosting, switch providers, do whatever you want with it.",
    "Ongoing support is available if your business needs it, but the site works and stands on its own without it.",
  ],
};

const youWe = [
  { you: "Tell us about your business", we: "Research your market and competitors" },
  { you: "Fill out a short form", we: "Write every word on your site" },
  { you: "Share your logo and photos", we: "Design and build a custom site from scratch" },
  { you: "Review a video walkthrough", we: "Revise everything you flag" },
  { you: "Approve the final site", we: "Handle domain, hosting, and launch" },
];

/* ─── LUMINANCE-BASED DARK CHECK ─── */
function isDark(bg: string): boolean {
  if (bg.includes("linear") || bg.includes("radial")) return true;
  const m = bg.match(/#([0-9a-f]{6})/i);
  if (!m) return true;
  const [r, g, b] = [0, 2, 4].map(i => parseInt(m[1].slice(i, i + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) < 140;
}

/* ─── REDUCED MOTION CHECK ─── */
const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── FADE-IN ─── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(prefersReducedMotion);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={prefersReducedMotion ? {} : { opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── FAQ ─── */
function FaqItem({ q, a, dark, accent, link, linkText }: { q: string; a: string; dark: boolean; accent: string; link?: string; linkText?: string }) {
  const [open, setOpen] = useState(false);
  const textColor = dark ? "#ffffffee" : "#111111ee";
  const subColor = dark ? "#ffffffcc" : "#111111cc";
  return (
    <div style={{ borderBottom: `1px solid ${accent}18` }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left cursor-pointer" aria-expanded={open}>
        <span className="text-base md:text-lg font-medium pr-4 text-pretty" style={{ color: textColor }}>{q}</span>
        <ChevronDown size={20} style={{ color: accent, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }} />
      </button>
      <div className="grid" style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0, transition: "grid-template-rows 0.3s ease-out, opacity 0.2s ease-out" }}>
        <div className="overflow-hidden">
          <p className="pb-2 text-sm md:text-base leading-relaxed text-pretty" style={{ color: subColor }}>{a}</p>
          {link && <a href={link} className="inline-flex items-center gap-1.5 text-sm font-medium pb-5 hover:underline" style={{ color: accent }}>{linkText || "Learn more"} <ArrowRight size={14} /></a>}
          {!link && <div className="pb-3" />}
        </div>
      </div>
    </div>
  );
}

/* ─── BROWSER MOCKUP ─── */
type DropVariant = "soft" | "snap" | "bounce" | "drift" | "punch";

function getImageStyle(variant: DropVariant, isActive: boolean): React.CSSProperties {
  const base: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", backfaceVisibility: "hidden" };

  switch (variant) {
    case "soft":
      return { ...base, opacity: isActive ? 1 : 0, transform: isActive ? "translateY(0) scale(1)" : "translateY(-12px) scale(0.98)", transition: "opacity 0.5s ease, transform 0.6s ease" };
    case "snap":
      return { ...base, opacity: isActive ? 1 : 0, transform: isActive ? "translateY(0) scale(1)" : "translateY(-20px) scale(0.96)", transition: "opacity 0.25s ease-out, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" };
    case "bounce":
      return { ...base, opacity: isActive ? 1 : 0, transform: isActive ? "translateY(0) scale(1)" : "translateY(-18px) scale(0.97)", transition: "opacity 0.35s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" };
    case "drift":
      return { ...base, opacity: isActive ? 1 : 0, transform: isActive ? "translateY(0) translateX(0)" : "translateY(-10px) translateX(8px)", transition: "opacity 0.6s ease, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)" };
    case "punch":
      return { ...base, opacity: isActive ? 1 : 0, transform: isActive ? "translateY(0) scale(1)" : "translateY(-25px) scale(0.92)", transition: "opacity 0.2s ease-out, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)" };
  }
}

function BrowserMockup({ img, accent, className = "", showLive = false, carousel = false, dropVariant = "soft" as DropVariant }: { img: string; accent: string; className?: string; showLive?: boolean; carousel?: boolean; dropVariant?: DropVariant }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!carousel) return;
    const timer = setInterval(() => setActive((p) => (p + 1) % heroShowcaseImages.length), 4000);
    return () => clearInterval(timer);
  }, [carousel]);

  return (
    <div className={`rounded-lg overflow-hidden shadow-2xl ${className}`} style={{ background: "#1a1a2e", border: `1px solid ${accent}18` }}>
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: "#0f0f1a" }}>
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="size-3 rounded-full" style={{ background: "#ffbd2e" }} />
          <div className="size-3 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <div className="flex-1 mx-3 px-3 py-1 rounded text-xs text-center" style={{ background: "#1a1a2e", color: "#666" }}>studioobrien.com</div>
        {showLive && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase" style={{ color: accent, background: `${accent}10`, border: `1px solid ${accent}18` }}>
            <div className="size-1.5 rounded-full" style={{ background: accent }} />
            Live
          </div>
        )}
      </div>
      {carousel ? (
        <div className="relative">
          <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
            {heroShowcaseImages.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`Website preview ${i + 1}`}
                style={getImageStyle(dropVariant, active === i)}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {heroShowcaseImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="size-2.5 rounded-full transition-all cursor-pointer"
                style={{
                  background: active === i ? accent : "#ffffff40",
                  boxShadow: active === i ? `0 0 8px ${accent}60` : "none",
                  transform: active === i ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`Preview ${i + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <img src={img} alt="Website preview" className="w-full block" loading="lazy" />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════ *
 *              MAIN APP                       *
 * ═══════════════════════════════════════════ */
export default function App() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", business: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="min-h-dvh" style={{ background: t.baseBg, fontFamily: "'DM Sans', sans-serif" }}>
      <h1 className="sr-only">Studio O'Brien — Web Design, Development & Strategy in Shelby, NC</h1>

      {/* ═══════ NAV ═══════ */}
      <nav
        className="fixed top-2 left-0 right-0 z-40 transition-all duration-200 pt-[env(safe-area-inset-top)]"
        style={{ background: scrolled ? t.nav.solid : "transparent", borderBottom: scrolled ? `1px solid ${t.accent}12` : "1px solid transparent" }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14 md:h-16">
          <a href="#" className="flex items-center">
            <img src={t.logoSrc} alt="Studio O'Brien" className="h-10 md:h-13 w-auto" fetchPriority="high" style={{ filter: t.logoFilter }} />
          </a>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => <a key={l.label} href={l.href} className="text-sm tracking-wide hover:opacity-100 transition-opacity" style={{ color: `${t.hero.text}cc`, opacity: 0.9 }}>{l.label}</a>)}
            <a href="#contact" className="px-5 py-2.5 text-sm font-semibold rounded-sm transition-all hover:scale-105" style={{ background: t.accent, color: t.baseBg }}>Get a Quote</a>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">
            {mobileMenu ? <X size={24} color={t.hero.text} /> : <Menu size={24} color={t.hero.text} />}
          </button>
        </div>
        {mobileMenu && (
          <div className="md:hidden px-6 pb-6" style={{ background: t.nav.mobileBg }}>
            {navLinks.map((l) => <a key={l.label} href={l.href} onClick={() => setMobileMenu(false)} className="block py-3 text-base" style={{ color: t.hero.text, borderBottom: `1px solid ${t.accent}12` }}>{l.label}</a>)}
            <a href="#contact" onClick={() => setMobileMenu(false)} className="block mt-4 px-5 py-3 text-center text-sm font-semibold rounded-sm" style={{ background: t.accent, color: t.baseBg }}>Get a Quote</a>
          </div>
        )}
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ background: t.hero.bg, minHeight: "100dvh", display: "flex", alignItems: "center" }}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${t.accent} 1px, transparent 1px), linear-gradient(90deg, ${t.accent} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 left-0 right-0 h-48" style={{ background: `linear-gradient(${t.accent}0a, transparent)` }} />
        <div className="relative max-w-6xl mx-auto px-6 w-full pt-10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <FadeIn>
                <div className="mb-3 w-8 h-1 rounded-full" style={{ background: t.accent }} />
                <p className="text-sm md:text-base tracking-[0.15em] uppercase mb-3 font-medium" style={{ color: t.accent, fontFamily: t.hero.labelFont }}>
                  Web Design Studio · Shelby, NC
                </p>
              </FadeIn>
              <FadeIn delay={0.08}>
                <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.05] mb-4 text-balance" style={{ color: t.hero.text, fontFamily: t.hero.headingFont }}>
                  Your website should bring you customers.
                </h2>
              </FadeIn>
              <FadeIn delay={0.15}>
                <p className="text-lg md:text-xl leading-relaxed mb-7 text-pretty" style={{ color: `${t.hero.text}dd` }}>
                  Custom websites for local businesses in Shelby and Cleveland County. Designed to bring in customers and built to rank on Google.
                </p>
              </FadeIn>
              <FadeIn delay={0.22}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#contact" className="px-8 py-4 text-base font-semibold rounded-sm transition-all hover:scale-105 inline-flex items-center gap-2" style={{ background: t.accent, color: t.baseBg }}>
                    Get a Quote <ArrowRight size={18} />
                  </a>
                  <a href="#work" className="px-8 py-4 text-base rounded-sm transition-all hover:scale-105 text-center" style={{ color: t.hero.text, border: `1.5px solid ${t.accent}40` }}>
                    See Our Work
                  </a>
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.2} className="hidden lg:block">
              <BrowserMockup img="/images/portfolio/carolina-arcade.webp" accent={t.accent} carousel dropVariant="punch" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ PROOF BAR ═══════ */}
      <section className="py-10 md:py-12 px-6" style={{ background: `linear-gradient(135deg, ${t.baseBg}, ${t.accent}12)`, borderTop: `1px solid ${t.accent}18`, borderBottom: `1px solid ${t.accent}18` }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Search, num: "Search Ready", label: "Built for Google", sub: "Clean code, fast load times, meta tags, and mobile-first structure. Every site ships search-ready." },
            { icon: BarChart3, num: "90+", label: "Google Lighthouse Score", sub: "Google's own speed test. Every site we build passes it. Visitors stay, rankings climb." },
            { icon: Star, num: "Shelby, NC", label: "Cleveland County", sub: "Not a Charlotte agency. A local builder who knows your market." },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center py-5 px-3 rounded-lg" style={{ background: `${t.accent}08`, border: `1px solid ${t.accent}15` }}>
              <item.icon size={24} color={t.accent} />
              <span className="text-2xl md:text-3xl font-bold mt-2" style={{ color: t.accent }}>{item.num}</span>
              <span className="text-xs uppercase tracking-[0.2em] mt-1 font-medium" style={{ color: `${t.hero.text}88` }}>{item.label}</span>
              <span className="text-xs mt-2 leading-snug max-w-[220px]" style={{ color: `${t.hero.text}66` }}>{item.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ PROBLEM / FIX ═══════ */}
      <section className="py-16 md:py-24 px-6" style={{ background: t.problem.bg }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.2em] mb-4 font-semibold" style={{ color: "#ef4444" }}>The problem</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-5 text-balance" style={{ color: t.problem.text }}>
              <a href="/research/cleveland-county-digital-landscape.html#no-website" className="hover:underline" style={{ color: "inherit", textDecoration: "none" }}>28% of local businesses have no website.</a> The rest aren't much better off.
            </h2>
            <p className="text-base leading-relaxed text-pretty" style={{ color: `${t.problem.text}bb` }}>
              Slow load times. No mobile optimization. Invisible on Google. Most small business sites in Cleveland County were set up once and forgotten. <a href="/research/cleveland-county-digital-landscape.html#mobile-experience" className="underline decoration-1 underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: t.accent }}>60% of consumers won't even recommend a business with a bad mobile experience.</a>
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-xs uppercase tracking-[0.2em] mb-4 font-semibold" style={{ color: t.accent }}>The fix</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-5 text-balance" style={{ color: t.problem.text }}>
              A website that shows up where your customers are looking.
            </h2>
            <p className="text-base leading-relaxed text-pretty" style={{ color: `${t.problem.text}bb` }}>
              <a href="/research/cleveland-county-digital-landscape.html#tourism-economy" className="underline decoration-1 underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: t.accent }}>$149 million flows through Cleveland County tourism every year.</a> A fast, professional, Google-connected website puts your business in front of that traffic. Custom-built in Shelby, NC for the way people actually search.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ SERVICES: COMPARISON ═══════ */}
      <section id="services" className="py-20 md:py-28 px-6 relative" style={{ background: t.services.bg }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 30% 20%, ${t.accent}04 0%, transparent 60%)` }} />
        <div className="max-w-5xl mx-auto relative">
          <FadeIn>
            <p className="text-sm tracking-[0.15em] uppercase text-center mb-3 font-medium" style={{ color: t.accent }}>Why Us</p>
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-14 text-balance" style={{ color: t.services.text }}>{compData.heading}</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FadeIn>
              <div className="p-6 rounded-lg h-full" style={{ background: `${t.services.cardBg}`, border: `1px solid #ef444420` }}>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-6" style={{ color: "#ef4444" }}>Most Agencies</p>
                <div className="space-y-4">
                  {compData.left.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <X size={14} color="#ef4444" className="shrink-0 mt-1" />
                      <p className="text-sm" style={{ color: `${t.services.text}77` }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="p-6 rounded-lg h-full" style={{ background: `${t.accent}08`, border: `1px solid ${t.accent}25` }}>
                <p className="text-xs uppercase tracking-[0.2em] font-semibold mb-6" style={{ color: t.accent }}>Studio O'Brien</p>
                <div className="space-y-4">
                  {compData.right.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check size={14} color={t.accent} className="shrink-0 mt-1" />
                      <p className="text-sm" style={{ color: t.services.text }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ PORTFOLIO ═══════ */}
      <section id="work" className="py-20 md:py-28 px-6" style={{ background: t.portfolio.bg }}>
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 mb-14 items-end">
              <div>
                <p className="text-sm tracking-[0.15em] uppercase mb-3 font-medium" style={{ color: t.accent }}>Our Work</p>
                <h2 className="text-2xl md:text-4xl font-bold text-balance" style={{ color: t.portfolio.text }}>
                  This is what we build.
                </h2>
              </div>
              <p className="text-sm leading-relaxed md:text-right" style={{ color: `${t.portfolio.text}77` }}>
                Every site here was built for a real local business. Custom design, real copy, fully functional. Click any one and see for yourself.
              </p>
            </div>
          </FadeIn>
          <div className="space-y-8">
            <FadeIn>
              <a href={portfolio[0].url} className="group block rounded-lg overflow-hidden" style={{ border: `1px solid ${t.accent}12` }}>
                <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr]">
                  <div className="aspect-[16/10] md:aspect-auto overflow-hidden relative">
                    <img src={portfolio[0].img} alt={portfolio[0].name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center" style={{ background: t.portfolio.cardBg }}>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold block mb-3" style={{ color: t.accent }}>{portfolio[0].tag}</span>
                    <h3 className="text-xl md:text-2xl font-bold mb-3" style={{ color: t.portfolio.text }}>{portfolio[0].name}</h3>
                    <span className="text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all" style={{ color: t.accent }}>View Project <ArrowRight size={14} /></span>
                  </div>
                </div>
              </a>
            </FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.slice(1).map((p, i) => (
                <FadeIn key={p.name} delay={(i + 1) * 0.08}>
                  <a href={p.url} className="group block rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]" style={{ border: `1px solid ${t.accent}12`, background: t.portfolio.cardBg }}>
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <span className="text-xs tracking-[0.15em] uppercase font-medium block mb-1" style={{ color: t.accent }}>{p.tag}</span>
                        <h3 className="text-base font-semibold" style={{ color: t.portfolio.text }}>{p.name}</h3>
                      </div>
                      <ArrowRight size={16} color={t.accent} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BRIDGE CTA ═══════ */}
      <section className="relative overflow-hidden" style={{ background: t.baseBg }}>
        <div className="py-14 md:py-20 px-6 relative" style={{ borderTop: `1px solid ${t.accent}12`, borderBottom: `1px solid ${t.accent}12` }}>
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="max-w-lg">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance" style={{ color: t.portfolio.text }}>
                    Like what you see? Let's build yours.
                  </h2>
                  <p className="text-sm" style={{ color: `${t.portfolio.text}77` }}>
                    Your business deserves a site this good. Tell us what you need and we'll put together a quote.
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-start md:items-end gap-3">
                  <a href="#contact" className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold rounded-sm transition-all hover:scale-105" style={{ background: t.accent, color: t.baseBg }}>
                    Get a Quote <ArrowRight size={18} />
                  </a>
                  <span className="text-xs" style={{ color: `${t.portfolio.text}55` }}>No commitment required</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ PROCESS: ARROW BRIDGE ═══════ */}
      <section id="process" className="py-20 md:py-28 px-6" style={{ background: t.process.bg }}>
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-sm tracking-[0.15em] uppercase text-center mb-3 font-medium" style={{ color: t.accent }}>How It Works</p>
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-balance" style={{ color: t.process.text }}>Here's your part. Here's ours.</h2>
            <p className="text-sm text-center mb-14" style={{ color: `${t.process.text}44` }}>Simple handoff. You give us what we need, we handle the rest.</p>
          </FadeIn>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-0 mb-4">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-center py-2" style={{ color: `${t.process.text}44` }}>You</p>
              <div className="w-12" />
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-center py-2" style={{ color: t.accent }}>Us</p>
            </div>
            {youWe.map((row, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="grid grid-cols-[1fr_auto_1fr] gap-0 mb-3">
                  <div className="rounded-l-lg p-4 flex items-center justify-center text-center" style={{ background: `${t.process.text}06`, border: `1px solid ${t.process.text}10`, borderRight: "none" }}>
                    <p className="text-sm" style={{ color: `${t.process.text}88` }}>{row.you}</p>
                  </div>
                  <div className="w-12 flex items-center justify-center relative" style={{ background: `${t.accent}10` }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke={t.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="rounded-r-lg p-4 flex items-center justify-center text-center" style={{ background: `${t.accent}08`, border: `1px solid ${t.accent}15`, borderLeft: "none" }}>
                    <p className="text-sm font-medium" style={{ color: t.process.text }}>{row.we}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="text-center text-sm mt-10" style={{ color: `${t.process.text}44` }}>You focus on your business. We focus on your site.</p>
        </div>
      </section>

      {/* ═══════ ABOUT ═══════ */}
      <section className="py-20 md:py-28 px-6 relative" style={{ background: t.about.bg }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `${t.accent}0a` }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: `repeating-linear-gradient(0deg, ${t.accent} 0px, ${t.accent} 1px, transparent 1px, transparent 4px)` }} />

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16 relative">
            <FadeIn className="flex-1 order-2 md:order-1">
              <div className="pl-6" style={{ borderLeft: `3px solid ${t.accent}30` }}>
                <p className="text-sm tracking-[0.15em] uppercase mb-3 font-medium" style={{ color: t.accent }}>About</p>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-balance" style={{ color: t.about.text }}>
                  Built by someone who gets small business.
                </h2>
                <p className="text-base leading-relaxed mb-4 text-pretty" style={{ color: `${t.about.text}bb` }}>
                  I'm Jarred O'Brien. I've been building websites for over ten years. I started Studio O'Brien to give local businesses a better option: a custom site designed around their customers, written in their voice, and delivered in weeks instead of months. We handle the design, the copy, and the launch so you can stay focused on your business.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: `${t.about.text}77` }}>
                  If your business needs a better website, we should talk.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1} className="shrink-0 order-1 md:order-2">
              <div className="relative">
                <img src="/images/portrait.webp" alt="Jarred O'Brien" className="size-36 md:size-52 rounded-lg object-cover" style={{ border: `2px solid ${t.accent}15` }} loading="lazy" />
                <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded text-[10px] tracking-[0.15em] uppercase font-bold" style={{ background: t.accent, color: t.baseBg }}>Shelby, NC</div>
              </div>
            </FadeIn>
          </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className="py-20 md:py-28 px-6" style={{ background: t.faq.bg }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 md:gap-16">
            <FadeIn>
              <div className="md:sticky md:top-32">
                <p className="text-sm tracking-[0.15em] uppercase mb-3 font-medium" style={{ color: t.accent }}>Questions</p>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 text-balance" style={{ color: t.faq.text }}>
                  Common questions, straight answers.
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: `${t.faq.text}77` }}>
                  Everything you need to know before we get started.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <div>{faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} dark={isDark(t.faq.bg)} accent={t.accent} {...("link" in f ? { link: f.link, linkText: f.linkText } : {})} />)}</div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ CONTACT ═══════ */}
      <section id="contact" className="py-20 md:py-28 px-6" style={{ background: t.contact.bg }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-16 items-start">
            <FadeIn>
              <div className="md:sticky md:top-32">
                <p className="text-sm tracking-[0.15em] uppercase mb-3 font-medium" style={{ color: t.accent }}>Let's Talk</p>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 text-balance" style={{ color: t.contact.text }}>Tell us about your business.</h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: `${t.contact.text}77` }}>Tell us what you're working with and we'll come back with a clear answer within 24 hours.</p>
                <div className="space-y-3">
                  {["Response within 24 hours", "Clear pricing, no surprises", "No commitment required"].map((txt) => (
                    <div key={txt} className="flex items-center gap-2">
                      <Check size={14} color={t.accent} />
                      <span className="text-sm" style={{ color: `${t.contact.text}aa` }}>{txt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              {formSent ? (
                <div className="text-center py-12">
                  <Check size={48} color={t.accent} className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2" style={{ color: t.contact.text }}>Message sent.</h3>
                  <p style={{ color: `${t.contact.text}cc` }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (() => {
                const dark = isDark(t.contact.bg);
                const inputBg = dark ? t.baseBg : "#ffffff";
                const inputBorder = dark ? `${t.accent}15` : `${t.baseBg}15`;
                const inputStyle = { background: inputBg, color: t.contact.text, border: `1px solid ${inputBorder}` };
                const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = `${t.accent}60`; e.currentTarget.style.boxShadow = `0 0 0 2px ${t.accent}15`; };
                const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.boxShadow = "none"; };
                return (
                  <form action="https://formsubmit.co/hello@studioobrien.com" method="POST" onSubmit={(e) => { e.preventDefault(); (e.target as HTMLFormElement).submit(); setFormSent(true); }} className="space-y-5">
                    <input type="hidden" name="_subject" value="New inquiry from studioobrien.com" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value="https://studioobrien.com" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm mb-2 font-medium" style={{ color: t.contact.text }}>Your Name</label>
                        <input id="name" name="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded text-base outline-none transition-all" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm mb-2 font-medium" style={{ color: t.contact.text }}>Email</label>
                        <input id="email" name="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded text-base outline-none transition-all" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="business" className="block text-sm mb-2 font-medium" style={{ color: t.contact.text }}>Business Name</label>
                      <input id="business" name="business" type="text" value={formData.business} onChange={(e) => setFormData({ ...formData, business: e.target.value })} className="w-full px-4 py-3 rounded text-base outline-none transition-all" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm mb-2 font-medium" style={{ color: t.contact.text }}>What do you need?</label>
                      <textarea id="message" name="message" rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-sm text-base outline-none transition-all resize-none" style={inputStyle} placeholder="Tell us about your business and what you're looking for..." />
                    </div>
                    <button type="submit" className="w-full px-8 py-4 text-base font-semibold rounded-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2" style={{ background: t.accent, color: t.baseBg }}>
                      Send Message <ArrowRight size={18} />
                    </button>
                  </form>
                );
              })()}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-14 md:py-20 px-6" style={{ background: t.footer.bg, borderTop: `1px solid ${t.accent}0a` }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <img src={t.logoSrc} alt="Studio O'Brien" className="h-10 w-auto mb-3" loading="lazy" style={{ filter: t.logoFilter }} />
              <p className="text-xs leading-relaxed" style={{ color: `${t.footer.text}66` }}>Custom websites for small businesses across Shelby, NC and Cleveland County.</p>
            </div>
            <div>
              <p className="text-xs tracking-[0.15em] uppercase mb-4 font-medium" style={{ color: t.accent }}>Navigate</p>
              <div className="flex flex-col gap-2.5">
                {navLinks.map((l) => <a key={l.label} href={l.href} className="text-sm hover:opacity-100 transition-opacity" style={{ color: t.footer.text, opacity: 0.7 }}>{l.label}</a>)}
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.15em] uppercase mb-4 font-medium" style={{ color: t.accent }}>Contact</p>
              <a href="mailto:hello@studioobrien.com" className="text-sm block mb-2 hover:opacity-100 transition-opacity" style={{ color: t.footer.text, opacity: 0.7 }}>hello@studioobrien.com</a>
              <p className="text-xs" style={{ color: `${t.footer.text}55` }}>Shelby, North Carolina</p>
            </div>
          </div>
          <div className="pt-6" style={{ borderTop: `1px solid ${t.accent}0a` }}>
            <p className="text-xs" style={{ color: `${t.footer.text}55` }}>&copy; {yr} Studio O'Brien. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
