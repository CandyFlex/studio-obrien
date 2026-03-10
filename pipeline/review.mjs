#!/usr/bin/env bun
/**
 * review.mjs - Interactive design review launcher for a pipeline target
 *
 * Usage:
 *   bun run pipeline/review.mjs <business-slug>
 *
 * What it does:
 *   1. Opens the scraped assets folder in Windows Explorer
 *   2. Opens the mock site in the browser
 *   3. Prints the current changelog status
 *   4. Shows available images with basic info
 *   5. Creates/updates the changelog file
 */

import { existsSync, readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join, extname } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dir, "..");
const TARGETS_DIR = join(import.meta.dir, "targets");
const MOCK_DIR = join(ROOT, "public", "mock-sites");

const slug = process.argv[2];

if (!slug) {
  console.log("\n  Usage: bun run pipeline/review.mjs <business-slug>\n");
  // List available targets
  const targets = readdirSync(TARGETS_DIR).filter(d => {
    const p = join(TARGETS_DIR, d);
    return statSync(p).isDirectory() && existsSync(join(p, "profile.json"));
  });
  console.log("  Available targets:");
  for (const t of targets) {
    const hasMock = existsSync(join(MOCK_DIR, `${t}.html`));
    const hasLog = existsSync(join(TARGETS_DIR, t, "changelog.md"));
    const status = hasLog ? "IN REVIEW" : hasMock ? "NEEDS REVIEW" : "NO MOCK SITE";
    console.log(`    ${t.padEnd(24)} ${status}`);
  }
  process.exit(0);
}

const targetDir = join(TARGETS_DIR, slug);
const assetsDir = join(targetDir, "assets");
const originalsDir = join(assetsDir, "originals");
const gbpDir = join(assetsDir, "gbp");
const mockSite = join(MOCK_DIR, `${slug}.html`);
const changelogPath = join(targetDir, "changelog.md");
const profilePath = join(targetDir, "profile.json");

// Verify target exists
if (!existsSync(targetDir)) {
  console.error(`\n  Target not found: ${slug}`);
  console.error(`  Expected: ${targetDir}\n`);
  process.exit(1);
}

// ---- Print header ----
console.log(`\n${"=".repeat(60)}`);
console.log(`  DESIGN REVIEW: ${slug}`);
console.log(`${"=".repeat(60)}\n`);

// ---- Show profile summary ----
if (existsSync(profilePath)) {
  try {
    const profile = JSON.parse(readFileSync(profilePath, "utf-8"));
    console.log(`  Business:  ${profile.business?.name || "Unknown"}`);
    console.log(`  Industry:  ${profile.business?.industry || "Unknown"}`);
    console.log(`  Location:  ${profile.business?.location?.address || "Unknown"}`);
    console.log(`  Phone:     ${profile.business?.phone || "Unknown"}`);
    console.log(`  Ready:     ${profile.meta?.readyToBuild ? "YES" : "NO"}`);
    console.log();
  } catch {}
}

// ---- Catalog scraped images ----
const imageExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
let imageFiles = [];

if (existsSync(originalsDir)) {
  imageFiles = readdirSync(originalsDir)
    .filter(f => imageExts.includes(extname(f).toLowerCase()))
    .map(f => {
      const fp = join(originalsDir, f);
      const st = statSync(fp);
      return { name: f, size: st.size, path: fp };
    })
    .sort((a, b) => b.size - a.size); // largest first
}

// ---- Also catalog GBP images ----
let gbpFiles = [];
if (existsSync(gbpDir)) {
  gbpFiles = readdirSync(gbpDir)
    .filter(f => imageExts.includes(extname(f).toLowerCase()))
    .map(f => {
      const fp = join(gbpDir, f);
      const st = statSync(fp);
      return { name: f, size: st.size, path: fp, source: "gbp" };
    })
    .sort((a, b) => b.size - a.size);
}

console.log(`  SOCIAL SCRAPE IMAGES: ${imageFiles.length} files (assets/originals/)`);
console.log(`  GOOGLE BIZ IMAGES:    ${gbpFiles.length} files (assets/gbp/)`);
console.log(`  ${"─".repeat(50)}`);

if (gbpFiles.length > 0) {
  console.log("  [GBP] Top images by size:");
  for (const img of gbpFiles.slice(0, 20)) {
    const kb = (img.size / 1024).toFixed(0).padStart(6);
    console.log(`    ${kb} KB  ${img.name}`);
  }
  if (gbpFiles.length > 20) console.log(`    ... and ${gbpFiles.length - 20} more`);
  console.log();
}

