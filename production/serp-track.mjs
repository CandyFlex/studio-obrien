#!/usr/bin/env node
/*
  serp-track.mjs — weekly local SERP snapshot for studioobrien.com via the
  Apify "Google Search Results Scraper" (apify/google-search-scraper).

  What it does: runs ONE batched Apify run for all KEYWORDS below, then reports
  per keyword: our rank (if in top ~30), the competitors above us, People Also
  Ask + Related Queries (content ideas), and whether an AI overview showed.
  Saves a timestamped JSON snapshot so week-over-week movement is diffable.

  WHY batch: the actor charges a $0.50 MINIMUM per run. One run with many
  queries costs ~$0.50; one run PER keyword would cost 0.50 x N. Never loop.

  Auth: Apify API token in $APIFY_TOKEN or ~/.config/studioobrien/apify-token.txt
  Get one at: Apify Console -> Settings -> Integrations -> Personal API tokens.

  Run: node production/serp-track.mjs
       node production/serp-track.mjs --pages 3   (top ~30; default 3)
*/
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET = 'studioobrien.com';
const ACTOR = 'apify~google-search-scraper';
const HERE = dirname(fileURLToPath(import.meta.url));
const SNAP_DIR = join(HERE, 'serp-snapshots');

// Money keywords — explicit-geo terms work without UULE (town is in the query).
// For implicit "near me" terms, set a locationUule below (see NOTE).
const KEYWORDS = [
  'web design shelby nc',
  'web designer shelby nc',
  'website design shelby nc',
  'web design cleveland county nc',
  'web design gastonia nc',
  'web design hickory nc',
  'web design kings mountain nc',
  'web design lincolnton nc',
  'web design charlotte nc',
  'small business website designer nc',
  'restaurant website designer nc',
  'local seo shelby nc',
];

// NOTE: to simulate a searcher physically in Shelby (needed for "web designer
// near me" style implicit-local queries), generate a UULE code for
// "Shelby,North Carolina,United States" at https://padavvan.github.io/ and
// paste it here. Leave '' to skip (fine for the explicit-geo keywords above).
const LOCATION_UULE = '';

const pagesArg = process.argv.indexOf('--pages');
const MAX_PAGES = pagesArg > -1 ? Number(process.argv[pagesArg + 1]) : 3;

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

const domainOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };

(async () => {
  const token = getToken();
  const input = {
    queries: KEYWORDS.join('\n'),
    countryCode: 'us',
    languageCode: 'en',
    maxPagesPerQuery: MAX_PAGES,
    mobileResults: false,
    ...(LOCATION_UULE ? { locationUule: LOCATION_UULE } : {}),
  };

  console.log(`Running Apify SERP scrape: ${KEYWORDS.length} keywords x ${MAX_PAGES} pages (batched, ~$0.50)...`);
  const url = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${token}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    console.error(`Apify error ${res.status}: ${(await res.text()).slice(0, 300)}`);
    process.exit(1);
  }
  const items = await res.json(); // one item per query page

  // Group pages by query term, concat organic results in page order.
  const byTerm = new Map();
  for (const it of items) {
    const term = (it.searchQuery && it.searchQuery.term) || '(unknown)';
    if (!byTerm.has(term)) byTerm.set(term, { organic: [], paa: [], related: [], ai: false });
    const g = byTerm.get(term);
    for (const o of it.organicResults || []) g.organic.push(o);
    for (const q of it.peopleAlsoAsk || []) g.paa.push(q.question || q.title || q.text);
    for (const r of it.relatedQueries || []) g.related.push(r.title);
    if (it.aiModeResult || it.aiOverview) g.ai = true;
  }

  const report = [];
  console.log('\n================ SERP SNAPSHOT ================\n');
  for (const term of KEYWORDS) {
    const g = byTerm.get(term);
    if (!g) { console.log(`? ${term}\n   (no data returned)\n`); continue; }
    // absolute rank = index in concatenated organic list
    let ourRank = null, ourUrl = null;
    g.organic.forEach((o, i) => {
      if (ourRank === null && domainOf(o.url) === TARGET) { ourRank = i + 1; ourUrl = o.url; }
    });
    const top5 = g.organic.slice(0, 5).map((o, i) => `${i + 1}. ${domainOf(o.url)}`);
    const rankStr = ourRank ? `RANK #${ourRank}  ${ourUrl}` : `not in top ${g.organic.length}`;
    console.log(`• ${term}`);
    console.log(`   us: ${rankStr}${g.ai ? '   [AI overview present]' : ''}`);
    console.log(`   top: ${top5.join('   ')}`);
    if (g.paa.length) console.log(`   PAA: ${g.paa.slice(0, 4).join(' | ')}`);
    console.log('');
    report.push({ term, ourRank, ourUrl, aiOverview: g.ai,
      top10: g.organic.slice(0, 10).map((o) => ({ pos: o.position, domain: domainOf(o.url), url: o.url })),
      peopleAlsoAsk: g.paa, relatedQueries: g.related });
  }

  if (!existsSync(SNAP_DIR)) mkdirSync(SNAP_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const out = join(SNAP_DIR, `serp-${date}.json`);
  writeFileSync(out, JSON.stringify({ date, target: TARGET, report }, null, 2));
  console.log(`Snapshot saved: ${out}`);
  console.log('Re-run weekly; compare ourRank across snapshots to see movement.');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
