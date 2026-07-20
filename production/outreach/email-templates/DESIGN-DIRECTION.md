# Email Design Direction - Studio O'Brien

The artistic direction, block system, variant roadmap, and testing protocol for
the designed HTML email library in this folder. This is the "how the system
grows" document. `README.md` is the "how to send what exists today" document.
The two do not contradict; where this file proposes a change to a shipped
template, that change is a proposal here until Jarred approves it, not an edit
to the template (per the task brief and section 15 non-negotiables).

Written 2026-07-16. All research citations are current (2025-2026). No em dashes
anywhere a line could end up in front of a prospect. This doc uses hyphens too,
to keep the house habit intact.

---

## 0. The one-paragraph thesis

Our flagship email is dark because the site is dark and the Gap Read email is
the product demo. But research below shows a hard truth: on the exact clients
most Shelby small-business owners read on (Gmail's iOS and Android apps), a
near-black email is force-inverted to a lightish, often muddy version we do not
control. So "dark flagship" is really "dark where the client respects it, and a
machine-inverted light everywhere else." The fix is not to fight the inverter.
The fix is to own both ends: keep the dark template as the identity flagship for
the clients that render it true (Apple Mail, Gmail desktop), and ship a
purpose-built light "paper" variant that renders clean and predictable on the
mobile clients that would have inverted us anyway. Everything else in this doc
makes the library assemblable from named blocks so we stop redesigning and start
composing.

---

## 1. Rendering-reality findings (research, with verdicts for OUR library)

### 1.1 Dark mode is three different behaviors, and two of them hurt us

Email clients handle dark mode in one of three ways
([Litmus, Ultimate Guide to Dark Mode](https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers)):

1. **No color change.** The email renders exactly as built. Apple Mail (macOS
   and iOS), Gmail **desktop web**, Yahoo, AOL. Our dark template looks like the
   site here. This is the flagship's home turf.
2. **Partial invert.** The client flips light backgrounds dark and dark text
   light, but leaves already-dark areas alone. Outlook.com, Outlook mobile app.
   A dark email mostly survives; the risk is our light-on-dark text getting
   nudged.
3. **Full invert.** The client inverts everything, including dark backgrounds.
   **Gmail iOS and Android apps**, Outlook 2021 Windows, Office 365, Windows
   Mail. Here our near-black `#0f0f10` becomes lightish and our white ink
   becomes dark. The email we designed as dark is shown as an accidental light.

The critical, non-negotiable fact: **Gmail's mobile apps ignore
`@media (prefers-color-scheme)` and give you no way to target or opt out of
their inversion**
([Litmus](https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers);
[Mailmoxie, Why Dark Mode Breaks Emails on Gmail](https://www.mailmoxie.com/blog/gmail-dark-mode-email-design)).
There is no reliable snippet that prevents inversion and no way to force a
theme. You design defensively or you lose control.

**Why this matters for us specifically:** our audience is local SMB owners
reading on their phones, and a large share of them are on the Gmail app. That is
precisely the full-invert bucket. So the dark flagship, on our single most
common reading context, is being auto-flipped into a light rendering that we did
not art-direct.

**Verdicts:**

- **Keep the dark template as the flagship** for identity and for the clients
  that render it true (Apple Mail, Gmail desktop). It is the demo-that-looks-
  like-the-site, and that job is real.
- **Build the light "paper" variant** (Deliverable 2, done). Not as a fallback
  afterthought but as a first-class sibling, because for a big slice of readers
  the choice is not "dark vs light," it is "a light we designed vs a light the
  Gmail app machine-generated from our dark." A purpose-built light email is the
  only way to control that reader's experience.
- **Keep the per-cell `bgcolor` + inline `background-color` + inline `color` on
  every td and text node.** This is already in the library and it is the correct
  defense. Under partial invert it keeps text pinned to a readable pairing; under
  full invert it keeps foreground and background moving together instead of one
  flipping and the other not (the "invisible text" failure). Do not strip these
  when editing. README already says this; it stays law.
- **Logos and any dark-ink-on-transparent PNG need a stroke or a solid plate.**
  We currently ship the wordmark as live text (good, it recolors with the theme
  and never disappears). If we ever add a transparent-PNG logo, give it a
  translucent outline or put it on a solid mint or ink plate so full-invert
  clients cannot erase it against the flipped background (Litmus recommendation).
  For now: keep the wordmark as live text. Do not rasterize it.
- **Prefer midtones for anything that must survive inversion gracefully.** Our
  mint `#34d399` is already a midtone and survives inversion as a still-minty
  color, which is why it can stay our one accent in both themes.

### 1.2 The 102KB Gmail clip is a non-issue at our weight, but set a ceiling anyway

Gmail clips a message when the **HTML source** exceeds ~102KB, hiding the rest
behind a "View entire message" link; externally hosted images do not count
toward that number, only the markup, inline CSS, and text
([Email on Acid](https://www.emailonacid.com/blog/article/email-development/gmail-email-clipping/);
[Mailchimp](https://mailchimp.com/help/gmail-is-clipping-my-email/)). Common
advice is to stay under ~80KB because ESP tracking-link injection inflates the
source before send
([beehiiv](https://www.beehiiv.com/support/article/4413255394583-ways-to-manage-email-weight-and-avoid-gmail-clipping)).

Our actual weights today:

| Template | Bytes | % of 102KB |
|---|---|---|
| `gap-read.html` (heaviest) | ~20.3 KB | ~20% |
| `showcase.html` | ~10.8 KB | ~11% |
| `storefront-offer.html` | ~9.1 KB | ~9% |
| `field-guide-digest.html` | ~8.8 KB | ~9% |
| `follow-up-nudge.html` | ~3.5 KB | ~3% |

**Verdicts:**

- We have enormous headroom. We send raw through the real mailbox over SMTP
  (README option 2, nodemailer), not through an ESP, so we do not even pay the
  tracking-link inflation tax. Clipping is not a live risk.
- **Set a self-imposed ceiling of 60KB of HTML per template** anyway. It is a
  discipline signal: if a future template blows past 60KB, it means we are
  probably repeating markup that should be a shared block, or stuffing a whole
  proposal into an email that should be a linked page. The ceiling protects the
  architecture, not the deliverability.
- One nuance to respect: some mobile builds render or cache a smaller ceiling
  than desktop, and image-blocking plus clipping both punish "the important
  thing is 90% of the way down." Keep the load-bearing message (the gap
  sentence, the ask) in the **top 60%** of every template so it survives both a
  clip and a scan.

### 1.3 Images are blocked by default often enough that they must be corroboration, never load-bearing

Many clients still block images by default (Outlook most aggressively), for
security and content-safety reasons
([Litmus, Guide to Image Blocking](https://www.litmus.com/blog/the-ultimate-guide-to-email-image-blocking)).
Best practice is a text-forward ratio (aim roughly 60:40 text to image), a CTA
that is **always live text in a styled button and never text baked into a
graphic**, descriptive `alt` on content images, and empty `alt=""` on decorative
ones ([Tabular, Image-to-Text Ratio](https://tabular.email/blog/image-to-text-ratio-in-email-design);
[Litmus accessibility guide](https://www.litmus.com/blog/ultimate-guide-accessible-emails)).

**Verdicts for our library:**

- **Every message must survive images-off.** The library already does this well:
  `showcase.html` carries the pitch in the caption copy under each shot, and the
  Gap Read carries its whole argument as live-text tables (SERP rows, stat
  ledger, checklist). Keep that. The image is proof you can see, not the proof
  itself.
- **The SERP evidence screenshot is corroboration, not the argument.** The Gap
  Read already restates every position as live text in the SERP table, so a
  blocked screenshot costs nothing. When we attach or inline the screenshot
  (section 5 of this doc), it gets full descriptive `alt` and always sits
  *beside or below* the live-text table that already made the point.
- **Never put a CTA, a phone number, or the gap sentence inside an image.** Live
  text only. This is already our habit; it is now written down.
- **Text-to-image ratio stays generous.** Our templates are type-driven by
  brand ("display type does the heavy lifting"), which happens to be exactly the
  deliverability-safe ratio. The brand and the inbox agree here.

### 1.4 Outlook (Word engine): do the cheap defenses, skip the expensive ones

Classic Outlook for Windows renders with Word and will need ghost-table and VML
workarounds through roughly 2027-2028 in slow enterprise environments; the new
Chromium Outlook ignores `mso` conditionals harmlessly
([DEV, Email Client Rendering 2026](https://dev.to/mailpeek/the-complete-guide-to-email-client-rendering-differences-in-2026-243f);
[Litmus, Outlook rendering](https://www.litmus.com/blog/a-guide-to-rendering-differences-in-microsoft-outlook-clients)).
VML specifically only helps old Outlook and buys nothing elsewhere.

**But our audience is local small-business owners, who skew Gmail, Apple Mail,
and phone, not corporate Windows Outlook desktop.** We should not spend the
template budget chasing pixel-perfect Word rendering for a client few of our
readers use.

**Verdicts:**

- **Keep the cheap Outlook defenses we already have:** simple nested tables, no
  exotic CSS, and `mso-line-height-rule:exactly` on the thin mint rules so Word
  does not balloon them. These are present in the library; keep them.
- **Accept graceful degradation on the pill buttons.** Word squares off
  `border-radius`, so our pill CTA becomes a hard-square button in classic
  Outlook. That is fine: hard-square is already an on-brand shape in our system
  (cards are square). We do **not** invest in VML rounded-button ghost markup.
  The degraded state is still on-brand and still clickable.
- **One optional, low-cost add for the future:** an `mso`-only font fallback
  comment so Word uses a clean fallback instead of Times. Nice-to-have, not
  urgent. Do not add VML. Do not add ghost tables unless a specific template
  breaks in a real Outlook test.

### 1.5 Accessibility is nearly free here and is a real differentiator

An Email Markup Consortium analysis of 376,348 emails found only 0.002% passed
every accessibility check
([Litmus accessibility guide](https://www.litmus.com/blog/ultimate-guide-accessible-emails)).
The load-bearing basics: `role="presentation"` on layout tables so screen
readers skip the grid, a `lang` attribute on the document, real semantic
hierarchy, descriptive alt text, and WCAG AA contrast (4.5:1 body, 3:1 large)
([Litmus](https://www.litmus.com/blog/ultimate-guide-accessible-emails);
[Dyspatch, Email Accessibility](https://www.dyspatch.io/blog/email-accessibility-ultimate-guide/)).

**Verdicts:**

- **We already do `role="presentation"` on every layout table.** Keep it on
  every new block. Non-negotiable.
- **Add `lang="en"` at send time.** Our files are HTML fragments with no `<html>`
  wrapper, so the `lang` attribute belongs on the outer `<html>` element that
  the send method wraps them in. Action item: the nodemailer send path
  (README option 2) should wrap the fragment in
  `<!doctype html><html lang="en"><body>...</body></html>`. Document this in the
  send script. Cheap, and it clears a check almost nobody passes.
- **Contrast floor is already brand law** (DESIGN.md sets the dark floor at
  `--ink-3 #a8a8a8` on `#0f0f10`, verified >= 4.5:1). The light variant in this
  library was built to the same floor (section 2.3). Every new block gets
  contrast-checked before it ships.
- **Semantic hierarchy is our one weak spot.** Email fragments use styled
  `<div>`s, not `<h1>/<h2>`, so screen-reader heading navigation is weaker than
  it could be. Low-priority improvement: where a block is unambiguously a
  heading, we can add `role="heading" aria-level="2"` to the div. Not urgent,
  logged here so it is not forgotten.

### 1.6 Premium vs spammy, for a small-business owner reading on a phone

The consensus on what reads premium rather than spammy: single-column layout
that loads fast, generous whitespace, short scannable blocks with clear
headings, one or two images at most, a single clear live-text CTA, consistent
brand identity, genuine personalization, and the avoidance of spam-trigger moves
like ALL CAPS, exclamation stacks, and pushy words ("free," "urgent," "act now")
([Benchmark, Email Design Do's and Don'ts](https://www.benchmarkemail.com/blog/email-design-best-practices/);
[beehiiv, Best Email Designs 2025](https://blog.beehiiv.com/p/best-email-designs-2025)).

**Verdicts:**

- Our system already leans premium-by-construction: one accent color, one
  column, whitespace, live-text CTA, hand-written personalization (README says
  "one email, one human pass," no mail-merge). That is the premium recipe.
- **One caution: the word "free" appears in our honest copy** (the Storefront
  "free concept site," the Gap Read "it's free"). It is truthful and load-
  bearing, not a spam trick, and one-to-one mail from a warmed real mailbox is
  low-risk. Keep it, but do not stack it: never "free" twice in a subject line,
  never "FREE," never "free" plus "act now." Truth once, plainly.
- **The editorial/data-forward lesson from newsletter design galleries:** let
  the numbers be the visual anchors, sized and weighted, with whitespace around
  them; a layout can read like an editorial and a data brief at once
  ([beehiiv](https://blog.beehiiv.com/p/best-email-designs-2025)). This is
  exactly what our Stat Ledger and SERP table already do. The principle to carry
  forward: **in every new template, find the one true number and make it the
  visual anchor.** Do not copy any specific gallery design; copy the principle
  that data, set confidently, reads as authority.

---

## 2. The design language, codified for email (the block system)

DESIGN.md is a website system. Email cannot use its clamps, variable fonts,
hover states, or motion. This section translates the brand into a fixed set of
**named, reusable blocks** so future templates are *assembled*, not redesigned.
Every block below already exists in the shipped library; this is the inventory
plus the rules for reuse.

### 2.1 Construction rules (true for every block, every template)

- 600px container, centered, single column collapsing to 100% at 320px via the
  one `@media (max-width:600px)` block. The `<style>` block is niceties only;
  the render must not depend on it.
- All styles inline. Every `td` and text node carries `bgcolor` + inline
  `background-color` + inline `color`. This is the dark-mode and invert defense
  (section 1.1); it is mandatory, not optional.
- `role="presentation"` on every layout table.
- Inter with the full system fallback stack
  (`Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif`). **No web-font
  embed.** Email clients strip or fail `@font-face` unpredictably and it is a
  brand rule besides. We rely on the fallback stack; on machines without Inter
  the system sans is an acceptable, honest substitute.
- No gradients. No second chromatic color. No background images. No JS. Pill
  (999px) or hard-square (0), never the soft middle. These are DESIGN.md laws
  and they hold in email.
- Zero em dashes in any shipped or example copy. Hyphens only.
- A hidden preheader `<div>` at the very top of the body, colored to match the
  page background so it stays invisible, carrying one honest summary line.

### 2.2 The blocks (dark flagship values shown; light values in 2.3)

| Block | Role | Key specs (dark) |
|---|---|---|
| **Preheader** | Hidden inbox-preview line | `display:none;max-height:0;overflow:hidden;opacity:0;color:#0f0f10`. One honest sentence. |
| **Header / wordmark + anchor bar** | Brand stamp, top of every template | `STUDIO O'BRIEN`, Inter 700, 16px, `-0.02em`, `#ffffff`. Below it the anchor bar. |
| **Anchor bar** | The signature brand element (DESIGN.md "most-repeated after the wordmark") | `<td height="2" width="48" bgcolor="#34d399">` with `font-size:0;line-height:2px;mso-line-height-rule:exactly`. Reused inside the pull-quote card too. A 1px full-width variant is the nudge template's quiet version. |
| **Intro headline** | The one display moment | Inter 720, 26-30px, `line-height:1.12-1.15`, `-0.03em`, `#ffffff`. Contains exactly one italic-500 accent word (the Italic Mint Rule). |
| **Body paragraph** | Long-form copy | Inter 400, 16px, `line-height:1.65`, `#a8a8a8` (supporting) or `#d4d4d4` (when the line should land harder). |
| **SERP table** | Evidence as a data grid | Bordered `#1c1c1d` table, header row `#181819` with `#888888` 12px `0.02em` labels; body cells: query `#d4d4d4`, who-is-ahead `#a8a8a8`, your-spot `#ffffff` bold. 1px `#2a2a2b` hairlines between cells. |
| **Stat ledger** | Three numbers, set as anchors | 3-cell row, outer border `#2a2a2b`, 1px left-border between cells. Number Inter 720 30px `-0.03em` `#ffffff` `line-height:1`; key Inter 13px `#888888`. Never more than three cells; collapse to stacked on mobile. |
| **Marker list (checklist / questions)** | Hand-verified facts, or the three questions | Two-column rows: 24-34px marker column + body column. Dark marker `#34d399`; body `#d4d4d4`, `line-height:1.6`. Checklist uses `-`; questions use `1 / 2 / 3`. **The three questions are verbatim and structural; never reworded, never reordered (section 4 of OUTREACH-SYSTEM).** |
| **Pull-quote card** | The gap sentence, framed | `#1c1c1d` card, 1px `#2a2a2b` border, its own anchor bar, quote Inter 600 22px `-0.02em` `#ffffff`, sub-line 14px `#a8a8a8`. |
| **Image card** | A portfolio shot with honest label | Bordered `#1c1c1d` card: image (`display:block;width;height;alt`) over a caption block (title Inter 650 18px `#fff`, honest tag e.g. "Concept build" Inter 600 13px `#34d399`, description 15px `#a8a8a8`). Must read with images off. |
| **CTA button** | The single ask, live text | Pill: `bgcolor="#ffffff"` cell, `border-radius:999px`, link `#0f0f10` text, Inter 600 15px, padding `15px 30px`. Squares off gracefully in Outlook. One per template, max. The Gap Read deliberately has none. |
| **Divider** | Section breath | `<td height="1" bgcolor="#1f1f20">` hairline; `#2a2a2b` for a heavier pre-footer rule. |
| **Signature** | Real person sign-off | Name Inter 600 15px `#fff`; studio/city 14px `#888888`; site link `#34d399`; phone `#888888`. City present in asset-class mail (CAN-SPAM). |
| **Footer mark** | Legal + context line | Inter 12px `#666666`. Asset mail: "you asked me to send it" + stop line. Digest: physical city + working unsubscribe (required). |

**The assembly rule:** a new template is a *selection and ordering* of these
blocks with new copy. If a template needs a block that is not on this list, that
is a signal to either (a) prove the new block is genuinely reusable and add it
here with full specs, or (b) reconsider whether the idea belongs in an email at
all. We do not invent one-off blocks per template.

### 2.3 The light "paper" palette (codified, so the light family is consistent)

The light variant is not "the dark one with colors flipped by feel." It is a
fixed token set, contrast-checked, so every future light template matches
`gap-read-light.html`.

| Token | Value | Use |
|---|---|---|
| Paper (page bg) | `#f5f2ea` | Body background, most cells |
| Card | `#ffffff` | SERP table body, stat ledger, pull-quote card, image cards |
| Recessed | `#eceae2` | Table header row, any inset strip |
| Ink (headings/strong) | `#1a1a17` | Headlines, your-spot numbers, stat numbers, markers |
| Ink-2 (strong body) | `#33322c` | Body copy that should land hard |
| Ink-3 (supporting body) | `#55524a` | Default supporting paragraph copy |
| Meta / muted | `#6b6860` | Labels, table header text, sub-lines |
| Faint | `#78756b` | Footer legalese |
| Border | `#ddd9ce` | Card and table borders, cell hairlines |
| Border-faint | `#e6e2d7` | Section dividers |
| Mint | `#34d399` | **Anchor bars only.** See the rule below. |

**The never-mint-on-white rule governs the light family.** DESIGN.md states
Workshop Mint is "never used as text on white." On paper, `#34d399` as text
fails WCAG contrast badly (~1.6:1) and looks washed. So in the light variant,
**mint appears only as a solid graphic fill: the anchor bars.** That is not a
compromise, it is the more correct expression of the brand rule, and it makes
the anchor bar carry the entire mint identity, which is what DESIGN.md says it is
for ("the single most-repeated brand element"). Consequences, applied in
`gap-read-light.html`:

- The **italic accent word** in the headline keeps its italic-500 flourish but
  is set in ink `#1a1a17`, not mint. The cadence survives; the color moves to the
  anchor bar.
- **List markers and question numbers** are ink `#1a1a17`, not mint.
- **Links** (site, in the signature) are ink `#1a1a17` with an underline so they
  still read as links and still pass contrast. Phone stays meta `#6b6860`.
- The **CTA button** (in light templates that have one) inverts naturally:
  ink `#1a1a17` background, paper/white text. This mirrors the dark template's
  white-pill-on-dark.

All ink-on-paper and ink-on-white pairings above clear 4.5:1. The footer faint
`#78756b` is used only on the non-essential legal line.

---

## 3. Variant families roadmap (the build queue)

Prioritized. Each entry maps to a moment in OUTREACH-SYSTEM section 8 (sequence)
and reuses blocks from section 2. Effort is rough build-and-proof time.

### Priority 1 - `gap-read-light.html` (DONE, this deliverable)

- **Purpose:** the light "paper" sibling of the flagship Gap Read, for the
  mobile clients that would auto-invert the dark version, and as the A/B foil
  against the dark flagship.
- **Sequence position:** same as `gap-read.html` - sent same day after a "yes"
  (section 8, "yes at any step").
- **Design notes:** identical content, identical `{{fields}}`, identical block
  order; light palette from 2.3; mint only on anchor bars. Built and shipped in
  this folder.
- **Effort:** complete.

### Priority 2 - Gap Read niche skins (three: restaurant / trade / professional-services)

- **Purpose:** the same Gap Read, tuned to the evidence pattern of a niche, so
  the read feels native to the reader's world without becoming a different play.
- **Sequence position:** the asset send (section 8, post-yes). One skin chosen at
  fill time based on the target's niche.
- **What NEVER changes (hard law):** the structure, the block order, the Stat
  Ledger, the SERP table, the pull-quote gap sentence, and above all **the three
  verbatim questions** (section 4 of OUTREACH-SYSTEM - changing them changes the
  play). The skins are copy-and-emphasis tuning inside a frozen skeleton.
- **What changes per skin:**
  - **Restaurant:** evidence emphasis leans on the "found on Facebook/Maps only,
    no site behind it" and menu/hours/reservation-gap angle; SERP queries are
    discovery-style ("bbq near me", "[town] italian"); tone dial warmest. Pairs
    with the restaurant portfolio pieces (Ben's, Lucciola).
  - **Trade (HVAC, electrical, roofing, plumbing):** evidence emphasis on the
    emergency-vs-planning split (the existing HVAC example copy in README is the
    template - "the folks whose AC just died find you; the folks deciding now do
    not"); SERP queries are service+town; tone dial plain and direct. Pairs with
    Crownline.
  - **Professional services (dental, legal, accounting, clinics):** evidence
    emphasis on trust and reviews-vs-visibility; the checklist leans on
    credibility signals (reviews, credentials on-page); tone dial calm and
    respectful, least folksy. Pairs with Clover Dental.
- **Design notes:** these are *fill presets*, not new files, if we can express
  them as documented example-fill sets for the existing gap-read template. If a
  skin genuinely needs a structural tweak, it becomes its own file and gets
  logged here. Start as presets. Build both a dark and a light preset per niche
  once the light family is validated.
- **Effort:** ~1 hr per skin to write and proof the preset copy (three skins,
  so ~3 hrs), since the skeleton is done.

### Priority 3 - `proposal-recap.html` (scope + price recap after a good call)

- **Purpose:** after the optional call goes well, a short designed email that
  recaps what was discussed, the scope, and the honest price, so the owner has a
  clean thing to say yes to. Not a hype deck; a plain, confident summary.
- **Sequence position:** after the call (section 8, "call opens with their three
  answers"; this is the natural next artifact when the call invites it).
- **Design notes:** reuses Header, Intro, a **scope marker-list** (what is
  included, plainly), a **Stat Ledger repurposed as a price/timeline ledger**
  (one true number = the price, set as the anchor per section 1.6), one pull-
  quote for the core promise, one CTA ("this looks right, let us start"),
  signature, footer. Must survive images-off (it is all live text anyway). No
  fake scarcity, no fake urgency (section 15). Build light-first since it is
  read on a phone at a kitchen table.
- **Effort:** ~2-3 hrs (one genuinely new block: the price/timeline ledger,
  which is the Stat Ledger with different labels).

### Priority 4 - `welcome-handoff.html` (won-client onboarding)

- **Purpose:** the first email a new client gets after saying yes to the build.
  Sets expectations, names the next step, asks for the few things Jarred needs,
  and (per the studio memory) opens the door to the review ask at handoff.
- **Sequence position:** post-win, off the outreach sequence and into delivery.
  Ties to section 10's "reviews engine is outreach" - the handoff is where the
  review relationship starts.
- **Design notes:** warm, calm, low-density. Header, Intro, a short "here is what
  happens next" marker-list (numbered, like the questions block but forward-
  looking), a "what I need from you" marker-list, one CTA or reply prompt,
  signature. This is the one template that can feel a touch celebratory while
  staying on-voice (no exclamation points; warmth from specifics). Include the
  "Site by Studio O'Brien" studio-signature habit as a footer note if the email
  references their new site.
- **Effort:** ~2 hrs (reuses existing blocks entirely).

### Priority 5 - `re-approach.html` (the day-60 / day-120 "what changed" container)

- **Purpose:** section 8 steps 4 and 5 require that re-approaches carry
  **genuinely new evidence** ("never resend the old message"). This template is
  the *container* for "here is what changed since [month]" - built so the new
  evidence, not a re-pitch, is the whole email.
- **Sequence position:** section 8 step 4 (+60 days) and step 5 (+120, final
  touch before DORMANT).
- **Design notes:** the load-bearing block is a **"what changed" delta block** -
  a two-column or before/after marker-list where each row is a dated change
  ("In March you were position 6 for [query]. Today you are position 9." or "A
  new competitor, [name], just launched a site."). This is the Stat Ledger and
  the SERP table's honest cousin: it only ever shows real, hand-verified deltas
  (section 7 stale-evidence rule applies with teeth - no delta, no send). One
  short intro, the delta block, one soft line, signature. Deliberately shorter
  than the original Gap Read (section 8: each follow-up shorter than the last).
  If there is no real change to report, the template cannot be filled, which is
  the point - it enforces the "new information or it does not send" rule
  structurally.
- **Effort:** ~2-3 hrs (one new block: the dated-delta list).

### Priority 6 - things the research says we are missing

- **A plain-text companion is generated, not designed, but must exist for every
  designed send.** README option 2 already tells the sender to include a
  `text:` fallback in nodemailer. Elevate this from a note to a rule: **no
  designed HTML email ships without its plain-text `text/plain` alternative
  part.** It is the ultimate images-off, inversion-proof, deliverability-
  friendly fallback, and many clients and all screen readers benefit. Action:
  add a short "plain-text twin" convention to the send script - the twin is the
  same message stripped to prose, not a "please enable images" stub. **Effort:
  ~1 hr to document the convention + one example twin.**
- **A dark/light decision note, not a template.** Because we now maintain two
  visual families, the sender needs a one-line rule for which to send. Proposed
  rule, logged here: **default to the light "paper" variant for cold-to-warm SMB
  sends (phone-first, Gmail-app-heavy audience), and use the dark flagship when
  the reader is known to be on desktop/Apple Mail or when the email's job is
  explicitly "show them what the site looks like."** This is a protocol line,
  covered in section 4, not a build.

Roadmap order, one line:
**light Gap Read (done) -> niche skins -> proposal-recap -> welcome-handoff ->
re-approach container -> plain-text-twin convention + dark/light send rule.**

---

## 4. The A/B and iteration protocol (honest testing at tiny volume)

At a 10-sends-per-day cap (section 9), classic statistical A/B testing is
impossible - we will never reach significance on open or reply rate before the
market or the season changes. Pretending otherwise would be the kind of fake
rigor the whole system rejects. So the protocol is **qualitative-first** and
lives in `CRM.md`'s weekly metrics (section 14).

### 4.1 The rules

1. **One variable at a time.** Never test dark-vs-light *and* a new subject line
   *and* a new gap sentence in the same window. If two things change, a signal
   teaches us nothing. Change one, hold everything else.
2. **Track reply TONE, not just reply rate.** Reply rate at this volume is too
   noisy to trust alone. Reply *tone* is the real signal and it is readable at
   n=5. Log each reply to a designed send as one of: **warm** (curious, asks a
   question, wants a call), **neutral** (acknowledges, no motion), **cold**
   (dismissive), **stop** (opt-out). A variant that pulls warmer replies is
   winning even if the raw reply count is similar.
3. **Minimum sends before judging: 10 per variant.** Below 10 we do not form an
   opinion, we just keep a note. This is not statistics, it is "enough real
   conversations to have a felt sense." At ~10 designed sends a week this means a
   variant gets about a week of real use before we read it.
4. **A/B assignment is deterministic and logged, not random.** Because a human
   sends each one, "randomization" is a fiction. Instead: alternate by send
   order (odd sends get variant A, even get variant B) within the same niche and
   week, and write the variant into the CRM row. Alternating inside one niche and
   week is how we keep the audience comparable.
5. **Weekly read, Friday, in CRM.md.** The existing Friday metrics sweep
   (section 13) gains two columns for any active test: **variant** and **reply
   tone**. The Friday note answers one question: "any felt difference yet, or
   keep running?" Most weeks the answer is "keep running," and that is correct.
6. **Kill or promote monthly, not weekly.** Section 14 already says "monthly:
   kill or fix the worst, double the best." Design variants ride that cadence. A
   variant is only promoted to default after a month of warmer-or-equal tone at
   >= 10 sends. A losing variant is retired, and *why* is written into this doc
   (section 4.3).

### 4.2 The first test to run

**Dark flagship Gap Read vs light paper Gap Read**, same niche (start with the
already-researched HVAC Tier-A list), same week, alternating by send order,
identical fill copy. Question: does the paper variant pull warmer or equal reply
tone on our phone-first audience? Hypothesis from section 1.1: yes, because more
of them see a clean designed light than a machine-inverted dark. Run it for a
month before believing it either way.

### 4.3 Feedback loop into this doc

When a test resolves, the winner and the one-line reason get written here, in a
running log below, and the losing variant is archived (kept in the folder,
marked deprecated in README-proposal, not deleted - we may re-test after a
seasonal shift). This doc is the memory of what we learned, so we never re-run a
settled test.

**Test log (append as tests resolve):**

- _(2026-07-16) Dark vs light Gap Read: test defined, not yet run. Awaiting first
  batch._

---

## 5. Evidence-image direction (the SERP screenshot)

The Gap Read references "the SERP screenshot" as the proof a reader can verify on
their own phone. The artistic job: make a Google-results screenshot read as
**evidence, not marketing**. Honesty is the whole value; a doctored or beautified
screenshot destroys the exact trust the Gap Read exists to build (section 1
ideology, section 7 freshness).

### 5.1 Principles

1. **Unedited results, always.** The screenshot is a real, current, incognito
   search on the target's lead query. We never reorder, never remove a
   competitor, never insert the target higher than it sits, never fake a
   position. If the reader runs the same search and sees something different, we
   have failed. Section 7's hand-verify-before-send rule applies to the image
   itself: if the SERP moved, re-capture or pull the send.
2. **One honest annotation, in mint, and nothing else.** The only mark we add is
   a single Workshop Mint annotation showing *where the target actually is*: a
   1.5px mint ring around the target's real listing, or a mint arrow pointing to
   it, plus at most one small mint label ("you are here", position N). Mint
   because it is our one accent and it reads as "ours" without implying we
   changed Google's result. No red circles (spammy), no highlighter yellow, no
   drop shadows, no zoom-blur, no multiple callouts. One ring or one arrow. This
   mirrors the anchor-bar discipline: one mint mark, with intent.
3. **Crop to the truth, not to flatter.** Crop to the top of the results so the
   reader sees the real top of the page including whoever is above the target.
   Never crop out the competitors sitting above them - that gap *is* the
   evidence. Include enough context that the reader recognizes it as the same
   search they can run.
4. **The image is corroboration, never the argument (section 1.3).** The SERP
   table already states every position as live text, so the screenshot is the
   "see it with your own eyes" companion. It always sits beside or below the
   live-text table, never replaces it, and carries full descriptive `alt`.
5. **No branding chrome on the image.** No Studio O'Brien logo watermark, no
   frame, no "prepared for you" banner baked in. A watermarked screenshot reads
   as marketing collateral; a clean screenshot with one honest mint mark reads as
   a thing you looked up. The brand lives in the email around the image, not
   stamped onto the evidence.

### 5.2 File specs

- **Format:** WebP (matches the portfolio image pipeline already in the repo -
  `portfolio/*.webp`). Broadly supported in modern mail clients; the live-text
  table is the fallback for any client that does not render it.
- **Hosting:** `studioobrien.com`, same as the showcase images
  (`studioobrien.com/portfolio/...`). A logical home is
  `studioobrien.com/evidence/[target-slug]-serp.webp`. Never hotlink Google;
  never attach a huge PNG. External hosting keeps it out of the 102KB HTML weight
  (section 1.2).
- **Dimensions:** built for the 600px column, so **1040px wide** natural (2x for
  retina) displayed at 520px, `height` set explicitly to the true aspect ratio so
  the layout does not jump and images-off leaves a correctly sized `alt` box.
  Match the showcase card's `width="520"` display convention.
- **Weight:** target **under 120KB** per screenshot, hard ceiling 200KB. It is
  externally hosted so it does not count against the clip limit, but a phone on a
  slow connection still has to load it, and a heavy image on a "verify this
  yourself" proof is a bad look. Compress honestly (WebP quality ~80); do not
  upscale a small capture.
- **Alt text:** fully descriptive and specific, e.g.
  `alt="Google results for 'hvac repair shelby nc' - three directories and two
  competitors above Settlemyre, which sits at position 6"`. The alt restates the
  evidence so a blocked or screen-read version still makes the point.
- **The mint mark is drawn, not filtered:** a vector ring/arrow composited at
  export, exact hex `#34d399`, 1.5-2px stroke. Keep the source capture and the
  annotated export both, so we can prove the annotation is the only change.

### 5.3 Capture workflow (fits existing tooling)

The repo already has SERP capture scripts (`production/serp-snapshots/`,
`production/serp-track.mjs`) and a headless-browser screenshot habit. The
evidence image should come off that same pipeline: incognito capture of the real
lead-query SERP on the send day, crop to the top block, composite one mint ring
on the target's true position, export WebP at spec, upload to
`studioobrien.com/evidence/`. Log the capture date with the target (section 7).

---

## Appendix: change proposals for the existing library (do not edit until approved)

Per the task and section 15, these are proposals, not edits:

1. **Send-path wrapper for accessibility (section 1.5):** wrap every fragment in
   `<!doctype html><html lang="en"><body>...</body></html>` in the nodemailer
   send script. One-time script change, clears the `lang` check.
2. **Mandatory plain-text twin (section 3, priority 6):** the send script always
   sends a `text/plain` alternative that is the real message as prose, not a
   stub.
3. **README dark-mode section update:** add the three-behavior model and the
   "Gmail mobile force-inverts and cannot be targeted" fact, so the sender knows
   the dark template is auto-lightened on Gmail apps and can choose the light
   variant deliberately.
4. **README "which template" table:** add the `gap-read-light.html` row and the
   default-to-light-for-phone-first-sends rule (section 3/4).
5. **60KB per-template weight ceiling (section 1.2)** added to README's testing
   checklist as a pre-send check.

None of these are applied here. They wait for Jarred.
