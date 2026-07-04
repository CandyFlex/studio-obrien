#!/usr/bin/env node
/*
  build-registry.mjs — Content Registry generator for The Field Guide.

  Scans every blog/*.html page and extracts the fields that matter for two jobs:
    1. DEDUP  — before writing a new article, check title / metaDesc / topicsCovered
                so we never re-make an angle, stat, or headline that already exists.
    2. INTERLINK — see each article's cluster + who it already links to, so new
                pieces wire into the right pillar and siblings for SEO authority.

  No dependencies. Regex extraction is safe because every article is built from
  blog/article-template.html (stable class names + schema shape).

  Usage:  node production/build-registry.mjs
  Output: production/CONTENT-REGISTRY.json   (source of truth, machine-readable)
          + prints a short human summary to stdout.

  Re-run after shipping any article. The registry is derived, never hand-edited;
  richer angle notes live in the article's own <meta>/H2s, which this reads.
*/
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = join(ROOT, 'blog');

const strip = (s = '') =>
  s.replace(/<[^>]+>/g, '')
   .replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&mdash;/g, '-')
   .replace(/&middot;/g, '·').replace(/\s+/g, ' ').trim();

const first = (re, html) => { const m = html.match(re); return m ? strip(m[1]) : null; };
const all = (re, html) => { const out = []; let m; while ((m = re.exec(html))) out.push(strip(m[1])); return out; };

// --- cluster membership, parsed from the live clusters.html hub -------------
function clusterMap() {
  const map = {}; const pillars = {};
  let html;
  try { html = readFileSync(join(BLOG, 'clusters.html'), 'utf8'); } catch { return { map, pillars }; }
  for (const block of html.split('cluster-section').slice(1)) {
    const name = first(/<h2[^>]*>(.*?)<\/h2>/s, block);
    if (!name) continue;
    const pillar = block.match(/cluster-pillar[\s\S]*?href="\/blog\/([^"#]+)"/);
    if (pillar) pillars[pillar[1]] = name;
    let m; const re = /href="\/blog\/([^"#]+)"/g;
    while ((m = re.exec(block))) map[m[1]] = name;
  }
  return { map, pillars };
}

const { map: CLUSTER, pillars: PILLAR } = clusterMap();

const SKIP = new Set(['index', 'clusters', 'article-template']); // hubs + template, not articles
const GENERIC_H2 = /^(frequently asked|continue reading|sources|in 30 seconds)/i;

const files = readdirSync(BLOG).filter(f => f.endsWith('.html'));
const articles = [];

for (const file of files) {
  const slug = file.replace(/\.html$/, '');
  if (SKIP.has(slug)) continue;
  const html = readFileSync(join(BLOG, file), 'utf8');

  const canonical = first(/<link rel="canonical" href="https:\/\/studioobrien\.com\/blog\/([^"]+)"/, html) || slug;
  const title = (first(/<title>(.*?)<\/title>/s, html) || '').replace(/\s*\|\s*Studio O'Brien\s*$/, '');
  const metaDesc = first(/<meta name="description" content="([^"]*)"/, html);
  const h1 = first(/<h1[^>]*>([\s\S]*?)<\/h1>/, html);
  const category = first(/article-category[^>]*>(.*?)<\/span>/, html);
  const datePublished = first(/"datePublished":"([^"]+)"/, html);
  const topicsCovered = all(/<h2[^>]*>([\s\S]*?)<\/h2>/g, html).filter(h => h && !GENERIC_H2.test(h));

  const blogLinks = [...new Set((html.match(/href="\/blog\/([^"#?]+)"/g) || [])
    .map(h => h.replace(/^href="\/blog\//, '').replace(/"$/, '')))]
    .filter(s => s !== canonical);
  const pageLinks = [...new Set((html.match(/href="\/([^"/#?][^"#?]*)"/g) || [])
    .map(h => h.replace(/^href="\//, '').replace(/"$/, ''))
    .filter(s => s && !s.startsWith('blog/') && !s.includes('.') && !s.startsWith('http')))];

  const isPillar = !!Object.keys(PILLAR).includes(canonical) ||
    /-guide$/.test(canonical);
  const type = slug === 'editorial-standards' ? 'trust' : (isPillar ? 'pillar' : 'article');

  articles.push({
    slug: canonical, file, type,
    cluster: CLUSTER[canonical] || 'unassigned',
    title, h1, metaDesc, category, datePublished,
    titleLen: (title + " | Studio O'Brien").length,
    metaLen: metaDesc ? metaDesc.length : 0,
    topicsCovered,
    linksToArticles: blogLinks,
    linksToPages: pageLinks,
    wordCount: strip(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')).split(' ').length,
  });
}

articles.sort((a, b) => a.cluster.localeCompare(b.cluster) || a.slug.localeCompare(b.slug));

// inbound counts (who links to whom) — helps spot orphans
const inbound = {};
for (const a of articles) for (const t of a.linksToArticles) inbound[t] = (inbound[t] || 0) + 1;
for (const a of articles) a.inboundFromArticles = inbound[a.slug] || 0;

const clusters = {};
for (const a of articles) (clusters[a.cluster] ??= []).push(a.slug);

const registry = {
  generated: new Date().toISOString().slice(0, 10),
  purpose: 'Dedup + interlink source of truth for The Field Guide. Derived by build-registry.mjs — do not hand-edit; re-run after each ship.',
  count: articles.length,
  clusters,
  pillars: PILLAR,
  articles,
};

writeFileSync(join(ROOT, 'production', 'CONTENT-REGISTRY.json'), JSON.stringify(registry, null, 2));

// human summary
console.log(`Content registry: ${articles.length} pages, ${Object.keys(clusters).length} clusters`);
for (const [c, slugs] of Object.entries(clusters)) console.log(`  ${c}: ${slugs.length}`);
const orphans = articles.filter(a => a.type === 'article' && a.inboundFromArticles < 2).map(a => a.slug);
if (orphans.length) console.log(`  low-inbound (<2): ${orphans.join(', ')}`);
