#!/usr/bin/env node
/*
  kw-research.mjs — real keyword data via DataForSEO Labs, to replace the
  masked "50/mo" blindness that made us chase 0-volume geo terms
  (data-reframe-2026-07-20.md). Two jobs:

  1) OVERVIEW: for seed keywords, real search volume + keyword difficulty +
     search intent (keyword_overview, ~$0.01/batch). This is the Stage-1 KILL
     gate in RESEARCH-CHAIN: no Labs volume => the target dies (shelby would have).
  2) EXPAND: keyword ideas around a seed (keyword_ideas), so the target
     universe comes from real ranked data, not a stale CSV.

  Creds: ~/.config/studioobrien/dataforseo.txt ("login:password").
  Saves to research/kw/.

  Run: node production/kw-research.mjs --seeds "website design cost,cost to build a website"
       node production/kw-research.mjs --expand "web design pricing" --limit 40
*/
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), 'research', 'kw');
const LOC = 'United States', LANG = 'en';

function creds() {
  if (process.env.DATAFORSEO_LOGIN && process.env.DATAFORSEO_PASSWORD) return `${process.env.DATAFORSEO_LOGIN}:${process.env.DATAFORSEO_PASSWORD}`;
  try { const f = readFileSync(join(homedir(), '.config', 'studioobrien', 'dataforseo.txt'), 'utf8').trim(); if (f.includes(':')) return f; } catch {}
  console.error('No DataForSEO creds (~/.config/studioobrien/dataforseo.txt).'); process.exit(1);
}
const AUTH = 'Basic ' + Buffer.from(creds()).toString('base64');
async function post(path, body) {
  const res = await fetch('https://api.dataforseo.com/v3/' + path, { method: 'POST', headers: { authorization: AUTH, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const j = await res.json(); const task = (j.tasks || [])[0];
  if (!task || task.status_code !== 20000) throw new Error(`${task ? task.status_code + ' ' + task.status_message : 'no task'}`);
  return { items: ((task.result || [])[0] || {}).items || task.result || [], cost: j.cost };
}
const row = (it) => {
  const ki = it.keyword_info || {}, kp = it.keyword_properties || {}, si = it.search_intent_info || {};
  return { keyword: it.keyword, volume: ki.search_volume ?? null, competition: ki.competition_level || ki.competition || null, difficulty: kp.keyword_difficulty ?? null, intent: si.main_intent || null };
};
const fmt = (r) => `  ${String(r.volume ?? '·').padStart(6)}/mo  kd ${String(r.difficulty ?? '·').padStart(3)}  ${String(r.intent || '·').padEnd(12)} ${r.keyword}`;

const arg = (f) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : null; };

(async () => {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-');
  const seeds = arg('--seeds'), expand = arg('--expand');
  if (!seeds && !expand) { console.error('need --seeds "a,b,c" and/or --expand "seed"'); process.exit(1); }

  if (seeds) {
    const list = seeds.split(',').map((s) => s.trim()).filter(Boolean);
    const { items, cost } = await post('dataforseo_labs/google/keyword_overview/live', [{ keywords: list, location_name: LOC, language_code: LANG }]);
    const rows = items.map(row).sort((a, b) => (b.volume || 0) - (a.volume || 0));
    console.log(`=== OVERVIEW (${rows.length}/${list.length} returned; cost $${cost}) ===`);
    for (const r of rows) console.log(fmt(r));
    const missing = list.filter((k) => !items.find((it) => it.keyword === k));
    if (missing.length) console.log(`  NO VOLUME DATA (=> KILL-gate at Stage 1): ${missing.join(', ')}`);
    writeFileSync(join(OUT_DIR, `overview-${stamp}.json`), JSON.stringify({ stamp, seeds: list, rows, missing }, null, 2));
  }

  if (expand) {
    const limit = Number(arg('--limit')) || 50;
    // keyword_suggestions = full-phrase-match long-tails of the seed (stays on
    // topic), vs keyword_ideas which drifts into "website" navigational junk.
    const { items, cost } = await post('dataforseo_labs/google/keyword_suggestions/live', [{ keyword: expand, location_name: LOC, language_code: LANG, limit, order_by: ['keyword_info.search_volume,desc'] }]);
    const rows = items.map(row).filter((r) => r.volume).sort((a, b) => (b.volume || 0) - (a.volume || 0));
    console.log(`\n=== EXPAND "${expand}" (${rows.length} phrase-match suggestions w/ volume; cost $${cost}) ===`);
    for (const r of rows.slice(0, 40)) console.log(fmt(r));
    // sweet spot: real volume + winnable difficulty + buyer/answer intent
    // (drop navigational — those are brand/site lookups, not our demand).
    const winnable = rows.filter((r) => r.volume >= 100 && r.difficulty != null && r.difficulty <= 25 && r.intent !== 'navigational');
    console.log(`\n  SWEET SPOT (vol>=100, kd<=25): ${winnable.length}`);
    for (const r of winnable.slice(0, 20)) console.log(fmt(r));
    writeFileSync(join(OUT_DIR, `expand-${expand.replace(/\W+/g, '-')}-${stamp}.json`), JSON.stringify({ stamp, seed: expand, rows, winnable }, null, 2));
  }
  console.log('\nSaved to research/kw/. Feed winnable terms into RESEARCH-CHAIN Stage 0.');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