if (imageFiles.length > 0) {
  console.log("  [Social] Images:");
  for (const img of imageFiles) {
    const kb = (img.size / 1024).toFixed(0).padStart(6);
    console.log(`    ${kb} KB  ${img.name}`);
  }
} else if (gbpFiles.length === 0) {
  console.log("  (no images found - run scrape-gbp.mjs or scrape-socials.mjs first)");
}
console.log();

// ---- Show/create changelog ----
if (!existsSync(changelogPath)) {
  const starter = `# Design Changelog: ${slug}
Started: ${new Date().toISOString().split("T")[0]}
Status: ROUND 1

## How This Works
Each round: review the site, list specific changes needed, implement them,
screenshot and verify. Target 10+ edits before the site is "cleared."

Edits should focus on:
- Visual density and texture
- Real image integration (replace placeholders)
- Typography hierarchy and spacing
- Color refinement and contrast
- Section composition and balance
- Mobile responsiveness
- Copy accuracy and voice
- Animation and hover states
- Overall polish and uniqueness

## Image Assets Available
${imageFiles.map(f => `- [ ] ${f.name} (${(f.size/1024).toFixed(0)} KB)`).join("\n")}

---

## Round 1
Date: ${new Date().toISOString().split("T")[0]}

### Edits Requested
1.
2.
3.
4.
5.

### Edits Completed
(filled in after implementation)

### Screenshot Taken
- [ ] Desktop (1440x900)
- [ ] Mobile (375px)
- [ ] Approved by owner: Y/N

---
`;
  writeFileSync(changelogPath, starter);
  console.log(`  CHANGELOG: Created new changelog`);
} else {
  const log = readFileSync(changelogPath, "utf-8");
  // Count rounds
  const rounds = (log.match(/## Round \d+/g) || []).length;
  // Count completed edits
  const completed = (log.match(/\[x\]/gi) || []).length;
  const pending = (log.match(/\[ \]/g) || []).length;
  // Get status
  const statusMatch = log.match(/Status: (.+)/);
  const status = statusMatch ? statusMatch[1] : "UNKNOWN";

  console.log(`  CHANGELOG: ${rounds} round(s), ${completed} done, ${pending} pending`);
  console.log(`  Status: ${status}`);
}
console.log();

// ---- Show mock site status ----
if (existsSync(mockSite)) {
  const st = statSync(mockSite);
  console.log(`  MOCK SITE: ${slug}.html (${(st.size/1024).toFixed(0)} KB)`);
} else {
  console.log(`  MOCK SITE: NOT BUILT YET`);
}
console.log();

// ---- Open assets folders in Explorer ----
// Open GBP folder first (better images), then originals
const foldersToOpen = [];
if (existsSync(gbpDir) && gbpFiles.length > 0) foldersToOpen.push(gbpDir);
if (existsSync(originalsDir) && imageFiles.length > 0) foldersToOpen.push(originalsDir);
if (foldersToOpen.length === 0 && existsSync(assetsDir)) foldersToOpen.push(assetsDir);

for (const folder of foldersToOpen) {
  console.log(`  Opening: ${folder.replace(ROOT, "").replace(/\\/g, "/")}`);
  try {
    execSync(`explorer "${folder.replace(/\//g, "\\")}"`, { stdio: "ignore" });
  } catch {}
}

// ---- Open mock site in browser ----
if (existsSync(mockSite)) {
  console.log(`  Opening mock site in browser...`);
  try {
    // Try dev server first (port 4000)
    execSync(`start http://localhost:4000/mock-sites/${slug}.html`, { stdio: "ignore", shell: true });
  } catch {
    // Fall back to file URL
    try {
      execSync(`start "" "${mockSite.replace(/\//g, "\\")}"`, { stdio: "ignore", shell: true });
    } catch {}
  }
}

console.log();
console.log(`  FILES:`);
console.log(`    Assets:    pipeline/targets/${slug}/assets/originals/`);
console.log(`    Changelog: pipeline/targets/${slug}/changelog.md`);
console.log(`    Profile:   pipeline/targets/${slug}/profile.json`);
console.log(`    Mock site: public/mock-sites/${slug}.html`);
console.log();
console.log(`${"=".repeat(60)}`);
console.log(`  Review the images and site, then tell Claude what to change.`);
console.log(`${"=".repeat(60)}\n`);
