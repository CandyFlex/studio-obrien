// Build the LOCAL working copy of index.html (portfolio-local.html) with the refreshed
// showcase. Live index.html is UNTOUCHED.
//
// The grid replicates the LIVE studioobrien.com recipe EXACTLY so density matches and
// there are no gaps / cut-off cards:
//   * 4 columns x 5 cards = 20 cards, every column the same height.
//   * fixed landscape/portrait rhythm per column (measured off the live site):
//       outer cols (1,4): L P L P L   (3 landscape + 2 portrait)
//       inner cols (2,3): L P P L P   (2 landscape + 3 portrait)
//     -> 10 landscape + 10 portrait total, columns balance to equal height.
//   * every business appears once as a wide "Hero" (landscape) and once as a tall
//     "Full Site" (portrait), and its two instances are always in DIFFERENT columns.
//
// Businesses = food + services only (Dark Thoughts and Gameshelf removed per Jarred).
// 11 sites: 5 restaurants + 6 services. To hit an exact 20-card balanced grid, 9 sites
// double (L+P) and 2 appear once (land as a landscape, clover as a full page) — which
// also trims repetition slightly. No site is ever shown more than twice.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'C:/Users/Jarre/Desktop/Obrien Studio Portfolio';
const SRC = join(ROOT, 'index.html');

const B = {
  clover:  { h3:'Clover Dental',           label:'Full Site &mdash; Dental',       c:'#0F9D8C', d:'#0A5E54', hero:'portfolio/clover.webp',    full:'portfolio/clover-full.webp' },
  pest:    { h3:'Cardinal Pest Control',   label:'Full Site &mdash; Pest Control',  c:'#15803D', d:'#0B4A22', hero:'portfolio/cardinal.webp',  full:'portfolio/cardinal-full.webp' },
  concrete:{ h3:'Piedmont Concrete',       label:'Full Site &mdash; Concrete',      c:'#B45309', d:'#6B3105', hero:'portfolio/piedmont.webp',  full:'portfolio/piedmont-full.webp' },
  electric:{ h3:'Crownline Electric',      label:'Full Site &mdash; Electrical',    c:'#D97706', d:'#7A4304', hero:'portfolio/crownline.webp', full:'portfolio/crownline-full.webp' },
  land:    { h3:'Queen City Landscaping',  label:'Full Site &mdash; Landscaping',   c:'#4D7C0F', d:'#2A4408', hero:'portfolio/qcland.webp',    full:'portfolio/qcland-full.webp' },
  hvac:    { h3:'Queen City Comfort',      label:'Full Site &mdash; HVAC',          c:'#0F766E', d:'#08423D', hero:'portfolio/qccomfort.webp', full:'portfolio/qccomfort-full.webp' },
  // restaurants — one-template five-brand set
  takumi:  { h3:'Takumi',                  label:'Full Site &mdash; Japanese',      c:'#C1272D', d:'#6E1418', hero:'portfolio/takumi.webp',    full:'portfolio/takumi-full.webp' },
  hwaro:   { h3:'Hwaro',                   label:'Full Site &mdash; Korean BBQ',    c:'#EA5B24', d:'#7C2F0E', hero:'portfolio/hwaro.webp',     full:'portfolio/hwaro-full.webp' },
  thalassa:{ h3:'Thalassa',                label:'Full Site &mdash; Greek',         c:'#1D5B9E', d:'#0C2E52', hero:'portfolio/thalassa.webp',  full:'portfolio/thalassa-full.webp' },
  lucciola:{ h3:'Lucciola',                label:'Full Site &mdash; Italian',       c:'#C0563A', d:'#6B2E1F', hero:'portfolio/lucciola.webp',  full:'portfolio/lucciola-full.webp' },
  milpa:   { h3:'Milpa',                   label:'Full Site &mdash; Mexican',       c:'#C42A6B', d:'#6E1739', hero:'portfolio/milpa.webp',     full:'portfolio/milpa-full.webp' },
  // backdrop-only (Storefront pieces)
  bens:    { h3:"Ben's Smokehouse",        label:'Full Site &mdash; BBQ',           c:'#B91C1C', d:'#6E1111', hero:'portfolio/bens.webp',      full:'portfolio/bens-full.webp' },
  slims:   { h3:"Slim's Bar & Grill",      label:'Hero &mdash; Burgers',            c:'#DC2626', d:'#791515', hero:'portfolio/slims.webp',     full:'portfolio/slims-full.webp' },
  arcade:  { h3:'Carolina Arcade',         label:'Full Site &mdash; Arcade',        c:'#E8342E', d:'#801D19', hero:'portfolio/arcade.webp',    full:'portfolio/arcade-full.webp' },
};

