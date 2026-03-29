import { chromium } from "playwright";

const viewports = [
  { name: "mobile", w: 375, h: 812 },
  { name: "desktop", w: 1440, h: 900 },
];

const sections = [
  { name: "hero", scroll: 0 },
  { name: "problem", scroll: 700 },
  { name: "services", scroll: 1200 },
  { name: "portfolio", scroll: 2000 },
  { name: "process", scroll: 2800 },
  { name: "about", scroll: 3400 },
  { name: "faq", scroll: 4000 },
  { name: "contact", scroll: 4600 },
  { name: "footer", scroll: 5200 },
];

const browser = await chromium.launch({ channel: "chrome" });

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  
  for (const sec of sections) {
    await page.evaluate(y => window.scrollTo(0, y), sec.scroll);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `v2-${vp.name}-${sec.name}.png` });
  }
  await page.close();
}

await browser.close();
console.log("Done — screenshots saved");
