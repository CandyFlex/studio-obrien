/**
 * Generate device frame PNGs using sharp.
 * Run once: node tools/generate-frames.mjs
 * Creates PNG frames with transparent screen cutouts.
 */
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const framesDir = join(__dir, 'frames');
mkdirSync(framesDir, { recursive: true });

// --- iPhone 15 frame (393x852 screen inside slim bezel frame) ---
async function makePhone() {
  const pad = { top: 24, right: 12, bottom: 14, left: 12 };
  const screen = { w: 393, h: 852 };
  const frame = { w: screen.w + pad.left + pad.right, h: screen.h + pad.top + pad.bottom };
  const r = 40;

  // Use SVG mask to punch a transparent hole for the screen
  const svg = `<svg width="${frame.w}" height="${frame.h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pbody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#2a2a2a"/>
        <stop offset="100%" stop-color="#151515"/>
      </linearGradient>
      <mask id="pscreen">
        <rect width="${frame.w}" height="${frame.h}" fill="white"/>
        <rect x="${pad.left}" y="${pad.top}" width="${screen.w}" height="${screen.h}" rx="6" fill="black"/>
      </mask>
    </defs>
    <rect x="0" y="0" width="${frame.w}" height="${frame.h}" rx="${r}" fill="url(#pbody)" mask="url(#pscreen)"/>
    <rect x="1" y="1" width="${frame.w - 2}" height="${frame.h - 2}" rx="${r - 1}" fill="none" stroke="#444" stroke-width="1.5" mask="url(#pscreen)"/>
    <!-- dynamic island (on bezel, above screen) -->
    <rect x="${frame.w / 2 - 50}" y="12" width="100" height="20" rx="10" fill="#111"/>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(join(framesDir, 'iphone.png'));
  writeFileSync(join(framesDir, 'iphone.json'), JSON.stringify({
    frame: { w: frame.w, h: frame.h },
    screen: { x: pad.left, y: pad.top, w: screen.w, h: screen.h }
  }, null, 2));
  console.log('  iphone.png (%dx%d)', frame.w, frame.h);
}

// --- iPad Pro 11 frame (834x1194 screen inside ~890x1260 frame) ---
async function makeTablet() {
  const pad = { top: 34, right: 28, bottom: 32, left: 28 };
  const screen = { w: 834, h: 1194 };
  const frame = { w: screen.w + pad.left + pad.right, h: screen.h + pad.top + pad.bottom };
  const r = 28;

  const svg = `<svg width="${frame.w}" height="${frame.h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tbody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#2a2a2a"/>
        <stop offset="100%" stop-color="#151515"/>
      </linearGradient>
      <mask id="tscreen">
        <rect width="${frame.w}" height="${frame.h}" fill="white"/>
        <rect x="${pad.left}" y="${pad.top}" width="${screen.w}" height="${screen.h}" rx="4" fill="black"/>
      </mask>
    </defs>
    <rect x="0" y="0" width="${frame.w}" height="${frame.h}" rx="${r}" fill="url(#tbody)" mask="url(#tscreen)"/>
    <rect x="1" y="1" width="${frame.w - 2}" height="${frame.h - 2}" rx="${r - 1}" fill="none" stroke="#444" stroke-width="1" mask="url(#tscreen)"/>
    <!-- camera dot -->
    <circle cx="${frame.w / 2}" cy="17" r="4" fill="#1a1a1a" stroke="#333" stroke-width="1"/>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(join(framesDir, 'ipad.png'));
  writeFileSync(join(framesDir, 'ipad.json'), JSON.stringify({
    frame: { w: frame.w, h: frame.h },
    screen: { x: pad.left, y: pad.top, w: screen.w, h: screen.h }
  }, null, 2));
  console.log('  ipad.png (%dx%d)', frame.w, frame.h);
}

// --- MacBook frame (1440x900 screen inside ~1520x1000 frame) ---
async function makeLaptop() {
  const pad = { top: 28, right: 40, bottom: 72, left: 40 };
  const screen = { w: 1440, h: 900 };
  const frame = { w: screen.w + pad.left + pad.right, h: screen.h + pad.top + pad.bottom };
  const lidH = screen.h + pad.top + 10;

  const svg = `<svg width="${frame.w}" height="${frame.h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2a2a2a"/>
        <stop offset="100%" stop-color="#1e1e1e"/>
      </linearGradient>
      <mask id="lscreen">
        <rect width="${frame.w}" height="${frame.h}" fill="white"/>
        <rect x="${pad.left}" y="${pad.top}" width="${screen.w}" height="${screen.h}" rx="2" fill="black"/>
      </mask>
    </defs>
    <!-- lid (with screen hole) -->
    <rect x="20" y="0" width="${frame.w - 40}" height="${lidH}" rx="12" fill="url(#lid)" mask="url(#lscreen)"/>
    <rect x="21" y="1" width="${frame.w - 42}" height="${lidH - 2}" rx="11" fill="none" stroke="#555" stroke-width="0.5" mask="url(#lscreen)"/>
    <!-- camera -->
    <circle cx="${frame.w / 2}" cy="14" r="3" fill="#1a1a1a" stroke="#444" stroke-width="0.5"/>
    <!-- base/hinge -->
    <path d="M0,${lidH} Q0,${lidH - 4} 20,${lidH - 4} L${frame.w - 20},${lidH - 4} Q${frame.w},${lidH - 4} ${frame.w},${lidH} L${frame.w},${frame.h - 8} Q${frame.w},${frame.h} ${frame.w - 8},${frame.h} L8,${frame.h} Q0,${frame.h} 0,${frame.h - 8} Z" fill="#1c1c1c"/>
    <rect x="0" y="${lidH - 4}" width="${frame.w}" height="4" fill="#333" opacity="0.4"/>
    <!-- trackpad -->
    <rect x="${frame.w / 2 - 120}" y="${lidH + 20}" width="240" height="40" rx="6" fill="none" stroke="#333" stroke-width="0.5"/>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(join(framesDir, 'macbook.png'));
  writeFileSync(join(framesDir, 'macbook.json'), JSON.stringify({
    frame: { w: frame.w, h: frame.h },
    screen: { x: pad.left, y: pad.top, w: screen.w, h: screen.h }
  }, null, 2));
  console.log('  macbook.png (%dx%d)', frame.w, frame.h);
}

console.log('Generating device frames...');
await makePhone();
await makeTablet();
await makeLaptop();
console.log('Done! Frames saved to tools/frames/');
