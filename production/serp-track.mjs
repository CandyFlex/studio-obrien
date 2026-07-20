#!/usr/bin/env node
/*
  serp-track.mjs — weekly local SERP snapshot for studioobrien.com.

  v3 (2026-07-20): triple provider. Auto-pick order: dataforseo > serper > apify.
  - dataforseo (PREFERRED): DataForSEO SERP Live Advanced. Live mode $0.004
    per keyword (12 kw ≈ $0.048/reading; verified 2026-07-20); Standard queue
    is cheaper. $1 free trial ≈ 200 live readings. Basic auth (login:password).
    One keyword per Live call, so we fan out 12 calls per sample (parallel;
    the API allows 2000 calls/min). Rich SERP feature data (PAA, related).
    Creds: $DATAFORSEO_LOGIN + $DATAFORSEO_PASSWORD, OR one line "login:password"
    in ~/.config/studioobrien/dataforseo.txt (the API password from the
    dashboard, NOT the account login password).
  - serper (ALT): Serper.dev — ~$1/1k queries, 2,500 free credits. One
    batched POST for all keywords ≈ 24-72 credits (~$0.03-0.07).
    Key: $SERPER_API_KEY or ~/.config/studioobrien/serper-key.txt
  - apify (FALLBACK): apify/google-search-scraper, $0.50 MINIMUM per run.
    Only when no other key exists. NEVER loop it; never multi-sample it.
    Token: $APIFY_TOKEN or ~/.config/studioobrien/apify-token.txt

  All three cheap providers are multi-sample-safe (--samples N), which the
  volatility rule demands: one reading is a sample, never a rank.

  Output: production/serp-snapshots/serp-YYYY-MM-DD-HH-MM.json (timestamped:
  same-day re-runs never overwrite — a reading was lost to that on 7/20).
  With --samples N the snapshot stores per-sample ranks and a CONSENSUS
  ourRank (majority non-null -> median; else null). system-diag reads ourRank.

  Run: node production/serp-track.mjs                 (auto-picks provider)
       node production/serp-track.mjs --samples 3     (dataforseo/serper)
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
const USAGE = `usage: node production/serp-track.mjs [--provider dataforseo|serper|apify] [--samples N] [--pages N]
  --provider  force provider (default: dataforseo > serper > apify by key)
  --samples   dataforseo/serper: N readings for a consensus rank (default 1, max 5)
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
if (opts.provider && !['dataforseo', 'serper', 'apify'].includes(opts.provider)) { console.log(USAGE); process.exit(1); }
if (!Number.isInteger(opts.samples) || opts.samples < 1 || opts.samples > 5) { console.log(USAGE); process.exit(1); }

const keyFile = (name) => { try { return readFileSync(join(homedir(), '.config', 'studioobrien', name), 'utf8').trim(); } catch { return null; } };
const serperKey = process.env.SERPER_API_KEY || keyFile('serper-key.txt');
const apifyToken = process.env.APIFY_TOKEN || keyFile('apify-token.txt');
// DataForSEO: env pair, or a "login:password" line in the key file.
let dfsCreds = null;
if (process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD) dfsCreds = `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`;
else { const f = keyFile('dataforseo.txt'); if (f && f.includes(':')) dfsCreds = f; }

const provider = opts.provider || (dfsCreds ? 'dataforseo' : serperKey ? 'serper' : 'apify');
if (provider === 'dataforseo' && !dfsCreds) {
  console.error('No DataForSEO creds. Set $DATAFORSEO_LOGIN + $DATAFORSEO_PASSWORD, or put "login:password"\n(the API password from the dashboard) in ~/.config/studioobrien/dataforseo.txt');
  process.exit(1);
}
if (provider === 'serper' && !serperKey) {
  console.error('No Serper key. Set $SERPER_API_KEY or create ~/.config/studioobrien/serper-key.txt\nSign up free (2,500 credits): https://serper.dev');
  process.exit(1);
}
if (provider === 'apify' && !apifyToken) {
  console.error('No Apify token. Set $APIFY_TOKEN or create ~/.config/studioobrien/apify-token.txt');
  process.exit(1);
}
if (provider === 'apify' && opts.samples > 1) {
  console.error('--samples is not for apify: multi-sampling Apify costs $0.50 PER SAMPLE. Refusing.');
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

async function pullDataForSEO() {
  // Live Advanced allows one keyword per call -> fan out (parallel; 2000/min ok).
  // location_name keeps parity with explicit-geo queries; depth 30 so a page-2
  // rank (we've seen #13-25) is still captured.
  const auth = 'Basic ' + Buffer.from(dfsCreds).toString('base64');
  // Trial/fresh accounts return intermittent 40104 ("verify account") and the
  // odd slow call even when verified (observed 2026-07-20: same instant, some
  // calls 20000 Ok + billed, some 40104). Retry the transient failures and
  // time out hung calls so one flaky response can't sink a 36-call snapshot.
  // Retry everything except truly permanent errors (auth, not-found, bad
  // request/field). Our queries are fixed, so almost any failure is a
  // transient server/verification hiccup worth another attempt.
  const PERMANENT = new Set([40100, 40400, 40401, 40501, 40502, 40503]);
  const callOnce = async (keyword) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      const res = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
        method: 'POST', signal: ctrl.signal,
        headers: { authorization: auth, 'content-type': 'application/json' },
        body: JSON.stringify([{ keyword, location_name: LOCATION || 'United States', language_code: 'en', device: 'desktop', depth: 30 }]),
      });
      const j = await res.json();
      const task = (j.tasks || [])[0];
      const code = task ? task.status_code : (j.status_code || res.status);
      if (code !== 20000) { const e = new Error(`${code} ${(task ? task.status_message : j.status_message) || res.status}`); e.code = code; throw e; }
      return task;
    } finally { clearTimeout(timer); }
  };
  const failed = [];
  const one = async (keyword) => {
    let lastErr;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try { const task = await callOnce(keyword);
        const items = ((task.result || [])[0] || {}).items || [];
        return [keyword, mapItems(items)];
      } catch (e) {
        lastErr = e;
        const retryable = e.name === 'AbortError' || !PERMANENT.has(e.code);
        if (!retryable || attempt === 5) break;
        await new Promise((r) => setTimeout(r, 800 * attempt));
      }
    }
    // Degrade to an empty reading (a null sample) rather than sinking the run.
    failed.push(`${keyword} (${lastErr && lastErr.message})`);
    return [keyword, { organic: [], paa: [], related: [], ai: false }];
  };
  const mapItems = (items) => {
    const g = { organic: [], paa: [], related: [], ai: false };
    for (const it of items) {
      if (it.type === 'organic') g.organic.push({ url: it.url, position: it.rank_absolute });
      else if (it.type === 'people_also_ask') for (const q of it.items || []) { if (q.title || q.seed_question) g.paa.push(q.title || q.seed_question); }
      else if (it.type === 'related_searches') for (const q of it.items || []) g.related.push(typeof q === 'string' ? q : q.title || q);
      else if (it.type === 'ai_overview' || it.type === 'answer_box' || it.type === 'featured_snippet') g.ai = true;
    }
    g.organic.sort((a, b) => (a.position || 999) - (b.position || 999));
    return g;
  };
  const entries = await Promise.all(KEYWORDS.map(one));
  if (failed.length) console.log(`  WARN: ${failed.length}/${KEYWORDS.length} keyword(s) failed after retries this sample: ${failed.join('; ')}`);
  return new Map(entries);
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
  const costNote = provider === 'dataforseo'
    ? `~$${(KEYWORDS.length * 0.004 * opts.samples).toFixed(3)} (live advanced $0.004/call, ${KEYWORDS.length * opts.samples} calls)`
    : provider === 'serper'
      ? `~${KEYWORDS.length * 2 * opts.samples} credits (~$${(KEYWORDS.length * 2 * opts.samples / 1000).toFixed(2)})`
      : '~$0.50 (actor minimum)';
  console.log(`Provider: ${provider} | ${KEYWORDS.length} keywords x ${opts.samples} sample(s) | est. cost ${costNote}`);

  const pull = provider === 'dataforseo' ? pullDataForSEO : provider === 'serper' ? pullSerper : pullApify;
  const samples = [];
  for (let s = 0; s < opts.samples; s++) {
    samples.push(await pull());
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
