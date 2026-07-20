// Consolidated portfolio capture pass — ALL candidate sites into one review folder.
// Load-gated so nothing is shot before it finishes rendering: network idle +
// fonts.ready + every <img> decoded + settle. Failed assets and console errors
// are logged per site so a blank/broken capture is caught, not shipped.
//
// Output: preview/portfolio-review/<slug>-hero.png  (above-the-fold, 1440x900 @2x)
//         preview/portfolio-review/<slug>-full.png  (whole page)
// Nothing here touches portfolio/ or index.html.
//
// Run: node production/capture-sites.mjs
import { pathToFileURL as toFileURL } from 'node:url';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const gRoot = execSync('npm root -g').toString().trim();
const pw = await import(toFileURL(join(gRoot, 'playwright', 'index.js')).href);
const chromium = pw.chromium || pw.default?.chromium;

const OBRIEN = 'C:/Users/Jarre/Desktop/Obrien Studio Portfolio';
const PIPE = 'C:/Users/Jarre/Desktop/Website Pipe';
const OUT = join(OBRIEN, 'preview', 'portfolio-review');
mkdirSync(OUT, { recursive: true });

// slug (brand-friendly, review-legible) -> absolute path to the site's index.html
const SITES = [
  // ---- Obrien Studio Portfolio set ----
  ['bens-smokehouse',    `${OBRIEN}/bens-smokehouse/index.html`],
  ['clover-dental',      `${OBRIEN}/clover-dental/index.html`],
  ['harborlight-rescue', `${OBRIEN}/harborlight/index.html`],
  ['queen-city-comfort', `${OBRIEN}/queen-city-comfort/index.html`],
  ['stansac-qcc-alt',    `${OBRIEN}/stansac-clone/index.html`],
  ['terry-blacks-bbq',   `${OBRIEN}/terry-blacks-bbq/index.html`],
  // ---- Website Pipe trade-archetype set ----
  ['cardinal-pest',      `${PIPE}/projects/alta-pest/index.html`],
  ['piedmont-concrete',  `${PIPE}/projects/bluebonnet-concrete/index.html`],
  ['calloway-hvac',      `${PIPE}/projects/charlotte-hvac/index.html`],
  ['queen-city-air',     `${PIPE}/projects/queen-city-air/index.html`],
  ['qc-landscaping',     `${PIPE}/projects/straightedge-atx/index.html`],
  ['cwg-electric',       `${PIPE}/projects/touchstone-electric/index.html`],
];

const fileURL = (p) => 'file:///' + p.replace(/\\/g, '/').replace(/^\/+/, '');

// Wait until every <img> in the DOM is decoded (or a per-image timeout elapses),
// so text-in-images and photo panels are never captured half-painted.
async function waitForImages(page) {
  return page.evaluate(async () => {
    const imgs = [...document.images];
    const pending = imgs.filter((i) => !(i.complete && i.naturalWidth > 0));
    await Promise.all(
      pending.map(
        (img) =>
          Promise.race([
            img.decode().catch(() => {}),
            new Promise((r) => setTimeout(r, 8000)),
          ])
      )
    );
    return { total: imgs.length, wereLoading: pending.length };
  });
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = 600;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 130));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 400));
  });
}

const browser = await chromium.launch();
const report = [];

for (const [slug, path] of SITES) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const failed = [];
  const consoleErrors = [];
  page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText || 'failed'}  ${r.url().slice(-60)}`));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`HTTP ${r.status()}  ${r.url().slice(-60)}`); });
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 120)); });

  const notes = [];
  try {
    await page.goto(fileURL(path), { waitUntil: 'networkidle', timeout: 60000 });

    // Gate on fonts: invisible-text (FOIT) is the #1 cause of "text not loading".
    const fontsOk = await page.evaluate(async () => {
      if (!document.fonts) return 'no-fontface-api';
      await document.fonts.ready;
      return document.fonts.status; // 'loaded' when all in-use faces resolved
    });
    if (fontsOk !== 'loaded' && fontsOk !== 'no-fontface-api') notes.push(`fonts:${fontsOk}`);

    const imgStat = await waitForImages(page);
    await scrollThrough(page);
    await waitForImages(page); // re-check after lazy content revealed
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(900); // settle entrance animations at rest

    const hero = join(OUT, `${slug}-hero.png`);
    await page.screenshot({ path: hero });
    const full = join(OUT, `${slug}-full.png`);
    await page.screenshot({ path: full, fullPage: true });

    // Sanity: is the hero viewport suspiciously blank (near-white)? cheap heuristic.
    const heroText = await page.evaluate(() => {
      const el = document.querySelector('h1');
      return el ? (el.textContent || '').trim().slice(0, 40) : '(no h1)';
    });

    let line = `  OK   ${slug.padEnd(20)} imgs:${imgStat.total} h1:"${heroText}"`;
    if (notes.length) line += `  ⚠ ${notes.join(',')}`;
    if (failed.length) line += `  ⚠ ${failed.length} asset issue(s)`;
    if (consoleErrors.length) line += `  ⚠ ${consoleErrors.length} console err(s)`;
    report.push(line);
    if (failed.length) report.push('        ' + failed.slice(0, 4).join('\n        '));
  } catch (e) {
    report.push(`  FAIL ${slug.padEnd(20)} ${e.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`\nReview captures -> preview/portfolio-review/\n${report.join('\n')}\n`);
