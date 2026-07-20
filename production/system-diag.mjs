#!/usr/bin/env node
// system-diag.mjs — the repeatable diagnostic for the whole SEO/content system.
// Run at the start of every working cycle: it audits data freshness, chain
// state, article quality drift, and checkpoint deadlines, then prints the
// next actions. The system monitoring itself, so no session starts blind.
// Usage: node production/system-diag.mjs [--full]  (--full = re-run article-eval sweep)

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const full = process.argv.includes("--full");
const days = (t) => Math.floor((Date.now() - t) / 86400000);
const actions = [];
const lines = [];
const log = (s) => { lines.push(s); console.log(s); };

log(`\n=========== SYSTEM DIAGNOSTIC ${new Date().toISOString().slice(0, 10)} ===========`);

// --- 1. SERP snapshot freshness + deltas ---
const snapDir = path.join(HERE, "serp-snapshots");
const snaps = fs.existsSync(snapDir) ? fs.readdirSync(snapDir).filter((f) => f.endsWith(".json")).sort() : [];
if (!snaps.length) { log("\n[SERP] no snapshots"); actions.push("run: node production/serp-track.mjs"); }
else {
  const latest = JSON.parse(fs.readFileSync(path.join(snapDir, snaps.at(-1)), "utf8"));
  const age = days(fs.statSync(path.join(snapDir, snaps.at(-1))).mtimeMs);
  log(`\n[SERP] latest snapshot: ${snaps.at(-1)} (${age}d old, ${snaps.length} total)`);
  if (age > 8) actions.push("SERP snapshot stale (>8d): run node production/serp-track.mjs");
  const entries = Array.isArray(latest) ? latest : latest.report || latest.results || latest.keywords || [];
  let ranked = 0, junk = 0;
  for (const e of entries) {
    const kw = e.term || e.keyword || e.query || "?";
    const top = (e.top10 || e.top || e.organic || []).map((x) => (typeof x === "string" ? x : x.domain || x.url || ""));
    const isJunk = top.some((d) => /whatsapp|merriam-webster|wikipedia\.org/.test(d)) && /web design/.test(kw);
    if (isJunk) { junk++; log(`  JUNK reading: "${kw}" (actor artifact, re-run)`); }
    const r = e.ourRank ?? e.rank;
    if (r) { ranked++; log(`  RANK #${r}: "${kw}" -> ${e.ourUrl || ""}`); }
  }
  log(`  ${entries.length} keywords tracked, ${ranked} ranked, ${junk} junk readings`);
  if (junk) actions.push(`re-run ${junk} junk keyword reading(s) before trusting them`);
  if (snaps.length >= 2) {
    const prev = JSON.parse(fs.readFileSync(path.join(snapDir, snaps.at(-2)), "utf8"));
    const prevMap = new Map((Array.isArray(prev) ? prev : prev.report || prev.results || []).map((e) => [e.term || e.keyword || e.query, e.ourRank ?? e.rank]));
    for (const e of entries) {
      const kw = e.term || e.keyword || e.query, now = e.ourRank ?? e.rank, was = prevMap.get(kw);
      if (now !== was && (now || was)) log(`  DELTA "${kw}": ${was ?? "unranked"} -> ${now ?? "unranked"}`);
    }
  }
}

// --- 2. GSC data freshness ---
const gscMarkers = fs.readdirSync(HERE).filter((f) => /^gsc.*\.(json|csv|txt)$/i.test(f) && f !== "gsc-report.mjs" && f !== "gsc-index-audit.mjs");
const gscDirs = ["gsc-reports", "gsc-data"].map((d) => path.join(HERE, d)).filter(fs.existsSync);
let newestGsc = 0;
for (const f of gscMarkers) newestGsc = Math.max(newestGsc, fs.statSync(path.join(HERE, f)).mtimeMs);
for (const d of gscDirs) for (const f of fs.readdirSync(d)) newestGsc = Math.max(newestGsc, fs.statSync(path.join(d, f)).mtimeMs);
log(`\n[GSC] ${newestGsc ? `newest saved output ${days(newestGsc)}d old` : "no saved outputs found"}`);
if (!newestGsc || days(newestGsc) > 7) actions.push("pull fresh Search Console data: node production/gsc-report.mjs");

