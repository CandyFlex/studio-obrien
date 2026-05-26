import { chromium } from "playwright";
const variants = ["Evergreen", "Midnight", "Slate", "Walnut", "Obsidian"];
const browser = await chromium.launch();

for (let i = 0; i < 5; i++) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  // Press the variant key
  await page.keyboard.press(`${i + 1}`);
  await page.waitForTimeout(400);
  // Hero
  await page.screenshot({ path: `hero-${i + 1}.png` });
  // Scroll to services
  await page.evaluate(() => document.querySelector("#services")?.scrollIntoView());
  await page.waitForTimeout(300);
  await page.screenshot({ path: `mid-${i + 1}.png` });
  // Scroll to process
  await page.evaluate(() => document.querySelector("#process")?.scrollIntoView());
  await page.waitForTimeout(300);
  await page.screenshot({ path: `proc-${i + 1}.png` });
  // Scroll to contact
  await page.evaluate(() => document.querySelector("#contact")?.scrollIntoView());
  await page.waitForTimeout(300);
  await page.screenshot({ path: `cta-${i + 1}.png` });
  await page.close();
  console.log(`${variants[i]} done`);
}
await browser.close();
console.log("All screenshots captured");
