/**
 * Local Lighthouse runner for this Windows box.
 *
 * `lhci autorun` completes its audits here and then dies in chrome-launcher's
 * temp-profile cleanup (`rmSync` EPERM — the profile dir is still locked when
 * Chrome exits). CI (ubuntu) does not exhibit this; this script exists so the
 * budgets can still be *measured* locally: it launches Playwright's Chromium
 * itself with an explicit profile dir, drives the lighthouse node API against
 * the debug port, and owns its own teardown (cleanup failures are ignored —
 * a locked temp dir is not a failed audit).
 *
 * Usage:  node scripts/lh-local.mjs http://127.0.0.1:3105/ [more urls...]
 * Env:    CHROME_PATH (defaults to the ms-playwright chromium install)
 */

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import lighthouse from "lighthouse";

const PORT = 9333;
const CHROME =
  process.env.CHROME_PATH ??
  join(
    process.env.LOCALAPPDATA ?? "",
    "ms-playwright",
    "chromium-1234",
    "chrome-win64",
    "chrome.exe",
  );

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("usage: node scripts/lh-local.mjs <url> [url...]");
  process.exit(2);
}

const profile = mkdtempSync(join(tmpdir(), "ae-lh-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function waitForPort() {
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Chrome debug port never came up");
}

let failed = false;
try {
  await waitForPort();
  for (const url of urls) {
    const result = await lighthouse(url, { port: PORT, output: "json", logLevel: "error" });
    const c = result.lhr.categories;
    const line = [
      `perf ${c.performance.score}`,
      `a11y ${c.accessibility.score}`,
      `best-practices ${c["best-practices"].score}`,
      `seo ${c.seo.score}`,
    ].join(" | ");
    console.log(`${url}\n  ${line}`);
    const failing = Object.values(c).filter(
      (cat) => cat.id !== "seo" && (cat.score ?? 0) < 0.95,
    );
    if (failing.length > 0) {
      failed = true;
      console.log(`  BELOW 0.95: ${failing.map((cat) => cat.id).join(", ")}`);
    }
  }
} finally {
  chrome.kill();
  // Best-effort: the whole reason this script exists is that this rm can
  // EPERM while Chrome's file handles drain. Never let cleanup fail the run.
  setTimeout(() => {
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {
      /* leave it for the OS temp cleaner */
    }
    process.exit(failed ? 1 : 0);
  }, 1500);
}
