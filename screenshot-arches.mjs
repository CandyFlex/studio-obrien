import { chromium } from 'playwright';

const browser = await chromium.launch();

async function captureVariant(n, viewport, suffix) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(4000);

  // Scroll to trigger hedge reveals and find the section
  await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' }));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo({ top: 1800, behavior: 'instant' }));
  await page.waitForTimeout(400);

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

  // Find the "Our Craft" heading and scroll to reveal arches
  const craftHeading = await page.$('text=Our Craft');
  if (craftHeading) {
    const box = await craftHeading.boundingBox();
    if (box) {
      // Scroll so the arch section is nicely centered
      const scrollTo = box.y - 60;
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollTo);
      await page.waitForTimeout(500);
    }
  }

  await page.screenshot({ path: `screenshots/v${n}-${suffix}.png`, fullPage: false });
  await ctx.close();
}

// Desktop 1440x900
for (let i = 1; i <= 5; i++) {
  await captureVariant(i, { width: 1440, height: 900 }, 'dt');
  console.log(`v${i}-dt done`);
}

// Mobile 375x812
for (let i = 1; i <= 5; i++) {
  await captureVariant(i, { width: 375, height: 812 }, 'mb');
  console.log(`v${i}-mb done`);
}

await browser.close();
console.log('All done!');
