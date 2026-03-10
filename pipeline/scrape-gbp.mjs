#!/usr/bin/env bun
/**
 * scrape-gbp.mjs - Scrape Google Business Profile photos and data
 *
 * Usage:
 *   bun run pipeline/scrape-gbp.mjs login          # One-time: sign into Google
 *   bun run pipeline/scrape-gbp.mjs <business-slug> # Scrape (runs headless)
 *
 * Uses a dedicated Chrome profile at pipeline/.chrome-scraper/
 */

import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync, existsSync, readFileSync, cpSync, rmSync, readdirSync, statSync, unlinkSync } from "fs";
import { join } from "path";
import sharp from "sharp";

const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const SCRAPER_PROFILE = join(import.meta.dir, ".chrome-scraper");
const SCRAPER_WORK = join(import.meta.dir, ".chrome-scraper-work");
const PIPELINE_DIR = join(import.meta.dir, "targets");

const TARGETS = {
  "carolina-arcade": {
    name: "Carolina Arcade Museum",
    mapsUrl: "https://www.google.com/maps/search/Carolina+Arcade+Museum+Forest+City+NC",
  },
  "wahoos-sports": {
    name: "Wahoo's Sports and Collectibles",
    mapsUrl: "https://www.google.com/maps/search/Wahoo's+Sports+and+Collectibles+Forest+City+NC",
  },
  "hoot-nannie": {
    name: "The Hoot Nannie",
    mapsUrl: "https://www.google.com/maps/search/The+Hoot+Nannie+Forest+City+NC",
  },
  "slims-bar": {
    name: "Slim's Bar & Grill",
    mapsUrl: "https://www.google.com/maps/search/Slim's+Bar+and+Grill+Forest+City+NC",
  },
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function downloadImage(url, filepath) {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://www.google.com/",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) return false;
    const buffer = Buffer.from(await resp.arrayBuffer());
    if (buffer.length < 3000) return false;
    writeFileSync(filepath, buffer);
    return true;
  } catch {
    return false;
  }
}

/**
 * Post-download filter: removes likely profile/avatar images
 * Profile pics are typically square (1:1) and small.
 * Business photos are landscape or larger.
 */
async function filterJunkImages(dir) {
  const files = readdirSync(dir).filter(f => f.endsWith(".jpg"));
  let removed = 0;

  for (const file of files) {
    const fp = join(dir, file);
    try {
      const meta = await sharp(fp).metadata();
      const w = meta.width || 0;
      const h = meta.height || 0;
      const ratio = w / (h || 1);
      const fileSize = statSync(fp).size;

      // Profile pic indicators:
      // - Nearly square (ratio 0.9 to 1.1)
      // - Small dimensions (under 400px on either side)
      // - Small file size (under 30KB) with square ratio
      const isSquare = ratio > 0.85 && ratio < 1.15;
      const isSmall = w < 400 || h < 400;
      const isTinyFile = fileSize < 25000;

      if (isSquare && (isSmall || isTinyFile)) {
        unlinkSync(fp);
        removed++;
      }
    } catch {}
  }

  return removed;
}

// ═══════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════
async function loginMode() {
  mkdirSync(SCRAPER_PROFILE, { recursive: true });
  console.log("\n  Opening Chrome with the scraper profile...");
  console.log("  Sign into your Google account, then close Chrome when done.\n");

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    userDataDir: SCRAPER_PROFILE,
    args: ["--no-sandbox", "--disable-gpu", "--window-size=1100,800", "--disable-blink-features=AutomationControlled"],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto("https://accounts.google.com/signin", { waitUntil: "networkidle2" });

  console.log("  Sign in, then close the Chrome window.\n");
  await new Promise((resolve) => browser.on("disconnected", resolve));
  console.log("  Login saved. Now run: bun run pipeline/scrape-gbp.mjs <slug>\n");
}

