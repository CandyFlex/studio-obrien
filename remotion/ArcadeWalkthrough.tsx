import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from "remotion";

const img = (name: string) =>
  staticFile(`/mock-sites/assets/carolina-arcade/${name}`);

// ─── Brand tokens ───
const Y = "#f5d623";
const C = "#00d4ff";
const R = "#e8342e";
const M = "#ff2eaa";
const BK = "#09090b";

// ════════════════════════════════════════════════════════
// ACT 1 — BRAND OPEN (0–90, 3 sec)
// ════════════════════════════════════════════════════════
const BrandOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flicker = frame < 8 ? (frame % 3 === 0 ? 0.3 : 0.8) : 1;
  const logoScale = spring({ frame: frame - 5, fps, config: { damping: 8, stiffness: 60 } });
  const glowIntensity = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.4, 1]);
  const taglineOpacity = interpolate(frame, [35, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [70, 85], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BK, justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)", pointerEvents: "none", zIndex: 10 }} />
      <div style={{ position: "absolute", width: 900, height: 450, borderRadius: "50%", background: `radial-gradient(ellipse, ${Y}20, transparent 65%)`, filter: "blur(50px)" }} />
      <div style={{ transform: `scale(${logoScale * 0.9})`, opacity: flicker, filter: `drop-shadow(0 0 ${35 * glowIntensity}px ${Y}a0) drop-shadow(0 0 ${70 * glowIntensity}px ${Y}50) drop-shadow(0 0 ${110 * glowIntensity}px ${Y}20)` }}>
        <Img src={img("logo-wide.webp")} style={{ width: 1300, objectFit: "contain" }} />
      </div>
      <div style={{ position: "absolute", top: "68%", opacity: taglineOpacity }}>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 18, color: C, letterSpacing: 6, textShadow: `0 0 20px ${C}80, 0 0 40px ${C}30` }}>
          FOREST CITY, NC — WEBSITE CONCEPT
        </p>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// ACT 2 — FULL SITE SCROLL (0–420, 14 sec)
