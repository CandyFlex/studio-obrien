# Studio Obrien — Complete SEO & Infrastructure Changes

> Generated: June 19, 2026
> Purpose: Record of all modifications for future analysis, debugging, and infrastructure expansion

---

## 1. Infrastructure Files

### New Files Created

| File | Purpose |
|------|---------|
| `llms.txt` | AI crawler instructions for ChatGPT, Perplexity, Claude. Lists all pages, blog sections, business info. |
| `sitemap.xml` | Updated with all 58+ pages, proper lastmod dates, priority levels 0.7-1.0. |
| `sitemap-images.xml` | Separate image sitemap for Google Images. 40+ portfolio images with captions mapped to source pages. |
| `53bb553e5cb97f89e5864d6645be836b.txt` | IndexNow key file for Bing instant indexing. |
| `robots.txt` | Updated: allows GPTBot, ChatGPT-User, Claude-Web, PerplexityBot, CCBot, OAI-SearchBot. Blocks Google-Extended, Applebot-Extended. Sitemap references to both main and image sitemaps. |
| `vercel.json` | Static site config: `buildCommand: ""`, `outputDirectory: "."`, `installCommand: ""`, `framework: null`. Clean URLs via rewrites. |
| `package.json` | No-op build script to prevent GitHub Actions from trying to run `vite build`. |
| `.github/workflows/indexnow.yml` | GitHub Action that parses sitemap.xml and submits all URLs to Bing IndexNow + pings Google sitemap on every push to main. |

### Key Config Values
- IndexNow key: `53bb553e5cb97f89e5864d6645be836b`
- IndexNow endpoint: `https://www.bing.com/IndexNow`
- Vercel project: `jarredkern-9265s-projects/personal-site`
- GitHub repo: `https://github.com/CandyFlex/studio-obrien`

---

## 2. Page Additions (New Pages Created)

### Pillar Pages (Content Clusters)
| URL | Type | Links To |
|-----|------|----------|
| `/blog/local-seo-guide` | Pillar | 9 local SEO cluster articles |
| `/blog/restaurant-website-guide` | Pillar | 7 restaurant cluster articles |
| `/blog/web-design-redesign-guide` | Pillar | 5 web design cluster articles |
| `/blog/technical-seo-compliance-guide` | Pillar | 3 technical SEO cluster articles |
| `/blog/clusters` | Hub | All 4 clusters with descriptions |

### Geo/Location Pages (21 total)
| URL | Priority | County |
|-----|----------|--------|
| `/shelby-nc-web-design` | 0.9 | Cleveland |
| `/kings-mountain-nc-web-design` | 0.9 | Cleveland |
| `/forest-city-nc-web-design` | 0.9 | Rutherford |
| `/rutherfordton-nc-web-design` | 0.9 | Rutherford |
| `/gastonia-nc-web-design` | 0.9 | Gaston |
| `/boiling-springs-nc-web-design` | 0.8 | Cleveland |
| `/lincolnton-nc-web-design` | 0.9 | Lincoln |
| `/cherryville-nc-web-design` | 0.8 | Gaston |
| `/belmont-nc-web-design` | 0.9 | Gaston |
| `/bessemer-city-nc-web-design` | 0.8 | Gaston |
| `/mount-holly-nc-web-design` | 0.8 | Gaston |
| `/dallas-nc-web-design` | 0.8 | Gaston |
| `/waco-nc-web-design` | 0.7 | Cleveland |
| `/crouse-nc-web-design` | 0.7 | Lincoln |
| `/cramerton-nc-web-design` | 0.7 | Gaston |
| `/mcadenville-nc-web-design` | 0.7 | Gaston |
| `/denver-nc-web-design` | 0.8 | Lincoln |
| `/maiden-nc-web-design` | 0.7 | Catawba |
| `/iron-station-nc-web-design` | 0.7 | Lincoln |
| `/vale-nc-web-design` | 0.7 | Lincoln |
| `/hickory-nc-web-design` | 0.9 | Catawba |

