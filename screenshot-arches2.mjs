import { chromium } from 'playwright';

const browser = await chromium.launch();

async function captureVariant(n, viewport, suffix) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4500);

  // Progressive scroll to trigger leaf reveals
  for (let y = 400; y <= 3000; y += 400) {
    await page.evaluate((py) => window.scrollTo({ top: py, behavior: 'instant' }), y);
    await page.waitForTimeout(200);
  }

  // Click the variant button
  const btns = await page.$$('button');
  for (const btn of btns) {
    const text = await btn.textContent();
    if (text?.trim() === String(n)) {
      await btn.click();
      await page.waitForTimeout(300);
      break;
    }
  }
  await page.waitForTimeout(200);

  // Find "Our Craft" text and use its position
  const pos = await page.evaluate(() => {
    const el = document.querySelector('h2');
    const all = document.querySelectorAll('h2');
    for (const h of all) {
      if (h.textContent?.includes('Our Craft')) {
        const r = h.getBoundingClientRect();
        return { top: r.top + window.scrollY };
      }
    }
    return null;
  });

  if (pos) {
    // Scroll to show the heading and arches below it
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), pos.top - 80);
    await page.waitForTimeout(500);
  }

  await page.screenshot({ path: `screenshots/v${n}-${suffix}.png`, fullPage: false });
  await ctx.close();
}

// Desktop
for (let i = 1; i <= 5; i++) {
  await captureVariant(i, { width: 1440, height: 900 }, 'dt');
  console.log(`v${i}-dt done`);
}

// Mobile
for (let i = 1; i <= 5; i++) {
  await captureVariant(i, { width: 375, height: 812 }, 'mb');
  console.log(`v${i}-mb done`);
}

await browser.close();
console.log('Done!');
