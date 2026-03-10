#!/usr/bin/env bun
/**
 * scrape-socials.mjs - Scrape images and data from all social platforms
 *
 * Usage:
 *   bun run pipeline/scrape-socials.mjs <business-slug>
 *   bun run pipeline/scrape-socials.mjs all
 *
 * Scrapes: Facebook, Instagram, Yelp, Google Business, TripAdvisor
 * Downloads all found images into assets/originals/
 * Generates a manifest of what was found.
 */

import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PIPELINE_DIR = join(import.meta.dir, "targets");

const TARGETS = {
  "carolina-arcade": {
    name: "Carolina Arcade Museum",
    facebook: "https://www.facebook.com/profile.php?id=100064072420803",
    yelp: "https://www.yelp.com/biz/carolina-arcade-museum-forest-city",
    tripadvisor: "https://www.tripadvisor.com/Attraction_Review-g49141-d14994957-Reviews-Carolina_Arcade_Museum-Forest_City_North_Carolina.html",
    instagram: null,
    google: "Carolina Arcade Museum Forest City NC",
  },
  "wahoos-sports": {
    name: "Wahoo's Sports and Collectibles",
    facebook: null,
    yelp: "https://www.yelp.com/biz/wahoos-sports-and-collectibles-forest-city",
    tripadvisor: null,
    instagram: "https://www.instagram.com/wahoossports/",
    google: "Wahoo's Sports and Collectibles Forest City NC",
  },
  "slims-bar": {
    name: "Slim's Bar & Grill",
    facebook: null,
    yelp: "https://www.yelp.com/biz/slims-bar-and-grill-forest-city",
    tripadvisor: "https://www.tripadvisor.com/Restaurant_Review-g49141-d15140180-Reviews-Slim_s_Bar_Grill-Forest_City_North_Carolina.html",
    instagram: null,
    google: "Slim's Bar and Grill Forest City NC",
  },
  "hoot-nannie": {
    name: "The Hoot Nannie",
    facebook: null,
    yelp: "https://www.yelp.com/biz/the-hoot-nannie-forest-city",
    tripadvisor: "https://www.tripadvisor.com/Restaurant_Review-g49141-d23985892-Reviews-The_Hoot_Nannie-Forest_City_North_Carolina.html",
    instagram: null,
    google: "The Hoot Nannie Forest City NC",
  },
  "sticks-and-stones": {
    name: "Sticks and Stones Art & Tattoo",
    facebook: null,
    yelp: null,
    tripadvisor: null,
    instagram: null,
    wix: "https://sticksandstones283.wixsite.com/sticksandstones",
    google: "Sticks and Stones Art Tattoo Shelby NC",
  },
};

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: "shell",
      timeout: 20000,
      args: [
        "--no-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--window-size=1440,900",
      ],
    });
  }
  return browser;
}

async function safeGoto(page, url, timeout = 15000) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout });
    await new Promise((r) => setTimeout(r, 2000)); // let JS render
    return true;
  } catch (e) {
    console.log(`    Could not load: ${e.message.substring(0, 80)}`);
    return false;
  }
}

async function extractImages(page, minWidth = 100) {
  try {
    const images = await page.evaluate((minW) => {
      const imgs = Array.from(document.querySelectorAll("img"));
      return imgs
        .map((img) => ({
          src: img.src || img.dataset.src || img.getAttribute("data-original") || "",
          width: img.naturalWidth || img.width || 0,
          height: img.naturalHeight || img.height || 0,
          alt: img.alt || "",
        }))
        .filter(
          (img) =>
            img.src &&
            img.src.startsWith("http") &&
            img.width >= minW &&
            !img.src.includes("data:image") &&
            !img.src.includes("1x1") &&
            !img.src.includes("pixel") &&
            !img.src.includes("spacer") &&
            !img.src.includes("svg+xml") &&
            !img.src.includes("/static_map/") &&
            !img.src.includes("avatar") &&
            !img.src.includes("emoji")
        );
    }, minWidth);
    return images;
  } catch {
    return [];
  }
}

