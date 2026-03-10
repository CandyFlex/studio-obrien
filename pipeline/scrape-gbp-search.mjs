#!/usr/bin/env bun
/**
 * scrape-gbp-search.mjs - Scrape business photos via Google Search knowledge panel
 *
 * Usage:
 *   bun run pipeline/scrape-gbp-search.mjs <business-slug>
 *
 * Uses Google Search instead of Google Maps to avoid Maps' anti-bot photo gallery blocks.
 * The knowledge panel on Google Search shows the same GBP photos.
 */

import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { mkdirSync, writeFileSync, existsSync, readFileSync, cpSync, rmSync, readdirSync, statSync, unlinkSync } from "fs";
import { join } from "path";

const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const SCRAPER_PROFILE = join(import.meta.dir, ".chrome-scraper");
const SCRAPER_WORK = join(import.meta.dir, ".chrome-scraper-work2");
const PIPELINE_DIR = join(import.meta.dir, "targets");

const TARGETS = {
  "carolina-arcade": {
    name: "Carolina Arcade Museum",
    searchQuery: "Carolina Arcade Museum Forest City NC",
  },
  "wahoos-sports": {
    name: "Wahoo's Sports and Collectibles",
    searchQuery: "Wahoo's Sports and Collectibles Forest City NC",
  },
  "hoot-nannie": {
    name: "The Hoot Nannie Forest City NC restaurant",
    searchQuery: "The Hoot Nannie Forest City NC",
  },
  "slims-bar": {
    name: "Slim's Bar & Grill",
    searchQuery: "Slim's Bar and Grill Forest City NC",
  },
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function downloadImage(url, filepath) {
  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", Referer: "https://www.google.com/" },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) return false;
    const buf = Buffer.from(await resp.arrayBuffer());
    if (buf.length < 3000) return false;
    writeFileSync(filepath, buf);
    return true;
  } catch { return false; }
}

async function filterJunk(dir) {
  let removed = 0;
  for (const f of readdirSync(dir).filter(f => f.endsWith(".jpg"))) {
    try {
      const fp = join(dir, f);
      const meta = await sharp(fp).metadata();
      const ratio = (meta.width || 0) / ((meta.height || 1));
      const isSquare = ratio > 0.85 && ratio < 1.15;
      const isSmall = (meta.width || 0) < 300 || (meta.height || 0) < 300;
      if (isSquare && isSmall) { unlinkSync(fp); removed++; }
    } catch {}
  }
  return removed;
}

