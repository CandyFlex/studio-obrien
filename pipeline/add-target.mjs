#!/usr/bin/env bun
/**
 * add-target.mjs - Quickly add a new business to the pipeline
 *
 * Usage: bun run pipeline/add-target.mjs
 *
 * Interactive prompt that creates the target folder structure,
 * seed data, and initial files. Then you run harvest.mjs on it.
 */

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import * as readline from "readline";

const PIPELINE_DIR = join(import.meta.dir, "targets");

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("\n=== Add New Pipeline Target ===\n");

  const name = await ask(rl, "Business name: ");
  const slug = slugify(name);
  const city = await ask(rl, "City (e.g. Forest City): ");
  const address = await ask(rl, "Full address (or 'unknown'): ");
  const phone = await ask(rl, "Phone (or 'unknown'): ");
  const industry = await ask(rl, "Industry (e.g. Restaurant / Bar): ");

  console.log("\n--- Online Presence (leave blank if none) ---");
  const yelp = await ask(rl, "Yelp URL: ");
  const tripadvisor = await ask(rl, "TripAdvisor URL: ");
  const facebook = await ask(rl, "Facebook page name: ");
  const instagram = await ask(rl, "Instagram URL: ");
  const existingSite = await ask(rl, "Existing website URL (if any, even bad ones): ");

  console.log("\n--- Qualification ---");
  const noSite = await ask(rl, "No website or bad free-builder site? (y/n): ");
  const independent = await ask(rl, "Independently owned, not franchise? (y/n): ");
  const physical = await ask(rl, "Has physical location? (y/n): ");
  const social = await ask(rl, "Active on at least one social platform? (y/n): ");
  const visual = await ask(rl, "Visually interesting industry for portfolio? (y/n): ");

  const score = [noSite, independent, physical, social, visual].filter(
    (a) => a.toLowerCase() === "y"
  ).length;

  console.log(`\nQualification score: ${score}/5`);
  if (score < 4) {
    console.log("Warning: Target scores below 4/5. Consider a different business.");
  }

  const notes = await ask(rl, "\nAny notes about this business: ");

  rl.close();

  // Create directory structure
  const targetDir = join(PIPELINE_DIR, slug);
  if (existsSync(targetDir)) {
    console.error(`\nTarget already exists: ${slug}`);
    process.exit(1);
  }

  const dirs = [
    targetDir,
    join(targetDir, "assets"),
    join(targetDir, "assets", "photos"),
    join(targetDir, "assets", "originals"),
  ];
  dirs.forEach((d) => mkdirSync(d, { recursive: true }));

  // Write seed file (for harvest.mjs to use)
  const seed = {
    name,
    slug,
    city,
    state: "NC",
    address: address === "unknown" ? null : address,
    phone: phone === "unknown" ? null : phone,
    industry,
    yelp: yelp || null,
    tripadvisor: tripadvisor || null,
    facebook: facebook || null,
    instagram: instagram || null,
    existingSite: existingSite || null,
    googleSearch: `${name} ${city} NC`,
    qualification: { noSite, independent, physical, social, visual, score },
    notes,
    dateAdded: new Date().toISOString().split("T")[0],
  };

  writeFileSync(join(targetDir, "seed.json"), JSON.stringify(seed, null, 2));

  // Write initial notes
  writeFileSync(
    join(targetDir, "notes.md"),
    `# ${name}\nAdded: ${seed.dateAdded}\nScore: ${score}/5\n\n## Notes\n${notes}\n\n## To Do\n- [ ] Run harvest script\n- [ ] Review downloaded assets\n- [ ] Complete verify checklist\n- [ ] Fill in profile.json\n- [ ] Build mock site\n`
  );

  console.log(`\n=== Target created: ${slug} ===`);
  console.log(`Directory: pipeline/targets/${slug}/`);
  console.log(`\nNext step: Add this target's seed data to harvest.mjs,`);
  console.log(`then run: bun run pipeline/harvest.mjs ${slug}`);
  console.log(
    `\nOr manually collect assets and fill in profile.json to skip straight to building.`
  );
}

main();
