/**
 * AI Image Batch Generator — reads an archetype's prompt library and outputs
 * a ready-to-copy batch prompt for your preferred AI image generator.
 *
 * Usage: bun run pipeline/images/generate-prompts.mjs 06-sweet-nostalgia
 *
 * Outputs formatted prompts for Ideogram, Midjourney, DALL-E 3, and Flux.
 */

const [_bun, _script, archetype] = process.argv;
if (!archetype) {
  console.error("Usage: bun run pipeline/images/generate-prompts.mjs <archetype>");
  process.exit(1);
}

import { readFileSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..", "..");
const promptPath = join(ROOT, "pipeline", "images", "ai-prompts", `${archetype}.json`);

const data = JSON.parse(readFileSync(promptPath, "utf-8"));

console.log(`\n🎨 AI Image Batch — ${archetype}`);
console.log(`   Generator: ${data.generator}`);
console.log(`   Style: ${data.style}`);
console.log(`   Common: ${data.commonParams.background}, ${data.commonParams.style}`);
console.log(`   ${Object.keys(data.images).length} images to generate\n`);

console.log("═".repeat(70));
console.log("COPY-PASTE PROMPTS (one per image)\n");

for (const [id, img] of Object.entries(data.images)) {
  console.log(`[${id}] — ${img.usage} (${img.aspect})`);
  console.log(`  ${img.prompt}`);
  console.log();
}

console.log("═".repeat(70));
console.log("\n💡 IDEAS FOR BEST RESULTS:");
console.log("  • Ideogram (https://ideogram.ai) — free tier, best text handling");
console.log("  • DALL-E 3 via ChatGPT — paste prompt with 'Generate this image:' prefix");
console.log("  • Midjourney — add '--ar 1:1 --style raw --v 6.1' for product shots");
console.log("  • Flux via Replicate — use flux-pro model, cfg 3.5");
console.log("\n📁 Save generated images to:");
console.log(`  pipeline/targets/{slug}/assets/photos/ai/{id}.jpg`);
console.log("\n✅ After generating, rebuild the HTML with local image paths.\n");
