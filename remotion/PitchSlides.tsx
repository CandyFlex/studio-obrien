import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";

// ─── Design System ───
const G = "#34d399";   // accent green
const R = "#ef4444";   // danger red
const B = "#3b82f6";   // info blue
const A = "#f59e0b";   // amber/warn
const F = "'Outfit', sans-serif";
const FM = "'JetBrains Mono', monospace";
const BG = "#09090b";  // zinc-950
const TX = "#fafafa";  // primary text
const TX2 = "rgba(250,250,250,0.5)";  // secondary text
const TX3 = "rgba(250,250,250,0.28)"; // tertiary text

const img = (n: string) => staticFile(`/mock-sites/assets/carolina-arcade/${n}`);
const Logo: React.FC<{ h?: number }> = ({ h = 44 }) => (
  <Img src={staticFile("/images/logo-obsidian.webp")} style={{ height: h, objectFit: "contain" }} />
);

// ─── Shared: Photo bleed on right side ───
const PhotoBleed: React.FC<{ src: string; opacity?: number }> = ({ src, opacity = 0.22 }) => (
  <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "45%", overflow: "hidden" }}>
    <Img src={img(src)} style={{ width: "100%", height: "100%", objectFit: "cover", opacity }} />
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${BG} 0%, ${BG}cc 25%, transparent 100%)` }} />
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG}88 0%, transparent 25%, transparent 75%, ${BG}88 100%)` }} />
  </div>
);