// --- 3. Research chain state (serial vetting) ---
const resDir = path.join(HERE, "research");
const STAGES = ["00-candidate", "01-serp", "02-autopsy", "03-language", "04-uniqueness", "05-brief"];
log(`\n[CHAIN] research targets:`);
if (!fs.existsSync(resDir) || !fs.readdirSync(resDir).filter((d) => fs.statSync(path.join(resDir, d)).isDirectory()).length) {
  log("  none in flight");
  actions.push("start the next chain target (Stage 0) from SEO-STRATEGY FUTURE queue");
} else {
  let inFlight = 0;
  for (const t of fs.readdirSync(resDir)) {
    const dir = path.join(resDir, t);
    if (!fs.statSync(dir).isDirectory()) continue;
    const files = fs.readdirSync(dir);
    const done = STAGES.filter((s) => files.some((f) => f.startsWith(s)));
    const killed = files.some((f) => /^killed/i.test(f));
    const shipped = files.some((f) => /^shipped/i.test(f));
    log(`  ${t}: ${killed ? "KILLED" : shipped ? "SHIPPED" : `stage ${done.length}/6`} [${done.map((s) => s.slice(0, 2)).join(",")}]`);
    if (!killed && !shipped) { inFlight++; actions.push(`advance chain target "${t}" (next: ${STAGES[done.length] || "brief->ENGINE"})`); }
  }
  if (inFlight > 2) actions.push(`${inFlight} targets in flight: SERIAL means finish or kill before starting more`);
}

