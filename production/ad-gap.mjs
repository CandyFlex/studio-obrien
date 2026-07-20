#!/usr/bin/env node
/*
  ad-gap.mjs - Pass 1 niche verifier for the Ad-Spend / Organic Gap strategy.

  What it does: runs ONE batched Apify call per NICHE (not per keyword),
  then per keyword reports paid/ad slots, local-pack occupancy, directory
  dominance in the top-5 organic, and whether any advertiser also owns a
  top-10 organic slot. Computes a gapScore, a per-niche aggregate, and a
  Pass 1 verdict (does Route A apply for this niche in this area?).

  Reuses the same Apify actor as serp-track.mjs (apify~google-search-scraper).
  Auth: same token ($APIFY_TOKEN or ~/.config/studioobrien/apify-token.txt).
  Cost: one batched run per niche, ~$0.50/niche, ~$3.00 total for 6 niches.

  Outputs:
    production/ad-gap-snapshots/<niche>-<date>.json   (raw + scored per niche)
    production/ad-gap-snapshots/pass1-shelby-<date>.md (human report, all niches ranked)

  CLI:
    node production/ad-gap.mjs                    scrape every niche (default)
    node production/ad-gap.mjs --only <niche>     scrape only one niche
    node production/ad-gap.mjs --from-raw <path> --only <niche>
                                                 process a saved raw scrape
                                                 (skip Apify; reuse the items
                                                 you already pulled)
    node production/ad-gap.mjs --report           skip scraping; rebuild the
                                                 pass1-shelby-<date>.md report
                                                 from the niche JSONs on disk
*/
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ACTOR = 'apify~google-search-scraper';
const HERE = dirname(fileURLToPath(import.meta.url));
const SNAP_DIR = join(HERE, 'ad-gap-snapshots');

// Directory / aggregator domains - same list as seo-opportunities.mjs.
// When these dominate the top-5 organic, real local competitors are absent.
const DIRECTORIES = [
  'yelp.com','m.yelp.com','thumbtack.com','facebook.com','reddit.com','clutch.co',
  'designrush.com','bbb.org','nextdoor.com','angi.com','youtube.com','pinterest.com',
  'mapquest.com','expertise.com','yellowpages.com','yp.com','foursquare.com',
  'sites.google.com','linkedin.com','indeed.com','ziprecruiter.com','google.com',
  'agencies.semrush.com','techbehemoths.com','appnet.com','pandia.com','ahmeego.com',
  'foodhubforbusiness.com','straightnorth.com','freshysites.com','wordjack.com',
];

// Candidate niches and their Shelby-area money keyword sets.
// Explicit-geo terms work without UULE (same as serp-track.mjs KEYWORDS).
const NICHES = [
  { niche: 'roofing-contractor', keywords: [
    'roofing shelby nc', 'roofing contractor shelby nc', 'roof repair shelby nc',
    'roofing kings mountain nc', 'roofing boiling springs nc',
  ]},
  { niche: 'hvac', keywords: [
    'hvac shelby nc', 'hvac contractor shelby nc', 'ac repair shelby nc',
    'hvac cleveland county nc',
  ]},
  { niche: 'auto-repair', keywords: [
    'auto repair shelby nc', 'mechanic shelby nc', 'auto repair kings mountain nc',
    'car repair shelby nc',
  ]},
  { niche: 'salon-spa', keywords: [
    'salon shelby nc', 'hair salon shelby nc', 'barber shelby nc', 'spa shelby nc',
  ]},
  { niche: 'landscaping-lawn', keywords: [
    'landscaping shelby nc', 'lawn care shelby nc', 'landscaper cleveland county nc',
  ]},
  { niche: 'law-professional', keywords: [
    'lawyer shelby nc', 'law firm shelby nc', 'cpa shelby nc', 'accounting shelby nc',
  ]},
];

