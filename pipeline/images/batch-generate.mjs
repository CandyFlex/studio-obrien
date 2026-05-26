/**
 * AI Image Batch Generator — generates all images for an archetype at once.
 *
 * Supports 4 backends:
 *   huggingface (FREE — FLUX.1-schnell via HF Inference API) ★ RECOMMENDED
 *   ideogram    (FREE — 25 images/day)
 *   replicate   (Flux Pro — ~$0.05/image, highest quality)
 *   openai      (DALL-E 3 — ~$0.04/image)
 *
 * Usage:
 *   bun run pipeline/images/batch-generate.mjs 06-sweet-nostalgia butter-bloom-bakery huggingface
 *   bun run pipeline/images/batch-generate.mjs 06-sweet-nostalgia butter-bloom-bakery ideogram
 *   bun run pipeline/images/batch-generate.mjs 06-sweet-nostalgia butter-bloom-bakery replicate
 *
 * Env vars needed:
 *   HF_TOKEN             — from https://huggingface.co/settings/tokens (FREE account works)
 *   IDEOGRAM_API_KEY     — from https://ideogram.ai/manage-api
 *   REPLICATE_API_TOKEN  — from https://replicate.com/account/api-tokens
 *   OPENAI_API_KEY       — from https://platform.openai.com/api-keys
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(import.meta.dirname, "..", "..");
const TARGETS = join(ROOT, "pipeline", "targets");

const [_bun, _script, archetype, slug, backend = "huggingface"] = process.argv;
if (!archetype || !slug) {
  console.error("Usage: bun run pipeline/images/batch-generate.mjs <archetype> <slug> [huggingface|ideogram|replicate|openai]");
  process.exit(1);
}

// ── Load prompts ──
const promptPath = join(ROOT, "pipeline", "images", "ai-prompts", `${archetype}.json`);
if (!existsSync(promptPath)) {
  console.error(`Prompts not found: ${promptPath}`);
  process.exit(1);
}
const data = JSON.parse(readFileSync(promptPath, "utf-8"));
const prompts = data.images;
const total = Object.keys(prompts).length;

console.log(`\n🎨 Batch Generate — ${total} images for ${slug}`);
console.log(`   Archetype: ${archetype} | Backend: ${backend}`);
console.log(`   Style: ${data.style}\n`);

// ── Output dir ──
const outDir = join(TARGETS, slug, "assets", "photos", "ai");
mkdirSync(outDir, { recursive: true });

// ── Backend: Hugging Face (FLUX.1-schnell — FREE, Apache 2.0) ──
async function generateHuggingFace(prompt) {
  const token = process.env.HF_TOKEN;
  if (!token) throw new Error("HF_TOKEN not set. Get one FREE at https://huggingface.co/settings/tokens");
  
  // Use HF Router (newer endpoint — api-inference.huggingface.co may not resolve)
  const res = await fetch(
    "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 4,
          guidance_scale: 0,
          width: 1024,
          height: 1024,
        },
      }),
      signal: AbortSignal.timeout(90000),
    }
  );
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HF API ${res.status}: ${err.slice(0, 200)}`);
  }
  
  const buffer = Buffer.from(await res.arrayBuffer());
  return buffer;
}

// ── Backend: Ideogram ──
async function generateIdeogram(prompt, aspectRatio = "ASPECT_1_1") {
  const key = process.env.IDEOGRAM_API_KEY;
  if (!key) throw new Error("IDEOGRAM_API_KEY not set. Get one at https://ideogram.ai/manage-api");
  
  const res = await fetch("https://api.ideogram.ai/generate", {
    method: "POST",
    headers: { "Api-Key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      image_request: {
        prompt,
        aspect_ratio: aspectRatio,
        model: "V_2", // latest
        magic_prompt_option: "AUTO",
        style_type: "REALISTIC",
      },
    }),
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ideogram API ${res.status}: ${err}`);
  }
  
  const json = await res.json();
  return json.data[0]?.url || null;
}

// ── Backend: Replicate (Flux Pro) ──
async function generateReplicate(prompt, aspectRatio = "1:1") {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN not set. Get one at https://replicate.com/account/api-tokens");
  
  // Map aspect: square -> 1:1, landscape -> 16:9
  const ar = aspectRatio === "ASPECT_1_1" ? "1:1" : "16:9";
  
  const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-pro-1.1/predictions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: ar,
        output_format: "jpg",
        output_quality: 90,
        safety_tolerance: 5,
      },
    }),
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Replicate API ${res.status}: ${err}`);
  }
  
  const json = await res.json();
  return json.output || null;
}

// ── Backend: OpenAI DALL-E 3 ──
async function generateOpenAI(prompt, size = "1024x1024") {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY not set");
  
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size,
      quality: "hd",
      style: "natural",
    }),
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API ${res.status}: ${err}`);
  }
  
  const json = await res.json();
  return json.data[0]?.url || null;
}

// ── Download image ──
async function downloadImage(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(filepath, buffer);
  return filepath;
}

// ── Map aspect ──
function getAspect(aspect) {
  if (aspect === "landscape") return "ASPECT_16_9";
  if (aspect === "portrait") return "ASPECT_9_16";
  return "ASPECT_1_1";
}

// ── Pick generator ──
const backendFn = backend === "replicate" ? "replicate"
  : backend === "openai" ? "openai"
  : backend === "ideogram" ? "ideogram"
  : "huggingface";

let completed = 0;
const results = {};

for (const [id, img] of Object.entries(prompts)) {
  const aspectOpt = getAspect(img.aspect || "square");
  console.log(`[${++completed}/${total}] Generating ${id}...`);
  console.log(`   "${img.prompt.slice(0, 90)}..."`);
  
  try {
    let url, buffer;
    
    if (backendFn === "huggingface") {
      buffer = await generateHuggingFace(img.prompt);
    } else {
      const genFn = backendFn === "replicate" ? generateReplicate
        : backendFn === "openai" ? generateOpenAI
        : generateIdeogram;
      url = await genFn(img.prompt, aspectOpt);
    }
    
    const filepath = join(outDir, `${id}.jpg`);
    
    if (buffer) {
      writeFileSync(filepath, buffer);
    } else if (url) {
      await downloadImage(url, filepath);
    } else {
      console.log(`   ⚠ No image returned — skipping\n`);
      continue;
    }
    
    results[id] = filepath;
    console.log(`   ✅ Saved ${id}.jpg\n`);
  } catch (err) {
    console.log(`   ❌ ${err.message}\n`);
  }
  
  // Rate limit for free tiers
  if (backendFn === "ideogram" && completed < total) {
    await new Promise(r => setTimeout(r, 1500));
  }
  // HF free tier: be gentle
  if (backendFn === "huggingface" && completed < total) {
    await new Promise(r => setTimeout(r, 2000));
  }
}

// ── Write manifest ──
const manifestPath = join(TARGETS, slug, "image-candidates.json");
const manifest = {
  generatedAt: new Date().toISOString(),
  backend,
  archetype,
  slug,
  images: Object.entries(results).map(([id, path]) => ({
    id,
    localPath: `targets/${slug}/assets/photos/ai/${id}.jpg`,
    fullPath: path,
  })),
};

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`\n✅ Done! ${Object.keys(results).length}/${total} images generated.`);
console.log(`   Manifest: ${manifestPath}`);
console.log(`   Images: ${outDir}\n`);
