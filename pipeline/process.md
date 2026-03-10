# Pipeline Process - Step by Step

---

## STAGE 1: TARGET
**Goal:** Find a business worth building for.

### Qualifying Criteria
A good target checks at least 4 of these 5:
- [ ] No website, OR website is a free builder (Wix, Square, GoDaddy, Facebook page)
- [ ] Independently owned (not a franchise or chain)
- [ ] Has a physical location you could walk into
- [ ] Active on at least one social platform (Facebook, Instagram, or Google Business)
- [ ] Industry that makes a visually interesting portfolio piece

### Where to Find Targets
**Local directories (best source):**
- exploreforestcity.com/shop and /eat-drink
- uptownshelby.com/uptown-businesses
- cityofshelby.com business directory
- Rutherford County Chamber: rutherfordcoc.org

**Cross-reference method:**
1. Get a business name from a directory
2. Google "[Business Name] [City] NC"
3. Look at their Google Business Profile
4. If the "Website" link goes to facebook.com, instagram.com, or a .wixsite.com/.square.site URL, they're a target
5. If there's no website link at all, even better

**Yelp scan method:**
1. Go to yelp.com, search by category in Shelby or Forest City
2. Click through each business
3. If there's no "Business website" link, or it points to social media, that's a target

### Industry Priority (for portfolio diversity)
Track what you've already built. Aim for no more than 2 sites in the same industry across your full portfolio. High-value industries:
- Food/Drink (restaurants, bars, cafes, bakeries)
- Entertainment/Leisure (museums, venues, arcades)
- Health/Wellness (gyms, yoga, chiro, dental)
- Trades (construction, welding, HVAC, auto)
- Retail (boutiques, specialty shops, pet stores)
- Services (salons, barbers, tattoo, photography)
- Professional (legal, accounting, real estate)

---

## STAGE 2: HARVEST
**Goal:** Collect every piece of their existing brand identity from public sources.

### 2A: Logo & Visual Identity

**Facebook Business Page:**
- Profile picture (often their logo, but low-res)
  - Right-click > Open image in new tab > Save (gets the largest available)
  - On desktop Facebook, profile pics are served at up to 320x320
- Cover photo (banner image, sometimes shows their vibe/aesthetic)
  - Right-click the cover > Open in new tab > Save
  - Cover photos are served at 820x312 on desktop
- Check their "Photos" tab for any logo variations or signage photos

**Instagram:**
- Profile picture (usually same as Facebook, 150x150 max from the page)
- Browse their feed for:
  - Any graphic with their logo on it (flyers, promos, event posters)
  - Interior/exterior shots of the business
  - Product shots
  - Team/owner photos
  - Customer/crowd shots
- Save the best ones. Instagram serves images at up to 1080x1080

**Google Business Profile:**
- Click on their photos in Google Maps/Search
  - Owner-uploaded photos are often the best quality
  - "By owner" tagged photos vs "By customers" (owner ones are usually better)
  - Google serves these at decent resolution
  - Right-click > Open image in new tab to get full-size URL

**Yelp:**
- Business photos (often customer-uploaded, mixed quality)
- Look for interior shots, food photos (for restaurants), storefront shots
- Yelp photos can be opened in a larger viewer

**TripAdvisor:**
- Similar to Yelp, check the photo gallery
- Traveler photos sometimes have wider shots of the business

**Google Image Search:**
- Search "[Business Name] [City] NC" in Google Images
- Look for local news articles, chamber of commerce features, event listings
- These sometimes have high-res photos you won't find elsewhere

### 2B: Copy & Voice

**Google Business Profile:**
- Business description (this is often how they describe themselves)
- Business category
- Hours of operation
- Address and phone
- Services listed
- Q&A section (if they've answered questions, that's their voice)

**Facebook About section:**
- Their self-written description
- Any mission statement or story
- Category, hours, price range

**Instagram Bio:**
- Usually their most distilled identity (how they see themselves in one line)

