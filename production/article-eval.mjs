#!/usr/bin/env node
// article-eval.mjs — deterministic AEO/GEO/SEO gate for Field Guide articles.
// Usage: node production/article-eval.mjs blog/<slug>.html [--keyword "primary phrase"] [--json]
// FAIL = blocks ship. WARN = fix or justify in the ship note. Doctrine: production/ARTICLE-ENGINE.md

import fs from "node:fs";

const file = process.argv[2];
const kwIdx = process.argv.indexOf("--keyword");
const keyword = kwIdx > -1 ? (process.argv[kwIdx + 1] || "").toLowerCase() : null;
const asJson = process.argv.includes("--json");
if (!file) { console.error("usage: article-eval.mjs <blog/slug.html> [--keyword \"...\"] [--json]"); process.exit(1); }

const html = fs.readFileSync(file, "utf8");
const results = [];
const add = (group, id, level, ok, msg) => results.push({ group, id, level, ok, msg });

// ---------- extraction helpers ----------
const grab = (re) => { const m = html.match(re); return m ? m[1] : null; };
const decode = (s) => (s || "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&middot;/g, "·").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–");
const stripTags = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// article body region: prefer .article-body blocks, else <main>, else body
let bodyHtml = "";
const abBlocks = html.match(/<div class="article-body"[\s\S]*?(?=<footer|<div class="std-signed|$)/gi);
if (abBlocks) bodyHtml = abBlocks.join("\n");
else bodyHtml = grab(/<main[\s\S]*?<\/main>/i) ? html.match(/<main[\s\S]*?<\/main>/i)[0] : html;
const bodyText = decode(stripTags(bodyHtml));
const words = bodyText.split(/\s+/).filter(Boolean).length;

// ---------- SEO ----------
const title = decode(grab(/<title>([\s\S]*?)<\/title>/i) || "");
add("SEO", "title-present", "fail", !!title, title ? `title: "${title}" (${title.length} chars)` : "no <title>");
if (title) add("SEO", "title-length", "warn", title.length <= 60, `title is ${title.length} chars (target <60)`);
if (title && keyword) add("SEO", "title-keyword", "warn", title.toLowerCase().includes(keyword), `primary keyword ${title.toLowerCase().includes(keyword) ? "found" : "MISSING"} in title`);

const meta = decode(grab(/<meta name="description" content="([\s\S]*?)"/i) || "");
add("SEO", "meta-present", "fail", !!meta, meta ? `meta description ${meta.length} chars` : "no meta description");
if (meta) add("SEO", "meta-length", "warn", meta.length >= 120 && meta.length <= 165, `meta is ${meta.length} chars (target 140-160)`);

add("SEO", "canonical", "fail", /<link rel="canonical" href="https:\/\/studioobrien\.com\/blog\//.test(html), "canonical to https://studioobrien.com/blog/... " + (/<link rel="canonical"/.test(html) ? "ok" : "MISSING"));
const h1s = (html.match(/<h1[\s>]/gi) || []).length;
add("SEO", "h1-single", "fail", h1s === 1, `${h1s} <h1> tags (need exactly 1)`);
add("SEO", "wordcount", words >= 800 ? "warn" : "fail", words >= 1100, `${words} words in body (target 1200-2000)`);

const internalLinks = (bodyHtml.match(/href="\/(?!\/)[^"]*"/g) || []).length;
add("SEO", "internal-links", "fail", internalLinks >= 3, `${internalLinks} internal links in body (need >=3 incl. one pillar)`);

add("SEO", "schema-blogposting", "fail", /"@type":\s*"BlogPosting"/.test(html), "BlogPosting schema " + (/"@type":\s*"BlogPosting"/.test(html) ? "present" : "MISSING"));
add("SEO", "schema-breadcrumb", "fail", /"@type":\s*"BreadcrumbList"/.test(html), "BreadcrumbList schema " + (/"@type":\s*"BreadcrumbList"/.test(html) ? "present" : "MISSING"));
add("SEO", "author-url", "fail", /"author"[\s\S]{0,400}?studioobrien\.com\/about/.test(html), "schema author.url -> /about " + (/"author"[\s\S]{0,400}?studioobrien\.com\/about/.test(html) ? "ok" : "MISSING"));
add("SEO", "date-published", "fail", /"datePublished"/.test(html), '"datePublished" ' + (/"datePublished"/.test(html) ? "present" : "MISSING"));

const imgs = [...bodyHtml.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
const noAlt = imgs.filter((t) => !/alt="[^"]+"/.test(t)).length;
const nonWebp = imgs.filter((t) => /src="[^"]+\.(?:jpe?g|png|gif)/i.test(t)).length;
const hotlinked = imgs.filter((t) => /src="https?:\/\/(?!studioobrien\.com)/i.test(t)).length;
if (imgs.length) {
  add("SEO", "img-alt", "fail", noAlt === 0, `${noAlt}/${imgs.length} body images missing alt text`);
  add("SEO", "img-webp", "warn", nonWebp === 0, `${nonWebp}/${imgs.length} body images not .webp`);
  add("SEO", "img-selfhost", "warn", hotlinked === 0, `${hotlinked}/${imgs.length} body images hotlinked off-site`);
} else add("SEO", "img-any", "warn", false, "no images in body (spec wants a local hero image)");

// ---------- AEO ----------
const h2s = [...bodyHtml.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => decode(stripTags(m[1])));
const questionH2s = h2s.filter((h) => /\?\s*$/.test(h)).length;
add("AEO", "question-h2s", "warn", questionH2s >= 2, `${questionH2s}/${h2s.length} H2s are question-shaped (target >=2, mirror People Also Ask)`);

const firstP = grab(/<div class="article-body"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) || grab(/<main[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i) || "";
const firstPWords = decode(stripTags(firstP)).split(/\s+/).filter(Boolean).length;
add("AEO", "answer-first", "warn", firstPWords > 0 && firstPWords <= 85, `opening paragraph is ${firstPWords} words (target <=85: front-load the answer)`);
if (keyword) add("AEO", "keyword-early", "warn", decode(stripTags(firstP)).toLowerCase().includes(keyword) || bodyText.toLowerCase().slice(0, 600).includes(keyword), "primary keyword " + ((decode(stripTags(firstP)).toLowerCase().includes(keyword) || bodyText.toLowerCase().slice(0, 600).includes(keyword)) ? "appears" : "MISSING") + " in the opening");

const hasFaqSchema = /"@type":\s*"FAQPage"/.test(html);
const hasFaqBlock = /class="[^"]*faq|<details/i.test(bodyHtml);
add("AEO", "faq", "warn", hasFaqSchema || hasFaqBlock, `FAQ ${hasFaqSchema ? "schema" : hasFaqBlock ? "block (no schema)" : "MISSING (feeds PAA + rich results)"}`);
add("AEO", "enumerable", "warn", /<(ul|ol|table)\b/i.test(bodyHtml), (/<(ul|ol|table)\b/i.test(bodyHtml) ? "has" : "no") + " list/table (snippet-extractable structure)");

// ---------- GEO ----------
const extCites = (bodyHtml.match(/href="https?:\/\/(?!studioobrien\.com)[^"]+"/g) || []).length;
const sups = (bodyHtml.match(/<sup/gi) || []).length;
add("GEO", "citations", "warn", extCites + sups >= 2, `${extCites} external source links + ${sups} sup markers (target >=2 named sources)`);
add("GEO", "sources-callout", "warn", /sources/i.test(bodyText.slice(-1500)) || /Sources<\/h/i.test(bodyHtml), "closing sources callout " + ((/sources/i.test(bodyText.slice(-1500))) ? "present" : "not detected"));
add("GEO", "first-hand", "warn", /(I see|we see|what I('| a)m seeing|in Cleveland County|around Shelby|our clients|at the studio|I('| ha)ve watched)/i.test(bodyText), "first-hand local observation " + (/(I see|we see|in Cleveland County|around Shelby|our clients|at the studio)/i.test(bodyText) ? "detected" : "NOT detected (GEO needs something no aggregator has)"));
add("GEO", "entity-line", "warn", /Studio O'?Brien/i.test(bodyText) && /Shelby/i.test(bodyText), "entity clarity (Studio O'Brien + Shelby in body) " + (/Studio O'?Brien/i.test(bodyText) && /Shelby/i.test(bodyText) ? "ok" : "MISSING"));
add("GEO", "date-modified", "warn", /"dateModified"/.test(html), '"dateModified" ' + (/"dateModified"/.test(html) ? "present (freshness signal)" : "MISSING"));

// ---------- Voice ----------
const emDashes = (bodyText.match(/—/g) || []).length;
add("Voice", "em-dash", "fail", emDashes === 0, `${emDashes} em dash(es) in body (hard ban)`);
const enDashes = (bodyText.match(/–/g) || []).length;
add("Voice", "en-dash", "warn", enDashes === 0, `${enDashes} en dash(es) (allowed only in numeric ranges; verify)`);
const banned = ["serves as", "stands as", "is a testament", "pivotal", "crucial role", "underscores", "evolving landscape", "in today's world", "let's dive", "it's worth noting", "ensuring success", "delve into", "game-changer", "in the digital age"];
const hits = banned.filter((b) => bodyText.toLowerCase().includes(b));
add("Voice", "banned-phrases", "fail", hits.length === 0, hits.length ? `banned phrases: ${hits.join("; ")}` : "no banned phrases");
const bangs = (bodyText.match(/!/g) || []).length;
add("Voice", "exclamations", "warn", bangs <= 1, `${bangs} exclamation points (keep <=1)`);
add("Voice", "unsourced-stat-markers", "fail", !/\[STAT/i.test(bodyText), /\[STAT/i.test(bodyText) ? "unresolved [STAT] placeholder left in copy" : "no unresolved stat placeholders");

// ---------- report ----------
const fails = results.filter((r) => r.level === "fail" && !r.ok);
const warns = results.filter((r) => r.level === "warn" && !r.ok);
const passes = results.filter((r) => r.ok);

if (asJson) {
  console.log(JSON.stringify({ file, words, fails: fails.length, warns: warns.length, passes: passes.length, results }, null, 2));
} else {
  console.log(`\narticle-eval: ${file} (${words} words)\n`);
  for (const g of ["SEO", "AEO", "GEO", "Voice"]) {
    console.log(`-- ${g} --`);
    for (const r of results.filter((x) => x.group === g)) {
      const mark = r.ok ? "PASS" : r.level === "fail" ? "FAIL" : "WARN";
      console.log(`  [${mark}] ${r.id}: ${r.msg}`);
    }
  }
  console.log(`\n${passes.length} pass / ${warns.length} warn / ${fails.length} fail ${fails.length ? "-> BLOCKED" : warns.length ? "-> fix or justify warns" : "-> clean"}`);
}
process.exit(fails.length ? 2 : 0);
