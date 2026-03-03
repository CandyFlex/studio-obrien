import { chromium } from 'playwright';
import { resolve } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const mainPath = resolve('src/main.tsx');
const originalMain = readFileSync(mainPath, 'utf8');

const variants = ['A', 'B', 'C', 'D'];
const browser = await chromium.launch();

for (const v of variants) {
  // Swap import to variant
  const variantMain = originalMain.replace(
    "import App from './App'",
    `import App from './variants/${v}'`
  );
  writeFileSync(mainPath, variantMain);

  // Wait for Vite HMR
  await new Promise(r => setTimeout(r, 2000));

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Hero screenshot
  await page.screenshot({ path: resolve(`_var-${v}-hero.png`) });

  // Scroll through to trigger animations
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= totalHeight; y += 200) {
    await page.evaluate((sy) => window.scrollTo({ top: sy, behavior: 'instant' }), y);
    await page.waitForTimeout(120);
  }

  // Find the changed section and screenshot it
  let scrollTarget = 1000; // default mid
  if (v === 'A') scrollTarget = 1050;  // services
  if (v === 'B') scrollTarget = 0;      // hero (re-screenshot after scroll triggers)
  if (v === 'C') scrollTarget = 1800;   // process
  if (v === 'D') scrollTarget = 2400;   // pricing

  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollTarget);
  await page.waitForTimeout(600);
  await page.screenshot({ path: resolve(`_var-${v}-focus.png`) });

  console.log(`Variant ${v} captured (height: ${totalHeight})`);
  await page.close();
}

// Restore original
writeFileSync(mainPath, originalMain);
await browser.close();
console.log('Done — main.tsx restored');
