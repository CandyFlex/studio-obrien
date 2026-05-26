import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'fs';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

// Hide scrollbar BEFORE navigating
await page.addInitScript(() => {
  const style = document.createElement('style');
  style.textContent = 'html::-webkit-scrollbar { display: none !important; } html { scrollbar-width: none !important; }';
  document.documentElement.appendChild(style);
});

await page.goto('http://localhost:8888/mock-sites/carolina-arcade.html', {
  waitUntil: 'networkidle', timeout: 30000,
});

// Re-apply scrollbar hide after page load
await page.addStyleTag({ content: 'html::-webkit-scrollbar { display: none !important; } html { scrollbar-width: none !important; overflow-y: scroll; }' });
await page.waitForTimeout(500);

// Scroll through to trigger all lazy images
for (let y = 0; y < 8000; y += 400) {
  await page.evaluate(y => window.scrollTo(0, y), y);
  await page.waitForTimeout(250);
}

// Wait at Visit section for map
await page.evaluate(() => document.getElementById('visit').scrollIntoView());
await page.waitForTimeout(6000);

// Get map position
const mapPos = await page.evaluate(() => {
  const iframe = document.querySelector('iframe');
  if (!iframe) return null;
  const rect = iframe.getBoundingClientRect();
  return {
    top: Math.round(rect.top + window.scrollY),
    left: Math.round(rect.left),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
    vpTop: Math.round(rect.top),
  };
});
console.log('Map:', mapPos);

// Screenshot viewport with map visible
await page.screenshot({ path: 'public/mock-sites/assets/carolina-arcade/map-viewport.png' });

// Scroll to top, wait, take full-page
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);

await page.screenshot({ path: 'public/mock-sites/assets/carolina-arcade/fullpage-screenshot.png', fullPage: true });

const meta = await sharp('public/mock-sites/assets/carolina-arcade/fullpage-screenshot.png').metadata();
console.log('Full page:', meta.width + 'x' + meta.height);

// Check top pixels — the nav should start at y=0
const topStrip = await sharp('public/mock-sites/assets/carolina-arcade/fullpage-screenshot.png')
  .extract({ left: 0, top: 0, width: meta.width, height: 10 })
  .raw()
  .toBuffer();
const firstPixel = [topStrip[0], topStrip[1], topStrip[2]];
console.log('Top-left pixel RGB:', firstPixel, '(should be near 8,8,12 for nav bg)');

// Composite map
if (mapPos && mapPos.vpTop >= 0) {
  const mapCrop = await sharp('public/mock-sites/assets/carolina-arcade/map-viewport.png')
    .extract({
      left: mapPos.left,
      top: mapPos.vpTop,
      width: Math.min(mapPos.width, 1920 - mapPos.left),
      height: Math.min(mapPos.height, 1080 - mapPos.vpTop),
    })
    .toBuffer();

  await sharp('public/mock-sites/assets/carolina-arcade/fullpage-screenshot.png')
    .composite([{ input: mapCrop, top: mapPos.top, left: mapPos.left }])
    .toFile('public/mock-sites/assets/carolina-arcade/fullpage-with-map.png');

  fs.copyFileSync(
    'public/mock-sites/assets/carolina-arcade/fullpage-with-map.png',
    'public/mock-sites/assets/carolina-arcade/fullpage-screenshot.png'
  );
  fs.unlinkSync('public/mock-sites/assets/carolina-arcade/fullpage-with-map.png');
  console.log('Map composited');
}

const finalMeta = await sharp('public/mock-sites/assets/carolina-arcade/fullpage-screenshot.png').metadata();
console.log('Final:', finalMeta.width + 'x' + finalMeta.height);

await browser.close();
