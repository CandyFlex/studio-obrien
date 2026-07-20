#!/usr/bin/env node
/*
  ad-xref.mjs - Cross-reference analysis across niches for the Ad-Spend /
  Organic Gap strategy. Section 12 of strategy-notes.md.

  PURPOSE: Pass 1 tested 6 niches INDEPENDENTLY on a 2-axis score
  (ad saturation x organic weakness). When ad saturation returned zero on
  every niche, every test failed. Cross-reference tests 5 niches TOGETHER
  on a wider set of SERP-shape metrics and finds the niche whose SHAPE
  differs from the others in our favor.

  Runs entirely on cached per-niche JSONs in ad-gap-snapshots/. Zero
  Apify spend. The script reads what ad-gap.mjs already scraped and
  preserved (including PAA + relatedQueries, added 2026-07-09).

  Four dimensions per niche (no composite weighting; matrix is the output):
    DD  Directory Dominance   % of keywords grading WEAK on competition
    SA  Specialist Absence    10 - mean(real specialist count in top-10)
    DR  Demand Richness       mean(PAA + relatedQueries count per keyword)
    CNAF Cross-Niche Frequency count of top-10 domains appearing in 2+ niches

  Scatter: X = SA (thin specialist competition), Y = DR (people searching).
  Top-right quadrant = the gap: high demand, weak specialist presence.

  Outputs:
    production/ad-gap-snapshots/xref-<date>.json
    production/ad-gap-snapshots/xref-<date>.md

  CLI:
    node production/ad-xref.mjs                    use latest per-niche JSONs
    node production/ad-xref.mjs --date 2026-07-09  pin to a specific snapshot date
*/
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SNAP_DIR = join(HERE, 'ad-gap-snapshots');

// Same DIRECTORIES list as ad-gap.mjs plus seo-opportunities.mjs.
const DIRECTORIES = [
  'yelp.com','m.yelp.com','thumbtack.com','facebook.com','reddit.com','clutch.co',
  'designrush.com','bbb.org','nextdoor.com','angi.com','youtube.com','pinterest.com',
  'mapquest.com','expertise.com','yellowpages.com','yp.com','foursquare.com',
  'sites.google.com','linkedin.com','indeed.com','ziprecruiter.com','google.com',
  'agencies.semrush.com','techbehemoths.com','appnet.com','pandia.com','ahmeego.com',
  'foodhubforbusiness.com','straightnorth.com','freshysites.com','wordjack.com',
  'manta.com','homeadvisor.com','instagram.com','tiktok.com','x.com','twitter.com',
];

// National aggregators and manufacturer-locator pages that surface in
// niche SERPs but are NOT real local specialists. They pollute the
// organic results the same way directories do; counting them as
// "specialists" would inflate the SA-competition signal falsely.
// Per constitution: fix root cause. Two bugs found during HVAC plan
// prep: homedepot.com and trane.com were missing from this list, which
// caused the HVAC cross-reference SA score to be understated. Fixed
// 2026-07-09 by adding the national-retailer / HVAC manufacturer
// dealer-locator domain set.
const AGGREGATORS = [
  // Manufacturer / dealer-locator pages (HVAC and adjacent)
  'gaf.com','owenscorning.com','icoating.com','certainteed.com',
  'trane.com','carrier.com','lennox.com','rheem.com','goodmanmfg.com',
  'americanstandardair.com','dalehvac.com','bryant.com','payne.com',
  // National retailer contractor-referral pages
  'homedepot.com','lowes.com','menards.com','acehardware.com',
  // General aggregator / directory-adjacent (original list kept)
  'truenorthcompanies.com','nflpa.com','clevelandcc.edu','ncpedia.org',
  'chooseclevelandcountync.com','business.clevelandcountychamber.org',
  'toucandesign.net','webdesigncharlotte.net','50creativesolutions.com',
  'visualbrandingagency.com','mybrandingagency.com','designrush.com',
  'localseodirectors.com','southstreetmarketing.com','epitomedigitalmarketing.com',
  'getyoufound.com','ezmarketing.com','losthighwaymedia.com','moonray.net',
  'moonraywebdesign.com','chadaustin.com','thinkdesignsllc.com','anaxdesigns.com',
  'websymphonies.com','integrisdesign.com','lazaruscharlotte.com','bellaworksweb.com',
  'charlottewebdesignstudio.com','wordpress-web-designer-raleigh.com',
  'thriveagency.com','medesignlab.com','hickorytradewebdesign.com',
  'maidenwebdesign.com','lincolntonwebdesign.com','shelbydesign.co',
  'broadrivermedia.com','jessicaleighwebdesign.com','theimageadjusters.com',
  'nextwaveservices.com','dragonflymarketing.cc','studiosbydave.com',
  'michellejonescreative.com','79design.org.uk','yellowfin.agency',
  'visionsharp.co.uk','56degrees.co.uk','upmenu.com','wordjack.com',
  'mechroofandgutter.com',
];

