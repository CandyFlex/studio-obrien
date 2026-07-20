#!/usr/bin/env node
/*
  seo-opportunities.mjs — the decision brain. Merges GSC "almost ranking"
  queries with SERP competition strength to produce a RANKED list of what to
  launch or strengthen next. Answers "do I need new pages, or fix existing ones?"

  Logic:
   - GSC (28d, query dimension): find near-miss queries — position ~6-30 with
     real impressions. Those are winnable; page-1 needs a nudge, not a miracle.
   - Cross-ref the latest serp-track snapshot: if the term is tracked, grade the
     competition (how much of the top 5 is directories vs real competitors).
     Weak competition + real impressions = top priority.
   - Classify: query names a town we already have a page for -> STRENGTHEN that
     page. Otherwise -> candidate NEW page/post.

  Auth: GSC service-account key (same as gsc-report.mjs).
  Run:  node production/seo-opportunities.mjs
*/
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createSign } from 'node:crypto';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const SNAP_DIR = join(HERE, 'serp-snapshots');
const KEY_PATH = process.env.GSC_SA_KEY || join(homedir(), '.config', 'studioobrien', 'gsc-sa-key.json');
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const DIRECTORIES = ['yelp.com','thumbtack.com','facebook.com','reddit.com','clutch.co','designrush.com','bbb.org','nextdoor.com','angi.com','m.yelp.com','youtube.com','pinterest.com'];

const b64url = (b) => Buffer.from(b).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');

async function gscToken(key) {
  const now = Math.floor(Date.now()/1000);
  const aud = key.token_uri || 'https://oauth2.googleapis.com/token';
  const claim = b64url(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud, iat: now, exp: now+3600 }));
  const signed = `${b64url(JSON.stringify({ alg:'RS256', typ:'JWT' }))}.${claim}`;
  const sig = createSign('RSA-SHA256').update(signed).sign(key.private_key);
  const r = await fetch(aud, { method:'POST', headers:{'content-type':'application/x-www-form-urlencoded'},
    body: new URLSearchParams({ grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion:`${signed}.${b64url(sig)}` }) });
  return (await r.json()).access_token;
}

// towns we already have geo pages for (query naming one -> strengthen, not launch)
const towns = existsSync(ROOT)
  ? readdirSync(ROOT).filter((f) => f.endsWith('-nc-web-design.html')).map((f) => f.replace('-nc-web-design.html','').replace(/-/g,' '))
  : [];

function latestSnapshot() {
  if (!existsSync(SNAP_DIR)) return null;
  const files = readdirSync(SNAP_DIR).filter((f) => f.endsWith('.json')).sort().reverse();
  return files.length ? JSON.parse(readFileSync(join(SNAP_DIR, files[0]),'utf8')) : null;
}
function competitionGrade(snap, term) {
  const hit = snap && (snap.report||[]).find((r) => r.term.toLowerCase() === term.toLowerCase());
  if (!hit || !hit.top10) return null;
  const top5 = hit.top10.slice(0,5);
  const dirs = top5.filter((r) => DIRECTORIES.includes(r.domain)).length;
  return { dirs, grade: dirs >= 3 ? 'WEAK' : dirs === 2 ? 'MEDIUM' : 'STRONG', ourRank: hit.ourRank };
}

(async () => {
  let key; try { key = JSON.parse(readFileSync(KEY_PATH,'utf8')); }
  catch { console.error('No GSC key at '+KEY_PATH); process.exit(1); }
  const token = await gscToken(key);
  const enc = encodeURIComponent('sc-domain:studioobrien.com');
  const iso = (d) => d.toISOString().slice(0,10);
  const res = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${enc}/searchAnalytics/query`, {
    method:'POST', headers:{ authorization:`Bearer ${token}`, 'content-type':'application/json' },
    body: JSON.stringify({ startDate: iso(new Date(Date.now()-28*864e5)), endDate: iso(new Date()), dimensions:['query'], rowLimit: 200 }) });
  const rows = (await res.json()).rows || [];

  const snap = latestSnapshot();
  // near-miss: position between 5 and 40, at least 2 impressions, not a bare brand term
  const opps = rows
    .filter((r) => r.position >= 5 && r.position <= 40 && r.impressions >= 2 && !/obrien|studioobrien/i.test(r.keys[0]))
    .map((r) => {
      const q = r.keys[0];
      const comp = competitionGrade(snap, q);
      const hasTown = towns.find((t) => q.toLowerCase().includes(t));
      // score: impressions weighted, closer-to-page-1 better, weak competition boosts
      const posFactor = Math.max(0, 41 - r.position) / 36;
      const compBoost = comp ? (comp.grade === 'WEAK' ? 1.5 : comp.grade === 'MEDIUM' ? 1.2 : 1) : 1.1;
      const score = r.impressions * posFactor * compBoost;
      return { q, pos: r.position, imp: r.impressions, comp, hasTown, score,
        action: hasTown ? `STRENGTHEN /${hasTown.replace(/ /g,'-')}-nc-web-design` : 'NEW page/post candidate' };
    })
    .sort((a,b) => b.score - a.score);

  console.log('\n===== SEO OPPORTUNITIES (GSC near-miss x SERP competition, 28d) =====\n');
  if (!opps.length) { console.log('  No near-miss queries yet (positions still deep — normal for a new site).'); }
  opps.slice(0, 20).forEach((o, i) => {
    const comp = o.comp ? ` | comp:${o.comp.grade}(${o.comp.dirs}/5 dirs)` : ' | comp:untracked';
    console.log(`${String(i+1).padStart(2)}. "${o.q}"`);
    console.log(`    pos ${o.pos.toFixed(1)} | ${o.imp} impr${comp} | score ${o.score.toFixed(1)}`);
    console.log(`    -> ${o.action}${!o.comp ? '  (add to serp-track.mjs to grade competition)' : ''}\n`);
  });
  console.log('Next: run `node production/serp-brief.mjs "<query>"` on the top ones to get a build brief.');
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