// Uses the ACTUAL full-page screenshot of the real site.
// Browser slides in, holds on hero 3s, scrolls to bottom.
// ════════════════════════════════════════════════════════
const SiteScroll: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser frame entrance — gentle slide up
  const browserSpring = spring({ frame, fps, config: { damping: 16, stiffness: 40, mass: 1.2 } });
  const browserY = interpolate(browserSpring, [0, 1], [60, 0]);
  const browserOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Screenshot: 1920 x 7468. Rendered at width=100% in browser content area.
  // Browser content width = 1920 - 100 (padding) = 1820px.
  // Scale = 1820/1920 = 0.9479. Rendered height = 7468 * 0.9479 = 7079px.
  // Viewport = 1080 - 64 (padding) - 34 (bar) = 982px.
  // Max scroll = 7079 - 982 = 6097px.
  const maxScroll = 6097;
  const S = 0.9479; // scale factor for section positions

  // Section tops (Playwright positions × S scale):
  const GAMES = Math.round(1083 * S);    // 1035
  const PRICING = Math.round(2078 * S);  // 1986
  const GALLERY = Math.round(3014 * S);  // 2880
  const BIRTHDAY = Math.round(4100 * S); // 3917
  const STORY = Math.round(4792 * S);    // 4578
  const REVIEWS = Math.round(5528 * S);  // 5282
  const VISIT = Math.round(6244 * S);    // 5966

  // Cascading scroll: variable speed, never fully stops.
  // Slows down at each section (low stiffness = gentle decel),
  // then picks back up. Bigger sections get slower passes,
  // smaller ones flow through quicker. The whole thing
  // feels like one continuous gesture with breathing room.
  //
  // Each spring adds its segment's distance when it fires.
  // Overlapping start times + high damping = smooth cascade
  // instead of stop-start-stop-start.

  const sp = (delay: number, d: number, s: number) =>
    spring({ frame: frame - delay, fps, config: { damping: d, stiffness: s, mass: 1 } });

  // Cascading scroll — each spring adds its section's distance.
  // Variable spacing gives natural rhythm without hard stops.
  // Ends at Visit+footer in one motion, no separate footer jolt.
  const scrollY = -(
    sp(40, 22, 16)  * GAMES +                  // hero → games
    sp(90, 20, 20)  * (PRICING - GAMES) +       // games → pricing
    sp(140, 18, 22) * (GALLERY - PRICING) +     // pricing → gallery (flows through stats)
    sp(195, 20, 18) * (BIRTHDAY - GALLERY) +    // gallery → birthday
    sp(255, 18, 22) * (STORY - BIRTHDAY) +      // birthday → story
    sp(305, 18, 22) * (REVIEWS - STORY) +       // story → reviews
    sp(345, 18, 22) * (VISIT - REVIEWS) +       // reviews → visit (map visible)
    sp(395, 20, 18) * (maxScroll - VISIT)        // visit → footer
  );

  const fadeOut = interpolate(frame, [440, 450], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BK, opacity: fadeOut }}>
      <div style={{
        position: "absolute", top: 32, left: 50, right: 50, bottom: 32,
        borderRadius: 12, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
        transform: `translateY(${browserY}px)`,
        opacity: browserOpacity,
        display: "flex", flexDirection: "column",
      }}>
        {/* Browser chrome bar */}
        <div style={{ height: 34, background: "#1a1a24", display: "flex", alignItems: "center", padding: "0 14px", gap: 7, flexShrink: 0 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
          <div style={{ marginLeft: 12, flex: 1, height: 20, borderRadius: 5, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", paddingLeft: 10, fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
            carolinaarcademuseum.com
          </div>
        </div>

        {/* The actual site — one real screenshot, scrolled via translateY */}
        <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
          <Img
            src={img("fullpage-screenshot.png")}
            style={{
              width: "100%",
              height: "auto",
              transform: `translateY(${scrollY}px)`,
              willChange: "transform",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// ACT 3 — THE PITCH (V1 Approved)
// "Someone just Googled you. Now what?"
// Outfit + JetBrains Mono, asymmetric photo bleed
// ════════════════════════════════════════════════════════
const ThePitch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const F = "'Outfit', sans-serif";
  const FM = "'JetBrains Mono', monospace";
  const G = "#34d399";
  const RD = "#ef4444";
  const BL = "#3b82f6";
  const BG2 = "#09090b";

  // Staggered entrances
  const barSpring = spring({ frame: frame - 5, fps, config: { damping: 14, stiffness: 60 } });
  const headSpring = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 50 } });
  const bodySpring = spring({ frame: frame - 25, fps, config: { damping: 12, stiffness: 60 } });
  const statSpring = spring({ frame: frame - 40, fps, config: { damping: 14, stiffness: 50 } });
  const gbpSpring = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 40 } });
  const calloutSpring = spring({ frame: frame - 50, fps, config: { damping: 12, stiffness: 60 } });
  const fadeOut = interpolate(frame, [165, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // GBP Panel inline (uses approved V1 design)
  const GBP_W = 560;

  return (
    <AbsoluteFill style={{ background: BG2, opacity: fadeOut }}>
      {/* Photo bleed right side */}
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "45%", overflow: "hidden" }}>
        <Img src={img("overhead-floor.webp")} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${BG2} 0%, ${BG2}cc 25%, transparent 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${BG2}88 0%, transparent 25%, transparent 75%, ${BG2}88 100%)` }} />
      </div>

      <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column" }}>
        {/* Nav */}
        <div style={{ padding: "44px 72px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Img src={staticFile("/images/logo-obsidian.webp")} style={{ height: 44, objectFit: "contain" }} />
          <p style={{ fontFamily: FM, fontSize: 14, color: "rgba(250,250,250,0.28)", letterSpacing: 2 }}>studioobrien.com</p>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", padding: "0 72px", gap: 48 }}>
          {/* LEFT */}
          <div style={{ flex: 1.3, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ width: 40, height: 3, background: G, borderRadius: 2, marginBottom: 24, opacity: barSpring }} />

            <div style={{ opacity: headSpring, transform: `translateY(${interpolate(headSpring, [0, 1], [20, 0])}px)` }}>
              <h1 style={{ fontFamily: F, fontSize: 78, fontWeight: 800, color: "#fafafa", lineHeight: 1.02, letterSpacing: -3 }}>Someone just Googled you.</h1>
              <h1 style={{ fontFamily: F, fontSize: 78, fontWeight: 800, color: G, lineHeight: 1.02, letterSpacing: -3, marginTop: 2 }}>Now what?</h1>
            </div>

            <p style={{ fontFamily: F, fontSize: 26, fontWeight: 400, color: "rgba(250,250,250,0.55)", lineHeight: 1.5, marginTop: 22, maxWidth: 560, opacity: bodySpring, transform: `translateY(${interpolate(bodySpring, [0, 1], [14, 0])}px)` }}>
              Without a site, that button is dead. They see your name and pick a competitor.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", alignItems: "flex-start", marginTop: 32, paddingTop: 28, borderTop: "1px solid rgba(250,250,250,0.07)", opacity: statSpring, transform: `translateY(${interpolate(statSpring, [0, 1], [14, 0])}px)` }}>
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
            {/* GBP Panel */}
            <div style={{ opacity: gbpSpring, transform: `translateY(${interpolate(gbpSpring, [0, 1], [30, 0])}px)` }}>
              <div style={{ width: GBP_W, background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(250,250,250,0.06)`, fontFamily: F }}>
                <div style={{ display: "flex", height: GBP_W * 0.23, gap: 2 }}>
                  <div style={{ flex: 2.2, overflow: "hidden" }}><Img src={img("hero-interior-wide.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                  <div style={{ flex: 1, overflow: "hidden" }}><Img src={img("pinball-row.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                  <div style={{ flex: 1, overflow: "hidden" }}><Img src={img("blacklight-basement.webp")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                </div>
                <div style={{ padding: `${GBP_W * 0.038}px ${GBP_W * 0.045}px ${GBP_W * 0.045}px` }}>
                  <p style={{ fontSize: GBP_W * 0.042, fontWeight: 700, color: "#1a1a1a", marginBottom: GBP_W * 0.01 }}>Carolina Arcade Museum</p>
                  <div style={{ display: "flex", alignItems: "center", gap: GBP_W * 0.012, marginBottom: GBP_W * 0.014 }}>
                    <span style={{ fontSize: GBP_W * 0.03, color: "#1a1a1a", fontWeight: 600 }}>4.9</span>
                    <span style={{ fontSize: GBP_W * 0.03, color: "#f4b400" }}>★★★★★</span>
                    <span style={{ fontSize: GBP_W * 0.026, color: "#70757a" }}>(40+)</span>
                  </div>
                  <p style={{ fontSize: GBP_W * 0.024, color: "#70757a", marginBottom: GBP_W * 0.024 }}>145 East Main St, Forest City, NC · (828) 229-3089</p>
                  <div style={{ display: "flex", gap: GBP_W * 0.016 }}>
                    <div style={{ flex: 1, background: "#1a73e8", borderRadius: GBP_W * 0.046, padding: `${GBP_W * 0.02}px 0`, textAlign: "center" }}>
                      <span style={{ fontSize: GBP_W * 0.026, color: "#fff", fontWeight: 600 }}>Directions</span>
                    </div>
                    <div style={{ flex: 1, borderRadius: GBP_W * 0.046, padding: `${GBP_W * 0.02}px 0`, textAlign: "center", background: `${G}15`, border: `3px solid ${G}`, position: "relative" }}>
                      <span style={{ fontSize: GBP_W * 0.026, color: "#15803d", fontWeight: 700 }}>Website</span>
                      <div style={{ position: "absolute", top: -10, right: -6, background: "#ef4444", borderRadius: 8, padding: "2px 8px", boxShadow: "0 2px 8px rgba(239,68,68,0.5)" }}>
                        <span style={{ fontSize: 11, color: "#fff", fontWeight: 800, letterSpacing: 1 }}>KEY</span>
                      </div>
                    </div>
                    <div style={{ flex: 1, background: "#f1f3f4", borderRadius: GBP_W * 0.046, padding: `${GBP_W * 0.02}px 0`, textAlign: "center" }}>
                      <span style={{ fontSize: GBP_W * 0.026, color: "#1a73e8", fontWeight: 600 }}>Call</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Callouts */}
            <div style={{ marginTop: 24, opacity: calloutSpring, transform: `translateY(${interpolate(calloutSpring, [0, 1], [14, 0])}px)` }}>
              {[
                { text: "Your digital front door", c: G },
                { text: "No site means buried in local search", c: RD },
                { text: "A linked site puts you in the top 3", c: BL },
              ].map((s, i) => (
                <div key={s.text} style={{ padding: "18px 0 18px 22px", borderLeft: `3px solid ${s.c}65`, borderBottom: i < 2 ? "1px solid rgba(250,250,250,0.05)" : "none" }}>
                  <p style={{ fontFamily: F, fontSize: 24, fontWeight: 600, color: "rgba(250,250,250,0.7)" }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Citation */}
        <div style={{ padding: "18px 72px 28px", borderTop: "1px solid rgba(250,250,250,0.04)" }}>
          <p style={{ fontFamily: FM, fontSize: 11, color: "rgba(250,250,250,0.14)", letterSpacing: 0.5 }}>
            Sources: Google/Ipsos Consumer Search Behavior Study · BrightLocal Consumer Review Survey 2024 · Safari Digital Local SEO Statistics
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// ACT 4 — OUTRO (0–75, 2.5 sec)
// Matched to Outfit/JetBrains Mono system
// ════════════════════════════════════════════════════════
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const F2 = "'Outfit', sans-serif";
  const FM2 = "'JetBrains Mono', monospace";

  const logoSpring = spring({ frame, fps, config: { damping: 8, stiffness: 50 } });
  const lineWidth = interpolate(frame, [15, 40], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const textOpacity = interpolate(frame, [25, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [60, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "#09090b", justifyContent: "center", alignItems: "center", opacity: fadeOut }}>
      <div style={{ transform: `scale(${logoSpring})`, opacity: logoSpring }}>
        <Img src={staticFile("/images/logo-obsidian.webp")} style={{ height: 90, objectFit: "contain" }} />
      </div>
      <div style={{ position: "absolute", top: "60%", width: lineWidth, height: 1, background: "linear-gradient(90deg, transparent, #34d399, transparent)" }} />
      <div style={{ position: "absolute", top: "65%", opacity: textOpacity, textAlign: "center" }}>
        <p style={{ fontFamily: F2, fontSize: 18, fontWeight: 500, color: "rgba(250,250,250,0.35)", letterSpacing: 4, textTransform: "uppercase" }}>Web Design & Development</p>
        <p style={{ fontFamily: FM2, fontSize: 15, color: "#34d399", marginTop: 10, letterSpacing: 2 }}>studioobrien.com</p>
      </div>
    </AbsoluteFill>
  );
};

// ════════════════════════════════════════════════════════
// MAIN COMPOSITION — 720 frames @ 30fps = 24 seconds
// ════════════════════════════════════════════════════════
export const ArcadeWalkthrough: React.FC = () => (
  <AbsoluteFill style={{ background: BK }}>
    {/* Act 1: Brand Open — 0–85 (2.8s) */}
    <Sequence from={0} durationInFrames={85} name="Brand Open">
      <BrandOpen />
    </Sequence>

    {/* Act 2: Site Scroll — 70–520 (15s) */}
    <Sequence from={70} durationInFrames={450} name="Site Walkthrough">
      <SiteScroll />
    </Sequence>

    {/* Act 3: The Pitch — 505–685 (6s) */}
    <Sequence from={505} durationInFrames={180} name="The Pitch">
      <ThePitch />
    </Sequence>

    {/* Act 4: Outro — 670–745 (2.5s) */}
    <Sequence from={670} durationInFrames={75} name="Outro">
      <Outro />
    </Sequence>
  </AbsoluteFill>
);