// --- 4. Article quality sweep (drift check) ---
if (full) {
  log(`\n[EVAL] sweeping blog/*.html ...`);
  const blogDir = path.join(ROOT, "blog");
  const rows = [];
  for (const f of fs.readdirSync(blogDir).filter((x) => x.endsWith(".html") && !/template|index|clusters|editorial/.test(x))) {
    try {
      const out = execSync(`node "${path.join(HERE, "article-eval.mjs")}" "${path.join(blogDir, f)}" --json`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
      const j = JSON.parse(out);
      rows.push({ f, fails: j.fails, warns: j.warns });
    } catch (e) {
      try { const j = JSON.parse(e.stdout); rows.push({ f, fails: j.fails, warns: j.warns }); }
      catch { rows.push({ f, fails: -1, warns: -1 }); }
    }
  }
  const bad = rows.filter((r) => r.fails > 0).length;
  rows.sort((a, b) => b.fails - a.fails || b.warns - a.warns);
  log(`  ${rows.length} articles: ${bad} with FAILs; worst 5:`);
  for (const r of rows.slice(0, 5)) log(`    ${r.f}: ${r.fails} fail / ${r.warns} warn`);
  if (bad) actions.push(`${bad} article(s) have hard FAILs: retrofit worst-first`);
  fs.writeFileSync(path.join(HERE, "eval-sweep-latest.json"), JSON.stringify(rows, null, 2));
} else log(`\n[EVAL] skipped (use --full for the article sweep; last saved: ${fs.existsSync(path.join(HERE, "eval-sweep-latest.json")) ? days(fs.statSync(path.join(HERE, "eval-sweep-latest.json")).mtimeMs) + "d old" : "never"})`);

// --- 5. Checkpoint ladder ---
const CHECKPOINTS = [
  ["C1 clicks-off-zero check (else CTR pass)", "2026-08-02"],
  ["C2 long-tails page 1-2 check (else retrofit+links, halve cadence)", "2026-08-30"],
  ["C3 pivot decision (content vs outreach-primary)", "2026-10-11"],
];
log(`\n[CHECKPOINTS]`);
for (const [name, date] of CHECKPOINTS) {
  const d = Math.ceil((new Date(date) - Date.now()) / 86400000);
  log(`  ${date} ${name}: ${d < 0 ? `OVERDUE by ${-d}d` : `in ${d}d`}`);
  if (d < 0) actions.push(`checkpoint OVERDUE: ${name} — call it in SEO-STRATEGY PRESENT`);
  else if (d <= 2) actions.push(`checkpoint due in ${d}d: ${name} — pull data and call it`);
}

// --- 6. Ops log discipline (the self-improvement audit) ---
const opsLog = path.join(HERE, "OPS-LOG.md");
if (!fs.existsSync(opsLog)) { log(`\n[OPS-LOG] missing`); actions.push("create production/OPS-LOG.md and log this cycle"); }
else {
  const txt = fs.readFileSync(opsLog, "utf8");
  const dates = [...txt.matchAll(/^## Cycle .*?(\d{4}-\d{2}-\d{2})/gm)].map((m) => m[1]).sort();
  const last = dates.at(-1);
  const age = last ? days(new Date(last).getTime()) : Infinity;
  log(`\n[OPS-LOG] last cycle entry: ${last || "none"} (${age === Infinity ? "-" : age + "d ago"})`);
  if (age > 7) actions.push("ops cycle overdue (>7d): run the loop and log it, including one system improvement");
  if (last && !/system improvement/i.test(txt.slice(txt.lastIndexOf("## Cycle")))) actions.push("last cycle entry has no 'System improvement' line: every cycle must improve the system");
}

// --- 7. Improvement matrix (auto-scored dimensions; paste row into OPS-LOG) ---
// Score 0-5 per dimension. Auto where possible; judgment dims marked "?".
{
  const snapAge = snaps.length ? days(fs.statSync(path.join(snapDir, snaps.at(-1))).mtimeMs) : 99;
  const dataScore = Math.max(0, 5 - Math.floor(Math.max(snapAge, newestGsc ? days(newestGsc) : 14) / 2));
  let chainScore = 0;
  if (fs.existsSync(resDir)) {
    let recent = 0;
    for (const t of fs.readdirSync(resDir)) {
      const dir = path.join(resDir, t);
      if (!fs.statSync(dir).isDirectory()) continue;
      for (const f of fs.readdirSync(dir)) if (days(fs.statSync(path.join(dir, f)).mtimeMs) <= 7) recent++;
    }
    chainScore = Math.min(5, recent); // stage artifacts touched this week
  }
  let qualScore = "?";
  const sweepPath = path.join(HERE, "eval-sweep-latest.json");
  if (fs.existsSync(sweepPath)) {
    const rows = JSON.parse(fs.readFileSync(sweepPath, "utf8"));
    const failing = rows.filter((r) => r.fails > 0).length;
    qualScore = Math.max(0, 5 - failing);
  }
  let outcomeScore = "?";
  if (snaps.length >= 2) {
    // count improved ranks vs previous snapshot
    const cur = JSON.parse(fs.readFileSync(path.join(snapDir, snaps.at(-1)), "utf8"));
    const prv = JSON.parse(fs.readFileSync(path.join(snapDir, snaps.at(-2)), "utf8"));
    const pm = new Map((prv.report || []).map((e) => [e.term, e.ourRank]));
    let up = 0, down = 0;
    for (const e of cur.report || []) {
      const was = pm.get(e.term);
      if (e.ourRank && (!was || e.ourRank < was)) up++;
      else if (was && (!e.ourRank || e.ourRank > was)) down++;
    }
    outcomeScore = Math.max(0, Math.min(5, 2 + up - down));
  }
  let improveScore = 0;
  if (fs.existsSync(opsLog)) {
    const txt = fs.readFileSync(opsLog, "utf8");
    const lastEntry = txt.slice(txt.lastIndexOf("## Cycle"));
    if (/system improvement:(?!\s*\(?\s*none)/i.test(lastEntry)) improveScore = 4;
  }
  log(`\n[MATRIX] cycle row (paste into OPS-LOG, adjust judgment dims marked ?):`);
  log(`| ${new Date().toISOString().slice(0, 10)} | data ${dataScore} | chain ${chainScore} | quality ${qualScore} | signals ? | outcomes ${outcomeScore} | improvement ${improveScore} |`);
  log(`  (data=freshness, chain=stage artifacts advanced this week, quality=5-articles-failing,`);
  log(`   signals=judgment: links+distribution done for shipped pieces, outcomes=rank movement, improvement=system upgraded)`);
}

// --- verdict ---
log(`\n=========== NEXT ACTIONS (${actions.length}) ===========`);
actions.forEach((a, i) => log(`${i + 1}. ${a}`));
if (!actions.length) log("system healthy: pick the next FUTURE queue item");
log("");