async function extractText(page) {
  try {
    return await page.evaluate(() => {
      const els = document.querySelectorAll("p, h1, h2, h3, h4, [class*='description'], [class*='review'], [class*='comment']");
      return Array.from(els)
        .map((el) => el.textContent.trim())
        .filter((t) => t.length > 20 && t.length < 3000);
    });
  } catch {
    return [];
  }
}

async function downloadImage(url, filepath) {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        "Referer": new URL(url).origin,
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) return false;
    const contentType = resp.headers.get("content-type") || "";
    if (!contentType.includes("image")) return false;
    const buffer = Buffer.from(await resp.arrayBuffer());
    if (buffer.length < 2000) return false; // skip tiny images
    writeFileSync(filepath, buffer);
    return true;
  } catch {
    return false;
  }
}

// ===== PLATFORM SCRAPERS =====

async function scrapeFacebook(page, url, slug) {
  console.log("  [Facebook] Scraping...");
  const results = { images: [], text: [], source: "facebook" };

  if (!await safeGoto(page, url)) return results;

  // Try to get profile picture (logo)
  const profilePics = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img[data-imgperflogname="profileCoverPhoto"], img[alt*="profile"], svg image, img[class*="profilePic"]'));
    return imgs.map(img => img.src || img.getAttribute("xlink:href")).filter(Boolean);
  });

  // Get all substantial images
  const allImgs = await extractImages(page, 80);
  results.images = [...profilePics.map(src => ({ src, alt: "profile-pic", width: 0, height: 0 })), ...allImgs];

  // Try photos tab
  const photosUrl = url.includes("profile.php")
    ? url + "&sk=photos"
    : url + "/photos";
  if (await safeGoto(page, photosUrl)) {
    // Scroll to load more photos
    await page.evaluate(() => window.scrollBy(0, 2000));
    await new Promise(r => setTimeout(r, 1500));
    const photoImgs = await extractImages(page, 200);
    results.images.push(...photoImgs);
  }

  const texts = await extractText(page);
  results.text = texts;

  console.log(`    Found ${results.images.length} images, ${results.text.length} text blocks`);
  return results;
}

async function scrapeYelp(page, url, slug) {
  console.log("  [Yelp] Scraping...");
  const results = { images: [], text: [], source: "yelp" };

  if (!await safeGoto(page, url)) return results;

  // Get business photos
  const allImgs = await extractImages(page, 150);
  results.images = allImgs.filter(img =>
    img.src.includes("bphoto") || img.src.includes("yelp") || img.width > 200
  );

  // Get review text and business description
  results.text = await extractText(page);

  // Try the photos page
  const photosUrl = url + "#photos";
  if (await safeGoto(page, photosUrl)) {
    await new Promise(r => setTimeout(r, 1500));
    const photoImgs = await extractImages(page, 200);
    results.images.push(...photoImgs);
  }

  console.log(`    Found ${results.images.length} images, ${results.text.length} text blocks`);
  return results;
}

async function scrapeTripAdvisor(page, url, slug) {
  console.log("  [TripAdvisor] Scraping...");
  const results = { images: [], text: [], source: "tripadvisor" };

  if (!await safeGoto(page, url)) return results;

  const allImgs = await extractImages(page, 200);
  results.images = allImgs;
  results.text = await extractText(page);

  console.log(`    Found ${results.images.length} images, ${results.text.length} text blocks`);
  return results;
}

async function scrapeInstagram(page, url, slug) {
  console.log("  [Instagram] Scraping...");
  const results = { images: [], text: [], source: "instagram" };

  if (!await safeGoto(page, url)) return results;

  // Instagram serves images in img tags even without login for public profiles
  const allImgs = await extractImages(page, 100);
  results.images = allImgs.filter(img =>
    img.src.includes("cdninstagram") || img.src.includes("fbcdn") || img.src.includes("scontent")
  );

  // Get bio text
  const bioText = await page.evaluate(() => {
    const meta = document.querySelector('meta[property="og:description"]');
    return meta ? meta.content : "";
  });
  if (bioText) results.text.push(bioText);

  console.log(`    Found ${results.images.length} images, ${results.text.length} text blocks`);
  return results;
}