**Yelp Business Info:**
- "From the business" description (owner-written)
- Specialties listed
- History section (if filled out)

**Review Mining (critical for voice and selling points):**
- Read 10-20 reviews across Yelp, Google, TripAdvisor
- Note what customers praise repeatedly (this is their actual value proposition)
- Note specific product/service names customers mention
- Note the TONE of the reviews (casual? enthusiastic? detailed?)
- Pull 3-5 direct quotes that could become testimonials
- These reviews tell you what the business is ACTUALLY known for, which may differ from what the owner thinks they're known for

**Local Press/Features:**
- Search "[Business Name] [City]" for any local news articles
- Check visitncsmalltowns.com (many Forest City businesses are listed)
- Check exploreforestcity.com for their listing description
- Local articles often have quotes from the owner, background story, etc.

### 2C: File Organization
Save everything into the target folder:
```
targets/[business-slug]/
  assets/
    logo.png              <- Best version of their logo
    logo-original.png     <- Unmodified source
    banner.png            <- Facebook/Google banner
    storefront.jpg        <- Exterior shot
    interior-1.jpg        <- Interior shots
    interior-2.jpg
    product-1.jpg         <- Products/food/services
    product-2.jpg
    team.jpg              <- Owner/staff if available
    photos/               <- Everything else
  copy.md                 <- All scraped text, organized by source
  profile.json            <- Generated in Stage 4
```

---

## STAGE 3: VERIFY
**Goal:** You review every asset and decide what's usable, what needs replacing, and what's missing.

### Asset Quality Checklist

For each image, rate it:
- **A: Use as-is** - Good resolution (600px+ wide), clear, represents them well
- **B: Usable with processing** - Decent but needs cropping, brightness, or upscaling
- **C: Replace manually** - Too low-res, blurry, wrong aspect, or not representative
- **X: Skip** - Not useful for the site

### Verify Checklist Template
Create `verify-checklist.md` in the target folder:

```
# Verify Checklist: [Business Name]

## Logo
- [ ] Have logo? Y/N
- [ ] Quality rating: A / B / C / X
- [ ] Notes:
- [ ] Action needed:

## Banner/Hero Image
- [ ] Have banner? Y/N
- [ ] Quality rating: A / B / C / X
- [ ] Notes:
- [ ] Action needed:

## Establishment Photos (need at least 2)
- [ ] Storefront: A / B / C / X
- [ ] Interior: A / B / C / X
- [ ] Action needed:

## Product/Service Photos (need at least 3)
- [ ] Photo 1: A / B / C / X
- [ ] Photo 2: A / B / C / X
- [ ] Photo 3: A / B / C / X
- [ ] Action needed:

## People Photos
- [ ] Owner/team: A / B / C / X
- [ ] Customer/crowd: A / B / C / X
- [ ] Action needed:

## Copy Review
- [ ] Business description captured? Y/N
- [ ] Hours confirmed? Y/N
- [ ] Pricing/menu captured? Y/N
- [ ] Owner name known? Y/N
- [ ] At least 3 review quotes pulled? Y/N
- [ ] Their voice/tone identified? Y/N

## Missing Assets (you need to get manually)
- [ ] List what you need to photograph, screenshot, or source yourself
```

