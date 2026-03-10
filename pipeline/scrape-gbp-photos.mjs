#!/usr/bin/env bun
/**
 * scrape-gbp-photos.mjs - Scrape ALL Google Business Profile photos
 *
 * Strategy: Go to Google Maps, intercept ALL network requests for photo URLs,
 * scroll through the photos tab and reviews to trigger lazy loading,
 * then download everything at high resolution.
 *
 * Usage:
 *   bun run pipeline/scrape-gbp-photos.mjs <business-slug>
 *   bun run pipeline/scrape-gbp-photos.mjs login          (one-time Google sign-in)
 *
 * Photos land in: pipeline/targets/<slug>/assets/photos/
 * That folder is the single source of truth - review it, delete junk,
 * and Claude will reference whatever remains when building the site.
 */

import puppeteer from "puppeteer-core";
import sharp from "sharp";
import {
  mkdirSync, writeFileSync, existsSync, readFileSync,
  cpSync, rmSync, readdirSync, statSync, unlinkSync
} from "fs";
import { join } from "path";

const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const SCRAPER_PROFILE = join(import.meta.dir, ".chrome-scraper");
const SCRAPER_WORK = join(import.meta.dir, ".chrome-scraper-work3");
const PIPELINE_DIR = join(import.meta.dir, "targets");

const TARGETS = {
  "carolina-arcade": {
    name: "Carolina Arcade Museum",
    mapsQuery: "Carolina Arcade Museum Forest City NC",
    placeId: "ChIJ-_5gWnJaWYgReqFw9xP1c7k",
  },
  "wahoos-sports": {
    name: "Wahoo's Sports and Collectibles",
    mapsQuery: "Wahoo's Sports and Collectibles Forest City NC",
    placeId: null,
  },
  "hoot-nannie": {
    name: "The Hoot Nannie",
    mapsQuery: "The Hoot Nannie Forest City NC",
    placeId: null,
  },
  "slims-bar": {
    name: "Slim's Bar & Grill",
    mapsQuery: "Slim's Bar and Grill Forest City NC",
    placeId: null,
  },
};

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function setupWorkProfile() {
  try { rmSync(SCRAPER_WORK, { recursive: true, force: true }); } catch {}
  mkdirSync(join(SCRAPER_WORK, "Default"), { recursive: true });
  for (const f of ["Cookies", "Cookies-journal", "Preferences", "Secure Preferences"]) {
    const src = join(SCRAPER_PROFILE, "Default", f);
    if (existsSync(src)) try { cpSync(src, join(SCRAPER_WORK, "Default", f)); } catch {}
  }
  const ls = join(SCRAPER_PROFILE, "Local State");
  if (existsSync(ls)) try { cpSync(ls, join(SCRAPER_WORK, "Local State")); } catch {}
}

async function launchBrowser(headless = false) {
  return puppeteer.launch({
    executablePath: CHROME_PATH,
    headless,
    userDataDir: headless ? SCRAPER_WORK : SCRAPER_PROFILE,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-blink-features=AutomationControlled",
      "--window-size=1400,900",
    ],
    defaultViewport: headless ? { width: 1400, height: 900 } : null,
  });
}

// ---- LOGIN MODE ----
async function loginMode() {
  console.log("\n=== Google Login Mode ===");
  console.log("  A Chrome window will open. Sign into Google.");
  console.log("  When done, close the browser window.\n");

  mkdirSync(join(SCRAPER_PROFILE, "Default"), { recursive: true });
  const browser = await launchBrowser(false);
  const page = await browser.newPage();
  await page.goto("https://accounts.google.com", { waitUntil: "networkidle2" });

  // Wait for browser to close
  await new Promise((resolve) => {
    browser.on("disconnected", resolve);
  });
  console.log("  Login session saved.\n");
}

// ---- DOWNLOAD ----
async function downloadImage(url, filepath) {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://www.google.com/maps/",
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!resp.ok) return false;
    const buf = Buffer.from(await resp.arrayBuffer());
    if (buf.length < 5000) return false; // skip tiny images
    writeFileSync(filepath, buf);
    return true;
  } catch { return false; }
}

