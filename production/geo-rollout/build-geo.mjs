#!/usr/bin/env node
// Geo-page builder (v2 template). Template source = the canonical Shelby page.
// Usage: node production/geo-rollout/build-geo.mjs <town-slug|all> [--check]
//   builds <slug>-nc-web-design.html from production/geo-rollout/towns/<slug>.json
//   "all" builds every town JSON in one run.
//   --check writes to a temp file and diffs against the existing page instead of overwriting.
//
// Design: the template IS shelby-nc-web-design.html (v2: tape hero, map bleed, specimen
// services, mosaic, marquee cities, counter FAQ, last-word CTA). Each variable region is
// swapped by an exact-string replacement. Every anchor is asserted present (with the
// expected occurrence count) BEFORE replacing, so any drift in the Shelby source fails
// the build loudly rather than silently producing a wrong page.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const TEMPLATE = path.join(ROOT, "shelby-nc-web-design.html");

const arg = process.argv[2];
const check = process.argv.includes("--check");
if (!arg) { console.error("usage: build-geo.mjs <town-slug|all> [--check]"); process.exit(1); }

const slugs = arg === "all"
  ? fs.readdirSync(path.join(__dirname, "towns")).filter(f => f.endsWith(".json")).map(f => f.replace(/\.json$/, ""))
  : [arg];

let failures = 0;

