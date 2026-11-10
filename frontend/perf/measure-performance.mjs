#!/usr/bin/env node

/**
 * Performance measurement script for the Neon Codex Character Creator.
 *
 * Measures:
 * 1. Lighthouse page-load metrics (LCP, TBT, CLS, SI, FCP, performance score)
 * 2. Step transition timings (clicking "Next" through every creator step)
 *
 * Usage:
 *   node frontend/perf/measure-performance.mjs [options]
 *
 * Options:
 *   --url <url>       Base URL of the running app (default: http://localhost:3000)
 *   --runs <n>        Number of Lighthouse runs to take the median of (default: 3, only with --lighthouse)
 *   --lighthouse      Enable Lighthouse page-load metrics (disabled by default)
 *   --headed          Run Puppeteer in headed mode (visible browser)
 *   --help            Show this help
 *
 * Prerequisites:
 *   - The app must already be running (`npm start` or `npm run sb` + `npm run sf`)
 *   - The database must be seeded with test users (admin/admin)
 */

import puppeteer from "puppeteer";
import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = join(__dirname, "results");
const RESULTS_FILE = join(RESULTS_DIR, "perf-history.json");

// ─── Argument parsing ────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf(name);
  if (idx === -1) return fallback;
  return args[idx + 1] ?? fallback;
}
const hasFlag = (name) => args.includes(name);

if (hasFlag("--help")) {
  console.log(
    readFileSync(fileURLToPath(import.meta.url), "utf8")
      .split("\n")
      .filter((l) => l.startsWith(" *"))
      .map((l) => l.replace(/^ \*\s?/, ""))
      .join("\n")
  );
  process.exit(0);
}

const BASE_URL = getArg("--url", "http://localhost:3000");
const RUN_LIGHTHOUSE = hasFlag("--lighthouse");
const HEADED = hasFlag("--headed");

// Validate --runs (only used with --lighthouse, but reject bad values whenever present)
let LIGHTHOUSE_RUNS = 3;
if (args.includes("--runs")) {
  const raw = getArg("--runs", null);
  if (
    raw == null ||
    raw.startsWith("--") ||
    !/^\d+$/.test(raw) ||
    parseInt(raw, 10) < 1
  ) {
    console.error(
      `Invalid --runs value "${raw ?? "(missing)"}": must be a positive integer.`
    );
    process.exit(1);
  }
  LIGHTHOUSE_RUNS = parseInt(raw, 10);
}

// ─── Utilities ───────────────────────────────────────────────────────

function getGitInfo() {
  try {
    const commitHash = execSync("git rev-parse --short HEAD", {
      encoding: "utf8",
    }).trim();
    const commitMsg = execSync("git log -1 --pretty=%s", {
      encoding: "utf8",
    }).trim();
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf8",
    }).trim();
    const isDirty =
      execSync("git status --porcelain", { encoding: "utf8" }).trim().length >
      0;
    return {
      commit: commitHash,
      message: commitMsg,
      branch,
      dirty: isDirty,
    };
  } catch {
    return { commit: "unknown", message: "", branch: "unknown", dirty: false };
  }
}

function loadHistory() {
  if (!existsSync(RESULTS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(RESULTS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveHistory(history) {
  if (!existsSync(RESULTS_DIR)) mkdirSync(RESULTS_DIR, { recursive: true });
  writeFileSync(RESULTS_FILE, JSON.stringify(history, null, 2));
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

// ─── Login helper ────────────────────────────────────────────────────

async function login(page) {
  console.log("  Logging in as admin...");
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });

  // A token alone isn't proof of a valid session (it may be expired).
  // The app redirects authenticated users away from /login, so only skip
  // the form when a token is present AND we actually leave /login.
  const hasToken = await page.evaluate(() => {
    const token = localStorage.getItem("token");
    return !!token && token.length > 0;
  });
  if (hasToken) {
    try {
      await page.waitForFunction(
        () => !window.location.pathname.endsWith("/login"),
        { timeout: 3000 }
      );
      console.log("  ✓ Already logged in (valid session)");
      return;
    } catch {
      console.log("  Stale token found, re-authenticating...");
    }
    // Clear the stale session so it can't mask a failed login below
    await page.evaluate(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    });
  }

  // Wait for the login form
  await page.waitForSelector("#username", { timeout: 15000 });
  // Clear fields before typing (reruns may retain values; keyboard events
  // keep React controlled inputs in sync, unlike setting .value directly)
  await page.click("#username", { clickCount: 3 });
  await page.keyboard.press("Backspace");
  await page.click("#password", { clickCount: 3 });
  await page.keyboard.press("Backspace");
  await page.type("#username", "admin");
  await page.type("#password", "admin");

  // Click Submit button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const submit = buttons.find(
      (b) => b.textContent?.trim() === "Submit" || b.type === "submit"
    );
    if (submit) submit.click();
  });

  // Wait for login success (token set in localStorage and navigated away from login)
  await page.waitForFunction(
    () => {
      const token = localStorage.getItem("token");
      return !!token && !window.location.pathname.endsWith("/login");
    },
    { timeout: 15000 }
  );
  console.log("  ✓ Logged in successfully");
}