// Canonical niche names - mirrors the NICHES list in ad-gap.mjs.
// Using an allowlist here rather than a regex pattern is the root-cause
// fix: the previous regex /^[a-z-]+-YYYY-MM-DD\.json$/ also matched
// report files like xref-YYYY-MM-DD.json and pass1-shelby-YYYY-MM-DD.md.
// An explicit niche allowlist guarantees only per-niche scrape JSONs
// are loaded and is robust to future report/pipeline file naming.
const NICHE_NAMES = [
  'roofing-contractor','hvac','auto-repair',
  'salon-spa','landscaping-lawn','law-professional',
];

// Drop these niches from cross-reference per section 12 decision:
// law-professional has 0% WEAK + real specialists own top-5, lowest
// cross-niche value because lawyers don't span niches.
const DROP_NICHES = ['law-professional'];

const args = process.argv.slice(2);
const dateIdx = args.indexOf('--date');
const pinnedDate = dateIdx > -1 ? args[dateIdx + 1] : null;

function loadNicheReports() {
  if (!existsSync(SNAP_DIR)) return [];
  const byNiche = new Map();
  for (const name of NICHE_NAMES) {
    if (DROP_NICHES.includes(name)) continue;
    // Find files matching this exact niche name and date pattern.
    const files = readdirSync(SNAP_DIR).filter((f) =>
      f.startsWith(name + '-') && f.endsWith('.json') &&
      new RegExp(`^${name}-(\\d{4}-\\d{2}-\\d{2})\\.json$`).test(f));
    if (!files.length) continue;
    // Sort by date descending; pick latest, or pin to pinnedDate if given.
    files.sort().reverse();
    let chosen;
    if (pinnedDate) {
      chosen = files.find((f) => f.includes(`-${pinnedDate}.json`));
      if (!chosen) continue;
    } else {
      chosen = files[0];
    }
    const data = JSON.parse(readFileSync(join(SNAP_DIR, chosen), 'utf8'));
    byNiche.set(name, data);
  }
  return [...byNiche.values()];
}

// Classify a domain as a real local specialist (true) or
// directory/aggregator/social (false). Specialist = any top-10 organic
// domain that is not classified as a directory, aggregator, or social.
function isSpecialist(domain) {
  if (DIRECTORIES.includes(domain)) return false;
  if (AGGREGATORS.includes(domain)) return false;
  return true;
}

// Per-niche four-dimension scores.
function scoreNiche(report) {
  const valid = report.perKeyword.filter((k) => !k.missing);
  const total = valid.length;
  if (!total) return null;

  // DD: % of keywords grading WEAK on competition.
  // Re-derived from perKeyword for consistency with the SERP actually
  // scored (the cached aggregate.pctWeak may come from a different scrape).
  const weakCount = valid.filter((k) => k.competition.grade === 'WEAK').length;
  const DD = weakCount / total;

  // SA: depth of specialist absence. For each keyword count top-10
  // results classified as specialists; SA = 10 - mean(specialist count).
  // Higher SA = thinner real competition in the organic SERP.
  const meanSpecialists = valid.reduce((s, k) => {
    const spec = (k.top10 || []).filter((r) => isSpecialist(r.domain)).length;
    return s + spec;
  }, 0) / total;
  const SA = 10 - meanSpecialists;

  // DR: mean(PAA + relatedQueries count per keyword). Higher DR = more
  // active search demand around this niche.
  const DR = valid.reduce((s, k) => {
    const paa = (k.peopleAlsoAsk || []).length;
    const related = (k.relatedQueries || []).length;
    return s + paa + related;
  }, 0) / total;

  return { DD, SA, DR };
}