async function scrape(slug) {
  const target = TARGETS[slug];
  if (!target) { console.error(`Unknown: ${slug}`); process.exit(1); }

  const gbpDir = join(PIPELINE_DIR, slug, "assets", "gbp");
  try { rmSync(gbpDir, { recursive: true, force: true }); } catch {}
  mkdirSync(gbpDir, { recursive: true });

  console.log(`\n=== GBP Search Scrape: ${target.name} ===\n`);

  // Setup work profile
  try { rmSync(SCRAPER_WORK, { recursive: true, force: true }); } catch {}
  mkdirSync(join(SCRAPER_WORK, "Default"), { recursive: true });
  for (const f of ["Cookies", "Cookies-journal", "Preferences", "Secure Preferences"]) {
    const src = join(SCRAPER_PROFILE, "Default", f);
    if (existsSync(src)) try { cpSync(src, join(SCRAPER_WORK, "Default", f)); } catch {}
  }
  const ls = join(SCRAPER_PROFILE, "Local State");
  if (existsSync(ls)) try { cpSync(ls, join(SCRAPER_WORK, "Local State")); } catch {}

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    userDataDir: SCRAPER_WORK,
    args: ["--no-sandbox", "--disable-gpu", "--disable-blink-features=AutomationControlled", "--window-size=1400,900"],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  const allPhotoUrls = new Set();

  try {
    // ---- STEP 1: Google Search for the business ----
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(target.searchQuery)}`;
    console.log("  Searching Google...");
    await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await delay(2000);

    await page.screenshot({ path: join(gbpDir, "_debug-search.png") });

    // ---- STEP 2: Click "Photos" in the knowledge panel ----
    // The knowledge panel has links like "Photos", "See photos", or a photo carousel
    console.log("  Looking for photos in knowledge panel...");

    // First grab any images already visible in the knowledge panel
    let foundImages = await page.evaluate(() => {
      const urls = [];
      // Knowledge panel images
      const kpImgs = document.querySelectorAll('[data-lpage] img, .ivg-i img, [data-attrid*="image"] img, g-img img');
      for (const img of kpImgs) {
        const src = img.src || "";
        if (src.includes("googleusercontent") || src.includes("encrypted-tbn")) {
          urls.push(src);
        }
      }
      // Also check for data-src (lazy loaded)
      const allImgs = document.querySelectorAll("img[data-src]");
      for (const img of allImgs) {
        const src = img.dataset.src || "";
        if (src.includes("googleusercontent") || src.includes("encrypted-tbn")) {
          urls.push(src);
        }
      }
      return [...new Set(urls)];
    });
    console.log(`  Found ${foundImages.length} images in initial search results`);

    // Try clicking "Photos" or "See photos" link
    try {
      const links = await page.$$("a, g-more-link a, [data-tab] a");
      for (const link of links) {
        const txt = await page.evaluate(el => (el.textContent || el.getAttribute("aria-label") || "").trim(), link);
        if (/photos?/i.test(txt) && txt.length < 30) {
          console.log(`  Clicking: "${txt}"`);
          await link.click();
          await delay(3000);

          await page.screenshot({ path: join(gbpDir, "_debug-photos-click.png") });

          // Grab images from the photos page
          const photoPageImgs = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("img"))
              .map(img => img.src || img.dataset?.src || "")
              .filter(s => (s.includes("googleusercontent") || s.includes("encrypted-tbn")) && s.length > 30);
          });
          console.log(`  Photos page: ${photoPageImgs.length} images`);
          foundImages.push(...photoPageImgs);
          break;
        }
      }
    } catch {}

    // ---- STEP 3: Also try Google Images for the business ----
    console.log("  Trying Google Images...");
    const imgSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(target.searchQuery)}&tbm=isch`;
    await page.goto(imgSearchUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await delay(2000);

    // Click on individual image results to get full-size URLs
    // Google Images shows thumbnails; clicking them reveals the source URL
    const thumbnails = await page.$$("img.YQ4gaf, img.Q4LuWd, img[data-deferred]");
    console.log(`  Google Images: ${thumbnails.length} thumbnails`);

    // Click first 20 thumbnails to load full-res URLs
    for (let i = 0; i < Math.min(20, thumbnails.length); i++) {
      try {
        await thumbnails[i].click();
        await delay(800);

        // Grab the large preview image
        const largeImg = await page.evaluate(() => {
          // The selected image preview panel shows a large image
          const bigImgs = document.querySelectorAll('img[jsname="kn3ccd"], img.sFlh5c, img.iPVvYb, img.r48jcc');
          for (const img of bigImgs) {
            const src = img.src || "";
            if (src.startsWith("http") && src.length > 50 && !src.includes("data:")) {
              return src;
            }
          }
          return null;
        });

        if (largeImg) {
          allPhotoUrls.add(largeImg);
        }
      } catch {}
    }

    // Also grab all visible image URLs
    const allVisibleImgs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("img"))
        .map(img => img.src || "")
        .filter(s => s.includes("googleusercontent") && s.length > 50 && !s.includes("=s64") && !s.includes("=s32"));
    });
    allVisibleImgs.forEach(u => allPhotoUrls.add(u));

    // Upscale all googleusercontent URLs
    foundImages.forEach(u => {
      let big = u;
      big = big.replace(/=w\d+-h\d+[^"=&]*/g, "=w1200-h900-no");
      big = big.replace(/=s\d+[^"=&]*/g, "=s1200");
      allPhotoUrls.add(big);
    });

    console.log(`\n  Total unique image URLs: ${allPhotoUrls.size}`);

    // ---- STEP 4: Download ----
    const urls = [...allPhotoUrls];
    let downloaded = 0;
    for (let i = 0; i < urls.length; i++) {
      const fp = join(gbpDir, `photo-${String(i).padStart(3, "0")}.jpg`);
      if (await downloadImage(urls[i], fp)) downloaded++;
    }
    console.log(`  Downloaded: ${downloaded}/${urls.length}`);

    // ---- STEP 5: Filter junk ----
    const removed = await filterJunk(gbpDir);
    console.log(`  Filtered: ${removed} likely avatars removed`);

    const remaining = readdirSync(gbpDir).filter(f => f.endsWith(".jpg")).length;

    // Save manifest
    writeFileSync(join(gbpDir, "gbp-manifest.json"), JSON.stringify({
      slug, business: target.name, scrapedAt: new Date().toISOString(),
      photos: { found: urls.length, downloaded, afterFilter: remaining },
    }, null, 2));

    await browser.close();

    console.log(`\n=== Done: ${remaining} usable photos ===`);
    console.log(`  Folder: pipeline/targets/${slug}/assets/gbp/\n`);

  } catch (err) {
    console.error("Error:", err.message);
    await browser.close();
  }
}

const arg = process.argv[2];
if (!arg) {
  console.log("\n  Usage: bun run pipeline/scrape-gbp-search.mjs <slug>\n");
  for (const [k, v] of Object.entries(TARGETS)) console.log(`    ${k.padEnd(24)} ${v.name}`);
  process.exit(0);
}
await scrape(arg);