// ─── Lighthouse measurement ──────────────────────────────────────────

async function runLighthouse(browser) {
  console.log("\n━━━ Lighthouse Page-Load Metrics ━━━");

  // We need to import lighthouse dynamically
  const lighthouse = (await import("lighthouse")).default;

  // First, log in with a regular page to get the JWT in localStorage
  const loginPage = await browser.newPage();
  await login(loginPage);

  // Grab the auth token from localStorage
  const token = await loginPage.evaluate(() => localStorage.getItem("token"));
  const username = await loginPage.evaluate(() =>
    localStorage.getItem("username")
  );
  await loginPage.close();

  if (!token) {
    throw new Error(
      "Login did not produce a token — cannot run authenticated Lighthouse."
    );
  }

  const allRuns = [];

  for (let i = 0; i < LIGHTHOUSE_RUNS; i++) {
    console.log(`  Run ${i + 1}/${LIGHTHOUSE_RUNS}...`);

    // Open a fresh page and inject auth before Lighthouse navigates
    const page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
    // Set localStorage so PrivateRoute lets us through (skip nulls —
    // setItem(null) would store the string "null")
    await page.evaluate(
      (t, u) => {
        if (t) localStorage.setItem("token", t);
        else localStorage.removeItem("token");
        if (u) localStorage.setItem("username", u);
        else localStorage.removeItem("username");
      },
      token,
      username
    );
    await page.close();

    // Run Lighthouse against the character creator page using the same browser
    const result = await lighthouse(`${BASE_URL}/character_creator`, {
      port: new URL(browser.wsEndpoint()).port,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance"],
      // Don't clear storage so our auth token persists
      disableStorageReset: true,
    });

    const audits = result.lhr.audits;
    const run = {
      performanceScore: result.lhr.categories.performance.score * 100,
      fcp: audits["first-contentful-paint"]?.numericValue,
      lcp: audits["largest-contentful-paint"]?.numericValue,
      tbt: audits["total-blocking-time"]?.numericValue,
      cls: audits["cumulative-layout-shift"]?.numericValue,
      si: audits["speed-index"]?.numericValue,
      tti: audits["interactive"]?.numericValue,
    };
    allRuns.push(run);
    console.log(
      `    Score: ${run.performanceScore} | LCP: ${Math.round(run.lcp)}ms | TBT: ${Math.round(run.tbt)}ms`
    );
  }

  // Compute median across runs (CLS is a 0-1 float — keep 3 decimals)
  const lighthouseResults = {};
  for (const key of Object.keys(allRuns[0])) {
    const med = median(allRuns.map((r) => r[key]));
    lighthouseResults[key] =
      key === "cls" ? Math.round(med * 1000) / 1000 : Math.round(med);
  }
  lighthouseResults.runs = LIGHTHOUSE_RUNS;

  return lighthouseResults;
}

// ─── Step transition measurement ─────────────────────────────────────