### Utility Pages
| URL | Purpose |
|-----|---------|
| `/service-area` | Directory of all 21 served cities + 7 services. County-grouped. |
| `/website-cost-calculator` | Interactive public estimator with tiered page pricing, feature toggles, complexity slider. |

---

## 3. Schema Markup (JSON-LD)

### Types Used
| Schema Type | Pages | Purpose |
|-------------|-------|---------|
| `BreadcrumbList` | ALL 58+ pages | Site structure signal for search |
| `ProfessionalService` | All geo pages | Local business type |
| `Service` | 5 service pages | Service descriptions |
| `WebApplication` | `/website-cost-calculator` | Tool page type |
| `Article` / `BlogPosting` | 24 blog posts + 5 pillar pages | Content type |
| `VideoObject` | `/` (index.html) | Portfolio reel markup |
| `FAQPage` | **REMOVED from all 10 pages** | Google killed FAQ rich results for most sites. Visible FAQ content preserved. |

### FAQPage Removal
Google stopped showing FAQ rich results for non-government/health sites. Removed FAQPage schema from:
- 5 service pages (seo-services, restaurant-website-design, etc.)
- 4 location pages (shelby, kings-mountain, forest-city, rutherfordton)
- 1 calculator page
Visible FAQ divs with `.faq-item` class retained for AI overview extraction.

---

## 4. Content Changes

### AEO Restructuring (24/24 blog posts)
Each blog post now has:
- **HTML tables** (`class="data-table"`) alongside visual data — LLM-parsable
- **FAQ sections** (`class="faq-item"`) targeting "People Also Ask" — ~120 total questions
- **Self-contained H3 sections** with inverted pyramid structure — ~240 total sections
- **Section dividers** (`<hr class="section-divider">`) between major H2 sections
- **Accent rows** (`class="accent-row"`) on most important table rows

### SEO Text Optimization
- "Web Development" keyword added across all 35+ site pages
- Title tags under 60 characters
- One H1 per page
- Alt text on all images
- Meta descriptions on all pages
- OG/Twitter tags on all pages
- Canonical tags on all pages

### Content Clusters (Pillar Architecture)
Created 4 topical clusters with bidirectional linking:
```
Local SEO Guide ──→ 9 articles (GBP, reviews, maps, AI search, etc.)
                  ←── (each links back)
Restaurant Guide ──→ 7 articles (menus, no-shows, Yelp, email, etc.)
                  ←── (each links back)
Web Design Guide ──→ 5 articles (redesign, page speed, mobile, etc.)
                  ←── (each links back)
Technical SEO Guide ─→ 3 articles (CWV, migration, ADA)
                    ←── (each links back)
```

---

## 5. Styling & Layout

### CSS Architecture
| File | Scope | Key Classes |
|------|-------|-------------|
| `index.css` | Homepage + contact page | `.footer-nav`, `.cta-btn-primary`, `.topbar-cta` |
| `blog/blog.css` | Blog posts + geo pages + service pages | `.data-table`, `.faq-item`, `.section-divider`, `.btn-primary`, `.cta-block`, `.footer-links`, `.page-links` |
| `fonts.css` | All pages | Font-face declarations |

### Footer Link Styling
- All footer links (`.page-links`, `.footer-links`, `.footer-nav`) use green glow effect:
  - `border: 1px solid rgba(52,211,153,.35)`
  - `box-shadow: 0 0 14px rgba(52,211,153,.25)`
  - `text-shadow: 0 0 10px rgba(52,211,153,.25)`
  - Hover: brighter glow, stronger green border

### CTA Buttons
- All `.btn-primary` have `color:#000` (dark text) on green `#34d399` background
- `.cta-block .btn-primary`: `padding:12px 20px; min-height:38px; font-size:13px`
- `.topbar-cta` (homepage): `padding:10px 18px; background:var(--g)`
- No buttons use `width:100%` — all `width:auto` with `display:inline-flex`
- `.cta-block` uses `text-align:center` (no flexbox) to prevent button stretching