// ---- FILTER JUNK (avatars, icons) ----
async function filterJunk(dir) {
  let removed = 0;
  const files = readdirSync(dir).filter(f => f.endsWith(".jpg"));
  for (const f of files) {
    try {
      const fp = join(dir, f);
      const meta = await sharp(fp).metadata();
      const w = meta.width || 0;
      const h = meta.height || 0;
      const ratio = w / (h || 1);

      // Remove: square avatars under 300px, very small images, tiny icons
      const isSquareAvatar = (ratio > 0.85 && ratio < 1.15) && (w < 300 || h < 300);
      const isTiny = w < 150 || h < 150;
      const isIcon = (w < 200 && h < 200);

      if (isSquareAvatar || isTiny || isIcon) {
        unlinkSync(fp);
        removed++;
      }
    } catch {}
  }
  return removed;
}

// ---- Upscale googleusercontent URLs to high-res ----
function upscaleUrl(url) {
  let u = url;
  // Remove size constraints to get largest available
  u = u.replace(/=w\d+(-h\d+)?[^"=&\s]*/g, "=w1600-h1200-no");
  u = u.replace(/=s\d+[^"=&\s]*/g, "=s1600");
  // If no size param, add one
  if (!u.includes("=w") && !u.includes("=s") && u.includes("googleusercontent")) {
    u += "=s1600";
  }
  return u;
}

// ---- MAIN SCRAPE ----
async function scrape(slug) {
  const target = TARGETS[slug];
  if (!target) { console.error(`Unknown target: ${slug}`); process.exit(1); }

  // Output directory - this is the canonical folder the user reviews
  const photosDir = join(PIPELINE_DIR, slug, "assets", "photos");
  mkdirSync(photosDir, { recursive: true });

  // Check if folder already has photos (don't nuke user's curated work)
  const existing = readdirSync(photosDir).filter(f => f.endsWith(".jpg")).length;
  if (existing > 0) {
    console.log(`\n  WARNING: ${photosDir} already has ${existing} photos.`);
    console.log(`  Scraping will ADD new photos, not replace existing ones.`);
    console.log(`  Delete the folder manually first if you want a fresh scrape.\n`);
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`  GBP PHOTO SCRAPE: ${target.name}`);
  console.log(`${"=".repeat(60)}\n`);

  setupWorkProfile();

  // Use headed mode - Google Maps is less suspicious this way
  const browser = await launchBrowser(false);
  const page = await browser.newPage();

  // Network interception: capture ALL photo URLs from Google's CDN
  const capturedUrls = new Set();

  page.on("response", (response) => {
    const url = response.url();
    // Capture googleusercontent photo URLs (GBP photos use lh3/lh5.googleusercontent.com)
    if (
      (url.includes("googleusercontent.com") || url.includes("ggpht.com")) &&
      !url.includes("/a-/") &&      // skip avatar URLs
      !url.includes("/a/A") &&       // skip avatar URLs
      !url.includes("=s32") &&       // skip tiny thumbnails
      !url.includes("=s64") &&
      !url.includes("=s44") &&
      !url.includes("=w36") &&
      !url.includes("=w44") &&
      !url.includes("=w64") &&
      url.length > 60
    ) {
      // Get the base URL without size params, then we'll upscale later
      capturedUrls.add(url);
    }
  });

  const debugDir = join(photosDir, "_debug");
  mkdirSync(debugDir, { recursive: true });

  try {
    // ---- STEP 1: Go to Google Maps search for the business ----
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(target.mapsQuery)}`;
    console.log("  [1/5] Opening Google Maps...");
    await page.goto(mapsUrl, { waitUntil: "networkidle2", timeout: 45000 });
    await delay(3000);
    await page.screenshot({ path: join(debugDir, "01-maps-search.png") });

    // ---- STEP 2: Click on the business result if needed ----
    // Check if we landed on the business page or a search results list
    const isBusinessPage = await page.evaluate(() => {
      return !!document.querySelector('[data-item-id]') ||
             !!document.querySelector('button[data-tab-index="2"]') ||
             document.title.includes("Google Maps");
    });
    console.log(`  [1/5] On business page: ${isBusinessPage}`);

    // Try clicking the first result if we're on a list
    try {
      const firstResult = await page.$('a[data-value="See photos"]') ||
                          await page.$('.fontHeadlineSmall') ||
                          await page.$('[data-item-id] a');
      if (firstResult) {
        await firstResult.click();
        await delay(3000);
      }
    } catch {}

    await page.screenshot({ path: join(debugDir, "02-business-page.png") });
    console.log(`  [1/5] Captured ${capturedUrls.size} URLs so far from page load`);

    // ---- STEP 3: Click "Photos" tab ----
    console.log("  [2/5] Looking for Photos tab...");

    // Google Maps uses tab buttons - "Photos" is usually tab index 2
    const clickedPhotos = await page.evaluate(() => {
      // Try multiple selectors for the Photos tab
      const selectors = [
        'button[aria-label*="Photo"]',
        'button[data-tab-index="2"]',
        '[role="tab"][aria-label*="Photo"]',
        'button:has(> div:has(> div))',
      ];
      for (const sel of selectors) {
        const els = document.querySelectorAll(sel);
        for (const el of els) {
          const text = el.textContent || el.getAttribute("aria-label") || "";
          if (/photo/i.test(text)) {
            el.click();
            return `Clicked: ${text.trim().substring(0, 40)}`;
          }
        }
      }
      // Also try just finding any element with "Photos" text
      const allBtns = document.querySelectorAll("button, [role='tab']");
      for (const btn of allBtns) {
        if (/^\s*Photos?\s*$/i.test(btn.textContent?.trim())) {
          btn.click();
          return `Clicked button: ${btn.textContent.trim()}`;
        }
      }
      return null;
    });

    if (clickedPhotos) {
      console.log(`  [2/5] ${clickedPhotos}`);
      await delay(4000);
    } else {
      console.log("  [2/5] Photos tab not found, trying alternative...");

      // Try clicking on any photo/image in the header area
      try {
        const headerImg = await page.$('button[jsaction*="photo"], [data-photo-index] img, .aoRNLd img');
        if (headerImg) {
          await headerImg.click();
          await delay(3000);
          console.log("  [2/5] Clicked header photo");
        }
      } catch {}
    }

    await page.screenshot({ path: join(debugDir, "03-photos-tab.png") });
    console.log(`  [2/5] Captured ${capturedUrls.size} URLs after Photos tab`);

    // ---- STEP 4: Scroll the photo gallery to load more ----
    console.log("  [3/5] Scrolling photo gallery to load more...");

    // Find the scrollable container and scroll it
    for (let scrollAttempt = 0; scrollAttempt < 20; scrollAttempt++) {
      const beforeCount = capturedUrls.size;

      // Try scrolling various containers that might hold the photo grid
      await page.evaluate(() => {
        // Try scrolling the main content area
        const containers = [
          document.querySelector('[role="main"]'),
          document.querySelector('.m6QErb.DxyBCb'),
          document.querySelector('.m6QErb'),
          document.querySelector('[data-photo-index]')?.closest('[class*="scroll"]'),
          document.querySelector('.section-layout'),
        ];
        for (const c of containers) {
          if (c) {
            c.scrollTop += 800;
          }
        }
        // Also scroll the page itself
        window.scrollBy(0, 800);
      });

      await delay(1500);

      const afterCount = capturedUrls.size;
      if (afterCount > beforeCount) {
        console.log(`    Scroll ${scrollAttempt + 1}: ${afterCount} URLs (+${afterCount - beforeCount})`);
      }

      // If we haven't gotten new URLs in 3 scrolls, try a different approach
      if (scrollAttempt > 0 && scrollAttempt % 5 === 0 && afterCount === beforeCount) {
        console.log(`    No new URLs in last 5 scrolls, trying tab clicks...`);
        // Try clicking category tabs (All, Menu, Inside, Outside, etc.)
        await page.evaluate(() => {
          const tabs = document.querySelectorAll('[role="tablist"] button, .ZKCDEc button');
          for (let i = 1; i < tabs.length && i < 6; i++) {
            setTimeout(() => tabs[i]?.click(), i * 500);
          }
        });
        await delay(3000);
      }
    }

    await page.screenshot({ path: join(debugDir, "04-after-scroll.png") });
    console.log(`  [3/5] Total captured: ${capturedUrls.size} URLs after scrolling`);

    // ---- STEP 5: Also try the Reviews tab for review photos ----
    console.log("  [4/5] Checking reviews for photos...");

    const clickedReviews = await page.evaluate(() => {
      const btns = document.querySelectorAll("button, [role='tab']");
      for (const btn of btns) {
        if (/^\s*Reviews?\s*$/i.test(btn.textContent?.trim())) {
          btn.click();
          return true;
        }
      }
      return false;
    });

    if (clickedReviews) {
      await delay(3000);
      // Scroll reviews to load more
      for (let i = 0; i < 10; i++) {
        await page.evaluate(() => {
          const c = document.querySelector('.m6QErb.DxyBCb') || document.querySelector('[role="main"]');
          if (c) c.scrollTop += 600;
          window.scrollBy(0, 600);
        });
        await delay(1200);
      }
      console.log(`  [4/5] After reviews scroll: ${capturedUrls.size} URLs`);
    }

    await page.screenshot({ path: join(debugDir, "05-reviews.png") });

    // ---- STEP 6: Deduplicate, upscale, and download ----
    console.log("  [5/5] Processing and downloading...");

    // Deduplicate by base URL (same photo at different sizes)
    const baseUrlMap = new Map();
    for (const url of capturedUrls) {
      // Strip size params to get the base photo identifier
      const base = url.replace(/=w\d+[^"=&\s]*/g, "").replace(/=s\d+[^"=&\s]*/g, "").replace(/=h\d+[^"=&\s]*/g, "");
      if (!baseUrlMap.has(base)) {
        baseUrlMap.set(base, upscaleUrl(url));
      }
    }

    const uniqueUrls = [...baseUrlMap.values()];
    console.log(`  Deduplicated: ${capturedUrls.size} raw -> ${uniqueUrls.length} unique photos`);

    // Find the next available photo number (don't overwrite existing)
    const existingPhotos = readdirSync(photosDir).filter(f => f.match(/^photo-\d+\.jpg$/));
    let nextNum = 0;
    if (existingPhotos.length > 0) {
      const nums = existingPhotos.map(f => parseInt(f.match(/\d+/)[0]));
      nextNum = Math.max(...nums) + 1;
    }

    let downloaded = 0;
    let failed = 0;
    for (let i = 0; i < uniqueUrls.length; i++) {
      const num = nextNum + i;
      const fp = join(photosDir, `photo-${String(num).padStart(3, "0")}.jpg`);
      if (await downloadImage(uniqueUrls[i], fp)) {
        downloaded++;
        if (downloaded % 10 === 0) process.stdout.write(`    ${downloaded} downloaded...\n`);
      } else {
        failed++;
      }
    }
    console.log(`  Downloaded: ${downloaded} / ${uniqueUrls.length} (${failed} failed)`);

    // ---- STEP 7: Filter junk ----
    const removed = await filterJunk(photosDir);
    console.log(`  Filtered: ${removed} likely avatars/icons removed`);

    const finalCount = readdirSync(photosDir).filter(f => f.endsWith(".jpg")).length;

    // ---- Save manifest ----
    writeFileSync(join(photosDir, "_manifest.json"), JSON.stringify({
      slug,
      business: target.name,
      scrapedAt: new Date().toISOString(),
      source: "Google Business Profile (Maps)",
      stats: {
        networkUrlsCaptured: capturedUrls.size,
        uniqueAfterDedup: uniqueUrls.length,
        downloaded,
        filteredOut: removed,
        finalUsable: finalCount,
      },
      workflow: "Review this folder. Delete any photos you don't want. Claude will use whatever remains.",
    }, null, 2));

    await browser.close();

    console.log(`\n${"=".repeat(60)}`);
    console.log(`  DONE: ${finalCount} photos in folder`);
    console.log(`  Path: pipeline/targets/${slug}/assets/photos/`);
    console.log(`\n  NEXT STEP: Open the folder, review the photos.`);
    console.log(`  Delete any you don't want. Keep the good ones.`);
    console.log(`  Then tell Claude which to use on the site.`);
    console.log(`${"=".repeat(60)}\n`);

  } catch (err) {
    console.error("\n  ERROR:", err.message);
    await page.screenshot({ path: join(debugDir, "error.png") }).catch(() => {});
    await browser.close();
  }
}

// ---- CLI ----
const arg = process.argv[2];
if (!arg) {
  console.log(`\n  Usage:`);
  console.log(`    bun run pipeline/scrape-gbp-photos.mjs login           (sign into Google first)`);
  console.log(`    bun run pipeline/scrape-gbp-photos.mjs <slug>          (scrape photos)\n`);
  console.log(`  Targets:`);
  for (const [k, v] of Object.entries(TARGETS)) {
    console.log(`    ${k.padEnd(24)} ${v.name}`);
  }
  console.log(`\n  Photos go to: pipeline/targets/<slug>/assets/photos/`);
  console.log(`  Review the folder, delete junk, keep what you want.\n`);
  process.exit(0);
}

if (arg === "login") {
  await loginMode();
} else {
  await scrape(arg);
}