async function measureStepTransitions(browser) {
  console.log("\n━━━ Step Transition Timings ━━━");

  const page = await browser.newPage();

  // Enable performance metrics
  const client = await page.createCDPSession();
  await client.send("Performance.enable");

  await login(page);

  // Navigate to character creator
  console.log("  Navigating to character creator...");
  const loadStart = Date.now();
  await page.goto(`${BASE_URL}/character_creator`, {
    waitUntil: "domcontentloaded",
  });

  // Wait for the character creator to fully load (check for data-testid="ready")
  await page.waitForSelector('[data-testid="ready"]', { timeout: 45000 });
  const pageLoadMs = Date.now() - loadStart;
  console.log(
    `  ✓ Character creator loaded in ${pageLoadMs}ms (${(pageLoadMs / 1000).toFixed(1)}s)`
  );

  // Inject performance measurement code into the page
  await page.evaluate(() => {
    window.__perfMarks = [];
    window.__perfStart = null;
  });

  // Get the list of step names from the nav
  const stepNames = await page.evaluate(() => {
    const navItems = document.querySelectorAll(".character-creator-nav-item");
    return Array.from(navItems).map((el) => el.textContent?.trim() ?? "");
  });

  console.log(`  Found ${stepNames.length} steps: ${stepNames.join(" → ")}`);

  const transitions = [];

  async function clickButton(targetText, timeoutMs = 4000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const ok = await page.evaluate((t) => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const btn = buttons.find(
          (b) => b.textContent?.includes(t) && !b.disabled
        );
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      }, targetText);
      if (ok) return true;
      await new Promise((r) => setTimeout(r, 50));
    }
    return false;
  }

  // Click through each step using Next button
  for (let i = 0; i < stepNames.length - 1; i++) {
    const fromStep = stepNames[i];
    const toStep = stepNames[i + 1];

    // Mark the start time
    const startTime = Date.now();

    // Find and click the Next button
    const clicked = await clickButton("Next");

    if (!clicked) {
      console.log(`  ⚠ Could not find Next button at step "${fromStep}"`);
      break;
    }

    // Wait for the new step to render.
    try {
      await page.waitForFunction(
        (expectedStep) => {
          const activeNav = document.querySelector(
            ".character-creator-nav-item.active"
          );
          if (!activeNav) return false;
          const current = activeNav.textContent?.trim();
          return current === expectedStep;
        },
        { timeout: 10000 },
        toStep
      );

      // Give React one more animation frame to finish painting
      await page.evaluate(
        () => new Promise((r) => requestAnimationFrame(() => r()))
      );
    } catch {
      console.log(`  ⚠ Timeout waiting for step "${toStep}"`);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    transitions.push({
      from: fromStep,
      to: toStep,
      durationMs: duration,
    });

    const indicator = duration < 100 ? "🟢" : duration < 500 ? "🟡" : "🔴";
    console.log(`  ${indicator} ${fromStep} → ${toStep}: ${duration}ms`);
  }

  // Also measure going backwards through all steps (Previous button)
  console.log("\n  ── Reverse transitions (Previous) ──");
  const reverseTransitions = [];

  for (let i = stepNames.length - 1; i > 0; i--) {
    const fromStep = stepNames[i];
    const toStep = stepNames[i - 1];

    const startTime = Date.now();

    const clicked = await clickButton("Previous");

    if (!clicked) {
      console.log(`  ⚠ Could not find Previous button at step "${fromStep}"`);
      break;
    }

    try {
      await page.waitForFunction(
        (expectedStep) => {
          const activeNav = document.querySelector(
            ".character-creator-nav-item.active"
          );
          if (!activeNav) return false;
          return activeNav.textContent?.trim() === expectedStep;
        },
        { timeout: 10000 },
        toStep
      );
      await page.evaluate(
        () => new Promise((r) => requestAnimationFrame(() => r()))
      );
    } catch {
      console.log(`  ⚠ Timeout waiting for step "${toStep}"`);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    reverseTransitions.push({
      from: fromStep,
      to: toStep,
      durationMs: duration,
    });

    const indicator = duration < 100 ? "🟢" : duration < 500 ? "🟡" : "🔴";
    console.log(`  ${indicator} ${fromStep} → ${toStep}: ${duration}ms`);
  }

  // Rapid-fire: click Next as fast as possible through all steps
  console.log("\n  ── Rapid-fire forward (stress test) ──");
  const rapidTransitions = [];

  // Ensure we are at the first step (reverse transitions already took us there)
  const currentStep = await page.evaluate(() => {
    return document
      .querySelector(".character-creator-nav-item.active")
      ?.textContent?.trim();
  });
  if (currentStep !== stepNames[0]) {
    while (await clickButton("Previous", 500)) {
      await new Promise((r) => setTimeout(r, 20));
    }
  }

  const rapidStart = Date.now();
  for (let i = 0; i < stepNames.length - 1; i++) {
    const fromStep = stepNames[i];
    const toStep = stepNames[i + 1];
    const stepStart = Date.now();

    await clickButton("Next", 2000);

    try {
      await page.waitForFunction(
        (expectedStep) => {
          const activeNav = document.querySelector(
            ".character-creator-nav-item.active"
          );
          if (!activeNav) return false;
          return activeNav.textContent?.trim() === expectedStep;
        },
        { timeout: 10000 },
        toStep
      );
    } catch {
      /* continue anyway */
    }

    rapidTransitions.push({
      from: fromStep,
      to: toStep,
      durationMs: Date.now() - stepStart,
    });
  }
  const rapidTotalMs = Date.now() - rapidStart;
  console.log(`  Total rapid-fire time: ${rapidTotalMs}ms`);
  for (const t of rapidTransitions) {
    const indicator =
      t.durationMs < 100 ? "🟢" : t.durationMs < 500 ? "🟡" : "🔴";
    console.log(`  ${indicator} ${t.from} → ${t.to}: ${t.durationMs}ms`);
  }

  // Collect CPU/memory metrics
  const metrics = await client.send("Performance.getMetrics");
  const jsHeapUsed = metrics.metrics.find(
    (m) => m.name === "JSHeapUsedSize"
  )?.value;
  const jsHeapTotal = metrics.metrics.find(
    (m) => m.name === "JSHeapTotalSize"
  )?.value;

  await page.close();

  return {
    pageLoadMs,
    stepNames,
    forward: transitions,
    reverse: reverseTransitions,
    rapidFire: {
      transitions: rapidTransitions,
      totalMs: rapidTotalMs,
    },
    memory: {
      jsHeapUsedMB: jsHeapUsed ? Math.round(jsHeapUsed / 1024 / 1024) : null,
      jsHeapTotalMB: jsHeapTotal ? Math.round(jsHeapTotal / 1024 / 1024) : null,
    },
  };
}

// ─── Summary ─────────────────────────────────────────────────────────

function printSummary(result) {
  console.log("\n\n" + "═".repeat(60));
  console.log("  PERFORMANCE SUMMARY");
  console.log("═".repeat(60));

  const git = result.git;
  console.log(
    `  Commit:  ${git.commit} (${git.branch})${git.dirty ? " [dirty]" : ""}`
  );
  console.log(`  Date:    ${result.timestamp}`);

  if (result.lighthouse) {
    console.log("\n  ── Lighthouse ──");
    console.log(
      `  Performance Score: ${result.lighthouse.performanceScore}/100`
    );
    console.log(`  FCP:  ${result.lighthouse.fcp}ms`);
    console.log(`  LCP:  ${result.lighthouse.lcp}ms`);
    console.log(`  TBT:  ${result.lighthouse.tbt}ms`);
    console.log(`  CLS:  ${result.lighthouse.cls}`);
    console.log(`  SI:   ${result.lighthouse.si}ms`);
    console.log(`  TTI:  ${result.lighthouse.tti}ms`);
  }

  if (result.transitions) {
    console.log("\n  ── Character Creator ──");
    console.log(
      `  Initial Load: ${result.transitions.pageLoadMs}ms (${(result.transitions.pageLoadMs / 1000).toFixed(2)}s)`
    );

    const fwd = result.transitions.forward;
    const allFwdMs = fwd.map((t) => t.durationMs);
    console.log(`  Forward transitions (${fwd.length} steps):`);
    console.log(`    Median:  ${Math.round(median(allFwdMs))}ms`);
    console.log(`    P95:     ${Math.round(percentile(allFwdMs, 95))}ms`);
    console.log(`    Max:     ${Math.max(...allFwdMs)}ms`);
    console.log(`    Min:     ${Math.min(...allFwdMs)}ms`);

    const slowSteps = fwd.filter((t) => t.durationMs > 500);
    if (slowSteps.length > 0) {
      console.log(`\n  ⚠ Slow steps (>500ms):`);
      for (const s of slowSteps) {
        console.log(`    🔴 ${s.from} → ${s.to}: ${s.durationMs}ms`);
      }
    }

    const rapid = result.transitions.rapidFire;
    console.log(`\n  Rapid-fire total: ${rapid.totalMs}ms`);
    const rapidMs = rapid.transitions.map((t) => t.durationMs);
    console.log(`    Median step: ${Math.round(median(rapidMs))}ms`);
    console.log(`    P95 step:    ${Math.round(percentile(rapidMs, 95))}ms`);

    if (result.transitions.memory.jsHeapUsedMB) {
      console.log(
        `\n  Memory: ${result.transitions.memory.jsHeapUsedMB}MB / ${result.transitions.memory.jsHeapTotalMB}MB`
      );
    }
  }

  console.log("\n" + "═".repeat(60));
}

function printComparison(current, previous) {
  if (!previous) return;

  console.log("\n  ── Comparison with Previous ──");
  console.log(`  Previous: ${previous.git.commit} (${previous.timestamp})`);

  if (current.lighthouse && previous.lighthouse) {
    const scoreDiff =
      current.lighthouse.performanceScore -
      previous.lighthouse.performanceScore;
    const arrow = scoreDiff > 0 ? "↑" : scoreDiff < 0 ? "↓" : "=";
    console.log(
      `  Lighthouse Score: ${previous.lighthouse.performanceScore} → ${current.lighthouse.performanceScore} (${arrow}${Math.abs(scoreDiff)})`
    );
  }

  if (current.transitions && previous.transitions) {
    if (current.transitions.pageLoadMs && previous.transitions.pageLoadMs) {
      const loadDiff =
        current.transitions.pageLoadMs - previous.transitions.pageLoadMs;
      const loadArrow =
        loadDiff < 0 ? "↓ (faster)" : loadDiff > 0 ? "↑ (slower)" : "=";
      console.log(
        `  Initial Load: ${previous.transitions.pageLoadMs}ms → ${current.transitions.pageLoadMs}ms (${loadArrow} ${Math.abs(loadDiff)}ms)`
      );
    }

    const currMedian = median(
      current.transitions.forward.map((t) => t.durationMs)
    );
    const prevMedian = median(
      previous.transitions.forward.map((t) => t.durationMs)
    );
    const diff = currMedian - prevMedian;
    const arrow = diff < 0 ? "↓ (faster)" : diff > 0 ? "↑ (slower)" : "=";
    console.log(
      `  Step median:      ${Math.round(prevMedian)}ms → ${Math.round(currMedian)}ms (${arrow} ${Math.abs(Math.round(diff))}ms)`
    );

    const currRapid = current.transitions.rapidFire.totalMs;
    const prevRapid = previous.transitions.rapidFire.totalMs;
    const rapidDiff = currRapid - prevRapid;
    const rapidArrow =
      rapidDiff < 0 ? "↓ (faster)" : rapidDiff > 0 ? "↑ (slower)" : "=";
    console.log(
      `  Rapid-fire total: ${prevRapid}ms → ${currRapid}ms (${rapidArrow} ${Math.abs(rapidDiff)}ms)`
    );
  }
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("Neon Codex — Character Creator Performance Benchmark");
  console.log(`Target: ${BASE_URL}`);
  console.log(
    `Lighthouse: ${RUN_LIGHTHOUSE ? `${LIGHTHOUSE_RUNS} runs` : "disabled (use --lighthouse to enable)"}`
  );
  console.log(`Mode: ${HEADED ? "headed" : "headless"}\n`);

  // Check server is reachable
  try {
    const resp = await fetch(BASE_URL, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  } catch (err) {
    console.error(
      `\n✗ Cannot reach ${BASE_URL}. Make sure the app is running.\n  (npm start or npm run sb + npm run sf)\n`
    );
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: HEADED ? false : "shell",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  });

  const result = {
    timestamp: new Date().toISOString(),
    git: getGitInfo(),
    lighthouse: null,
    transitions: null,
  };

  try {
    // Phase 1: Lighthouse (opt-in)
    if (RUN_LIGHTHOUSE) {
      result.lighthouse = await runLighthouse(browser);
    }

    // Phase 2: Character Creator Load & Step transitions
    result.transitions = await measureStepTransitions(browser);
  } finally {
    await browser.close();
  }

  // Print results
  printSummary(result);

  // Save to history
  const history = loadHistory();
  const previous = history.length > 0 ? history[history.length - 1] : null;

  if (previous) {
    printComparison(result, previous);
  }

  history.push(result);
  saveHistory(history);

  console.log(`\n✓ Results saved to ${RESULTS_FILE}`);
  console.log(`  Total entries in history: ${history.length}\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
