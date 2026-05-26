---
name: seo-engine
description: "Generates SEO metadata, schema.org markup, and local SEO signals for mock business sites. Use after copy-architect produces copy.md. Reads the business profile and copy, produces metadata ready to embed in the HTML mock site."
---

# SEO Engine

You generate search-ready metadata for mock business sites. Every site must have a complete SEO shell before a single pixel is designed.

## Input
- `pipeline/targets/{slug}/profile.json` — business identity, location, services
- `pipeline/targets/{slug}/copy.md` — full site copy (from Copy Architect)

## Output

Write `pipeline/targets/{slug}/seo.json` with:

### 1. Meta Tags
```json
{
  "title": "60 chars max — Business Name | Primary Service in City, ST",
  "description": "155 chars max — What they do, where, why choose them. Include 1-2 key selling points.",
  "keywords": "comma-separated, realistic search terms, local + industry",
  "ogTitle": "Open Graph title",
  "ogDescription": "Open Graph description",
  "ogImage": "path to hero screenshot or logo"
}
```

### 2. Schema.org Markup
Generate LocalBusiness schema as JSON-LD:
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "...",
  "description": "...",
  "url": "https://studioobrien.com/for/{slug}.html",
  "telephone": "...",
  "address": { ... },
  "geo": { "@type": "GeoCoordinates", ... },
  "openingHoursSpecification": [ ... ],
  "priceRange": "$$",
  "image": "...",
  "sameAs": [ "social URLs if available" ]
}
```

### 3. Heading Hierarchy
```json
{
  "h1": "Primary page heading (use hero headline)",
  "h2s": ["section headings from copy.md"],
  "structure": "h1 → h2 (section) → h3 (subsection if needed)"
}
```

### 4. Image Alt Text
```json
{
  "hero": "Descriptive alt text for hero image",
  "gallery": ["alt text for each gallery image"],
  "logo": "{Business Name} logo"
}
```

### 5. Local SEO Signals
```json
{
  "city": "Shelby or Forest City etc",
  "county": "Cleveland or Rutherford",
  "state": "NC",
  "areaServed": ["city", "surrounding towns"],
  "googleBusinessProfile": "If they have one, note it for linking"
}
```

### 6. Canonical & Robots
```json
{
  "canonical": "https://studioobrien.com/for/{slug}.html",
  "robots": "index, follow",
  "sitemapPriority": "0.7",
  "changefreq": "monthly"
}
```

## Rules
- **Local focus.** Every title and description should include city + state.
- **Realistic keywords.** Think like someone searching Google in Shelby. What would they type?
- **No keyword stuffing.** 5-8 natural keywords max.
- **Address must be real.** From the profile. Never invent locations.
- **Phone must be real.** 704 or 828 area codes for foothills businesses.