function buildXref(reports) {
  const scored = reports.map((r) => {
    const sc = scoreNiche(r);
    if (!sc) return null;
    return {
      niche: r.niche,
      date: r.date,
      keywordCount: r.aggregate.total,
      ...sc,
      // CNAF filled in second pass after we have all niche domain sets.
      domainSet: new Set(
        r.perKeyword
          .filter((k) => !k.missing)
          .flatMap((k) => (k.top10 || []).map((t) => t.domain))
      ),
    };
  }).filter(Boolean);

  // CNAF: for each niche, count how many of its top-10 SPECIALIST
  // domains (real local businesses, not directories/aggregators/social)
  // ALSO appear in 2+ niches' top-10. Higher CNAF = more multi-niche
  // businesses (one pitch multiplies value, per section 12 plan).
  // Per constitution: directories overlapping across niches is meaningless -
  // every SERP has Yelp; that does not make the SERP an outreach opportunity.
  const domainToNiches = new Map();
  for (const s of scored) {
    for (const d of s.domainSet) {
      // Skip directories/aggregators/social: per section 12 plan,
      // cross-niche targets must be real businesses spanning niches.
      if (!isSpecialist(d)) continue;
      if (!domainToNiches.has(d)) domainToNiches.set(d, new Set());
      domainToNiches.get(d).add(s.niche);
    }
  }
  const crossNicheDomains = new Set();
  const crossNicheList = [];
  for (const [d, set] of domainToNiches) {
    if (set.size >= 2) {
      crossNicheDomains.add(d);
      crossNicheList.push({ domain: d, niches: [...set], count: set.size });
    }
  }
  for (const s of scored) {
    let cnt = 0;
    for (const d of s.domainSet) if (crossNicheDomains.has(d)) cnt++;
    s.CNAF = cnt;
  }

  // Sort cross-niche domains by count desc, then alphabetically.
  crossNicheList.sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain));

  return { scored, crossNicheList };
}

