// Restaurant-set capture pass -> preview/portfolio-review/
// Load-gated: networkidle + fonts.ready + every <img> decoded + scroll-through
// (trip entrance animations) + settle. Explicitly reports BROKEN images
// (naturalWidth==0), failed file requests, and console errors so a broken
// capture is caught before it ships. Nothing here touches portfolio/ or index.html.
//
// Run: node production/capture-restaurants.mjs
import { pathToFileURL as toFileURL } from 'node:url';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';

const gRoot = execSync('npm root -g').toString().trim();
const pw = await import(toFileURL(join(gRoot, 'playwright', 'index.js')).href);
const chromium = pw.chromium || pw.default?.chromium;

const DESK = 'C:/Users/Jarre/Desktop';
const OBRIEN = `${DESK}/Obrien Studio Portfolio`;
const SUSHI = `${DESK}/Portfolio Sushi Takumi`;
const PIPE = `${DESK}/Website Pipe`;
const OUT = join(OBRIEN, 'preview', 'portfolio-review');
mkdirSync(OUT, { recursive: true });

const SITES = [
  ['takumi-japanese',  `${SUSHI}/index.html`],
  ['hwaro-korean',     `${SUSHI}/Food-Variations/variant-korean-hwaro.html`],
  ['thalassa-greek',   `${SUSHI}/Food-Variations/variant-greek-thalassa.html`],
  ['lucciola-italian', `${SUSHI}/Food-Variations/variant-italian-lucciola.html`],
  ['milpa-mexican',    `${SUSHI}/Food-Variations/variant-mexican-milpa.html`],
  ['kyma-greek',       `${PIPE}/pieces/kyma/index.html`],
];

const fileURL = (p) => 'file:///' + p.replace(/\\/g, '/').replace(/^\/+/, '');

async function waitForImages(page) {
  return page.evaluate(async () => {
    const imgs = [...document.images];
    const pending = imgs.filter((i) => !(i.complete && i.naturalWidth > 0));
    await Promise.all(
      pending.map((img) =>
        Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 8000))])
      )
    );
    return { total: imgs.length };
  });
}

// After everything settles, list images the browser could NOT paint.
async function brokenImages(page) {
  return page.evaluate(() =>
    [...document.images]
      .filter((i) => !(i.complete && i.naturalWidth > 0))
      .map((i) => i.currentSrc || i.src)
      .map((u) => u.split('/').slice(-1)[0])
  );
}

async function scrollThrough(page) {
  await page.evaluate(async () => {
    const step = 600;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 140));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    await new Promise((r) => setTimeout(r, 400));
  });
}

const browser = await chromium.launch();
const report = [];

for (const [slug, path] of SITES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const failed = [];
  const consoleErrors = [];
  page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText || 'failed'}  ${r.url().split('/').slice(-1)[0]}`));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`HTTP ${r.status()}  ${r.url().split('/').slice(-1)[0]}`); });
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 120)); });

  const notes = [];
  try {
    await page.goto(fileURL(path), { waitUntil: 'networkidle', timeout: 60000 });

    const fontsOk = await page.evaluate(async () => {
      if (!document.fonts) return 'no-fontface-api';
      await document.fonts.ready;
      return document.fonts.status;
    });
    if (fontsOk !== 'loaded' && fontsOk !== 'no-fontface-api') notes.push(`fonts:${fontsOk}`);

    const imgStat = await waitForImages(page);
    await scrollThrough(page);
    await waitForImages(page);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(1000);

    await page.screenshot({ path: join(OUT, `${slug}-hero.png`) });
    await page.screenshot({ path: join(OUT, `${slug}-full.png`), fullPage: true });

    const broken = await brokenImages(page);
    const heroText = await page.evaluate(() => {
      const el = document.querySelector('h1');
      return el ? (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 48) : '(no h1)';
    });

    let line = `  ${broken.length ? 'WARN' : 'OK  '} ${slug.padEnd(18)} imgs:${imgStat.total} h1:"${heroText}"`;
    if (notes.length) line += `  ⚠ ${notes.join(',')}`;
    if (consoleErrors.length) line += `  ⚠ ${consoleErrors.length} console err`;
    report.push(line);
    if (broken.length) report.push(`        BROKEN IMG (${broken.length}): ${[...new Set(broken)].slice(0, 8).join(', ')}`);
    const fileFails = [...new Set(failed)].filter((f) => !/googleapis|gstatic|font/i.test(f));
    if (fileFails.length) report.push(`        REQ FAIL (${fileFails.length}): ${fileFails.slice(0, 6).join(' | ')}`);
  } catch (e) {
    report.push(`  FAIL ${slug.padEnd(18)} ${e.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
console.log(`\nRestaurant captures -> preview/portfolio-review/\n${report.join('\n')}\n`);
