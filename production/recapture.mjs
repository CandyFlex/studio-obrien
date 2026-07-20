// Targeted re-capture for sites needing per-site handling (hide overlay widgets,
// force lazy maps/iframes to load before the shot). Writes into the same review
// folder. Run: node production/recapture.mjs
import { pathToFileURL as toFileURL } from 'node:url';
import { join } from 'node:path';
import { execSync } from 'node:child_process';

const gRoot = execSync('npm root -g').toString().trim();
const pw = await import(toFileURL(join(gRoot, 'playwright', 'index.js')).href);
const chromium = pw.chromium || pw.default?.chromium;

const OBRIEN = 'C:/Users/Jarre/Desktop/Obrien Studio Portfolio';
const PIPE = 'C:/Users/Jarre/Desktop/Website Pipe';
const OUT = join(OBRIEN, 'preview', 'portfolio-review');

const TASKS = [
  {
    slug: 'queen-city-air',
    path: `${PIPE}/projects/queen-city-air/index.html`,
    hide: ['.chat'], // fixed "Text us." chat chip bottom-right
  },
  {
    slug: 'queen-city-comfort',
    path: `${OBRIEN}/queen-city-comfort/index.html`,
    hide: ['.chat'],
    mapSelector: '.home-section-9__map iframe', // lazy Google Maps embed
  },
];

const fileURL = (p) => 'file:///' + p.replace(/\\/g, '/').replace(/^\/+/, '');

async function waitForImages(page) {
  return page.evaluate(async () => {
    const pending = [...document.images].filter((i) => !(i.complete && i.naturalWidth > 0));
    await Promise.all(pending.map((img) =>
      Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 8000))])));
  });
}

const browser = await chromium.launch();
for (const t of TASKS) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const failed = [];
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url().slice(-70)}`); });
  page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText} ${r.url().slice(-70)}`));

  await page.goto(fileURL(t.path), { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  if (t.hide?.length) {
    await page.addStyleTag({ content: t.hide.map((s) => `${s}{display:none!important}`).join('') });
  }
  await waitForImages(page);

  // Scroll whole page to trip lazy loaders (maps/iframes), settling at each step.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 150));
    }
  });

  let mapNote = '';
  if (t.mapSelector) {
    const found = await page.$(t.mapSelector);
    if (found) {
      await found.scrollIntoViewIfNeeded();
      // Google Maps embed tiles load progressively; give them real time.
      await page.waitForTimeout(7000);
      mapNote = ' (map scrolled+waited)';
    } else {
      mapNote = ' (map selector NOT FOUND)';
    }
  }

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(OUT, `${t.slug}-hero.png`) });
  await page.screenshot({ path: join(OUT, `${t.slug}-full.png`), fullPage: true });

  console.log(`  ${t.slug}${mapNote}${failed.length ? '  ⚠ ' + failed.slice(0, 5).join(' | ') : '  clean'}`);
  await page.close();
}
await browser.close();
console.log('done -> preview/portfolio-review/');