// ═══════════════════════════════════════════════════════
// SCRAPE
// ═══════════════════════════════════════════════════════
async function scrapeGBP(slug) {
  const target = TARGETS[slug];
  if (!target) {
    console.error(`Unknown: ${slug}. Available: ${Object.keys(TARGETS).join(", ")}`);
    process.exit(1);
  }

  if (!existsSync(SCRAPER_PROFILE)) {
    console.error("\n  Run login first: bun run pipeline/scrape-gbp.mjs login\n");
    process.exit(1);
  }

  const targetDir = join(PIPELINE_DIR, slug);
  const gbpDir = join(targetDir, "assets", "gbp");

  // Clean previous scrape
  try { rmSync(gbpDir, { recursive: true, force: true }); } catch {}
  mkdirSync(gbpDir, { recursive: true });

  console.log(`\n=== Scraping GBP: ${target.name} ===\n`);

  // Copy cookies to disposable work profile
  try { rmSync(SCRAPER_WORK, { recursive: true, force: true }); } catch {}
  mkdirSync(join(SCRAPER_WORK, "Default"), { recursive: true });

  const filesToCopy = ["Cookies", "Cookies-journal", "Login Data", "Login Data-journal", "Web Data", "Preferences", "Secure Preferences"];
  for (const f of filesToCopy) {
    const src = join(SCRAPER_PROFILE, "Default", f);
    if (existsSync(src)) try { cpSync(src, join(SCRAPER_WORK, "Default", f)); } catch {}
  }
  const ls = join(SCRAPER_PROFILE, "Local State");
  if (existsSync(ls)) try { cpSync(ls, join(SCRAPER_WORK, "Local State")); } catch {}

  // Use headed mode - Google Maps blocks headless Chrome from loading photo galleries
  // The window opens but doesn't need interaction
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    userDataDir: SCRAPER_WORK,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-blink-features=AutomationControlled",
      "--window-position=2000,0",  // position off-screen to not disrupt
      "--window-size=1400,900",
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  // Track gallery photos vs review photos separately
  const galleryUrls = new Set();
  const reviewPhotoUrls = new Set();
  let reviewTexts = [];

  try {
    // ---- STEP 1: Navigate to the business ----
    console.log("  Opening Google Maps...");
    await page.goto(target.mapsUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await delay(3000);

    // Accept cookies
    try {
      const btns = await page.$$("button");
      for (const btn of btns) {
        const txt = await page.evaluate(el => el.textContent, btn);
        if (txt && (txt.includes("Accept") || txt.includes("I agree"))) { await btn.click(); await delay(1000); break; }
      }
    } catch {}

    // Click the place result
    try {
      const firstResult = await page.$('a[href*="/maps/place/"]');
      if (firstResult) { await firstResult.click(); await delay(3000); }
    } catch {}

    // ---- STEP 2: Business info ----
    console.log("  Extracting business info...");
    const bizInfo = await page.evaluate(() => {
      const info = {};
      const n = document.querySelector("h1"); if (n) info.name = n.textContent.trim();
      const r = document.querySelector('[role="img"][aria-label*="star"]'); if (r) info.rating = r.getAttribute("aria-label");
      const a = document.querySelector('button[data-item-id="address"]'); if (a) info.address = a.textContent.trim();
      const p = document.querySelector('button[data-item-id*="phone"]'); if (p) info.phone = p.textContent.trim();
      return info;
    });
    console.log(`  ${bizInfo.name || "?"} | ${bizInfo.rating || "?"}`);

    // ---- STEP 3: PHOTO GALLERY ----
    // Strategy: Get the place URL, then navigate to /photos which loads a
    // photo grid in the side panel (no buggy overlay needed)
    console.log("  Getting place photos...");

    await page.screenshot({ path: join(gbpDir, "_debug-listing.png") });

    // Get the current place URL so we can navigate to /photos
    const currentUrl = page.url();
    console.log(`  Current URL: ${currentUrl.substring(0, 100)}...`);

    // Extract all googleusercontent image URLs from the business panel
    // These include the hero image and the photo row at bottom of panel
    const extractPlacePhotos = async () => {
      return await page.evaluate(() => {
        const urls = [];
        const imgs = document.querySelectorAll("img");
        for (const img of imgs) {
          const src = img.src || "";
          if (!src.includes("googleusercontent.com")) continue;
          // Skip avatar-pattern URLs
          if (src.includes("/a-/") || src.includes("/a/A")) continue;
          // Skip tiny images
          const w = img.clientWidth || img.naturalWidth || 0;
          const h = img.clientHeight || img.naturalHeight || 0;
          if (w < 50 && h < 50) continue;

          // Upscale to large version
          let big = src;
          big = big.replace(/=w\d+-h\d+[^"=&]*/, "=w1200-h900-no");
          big = big.replace(/=s\d+[^"=&]*/, "=s1200");
          if (!big.includes("=w") && !big.includes("=s")) big += "=s1200";
          urls.push(big);
        }
        return [...new Set(urls)];
      });
    };

    // Grab photos from the main listing first
    let panelPhotos = await extractPlacePhotos();
    panelPhotos.forEach(u => galleryUrls.add(u));
    console.log(`  Panel photos: ${galleryUrls.size}`);

    // Debug: dump ALL image URLs on the page
    const debugImgs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("img")).map(img => ({
        src: (img.src || "").substring(0, 150),
        w: img.clientWidth,
        h: img.clientHeight,
        alt: (img.alt || "").substring(0, 50),
        parent: img.parentElement?.tagName,
      })).filter(x => x.src.includes("googleusercontent"));
    });
    console.log(`  DEBUG: ${debugImgs.length} googleusercontent images on page:`);
    for (const d of debugImgs) {
      console.log(`    ${d.w}x${d.h} [${d.parent}] alt="${d.alt}" ${d.src.substring(0, 100)}`);
    }

    // Also check for background-image and style-based images
    const bgImgs = await page.evaluate(() => {
      const results = [];
      const allEls = document.querySelectorAll("[style]");
      for (const el of allEls) {
        const bg = el.style.backgroundImage || "";
        if (bg.includes("googleusercontent")) {
          results.push({ bg: bg.substring(0, 200), w: el.clientWidth, h: el.clientHeight, tag: el.tagName });
        }
      }
      return results;
    });
    if (bgImgs.length) {
      console.log(`  DEBUG: ${bgImgs.length} background-image elements:`);
      for (const b of bgImgs) console.log(`    ${b.w}x${b.h} [${b.tag}] ${b.bg.substring(0, 120)}`);
    }

    // Now try scrolling the panel to reveal more photos
    for (let scroll = 0; scroll < 10; scroll++) {
      await page.evaluate(() => {
        // Scroll the side panel
        const panels = document.querySelectorAll('[class*="m6QErb"], [role="main"], .section-scrollbox');
        for (const p of panels) p.scrollBy(0, 500);
      });
      await delay(1000);

      const before = galleryUrls.size;
      const newPhotos = await extractPlacePhotos();
      newPhotos.forEach(u => galleryUrls.add(u));
      if (galleryUrls.size > before) {
        console.log(`    Scroll: ${galleryUrls.size} photos`);
      }
    }

    // Now navigate to the Photos tab in the place panel
    // Click the "Photos" section or any element that shows the photos grid
    console.log("  Clicking Photos tab...");
    try {
      const clickTargets = await page.$$("button, a, div[role='tab'], div[role='button']");
      for (const el of clickTargets) {
        const txt = await page.evaluate(e => {
          const t = (e.textContent || "").trim();
          const a = e.getAttribute("aria-label") || "";
          return t + " " + a;
        }, el);
        if (/photos?/i.test(txt) && txt.length < 40) {
          await el.click();
          await delay(3000);
          console.log(`    Clicked: "${txt.trim().substring(0, 30)}"`);

          await page.screenshot({ path: join(gbpDir, "_debug-photos-tab.png") });

          // Now scroll this photos view
          for (let s = 0; s < 20; s++) {
            await page.evaluate(() => {
              const panels = document.querySelectorAll('[class*="m6QErb"], [role="main"], .section-scrollbox');
              for (const p of panels) p.scrollBy(0, 600);
            });
            await delay(1000);

            const before = galleryUrls.size;
            const urls = await extractPlacePhotos();
            urls.forEach(u => galleryUrls.add(u));
            if (galleryUrls.size > before) {
              console.log(`      Photos tab scroll: ${galleryUrls.size} total`);
            }
            if (s > 5 && galleryUrls.size === before) break;
          }
          break;
        }
      }
    } catch (err) {
      console.log(`    Photos tab error: ${err.message}`);
    }

    console.log(`\n  Total gallery photos found: ${galleryUrls.size}`);

    // ---- STEP 4: REVIEWS (text only, skip avatar images) ----
    console.log("  Navigating to reviews...");

    // Go back to the main listing
    await page.goto(target.mapsUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await delay(3000);

    // Click place result again
    try {
      const firstResult = await page.$('a[href*="/maps/place/"]');
      if (firstResult) { await firstResult.click(); await delay(3000); }
    } catch {}

    // Click Reviews tab
    try {
      const btns = await page.$$("button");
      for (const btn of btns) {
        const txt = await page.evaluate(el => el.textContent.trim(), btn);
        if (/^reviews?$/i.test(txt) || /^\d+\s*reviews?$/i.test(txt)) {
          await btn.click();
          await delay(3000);
          console.log("  Reviews tab opened");
          break;
        }
      }
    } catch {}

    // Scroll and load reviews
    for (let i = 0; i < 15; i++) {
      await page.evaluate(() => {
        const scrollable = document.querySelector(".m6QErb.DxyBCb") ||
          document.querySelector('[role="main"]');
        if (scrollable) scrollable.scrollBy(0, 600);
      });
      await delay(800);
    }

    // Expand all "More" text in reviews
    try {
      const moreBtns = await page.$$("button.w8nwRe, button[aria-label='See more']");
      for (const btn of moreBtns.slice(0, 30)) {
        try { await btn.click(); await delay(150); } catch {}
      }
    } catch {}

    // Extract review text
    reviewTexts = await page.evaluate(() => {
      const reviews = [];
      const containers = document.querySelectorAll("div.jftiEf, [data-review-id]");
      for (const el of containers) {
        const textEl = el.querySelector(".wiI7pd, .MyEned");
        const starsEl = el.querySelector('[role="img"][aria-label*="star"]');
        const nameEl = el.querySelector(".d4r55, a.WNxzHc");
        const dateEl = el.querySelector(".rsqaWe, .DU9Pgb");

        if (textEl && textEl.textContent.trim().length > 15) {
          reviews.push({
            text: textEl.textContent.trim(),
            stars: starsEl ? starsEl.getAttribute("aria-label") : null,
            author: nameEl ? nameEl.textContent.trim() : null,
            date: dateEl ? dateEl.textContent.trim() : null,
          });
        }
      }
      return reviews;
    });

    // Extract ONLY review-attached photos (not avatars)
    // Review photos are inside specific containers, not the avatar area
    const reviewPhotos = await page.evaluate(() => {
      const urls = [];
      // Review photos are typically in containers with specific classes
      // They're inside the review body area, displayed larger than avatars
      const photoContainers = document.querySelectorAll(
        ".KtCyie img, .Tya61d img, [data-photo-index] img, .review-photos img"
      );
      for (const img of photoContainers) {
        const src = img.src || "";
        if (src.includes("googleusercontent.com") && !src.includes("/a-/") && !src.includes("/a/A")) {
          let big = src.replace(/=w\d+-h\d+[^"=]*/, "=w1200-h900-no").replace(/=s\d+[^"=]*/, "=s1200");
          urls.push(big);
        }
      }
      return urls;
    });
    reviewPhotos.forEach(u => reviewPhotoUrls.add(u));

    console.log(`  Reviews: ${reviewTexts.length} with text, ${reviewPhotoUrls.size} attached photos`);

    // ---- STEP 5: Download ----
    // Gallery photos get gbp-gallery-XXX prefix, review photos get gbp-review-XXX
    const allGallery = [...galleryUrls];
    const allReviewPhotos = [...reviewPhotoUrls].filter(u => !galleryUrls.has(u)); // dedupe

    console.log(`\n  Downloading ${allGallery.length} gallery + ${allReviewPhotos.length} review photos...`);

    let downloaded = 0;
    for (let i = 0; i < allGallery.length; i++) {
      const fp = join(gbpDir, `gallery-${String(i).padStart(3, "0")}.jpg`);
      if (await downloadImage(allGallery[i], fp)) downloaded++;
    }
    console.log(`  Gallery: ${downloaded} downloaded`);

    let dlReview = 0;
    for (let i = 0; i < allReviewPhotos.length; i++) {
      const fp = join(gbpDir, `review-${String(i).padStart(3, "0")}.jpg`);
      if (await downloadImage(allReviewPhotos[i], fp)) dlReview++;
    }
    console.log(`  Review photos: ${dlReview} downloaded`);

    // ---- STEP 6: Post-filter junk ----
    console.log("  Filtering out likely profile pics...");
    const removed = await filterJunkImages(gbpDir);
    console.log(`  Removed ${removed} likely profile/avatar images`);

    // ---- STEP 7: Save manifest ----
    const remaining = readdirSync(gbpDir).filter(f => f.endsWith(".jpg")).length;

    const manifest = {
      slug,
      business: target.name,
      scrapedAt: new Date().toISOString(),
      bizInfo,
      photos: { gallery: allGallery.length, reviewPhotos: allReviewPhotos.length, downloaded: downloaded + dlReview, afterFilter: remaining },
      reviews: { count: reviewTexts.length, items: reviewTexts.slice(0, 50) },
    };

    writeFileSync(join(gbpDir, "gbp-manifest.json"), JSON.stringify(manifest, null, 2));

    // Append reviews to copy.md
    if (reviewTexts.length > 0) {
      const copyPath = join(targetDir, "copy.md");
      let content = existsSync(copyPath) ? readFileSync(copyPath, "utf-8") : "";
      if (!content.includes("## Google Reviews")) {
        content += `\n\n## Google Reviews (scraped ${new Date().toISOString().split("T")[0]})\n\n`;
        for (const r of reviewTexts) {
          content += `### ${r.author || "Anonymous"} ${r.date || ""}\n${r.stars || ""}\n${r.text}\n\n`;
        }
        writeFileSync(copyPath, content);
        console.log(`  Appended ${reviewTexts.length} reviews to copy.md`);
      }
    }

    await browser.close();

    console.log(`\n=== GBP Scrape Complete: ${target.name} ===`);
    console.log(`  Usable photos: ${remaining}`);
    console.log(`  Reviews: ${reviewTexts.length}`);
    console.log(`  Folder: pipeline/targets/${slug}/assets/gbp/`);
    console.log(`\n  Next: bun run pipeline/review.mjs ${slug}\n`);

  } catch (err) {
    console.error("\nError:", err.message);
    await browser.close();
    process.exit(1);
  }
}

// CLI
const arg = process.argv[2];
if (!arg) {
  console.log(`\n  Usage:\n    bun run pipeline/scrape-gbp.mjs login\n    bun run pipeline/scrape-gbp.mjs <slug>\n`);
  for (const [k, v] of Object.entries(TARGETS)) console.log(`    ${k.padEnd(24)} ${v.name}`);
  console.log();
  process.exit(0);
}
if (arg === "login") await loginMode();
else await scrapeGBP(arg);
