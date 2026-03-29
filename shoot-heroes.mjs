import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "chrome" });

for (let v = 0; v < 5; v++) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  // Switch variant
  if (v > 0) {
    await page.keyboard.press(`Digit${v + 1}`);
    await page.waitForTimeout(400);
  }
  await page.screenshot({ path: `hero-${v + 1}.png` });
  
  // Also grab services section
  await page.evaluate(() => document.getElementById("services")?.scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `mid-${v + 1}.png` });

  // Process
  await page.evaluate(() => document.getElementById("process")?.scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `proc-${v + 1}.png` });

  // Contact
  await page.evaluate(() => document.getElementById("contact")?.scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(600);
  await page.screenshot({ path: `cta-${v + 1}.png` });

  await page.close();
}
await browser.close();
console.log("Done - fresh pages per variant");