### Data Table Styling
- `.data-table`: `border-collapse:separate; border-radius:6px; overflow:hidden`
- Green-tinted header (`rgba(52,211,153,.06)`), green bottom border
- `thead th`: uppercase, green text, letter-spaced
- `tbody td`: muted text, card background, subtle row dividers
- `.accent-row`: green left border accent, subtle green tint

---

## 6. Link Architecture

### Topbar Navigation (4 Links)
Every page has consistent topbar:
| Link | Destination |
|------|-------------|
| Blog | `/blog` |
| Start Project | `/contact.html` |
| View Our Work | `/#portfolio` |
| Contact Me | `/contact.html?full` |

### Cross-Linking Matrix
| Source → Target | Count | Status |
|----------------|-------|--------|
| Blog posts → Geo pages | 24 pages → 21 cities | ✅ |
| Geo pages → Blog posts | 21 pages → 2 pillar pages each | ✅ |
| Pillar pages → Cluster articles | 4 pillar → 24 articles | ✅ |
| Cluster articles → Pillar pages | 24 articles → 4 pillars | ✅ |
| Footer links → All pages | Every page → full site link set | ✅ |

### Page Count
- Total HTML files: ~127
- Geo pages: 21
- Blog posts: 24
- Service pages: 5 (+1 calculator)
- Pillar pages: 4 (+1 clusters hub)
- Utility: index, contact, service-area
- Framework: og-template, vercel.json, etc.

---

## 7. Contact Page Variants

### Route Architecture
| URL | Trigger | Content |
|-----|---------|---------|
| `/contact.html` | Start Project link | Form only, centered at 680px width |
| `/contact.html?full` | Contact Me link | Form + info sidebar with email + phone |

### Contact Info Sidebar
- Email: `hello@studioobrien.com` (mailto link)
- Text: `(704) 974-3372` (tel link)
- Sticky sidebar on desktop, stacks on mobile
- Toggle via JS: sidebar hidden unless `?full` param present

### Bottom Process Section (both variants)
- 3 steps: Send form → Reply within 24h → Launch in 14 days
- "What you won't get" list: no autoresponder, no sales pitch, no scope creep, no lock-in

---

## 8. Vercel Deployment

### Build Config
- Framework: None (static HTML)
- Build command: `echo 'static site — no build'`
- Output directory: `.`
- Install command: skipped
- Deployment: `npx vercel --prod --yes` from CLI + GitHub integration auto-deploys on push

### Known Issues
- GitHub integration caches can cause stale builds. Clear via Vercel dashboard if needed.
- Total deployment size: ~780KB across 127 files
- Build time: ~250-350ms

---

## 9. Remaining User Actions

### High Priority (Account Needed)
| Task | Site | Time |
|------|------|------|
| Create Microsoft Clarity account, provide project ID | `clarity.microsoft.com` | 5 min |
| Submit sitemap to Google Search Console | `search.google.com/search-console` | 5 min |
| Submit sitemap to Bing Webmaster Tools | `bing.com/webmasters` | 5 min |
| Set up Google Indexing API (optional, for push-to-Google) | `console.cloud.google.com` | 15 min |

### Medium Priority (Ongoing)
| Task | Impact |
|------|--------|
| Directory listings (alternativeto.net, Clutch, UpCity) | Branded search spikes |
| Branded chart images for blog posts | Google Images traffic |
| Monthly blog content refresh | Freshness signals |

---

## 10. Performance Notes

- Static HTML site on Vercel CDN — no database, no SSR, no JS frameworks
- Total site weight: ~780KB across 127 files
- Pages load instantly from CDN edge nodes
- Adding more pages does not impact performance — each is a standalone flat file
- No performance bottleneck below 10,000 pages