// ─── Shared: Top nav bar ───
const Nav: React.FC = () => (
  <div style={{ padding: "44px 72px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <Logo />
    <p style={{ fontFamily: FM, fontSize: 14, color: TX3, letterSpacing: 2 }}>studioobrien.com</p>
  </div>
);

// ─── Shared: Citation bar ───
const Citation: React.FC<{ text?: string }> = ({ text }) => (
  <div style={{ padding: "18px 72px 28px", borderTop: `1px solid rgba(250,250,250,0.04)` }}>
    <p style={{ fontFamily: FM, fontSize: 11, color: "rgba(250,250,250,0.14)", letterSpacing: 0.5 }}>
      {text || "Sources: Google/Ipsos Consumer Search Behavior Study · BrightLocal Consumer Review Survey 2024 · Safari Digital Local SEO Statistics"}
    </p>
  </div>
);

// ─── Shared: Accent bar ───
const AccentBar: React.FC<{ color?: string }> = ({ color = G }) => (
  <div style={{ width: 40, height: 3, background: color, borderRadius: 2, marginBottom: 24 }} />
);

// ─── Shared: GBP Panel ───
const GBP: React.FC<{ w?: number }> = ({ w = 540 }) => (
  <div style={{ width: w, background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(250,250,250,0.06)`, fontFamily: F }}>
    <div style={{ display: "flex", height: w * 0.23, gap: 2 }}>
      <div style={{ flex: 2.2, overflow: "hidden" }}><Img src={img("hero-interior-wide.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
      <div style={{ flex: 1, overflow: "hidden" }}><Img src={img("pinball-row.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
      <div style={{ flex: 1, overflow: "hidden" }}><Img src={img("blacklight-basement.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
    </div>
    <div style={{ padding: `${w * 0.038}px ${w * 0.045}px ${w * 0.045}px` }}>
      <p style={{ fontSize: w * 0.042, fontWeight: 700, color: "#1a1a1a", marginBottom: w * 0.01 }}>Carolina Arcade Museum</p>
      <div style={{ display: "flex", alignItems: "center", gap: w * 0.012, marginBottom: w * 0.014 }}>
        <span style={{ fontSize: w * 0.03, color: "#1a1a1a", fontWeight: 600 }}>4.9</span>
        <span style={{ fontSize: w * 0.03, color: "#f4b400" }}>★★★★★</span>
        <span style={{ fontSize: w * 0.026, color: "#70757a" }}>(40+)</span>
      </div>
      <p style={{ fontSize: w * 0.024, color: "#70757a", marginBottom: w * 0.024 }}>145 East Main St, Forest City, NC · (828) 229-3089</p>
      <div style={{ display: "flex", gap: w * 0.016 }}>
        <div style={{ flex: 1, background: "#1a73e8", borderRadius: w * 0.046, padding: `${w * 0.02}px 0`, textAlign: "center" }}>
          <span style={{ fontSize: w * 0.026, color: "#fff", fontWeight: 600 }}>Directions</span>
        </div>
        <div style={{ flex: 1, borderRadius: w * 0.046, padding: `${w * 0.02}px 0`, textAlign: "center", background: `${G}15`, border: `3px solid ${G}`, position: "relative" }}>
          <span style={{ fontSize: w * 0.026, color: "#15803d", fontWeight: 700 }}>Website</span>
          <div style={{ position: "absolute", top: -10, right: -6, background: R, borderRadius: 8, padding: "2px 8px", boxShadow: `0 2px 8px ${R}50` }}>
            <span style={{ fontSize: 11, color: "#fff", fontWeight: 800, letterSpacing: 1 }}>KEY</span>
          </div>
        </div>
        <div style={{ flex: 1, background: "#f1f3f4", borderRadius: w * 0.046, padding: `${w * 0.02}px 0`, textAlign: "center" }}>
          <span style={{ fontSize: w * 0.026, color: "#1a73e8", fontWeight: 600 }}>Call</span>
        </div>
      </div>
    </div>
  </div>
);

// ════════════════════════════════════════════════════
// V1: "Someone just Googled you."
// ════════════════════════════════════════════════════
export const PitchV1: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <PhotoBleed src="overhead-floor.webp" />
    <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column" }}>
      <Nav />
      <div style={{ flex: 1, display: "flex", padding: "0 72px", gap: 48 }}>

        {/* LEFT */}
        <div style={{ flex: 1.3, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <AccentBar />

          <h1 style={{ fontFamily: F, fontSize: 78, fontWeight: 800, color: TX, lineHeight: 1.02, letterSpacing: -3 }}>Someone just Googled you.</h1>
          <h1 style={{ fontFamily: F, fontSize: 78, fontWeight: 800, color: G, lineHeight: 1.02, letterSpacing: -3, marginTop: 2 }}>Now what?</h1>

          <p style={{ fontFamily: F, fontSize: 26, fontWeight: 400, color: "rgba(250,250,250,0.55)", lineHeight: 1.5, marginTop: 22, maxWidth: 560 }}>
            Without a site, that button is dead. They see your name and pick a competitor.
          </p>

          {/* Stats strip */}
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 32, paddingTop: 28, borderTop: `1px solid rgba(250,250,250,0.07)` }}>
            {[
              { num: "46%", label: "of searches are local" },
              { num: "88%", label: "visit within 24 hours" },
              { num: "70%", label: "decide online first" },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                {i > 0 && <div style={{ width: 1, height: 76, background: "rgba(250,250,250,0.07)", flexShrink: 0 }} />}
                <div style={{ flex: 1, paddingLeft: i > 0 ? 32 : 0, paddingRight: 20 }}>
                  <p style={{ fontFamily: FM, fontSize: 52, fontWeight: 700, color: G, lineHeight: 1, letterSpacing: -2 }}>{s.num}</p>
                  <p style={{ fontFamily: F, fontSize: 20, fontWeight: 500, color: "rgba(250,250,250,0.4)", marginTop: 10 }}>{s.label}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ width: 560, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <GBP w={560} />

          <div style={{ marginTop: 24 }}>
            {[
              { text: "Your digital front door", c: G },
              { text: "No site means buried in local search", c: R },
              { text: "A linked site puts you in the top 3", c: B },
            ].map((s, i) => (
              <div key={s.text} style={{ padding: "18px 0 18px 22px", borderLeft: `3px solid ${s.c}65`, borderBottom: i < 2 ? `1px solid rgba(250,250,250,0.05)` : "none" }}>
                <p style={{ fontFamily: F, fontSize: 24, fontWeight: 600, color: "rgba(250,250,250,0.7)" }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Citation />
    </div>
  </AbsoluteFill>
);

// ════════════════════════════════════════════════════
// V2: "From search to your front door."
// ════════════════════════════════════════════════════
export const PitchV2: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <PhotoBleed src="wide-interior.jpg" opacity={0.18} />
    <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column" }}>
      <Nav />
      <div style={{ flex: 1, padding: "0 72px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <AccentBar />
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: F, fontSize: 64, fontWeight: 800, color: TX, lineHeight: 1.04, letterSpacing: -2.5 }}>
            From search to <span style={{ color: G }}>your front door.</span>
          </h1>
          <p style={{ fontFamily: F, fontSize: 22, fontWeight: 400, color: TX2, marginTop: 14, maxWidth: 600 }}>
            97% of people research a local business online before they walk in. This is what that journey looks like.
          </p>
        </div>

        <div style={{ display: "flex", gap: 20 }}>
          {[
            { n: "01", title: "They Search", desc: '"arcades near me"\n"things to do forest city"', c: B },
            { n: "02", title: "They Find You", desc: "Google shows your name,\nrating, hours, address", c: A },
            { n: "03", title: "They Click Website", desc: "They want photos, pricing,\nand a reason to visit", c: G, warn: true },
            { n: "04", title: "They Show Up", desc: "Confident, already sold.\nWallet out, ready to go.", c: "#a855f7" },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div style={{ flex: 1, borderLeft: `3px solid ${s.c}50`, padding: "28px 28px 28px 24px", background: `${s.c}05`, borderRadius: "0 14px 14px 0", display: "flex", flexDirection: "column" }}>
                <p style={{ fontFamily: FM, fontSize: 16, fontWeight: 700, color: s.c, letterSpacing: 1, marginBottom: 8 }}>{s.n}</p>
                <p style={{ fontFamily: F, fontSize: 30, fontWeight: 700, color: TX, lineHeight: 1.15, marginBottom: 12 }}>{s.title}</p>
                <p style={{ fontFamily: F, fontSize: 18, fontWeight: 400, color: TX2, lineHeight: 1.5, whiteSpace: "pre-line" }}>{s.desc}</p>
                {s.warn && (
                  <div style={{ marginTop: "auto", paddingTop: 16 }}>
                    <div style={{ borderLeft: `3px solid ${R}50`, padding: "12px 16px", background: `${R}08`, borderRadius: "0 10px 10px 0" }}>
                      <p style={{ fontFamily: F, fontSize: 18, color: R, fontWeight: 700 }}>No website? Journey ends here.</p>
                      <p style={{ fontFamily: F, fontSize: 16, color: TX3, marginTop: 4 }}>They go back and pick a competitor.</p>
                    </div>
                  </div>
                )}
              </div>
              {i < 3 && <div style={{ display: "flex", alignItems: "center" }}><span style={{ fontSize: 24, color: "rgba(250,250,250,0.08)" }}>&#8594;</span></div>}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: "flex", gap: 56, marginTop: 32, paddingTop: 24, borderTop: `1px solid rgba(250,250,250,0.04)` }}>
          {[
            { n: "97%", t: "research businesses online first" },
            { n: "75%", t: "judge credibility by website" },
            { n: "56%", t: "won't trust without one" },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontFamily: FM, fontSize: 30, fontWeight: 700, color: G }}>{s.n}</span>
              <span style={{ fontFamily: F, fontSize: 17, color: TX3 }}>{s.t}</span>
            </div>
          ))}
        </div>
      </div>
      <Citation />
    </div>
  </AbsoluteFill>
);

// ════════════════════════════════════════════════════
// V3: "Same business. Different impression."
// Full-bleed split — no shared photo bleed
// ════════════════════════════════════════════════════
export const PitchV3: React.FC = () => (
  <AbsoluteFill style={{ display: "flex" }}>
    {/* LEFT — Without */}
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <Img src={img("exterior-front.webp")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, rgba(20,4,4,0.94), rgba(9,9,11,0.92))" }} />
      <div style={{ position: "relative", padding: "72px 56px", display: "flex", flexDirection: "column", height: "100%", zIndex: 2 }}>
        <AccentBar color={R} />
        <p style={{ fontFamily: FM, fontSize: 14, fontWeight: 700, color: R, letterSpacing: 2, marginBottom: 20 }}>WITHOUT A WEBSITE</p>
        <h2 style={{ fontFamily: F, fontSize: 52, fontWeight: 800, color: TX, lineHeight: 1.06, letterSpacing: -2, marginBottom: 36 }}>
          What customers<br />see right now.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            "No pricing info available",
            "Can't see what it looks like inside",
            "No way to learn what you offer",
            "No photos, no menu, no vibe",
            "Customer picks a competitor",
          ].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${R}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: FM, fontSize: 14, color: R, fontWeight: 800 }}>x</span>
              </div>
              <span style={{ fontFamily: F, fontSize: 23, fontWeight: 500, color: "rgba(250,250,250,0.55)" }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto" }}>
          <p style={{ fontFamily: FM, fontSize: 64, fontWeight: 700, color: R, lineHeight: 1 }}>56%</p>
          <p style={{ fontFamily: F, fontSize: 20, color: TX3, marginTop: 8 }}>won't trust a business without a website</p>
        </div>
      </div>
    </div>

    <div style={{ width: 2, background: `linear-gradient(180deg, transparent 8%, ${G}35 50%, transparent 92%)` }} />

    {/* RIGHT — With */}
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      <Img src={img("hero-interior-wide.webp")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, rgba(4,16,8,0.94), rgba(9,9,11,0.92))" }} />
      <div style={{ position: "relative", padding: "72px 56px", display: "flex", flexDirection: "column", height: "100%", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <AccentBar color={G} />
            <p style={{ fontFamily: FM, fontSize: 14, fontWeight: 700, color: G, letterSpacing: 2 }}>WITH A CUSTOM WEBSITE</p>
          </div>
          <Logo h={36} />
        </div>
        <h2 style={{ fontFamily: F, fontSize: 52, fontWeight: 800, color: TX, lineHeight: 1.06, letterSpacing: -2, marginTop: 20, marginBottom: 36 }}>
          What they<br /><span style={{ color: G }}>could see.</span>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            "Full pricing before they arrive",
            "Professional photos build instant trust",
            "Reviews, events, and parties showcased",
            "Hours, directions, booking in one place",
            "Customer arrives already convinced",
          ].map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: `${G}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: FM, fontSize: 14, color: G, fontWeight: 800 }}>+</span>
              </div>
              <span style={{ fontFamily: F, fontSize: 23, fontWeight: 500, color: "rgba(250,250,250,0.7)" }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto" }}>
          <p style={{ fontFamily: FM, fontSize: 14, color: G, letterSpacing: 2 }}>studioobrien.com</p>
        </div>
      </div>
    </div>
  </AbsoluteFill>
);

// ════════════════════════════════════════════════════
// V4: "Every day without one is money walking away."
// ════════════════════════════════════════════════════
export const PitchV4: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <PhotoBleed src="blacklight-wide.webp" opacity={0.16} />
    <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column" }}>
      <Nav />
      <div style={{ flex: 1, display: "flex", padding: "0 72px", gap: 56 }}>
        <div style={{ flex: 1.3, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <AccentBar color={R} />
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontFamily: F, fontSize: 64, fontWeight: 800, color: TX, lineHeight: 1.06, letterSpacing: -2.5 }}>Every day without one</h1>
            <h1 style={{ fontFamily: F, fontSize: 64, fontWeight: 800, color: R, lineHeight: 1.06, letterSpacing: -2.5, marginTop: 4 }}>is money walking away.</h1>
          </div>
          <p style={{ fontFamily: F, fontSize: 22, fontWeight: 400, color: TX2, lineHeight: 1.55, maxWidth: 520, marginBottom: 36 }}>
            Your competitors have websites. Every customer who can't find yours online is revenue you'll never see.
          </p>

          {/* 2x2 stat layout with left borders, no boxes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
            {[
              { num: "36%", label: "Invisible", sub: "Less likely to appear in local results", c: R },
              { num: "56%", label: "No Trust", sub: "Won't engage without a website", c: A },
              { num: "$3,380", label: "Revenue Lost", sub: "Conservative estimate per year", c: R },
              { num: "78%", label: "Mobile Converts", sub: "Local mobile searches lead to purchase", c: B },
            ].map((s, i) => (
              <div key={s.num} style={{ padding: "20px 0 20px 20px", borderLeft: `3px solid ${s.c}50`, borderBottom: i < 2 ? `1px solid rgba(250,250,250,0.04)` : "none" }}>
                <p style={{ fontFamily: FM, fontSize: 40, fontWeight: 700, color: s.c, lineHeight: 1, letterSpacing: -1 }}>{s.num}</p>
                <p style={{ fontFamily: F, fontSize: 20, fontWeight: 700, color: "rgba(250,250,250,0.6)", marginTop: 8 }}>{s.label}</p>
                <p style={{ fontFamily: F, fontSize: 16, color: TX3, marginTop: 4 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ width: 540, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <GBP />
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <p style={{ fontFamily: F, fontSize: 22, color: TX2 }}>This is what they see right now.</p>
            <p style={{ fontFamily: F, fontSize: 26, color: G, fontWeight: 700, marginTop: 8 }}>Give them somewhere to go.</p>
          </div>
        </div>
      </div>
      <Citation text="Sources: Google/Ipsos Consumer Search Behavior · BrightLocal 2024 · Safari Digital · Based on $13 admission, 5 lost visitors/week" />
    </div>
  </AbsoluteFill>
);

export const PitchV5 = PitchV4;