const JNAME = { clover:'Clover Dental', pest:'Cardinal Pest Control', concrete:'Piedmont Concrete', electric:'Crownline Electric', land:'Queen City Landscaping', hvac:'Queen City Comfort', takumi:'Takumi', hwaro:'Hwaro', thalassa:'Thalassa', lucciola:'Lucciola', milpa:'Milpa' };

// ---- LIVE grid recipe: fixed 4x5 orientation template (o=landscape, p=portrait) ----
// Measured off studioobrien.com so density/column height match exactly and never gap.
const TEMPLATE = [
  ['o', 'p', 'o', 'p', 'o'], // col1  (3L + 2P)
  ['o', 'p', 'p', 'o', 'p'], // col2  (2L + 3P)
  ['o', 'p', 'p', 'o', 'p'], // col3  (2L + 3P)
  ['o', 'p', 'o', 'p', 'o'], // col4  (3L + 2P)
];
const must = (c, m) => { if (!c) throw new Error('FAILED: ' + m); };

// Assign 10 landscape tokens + 10 portrait tokens onto the template. Landscapes fill in
// reading order (spreads sites across the top rows); portraits are backtracked so a
// site's two instances never share a column. Returns column-major [[key,o],...].
function buildCOLS(oTokens, pTokens) {
  const slots = [];
  TEMPLATE.forEach((col, ci) => col.forEach((o, ri) => slots.push({ ci, ri, o, key: null })));
  const byReading = (a, b) => a.ri - b.ri || a.ci - b.ci;
  const oSlots = slots.filter((s) => s.o === 'o').sort(byReading);
  const pSlots = slots.filter((s) => s.o === 'p').sort(byReading);
  must(oTokens.length === oSlots.length && pTokens.length === pSlots.length, 'token/slot count mismatch');
  oSlots.forEach((s, i) => { s.key = oTokens[i]; });
  const oCol = {};
  oSlots.forEach((s) => { if (oCol[s.key] === undefined) oCol[s.key] = s.ci; });
  const oRow = {};
  oSlots.forEach((s) => { if (oRow[s.key] === undefined) oRow[s.key] = s.ri; });
  // STRICT: a repeated site's portrait must differ from its landscape in BOTH column
  // and row, so its two cards are never stacked (same column) or side-by-side (same row).
  const place = (i) => {
    if (i === pTokens.length) return true;
    const biz = pTokens[i];
    for (const s of pSlots) {
      if (s.key || oCol[biz] === s.ci || oRow[biz] === s.ri) continue;
      // MOBILE-SAFE: a repeated site must not have BOTH cards in the top two rows.
      // On the smallest widths the grid collapses to the first columns' top rows, so
      // keeping the top two rows 8-distinct guarantees no duplicate/adjacent stack there.
      if (oRow[biz] !== undefined && oRow[biz] <= 1 && s.ri <= 1) continue;
      s.key = biz;
      if (place(i + 1)) return true;
      s.key = null;
    }
    return false;
  };
  must(place(0), 'no valid fully-mixed portrait assignment');
  const COLS = [0, 1, 2, 3].map((ci) =>
    slots.filter((s) => s.ci === ci).sort((a, b) => a.ri - b.ri).map((s) => [s.key, s.o])
  );
  const flat = COLS.flat();
  const cnt = {};
  flat.forEach(([k]) => { cnt[k] = (cnt[k] || 0) + 1; });
  must(flat.length === 20, `expected 20 cards, got ${flat.length}`);
  must(Object.values(cnt).every((n) => n <= 2), 'a site appears >2x');
  COLS.forEach((col, i) => { const seen = new Set(); for (const [k] of col) { must(!seen.has(k), `dup ${k} in column ${i + 1}`); seen.add(k); } });
  // no repeated site shares a row OR a column (never stacked, never side-by-side)
  const pos = {};
  COLS.forEach((col, ci) => col.forEach(([k], ri) => { (pos[k] = pos[k] || []).push([ci, ri]); }));
  for (const [k, ps] of Object.entries(pos)) {
    if (ps.length < 2) continue;
    must(ps[0][0] !== ps[1][0], `${k} shares a column`);
    must(ps[0][1] !== ps[1][1], `${k} shares a row`);
  }
  return { COLS, cnt };
}

