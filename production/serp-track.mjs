#!/usr/bin/env node
/*
  serp-track.mjs — weekly local SERP snapshot for studioobrien.com.

  v2 (2026-07-20): dual provider.
  - serper  (PREFERRED): Serper.dev — ~$1/1k queries, 2,500 free credits on
    signup. One batched POST for all keywords ≈ 24-72 credits (~$0.03-0.07).
    Cheap enough to multi-sample (--samples 3), which the volatility rule
    demands: one reading is a sample, never a rank.
    Key: $SERPER_API_KEY or ~/.config/studioobrien/serper-key.txt
    Sign up: https://serper.dev (free, no card for the trial credits).
  - apify   (FALLBACK): apify/google-search-scraper, $0.50 MINIMUM per run.
    Only used when no serper key exists. NEVER loop it; never multi-sample it.
    Token: $APIFY_TOKEN or ~/.config/studioobrien/apify-token.txt

  Output: production/serp-snapshots/serp-YYYY-MM-DD-HH-MM.json (timestamped:
  same-day re-runs never overwrite — a reading was lost to that on 7/20).
  With --samples N the snapshot stores per-sample ranks and a CONSENSUS
  ourRank (majority non-null -> median; else null). system-diag reads ourRank.

  Run: node production/serp-track.mjs                 (auto-picks provider)
       node production/serp-track.mjs --samples 3     (serper only)
       node production/serp-track.mjs --provider apify --pages 3
*/
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET = 'studioobrien.com';
const HERE = dirname(fileURLToPath(import.meta.url));
const SNAP_DIR = join(HERE, 'serp-snapshots');

// Money keywords — explicit-geo terms carry their own localization.
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

// For implicit "near me" terms, serper accepts a plain-text location
// (e.g. 'Shelby, North Carolina, United States') — no UULE codes needed.
// Leave '' for the explicit-geo keywords above (keeps readings comparable
// with pre-v2 snapshots).
const LOCATION = '';

// ---- arg parsing with a hard guard: unknown flags NEVER trigger a run ----
// (a --help probe on the old version fired a real $0.50 Apify pull)
const USAGE = `usage: node production/serp-track.mjs [--provider serper|apify] [--samples N] [--pages N]
  --provider  force provider (default: serper if key exists, else apify)
  --samples   serper only: N readings for a consensus rank (default 1, max 5)
  --pages     apify only: result pages per query (default 3)`;
const args = process.argv.slice(2);
const opts = { provider: null, samples: 1, pages: 3 };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--provider') opts.provider = args[++i];
  else if (a === '--samples') opts.samples = Number(args[++i]);
  else if (a === '--pages') opts.pages = Number(args[++i]);
  else { console.log(USAGE); process.exit(a === '--help' || a === '-h' ? 0 : 1); }
}
if (opts.provider && !['serper', 'apify'].includes(opts.provider)) { console.log(USAGE); process.exit(1); }
if (!Number.isInteger(opts.samples) || opts.samples < 1 || opts.samples > 5) { console.log(USAGE); process.exit(1); }

const keyFile = (name) => { try { return readFileSync(join(homedir(), '.config', 'studioobrien', name), 'utf8').trim(); } catch { return null; } };
const serperKey = process.env.SERPER_API_KEY || keyFile('serper-key.txt');
const apifyToken = process.env.APIFY_TOKEN || keyFile('apify-token.txt');

const provider = opts.provider || (serperKey ? 'serper' : 'apify');
if (provider === 'serper' && !serperKey) {
  console.error('No Serper key. Set $SERPER_API_KEY or create ~/.config/studioobrien/serper-key.txt\nSign up free (2,500 credits): https://serper.dev');
  process.exit(1);
}
if (provider === 'apify' && !apifyToken) {
  console.error('No Apify token. Set $APIFY_TOKEN or create ~/.config/studioobrien/apify-token.txt');
  process.exit(1);
}
if (provider === 'apify' && opts.samples > 1) {
  console.error('--samples is serper-only: multi-sampling Apify costs $0.50 PER SAMPLE. Refusing.');
  process.exit(1);
}

const domainOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };

// ---- providers: each returns Map(term -> {organic[{url}], paa[], related[], ai}) ----

