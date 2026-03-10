#!/usr/bin/env bun
/**
 * harvest.mjs - Scrape public business data for a pipeline target
 *
 * Usage:
 *   bun run pipeline/harvest.mjs <business-slug>
 *   bun run pipeline/harvest.mjs all
 *
 * Uses fetch (no browser needed) to pull from publicly accessible pages.
 * Saves copy, images, and generates starter profile + verify checklist.
 */

import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const PIPELINE_DIR = join(import.meta.dir, "targets");

const SEEDS = {
  "carolina-arcade": {
    name: "Carolina Arcade Museum",
    city: "Forest City",
    state: "NC",
    address: "145 East Main Street, Forest City, NC 28043",
    phone: "(828) 229-3089",
    email: "walker.darla5@gmail.com",
    industry: "Entertainment / Arcade Museum",
    visitnc: "https://www.visitncsmalltowns.com/listing/carolina-arcade-museum/1576/",
    facebook: "https://www.facebook.com/profile.php?id=100064072420803",
    yelp: "https://www.yelp.com/biz/carolina-arcade-museum-forest-city",
    knownImages: [
      "https://assets.simpleviewinc.com/simpleview/image/upload/crm/rutherfordnc/9E714948-097F-4529-A0A2-DCB5C9E5A83F_43BBB48F-0025-4030-BCC5BDE4E53003EA_f9ef28f4-bec7-4c40-9c97f7c04127d0d6.jpg"
    ],
  },
  "wahoos-sports": {
    name: "Wahoo's Sports and Collectibles",
    city: "Forest City",
    state: "NC",
    address: "128 E Main St, Forest City, NC 28043",
    phone: null,
    industry: "Retail / Sports Memorabilia",
    visitnc: "https://www.visitncsmalltowns.com/listing/wahoos-sports-and-collectibles/1458/",
    instagram: "https://www.instagram.com/wahoossports/",
    yelp: "https://www.yelp.com/biz/wahoos-sports-and-collectibles-forest-city",
    knownImages: [],
  },
  "slims-bar": {
    name: "Slim's Bar & Grill",
    city: "Forest City",
    state: "NC",
    address: "184 East Main St, Forest City, NC 28043",
    phone: "(828) 382-0283",
    industry: "Restaurant / Bar",
    visitnc: "https://www.visitncsmalltowns.com/listing/slims-bar-&-grill/1561/",
    yelp: "https://www.yelp.com/biz/slims-bar-and-grill-forest-city",
    knownImages: [],
  },
  "hoot-nannie": {
    name: "The Hoot Nannie",
    city: "Forest City",
    state: "NC",
    address: "164 E Main St, Forest City, NC 28043",
    phone: "(828) 229-3016",
    industry: "Restaurant / BBQ / Steakhouse",
    visitnc: "https://www.visitncsmalltowns.com/listing/the-hoot-nannie-a-five-spur-steakhouse/1980/",
    yelp: "https://www.yelp.com/biz/the-hoot-nannie-forest-city",
    knownImages: [],
  },
  "sticks-and-stones": {
    name: "Sticks and Stones Art & Tattoo",
    city: "Shelby",
    state: "NC",
    address: "Uptown Shelby, NC",
    phone: null,
    industry: "Tattoo Shop / Art Gallery",
    existingSite: "https://sticksandstones283.wixsite.com/sticksandstones",
    knownImages: [],
  },
};

async function fetchText(url) {
  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!resp.ok) return null;
    return await resp.text();
  } catch {
    return null;
  }
}

async function downloadImage(url, filepath) {
  try {
    const resp = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      signal: AbortSignal.timeout(15000),
    });
    if (!resp.ok) return false;
    const buffer = Buffer.from(await resp.arrayBuffer());
    if (buffer.length < 1000) return false; // skip tiny/broken images
    writeFileSync(filepath, buffer);
    return true;
  } catch {
    return false;
  }
}

function extractText(html, patterns) {
  const results = [];
  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      const text = (match[1] || match[0])
        .replace(/<[^>]*>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();
      if (text.length > 10 && text.length < 2000) {
        results.push(text);
      }
    }
  }
  return [...new Set(results)];
}

