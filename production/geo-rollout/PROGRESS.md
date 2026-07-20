# Geo Rollout — Progress Tracker

Trigger: user types **`GEOBUILD`** → build the NEXT `pending` town (top of tier order),
one at a time, then stop for review. `GEOBUILD <town>` forces a specific town.
Reference template = `shelby-nc-web-design.html`. Full steps in `RUNBOOK.md`.

Status key: `done` = template + real content + interlinks live & verified · `content` =
copy localized but old design · `pending` = old design + generic copy.

## Tier A (do first — real identity + likely traffic)
| Town | County | Status | Identity hook |
|---|---|---|---|
| shelby | Cleveland | **done** | County seat, Court Square, Earl Scruggs / Don Gibson |
| cherryville | Gaston | **done** | Carolina Freight birthplace; C. Grier Beam Truck Museum; trades + manufacturing |
| gastonia | Gaston | **done** | County seat + largest Gaston city; Loray Mill (NHL), FUSE District / CaroMont Health Park |
| charlotte | Mecklenburg | **done** | Largest NC city, Mecklenburg seat; gold rush/US Mint; neighborhood businesses |
| hickory | Catawba | **done** | Furniture heritage + CommScope fiber; Catawba Valley |
| kings-mountain | Cleveland | **done** | Founded 1872 by railway; near 1780 battle; mfg + retail |
| lincolnton | Lincoln | **done** | County seat; Schenck 1813 first NC cotton mill; revitalized square |
| morganton | Burke | **done** | Burke seat; Daniel Morgan namesake; furniture; NC School for Deaf; foothills |
| belmont | Gaston | **done** | Belmont Abbey, Daniel Stowe Garden, revived Main St, Charlotte commute |
| mount-holly | Gaston | **done** | Catawba riverfront, cotton-mill namesake, growing Charlotte suburb |
| newton | Catawba | **done** | Catawba seat; 1924 courthouse/museum; manufacturing |
| conover | Catawba | **done** | Lee Industries HQ; mfg/logistics between Hickory & Newton |

## Tier B
| Town | County | Status | Identity hook |
|---|---|---|---|
| forest-city | Rutherford | **done** | Main St "City of Lights" heritage; Florence Mill; downtown revitalization |
| rutherfordton | Rutherford | **done** | County seat; Bechtler Mint (first private $1 gold coin 1832); Main St |
| bessemer-city | Gaston | **done** | Chartered 1893 (Bessemer process); textile/mill; downtown revitalization |
| dallas | Gaston | **done** | Original Gaston County seat 1846-1911; 1848 courthouse/museum square |
| cramerton | Gaston | **done** | Stuart Cramer model mill village; Goat Island; South Fork riverfront |
| stanley | Gaston | **done** | Gold-mining + cotton-mill heritage; near the Catawba |
| boiling-springs | Cleveland | **done** | Gardner-Webb University town; natural springs namesake |
| denver | Lincoln | **done** | Dry Pond renamed 1873; Lake Norman west-shore growth; Charlotte commute |
| maiden | Catawba | **done** | Apple iCloud data center (2011); hosiery/textile heritage; Catawba Valley |

## Tier C (honest LIGHT copy — do NOT invent local color)
| Town | County | Status | Identity hook |
|---|---|---|---|
| waco | Cleveland | **done** | Founded 1879 (named after Waco TX); farming heritage; honest-light copy |
| vale | Lincoln/Catawba/Cleveland | **done** | Rural tri-county crossroads; farming; honest-light copy (no invented color) |
| crouse | Lincoln | **done** | Small rural Lincoln County community; honest-light general copy |
| iron-station | Lincoln | **done** | Vesuvius Furnace / 19th-c iron heritage; rural trades |
| mcadenville | Gaston | **done** | "Christmas Town USA" (1956); McAden Mills / Edison 1883 generator; Pharr Yarns |

## Log (append per build)
- 2026-07-05 shelby → done (template established + audited)
- 2026-07-05 cherryville → done (template applied; real facts: Carolina Freight 1932 / C. Grier Beam Truck Museum; fake review schema dropped; +telephone; footer /service-area link added; neighbors bessemer-city/kings-mountain/lincolnton/dallas/shelby/gastonia; deployed + 200)
- 2026-07-05 BUILD PIPELINE added: `build-geo.mjs` + `towns/<slug>.json`. Template source = shelby page itself; script asserts every anchor + validates (0 dashes, 3 JSON-LD, no fake schema). Proven byte-identical to hand-built cherryville. New per-town flow: write JSON -> `node production/geo-rollout/build-geo.mjs <slug>` -> deploy.
- 2026-07-05 gastonia → done (built via pipeline; real facts: county seat/largest, Loray Mill NHL, FUSE District / CaroMont Health Park; neighbors belmont/mount-holly/cramerton/dallas/bessemer-city/stanley; deployed + 200)
- 2026-07-05 HAIKU AGENT PILOT (3 towns, parallel background general-purpose agents, model=haiku): each reads AGENT_BRIEF.md + cherryville.json, WebSearches real facts, writes towns/<slug>.json with cited _sources. Opus verifies facts + builds + deploys. Result: PASSED. Only defect = metaDesc length overshoot (now auto-warned by build-geo.mjs). Flow scales to all remaining towns.
- 2026-07-05 lincolnton → done (haiku; Schenck 1813 first NC cotton mill, county seat, revitalized square; +Charlotte metro; deployed + 200)
- 2026-07-05 kings-mountain → done (haiku; founded 1872 by railway/W.A. Mauney, near 1780 battle, mfg+retail economy; +Charlotte metro; deployed + 200)
- 2026-07-05 hickory → done (haiku; furniture heritage 1902 / Furniture Mart, CommScope fiber founded here; Catawba Valley not Charlotte; deployed + 200)
- 2026-07-05 TIER A remainder (charlotte, morganton, belmont, mount-holly, newton, conover) → done via haiku-agent wave; all facts cited + verified, metaDesc overshoots trimmed; deployed, all 200. TIER A COMPLETE (12/12).
- 2026-07-05 TIER B (forest-city, rutherfordton, bessemer-city, dallas, cramerton, stanley, boiling-springs, denver, maiden) → done via haiku-agent wave; deployed, all 200. Maiden used Apple only (Google is in Lenoir, corrected in-brief). TIER B COMPLETE (9/9).
- 2026-07-05 TIER C (waco, vale, crouse, iron-station, mcadenville) → done via haiku-agent wave; honest-light copy held (waco/vale/crouse general + no fabrication; iron-station used real Vesuvius Furnace; mcadenville used real Christmas Town USA / Edison 1883). Deployed, all 200. TIER C COMPLETE (5/5).
- 2026-07-05 *** ROLLOUT COMPLETE: all 26 location pages on the Shelby template, live, 0 dashes, valid schema, real cited facts. Pipeline (build-geo.mjs + towns/*.json) + haiku-agent authoring proven end-to-end. ***