async function pullSerper() {
  const body = KEYWORDS.map((q) => ({ q, gl: 'us', hl: 'en', num: 30, ...(LOCATION ? { location: LOCATION } : {}) }));
  const res = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: { 'X-API-KEY': serperKey, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Serper ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const arr = await res.json();
  const byTerm = new Map();
  for (const it of Array.isArray(arr) ? arr : [arr]) {
    const term = it.searchParameters && it.searchParameters.q;
    byTerm.set(term, {
      organic: (it.organic || []).map((o) => ({ url: o.link, position: o.position })),
      paa: (it.peopleAlsoAsk || []).map((p) => p.question).filter(Boolean),
      related: (it.relatedSearches || []).map((r) => r.query).filter(Boolean),
      ai: Boolean(it.aiOverview || it.answerBox),
    });
  }
  return byTerm;
}

async function pullApify() {
  const input = { queries: KEYWORDS.join('\n'), countryCode: 'us', languageCode: 'en', maxPagesPerQuery: opts.pages, mobileResults: false };
  const url = `https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${apifyToken}`;
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(input) });
  if (!res.ok) throw new Error(`Apify ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const items = await res.json();
  const byTerm = new Map();
  for (const it of items) {
    const term = (it.searchQuery && it.searchQuery.term) || '(unknown)';
    if (!byTerm.has(term)) byTerm.set(term, { organic: [], paa: [], related: [], ai: false });
    const g = byTerm.get(term);
    for (const o of it.organicResults || []) g.organic.push({ url: o.url, position: o.position });
    for (const q of it.peopleAlsoAsk || []) g.paa.push(q.question || q.title || q.text);
    for (const r of it.relatedQueries || []) g.related.push(r.title);
    if (it.aiModeResult || it.aiOverview) g.ai = true;
  }
  return byTerm;
}

const rankIn = (organic) => {
  for (let i = 0; i < organic.length; i++) if (domainOf(organic[i].url) === TARGET) return { rank: i + 1, url: organic[i].url };
  return { rank: null, url: null };
};

(async () => {
  const costNote = provider === 'serper'
    ? `~${KEYWORDS.length * 2 * opts.samples} credits (~$${(KEYWORDS.length * 2 * opts.samples / 1000).toFixed(2)})`
    : '~$0.50 (actor minimum)';
  console.log(`Provider: ${provider} | ${KEYWORDS.length} keywords x ${opts.samples} sample(s) | est. cost ${costNote}`);

  const samples = [];
  for (let s = 0; s < opts.samples; s++) {
    samples.push(provider === 'serper' ? await pullSerper() : await pullApify());
    if (opts.samples > 1) console.log(`  sample ${s + 1}/${opts.samples} pulled`);
  }

  const report = [];
  console.log('\n================ SERP SNAPSHOT ================\n');
  for (const term of KEYWORDS) {
    const perSample = samples.map((m) => m.get(term) || { organic: [], paa: [], related: [], ai: false });
    const ranks = perSample.map((g) => rankIn(g.organic));
    const nonNull = ranks.filter((r) => r.rank !== null);
    // consensus: our rank only counts if found in a majority of samples
    const majority = nonNull.length * 2 > ranks.length;
    const consensus = majority ? nonNull.map((r) => r.rank).sort((a, b) => a - b)[Math.floor(nonNull.length / 2)] : null;
    const ourUrl = majority ? nonNull[0].url : null;
    const rich = perSample.reduce((a, b) => (b.organic.length > a.organic.length ? b : a));
    const top5 = rich.organic.slice(0, 5).map((o, i) => `${i + 1}. ${domainOf(o.url)}`);

    console.log(`• ${term}`);
    const sampleStr = opts.samples > 1 ? `  [samples: ${ranks.map((r) => r.rank ?? '-').join(',')}]` : '';
    console.log(`   us: ${consensus ? `RANK #${consensus}  ${ourUrl}` : `not in top ${rich.organic.length}`}${rich.ai ? '   [AI overview/answer box]' : ''}${sampleStr}`);
    console.log(`   top: ${top5.join('   ')}`);
    if (rich.paa.length) console.log(`   PAA: ${rich.paa.slice(0, 4).join(' | ')}`);
    console.log('');

    report.push({
      term, ourRank: consensus, ourUrl, aiOverview: rich.ai,
      sampleRanks: ranks.map((r) => r.rank),
      top10: rich.organic.slice(0, 10).map((o, i) => ({ pos: o.position ?? i + 1, domain: domainOf(o.url), url: o.url })),
      peopleAlsoAsk: rich.paa, relatedQueries: rich.related,
    });
  }

  if (!existsSync(SNAP_DIR)) mkdirSync(SNAP_DIR, { recursive: true });
  // date+time in the name: same-day re-runs must never overwrite a reading
  const stamp = new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-');
  const out = join(SNAP_DIR, `serp-${stamp}.json`);
  writeFileSync(out, JSON.stringify({ date: stamp.slice(0, 10), stamp, provider, samples: opts.samples, target: TARGET, report }, null, 2));
  console.log(`Snapshot saved: ${out}`);
  console.log('Re-run weekly; compare ourRank across snapshots to see movement.');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
