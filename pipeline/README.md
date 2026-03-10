# Portfolio Pipeline System

## What This Is
A repeatable process for targeting local businesses without web presence, building spec websites using their own voice and assets, and packaging everything for non-invasive outreach.

## Pipeline Stages
1. **TARGET** - Find and qualify a business
2. **HARVEST** - Scrape their existing brand assets and copy
3. **VERIFY** - You review and upgrade asset quality
4. **PROFILE** - Build the brand profile that drives the site
5. **BUILD** - Generate the mock site from the profile
6. **SCREENSHOT** - Capture portfolio-ready images
7. **PACKAGE** - Create the outreach case study page
8. **DELIVER** - Send the turnkey link

## File Structure
```
pipeline/
  README.md              <- This file
  process.md             <- Detailed step-by-step for each stage
  targets/               <- One folder per business
    carolina-arcade/
      profile.json       <- Brand profile (structured data)
      assets/
        logo.png         <- Their logo (best available)
        banner.png       <- Facebook/Google banner
        photos/          <- Establishment, crowd, product shots
        originals/       <- Unprocessed source files
      copy.md            <- Scraped copy organized by source
      verify-checklist.md <- QA checklist for this business
      notes.md           <- Your manual observations
```

## Quick Start
1. Read `process.md` for the full pipeline
2. Create a new target folder: `pipeline/targets/[business-slug]/`
3. Run the harvest script to scrape initial data
4. Go through the verify checklist
5. Build the site
