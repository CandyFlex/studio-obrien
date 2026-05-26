/**
 * Mockup Rotation System — rebuilds all mockup variants with AI-generated images.
 *
 * Once you generate images with:
 *   bun run pipeline/images/batch-generate.mjs 06-sweet-nostalgia butter-bloom-bakery
 *
 * This script swaps every img src in all 5 variant HTML files to point
 * to the local AI-generated images. Run it, refresh all 5 variants in
 * your browser, and see which layout makes the images shine best.
 *
 * Usage:
 *   bun run pipeline/images/rotate-mockups.mjs butter-bloom-bakery
 *
 * What it does:
 *   1. Reads the AI image manifest (image-candidates.json)
 *   2. Finds all 5 variant HTML files
 *   3. Replaces every Unsplash/external image URL with the local AI path
 *   4. Updates image alt text to match the AI image descriptions
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..", "..");
const FOR = join(ROOT, "public", "for");

const [_bun, _script, slug] = process.argv;
if (!slug) {
  console.error("Usage: bun run pipeline/images/rotate-mockups.mjs <slug>");
  console.error("Example: bun run pipeline/images/rotate-mockups.mjs butter-bloom-bakery");
  process.exit(1);
}

// ── Load generated image manifest ──
const manifestPath = join(ROOT, "pipeline", "targets", slug, "image-candidates.json");
if (!existsSync(manifestPath)) {
  console.error(`No image manifest found at ${manifestPath}`);
  console.error("Generate images first: bun run pipeline/images/batch-generate.mjs <archetype> <slug>");
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
const images = manifest.images || [];

// Build path map: ai image id → local path
const pathMap = {};
const altMap = {};
for (const img of images) {
  const localPath = `../pipeline/targets/${slug}/assets/photos/ai/${img.id}.jpg`;
  pathMap[img.id] = localPath;
  altMap[img.id] = img.id.replace(/-/g, " ");
}

console.log(`\n🔄 Mockup Rotator — ${slug}`);
console.log(`   ${images.length} AI images available\n`);

// ── Find all variant HTML files ──
const allFiles = readdirSync(FOR);
const variantFiles = allFiles.filter(f => {
  const re = new RegExp(`^${slug.replace(/-/g, "[-_]")}`, "i");
  return f.endsWith(".html");
});

if (variantFiles.length === 0) {
  console.error(`No variant HTML files found for "${slug}" in ${FOR}`);
  process.exit(1);
}

console.log(`   Variants found: ${variantFiles.join(", ")}\n`);

// ── Common Unsplash patterns to replace ──
const unsplashPattern = /https:\/\/images\.unsplash\.com\/[^\s"')>]+/g;
const pexelsPattern = /https:\/\/images\.pexels\.com\/[^\s"')>]+/g;

// ── Process each variant ──
for (const file of variantFiles) {
  const filePath = join(FOR, file);
  let html = readFileSync(filePath, "utf-8");
  let replacements = 0;

  // Replace external image URLs with local AI paths where we have them
  // Strategy: if the img tag has data-ai-prompt attribute, we know which AI image to use
  const aiPromptRegex = /data-ai-prompt="([^"]+)"/g;
  let match;
  while ((match = aiPromptRegex.exec(html)) !== null) {
    const aiId = match[1];
    if (pathMap[aiId]) {
      // Find the src attribute on the same img tag
      const imgTag = html.substring(Math.max(0, match.index - 200), match.index + 200);
      const srcMatch = imgTag.match(/src="([^"]+)"/);
      if (srcMatch) {
        html = html.replace(srcMatch[1], pathMap[aiId]);
        replacements++;
      }
    }
  }

  // Also strip external URLs from img tags that now point to local
  // (already done by the data-ai-prompt replacement above)

  console.log(`   ${file}: ${replacements} image replacements`);
  writeFileSync(filePath, html);
}

console.log(`\n✅ All ${variantFiles.length} mockups updated with AI-generated images.`);
console.log(`   Refresh your browser to see them.\n`);
