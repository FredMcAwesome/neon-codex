#!/usr/bin/env node

/**
 * View and compare performance history for the Neon Codex Character Creator.
 *
 * Usage:
 *   node frontend/perf/view-history.mjs [options]
 *
 * Options:
 *   --last <n>   Show the last N entries (default: 5)
 *   --compare    Compare the two most recent entries side-by-side
 *   --all        Show all entries
 *   --csv        Output step transition medians as CSV
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_FILE = join(__dirname, "results", "perf-history.json");

const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
}
const hasFlag = (name) => args.includes(name);

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

if (!existsSync(RESULTS_FILE)) {
  console.log(
    "No performance history found. Run measure-performance.mjs first."
  );
  process.exit(0);
}

const history = JSON.parse(readFileSync(RESULTS_FILE, "utf8"));

if (history.length === 0) {
  console.log("No entries in performance history.");
  process.exit(0);
}

if (hasFlag("--csv")) {
  // Output CSV of step transition medians over time
  console.log(
    "timestamp,commit,branch,forward_median_ms,rapid_total_ms,lighthouse_score,lcp_ms,tbt_ms"
  );
  for (const entry of history) {
    const fwdMedian = entry.transitions
      ? Math.round(median(entry.transitions.forward.map((t) => t.durationMs)))
      : "";
    const rapidTotal = entry.transitions?.rapidFire?.totalMs ?? "";
    const lhScore = entry.lighthouse?.performanceScore ?? "";
    const lcp = entry.lighthouse?.lcp ?? "";
    const tbt = entry.lighthouse?.tbt ?? "";
    console.log(
      `${entry.timestamp},${entry.git.commit},${entry.git.branch},${fwdMedian},${rapidTotal},${lhScore},${lcp},${tbt}`
    );
  }
  process.exit(0);
}

let count = history.length;
if (!hasFlag("--all")) {
  if (args.includes("--last")) {
    const raw = getArg("--last", null);
    if (
      raw == null ||
      raw.startsWith("--") ||
      !/^\d+$/.test(raw) ||
      parseInt(raw, 10) < 1
    ) {
      console.error(
        `Invalid --last value "${raw ?? "(missing)"}": must be a positive integer.`
      );
      process.exit(1);
    }
    count = parseInt(raw, 10);
  } else {
    count = 5;
  }
}
const entries = history.slice(-count);

for (const entry of entries) {
  const git = entry.git;
  console.log("─".repeat(60));
  console.log(
    `  ${git.commit} (${git.branch})${git.dirty ? " [dirty]" : ""}  ${entry.timestamp}`
  );
  if (git.message) console.log(`  "${git.message}"`);

  if (entry.lighthouse) {
    console.log(
      `  Lighthouse: ${entry.lighthouse.performanceScore}/100  LCP=${entry.lighthouse.lcp}ms  TBT=${entry.lighthouse.tbt}ms  CLS=${entry.lighthouse.cls}`
    );
  }

  if (entry.transitions) {
    const fwd = entry.transitions.forward;
    const allMs = fwd.map((t) => t.durationMs);
    const loadStr = entry.transitions.pageLoadMs
      ? `load=${entry.transitions.pageLoadMs}ms  `
      : "";
    console.log(
      `  Creator: ${loadStr}steps_median=${Math.round(median(allMs))}ms  max=${Math.max(...allMs)}ms  rapid_total=${entry.transitions.rapidFire.totalMs}ms`
    );

    const slow = fwd.filter((t) => t.durationMs > 500);
    if (slow.length > 0) {
      console.log(
        `  ⚠ Slow: ${slow.map((s) => `${s.from}→${s.to}(${s.durationMs}ms)`).join(", ")}`
      );
    }
  }
}
console.log("─".repeat(60));

if (hasFlag("--compare") && history.length >= 2) {
  const prev = history[history.length - 2];
  const curr = history[history.length - 1];

  console.log("\n  ══ COMPARISON ══");
  console.log(`  Old: ${prev.git.commit} (${prev.timestamp})`);
  console.log(`  New: ${curr.git.commit} (${curr.timestamp})\n`);

  if (curr.lighthouse && prev.lighthouse) {
    const fields = [
      "performanceScore",
      "fcp",
      "lcp",
      "tbt",
      "cls",
      "si",
      "tti",
    ];
    const units = { performanceScore: "pts", cls: "", default: "ms" };

    for (const field of fields) {
      const c = curr.lighthouse[field];
      const p = prev.lighthouse[field];
      if (c == null || p == null) continue;
      const diff = c - p;
      const unit = units[field] ?? units.default;
      const better = field === "performanceScore" ? diff > 0 : diff < 0;
      const arrow = better ? "✅" : diff === 0 ? "=" : "⚠️";
      const diffStr =
        field === "cls"
          ? `${diff >= 0 ? "+" : ""}${diff.toFixed(3)}`
          : `${diff >= 0 ? "+" : ""}${Math.round(diff)}${unit}`;
      console.log(
        `  ${field.padEnd(20)} ${String(p).padStart(8)} → ${String(c).padStart(8)} (${diffStr}) ${arrow}`
      );
    }
  }

  if (curr.transitions && prev.transitions) {
    if (curr.transitions.pageLoadMs && prev.transitions.pageLoadMs) {
      const loadDiff =
        curr.transitions.pageLoadMs - prev.transitions.pageLoadMs;
      const loadArrow = loadDiff < 0 ? "✅" : loadDiff === 0 ? "=" : "⚠️";
      console.log(
        `  Initial load: ${prev.transitions.pageLoadMs}ms → ${curr.transitions.pageLoadMs}ms (${loadDiff >= 0 ? "+" : ""}${loadDiff}ms) ${loadArrow}`
      );
    }

    console.log("\n  Step transitions:");
    const cFwd = curr.transitions.forward;
    const pFwd = prev.transitions.forward;
    const maxLen = Math.min(cFwd.length, pFwd.length);

    for (let i = 0; i < maxLen; i++) {
      const c = cFwd[i];
      const p = pFwd[i];
      const diff = c.durationMs - p.durationMs;
      const better = diff < 0;
      const arrow = better ? "✅" : diff === 0 ? "=" : "⚠️";
      console.log(
        `  ${c.from} → ${c.to}: ${p.durationMs}ms → ${c.durationMs}ms (${diff >= 0 ? "+" : ""}${diff}ms) ${arrow}`
      );
    }
  }
}