// Pass 1 thresholds. A niche passes Route A when both are met.
const WEAK_THRESHOLD = 0.6;   // >=60% of queries grade WEAK (>=3 of top-5 dirs)
const ADSAT_THRESHOLD = 0.6;  // >=60% of queries have >=2 paid slots

function getToken() {
  if (process.env.APIFY_TOKEN) return process.env.APIFY_TOKEN.trim();
  const p = join(homedir(), '.config', 'studioobrien', 'apify-token.txt');
  try { return readFileSync(p, 'utf8').trim(); }
  catch {
    console.error('No Apify token. Set $APIFY_TOKEN or create ' + p +
      '\nGet one: Apify Console -> Settings -> Integrations -> Personal API tokens.');
    process.exit(1);
  }
}

const domainOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
};

const isDirectory = (d) => DIRECTORIES.includes(d);

// Per-keyword competition grade: top-5 organic directories present.
// WEAK (>=3 dirs), MEDIUM (2), STRONG (<=1). Same shape as seo-opportunities.mjs.
function gradeCompetition(top10) {
  const top5 = top10.slice(0, 5);
  const dirs = top5.filter((r) => isDirectory(r.domain)).length;
  const grade = dirs >= 3 ? 'WEAK' : dirs === 2 ? 'MEDIUM' : 'STRONG';
  return { dirs, grade };
}

// Local-pack presence: actor returns local pack as a separate field if present.
// Field names vary; we try all known shapes. Returns count of pack slots (0-3).
function localPackCount(item) {
  if (item.localPack) return Array.isArray(item.localPack) ? item.localPack.length : 3;
  if (item.localBusinesses) return Array.isArray(item.localBusinesses) ? item.localBusinesses.length : 3;
  if (item.mapResults) return Array.isArray(item.mapResults) ? item.mapResults.length : 3;
  if (item.localReviews) return Array.isArray(item.localReviews) ? item.localReviews.length : 3;
  // Actor sometimes embeds under relatedMatches.images or places. Conservative fallback.
  return 0;
}

// Paid slots present in the SERP. The actor returns paid results under
// different field names across versions; try all known shapes.
function paidResults(item) {
  if (item.paidResults && item.paidResults.length) return item.paidResults;
  if (item.ads && item.ads.length) return item.ads;
  if (item.sponsoredResults && item.sponsoredResults.length) return item.sponsoredResults;
  if (item.paidOrganicResults && item.paidOrganicResults.length) return item.paidOrganicResults;
  return [];
}