for (const slug of slugs) {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, "towns", `${slug}.json`), "utf8"));
  let html = fs.readFileSync(TEMPLATE, "utf8");
  const NL = html.includes("\r\n") ? "\r\n" : "\n"; // match the template's line endings in multi-line anchors

  const t = data.town;          // "Cherryville"
  const c = data.county;        // "Gaston County"
  const s = data.slug;          // "cherryville"
  const url = `https://studioobrien.com/${s}-nc-web-design`;
  const titleMain = `Web Designer in ${t}, NC | Studio O'Brien`;
  const titleTw = `Web Design &amp; Development in ${t}, NC | Studio O'Brien`;
  const mapQuery = data.mapQuery || `${t},NC`;

  // --- derived town lists ---
  // tape needs town + 4 distinct names; pad from footerNearby, then county, if areaServed is short
  const tapePool = [...data.areaServed.slice(1), ...data.footerNearby.map(n => n.name), c]
    .filter((n, i, a) => n !== t && a.indexOf(n) === i);
  const near3 = data.areaServed.slice(1, 4); // map meta "Serving X, a, b & c"
  const dataProblems = [];
  if (data.areaServed[0] !== t) dataProblems.push("areaServed[0] must be the town itself");
  if (tapePool.length < 4) dataProblems.push(`need 4 distinct nearby names for the tape, have ${tapePool.length}`);
  if (near3.length < 3) dataProblems.push("areaServed needs >= 4 entries for the map meta line");
  if (data.neighborCards.length < 2) dataProblems.push("neighborCards needs >= 2 entries for the marquee");
  if (dataProblems.length) { console.error(`${s}: ${dataProblems.join("; ")}`); failures++; continue; }
  const tape = tapePool.slice(0, 4);

  // --- generated multi-line blocks (match Shelby indentation exactly) ---
  const areaServedBlock =
    `  "areaServed": [${NL}` +
    data.areaServed.map(n => `    {"@type": "City", "name": "${n}"}`).join(`,${NL}`) +
    `,${NL}    {"@type": "State", "name": "North Carolina"}${NL}  ],`;

  const tapeLine =
    `      <span>Custom Websites</span><span>${t}</span><span>Local SEO</span><span>${tape[0]}</span><span>Google Business Profile</span><span>${tape[1]}</span><span>Branding</span><span>${tape[2]}</span><span>Website Migration</span><span>${tape[3]}</span>`;

  const marqueeLine =
    `      <span class="home">${t}</span> <span class="sep">&bull;</span> ` +
    data.neighborCards.map(n => `<a href="/${n.slug}-nc-web-design">${n.name}</a>`).join(` <span class="sep">&bull;</span> `);

  const footerNearbyBlock =
    `      <div class="foot-nearby" aria-label="Nearby areas served">${NL}` +
    data.footerNearby.map(n => `        <a href="/${n.slug}-nc-web-design">${n.name}</a>`).join(NL) +
    `${NL}      </div>`;

  // --- replacement table: [find, replace, expectedCount(default 1)] ---
  const R = [
    // head / meta
    [`<title>Web Designer in Shelby, NC | Studio O'Brien</title>`,
     `<title>${titleMain}</title>`],
    [`<meta name="description" content="Custom web design and SEO for Shelby and Cleveland County businesses: shops, restaurants, trades, and pros. Sites you own outright, no templates.">`,
     `<meta name="description" content="${data.metaDesc}">`],
    [`<link rel="canonical" href="https://studioobrien.com/shelby-nc-web-design">`,
     `<link rel="canonical" href="${url}">`],
    [`<meta property="og:url" content="https://studioobrien.com/shelby-nc-web-design">`,
     `<meta property="og:url" content="${url}">`],
    [`<meta property="og:title" content="Web Designer in Shelby, NC | Studio O'Brien">`,
     `<meta property="og:title" content="${titleMain}">`],
    [`<meta property="og:description" content="Custom web design and development for Shelby and Cleveland County. Websites, SEO, and branding you own outright. No templates.">`,
     `<meta property="og:description" content="${data.ogDesc}">`],
    [`<meta name="twitter:title" content="Web Design &amp; Development in Shelby, NC | Studio O'Brien">`,
     `<meta name="twitter:title" content="${titleTw}">`],
    [`<meta name="twitter:description" content="Custom web design and development in Shelby, NC. Websites, SEO, and branding for small businesses, restaurants, and nonprofits in Cleveland County.">`,
     `<meta name="twitter:description" content="${data.twDesc}">`],
    // ProfessionalService schema
    [`  "url": "https://studioobrien.com/shelby-nc-web-design",`,
     `  "url": "${url}",`],
    [`  "description": "Web development and design in Shelby, NC. Custom websites, SEO, and branding for restaurants, small businesses, and nonprofits in Cleveland County, Kings Mountain, Forest City, and Rutherfordton.",`,
     `  "description": "${data.schemaDesc}",`],
    [`    "addressLocality": "Shelby",`, `    "addressLocality": "${t}",`],
    [[`  "areaServed": [`,
      `    {"@type": "City", "name": "Shelby"},`,
      `    {"@type": "City", "name": "Kings Mountain"},`,
      `    {"@type": "City", "name": "Forest City"},`,
      `    {"@type": "City", "name": "Rutherfordton"},`,
      `    {"@type": "City", "name": "Gastonia"},`,
      `    {"@type": "City", "name": "Charlotte"},`,
      `    {"@type": "State", "name": "North Carolina"}`,
      `  ],`].join(NL),
     areaServedBlock],
    // breadcrumb
    [`    {"@type": "ListItem", "position": 2, "name": "Web Design Shelby NC", "item": "https://studioobrien.com/shelby-nc-web-design"}`,
     `    {"@type": "ListItem", "position": 2, "name": "Web Design ${t} NC", "item": "${url}"}`],
    // FAQ schema (visible cost question is town-agnostic in v2; outside/businesses are schema + visible)
    [`cost in Shelby?`, `cost in ${t}?`],
    [`businesses outside Shelby?`, `businesses outside ${t}?`, 2],
    [`Yes. We serve Cleveland County, Kings Mountain, Boiling Springs, Forest City, Rutherfordton, Gastonia, and throughout North Carolina, all done remotely with recorded walkthroughs.`,
     data.faqOutsideAnswer, 2],
    [`Uptown restaurants and retail, trades and contractors, professional practices, nonprofits, and small manufacturers across Cleveland County.`,
     data.faqBusinessesAnswer, 2],
    // hero
    [`<span class="hero-loc">Shelby &middot; Cleveland County, North Carolina</span>`,
     `<span class="hero-loc">${t} &middot; ${c}, North Carolina</span>`],
    [`<span class="ln"><span>Web design in Shelby</span></span>`,
     `<span class="ln"><span>Web design in ${t}</span></span>`],
    [`<p class="hero-sub">Custom sites for the shops, restaurants, trades, and practices of Cleveland County. Hand-coded around your business, ranked on Google, and <strong>owned by you outright</strong>. See the full <a href="/">Shelby NC web design portfolio</a> for recent work.</p>`,
     `<p class="hero-sub">Custom sites for the shops, restaurants, trades, and practices of ${c}. Hand-coded around your business, ranked on Google, and <strong>owned by you outright</strong>. See the full <a href="/">${t} NC web design portfolio</a> for recent work.</p>`],
    // tape (real + aria-hidden duplicate)
    [`      <span>Custom Websites</span><span>Shelby</span><span>Local SEO</span><span>Kings Mountain</span><span>Google Business Profile</span><span>Boiling Springs</span><span>Branding</span><span>Forest City</span><span>Website Migration</span><span>Rutherfordton</span>`,
     tapeLine, 2],
    // local intro
    [`<h2 class="sec-title" style="text-align:left">Built for <em>uptown Shelby</em> and the county it anchors.</h2>`,
     `<h2 class="sec-title" style="text-align:left">${data.localH2}</h2>`],
    [`<p>Shelby is the seat of Cleveland County, and it shows on the square: the 1907 courthouse, the storefronts of a Main Street America district, the crowds for a show at the <strong>Don Gibson Theatre</strong> or the <strong>Earl Scruggs Center</strong>. It is a working town with a real downtown, and the businesses here deserve a website that looks the part.</p>`,
     `<p>${data.localP1}</p>`],
    [`<p>We build for the people who actually run this place: the restaurant off the square, the contractor covering the county, the law office and the clinic, the shop trying to pull customers from Kings Mountain and the Charlotte commute. Every site is designed and coded around <strong>your</strong> business, not stamped out of a template.</p>`,
     `<p>${data.localP2}</p>`],
    [`<iframe title="Shelby, NC service area map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52126.14791282843!2d-81.5755558!3d35.2923349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8856f2b45e0a6191%3A0x60c65f00f0b5e5e7!2sShelby%2C+NC!5e0!3m2!1sen!2sus!4v1" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`,
     `<iframe title="${t}, NC service area map" src="https://www.google.com/maps?q=${mapQuery}&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`],
    [`Serving Shelby, Kings Mountain, Boiling Springs &amp; Forest City`,
     `Serving ${t}, ${near3[0]}, ${near3[1]} &amp; ${near3[2]}`],
    // services
    [`<h2 class="sec-title" style="text-align:left">What we do for <em>Shelby businesses</em></h2>`,
     `<h2 class="sec-title" style="text-align:left">What we do for <em>${t} businesses</em></h2>`],
    // process alt text
    [`alt="Mapping a Shelby business's goals, audience, and the pages the site needs to rank and convert"`,
     `alt="Mapping a ${t} business's goals, audience, and the pages the site needs to rank and convert"`],
    [`alt="Custom web design and on-brand copywriting for a Cleveland County business"`,
     `alt="Custom web design and on-brand copywriting for a ${c} business"`],
    [`alt="Website launch and local SEO with Google Business Profile so Shelby locals find your business"`,
     `alt="Website launch and local SEO with Google Business Profile so ${t} locals find your business"`],
    // cities (marquee junction)
    [`<h2 class="sr-only">Serving Cleveland County &amp; beyond</h2>`,
     `<h2 class="sr-only">Serving ${c} &amp; beyond</h2>`],
    [`<p class="cty-eyebrow reveal">Rooted in Shelby, serving Cleveland County <b>&amp; beyond</b>.</p>`,
     `<p class="cty-eyebrow reveal">Rooted in ${t}, serving ${c} <b>&amp; beyond</b>.</p>`],
    [`      <span class="home">Shelby</span> <span class="sep">&bull;</span> <a href="/kings-mountain-nc-web-design">Kings Mountain</a> <span class="sep">&bull;</span> <a href="/forest-city-nc-web-design">Forest City</a> <span class="sep">&bull;</span> <a href="/rutherfordton-nc-web-design">Rutherfordton</a>`,
     marqueeLine],
    // faq rail
    [`<h2 class="sec-title" style="text-align:left">Questions we hear from Shelby owners</h2>`,
     `<h2 class="sec-title" style="text-align:left">Questions we hear from ${t} owners</h2>`],
    // cta
    [`I build custom websites for Shelby businesses that turn visitors into`,
     `I build custom websites for ${t} businesses that turn visitors into`],
    // footer
    [`<p>&copy; 2026 Studio O'Brien &middot; Web design &amp; development in Shelby, NC</p>`,
     `<p>&copy; 2026 Studio O'Brien &middot; Web design &amp; development in ${t}, NC</p>`],
    [[`      <div class="foot-nearby" aria-label="Nearby areas served">`,
      `        <a href="/kings-mountain-nc-web-design">Kings Mountain</a>`,
      `        <a href="/boiling-springs-nc-web-design">Boiling Springs</a>`,
      `        <a href="/forest-city-nc-web-design">Forest City</a>`,
      `        <a href="/rutherfordton-nc-web-design">Rutherfordton</a>`,
      `        <a href="/cherryville-nc-web-design">Cherryville</a>`,
      `        <a href="/gastonia-nc-web-design">Gastonia</a>`,
      `      </div>`].join(NL),
     footerNearbyBlock],
  ];

  // apply with assertions
  let bad = false;
  for (const [find, repl, expected = 1] of R) {
    const count = html.split(find).length - 1;
    if (count !== expected) {
      console.error(`${s}: ANCHOR MISMATCH (${count} found, expected ${expected}):\n  ${JSON.stringify(find.slice(0, 90))}...`);
      bad = true;
      continue;
    }
    html = html.split(find).join(repl);
  }
  if (bad) { failures++; continue; }

  // soft checks (warn, don't fail)
  if (data.metaDesc.length > 160) console.warn(`${s}: WARN metaDesc is ${data.metaDesc.length} chars (>160)`);
  if (html.includes("&amp;amp;")) console.warn(`${s}: WARN double-escaped ampersand (&amp;amp;) in output`);

  // post-build validation
  const dashes = (html.match(/[—–]/g) || []).length;
  if (dashes) { console.error(`${s}: FAIL ${dashes} em/en dash(es) in output`); failures++; continue; }
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (blocks.length !== 3) { console.error(`${s}: FAIL ${blocks.length} JSON-LD blocks (expected 3)`); failures++; continue; }
  let jsonOk = true;
  for (const [i, b] of blocks.entries()) {
    try { JSON.parse(b[1]); } catch (e) { console.error(`${s}: FAIL JSON-LD block ${i + 1}: ${e.message}`); jsonOk = false; }
  }
  if (!jsonOk) { failures++; continue; }
  if (html.includes("aggregateRating") || html.includes('"review"')) {
    console.error(`${s}: FAIL fake review schema present`); failures++; continue;
  }
  if (html.includes("Shelby") && s !== "shelby") {
    // Shelby may legitimately appear in localP1/P2/answers written for neighbors; only warn.
    console.warn(`${s}: NOTE output still mentions Shelby (check it's intentional copy, not a missed anchor)`);
  }

  const outPath = path.join(ROOT, `${s}-nc-web-design.html`);
  if (check) {
    const tmp = path.join(__dirname, `.check-${s}.html`);
    fs.writeFileSync(tmp, html);
    console.log(`${s}: --check wrote ${tmp}`);
  } else {
    fs.writeFileSync(outPath, html);
    console.log(`OK: built ${s}-nc-web-design.html (${html.length} bytes)`);
  }
}

if (failures) { console.error(`${failures} town(s) failed.`); process.exit(2); }