function buildMarkdown(scored, crossNicheList, date) {
  const md = [];
  md.push(`# Cross-Reference Analysis - Shelby area - ${date}`);
  md.push(`\nGenerated by \`production/ad-xref.mjs\` from cached niche JSONs in ` +
    `\`production/ad-gap-snapshots/\`. Zero Apify spend. Four dimensions ` +
    `computed per niche; the matrix is the output, not a composite verdict.\n`);

  md.push(`## The four dimensions\n`);
  md.push(`- **DD** Directory Dominance - % of keywords grading WEAK (>=3 of top-5 organic are directories/aggregators). Higher = bigger opportunity to displace.`);
  md.push(`- **SA** Specialist Absence - 10 - mean(real local specialist count in top-10). Higher = thinner real competition.`);
  md.push(`- **DR** Demand Richness - mean(PAA + relatedQueries per keyword). Higher = more active search demand.`);
  md.push(`- **CNAF** Cross-Niche Advertiser Frequency - count of this niche's top-10 domains that also appear in 2+ niches' top-10. Higher = more multi-niche prospects (one pitch multiplies).\n`);

  md.push(`## The matrix\n`);
  md.push(`| Niche | KWs | DD | SA | DR | CNAF |`);
  md.push(`|---|---|---|---|---|---|`);
  // Sort by SA desc then DR desc for the table (top-right first).
  const sorted = [...scored].sort((a, b) => b.SA - a.SA || b.DR - a.DR);
  for (const s of sorted) {
    md.push(`| ${s.niche} | ${s.keywordCount} | ${s.DD.toFixed(2)} | ${s.SA.toFixed(2)} | ${s.DR.toFixed(1)} | ${s.CNAF} |`);
  }
  md.push(``);

  md.push(`## The scatter (SA x DR)\n`);
  md.push(`X axis = SA (Specialist Absence). Y axis = DR (Demand Richness).`);
  md.push(`Top-right quadrant = high demand, weak specialist presence = the gap.`);
  md.push(`Top-left = high demand, strong specialists (different play: archetype).`);
  md.push(`Bottom-right = low demand, weak specialists (outbound only).`);
  md.push(`Bottom-left = closed.\n`);

  // Compute medians for quadrant split.
  const saValues = scored.map((s) => s.SA).sort((a, b) => a - b);
  const drValues = scored.map((s) => s.DR).sort((a, b) => a - b);
  const median = (arr) => arr.length % 2
    ? arr[Math.floor(arr.length / 2)]
    : (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2;
  const saMed = median(saValues);
  const drMed = median(drValues);
  md.push(`Median SA = ${saMed.toFixed(2)} ; Median DR = ${drMed.toFixed(1)}.\n`);
  md.push(`| Quadrant | Niche | Notes |`);
  md.push(`|---|---|---|`);
  for (const s of scored) {
    let q = '';
    if (s.SA >= saMed && s.DR >= drMed) q = '**TOP-RIGHT** (the gap)';
    else if (s.SA < saMed && s.DR >= drMed) q = 'TOP-LEFT (archetype route)';
    else if (s.SA >= saMed && s.DR < drMed) q = 'BOTTOM-RIGHT (outbound only)';
    else q = 'BOTTOM-LEFT (closed)';
    md.push(`| ${q} | ${s.niche} (SA ${s.SA.toFixed(2)}, DR ${s.DR.toFixed(1)}) | DD ${s.DD.toFixed(2)}, CNAF ${s.CNAF} |`);
  }
  md.push(``);

  md.push(`## Cross-niche domains (multi-niche Prospective Gap Targets)\n`);
  md.push(`Domains appearing in 2+ niche top-10 organic results. ` +
    `One pitch can talk to multiple revenue streams. Filtered to drop ` +
    `directories/aggregators; only real business domains listed.\n`);
  if (!crossNicheList.length) {
    md.push(`_(no cross-niche domains found in this snapshot set)_\n`);
  } else {
    md.push(`| Domain | Niches | Count |`);
    md.push(`|---|---|---|`);
    for (const c of crossNicheList) {
      md.push(`| ${c.domain} | ${c.niches.join(', ')} | ${c.count} |`);
    }
    md.push(``);
  }

  md.push(`## Interpretation guidance\n`);
  md.push(`1. The matrix is the output, not a verdict. Pick the niche whose shape fits the play.`);
  md.push(`2. TOP-RIGHT quadrant niche = Route A applies with the specialist-absence gap read ("stop subsidizing Yelp").`);
  md.push(`3. TOP-LEFT quadrant niche = Route B1 archetype route (show what better looks like).`);
  md.push(`4. CNAF > 0 cross-niche domains get higher priority on the outreach list (one pitch multiplies value).`);
  md.push(`5. Filter by DD >= 0.30 if you want only niches with thick directory layer. Niches below DD 0.30 have a different gap shape (specialist-led, not directory-led).`);
  md.push(`6. DR is per-keyword density. A niche with low DR can still be a gap if SA is high - demand exists, just not in question-form yet.`);

  return md.join('\n') + '\n';
}

(async () => {
  const reports = loadNicheReports();
  if (reports.length < 2) {
    console.error(`Need >=2 niche JSONs to cross-reference. Found ${reports.length}.`);
    console.error(`Run \`node production/ad-gap.mjs\` for each target niche first.`);
    process.exit(1);
  }
  const date = pinnedDate || reports[0].date;
  console.log(`Cross-reference across ${reports.length} niches (date ${date}).\n`);

  const { scored, crossNicheList } = buildXref(reports);

  // Console summary.
  console.log(`Niche | DD  | SA  | DR  | CNAF`);
  console.log(`------|-----|-----|-----|-----`);
  for (const s of [...scored].sort((a, b) => b.SA - a.SA || b.DR - a.DR)) {
    console.log(`${s.niche.padEnd(20)} | ${s.DD.toFixed(2)} | ${s.SA.toFixed(2)} | ${s.DR.toFixed(1)} | ${s.CNAF}`);
  }
  console.log(`\nCross-niche domains (appear in 2+ niches): ${crossNicheList.length}`);

  const md = buildMarkdown(scored, crossNicheList, date);
  const outMd = join(SNAP_DIR, `xref-${date}.md`);
  writeFileSync(outMd, md);

  const outJson = join(SNAP_DIR, `xref-${date}.json`);
  writeFileSync(outJson, JSON.stringify({
    date,
    scored: scored.map(({ domainSet, ...rest }) => rest),
    crossNicheList,
  }, null, 2));

  console.log(`\nSaved: ${outMd}`);
  console.log(`Saved: ${outJson}`);
})().catch((e) => { console.error('FATAL', e.message, e.stack); process.exit(1); });