### Manual Asset Acquisition
If critical assets are missing or low-quality:
- **Drive by and photograph the storefront** (you're local, this takes 5 minutes)
- **Visit as a customer** and take discreet interior photos
- **Ask friends/family** if they have photos from visiting
- **Check tagged posts** on Instagram/Facebook for customer photos that might be higher quality
- **Use AI upscaling** (topaz, realsr) on logos that are too small but otherwise clean

---

## STAGE 4: PROFILE
**Goal:** Create the structured brand profile that drives the entire site build.

### profile.json Structure

```json
{
  "business": {
    "name": "The Hoot Nannie",
    "tagline": "From their own description or derived from reviews",
    "slug": "hoot-nannie",
    "industry": "Restaurant / BBQ",
    "location": {
      "address": "164 E Main St",
      "city": "Forest City",
      "state": "NC",
      "zip": "28043",
      "county": "Rutherford"
    },
    "phone": "(828) 229-3016",
    "hours": {
      "mon": "Closed",
      "tue": "Closed",
      "wed": "11am - 8pm",
      "thu": "11am - 9pm",
      "fri": "11am - 9pm",
      "sat": "11am - 9pm",
      "sun": "10am - 4pm"
    },
    "founded": "Approximate year or 'est. YYYY'",
    "owners": ["Johnny Ray", "Steve"],
    "ownerTitles": ["Farmer & Pitmaster", "Co-Owner"]
  },

  "voice": {
    "tone": "folksy, down-home, unpretentious, proud of local roots",
    "vocabulary": ["whole hog", "farm-raised", "smoked", "from the farm"],
    "avoid": ["artisanal", "curated", "elevated", "craft"],
    "sampleQuotes": [
      "Direct quotes from their own descriptions"
    ]
  },

  "brand": {
    "colorDirection": "What colors they already use or gravitate toward",
    "existingColors": ["#hex if identifiable from logo/branding"],
    "mood": "1-2 word mood descriptor",
    "archetype": "The design archetype that fits THEIR vibe, not your preference",
    "fonts": {
      "display": "Suggested display font that matches their energy",
      "body": "Suggested body font"
    }
  },

  "content": {
    "heroHeadline": "Derived from their own language, not invented",
    "heroSubtext": "From their description or top review themes",
    "services": [
      {
        "name": "Service name in THEIR words",
        "description": "From their own listings",
        "price": "If publicly listed"
      }
    ],
    "testimonials": [
      {
        "quote": "Actual review text, lightly edited for length",
        "author": "First name + last initial",
        "source": "Google/Yelp/TripAdvisor"
      }
    ],
    "story": "Their origin story from Facebook/press/Yelp about section",
    "sellingPoints": [
      "Top 3-5 things customers consistently praise in reviews"
    ]
  },

  "assets": {
    "logo": "path/to/logo.png",
    "logoQuality": "A/B/C",
    "heroImage": "path or 'needs-manual'",
    "galleryImages": ["paths"],
    "hasOwnerPhoto": true
  },

  "meta": {
    "currentWebPresence": "None / Facebook only / Bad Wix site / etc",
    "googleRating": "4.2",
    "reviewCount": 47,
    "yelpRating": "4.0",
    "competitors": "Any similar businesses in the area with better sites",
    "dateProfiled": "2026-03-05",
    "readyToBuild": false
  }
}
```

### Profile Review
Before building, review the profile and ask:
- Does the headline sound like THEM, not like me?
- Would the owner read this copy and say "yeah, that's us"?
- Are the colors/mood based on what they project, or what I think looks cool?
- Is there anything here that assumes or imposes on their brand?

---

## STAGE 5: BUILD
**Goal:** Generate the full mock site from the profile.

### Build Prompt Template
When telling Claude to build a site, use this structure:

```
Build a single-page HTML website for [Business Name] based on
the following brand profile. This site should feel like it came
FROM the business, not from a designer. Use their voice, their
words, their aesthetic. Do not impose a new brand identity.

[Paste profile.json contents]

Requirements:
- Single HTML file with all CSS inline/embedded
- Google Fonts only (no external dependencies)
- Fully responsive (mobile-first)
- 6-8 sections minimum: Hero, [list sections from profile]
- Use their actual copy for headlines and descriptions
- Use placeholder images with descriptive alt text where real
  images will be swapped in (use data-asset="logo.png" attributes
  so images can be batch-replaced later)
- Include their real address, phone, hours
- Testimonials from real reviews (attributed)
- No lorem ipsum anywhere. Every word should be real or
  realistically derived from their existing content.
- Include subtle entrance animations (CSS-only, no JS libraries)
- Add a small "Website designed by Studio O'Brien" in the footer
  with a link back to your portfolio
```

### Image Placeholder System
Since you'll swap real images in later, use this pattern in the HTML:
```html
<img src="/pipeline/targets/[slug]/assets/storefront.jpg"
     data-asset="storefront"
     alt="[Business Name] storefront on Main Street, Forest City NC"
     class="hero-bg" />
```

For images that don't exist yet, use a styled placeholder:
```html
<div class="image-placeholder" data-asset="interior-1"
     style="background: #2a2a2a; aspect-ratio: 16/9; display: grid;
     place-items: center; color: #666; font-style: italic;">
  Interior photo needed
</div>
```

This makes it obvious during your verify pass what still needs a real image.

### Build Iterations
1. First pass: full site generated from profile
2. You review: does it sound like them? Does it feel like them?
3. Note specific fixes ("the headline is too clever, use their actual words")
4. Second pass: refinements
5. Final review before screenshot

---

## STAGE 6: SCREENSHOT
**Goal:** Capture portfolio-ready images.

### Screenshots Needed Per Site
1. **hero-crop.png** (1440x900) - Top fold, used in portfolio grid
2. **full-page-desktop.png** (1440px wide, full scroll) - For case study
3. **full-page-mobile.png** (375px wide, full scroll) - Shows responsive
4. **device-mockup.png** - Composited laptop + phone view (optional, nice to have)

### Playwright Script
Use the existing screenshot pipeline but expanded:
```bash
bun run screenshot-mock-sites.mjs [business-slug]
```

---

## STAGE 7: PACKAGE
**Goal:** Create the outreach-ready case study page.

### Case Study Page Template
Each business gets a page at: `/case-studies/[slug].html`

The page contains:
- The business name and industry
- One hero screenshot of the mock site
- 2-3 sentences: what you noticed, what you built, why
- A prominent "View the demo" button linking to the mock site
- Your name, title, and contact info
- Optional: a small "about Studio O'Brien" blurb

### Tone for the case study copy:
- "I noticed [Business] doesn't have a website yet."
- "I put together a concept based on what you're already doing well."
- "This is yours to look at. No obligation, no pitch."
- Let the work do the talking. Keep text minimal.

### Email Template (adapt per business):

Subject: Built something for [Business Name]

Hi [Owner first name],

I'm J, a web designer based here in the foothills. I was browsing
Main Street businesses and noticed [Business Name] doesn't have a
website yet, so I put one together to show what it could look like.

Everything on it is based on your existing info. Nothing made up.
Take a look whenever you have a minute:

[Link to case study page]

No strings attached. If you like it, I'd love to talk. If not,
no worries at all.

J. O'Brien
Studio O'Brien
[phone] | [email]
studioobrien.com

---

## STAGE 8: DELIVER
**Goal:** Get the link in front of the owner.

### Delivery Methods (ranked by effectiveness for small town)
1. **Walk in and show them on your phone/laptop** (highest conversion, small town advantage)
2. **Email** (if you can find their email from Facebook/Google)
3. **Facebook message** (if they're active on Facebook)
4. **Instagram DM** (if they're active on Instagram)
5. **Physical leave-behind** (print the case study page, leave at their counter)

### Follow-up
- If no response after 5 days, one follow-up
- After that, move on. The site stays in your portfolio regardless.
- Never delete a demo site. Even if they say no, it's still portfolio proof.

---

## REPEATING THE PIPELINE

### Cadence
- Target 2 new businesses per week
- Build 1 site per sitting (with Claude handling the generation)
- Batch screenshots and packaging at the end of each week

### Scaling Signals
Track what works:
- Which industries respond most?
- Which design styles get the most positive reactions?
- Which outreach method (walk-in, email, DM) converts?
- Double down on what converts. Drop what doesn't.

### Portfolio Rotation
- Keep your 10 best sites on the main portfolio
- As new, better work comes in, rotate out the weakest piece
- Real client work always trumps spec work in the portfolio
