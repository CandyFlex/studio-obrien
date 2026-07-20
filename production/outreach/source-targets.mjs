#!/usr/bin/env node
/**
 * source-targets.mjs — bulk target sourcing pipeline for the outreach system.
 *
 * Pulls every categorized business in the territory from OpenStreetMap
 * (Overpass API, free, one call), classifies web presence, scores against
 * the worth-targeting rubric, and emits ranked bench candidates for CRM.md.
 *
 * Usage:
 *   node production/outreach/source-targets.mjs fetch    # Overpass -> sources/osm-raw.json
 *   node production/outreach/source-targets.mjs build    # raw -> targets-db.json (classify/dedupe/score)
 *   node production/outreach/source-targets.mjs probe    # HTTP-check every listed website, update db
 *   node production/outreach/source-targets.mjs score    # rescore in place (rubric change, no probe wipe)
 *   node production/outreach/source-targets.mjs report   # targets-db.json -> TARGETS-REPORT.md
 *   node production/outreach/source-targets.mjs verify-queue [N]  # top N provisional rows -> worksheet
 *   node production/outreach/source-targets.mjs apply-verify      # merge filled worksheet, rescore
 *
 * Scoring rubric syncs with TARGETING.md (see that file once written);
 * doctrine: OUTREACH-SYSTEM.md section 5. OSM data is a lead, not a fact:
 * every candidate gets hand-verified before any contact (section 7).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(HERE, "sources");
const RAW = join(SRC_DIR, "osm-raw.json");
const DB = join(HERE, "targets-db.json");
const REPORT = join(HERE, "TARGETS-REPORT.md");

// Territory: Cleveland County NC + adjacent towns (Kings Mountain, Boiling
// Springs, Cherryville, Forest City/Rutherfordton edge, Lincolnton edge).
const BBOX = "35.08,-81.98,35.53,-81.20"; // south,west,north,east

const OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

const QUERY = `
[out:json][timeout:120];
(
  nwr["shop"](${BBOX});
  nwr["craft"](${BBOX});
  nwr["office"](${BBOX});
  nwr["amenity"~"^(restaurant|cafe|fast_food|bar|pub|ice_cream|dentist|clinic|doctors|veterinary|pharmacy|car_wash|fuel|childcare|kindergarten)$"](${BBOX});
  nwr["leisure"~"^(fitness_centre|sports_centre|bowling_alley)$"](${BBOX});
  nwr["tourism"~"^(hotel|motel|guest_house)$"](${BBOX});
);
out center tags;`;

// OSM tag -> niche. First match wins (craft/shop are more specific than amenity).
const NICHE_MAP = [
  [t => /^(hvac)$/.test(t.craft || ""), "hvac"],
  [t => /^(plumber)$/.test(t.craft || ""), "plumbing"],
  [t => /^(electrician)$/.test(t.craft || ""), "electrical"],
  [t => /^(roofer|scaffolder)$/.test(t.craft || ""), "roofing-exterior"],
  [t => /^(carpenter|builder|painter|tiler|plasterer|window_construction|flooring)$/.test(t.craft || ""), "construction-remodel"],
  [t => /^(gardener|landscaping)$/.test(t.craft || "") || t.shop === "garden_centre", "landscaping-lawn"],
  [t => t.shop === "car_repair" || t.amenity === "car_wash" || t.shop === "tyres" || t.shop === "car_parts" || t.craft === "car_repair", "auto"],
  [t => t.shop === "car" || t.shop === "motorcycle" || t.shop === "trailer", "auto-sales"],
  [t => /^(restaurant|cafe|fast_food|bar|pub|ice_cream)$/.test(t.amenity || ""), "restaurant-food"],
  [t => /^(bakery|confectionery|butcher|deli|coffee)$/.test(t.shop || "") || t.craft === "bakery", "restaurant-food"],
  [t => /^(hairdresser|beauty|massage|tattoo)$/.test(t.shop || ""), "salon-spa"],
  [t => t.amenity === "dentist", "dental"],
  [t => /^(clinic|doctors|pharmacy)$/.test(t.amenity || ""), "medical"],
  [t => t.amenity === "veterinary" || t.shop === "pet_grooming" || t.shop === "pet", "vet-pet"],
  [t => /^(lawyer|accountant|insurance|financial|financial_advisor|tax_advisor|estate_agent)$/.test(t.office || ""), "professional"],
  [t => /^(fitness_centre|sports_centre|bowling_alley)$/.test(t.leisure || ""), "fitness-rec"],
  [t => /^(hotel|motel|guest_house)$/.test(t.tourism || ""), "lodging"],
  [t => t.craft === "photographer" || t.shop === "photo", "photo-events"],
  [t => t.amenity === "childcare" || t.amenity === "kindergarten", "childcare"],
  [t => !!t.craft, "trades-other"],
  [t => !!t.office, "professional-other"],
  [t => !!t.shop, "retail"],
];

// Franchise/chain names that OSM often lists without a brand tag.
const CHAIN_RX = /\b(mcdonald|burger king|wendy|bojangles|subway|taco bell|kfc|pizza hut|domino|papa john|zaxby|cook out|hardee|waffle house|chick.fil.a|arby|dairy queen|sonic|starbucks|dunkin|walmart|food lion|ingles|aldi|dollar (general|tree)|family dollar|walgreens|cvs|rite aid|autozone|advance auto|o'?reilly|napa auto|tractor supply|lowe'?s|home depot|verizon|t.mobile|at&t|circle k|speedway|quiktrip|7.eleven|shell|exxon|bp|marathon|citgo|great clips|sport clips|supercuts|anytime fitness|planet fitness|h&r block|jackson hewitt|state farm|allstate|nationwide|geico|enterprise rent|u.haul|holiday inn|hampton inn|quality inn|days inn|super 8|comfort (inn|suites)|econo lodge|motel 6|best western|firehouse subs|jersey mike|jimmy john|little caesar|marco'?s pizza|panera|chipotle|huddle house|ihop|applebee|captain d|golden corral|el jimador)\b/i;

// Rough town centers for reverse lookup when addr:city is missing.
const TOWNS = [
  ["Shelby", 35.2924, -81.5356], ["Kings Mountain", 35.2451, -81.3412],
  ["Boiling Springs", 35.2535, -81.6668], ["Lawndale", 35.4132, -81.5620],
  ["Fallston", 35.4318, -81.5006], ["Polkville", 35.4171, -81.6437],
  ["Grover", 35.1737, -81.4512], ["Earl", 35.1957, -81.5334],
  ["Mooresboro", 35.2971, -81.6965], ["Cherryville", 35.3787, -81.3790],
  ["Waco", 35.3618, -81.4290], ["Casar", 35.5121, -81.6187],
  ["Forest City", 35.3340, -81.8651], ["Ellenboro", 35.3260, -81.7615],
  ["Patterson Springs", 35.2415, -81.5137], ["Kingstown", 35.3282, -81.5967],
];

const NICHE_PRIORITY = { // demand + deal-size prior; TARGETING.md will refine
  hvac: 10, plumbing: 10, electrical: 9, "roofing-exterior": 9, auto: 8,
  "construction-remodel": 8, "restaurant-food": 8, dental: 7, medical: 6,
  "vet-pet": 7, "salon-spa": 6, "landscaping-lawn": 7, professional: 6,
  "fitness-rec": 5, lodging: 5, "photo-events": 5, childcare: 5,
  "trades-other": 6, "professional-other": 4, retail: 4, "auto-sales": 4,
};

const arg = process.argv[2];

function nearestTown(lat, lon) {
  let best = null, bestD = Infinity;
  for (const [name, tlat, tlon] of TOWNS) {
    const d = (lat - tlat) ** 2 + (lon - tlon) ** 2;
    if (d < bestD) { bestD = d; best = name; }
  }
  return best;
}

function niche(tags) {
  for (const [test, n] of NICHE_MAP) if (test(tags)) return n;
  return "other";
}

function slug(s) {
  return s.toLowerCase().replace(/['".,&]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function cmdFetch() {
  console.log("Querying Overpass (one bulk call, can take ~60s)...");
  let json = null, lastErr = null;
  for (const url of OVERPASS_MIRRORS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
          "User-Agent": "StudioOBrien-target-sourcing/1.0 (jarredkern@gmail.com)",
        },
        body: "data=" + encodeURIComponent(QUERY),
      });
      if (!res.ok) throw new Error(`${url} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
      json = await res.json();
      console.log(`OK via ${url}`);
      break;
    } catch (e) { lastErr = e; console.log(`mirror failed: ${e.message.slice(0, 160)}`); }
  }
  if (!json) throw lastErr;
  mkdirSync(SRC_DIR, { recursive: true });
  writeFileSync(RAW, JSON.stringify(json));
  console.log(`Fetched ${json.elements?.length ?? 0} elements -> ${RAW}`);
}

function cmdBuild() {
  const raw = JSON.parse(readFileSync(RAW, "utf8"));
  const seen = new Map();
  let skippedNoName = 0;
  for (const el of raw.elements) {
    const t = el.tags || {};
    if (!t.name) { skippedNoName++; continue; }
    const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
    if (lat == null) continue;
    const n = niche(t);
    if (n === "other") continue;
    const website = t.website || t["contact:website"] || null;
    const facebook = t["contact:facebook"] || t.facebook ||
      (website && /facebook\.com/i.test(website) ? website : null);
    const chain = !!(t.brand || t["brand:wikidata"]) || CHAIN_RX.test(t.name);
    const town = t["addr:city"] || nearestTown(lat, lon);
    const rec = {
      id: slug(`${t.name}-${town}`),
      name: t.name, niche: n, town,
      lat: +lat.toFixed(5), lon: +lon.toFixed(5),
      phone: t.phone || t["contact:phone"] || null,
      website: website && !/facebook\.com|instagram\.com/i.test(website) ? website : null,
      facebook, chain,
      // none | social-only | unprobed -> (probe) -> live | dead
      websiteStatus: website && !/facebook\.com|instagram\.com/i.test(website)
        ? "unprobed" : (facebook ? "social-only" : "none"),
      probe: null, source: "osm", fetchedAt: new Date().toISOString().slice(0, 10),
    };
    // dedupe: keep the record with more contact info
    const prev = seen.get(rec.id);
    if (!prev || (!!rec.website + !!rec.phone) > (!!prev.website + !!prev.phone)) seen.set(rec.id, rec);
  }
  const targets = [...seen.values()];
  score(targets);
  writeFileSync(DB, JSON.stringify({ generatedAt: new Date().toISOString(), bbox: BBOX, count: targets.length, targets }, null, 1));
  console.log(`Built ${targets.length} named businesses (${skippedNoName} unnamed skipped) -> ${DB}`);
  const byStatus = {};
  for (const x of targets) byStatus[x.chain ? "chain" : x.websiteStatus] = (byStatus[x.chain ? "chain" : x.websiteStatus] || 0) + 1;
  console.log(byStatus);
}

async function cmdProbe() {
  const db = JSON.parse(readFileSync(DB, "utf8"));
  const todo = db.targets.filter(x => x.website && !x.chain && (x.websiteStatus === "unprobed" || !x.probe));
  console.log(`Probing ${todo.length} websites (concurrency 8, 10s timeout)...`);
  let done = 0;
  async function probeOne(x) {
    const url = /^https?:\/\//i.test(x.website) ? x.website : "http://" + x.website;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 10000);
    try {
      const res = await fetch(url, { signal: ctl.signal, redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (compatible; StudioOBrien-linkcheck)" } });
      const finalUrl = res.url || url;
      if (/facebook\.com|instagram\.com/i.test(finalUrl)) { x.websiteStatus = "social-only"; x.facebook = x.facebook || finalUrl; }
      else if (res.ok) x.websiteStatus = "live";
      else x.websiteStatus = res.status >= 500 || res.status === 404 || res.status === 410 ? "dead" : "live";
      x.probe = { status: res.status, finalUrl, at: new Date().toISOString().slice(0, 10) };
    } catch (e) {
      x.websiteStatus = "dead";
      x.probe = { error: (e.cause?.code || e.name || "fetch-failed"), at: new Date().toISOString().slice(0, 10) };
    } finally { clearTimeout(timer); if (++done % 25 === 0) console.log(`  ${done}/${todo.length}`); }
  }
  const pool = [];
  for (const x of todo) {
    const p = probeOne(x).then(() => pool.splice(pool.indexOf(p), 1));
    pool.push(p);
    if (pool.length >= 8) await Promise.race(pool);
  }
  await Promise.all(pool);
  score(db.targets);
  writeFileSync(DB, JSON.stringify(db, null, 1));
  const byStatus = {};
  for (const x of db.targets) if (!x.chain) byStatus[x.websiteStatus] = (byStatus[x.websiteStatus] || 0) + 1;
  console.log("Probe complete:", byStatus);
}

// TARGETING.md Part 4 scorecard, computed on available data. Reviews and
// owner-reachability are unknown until the verification pass fills
// x.reviews {count, rating} and x.owner {name, email} — until then those
// factors score their floor and the total is PROVISIONAL (max ~74).
const SC_TOWNS = new Set(["Gaffney", "Blacksburg", "Chesnee", "Clover", "Boiling Springs SC"]); // Part 2: SC = referral-only, never cold-sourced
const DEMAND_20 = { hvac: 20, "roofing-exterior": 20, auto: 14, "auto-sales": 10, "landscaping-lawn": 10, "salon-spa": 10, professional: 10 }; // xref quadrants; unmeasured = 8
const PROOF_10 = { "restaurant-food": 10, dental: 10, hvac: 10, electrical: 10, "roofing-exterior": 10, plumbing: 6, "construction-remodel": 6, "trades-other": 6, "landscaping-lawn": 6 }; // else 2

function score(targets) {
  for (const x of targets) {
    if (x.chain) { x.score = 0; x.class = "DROP-chain"; continue; }
    if (x.closed) { x.score = 0; x.class = "DROP-closed"; continue; }
    if (x.dropped) { x.score = 0; x.class = "DROP-other"; continue; } // gov facilities, duplicates, OSM artifacts
    if (SC_TOWNS.has(x.town)) { x.score = 0; x.class = "DROP-territory"; continue; }
    const gap = x.websiteStatus === "live" && x.liveSiteGrade
      ? ({ weak: 12, flawed: 5, good: 0 }[x.liveSiteGrade] ?? 8)
      : ({ none: 30, "social-only": 25, dead: 20, unprobed: 15, live: 8 }[x.websiteStatus] ?? 0); // live=8 provisional until graded
    const demand = DEMAND_20[x.niche] ?? 8;
    const reviews = x.reviews ? (x.reviews.count >= 100 && x.reviews.rating >= 4.3 ? 20 : x.reviews.count >= 40 ? 15 : x.reviews.count >= 15 ? 10 : x.reviews.count >= 1 ? 5 : 2) : 2;
    const reach = x.owner?.email ? 15 : x.owner?.name ? 11 : x.email ? 7 : (x.phone && x.facebook) ? 7 : (x.phone || x.facebook) ? 4 : 0;
    const proof = PROOF_10[x.niche] ?? 2;
    const route = ["none", "social-only", "dead"].includes(x.websiteStatus) ? 5 : x.websiteStatus === "live" ? 3 : 1;
    x.score = gap + demand + reviews + reach + proof + route;
    x.provisional = !x.reviews || !x.owner;
    x.class = x.score >= 70 ? "SEND" : x.score >= 45 ? "BENCH" : "DISCARD";
  }
}

function cmdReport() {
  const db = JSON.parse(readFileSync(DB, "utf8"));
  const t = db.targets.filter(x => !x.chain);
  const lines = [];
  lines.push(`# Target Landscape Report — generated ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`\nSource: OSM/Overpass bbox ${db.bbox}; ${db.count} named businesses; ${t.length} after chain filter.`);
  lines.push(`Scores per source-targets.mjs rubric (syncs with TARGETING.md). OSM is a lead, not a fact:`);
  lines.push(`hand-verify per OUTREACH-SYSTEM.md section 7 before any row enters CRM.md BENCH.\n`);
  const statuses = ["none", "social-only", "dead", "live", "unprobed"];
  lines.push(`## Web-presence summary\n`);
  lines.push(`| Status | Count | Meaning |`);
  lines.push(`|---|---|---|`);
  const meaning = { none: "no site, no social found (Route B2 Storefront)", "social-only": "Facebook/Instagram is the site (Route B2, easiest yes)", dead: "listed site is down/broken (Route B2/A)", live: "site up (Route A candidates - needs SERP evidence)", unprobed: "not yet probed" };
  for (const s of statuses) {
    const c = t.filter(x => x.websiteStatus === s).length;
    if (c) lines.push(`| ${s} | ${c} | ${meaning[s]} |`);
  }
  lines.push(`\n## Rich areas — counts by town × niche (gap targets only: none/social-only/dead)\n`);
  const gapT = t.filter(x => ["none", "social-only", "dead"].includes(x.websiteStatus));
  const towns = [...new Set(gapT.map(x => x.town))].sort((a, b) => gapT.filter(x => x.town === b).length - gapT.filter(x => x.town === a).length);
  lines.push(`| Town | Gap targets | Top niches |`);
  lines.push(`|---|---|---|`);
  for (const town of towns) {
    const rows = gapT.filter(x => x.town === town);
    const byN = {};
    for (const r of rows) byN[r.niche] = (byN[r.niche] || 0) + 1;
    const top = Object.entries(byN).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([n, c]) => `${n} (${c})`).join(", ");
    lines.push(`| ${town} | ${rows.length} | ${top} |`);
  }
  const tierRank = { HIGH: 0, MID: 1, null: 2, undefined: 2, LOW: 3 }; // Part 6 ordering: HIGH first, LOW last (angle changes, never leaves)
  for (const cls of ["SEND", "BENCH"]) {
    const rows = t.filter(x => x.class === cls).sort((a, b) =>
      cls === "SEND" ? (tierRank[a.capacity?.tier] - tierRank[b.capacity?.tier]) || (b.score - a.score) : b.score - a.score);
    lines.push(`\n## ${cls} (${rows.length})${rows.some(x => x.provisional) ? " — scores PROVISIONAL until reviews + owner verified (max +31 upside)" : ""}\n`);
    lines.push(`| Score | Cap | Business | Niche | Town | Web presence | Contact |`);
    lines.push(`|---|---|---|---|---|---|---|`);
    for (const x of rows.slice(0, cls === "SEND" ? 60 : 60)) {
      const web = x.websiteStatus + (x.website ? ` (${x.website.replace(/^https?:\/\/(www\.)?/, "").slice(0, 40)})` : x.facebook ? " (FB)" : "");
      lines.push(`| ${x.score}${x.provisional ? "*" : ""} | ${x.capacity?.tier ?? "-"} | ${x.name} | ${x.niche} | ${x.town} | ${web} | ${x.phone || x.email || x.facebook || "-"} |`);
    }
  }
  lines.push(`\n## Next step\n\nVerification pass on the top rows (TARGETING.md Part 4 fills the missing`);
  lines.push(`factors: reviews count/rating, owner name/email, live-site grading). Survivors`);
  lines.push(`≥70 promote to CRM.md BENCH with route + next action per doctrine section 7.`);
  writeFileSync(REPORT, lines.join("\n"));
  console.log(`Report -> ${REPORT} | SEND: ${t.filter(x => x.class === "SEND").length}, BENCH: ${t.filter(x => x.class === "BENCH").length}, DISCARD: ${t.filter(x => x.class === "DISCARD").length}`);
}

function cmdScore() { // rescore in place (no probe wipe) + backfill email from raw
  const db = JSON.parse(readFileSync(DB, "utf8"));
  if (existsSync(RAW)) {
    const raw = JSON.parse(readFileSync(RAW, "utf8"));
    const emails = new Map();
    for (const el of raw.elements) {
      const t = el.tags || {};
      if (t.name && (t.email || t["contact:email"]))
        emails.set(slug(`${t.name}-${t["addr:city"] || nearestTown(el.lat ?? el.center?.lat, el.lon ?? el.center?.lon)}`), t.email || t["contact:email"]);
    }
    for (const x of db.targets) if (!x.email && emails.has(x.id)) x.email = emails.get(x.id);
  }
  score(db.targets);
  writeFileSync(DB, JSON.stringify(db, null, 1));
  const byClass = {};
  for (const x of db.targets) byClass[x.class] = (byClass[x.class] || 0) + 1;
  console.log("Rescored:", byClass);
}

// ---- Verification cycle (TARGETING.md Part 4 fill-in loop) ----
// verify-queue: emit the top provisional rows as a worksheet.
// apply-verify: merge the filled worksheet back, rescore, promote.
const VQ = join(SRC_DIR, "verify-queue.json");

function cmdVerifyQueue() {
  const n = parseInt(process.argv[3] || "40", 10);
  const db = JSON.parse(readFileSync(DB, "utf8"));
  const rows = db.targets
    .filter(x => !x.chain && x.class !== "DROP-territory" && x.class !== "DISCARD" && x.provisional && !x.verifiedAt)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map(x => ({
      id: x.id, name: x.name, niche: x.niche, town: x.town,
      score_now: x.score, phone: x.phone, osm_website: x.website,
      // ---- fields to fill (null = unknown, leave null if unverifiable) ----
      exists: null,            // false = closed/gone -> auto-discard
      realWebsite: null,       // URL if a site exists that OSM missed; "NONE" if confirmed no site
      liveSiteGrade: null,     // for live sites: "weak" | "flawed" | "good"
      reviews: null,           // { count: N, rating: 4.6 } from Google Maps
      owner: null,             // { name: "", email: "" } from SoS/license/FB about
      gbpClosed: null,         // true if GBP says permanently closed
      notes: null,
    }));
  writeFileSync(VQ, JSON.stringify({ generatedAt: new Date().toISOString(), instructions: "Fill fields per TARGETING.md Part 4. Sources: web search name+town, Google Maps (reviews/closed), sosnc.gov business search + NC license boards (owner), site visit (grade). Leave null if unverifiable. Then run apply-verify.", rows }, null, 1));
  console.log(`Verify queue: ${rows.length} rows -> ${VQ}`);
}

function cmdApplyVerify() {
  const db = JSON.parse(readFileSync(DB, "utf8"));
  const q = JSON.parse(readFileSync(VQ, "utf8"));
  const byId = new Map(db.targets.map(x => [x.id, x]));
  let applied = 0;
  for (const r of q.rows) {
    const x = byId.get(r.id);
    if (!x) continue;
    const touched = r.exists !== null || r.realWebsite !== null || r.reviews !== null || r.owner !== null || r.gbpClosed !== null || r.liveSiteGrade !== null;
    if (!touched) continue;
    if (r.exists === false || r.gbpClosed === true) { x.closed = true; x.verifiedAt = q.generatedAt.slice(0, 10); applied++; continue; }
    if (r.realWebsite && r.realWebsite !== "NONE") { x.website = r.realWebsite; x.websiteStatus = "live"; }
    if (r.realWebsite === "NONE") x.websiteStatus = "none";
    if (r.liveSiteGrade) x.liveSiteGrade = r.liveSiteGrade; // weak|flawed|good
    if (r.reviews) x.reviews = r.reviews;
    if (r.owner) x.owner = r.owner;
    if (r.notes) x.notes = r.notes;
    x.verifiedAt = new Date().toISOString().slice(0, 10);
    applied++;
  }
  // graded live sites override the provisional live=8
  for (const x of db.targets) if (x.liveSiteGrade) x._gapOverride = { weak: 12, flawed: 5, good: 0 }[x.liveSiteGrade];
  score(db.targets);
  for (const x of db.targets) if (x._gapOverride !== undefined && !x.chain && x.class.indexOf("DROP") !== 0) {
    x.score = x.score - ({ none: 30, "social-only": 25, dead: 20, unprobed: 15, live: 8 }[x.websiteStatus] ?? 0) + x._gapOverride;
    x.class = x.score >= 70 ? "SEND" : x.score >= 45 ? "BENCH" : "DISCARD";
    delete x._gapOverride;
  }
  writeFileSync(DB, JSON.stringify(db, null, 1));
  const byClass = {};
  for (const x of db.targets) byClass[x.class] = (byClass[x.class] || 0) + 1;
  console.log(`Applied ${applied} verifications. Bands:`, byClass);
  console.log("Now run: node production/outreach/source-targets.mjs report");
}

// apply-capacity: merge sources/capacity-audit.json (TARGETING.md Part 6)
// into the db. Tier orders the send list; it never changes the score.
function cmdApplyCapacity() {
  const db = JSON.parse(readFileSync(DB, "utf8"));
  const audit = JSON.parse(readFileSync(join(SRC_DIR, "capacity-audit.json"), "utf8"));
  const byId = new Map(db.targets.map(x => [x.id, x]));
  let applied = 0;
  for (const r of audit) {
    const x = byId.get(r.id);
    if (!x) { console.log("no db row for", r.id); continue; }
    x.capacity = { tier: r.tier, signals: r.signals || [], counterSignals: r.counterSignals || [], notes: r.notes || null, at: new Date().toISOString().slice(0, 10) };
    applied++;
  }
  writeFileSync(DB, JSON.stringify(db, null, 1));
  const tiers = {};
  for (const r of audit) tiers[r.tier ?? "null"] = (tiers[r.tier ?? "null"] || 0) + 1;
  console.log(`Applied capacity to ${applied} rows. Tiers:`, tiers);
}

const cmds = { fetch: cmdFetch, build: cmdBuild, probe: cmdProbe, report: cmdReport, score: cmdScore, "verify-queue": cmdVerifyQueue, "apply-verify": cmdApplyVerify, "apply-capacity": cmdApplyCapacity };
if (!cmds[arg]) { console.log("usage: source-targets.mjs fetch|build|probe|report"); process.exit(1); }
await cmds[arg]();
