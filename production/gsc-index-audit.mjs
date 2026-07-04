#!/usr/bin/env node
/*
  gsc-index-audit.mjs — inspect EVERY sitemap URL in Search Console and bucket by
  index status, so we can see exactly what is not getting indexed and why.

  Auth + key: same as gsc-report.mjs (service account, ~/.config/studioobrien/gsc-sa-key.json).
  Run: node production/gsc-index-audit.mjs
  Reads local sitemap.xml for the URL list.
*/
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const KEY_PATH = process.env.GSC_SA_KEY || join(homedir(), '.config', 'studioobrien', 'gsc-sa-key.json');
const SITE = 'sc-domain:studioobrien.com';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

const b64url = (b) => Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

async function getToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const aud = key.token_uri || 'https://oauth2.googleapis.com/token';
  const signed = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud, iat: now, exp: now + 3600 }))}`;
  const jwt = `${signed}.${b64url(createSign('RSA-SHA256').update(signed).sign(key.private_key))}`;
  const r = await fetch(aud, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) });
  const j = await r.json();
  if (!j.access_token) throw new Error('token error: ' + JSON.stringify(j));
  return j.access_token;
}

async function inspect(token, url) {
  const r = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
    method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
  });
  if (r.status === 429) { await new Promise((s) => setTimeout(s, 3000)); return inspect(token, url); }
  const j = await r.json();
  return { status: r.status, idx: (j.inspectionResult && j.inspectionResult.indexStatusResult) || {}, raw: j };
}

(async () => {
  const key = JSON.parse(readFileSync(KEY_PATH, 'utf8'));
  const token = await getToken(key);
  const xml = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  console.log(`Inspecting ${urls.length} URLs from sitemap.xml ...\n`);

  const buckets = {};
  const canonicalIssues = [];
  const notIndexed = [];
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    const { status, idx } = await inspect(token, u);
    if (status !== 200) { (buckets['API_ERROR_' + status] ||= []).push(u); continue; }
    const state = idx.coverageState || 'unknown';
    (buckets[state] ||= []).push(u);
    if (idx.verdict !== 'PASS') notIndexed.push({ u, state, lastCrawl: (idx.lastCrawlTime || '').slice(0, 10) });
    if (idx.googleCanonical && idx.userCanonical && idx.googleCanonical !== idx.userCanonical)
      canonicalIssues.push({ u, user: idx.userCanonical, google: idx.googleCanonical });
    process.stdout.write(`\r  ${i + 1}/${urls.length}`);
  }
  console.log('\n');

  console.log('=== COVERAGE BUCKETS ===');
  for (const [state, list] of Object.entries(buckets).sort((a, b) => b[1].length - a[1].length))
    console.log(`  ${list.length.toString().padStart(3)}  ${state}`);

  console.log('\n=== NOT INDEXED (' + notIndexed.length + ') ===');
  for (const n of notIndexed) console.log(`  [${n.state}] ${n.u.replace('https://studioobrien.com', '') || '/'}  lastCrawl=${n.lastCrawl || 'never'}`);

  if (canonicalIssues.length) {
    console.log('\n=== CANONICAL MISMATCH (Google chose a different canonical) ===');
    for (const c of canonicalIssues) console.log(`  ${c.u.replace('https://studioobrien.com', '')}\n     you=${c.user}\n     google=${c.google}`);
  }
  console.log('\nDone.');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