async function scrapeGoogle(page, searchQuery, slug) {
  console.log("  [Google] Searching for images...");
  const results = { images: [], text: [], source: "google" };

  const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`;
  if (!await safeGoto(page, url)) return results;

  // Google image search thumbnails
  const allImgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("img"))
      .map(img => ({ src: img.src, alt: img.alt || "", width: img.width, height: img.height }))
      .filter(img => img.src && img.src.startsWith("http") && img.width > 80 && !img.src.includes("google"));
  });
  results.images = allImgs;

  // Also try Google Business info panel
  const bizUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  if (await safeGoto(page, bizUrl)) {
    const bizText = await page.evaluate(() => {
      const panels = document.querySelectorAll('[data-attrid], .kno-rdesc span, [class*="description"]');
      return Array.from(panels).map(el => el.textContent.trim()).filter(t => t.length > 20);
    });
    results.text = bizText;

    // Get business panel images
    const bizImgs = await extractImages(page, 100);
    results.images.push(...bizImgs);
  }

  console.log(`    Found ${results.images.length} images, ${results.text.length} text blocks`);
  return results;
}

async function scrapeWix(page, url, slug) {
  console.log("  [Wix Site] Scraping...");
  const results = { images: [], text: [], source: "wix" };

  if (!await safeGoto(page, url, 20000)) return results;

  // Wix loads images lazily, scroll to trigger
  await page.evaluate(() => {
    window.scrollBy(0, 1000);
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    window.scrollBy(0, 2000);
  });
  await new Promise(r => setTimeout(r, 1500));

  const allImgs = await extractImages(page, 100);
  results.images = allImgs.filter(img => img.src.includes("wixstatic"));
  results.text = await extractText(page);

  // Try to get higher-res versions by modifying Wix image URLs
  results.images = results.images.map(img => {
    // Wix URLs often have /v1/fill/w_XXX,h_XXX - bump the size
    let bigSrc = img.src.replace(/w_\d+/, "w_1200").replace(/h_\d+/, "h_800");
    return { ...img, src: bigSrc, originalSrc: img.src };
  });

  console.log(`    Found ${results.images.length} images, ${results.text.length} text blocks`);
  return results;
}

// ===== MAIN HARVEST =====

async function scrapeAll(slug) {
  const target = TARGETS[slug];
  if (!target) {
    console.error(`Unknown: ${slug}. Available: ${Object.keys(TARGETS).join(", ")}`);
    return;
  }

  const targetDir = join(PIPELINE_DIR, slug);
  const originalsDir = join(targetDir, "assets", "originals");
  mkdirSync(originalsDir, { recursive: true });

  console.log(`\n========================================`);
  console.log(`  Scraping: ${target.name}`);
  console.log(`========================================\n`);

  const b = await getBrowser();
  const page = await b.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );
  await page.setViewport({ width: 1440, height: 900 });

  const allResults = [];

  // Run each platform scraper
  if (target.facebook) allResults.push(await scrapeFacebook(page, target.facebook, slug));
  if (target.yelp) allResults.push(await scrapeYelp(page, target.yelp, slug));
  if (target.tripadvisor) allResults.push(await scrapeTripAdvisor(page, target.tripadvisor, slug));
  if (target.instagram) allResults.push(await scrapeInstagram(page, target.instagram, slug));
  if (target.wix) allResults.push(await scrapeWix(page, target.wix, slug));
  allResults.push(await scrapeGoogle(page, target.google, slug));

  await page.close();

  // Deduplicate images by URL
  const seenUrls = new Set();
  const allImages = [];
  for (const result of allResults) {
    for (const img of result.images) {
      const cleanUrl = img.src.split("?")[0]; // Normalize
      if (!seenUrls.has(cleanUrl)) {
        seenUrls.add(cleanUrl);
        allImages.push({ ...img, platform: result.source });
      }
    }
  }

  // Collect all text
  const allText = [];
  for (const result of allResults) {
    for (const text of result.text) {
      allText.push({ text, platform: result.source });
    }
  }

  console.log(`\n  TOTALS: ${allImages.length} unique images, ${allText.length} text blocks`);

  // Download all images
  console.log(`\n  Downloading images...`);
  let downloaded = 0;
  const manifest = [];

  for (let i = 0; i < allImages.length; i++) {
    const img = allImages[i];
    const ext = img.src.match(/\.(jpg|jpeg|png|webp|gif)/i)?.[1] || "jpg";
    const filename = `${img.platform}-${i}.${ext}`;
    const filepath = join(originalsDir, filename);

    if (await downloadImage(img.src, filepath)) {
      downloaded++;
      manifest.push({
        filename,
        platform: img.platform,
        alt: img.alt,
        width: img.width,
        height: img.height,
        url: img.src.substring(0, 150),
      });
      console.log(`    [${downloaded}] ${filename} (${img.platform})`);
    }
  }

  console.log(`\n  Downloaded ${downloaded}/${allImages.length} images`);

  // Write manifest
  const manifestData = {
    business: target.name,
    slug,
    scrapedAt: new Date().toISOString(),
    platforms: {
      facebook: !!target.facebook,
      yelp: !!target.yelp,
      tripadvisor: !!target.tripadvisor,
      instagram: !!target.instagram,
      google: true,
      wix: !!target.wix,
    },
    images: manifest,
    textBlocks: allText.slice(0, 50), // Cap at 50
    summary: {
      totalImagesFound: allImages.length,
      totalDownloaded: downloaded,
      totalTextBlocks: allText.length,
    },
  };

  writeFileSync(join(targetDir, "scrape-manifest.json"), JSON.stringify(manifestData, null, 2));
  console.log(`  Wrote scrape-manifest.json`);

  // Append scraped text to copy.md if not already rich
  const copyPath = join(targetDir, "copy.md");
  if (allText.length > 0) {
    const existingCopy = existsSync(copyPath) ? await Bun.file(copyPath).text() : "";
    if (!existingCopy.includes("## Scraped Text")) {
      const appendText = `\n\n## Scraped Text (auto-collected)\n\n` +
        allText.slice(0, 30).map(t => `### [${t.platform}]\n${t.text}\n`).join("\n---\n\n");
      writeFileSync(copyPath, existingCopy + appendText);
      console.log(`  Appended ${Math.min(allText.length, 30)} text blocks to copy.md`);
    }
  }

  console.log(`\n  Done: ${target.name}`);
  console.log(`  Review images in: pipeline/targets/${slug}/assets/originals/`);
  console.log(`  Manifest: pipeline/targets/${slug}/scrape-manifest.json\n`);
}

// ===== CLI =====

const slug = process.argv[2];
if (!slug) {
  console.log("Usage: bun run pipeline/scrape-socials.mjs <slug>");
  console.log("       bun run pipeline/scrape-socials.mjs all\n");
  for (const [key, val] of Object.entries(TARGETS)) {
    const platforms = [val.facebook && "FB", val.yelp && "Yelp", val.tripadvisor && "TA", val.instagram && "IG", val.wix && "Wix", "Google"].filter(Boolean);
    console.log(`  ${key.padEnd(22)} ${val.name.padEnd(35)} [${platforms.join(", ")}]`);
  }
  process.exit(0);
}

try {
  if (slug === "all") {
    for (const key of Object.keys(TARGETS)) {
      await scrapeAll(key);
    }
  } else {
    await scrapeAll(slug);
  }
} finally {
  if (browser) await browser.close();
}
