# Email Templates - Studio O'Brien

Designed HTML email library. These are the **after-yes** and **warm/nurture**
emails only. The cold opener and its follow-ups are always plain text (see the
doctrine below and `OUTREACH-SYSTEM.md` section 9). If you are writing to
someone who has not replied yet, close this folder and write plain text.

Every file is a self-contained HTML fragment: table-based, all styles inline,
dark theme (`#0f0f10` background) baked onto every cell so it survives email
clients that strip `<style>` blocks. Max width 600px, single column at 320px.

---

## Which template for which moment

Mapped to `OUTREACH-SYSTEM.md` sections 8 (sequence) and 9 (email doctrine).

| File | When to send | Trigger in the sequence |
|---|---|---|
| `gap-read.html` | Prospect replied "yes, send it" to the plain-text opener | Section 8: "Yes at any step -> send asset same day." This IS the Gap Read asset. |
| `storefront-offer.html` | After a conversation with a Facebook-only / Maps-only business (Route B2) | Section 3 Route B2, section 11: "Route B2 outranks Route A when both apply." |
| `showcase.html` | Warm follow-up to someone who knows you but has not moved | Nurture. Good as a "here is the work" touch, or paired with a call offer. |
| `follow-up-nudge.html` | Day-7 post-asset call offer, or a light "still happy to send it" bump | Section 8 step 2 (+7 nudge) and the "follow-up call offer 7 days after the asset" rule. |
| `field-guide-digest.html` | Opt-in newsletter list only | Route C warm inbound. Never sent to a prospect who did not subscribe. |

**Never** use any of these as a first touch to a cold prospect. The opener is
two plain-text sentences (section 4). Designed HTML on a cold send lands in the
Promotions tab or spam and burns the domain's reputation.

---

## The plain-text-first doctrine (do not skip)

From `OUTREACH-SYSTEM.md` section 9, restated because it is the rule people
break first:

1. **Openers and their unanswered follow-ups: plain text, always.** No HTML,
   no images, no template header. A real person writing one email does not use
   a designed masthead. Deliverability and authenticity both depend on this.
2. **These designed templates start only after a yes** (the asset), or on
   warm/nurture mail (Storefront offer post-conversation, the Field Guide
   digest to subscribers). Once someone said "yes, send it," the Gap Read
   email IS the product demo. It should look like the site.

If you are unsure which side of the line you are on, you are on the plain-text
side. Send plain text.

---

## Filling the `{{placeholders}}`

Every editable field is wrapped in `{{double_braces}}`. Open the file, find and
replace each one, then send. There is no build step and no merge engine on
purpose (section 1: "zero mail-merge blasts"). One email, one human pass.

**Rules for the fills (from `OUTREACH-SYSTEM.md` section 6):**
- No em dashes anywhere. Hyphens only. The templates already follow this;
  keep it when you edit.
- No fabricated numbers, clients, or outcomes. A field you cannot verify by
  hand gets `(unknown - let's talk)`, never a guess.
- Plain, grade-7 language. No "leverage," "optimize," "digital presence,"
  "solutions."
- Every line should pass the barstool test: could Jarred say it out loud to
  the owner at a bar without sounding like a brochure?

**Voice (section 6):** professional but down to earth. Write like a capable
neighbor who happens to do this for a living, not an agency. Warmth comes from
understanding the person's situation, not from exclamation points or hype. When
a line could go polished-corporate or plain-human, pick human.

### Placeholder reference

**`gap-read.html`**
- `{{ownerFirstName}}`, `{{BusinessName}}`
- `{{query_1..4}}`, `{{ahead_1..4}}`, `{{pos_1..4}}` - the SERP position rows
- `{{avg_pos}}`, `{{specialist_count}}`, `{{directory_count}}` - the stat ledger
- `{{site_observation}}`, `{{gbp_observation}}`, `{{phone_visible}}`,
  `{{mobile_usable}}`, `{{contact_form}}` - the hand-verified checklist
- `{{gap_sentence}}` - the one-line gap, pulled per-target from the gap-target
  file (do not write a new one from scratch)
- `{{lead_query}}` - the search they can run on their phone to verify

Example fills (tone reference, HVAC target):
- `{{site_observation}}` -> `loads fine, but your phone number is buried at the
  bottom of the page`
- `{{gbp_observation}}` -> `claimed, 41 reviews at 4.8 stars, but only listed
  under "heating contractor" so the AC searches skip you`
- `{{gap_sentence}}` -> `The folks whose AC just died find you. The folks
  deciding now who to call this summer do not.`

**`storefront-offer.html`**
- `{{ownerFirstName}}`, `{{BusinessName}}`, `{{service}}`
- `{{ranking_surface}}` - where they currently show up, e.g.
  `your Facebook page` or `your Google Maps pin`
- `{{reply_or_link}}` - the button target; usually `mailto:jarred@studioobrien.com`
  or just leave the "reply to this email" note and point the button at a mailto

**`showcase.html`**
- `{{ownerFirstName}}`, `{{BusinessName}}`
- Images and labels are pre-filled with real pieces. If you swap a piece, keep
  the honest label (concept stays "Concept build").

