/**
 * Image Sourcing Helper — searches free image APIs for mock site photos.
 *
 * Usage: bun run pipeline/images/source.mjs <archetype> <business-slug>
 * Example: bun run pipeline/images/source.mjs 06-sweet-nostalgia butter-bloom-bakery
 *
 * This script reads the archetype image manifest and searches Pexels + Pixabay
 * for candidate images. It outputs image-candidates.json with top matches
 * per slot, ready for the aesthetic-engine to embed.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..", "..");
const TARGETS = join(ROOT, "pipeline", "targets");
const IMAGES = join(ROOT, "pipeline", "images");

// ── Args ──
const [_bun, _script, archetype, slug] = process.argv;
if (!archetype || !slug) {
  console.error("Usage: bun run pipeline/images/source.mjs <archetype> <business-slug>");
  console.error("Example: bun run pipeline/images/source.mjs 06-sweet-nostalgia butter-bloom-bakery");
  process.exit(1);
}

// ── Load Manifest ──
const manifestPath = join(IMAGES, `${archetype}-manifest.json`);
if (!existsSync(manifestPath)) {
  console.error(`Manifest not found: ${manifestPath}`);
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

// ── Pexels Search ──
async function searchPexels(query, count = 10) {
  const PEXELS_KEY = process.env.PEXELS_API_KEY || "";
  if (!PEXELS_KEY) {
    console.warn("  ⚠ No PEXELS_API_KEY — using curated search via web fetch");
    return [];
  }
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
    const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
    const data = await res.json();
    return (data.photos || []).map(p => ({
      url: p.src.large2x || p.src.large,
      thumb: p.src.medium,
      source: "pexels",
      photographer: p.photographer,
      photographerUrl: p.photographer_url,
      width: p.width,
      height: p.height,
      avgColor: p.avg_color,
      alt: p.alt || "",
    }));
  } catch (e) {
    console.warn(`  ⚠ Pexels search failed for "${query}": ${e.message}`);
    return [];
  }
}

// ── Pixabay Search ──
async function searchPixabay(query, count = 10) {
  const PIXABAY_KEY = process.env.PIXABAY_API_KEY || "";
  if (!PIXABAY_KEY) {
    console.warn("  ⚠ No PIXABAY_API_KEY — skipping Pixabay");
    return [];
  }
  try {
    const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&per_page=${count}&orientation=horizontal&safesearch=true`;
    const res = await fetch(url);
    const data = await res.json();
    return (data.hits || []).map(h => ({
      url: h.largeImageURL,
      thumb: h.webformatURL,
      source: "pixabay",
      photographer: h.user,
      photographerUrl: `https://pixabay.com/users/${h.user}-${h.user_id}/`,
      width: h.imageWidth,
      height: h.imageHeight,
      tags: h.tags,
    }));
  } catch (e) {
    console.warn(`  ⚠ Pixabay search failed for "${query}": ${e.message}`);
    return [];
  }
}

// ── Combine & Dedupe ──
async function searchAll(query, count = 15) {
  const [pexels, pixabay] = await Promise.all([
    searchPexels(query, count),
    searchPixabay(query, count),
  ]);
  // Dedupe by URL
  const seen = new Set();
  const combined = [...pexels, ...pixabay].filter(img => {
    if (seen.has(img.url)) return false;
    seen.add(img.url);
    return true;
  });
  return combined.slice(0, count);
}

// ── Score Image ──
function scoreImage(img, slot, query) {
  let score = 5;
  // Prefer higher resolution
  if (img.width >= 1400) score += 1;
  else if (img.width < 800) score -= 1;
  // Prefer landscape for hero/gallery
  if (img.width > img.height) score += 0.5;
  // Prefer photos with alt text
  if (img.alt && img.alt.length > 10) score += 0.5;
  return Math.min(10, Math.max(1, Math.round(score)));
}

// ── Main ──
console.log(`\n🔍 Image Agent — sourcing photos for ${slug}`);
console.log(`   Archetype: ${manifest.archetype} — ${manifest.description}`);
console.log(`   Image slots: ${manifest.images.length}\n`);

const results = { searchedAt: new Date().toISOString(), images: [] };
const outputDir = join(TARGETS, slug, "assets", "photos");
mkdirSync(outputDir, { recursive: true });

for (const slot of manifest.images) {
  console.log(`📸 ${slot.id} (${slot.role})`);
  const allCandidates = [];

  for (const term of slot.searchTerms) {
    console.log(`   Searching: "${term}"...`);
    const hits = await searchAll(term, 8);
    hits.forEach(img => {
      img._score = scoreImage(img, slot, term);
      img._query = term;
    });
    allCandidates.push(...hits);
  }

  // Dedupe by URL, sort by score
  const seen = new Set();
  const unique = allCandidates.filter(img => {
    if (seen.has(img.url)) return false;
    seen.add(img.url);
    return true;
  });
  unique.sort((a, b) => b._score - a._score);
  const top = unique.slice(0, 5);

  results.images.push({
    id: slot.id,
    role: slot.role,
    priority: slot.priority,
    recommended: top[0] ? {
      url: top[0].url,
      source: top[0].source,
      photographer: top[0].photographer,
      score: top[0]._score,
      notes: `${top[0].width}x${top[0].height} — ${top[0].source}`,
    } : null,
    candidates: top.map(img => ({
      url: img.url,
      thumb: img.thumb || img.url,
      source: img.source,
      photographer: img.photographer,
      photographerUrl: img.photographerUrl,
      width: img.width,
      height: img.height,
      score: img._score,
      query: img._query,
    })),
  });

  const found = top.length;
  console.log(`   ✓ Found ${found} candidates (top score: ${top[0]?._score || "N/A"})\n`);
}

// ── Write Results ──
const outPath = join(TARGETS, slug, "image-candidates.json");
writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`✅ Image candidates written to ${outPath}`);
console.log(`   Total images found: ${results.images.reduce((sum, s) => sum + s.candidates.length, 0)}\n`);