function extractImageUrls(html) {
  const urls = new Set();
  const patterns = [
    /src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
    /data-src="(https?:\/\/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/gi,
    /srcset="(https?:\/\/[^"\s]+\.(?:jpg|jpeg|png|webp)[^"\s]*)[\s"]/gi,
  ];
  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      const url = match[1];
      if (url && !url.includes("logo") && !url.includes("icon") && !url.includes("1x1") && !url.includes("pixel")) {
        urls.add(url);
      }
    }
  }
  return [...urls].slice(0, 15);
}

async function harvest(slug) {
  const seed = SEEDS[slug];
  if (!seed) {
    console.error(`Unknown target: ${slug}`);
    console.error(`Available: ${Object.keys(SEEDS).join(", ")}`);
    process.exit(1);
  }

  const targetDir = join(PIPELINE_DIR, slug);
  const assetsDir = join(targetDir, "assets");
  const photosDir = join(assetsDir, "photos");
  const originalsDir = join(assetsDir, "originals");

  [targetDir, assetsDir, photosDir, originalsDir].forEach((d) => {
    mkdirSync(d, { recursive: true });
  });

  console.log(`\n=== Harvesting: ${seed.name} ===\n`);

  const copyData = [];
  const imageUrls = [...(seed.knownImages || [])];

  // --- VisitNC Small Towns ---
  if (seed.visitnc) {
    console.log("Fetching VisitNC listing...");
    const html = await fetchText(seed.visitnc);
    if (html) {
      const textBlocks = extractText(html, [
        /<p[^>]*>(.*?)<\/p>/gis,
        /<div class="[^"]*description[^"]*">(.*?)<\/div>/gis,
        /<meta name="description" content="([^"]+)"/gi,
      ]);
      if (textBlocks.length) {
        copyData.push({ source: "VisitNC Small Towns", texts: textBlocks });
        console.log(`  Found ${textBlocks.length} text blocks`);
      }

      const imgs = extractImageUrls(html);
      imageUrls.push(...imgs);
      console.log(`  Found ${imgs.length} image URLs`);
    } else {
      console.log("  Could not fetch");
    }
  }

  // --- Existing site (for bad-site targets) ---
  if (seed.existingSite) {
    console.log(`Fetching existing site: ${seed.existingSite}...`);
    const html = await fetchText(seed.existingSite);
    if (html) {
      const textBlocks = extractText(html, [
        /<p[^>]*>(.*?)<\/p>/gis,
        /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis,
        /<meta name="description" content="([^"]+)"/gi,
      ]);
      if (textBlocks.length) {
        copyData.push({ source: "Existing Website", texts: textBlocks });
        console.log(`  Found ${textBlocks.length} text blocks`);
      }

      const imgs = extractImageUrls(html);
      imageUrls.push(...imgs);
      console.log(`  Found ${imgs.length} image URLs`);
    } else {
      console.log("  Could not fetch");
    }
  }

  // --- Download images ---
  const uniqueUrls = [...new Set(imageUrls)];
  console.log(`\nDownloading ${uniqueUrls.length} images...`);
  let downloaded = 0;
  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    const ext = url.match(/\.(jpg|jpeg|png|webp)/i)?.[1] || "jpg";
    const filepath = join(originalsDir, `image-${i}.${ext}`);
    if (await downloadImage(url, filepath)) {
      downloaded++;
      console.log(`  [${downloaded}] Saved image-${i}.${ext}`);
    }
  }
  console.log(`  Downloaded ${downloaded}/${uniqueUrls.length}`);

  // --- Write copy.md ---
  let copyMd = `# Scraped Copy: ${seed.name}\n`;
  copyMd += `Date: ${new Date().toISOString().split("T")[0]}\n\n`;
  copyMd += `## Basic Info\n`;
  copyMd += `- **Name:** ${seed.name}\n`;
  copyMd += `- **Address:** ${seed.address}\n`;
  copyMd += `- **Phone:** ${seed.phone || "Unknown"}\n`;
  copyMd += `- **Industry:** ${seed.industry}\n\n`;

  for (const entry of copyData) {
    copyMd += `## ${entry.source}\n`;
    for (const t of entry.texts) {
      copyMd += `${t}\n\n`;
    }
    copyMd += `---\n\n`;
  }

  copyMd += `## Image Sources\n`;
  for (let i = 0; i < uniqueUrls.length; i++) {
    copyMd += `- image-${i}: ${uniqueUrls[i].substring(0, 120)}...\n`;
  }

  // Only write if the file doesn't exist or is the skeleton version
  const copyPath = join(targetDir, "copy.md");
  if (!existsSync(copyPath) || Bun.file(copyPath).size < 500) {
    writeFileSync(copyPath, copyMd);
    console.log(`\nWrote copy.md`);
  } else {
    console.log(`\nSkipped copy.md (already has rich content)`);
  }

  // --- Generate starter profile.json ---
  const profilePath = join(targetDir, "profile.json");
  if (!existsSync(profilePath) || Bun.file(profilePath).size < 500) {
    const profile = {
      business: {
        name: seed.name,
        tagline: "TO BE FILLED FROM COPY REVIEW",
        slug,
        industry: seed.industry,
        location: { address: seed.address, city: seed.city, state: seed.state },
        phone: seed.phone,
        hours: "TO BE CONFIRMED",
        owners: [],
        ownerTitles: [],
      },
      voice: { tone: "", vocabulary: [], avoid: [], sampleQuotes: [] },
      brand: { colorDirection: "", existingColors: [], mood: "", archetype: "", fonts: { display: "", body: "" } },
      content: { heroHeadline: "", heroSubtext: "", services: [], testimonials: [], story: "", sellingPoints: [] },
      assets: { logo: "needs-manual", heroImage: "needs-manual", galleryImages: [], hasOwnerPhoto: false },
      meta: {
        currentWebPresence: seed.existingSite ? "Bad existing site" : "None",
        yelpUrl: seed.yelp || null,
        dateProfiled: new Date().toISOString().split("T")[0],
        readyToBuild: false,
      },
    };
    writeFileSync(profilePath, JSON.stringify(profile, null, 2));
    console.log(`Wrote profile.json (starter)`);
  } else {
    console.log(`Skipped profile.json (already has rich content)`);
  }

  // --- Generate verify-checklist.md ---
  const checkPath = join(targetDir, "verify-checklist.md");
  if (!existsSync(checkPath) || Bun.file(checkPath).size < 300) {
    const checklist = `# Verify Checklist: ${seed.name}
Date: ${new Date().toISOString().split("T")[0]}
Status: NEEDS REVIEW

## Logo
- [ ] Have logo?
- [ ] Quality rating: A / B / C / X
- [ ] Action needed:

## Hero Image
- [ ] Have hero?
- [ ] Quality rating: A / B / C / X
- [ ] Action needed:

## Interior/Establishment (need 2+)
- [ ] Photo 1:
- [ ] Photo 2:

## Product/Service Photos (need 3+)
- [ ] Photo 1:
- [ ] Photo 2:
- [ ] Photo 3:

## Copy Review
- [ ] Description captured?
- [ ] Hours confirmed?
- [ ] Pricing captured?
- [ ] Owner name known?
- [ ] 3+ review quotes?
- [ ] Voice/tone identified?

## Ready to Build?
- [ ] Blockers:
`;
    writeFileSync(checkPath, checklist);
    console.log(`Wrote verify-checklist.md`);
  } else {
    console.log(`Skipped verify-checklist.md (already has rich content)`);
  }

  console.log(`\n=== Harvest complete: ${seed.name} ===`);
  console.log(`  Assets: pipeline/targets/${slug}/assets/originals/`);
  console.log(`  Copy:   pipeline/targets/${slug}/copy.md`);
  console.log(`  Review: pipeline/targets/${slug}/verify-checklist.md`);
}

// --- CLI ---
const slug = process.argv[2];
if (!slug) {
  console.log("Usage: bun run pipeline/harvest.mjs <business-slug>");
  console.log("       bun run pipeline/harvest.mjs all\n");
  for (const [key, val] of Object.entries(SEEDS)) {
    console.log(`  ${key.padEnd(22)} ${val.name}`);
  }
  process.exit(0);
}

if (slug === "all") {
  for (const key of Object.keys(SEEDS)) {
    await harvest(key);
  }
} else {
  await harvest(slug);
}