// Run one batched Apify call per niche. Same shape as serp-track.mjs:
// single POST with all queries joined, maxPagesPerQuery=2 (top ~20).
async function scrapeNiche(token, niche) {
  const input = {
    queries: niche.keywords.join('\n'),
    countryCode: 'us',
    languageCode: 'en',
    maxPagesPerQuery: 2,
    mobileResults: false,
  };
  const url = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${token}`;
  console.log(`  niche "${niche.niche}": ${niche.keywords.length} kw x ${2} pages (~$0.50)...`);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`  Apify error ${res.status}: ${body.slice(0, 300)}`);
    return null;
  }
  return await res.json();
}

// Process raw Apify items into the standard niche report object.
// Used for both fresh scrapes and saved raw files; single source of truth.
function processNiche(niche, items, date) {
  // Group pages by query term, concat organic in page order.
  // Also accumulate People Also Ask + related queries (for DR dimension)
  // and paid results per term. Original Pass 1 dropped PAA/relatedQueries;
  // the cross-reference needs them for Demand Richness scoring.
  const byTerm = new Map();
  for (const it of items) {
    const term = (it.searchQuery && it.searchQuery.term) || '(unknown)';
    if (!byTerm.has(term)) byTerm.set(term, { organic: [], paid: [], localPack: 0, paa: [], related: [] });
    const g = byTerm.get(term);
    for (const o of it.organicResults || []) g.organic.push(o);
    g.paid.push(...paidResults(it));
    g.localPack = Math.max(g.localPack, localPackCount(it));
    for (const q of it.peopleAlsoAsk || []) g.paa.push(q.question || q.title || q.text);
    for (const r of it.relatedQueries || []) g.related.push(r.title || r);
  }

  const perKeyword = [];
  for (const term of niche.keywords) {
    const g = byTerm.get(term);
    if (!g) { perKeyword.push({ term, missing: true }); continue; }

    const top30 = g.organic.slice(0, 30).map((o) => ({
      pos: o.position, domain: domainOf(o.url), url: o.url,
    }));
    const top10 = top30.slice(0, 10);
    const { dirs, grade } = gradeCompetition(top10);
    const paidCount = g.paid.length;
    const localPackFull = g.localPack >= 3;
    const top10Domains = new Set(top10.map((r) => r.domain));
    const paidDomains = [...new Set(g.paid.map((p) => domainOf(p.url || p.link || '')))];
    const advertiserAlsoOrganic = paidDomains.some((d) => top10Domains.has(d));

    const dirFactor = (5 - dirs);
    const packFactor = localPackFull ? 1.4 : 1;
    const bleedFactor = paidCount;
    const ownFactor = advertiserAlsoOrganic ? 0.2 : 1;
    const gapScore = dirFactor * packFactor * bleedFactor * ownFactor;

    perKeyword.push({
      term,
      paidCount,
      paidDomains,
      localPackSlots: g.localPack,
      localPackFull,
      competition: { dirs, grade },
      advertiserAlsoOrganic,
      top10,
      // Demand Richness inputs (Section 12 cross-reference strategy):
      // preserve People Also Ask questions and related queries verbatim.
      peopleAlsoAsk: [...new Set(g.paa)],
      relatedQueries: [...new Set(g.related)],
      gapScore,
    });
  }

  const valid = perKeyword.filter((k) => !k.missing);
  const total = valid.length;
  const weakCount = valid.filter((k) => k.competition.grade === 'WEAK').length;
  const adsatCount = valid.filter((k) => k.paidCount >= 2).length;
  const pctWeak = total ? weakCount / total : 0;
  const pctAdSat = total ? adsatCount / total : 0;
  const meanAdSlots = total ? valid.reduce((s, k) => s + k.paidCount, 0) / total : 0;
  const meanGapScore = total ? valid.reduce((s, k) => s + (k.gapScore || 0), 0) / total : 0;
  const passed = pctWeak >= WEAK_THRESHOLD && pctAdSat >= ADSAT_THRESHOLD;

  return {
    niche: niche.niche,
    date,
    keywords: niche.keywords,
    perKeyword,
    aggregate: {
      total, weakCount, adsatCount, pctWeak, pctAdSat,
      meanAdSlots, meanGapScore, passed,
    },
  };
}

// Build the human-readable Pass 1 markdown report from a list of niche reports.
function buildMarkdownReport(allNicheReports, date) {
  const passing = allNicheReports.filter((r) => r.aggregate && r.aggregate.passed);
  const failing = allNicheReports.filter((r) => r.aggregate && !r.aggregate.passed);
  const errors = allNicheReports.filter((r) => r.error);

  const md = [];
  md.push(`# Pass 1 Niche Scan - Shelby area - ${date}`);
  md.push(`\nGenerated by \`production/ad-gap.mjs\` from fresh Apify SERP scrapes. ` +
    `Pass 1 criteria: >=60% of queries grade WEAK on competition (>=3 of top-5 organic are directories/aggregators) AND >=60% of queries have >=2 paid slots. ` +
    `Evidence is the SERP the prospect's customers see. No private data.\n`);

  md.push(`## Verdict by niche (ranked by mean gapScore)\n`);
  const ranked = [...allNicheReports].filter((r) => r.aggregate).sort((a, b) =>
    b.aggregate.meanGapScore - a.aggregate.meanGapScore);
  md.push(`| Rank | Niche | %WEAK | %Ad-sat | Mean ad slots | Mean gapScore | Verdict |`);
  md.push(`|---|---|---|---|---|---|---|`);
  ranked.forEach((r, i) => {
    const a = r.aggregate;
    md.push(`${i + 1}. | ${r.niche} | ${Math.round(a.pctWeak * 100)}% | ${Math.round(a.pctAdSat * 100)}% | ${
      a.meanAdSlots.toFixed(1)} | ${a.meanGapScore.toFixed(1)} | ${a.passed ? '**PASS**' : 'FAIL'}`);
  });
  md.push(``);

  if (passing.length) {
    md.push(`## Niches that PASS - Route A applies\n`);
    md.push(`These niches are underserved organically AND ad-saturated. The gap strategy opens with a one-page SERP read; the call does not pitch.\n`);
    for (const r of passing) {
      md.push(`### ${r.niche} - mean gapScore ${r.aggregate.meanGapScore.toFixed(1)}\n`);
      md.push(`Per keyword:`);
      md.push(`| Keyword | Ad slots | Local pack | Comp grade | Top-5 directories | Advertiser also organic? | gapScore |`);
      md.push(`|---|---|---|---|---|---|---|`);
      for (const k of r.perKeyword) {
        if (k.missing) { md.push(`| ${k.term} | (no data) | - | - | - | - | - |`); continue; }
        const top5dirs = k.top10.slice(0, 5).map((t) => t.domain).filter(isDirectory);
        md.push(`| ${k.term} | ${k.paidCount} | ${k.localPackSlots}${k.localPackFull ? ' (full)' : ''} | ${
          k.competition.grade} (${k.competition.dirs}/5 dirs) | ${top5dirs.join(', ') || '(none)'} | ${
          k.advertiserAlsoOrganic ? 'YES' : 'no'} | ${k.gapScore.toFixed(1)} |`);
      }
      md.push(``);
    }
  } else {
    md.push(`## No niches passed Pass 1\n`);
    md.push(`If this is a small local market, this is plausible. Route A is closed; Route B sub-paths apply (portfolio archetypes, Storefront, calculator, inbound, referral) for these same niches.\n`);
  }

  if (failing.length) {
    md.push(`## Niches that FAILED - Route A does not apply\n`);
    for (const r of failing) {
      const a = r.aggregate;
      const reasons = [];
      if (a.pctWeak < WEAK_THRESHOLD) reasons.push(`too few WEAK queries (${Math.round(a.pctWeak * 100)}% < 60%)`);
      if (a.pctAdSat < ADSAT_THRESHOLD) reasons.push(`too little ad saturation (${Math.round(a.pctAdSat * 100)}% < 60%)`);
      md.push(`- **${r.niche}** - mean gapScore ${a.meanGapScore.toFixed(1)} - fails because: ${reasons.join('; ')}`);
    }
    md.push(``);
  }

  if (errors.length) {
    md.push(`## Errored (Apify call failed)\n`);
    for (const r of errors) md.push(`- **${r.niche}** - ${r.error}`);
    md.push(``);
  }

  md.push(`## What to do next\n`);
  if (passing.length) {
    md.push(`1. Pick the top-ranked passing niche.`);
    md.push(`2. Run Pass 2 against it: per advertiser in the paid slots, check whether they also own a top-30 organic slot across the niche's keyword set. Those who don't = Prospective Gap Targets.`);
    md.push(`3. Build a Gap Read per target (serp-brief.mjs from the target keyword + manual GBP/site check). Send the permission-gated email. The call does not pitch.`);
    md.push(`4. Quarterly rerun pass1 \`node production/ad-gap.mjs\` to confirm the gap still exists before re-pitching.`);
  } else {
    md.push(`1. Use Route B sub-paths (portfolio archetypes, Storefront Project, cost calculator, inbound via blog, referrals) for the same niches.`);
    md.push(`2. Quarterly rerun \`node production/ad-gap.mjs\` - niches that fail today may pass after competitor movement.`);
  }

  return md.join('\n') + '\n';
}