// Two saved layouts, both live-recipe 20-card grids:
//   A — the approved version: 11 sites (5 food + 6 services). 9 double (L+P); land is
//       landscape-only, clover full-only. Ben's/Slim's/Arcade live only in the backdrop.
//   B — every backdrop site ALSO gets a card ABOVE the computer: adds Ben's, Slim's and
//       Carolina Arcade to the grid (14 sites). 6 double + 8 single, all >=1, none >2.
const VARIANTS = [
  {
    id: 'a',
    oTokens: ['takumi', 'electric', 'hwaro', 'hvac', 'thalassa', 'pest', 'lucciola', 'concrete', 'milpa', 'land'],
    pTokens: ['takumi', 'electric', 'hwaro', 'hvac', 'thalassa', 'pest', 'lucciola', 'concrete', 'milpa', 'clover'],
    // (earlier manual swaps removed — the strict solver now guarantees no site is
    //  stacked or side-by-side, which is what those swaps were chasing.)
  },
  {
    id: 'b',
    // doubles(6): takumi milpa thalassa electric pest hvac | L-only: slims arcade hwaro concrete | P-only: lucciola clover land bens
    oTokens: ['takumi', 'electric', 'milpa', 'hvac', 'thalassa', 'pest', 'slims', 'concrete', 'hwaro', 'arcade'],
    pTokens: ['electric', 'takumi', 'hvac', 'milpa', 'pest', 'thalassa', 'lucciola', 'clover', 'land', 'bens'],
  },
];

const ICON = '<div class="card-hover-zone"><div class="card-hover-icon"><svg viewBox="0 0 32 32"><circle cx="14" cy="14" r="7"/><path d="M10.5 14.5h7 M14 10.5v7"/><path d="M21 21l6.5 6.5"/></svg></div></div>';

function card(key, o, opts = {}) {
  const b = B[key];
  const portrait = o === 'p';
  const ar = portrait ? '800/1100' : '800/415';
  const h = portrait ? 1100 : 415;
  const img = portrait ? b.full : b.hero;
  const role = portrait ? b.label : b.label.replace('Full Site', 'Hero');
  const data = `{"name":"${JNAME[key]}","role":"${role}","color":"${b.c}","img":"${img}","full":"${b.full}"}`;
  // First card of each column loads eager (LCP); cols 1-2 also fetchpriority high —
  // mirrors the live site so the swap doesn't regress above-the-fold performance.
  const load = opts.eager ? `loading="eager"${opts.priority ? ' fetchpriority="high"' : ''}` : 'loading="lazy"';
  return `        <div class="card" tabindex="0" role="button" aria-label="View ${b.h3}" data-project='${data}'>
          <div class="card-banner" style="background:linear-gradient(135deg,${b.c},${b.d});aspect-ratio:${ar}">
            <img src="${img}" alt="Web development for ${b.h3}" ${load} width="800" height="${h}" style="display:block;width:100%;height:100%;object-fit:cover;object-position:top;position:absolute;inset:0">
            ${ICON}
          </div>
          <div class="card-details"><div class="card-text"><h3>${b.h3}</h3></div></div>
        </div>\n`;
}
const colHTML = (cards, ci) => cards.map(([k, o], ri) => card(k, o, { eager: ri === 0, priority: ri === 0 && ci < 2 })).join('');
function gridRowsFor(COLS) {
  return `    <div class="portfolio-row">
      <div class="column column-1" id="col1">
${colHTML(COLS[0], 0)}      </div>
      <div class="column column-2" id="col2">
${colHTML(COLS[1], 1)}      </div>
    </div>
    <div class="portfolio-row">
      <div class="column column-3" id="col3">
${colHTML(COLS[2], 2)}      </div>
      <div class="column column-4" id="col4">
${colHTML(COLS[3], 3)}      </div>
    </div>`;
}

