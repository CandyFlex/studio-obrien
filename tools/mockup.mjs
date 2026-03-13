#!/usr/bin/env node
/**
 * Device Mockup Pipeline
 *
 * Usage:
 *   node tools/mockup.mjs <url-or-path> [--name sitename]
 *
 * Examples:
 *   node tools/mockup.mjs http://localhost:4001/mock-sites/carolina-arcade.html --name carolina-arcade
 *   node tools/mockup.mjs http://localhost:4001/mock-sites/carolina-arcade.html
 *   node tools/mockup.mjs /mock-sites/carolina-arcade.html --name arcade
 *
 * Outputs to tools/output/<name>/
 *   phone.png        — raw phone screenshot
 *   tablet.png       — raw tablet screenshot
 *   desktop.png      — raw desktop screenshot
 *   phone-framed.png — screenshot inside iPhone frame
 *   tablet-framed.png— screenshot inside iPad frame
 *   desktop-framed.png— screenshot inside MacBook frame
 *   trio.png         — all three devices composed together
 */

import { chromium, devices } from 'playwright';
import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const framesDir = join(__dir, 'frames');

// --- Parse args ---
const args = process.argv.slice(2);
if (!args.length) {
  console.log('Usage: node tools/mockup.mjs <url> [--name sitename]');
  console.log('       node tools/mockup.mjs http://localhost:4001/mock-sites/carolina-arcade.html --name arcade');
  process.exit(1);
}

let url = args[0];
let name = 'site';

const nameIdx = args.indexOf('--name');
if (nameIdx !== -1 && args[nameIdx + 1]) {
  name = args[nameIdx + 1];
} else {
  // Auto-derive name from URL
  const match = url.match(/\/([^\/]+?)(?:\.html?)?(?:\?|#|$)/);
  if (match) name = match[1];
}

// If path given instead of URL, prepend localhost
if (url.startsWith('/')) {
  url = `http://localhost:4001${url}`;
}

const outDir = join(__dir, 'output', name);
mkdirSync(outDir, { recursive: true });

// --- Check frames exist ---
if (!existsSync(join(framesDir, 'iphone.png'))) {
  console.log('Device frames not found. Generating...');
  const { execSync } = await import('child_process');
  execSync('node tools/generate-frames.mjs', { cwd: join(__dir, '..'), stdio: 'inherit' });
}

// --- Device configs ---
const captures = [
  {
    id: 'phone',
    label: 'iPhone 15',
    context: { ...devices['iPhone 15'], },
    frame: 'iphone',
    fullPage: false,
  },
  {
    id: 'tablet',
    label: 'iPad Pro 11',
    context: { ...devices['iPad Pro 11'], },
    frame: 'ipad',
    fullPage: false,
  },
  {
    id: 'desktop',
    label: 'MacBook (1440x900)',
    context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
    frame: 'macbook',
    fullPage: false,
  },
];

console.log(`\nMockup Pipeline: ${name}`);
console.log(`URL: ${url}\n`);

// --- Step 1: Capture screenshots ---
console.log('Step 1: Capturing screenshots...');
const browser = await chromium.launch();

for (const cap of captures) {
  const ctx = await browser.newContext(cap.context);
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500); // let animations settle

  const screenshotPath = join(outDir, `${cap.id}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: cap.fullPage });
  console.log(`  ${cap.label} → ${cap.id}.png`);
  await ctx.close();
}

await browser.close();

// --- Step 2: Composite into frames ---
console.log('\nStep 2: Framing screenshots...');

for (const cap of captures) {
  const configPath = join(framesDir, `${cap.frame}.json`);
  const framePath = join(framesDir, `${cap.frame}.png`);
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));

  // Resize screenshot to fit the screen area
  const screenshot = await sharp(join(outDir, `${cap.id}.png`))
    .resize(config.screen.w, config.screen.h, { fit: 'fill' })
    .toBuffer();

  // Composite: frame on top of screenshot-on-canvas
  await sharp({
    create: {
      width: config.frame.w,
      height: config.frame.h,
      channels: 4,
      background: '#00000000',
    },
  })
    .composite([
      { input: screenshot, left: config.screen.x, top: config.screen.y },
      { input: framePath, left: 0, top: 0 },
    ])
    .png()
    .toFile(join(outDir, `${cap.id}-framed.png`));

  console.log(`  ${cap.id}-framed.png`);
}

// --- Step 3: Compose trio image ---
console.log('\nStep 3: Composing trio...');

const phoneMeta = JSON.parse(readFileSync(join(framesDir, 'iphone.json'), 'utf-8'));
const tabletMeta = JSON.parse(readFileSync(join(framesDir, 'ipad.json'), 'utf-8'));
const macMeta = JSON.parse(readFileSync(join(framesDir, 'macbook.json'), 'utf-8'));

// Scale devices for the trio composition
const trioW = 2400;
const trioH = 1400;
const trioGap = 60;

// Desktop in back-center (scaled to ~65% width of trio)
const deskScale = 0.62;
const deskW = Math.round(macMeta.frame.w * deskScale);
const deskH = Math.round(macMeta.frame.h * deskScale);

// Tablet front-left (scaled to ~38%)
const tabScale = 0.38;
const tabW = Math.round(tabletMeta.frame.w * tabScale);
const tabH = Math.round(tabletMeta.frame.h * tabScale);

// Phone front-right (scaled to ~42%)
const phoneScale = 0.42;
const phoneW = Math.round(phoneMeta.frame.w * phoneScale);
const phoneH = Math.round(phoneMeta.frame.h * phoneScale);

const desktopFramed = await sharp(join(outDir, 'desktop-framed.png'))
  .resize(deskW, deskH, { fit: 'contain', background: '#00000000' })
  .toBuffer();

const tabletFramed = await sharp(join(outDir, 'tablet-framed.png'))
  .resize(tabW, tabH, { fit: 'contain', background: '#00000000' })
  .toBuffer();

const phoneFramed = await sharp(join(outDir, 'phone-framed.png'))
  .resize(phoneW, phoneH, { fit: 'contain', background: '#00000000' })
  .toBuffer();

// Position: desktop centered top, tablet bottom-left, phone bottom-right
const deskX = Math.round((trioW - deskW) / 2);
const deskY = 40;
const tabX = Math.round(trioW * 0.08);
const tabY = trioH - tabH - 40;
const phoneX = Math.round(trioW * 0.72);
const phoneY = trioH - phoneH - 40;

await sharp({
  create: {
    width: trioW,
    height: trioH,
    channels: 4,
    background: '#00000000',
  },
})
  .composite([
    { input: desktopFramed, left: deskX, top: deskY },
    { input: tabletFramed, left: tabX, top: tabY },
    { input: phoneFramed, left: phoneX, top: phoneY },
  ])
  .png()
  .toFile(join(outDir, 'trio.png'));

console.log('  trio.png (2400x1400)\n');
console.log(`All files saved to: tools/output/${name}/`);
console.log('Files:');
console.log('  phone.png, tablet.png, desktop.png        (raw screenshots)');
console.log('  phone-framed.png, tablet-framed.png, desktop-framed.png  (in device frames)');
console.log('  trio.png                                   (all three composed)');
