// Pass 2 helper - extract HVAC Gap Targets from cached SERP JSON.
// One-shot; run: node production/outreach/_extract-hvac-targets.mjs
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SNAP = join(HERE, '..', 'ad-gap-snapshots', 'hvac-2026-07-09.json');
const data = JSON.parse(readFileSync(SNAP, 'utf8'));

const DIRECTORIES = ['yelp.com','m.yelp.com','thumbtack.com','facebook.com','reddit.com','clutch.co','designrush.com','bbb.org','nextdoor.com','angi.com','youtube.com','pinterest.com','mapquest.com','expertise.com','yellowpages.com','yp.com','foursquare.com','sites.google.com','linkedin.com','indeed.com','ziprecruiter.com','google.com','agencies.semrush.com','techbehemoths.com','appnet.com','pandia.com','ahmeego.com','foodhubforbusiness.com','straightnorth.com','freshysites.com','wordjack.com','manta.com','homeadvisor.com','instagram.com','tiktok.com','x.com','twitter.com'];

const AGG = ['gaf.com','owenscorning.com','icoating.com','certainteed.com','trane.com','carrier.com','lennox.com','rheem.com','goodmanmfg.com','americanstandardair.com','dalehvac.com','bryant.com','payne.com','homedepot.com','lowes.com','menards.com','acehardware.com','truenorthcompanies.com','nflpa.com','clevelandcc.edu','ncpedia.org','chooseclevelandcountync.com','business.clevelandcountychamber.org','toucandesign.net','webdesigncharlotte.net','50creativesolutions.com','visualbrandingagency.com','mybrandingagency.com','localseodirectors.com','southstreetmarketing.com','epitomedigitalmarketing.com','getyoufound.com','ezmarketing.com','losthighwaymedia.com','moonray.net','moonraywebdesign.com','chadaustin.com','thinkdesignsllc.com','anaxdesigns.com','websymphonies.com','integrisdesign.com','lazaruscharlotte.com','bellaworksweb.com','charlottewebdesignstudio.com','wordpress-web-designer-raleigh.com','thriveagency.com','medesignlab.com','hickorytradewebdesign.com','maidenwebdesign.com','lincolntonwebdesign.com','shelbydesign.co','broadrivermedia.com','jessicaleighwebdesign.com','theimageadjusters.com','nextwaveservices.com','dragonflymarketing.cc','studiosbydave.com','michellejonescreative.com','79design.org.uk','yellowfin.agency','visionsharp.co.uk','56degrees.co.uk','upmenu.com','mechroofandgutter.com'];

const isSpecialist = (d) => !DIRECTORIES.includes(d) && !AGG.includes(d);
const isDirectory = (d) => DIRECTORIES.includes(d);
const isAggregator = (d) => AGG.includes(d);

// Group by domain. Facebook-only businesses appear under multiple URL paths,
// each with a different /p/<HANDLE>; collapse those by handle so we see one
// business per Facebook page, not all of Facebook grouped together.
function domainKey(url, domain) {
  if (domain === 'facebook.com' || domain === 'm.facebook.com') {
    const m = url.match(/facebook\.com\/(?:p|groups)\/([^/?]+)/);
    return m ? ('facebook.com/' + m[1]) : 'facebook.com/other';
  }
  return domain;
}

const targets = new Map();
for (const k of data.perKeyword) {
  if (k.missing) continue;
  for (const r of (k.top10 || [])) {
    const key = domainKey(r.url, r.domain);
    if (!targets.has(key)) targets.set(key, { domain: key, appearances: [] });
    targets.get(key).appearances.push({ kw: k.term, pos: r.pos, url: r.url });
  }
}

function classify(d) {
  if (d.startsWith('facebook.com/')) return 'facebook-only';
  if (isDirectory(d)) return 'directory';
  if (isAggregator(d)) return 'aggregator';
  return 'specialist';
}

// Sort by appearances desc, then bestPosition asc.
const arr = [...targets.values()].sort((a,b) => {
  if (b.appearances.length !== a.appearances.length) return b.appearances.length - a.appearances.length;
  const aBest = Math.min(...a.appearances.map(p => p.pos));
  const bBest = Math.min(...b.appearances.map(p => p.pos));
  return aBest - bBest;
});

console.log('Per-domain visibility across HVAC niche queries:\n');
console.log('CLASS'.padEnd(14) + ' DOMAIN'.padEnd(46) + ' APPS  BEST  POSITIONS');
console.log('-'.repeat(100));
for (const v of arr) {
  const cls = classify(v.domain);
  const bestPos = Math.min(...v.appearances.map(p => p.pos));
  const positions = v.appearances.map(a => a.kw.split(' ').slice(0,2).join(' ') + '#' + a.pos).join('  ');
  console.log(cls.padEnd(14) + ' ' + v.domain.padEnd(45) + ' ' + String(v.appearances.length).padStart(4) + '  #' + String(bestPos).padStart(3) + '  ' + positions);
}

// Specialist-only output for Gap Targets list.
console.log('\n\nSpecialist Gap Targets (ranked by outreach priority):');
console.log('-'.repeat(100));
const specialists = arr.filter((v) => classify(v.domain) === 'specialist');
for (const v of specialists) {
  const bestPos = Math.min(...v.appearances.map(p => p.pos));
  console.log(v.domain.padEnd(40) + ' apps=' + v.appearances.length + ' best=#' + bestPos +
    '  queries=[' + v.appearances.map(a => a.kw).join(' | ') + ']');
}

console.log('\nFacebook-only businesses (Storefront/Route B2 pitch candidates):');
console.log('-'.repeat(100));
const facebookOnly = arr.filter((v) => classify(v.domain) === 'facebook-only');
for (const v of facebookOnly) {
  const bestPos = Math.min(...v.appearances.map(p => p.pos));
  console.log(v.domain.padEnd(40) + ' apps=' + v.appearances.length + ' best=#' + bestPos +
    '  url=' + v.appearances[0].url);
}