// Backdrop behind the laptop (decorative, repeats fine). Storefront pieces + trades +
// restaurants; Dark Thoughts / Gameshelf removed here too.
const BACK_ORDER = ['bens', 'takumi', 'electric', 'thalassa', 'pest', 'milpa', 'hvac', 'lucciola', 'land', 'hwaro', 'concrete', 'clover', 'slims', 'arcade'];
function distribute(items, nCols) {
  const cols = Array.from({ length: nCols }, () => []);
  const has = Array.from({ length: nCols }, () => new Set());
  for (const [b, o] of items) {
    let cand = [];
    for (let i = 0; i < nCols; i++) if (!has[i].has(b)) cand.push(i);
    if (!cand.length) cand = [...Array(nCols).keys()];
    cand.sort((a, c) => cols[a].length - cols[c].length || a - c);
    cols[cand[0]].push([b, o]);
    has[cand[0]].add(b);
  }
  return cols;
}
const BACK = distribute([...BACK_ORDER.map((b, i) => [b, i % 2 ? 'p' : 'o']), ...BACK_ORDER.map((b, i) => [b, i % 2 ? 'o' : 'p'])], 4);
function backImg(key, o) {
  const b = B[key];
  const portrait = o === 'p';
  return `      <img src="${portrait ? b.full : b.hero}" alt="${b.h3} website design by Studio O'Brien" loading="lazy" width="800" height="${portrait ? 1100 : 415}">\n`;
}
const backCols = ['a', 'b', 'c', 'd'].map((letter, i) =>
  `    <div class="show-col show-col--${letter}">\n${BACK[i].map(([k, o]) => backImg(k, o)).join('')}    </div>\n`
).join('');
const showFall = `<div class="show-fall" aria-hidden="true">\n${backCols}  </div>`;

// ---------- apply (shared transforms; only the grid differs per variant) ----------
const SRC_HTML = readFileSync(SRC, 'utf8');

