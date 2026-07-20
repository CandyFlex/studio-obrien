#!/usr/bin/env node
/*
  maps-track.mjs — local MAP-PACK tracker for studioobrien.com. The battleground
  instrument (data-reframe-2026-07-20.md): "near me" hire-intent demand resolves
  in the Google map pack, which is proximity/relevance/PROMINENCE(reviews)-driven,
  NOT domain-authority-driven — the one surface a low-DR local site can win.

  For each (keyword x location) it pulls the pack via DataForSEO Google Maps SERP
  Live Advanced (~$0.002/call, verified), then reports: OUR position (or ABSENT),
  and the competitors above us with their review counts (the prominence bar we
  have to clear). Timestamped snapshots so review-count growth + our entry are
  diffable week over week.

  Creds: same as serp-track — ~/.config/studioobrien/dataforseo.txt ("login:pass").
  Run: node production/maps-track.mjs
       node production/maps-track.mjs --samples 2   (pack order jitters; consensus)
*/
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SNAP_DIR = join(HERE, 'maps-snapshots');
const US = /obrien|o.brien|studio o/i;               // our business name match
const US_DOMAIN = 'studioobrien.com';

// The near-me / local-hire terms that trigger a pack (real volume per Labs),
// each run against our real service-area towns (proximity = a ranking lever).
const KEYWORDS = ['web designer near me', 'website design near me', 'web design agency near me', 'website designer'];
const LOCATIONS = ['Shelby,North Carolina,United States', 'Gastonia,North Carolina,United States'];

const samplesArg = process.argv.indexOf('--samples');
const SAMPLES = samplesArg > -1 ? Math.max(1, Math.min(3, Number(process.argv[samplesArg + 1]))) : 1;

function creds() {
  if (process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD) return `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`;
  try { const f = readFileSync(join(homedir(), '.config', 'studioobrien', 'dataforseo.txt'), 'utf8').trim(); if (f.includes(':')) return f; } catch {}
  console.error('No DataForSEO creds (~/.config/studioobrien/dataforseo.txt as "login:password").'); process.exit(1);
}
const AUTH = 'Basic ' + Buffer.from(creds()).toString('base64');
const PERMANENT = new Set([40100, 40400, 40401, 40501, 40502, 40503]);

async function packOnce(keyword, location_name) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch('https://api.dataforseo.com/v3/serp/google/maps/live/advanced', {
      method: 'POST', signal: ctrl.signal,
      headers: { authorization: AUTH, 'content-type': 'application/json' },
      body: JSON.stringify([{ keyword, location_name, language_code: 'en' }]),
    });
    const j = await res.json();
    const task = (j.tasks || [])[0];
    const code = task ? task.status_code : (j.status_code || res.status);
    if (code !== 20000) { const e = new Error(`${code} ${(task ? task.status_message : j.status_message) || res.status}`); e.code = code; throw e; }
    const items = ((task.result || [])[0] || {}).items || [];
    return items.filter((i) => i.rank_absolute).map((i) => ({
      rank: i.rank_absolute, title: i.title || '', domain: i.domain || '',
      rating: i.rating && i.rating.value, reviews: (i.rating && i.rating.votes_count) || 0,
    }));
  } finally { clearTimeout(timer); }
}
async function pack(keyword, location_name) {
  let lastErr;
  for (let a = 1; a <= 5; a++) {
    try { return await packOnce(keyword, location_name); }
    catch (e) { lastErr = e; if ((e.code && PERMANENT.has(e.code)) || a === 5) break; await new Promise((r) => setTimeout(r, 800 * a)); }
  }
  throw new Error(`maps "${keyword}" @ ${location_name}: ${lastErr && lastErr.message}`);
}

const usPos = (list) => { const m = list.find((x) => US.test(x.title) || (x.domain || '').includes(US_DOMAIN)); return m ? m.rank : null; };

(async () => {
  console.log(`Map-pack tracker | ${KEYWORDS.length} kw x ${LOCATIONS.length} loc x ${SAMPLES} sample(s) | ~$${(KEYWORDS.length * LOCATIONS.length * SAMPLES * 0.002).toFixed(3)}\n`);
  const report = [];
  for (const location of LOCATIONS) {
    const town = location.split(',')[0];
    for (const keyword of KEYWORDS) {
      const runs = [];
      for (let s = 0; s < SAMPLES; s++) { try { runs.push(await pack(keyword, location)); } catch (e) { console.log(`  ERR ${keyword} @ ${town}: ${e.message}`); runs.push([]); } }
      const rich = runs.reduce((a, b) => (b.length > a.length ? b : a), []);
      const ourRanks = runs.map(usPos);
      const our = ourRanks.find((r) => r !== null) ?? null;
      console.log(`• ${keyword} @ ${town}`);
      console.log(`   us: ${our ? `PACK #${our}` : 'ABSENT'}${SAMPLES > 1 ? `  [samples: ${ourRanks.map((r) => r ?? '-').join(',')}]` : ''}  (pack size ${rich.length})`);
      console.log(`   top: ${rich.slice(0, 5).map((c) => `#${c.rank} ${c.title.slice(0, 22)} (${c.reviews}rev ${c.rating || '-'}★)`).join('  ')}`);
      report.push({ keyword, location: town, ourRank: our, ourSamples: ourRanks, packSize: rich.length, top: rich.slice(0, 10) });
    }
  }
  if (!existsSync(SNAP_DIR)) mkdirSync(SNAP_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-');
  const out = join(SNAP_DIR, `maps-${stamp}.json`);
  writeFileSync(out, JSON.stringify({ stamp, provider: 'dataforseo-maps', target: US_DOMAIN, report }, null, 2));
  console.log(`\nSnapshot saved: ${out}`);
  const absent = report.filter((r) => r.ourRank === null).length;
  console.log(`We are ABSENT from ${absent}/${report.length} packs. Prominence bar (min reviews of any #1 seen): ${Math.min(...report.map((r) => (r.top[0] ? r.top[0].reviews : 999)))}.`);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
