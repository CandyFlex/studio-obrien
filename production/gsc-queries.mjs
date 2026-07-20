#!/usr/bin/env node
/*
  gsc-queries.mjs — the highest-value, 100%-reliable, FREE SEO data we have:
  the actual search QUERIES studioobrien.com already gets impressions for, with
  position + CTR, and which page catches each. First-party truth (no scraping),
  straight from Google. This is where "cheaper wins than a flickering geo page"
  become visible — terms we already rank for but never targeted.

  Reuses the gsc-report.mjs service-account auth. Saves to gsc-reports/.

  Run: node production/gsc-queries.mjs           (last 28 days)
       node production/gsc-queries.mjs --days 90 (wider window)
*/
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPORT_DIR = join(dirname(fileURLToPath(import.meta.url)), 'gsc-reports');
const captured = [];
for (const m of ['log', 'error']) { const o = console[m].bind(console); console[m] = (...a) => { captured.push(a.join(' ')); o(...a); }; }
process.on('exit', () => { try { mkdirSync(REPORT_DIR, { recursive: true }); const s = new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-'); writeFileSync(join(REPORT_DIR, `gsc-queries-${s}.txt`), captured.join('\n') + '\n'); } catch {} });

const KEY_PATH = process.env.GSC_SA_KEY || join(homedir(), '.config', 'studioobrien', 'gsc-sa-key.json');
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const SITE_MATCH = 'studioobrien.com';
const daysArg = process.argv.indexOf('--days');
const DAYS = daysArg > -1 ? Number(process.argv[daysArg + 1]) : 28;

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

async function getToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const aud = key.token_uri || 'https://oauth2.googleapis.com/token';
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud, iat: now, exp: now + 3600 }));
  const signed = `${header}.${claim}`;
  const sig = createSign('RSA-SHA256').update(signed).sign(key.private_key);
  const res = await fetch(aud, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${signed}.${b64url(sig)}` }) });
  const j = await res.json();
  if (!j.access_token) throw new Error('token error: ' + JSON.stringify(j));
  return j.access_token;
}

async function api(token, url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...(opts.headers || {}) } });
  const text = await res.text(); let body; try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

const iso = (d) => d.toISOString().slice(0, 10);
const pad = (s, n) => String(s).padStart(n);
const band = (p) => (p <= 3 ? 'TOP3' : p <= 10 ? 'pg1' : p <= 20 ? 'pg2' : 'pg3+');

(async () => {
  let key;
  try { key = JSON.parse(readFileSync(KEY_PATH, 'utf8')); }
  catch { console.error('No service-account key at ' + KEY_PATH); process.exit(1); }
  console.log('Service account:', key.client_email);
  const token = await getToken(key);

  const sites = await api(token, 'https://www.googleapis.com/webmasters/v3/sites');
  const site = (sites.body.siteEntry || []).map((s) => s.siteUrl).find((s) => s.includes(SITE_MATCH));
  if (!site) { console.error('Property not visible to service account.'); process.exit(2); }
  const enc = encodeURIComponent(site);
  const startDate = iso(new Date(Date.now() - DAYS * 864e5)), endDate = iso(new Date());
  console.log(`Property: ${site} | window: ${startDate}..${endDate} (${DAYS}d)\n`);

  const q = (dims) => api(token, `https://www.googleapis.com/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
    method: 'POST', body: JSON.stringify({ startDate, endDate, dimensions: dims, rowLimit: 500, dataState: 'all' }),
  });

  // 1. All queries we appear for, ranked by impressions (real demand we touch).
  const byQuery = (await q(['query'])).body.rows || [];
  byQuery.sort((a, b) => b.impressions - a.impressions);
  console.log(`=== QUERIES WE ALREADY APPEAR FOR (${byQuery.length} total, top 40 by impressions) ===`);
  console.log('  impr  clicks  ctr    pos   band   query');
  for (const r of byQuery.slice(0, 40)) {
    console.log(`  ${pad(r.impressions, 4)}  ${pad(r.clicks, 5)}  ${pad((r.ctr * 100).toFixed(1), 4)}%  ${pad(r.position.toFixed(1), 5)}  ${pad(band(r.position), 5)}  ${r.keys[0]}`);
  }

  // 2. The opportunity slice: page 2 (pos 11-20) with real impressions = a
  //    nudge from page 1. The cheapest wins in the whole property.
  const pg2 = byQuery.filter((r) => r.position > 10 && r.position <= 20 && r.impressions >= 2).sort((a, b) => b.impressions - a.impressions);
  console.log(`\n=== PAGE-2 OPPORTUNITIES (pos 11-20, >=2 impr) — cheapest wins (${pg2.length}) ===`);
  for (const r of pg2.slice(0, 25)) console.log(`  ${pad(r.impressions, 4)}i  pos ${pad(r.position.toFixed(1), 5)}  ${r.keys[0]}`);

  // 3. Striking distance on page 1 (pos 4-10): a title/CTR or link nudge to top 3.
  const near = byQuery.filter((r) => r.position > 3 && r.position <= 10 && r.impressions >= 2).sort((a, b) => a.position - b.position);
  console.log(`\n=== STRIKING DISTANCE (pos 4-10, >=2 impr) — CTR/link nudge to top 3 (${near.length}) ===`);
  for (const r of near.slice(0, 25)) console.log(`  ${pad(r.impressions, 4)}i  pos ${pad(r.position.toFixed(1), 5)}  ${r.keys[0]}`);

  // 4. Query x page: which URL catches each top query (retrofit targeting).
  const byQP = (await q(['query', 'page'])).body.rows || [];
  byQP.sort((a, b) => b.impressions - a.impressions);
  console.log(`\n=== TOP QUERY -> PAGE (top 25 by impressions) ===`);
  for (const r of byQP.slice(0, 25)) console.log(`  ${pad(r.impressions, 4)}i  pos ${pad(r.position.toFixed(1), 5)}  ${r.keys[0]}  ->  ${r.keys[1].replace('https://studioobrien.com', '')}`);

  console.log(`\nTotals: ${byQuery.length} distinct queries, ${byQuery.reduce((a, r) => a + r.impressions, 0)} impressions, ${byQuery.reduce((a, r) => a + r.clicks, 0)} clicks (${DAYS}d).`);
  console.log('Done.');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
