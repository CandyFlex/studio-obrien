#!/usr/bin/env node
/*
  gsc-report.mjs — headless Google Search Console report for studioobrien.com.

  Auth: service-account JWT-bearer flow, zero dependencies (Node 18+ crypto+fetch).
  Key:  $GSC_SA_KEY or ~/.config/studioobrien/gsc-sa-key.json  (NEVER commit this).

  One-time: add the service-account email as a user on the studioobrien.com
  property in Search Console (Settings -> Users and permissions -> Add user,
  Restricted is enough). Until then the API returns 403 and this prints how to fix.

  Run: node production/gsc-report.mjs
  Reports: sitemap errors, top pages (28d), and per-URL index/coverage status.
*/
import { readFileSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';

const KEY_PATH = process.env.GSC_SA_KEY || join(homedir(), '.config', 'studioobrien', 'gsc-sa-key.json');
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const SITE_MATCH = 'studioobrien.com';
const INSPECT_URLS = [
  'https://studioobrien.com/',
  'https://studioobrien.com/blog/how-to-choose-web-design-company',
  'https://studioobrien.com/blog/who-owns-your-website-domain-source-code',
  'https://studioobrien.com/blog/website-builder-vs-custom-cost',
  'https://studioobrien.com/blog/wix-squarespace-seo-limits',
  'https://studioobrien.com/blog/small-business-website-cost-2026',
  'https://studioobrien.com/blog/why-cheap-websites-cost-more',
];

const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

async function getToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const aud = key.token_uri || 'https://oauth2.googleapis.com/token';
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud, iat: now, exp: now + 3600 }));
  const signed = `${header}.${claim}`;
  const sig = createSign('RSA-SHA256').update(signed).sign(key.private_key);
  const jwt = `${signed}.${b64url(sig)}`;
  const res = await fetch(aud, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error('token error: ' + JSON.stringify(j));
  return j.access_token;
}

async function api(token, url, opts = {}) {
  const res = await fetch(url, { ...opts, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...(opts.headers || {}) } });
  const text = await res.text();
  let body; try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

const addUserHint = (email) =>
  `\n>> 403 Forbidden. Add this service account to the property, then re-run:\n` +
  `   Search Console -> Settings -> Users and permissions -> Add user\n   ${email}  (Restricted)\n`;

(async () => {
  let key;
  try { key = JSON.parse(readFileSync(KEY_PATH, 'utf8')); }
  catch { console.error('No service-account key at ' + KEY_PATH + '\nSet GSC_SA_KEY or create the key.'); process.exit(1); }
  console.log('Service account:', key.client_email, '\n');

  const token = await getToken(key);

  const sites = await api(token, 'https://www.googleapis.com/webmasters/v3/sites');
  if (sites.status === 403) { console.error(addUserHint(key.client_email)); process.exit(2); }
  const list = (sites.body.siteEntry || []).map((s) => s.siteUrl);
  const site = list.find((s) => s.includes(SITE_MATCH));
  if (!site) { console.error('Property not visible to this service account yet.'); console.error('Sites it can see: ' + JSON.stringify(list)); console.error(addUserHint(key.client_email)); process.exit(2); }
  console.log('Property:', site, '\n');

  // Sitemaps
  const enc = encodeURIComponent(site);
  const sm = await api(token, `https://www.googleapis.com/webmasters/v3/sites/${enc}/sitemaps`);
  console.log('=== SITEMAPS ===');
  const sitemaps = sm.body.sitemap || [];
  if (!sitemaps.length) console.log('  (none submitted — submit https://studioobrien.com/sitemap.xml in GSC)');
  for (const s of sitemaps) {
    console.log(`  ${s.path}`);
    console.log(`    downloaded=${(s.lastDownloaded || 'never').slice(0, 10)} errors=${s.errors || 0} warnings=${s.warnings || 0} pending=${s.isPending || false}`);
  }

  // Search analytics (last 28 days by page)
  const iso = (d) => d.toISOString().slice(0, 10);
  const sa = await api(token, `https://www.googleapis.com/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
    method: 'POST',
    body: JSON.stringify({ startDate: iso(new Date(Date.now() - 28 * 864e5)), endDate: iso(new Date()), dimensions: ['page'], rowLimit: 15 }),
  });
  console.log('\n=== TOP PAGES (28d: clicks / impressions / ctr / avg position) ===');
  const rows = sa.body.rows || [];
  if (!rows.length) console.log('  (no data yet — normal for pages Google has not accumulated stats on)');
  for (const r of rows) console.log(`  ${String(r.clicks).padStart(4)}c ${String(r.impressions).padStart(6)}i ${(r.ctr * 100).toFixed(1).padStart(5)}% p${r.position.toFixed(1).padStart(5)}  ${r.keys[0]}`);

  // URL inspection
  console.log('\n=== URL INDEX STATUS ===');
  for (const u of INSPECT_URLS) {
    const r = await api(token, 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST', body: JSON.stringify({ inspectionUrl: u, siteUrl: site }),
    });
    const short = u.replace('https://studioobrien.com', '') || '/';
    if (r.status !== 200) { console.log(`  ${short}  ERROR ${r.status}: ${JSON.stringify(r.body).slice(0, 140)}`); continue; }
    const idx = (r.body.inspectionResult && r.body.inspectionResult.indexStatusResult) || {};
    console.log(`  ${short}`);
    console.log(`    verdict=${idx.verdict || '?'}  coverage="${idx.coverageState || '?'}"  lastCrawl=${(idx.lastCrawlTime || 'never').slice(0, 10)}  robots=${idx.robotsTxtState || '?'}`);
  }
  console.log('\nDone.');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
