# Business Intake — fill one of these per business, hand it back, get a build

This is the research → structured-output loop. Jarred fills what he can (bullet
fragments are fine, don't polish); Claude turns it into sitemap, copy, design
direction, and a built spec site. Anything left blank gets a sensible default
or a follow-up question — nothing gets fabricated.

Copy this template into `production/intake/<business-slug>.md` per business.

---

## 1. The basics
- Business name:
- What they do (one plain sentence):
- Town / county:
- How long in business (roughly):
- Owner name (if known) and how you know them / found them:

## 2. Current online presence
- Website? (URL or "none"):
- Google Business Profile? (claimed / unclaimed / missing):
- Facebook or Instagram? (links):
- Star rating + rough review count, if any:

## 3. What makes them worth building for
- The thing they're locally known for (best answer: what a regular would say):
- Anything visually distinctive (building, product, people, history):
- 2–3 real photos available? (from FB, their site, or ones you can take):

## 4. What the site needs to do
- The ONE action a visitor should take (call / order / book / directions / quote):
- Menu, price list, or service list available anywhere? (link or photo of it):
- Hours / seasonal notes:

## 5. Build classification (pick one)
- [ ] **Storefront Project** — concept built free/spec to show them, fills a
      homepage Storefront slot, tagged honestly as "Concept"
- [ ] **Spec-to-pitch** — built to gather interest and pitch them at reduced rate
- [ ] **Portfolio archetype** — fictional/generic business, exists to show range
      (skip sections 1–3, just pick the archetype and any vibe notes)

## 6. Anything else
(voice notes transcribed, overheard details, competitor they hate, whatever)

---

**What comes back from Claude within one session:** proposed sitemap (usually
3–5 sections), full draft copy in their voice, design direction (palette,
type, layout references from the existing archetype specs), then the built
page(s) as a standalone HTML in `mock-sites/` style — verified at desktop +
mobile before you ever see it.