(async () => {
  if (!existsSync(SNAP_DIR)) mkdirSync(SNAP_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);

  // CLI flags.
  const args = process.argv.slice(2);
  const onlyIdx = args.indexOf('--only');
  const onlyNiche = onlyIdx > -1 ? args[onlyIdx + 1] : null;
  const rawIdx = args.indexOf('--from-raw');
  const rawPath = rawIdx > -1 ? args[rawIdx + 1] : null;
  const reportOnly = args.includes('--report');

  // --report: skip scraping, rebuild markdown from existing niche JSONs.
  if (reportOnly) {
    const files = readdirSync(SNAP_DIR).filter((f) => /^[a-z-]+-\d{4}-\d{2}-\d{2}\.json$/.test(f));
    const byNiche = new Map();
    for (const f of files) {
      const m = f.match(/^(.+)-(\d{4}-\d{2}-\d{2})\.json$/);
      if (!m) continue;
      const data = JSON.parse(readFileSync(join(SNAP_DIR, f), 'utf8'));
      // Prefer latest date per niche.
      if (!byNiche.has(m[1]) || byNiche.get(m[1]).date < m[2]) byNiche.set(m[1], data);
    }
    const reports = [...byNiche.values()];
    const outMd = join(SNAP_DIR, `pass1-shelby-${date}.md`);
    writeFileSync(outMd, buildMarkdownReport(reports, date));
    console.log(`Report rebuilt from ${reports.length} niche JSONs: ${outMd}`);
    return;
  }

  const token = getToken();
  const targets = onlyNiche ? NICHES.filter((n) => n.niche === onlyNiche) : NICHES;
  if (!targets.length) { console.error(`No niche named "${onlyNiche}". Options: ${NICHES.map((n) => n.niche).join(', ')}`); process.exit(1); }

  console.log(`Pass 1 niche scan - Shelby area - ${date}\n`);

  const allNicheReports = [];

  for (const niche of targets) {
    let items;
    if (rawPath) {
      console.log(`  niche "${niche.niche}": loading raw scrape from ${rawPath}`);
      items = JSON.parse(readFileSync(rawPath, 'utf8'));
    } else {
      items = await scrapeNiche(token, niche);
    }
    if (!items) {
      allNicheReports.push({ niche: niche.niche, error: 'Apify error' });
      continue;
    }

    const report = processNiche(niche, items, date);
    const outJson = join(SNAP_DIR, `${niche.niche}-${date}.json`);
    writeFileSync(outJson, JSON.stringify(report, null, 2));

    const a = report.aggregate;
    console.log(`    ${a.total}/${niche.keywords.length} returned | weak ${Math.round(a.pctWeak * 100)}% | adsat ${
      Math.round(a.pctAdSat * 100)}% | mean ad slots ${a.meanAdSlots.toFixed(1)} | mean gap ${a.meanGapScore.toFixed(1)} | ${
      a.passed ? 'PASS' : 'FAIL'}`);

    allNicheReports.push(report);
  }

  // When only one niche was scraped, do not rebuild the full report here.
  // Run --report afterwards to assemble the cross-niche markdown.
  if (!onlyNiche) {
    const outMd = join(SNAP_DIR, `pass1-shelby-${date}.md`);
    writeFileSync(outMd, buildMarkdownReport(allNicheReports, date));
    console.log(`\nSaved: ${outMd}`);
  }
  console.log(`Raw per-niche JSON in: ${SNAP_DIR}`);
  const passing = allNicheReports.filter((r) => r.aggregate && r.aggregate.passed).length;
  console.log(`Passing niches in this run: ${passing}/${allNicheReports.filter((r) => r.aggregate).length}`);
})().catch((e) => { console.error('FATAL', e.message, e.stack); process.exit(1); });