import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

for (let v = 0; v < 5; v++) {
  // Press number key to switch variant
  await page.keyboard.press(`Digit${v + 1}`);
  await page.waitForTimeout(400);
  
  // Scroll to top for hero
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `variant-${v + 1}-hero.png` });
  
  // Scroll to services
  await page.evaluate(() => document.getElementById("services")?.scrollIntoView());
  await page.waitForTimeout(500);
  await page.screenshot({ path: `variant-${v + 1}-services.png` });
  
  // Scroll to portfolio
  await page.evaluate(() => document.getElementById("work")?.scrollIntoView());
  await page.waitForTimeout(500);
  await page.screenshot({ path: `variant-${v + 1}-portfolio.png` });
  
  // Scroll to process
  await page.evaluate(() => document.getElementById("process")?.scrollIntoView());
  await page.waitForTimeout(500);
  await page.screenshot({ path: `variant-${v + 1}-process.png` });

  // Scroll to contact
  await page.evaluate(() => document.getElementById("contact")?.scrollIntoView());
  await page.waitForTimeout(500);
  await page.screenshot({ path: `variant-${v + 1}-contact.png` });
}

await browser.close();
console.log("All 5 variants captured");
