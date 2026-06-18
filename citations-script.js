const { chromium } = require('playwright');

const DATA = {
  businessName: "O'Brien Studio",
  email: 'jarredkern@gmail.com',
  website: 'https://studioobrien.com',
  displayWebsite: 'studioobrien.com',
  city: 'Shelby',
  state: 'NC',
  zip: '28150',
  phone: '',
  linkedin: 'https://linkedin.com/in/jarred-kern',
  shortDesc: 'Custom web design studio in Shelby, NC. No templates, no lock-in. Restaurants, small businesses, nonprofits. SEO, branding, Google Business Profile, 14-day delivery.',
  longDesc: "O'Brien Studio is a custom web design and development studio based in Shelby, North Carolina. Every site is designed and coded from scratch — no templates. Clients own their domain, hosting, and every line of code. No lock-in. Services include custom web design, SEO, Google Business Profile setup, UI/UX design, website migration, branding, and copywriting. Most projects launch in 14 days."
};

async function brownbook(page) {
  console.log('--- Brownbook ---');
  await page.goto('https://www.brownbook.net/business/add/', { waitUntil: 'networkidle' });
  await page.click('text=Add a New Business');
  await page.waitForTimeout(1000);

  // Business name
  await page.fill('input[name="business_name"]', DATA.businessName);
  // Category - click to open, search, select
  await page.click('text=Select category');
  await page.waitForTimeout(500);
  await page.fill('input[placeholder*="search categories"]', 'graphic design');
  await page.waitForTimeout(1000);
  await page.click('text=Graphic Design Services');
  await page.waitForTimeout(500);

  // Contact info
  await page.fill('input[name="address"]', DATA.city);
  await page.fill('input[name="city"]', DATA.city);
  await page.selectOption('select', 'US');
  await page.fill('input[name="zip_code"]', DATA.zip);
  await page.fill('input[name="email"]', DATA.email);
  await page.fill('input[name="website"]', DATA.website);
  await page.fill('input[name="display_website"]', DATA.displayWebsite);
  await page.fill('input[name="linkedin"]', DATA.linkedin);

  // Click Next
  await page.click('button:has-text("Next")');
  await page.waitForTimeout(2000);
  console.log('Brownbook: form submitted (check for email verification)');
}

async function hotfrog(page) {
  console.log('--- Hotfrog ---');
  try {
    await page.goto('https://www.hotfrog.com/add-business/', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    // Try to fill what we can
    const inputs = await page.$$('input');
    console.log(`Hotfrog: found ${inputs.length} inputs`);
    // Hotfrog's signup flow varies by region
  } catch(e) {
    console.log('Hotfrog: navigation failed - may require manual signup');
  }
}

async function merchantcircle(page) {
  console.log('--- MerchantCircle ---');
  try {
    await page.goto('https://www.merchantcircle.com', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    // Look for signup/add business link
    const addLink = await page.$('a:has-text("Add"), a:has-text("Join"), a:has-text("Sign")');
    console.log(`MerchantCircle: add link ${addLink ? 'found' : 'not found'}`);
  } catch(e) {
    console.log('MerchantCircle: navigation failed');
  }
}

async function manta(page) {
  console.log('--- Manta ---');
  try {
    await page.goto('https://www.manta.com', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(2000);
    const addLink = await page.$('a:has-text("Add"), a:has-text("List"), a:has-text("Join")');
    console.log(`Manta: add link ${addLink ? 'found' : 'not found'}`);
  } catch(e) {
    console.log('Manta: navigation failed');
  }
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Do Brownbook first (most viable)
  await brownbook(page);
  console.log('\n--- Done with Brownbook ---');
  console.log('Check your email (jarredkern@gmail.com) for verification links.');
  console.log('Browser will stay open for 60 seconds so you can check.');
  await page.waitForTimeout(60000);

  // User can manually verify and continue
  await browser.close();
})();