function applyAll(gridRows, tag) {
  let html = SRC_HTML;

  // A. grid
  {
    const openTag = '<div class="portfolio" id="portfolio">';
    const s = html.indexOf(openTag);
    must(s >= 0, 'grid open tag');
    const sIdx = s + openTag.length;
    const nIdx = html.indexOf('<noscript>', sIdx);
    must(nIdx >= 0, 'noscript anchor');
    html = `${html.slice(0, sIdx)}\n${gridRows}\n  </div>\n</div>\n${html.slice(nIdx)}`;
  }

  // D. backdrop
  {
    const sf = html.indexOf('<div class="show-fall" aria-hidden="true">');
    must(sf >= 0, 'show-fall');
    const cmt = html.indexOf('<!-- SHOWCASE', sf);
    must(cmt >= 0, 'showcase laptop comment');
    html = `${html.slice(0, sf)}${showFall}\n\n  ${html.slice(cmt)}`;
  }

  // C. laptop + phone reel -> Crownline
  {
    const splitTok = 'scroll-bg scroll-bg--mobile';
    const si = html.indexOf(splitTok);
    must(si >= 0, 'mobile scroll-bg');
    let head = html.slice(0, si);
    let tail = html.slice(si);
    const before = (head.match(/darkthoughts-reel\.webp/g) || []).length;
    head = head.replaceAll(
      '<img src="portfolio/darkthoughts-reel.webp" alt="Dark Thoughts website scrolling page preview" width="1440" height="5794" loading="lazy" decoding="async">',
      '<img src="portfolio/crownline-reel.webp" alt="Crownline Electric website scrolling page preview" width="1440" height="8373" loading="lazy" decoding="async">');
    tail = tail.replaceAll(
      '<img src="portfolio/darkthoughts-reel.webp" alt="Dark Thoughts website scrolling page preview" width="1440" height="5794" loading="lazy" decoding="async">',
      '<img src="portfolio/crownline-reel-mobile.webp" alt="Crownline Electric mobile scrolling page preview" width="470" height="15879" loading="lazy" decoding="async">');
    html = head + tail;
    must(before === 2, `expected 2 desktop reel imgs, saw ${before}`);
    must(!html.includes('darkthoughts-reel.webp'), 'reel swap left leftovers');
  }

  // B. Storefront: Black Creek -> Ben's Smokehouse
  {
    const a = html.replace(
      'portfolio/bc.webp" alt="Concept website built for a local BBQ smokehouse as part of the Storefront Project"',
      'portfolio/bens-full.webp" alt="Website built for Ben&rsquo;s Smokehouse, a local BBQ spot in Spindale NC"');
    must(a !== html, 'storefront bc image not found');
    html = a.replace('<p class="outreach-slot-name">Black Creek Smokehouse</p>', '<p class="outreach-slot-name">Ben&rsquo;s Smokehouse</p>');
  }

  // E. reel animation: slower, phone slower than laptop, scroll top->down
  {
    const a = html.replace('animation:wt-scroll 48s linear infinite', 'animation:wt-scroll 110s linear infinite');
    must(a !== html, 'laptop reel duration');
    const b = a.replace('.scroll-bg--mobile .scroll-track{animation-duration:20s}', '.scroll-bg--mobile .scroll-track{animation-duration:210s}');
    must(b !== a, 'mobile reel duration');
    const c = b.replace(
      /from\{transform:translate3d\(0,-50%,0\)\}(\s*)to(\s*)\{transform:translate3d\(0,0,0\)\}/,
      'from{transform:translate3d(0,0,0)}$1to$2{transform:translate3d(0,-50%,0)}');
    must(c !== b, 'reel keyframe reverse');
    html = c;
  }

  // local-file fixups + variant tag
  html = html.replace(/\?v=[0-9A-Za-z._-]+/g, '');
  html = html.replace(/(href|src)="\/(?!\/)/g, '$1="');
  html = html.replace('</title>', ` — LOCAL ${tag}</title>`);
  return html;
}

// Local-draft rebuild reads a CLEAN index.html; once the showcase is deployed, index.html
// already has the reel/backdrop swaps and applyAll's asserts would fail. Skip drafts when
// we're only re-patching the live grid.
for (const v of (process.argv.includes('--patch-live') ? [] : VARIANTS)) {
  const { COLS, cnt } = buildCOLS(v.oTokens, v.pTokens);
  // Manual in-place card swaps (applied AFTER the solver; may intentionally place a
  // site's two instances in one column, which the solver would otherwise forbid).
  for (const [[c1, r1], [c2, r2]] of v.swaps || []) {
    const t = COLS[c1][r1]; COLS[c1][r1] = COLS[c2][r2]; COLS[c2][r2] = t;
  }
  const html = applyAll(gridRowsFor(COLS), `DRAFT ${v.id.toUpperCase()}`);
  writeFileSync(join(ROOT, `portfolio-local-${v.id}.html`), html, 'utf8');
  const sites = Object.keys(cnt).length;
  const repeated = Object.entries(cnt).filter(([, n]) => n === 2).map(([k]) => k);
  console.log(`portfolio-local-${v.id}.html  ${COLS.flat().length} cards, ${sites} sites · doubled: ${repeated.join(',')}`);
  COLS.forEach((col, i) => console.log(`  col${i + 1}: ${col.map(([k, o]) => `${k}(${o})`).join('  ')}`));
}
console.log(`backdrop: ${BACK.flat().length} imgs (identical in both) | dark/gs removed`);

// ---------- PRODUCTION build: surgical patch of the LIVE index.html ----------
// Scope (Jarred, 2026-07-16): grid -> A layout, laptop/phone reel -> Crownline +
// new speed/direction, backdrop wall -> new sites. Storefront (Black Creek) is LEFT
// as-is. NO local file:// fixups (keep ?v= cache-busters + root-absolute paths), NO
// title tag change. Eager-loading/fetchpriority preserved via card() opts. Noscript
// fallback refreshed to the new pieces. Writes a STAGED file for diffing before deploy.
function buildProd() {
  const AV = VARIANTS.find((v) => v.id === 'a');
  const { COLS } = buildCOLS(AV.oTokens, AV.pTokens);
  let html = SRC_HTML;

  // A. grid
  {
    const openTag = '<div class="portfolio" id="portfolio">';
    const s = html.indexOf(openTag); must(s >= 0, 'prod grid open tag');
    const sIdx = s + openTag.length;
    const nIdx = html.indexOf('<noscript>', sIdx); must(nIdx >= 0, 'prod noscript anchor');
    html = `${html.slice(0, sIdx)}\n${gridRowsFor(COLS)}\n  </div>\n</div>\n${html.slice(nIdx)}`;
  }

  // noscript fallback -> the new pieces (SEO/no-JS parity with the visible grid)
  {
    const NS = [
      ['takumi', 'Takumi — Japanese restaurant website design project by Studio O’Brien'],
      ['hwaro', 'Hwaro — Korean BBQ restaurant website design project by Studio O’Brien'],
      ['thalassa', 'Thalassa — Greek taverna website design project by Studio O’Brien'],
      ['lucciola', 'Lucciola — Italian osteria website design project by Studio O’Brien'],
      ['milpa', 'Milpa — Mexican taqueria website design project by Studio O’Brien'],
      ['electric', 'Crownline Electric — electrician contractor website design project by Studio O’Brien'],
      ['hvac', 'Queen City Comfort — HVAC contractor website design project by Studio O’Brien'],
      ['pest', 'Cardinal Pest Control — pest control website design project by Studio O’Brien'],
      ['concrete', 'Piedmont Concrete — concrete and masonry website design project by Studio O’Brien'],
      ['land', 'Queen City Landscaping — landscaping website design project by Studio O’Brien'],
      ['clover', 'Clover Dental — dental practice website design project by Studio O’Brien'],
    ];
    const block = `<noscript>\n  <div class="portfolio-fallback">\n` +
      NS.map(([k, alt]) => `    <img src="${B[k].hero}" alt="${alt}" width="800" height="415"><br>`).join('\n') +
      `\n  </div>\n</noscript>`;
    const fb = html.indexOf('<div class="portfolio-fallback">'); must(fb >= 0, 'prod fallback');
    const nsStart = html.lastIndexOf('<noscript>', fb);
    const nsEnd = html.indexOf('</noscript>', fb) + '</noscript>'.length;
    html = html.slice(0, nsStart) + block + html.slice(nsEnd);
  }

  // D. backdrop wall -> new sites (dark/gs removed)
  {
    const sf = html.indexOf('<div class="show-fall" aria-hidden="true">'); must(sf >= 0, 'prod show-fall');
    const cmt = html.indexOf('<!-- SHOWCASE', sf); must(cmt >= 0, 'prod laptop comment');
    html = `${html.slice(0, sf)}${showFall}\n\n  ${html.slice(cmt)}`;
  }

  // C. laptop + phone reel -> Crownline
  {
    const splitTok = 'scroll-bg scroll-bg--mobile';
    const si = html.indexOf(splitTok); must(si >= 0, 'prod mobile scroll-bg');
    let head = html.slice(0, si), tail = html.slice(si);
    const before = (head.match(/darkthoughts-reel\.webp/g) || []).length;
    head = head.replaceAll(
      '<img src="portfolio/darkthoughts-reel.webp" alt="Dark Thoughts website scrolling page preview" width="1440" height="5794" loading="lazy" decoding="async">',
      '<img src="portfolio/crownline-reel.webp" alt="Crownline Electric website scrolling page preview" width="1440" height="8373" loading="lazy" decoding="async">');
    tail = tail.replaceAll(
      '<img src="portfolio/darkthoughts-reel.webp" alt="Dark Thoughts website scrolling page preview" width="1440" height="5794" loading="lazy" decoding="async">',
      '<img src="portfolio/crownline-reel-mobile.webp" alt="Crownline Electric mobile scrolling page preview" width="470" height="15879" loading="lazy" decoding="async">');
    html = head + tail;
    must(before === 2, `prod expected 2 desktop reel imgs, saw ${before}`);
    must(!html.includes('darkthoughts-reel.webp'), 'prod reel swap leftovers');
  }

  // E. reel animation: slower, phone slower than laptop, scroll top->down
  {
    const a = html.replace('animation:wt-scroll 48s linear infinite', 'animation:wt-scroll 110s linear infinite');
    must(a !== html, 'prod laptop reel duration');
    const b = a.replace('.scroll-bg--mobile .scroll-track{animation-duration:20s}', '.scroll-bg--mobile .scroll-track{animation-duration:210s}');
    must(b !== a, 'prod mobile reel duration');
    const c = b.replace(
      /from\{transform:translate3d\(0,-50%,0\)\}(\s*)to(\s*)\{transform:translate3d\(0,0,0\)\}/,
      'from{transform:translate3d(0,0,0)}$1to$2{transform:translate3d(0,-50%,0)}');
    must(c !== b, 'prod reel keyframe reverse');
    html = c;
  }

  // NO storefront change, NO local fixups, NO title tag change.
  writeFileSync(join(ROOT, 'index.staged.html'), html, 'utf8');
  console.log('\nwrote index.staged.html (production patch — grid A + reel + backdrop; storefront untouched)');
}
void buildProd; // defined for reference; the live grid is now re-patched in place below

// Re-patch ONLY the #portfolio grid in the live index.html with the current A solve
// (keeps the already-deployed reel/backdrop/storefront/CSS). Gated so a normal run —
// which just rebuilds the local drafts — never touches the live file.
//   node production/build-local-layout.mjs --patch-live
function patchLiveGrid() {
  const AV = VARIANTS.find((v) => v.id === 'a');
  const { COLS } = buildCOLS(AV.oTokens, AV.pTokens);
  const p = join(ROOT, 'index.html');
  let html = readFileSync(p, 'utf8');
  const openTag = '<div class="portfolio" id="portfolio">';
  const s = html.indexOf(openTag); must(s >= 0, 'live grid open tag');
  const sIdx = s + openTag.length;
  const nIdx = html.indexOf('<noscript>', sIdx); must(nIdx >= 0, 'live noscript anchor');
  html = `${html.slice(0, sIdx)}\n${gridRowsFor(COLS)}\n  </div>\n</div>\n${html.slice(nIdx)}`;
  writeFileSync(p, html, 'utf8');
  console.log('\npatched index.html #portfolio grid (mobile-safe A solve)');
  COLS.forEach((col, i) => console.log(`  col${i + 1}: ${col.map(([k, o]) => `${k}(${o})`).join('  ')}`));
}
if (process.argv.includes('--patch-live')) patchLiveGrid();
