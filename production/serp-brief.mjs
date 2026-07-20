#!/usr/bin/env node
/*
  serp-brief.mjs — turn a keyword's SERP into a ready-to-draft content brief.

  Pulls the target keyword's People Also Ask, related queries, ranking
  competitors, and AI-overview status, then writes a markdown brief that feeds
  the drafting step (DeepSeek per PIPELINE.md Track C, then Claude edits).

  COST-SMART: if the keyword is already in the latest serp-track snapshot, it
  builds the brief from that (FREE, no API call). Only scrapes fresh if the
  keyword isn't in a snapshot. Token: same as serp-track.mjs.

  Run: node production/serp-brief.mjs "web design shelby nc"
*/
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SNAP_DIR = join(HERE, 'serp-snapshots');
const BRIEF_DIR = join(HERE, 'content-briefs');
const ACTOR = 'apify~google-search-scraper';

const kw = process.argv.slice(2).join(' ').trim();
if (!kw) { console.error('Usage: node production/serp-brief.mjs "<keyword>"'); process.exit(1); }
const slug = kw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const domainOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };

function getToken() {
  if (process.env.APIFY_TOKEN) return process.env.APIFY_TOKEN.trim();
  try { return readFileSync(join(homedir(), '.config', 'studioobrien', 'apify-token.txt'), 'utf8').trim(); }
  catch { return null; }
}

function fromSnapshot(keyword) {
  if (!existsSync(SNAP_DIR)) return null;
  const files = readdirSync(SNAP_DIR).filter((f) => f.endsWith('.json')).sort().reverse();
  for (const f of files) {
    const data = JSON.parse(readFileSync(join(SNAP_DIR, f), 'utf8'));
    const hit = (data.report || []).find((r) => r.term.toLowerCase() === keyword.toLowerCase());
    if (hit) return { date: data.date, ...hit };
  }
  return null;
}

async function scrapeFresh(keyword) {
  const token = getToken();
  if (!token) { console.error('Keyword not in any snapshot and no Apify token to scrape fresh.'); process.exit(1); }
  console.log(`"${keyword}" not in snapshots — scraping fresh (~$0.50)...`);
  const url = `https://api.apify.com/v2/acts/${ACTOR}/run-sync-get-dataset-items?token=${token}`;
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ queries: keyword, countryCode: 'us', languageCode: 'en', maxPagesPerQuery: 2 }) });
  if (!res.ok) { console.error(`Apify error ${res.status}`); process.exit(1); }
  const items = await res.json();
  const organic = [], paa = [], related = []; let ai = false;
  for (const it of items) {
    for (const o of it.organicResults || []) organic.push(o);
    for (const q of it.peopleAlsoAsk || []) paa.push(q.question || q.title || q.text);
    for (const r of it.relatedQueries || []) related.push(r.title);
    if (it.aiModeResult || it.aiOverview) ai = true;
  }
  return { date: new Date().toISOString().slice(0, 10), term: keyword, aiOverview: ai,
    top10: organic.slice(0, 10).map((o) => ({ pos: o.position, domain: domainOf(o.url), url: o.url, title: o.title })),
    peopleAlsoAsk: paa, relatedQueries: related };
}

(async () => {
  let d = fromSnapshot(kw);
  const source = d ? `snapshot ${d.date} (free)` : 'fresh scrape';
  if (!d) d = await scrapeFresh(kw);

  const paa = [...new Set(d.peopleAlsoAsk || [])];
  const related = [...new Set(d.relatedQueries || [])];
  const md = [];
  md.push(`# Content brief: "${kw}"`);
  md.push(`\n_Source: ${source}. Our current rank: ${d.ourRank ? '#' + d.ourRank : 'not in top 30'}.` +
    `${d.aiOverview ? ' AI Overview is present for this query — structure for citation.' : ''}_\n`);

  md.push(`## Questions to answer directly (win these as FAQ schema)`);
  if (paa.length) paa.forEach((q) => md.push(`- ${q}`));
  else md.push('- (none returned — cover the obvious buyer questions)');

  md.push(`\n## Related terms to weave in naturally`);
  if (related.length) md.push(related.map((r) => `\`${r}\``).join(' · '));
  else md.push('_(none returned)_');

  md.push(`\n## Pages ranking now (the bar to clear)`);
  (d.top10 || []).forEach((r, i) => md.push(`${i + 1}. ${r.domain}${r.title ? ' — ' + r.title : ''}  \n   ${r.url}`));

  md.push(`\n## How to build the page`);
  md.push(`- H1 + title include the exact keyword; keep title <= 60 chars.`);
  md.push(`- Add an FAQ section answering the People Also Ask questions above, verbatim as the question, with a direct first sentence, then detail. Mark it up with FAQPage JSON-LD.`);
  md.push(`- Most competitors above are directories (yelp/thumbtack/facebook) or generic agencies — beat them with real local specificity and proof, not more words.`);
  md.push(`- Internal-link this page from the homepage body and 2-3 related pages with a natural (not keyword-stuffed) anchor.`);
  md.push(`- No em dashes. No fabricated proof. Follow PIPELINE.md Track C: DeepSeek drafts from this brief, Claude edits for voice/accuracy.`);

  if (!existsSync(BRIEF_DIR)) mkdirSync(BRIEF_DIR, { recursive: true });
  const out = join(BRIEF_DIR, `${slug}.md`);
  writeFileSync(out, md.join('\n') + '\n');
  console.log(md.join('\n'));
  console.log(`\nBrief saved: ${out}`);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