**`follow-up-nudge.html`**
- `{{ownerFirstName}}`, `{{message}}` - keep it to one or two sentences, and
  shorter than the message before it (section 8).

Example `{{message}}` fills:
- Day-7 call offer -> `it has been about a week since I sent the read. If you
  want, I am happy to hop on a quick call and walk through what I would do
  first. No slides, just a conversation. Only if it is useful to you.`
- Unanswered opener bump -> `still happy to send that one-pager over whenever
  you want it. One page, free, and I will not attach anything until you say so.`

**`field-guide-digest.html`**
- `{{issue_label}}`, `{{preview_line}}`, `{{intro_line}}`
- `{{title_1..3}}`, `{{excerpt_1..3}}`, `{{url_1..3}}` - the article teasers
  (the third block is optional; delete that `<tr>` if you only have two)
- `{{unsubscribe_url}}` - **required**, never send the digest without a working
  unsubscribe link (CAN-SPAM, section 9 compliance)

---

## Sending options, compared honestly

**1. Paste from the browser into Gmail compose (fine for one-off asset sends).**
Open the `.html` file in a browser, select all, copy, paste into a Gmail
compose window. Gmail keeps most inline styles reasonably well. This is fine for
the low volume this system runs at (a handful of asset sends a week). Caveats:
some spacing can shift, and you must proofread the rendered result before
sending. Always send yourself a test first (see checklist).

**2. A small nodemailer script (most reliable, recommended once volume grows).**
Sends the raw HTML exactly as written, through the real `studioobrien.com`
mailbox over SMTP. Requires a Google App Password (not the account password;
2-Step Verification must be on, then generate an App Password in the Google
account security settings).

```bash
npm i nodemailer
```

```js
// send-one.mjs  -  node send-one.mjs
import fs from 'node:fs';
import nodemailer from 'nodemailer';

// Credentials come from env vars, never hard-coded:
//   GMAIL_USER=jarred@studioobrien.com  GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // 16-char Google App Password
  },
});

// Read the template and fill placeholders by hand before sending.
let html = fs.readFileSync('./gap-read.html', 'utf8');
html = html
  .replaceAll('{{ownerFirstName}}', 'Dale')
  .replaceAll('{{BusinessName}}', 'Settlemyre Heating & Air');
// ...replace the rest of the fields the same way...

await transporter.sendMail({
  from: '"Jarred O\'Brien" <' + process.env.GMAIL_USER + '>',
  to: 'prospect@example.com',
  subject: 'The one-pager I promised',
  html,
  text: 'Plain-text fallback goes here so the message still reads with images off.',
});

console.log('sent');
```

Run it with the env vars set for that shell only:

```bash
GMAIL_USER=jarred@studioobrien.com GMAIL_APP_PASSWORD='xxxx-xxxx-xxxx-xxxx' node send-one.mjs
```

Notes: keep the App Password out of the repo (no `.env` committed). Always
include a plain-text `text:` fallback alongside the `html:`. Send one at a time,
by hand, after Jarred approves the batch (section 15).

**3. A bulk ESP (Mailchimp, SendGrid campaigns, etc.) - never for cold.**
Bulk email platforms are built for list blasts and mark the mail accordingly.
Using one for cold outreach violates the whole doctrine (section 1 personal
scale, section 15 non-negotiables) and hurts deliverability. The only place an
ESP could ever fit is a genuine opt-in Field Guide list at real scale, and even
then only with proper authentication and a real unsubscribe. For everything in
this system right now, send from the real mailbox, one at a time.

---

## Dark-mode caveats

These templates are dark by design (near-black background, light ink). Most
clients render them as-is. The known rough edges:

- **Gmail may partially invert dark emails** on some apps/themes, especially on
  Android, nudging very dark backgrounds lighter or shifting text color. The
  mitigation is already built in: explicit `bgcolor` AND inline
  `background-color` plus an inline `color` on every `td` and text element, so
  even a partial inversion keeps text readable against its cell. Do not remove
  those attributes when editing.
- **Outlook (Windows)** uses Word to render. The layout is plain tables with no
  fancy CSS specifically so Outlook behaves. The `mso-line-height-rule:exactly`
  on the thin mint rules keeps them from ballooning.
- **Images off by default** in many clients. The showcase template is built so
  it still reads with images blocked: every image has descriptive `alt` text
  and the copy underneath carries the message on its own.
- Do not add a background image, a web font embed, or a CSS gradient to "fix"
  anything. They break more clients than they help, and they violate the design
  system (no gradients, no second color).

---

## Testing checklist (run before any prospect send)

1. Fill every `{{placeholder}}`. Search the file for `{{` to confirm none are
   left. A stray `{{BusinessName}}` in a real send is the worst look there is.
2. Send the filled email to yourself.
3. Open it on **Gmail web** (desktop browser). Check layout, colors, the mint
   anchor bar, and that links work.
4. Open the same test on **your phone** (Gmail app). Confirm it is single
   column, readable, and the button is tappable.
5. If it is the showcase, load it once with **images blocked** and confirm it
   still makes sense.
6. Read every line out loud once (the barstool test). Fix anything stiff.
7. Confirm Jarred has approved this week's batch (section 15: Claude drafts,
   Jarred sends, the from-line is a real person).

Only after all seven does it go to a prospect.
