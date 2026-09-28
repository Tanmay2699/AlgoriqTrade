/**
 * Terminal screenshot pipeline (website/docs/08 W2, 04 §6, 05 §5).
 *
 * Boots the REAL terminal — apps/web's standalone build against its e2e stub
 * upstream — and captures the screens the homepage acts embed. Rules:
 *
 *  - Real product only: the pixels come from the shipped artefact
 *    (apps/web/e2e/serve.mjs), never a mockup, never `next dev`.
 *  - No hand-editing: captures are committed as taken; annotation happens as
 *    an overlay layer in components (ProductFrame). Re-running this script is
 *    the only way screens change.
 *  - Provenance is data: every capture lands in screens-manifest.gen.json
 *    with its page, theme, viewport and data-source line, and ProductFrame
 *    refuses to render a screen without a manifest entry — the label cannot
 *    be forgotten.
 *  - Performance-shaped surfaces (/recs, /track-record, /lab results,
 *    /leaderboard) are DELIBERATELY not in the capture set: the stub serves
 *    canned outcome numbers, and a screenshot of canned outcomes on a
 *    marketing page is fabricated performance data no label can launder
 *    (website/docs/06 §3). The sandbox/quotes screens below are fine — they
 *    are simulated by definition and labelled as such.
 *
 * Usage: node scripts/capture-screens.mjs   (builds nothing; requires
 *        apps/web to be built — run `pnpm --filter @alphaedge/web build`)
 */

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_ROOT = join(HERE, "..");
const REPO_ROOT = join(APP_ROOT, "..", "..");
const WEB_ROOT = join(REPO_ROOT, "apps", "web");
const OUT_DIR = join(APP_ROOT, "public", "screens");
const MANIFEST = join(APP_ROOT, "src", "lib", "screens-manifest.gen.json");

const STUB = "http://127.0.0.1:8099";
const TERMINAL = "http://127.0.0.1:3100";
const GATEWAY_PORT = 8081;
const CANDLES_PORT = 8083;
const OPTIONS_PORT = 8082;

// Where the visuals matter, the REAL services run on their synthetic dev
// feeds (the root README's documented local stack): the market gateway so the
// socket connects and quotes tick (no "disconnected" banner — truthfully
// absent, not cropped out), svc-candles for chart history, svc-options for a
// real Greeks chain. The e2e stub covers the remaining REST upstreams.
const UV = join(process.env.USERPROFILE ?? "", ".local", "bin", "uv.exe");

const TERMINAL_ENV = {
  ...process.env,
  PORT: "3100",
  ORDERS_API_URL: `${STUB}/v1`,
  CANDLES_API_URL: `http://127.0.0.1:${CANDLES_PORT}/v1`,
  OPTIONS_API_URL: `http://127.0.0.1:${OPTIONS_PORT}/v1`,
  ALERTS_API_URL: `${STUB}/v1`,
  NOTIFY_API_URL: `${STUB}/v1`,
  BILLING_API_URL: `${STUB}/v1`,
  RECS_API_URL: `${STUB}/v1`,
  STRATEGY_LAB_API_URL: `${STUB}/v1`,
  MF_API_URL: `${STUB}/v1`,
  DASHBOARD_API_URL: `${STUB}/v1`,
  NEXT_PUBLIC_WS_URL: `ws://127.0.0.1:${GATEWAY_PORT}/ws/market`,
  NEXT_PUBLIC_ORDERS_WS_URL: "ws://127.0.0.1:8098/ws/orders",
};

const SOURCE_LINE =
  "Captured from the Algoryq Trade terminal on a stub data feed — simulated data, not live quotes.";

/**
 * id → capture spec. `ready` is a selector that must resolve before the
 * shutter fires — a capture of an error boundary must fail the run, not ship.
 */
const CAPTURES = [
  // SHIPPING SET — a capture joins this list only after a human has looked at
  // it (website/docs/04 §6: no broken or misleading frame ships, labelled or
  // not). Screens reviewed out of the set on 2026-08-03, with reasons:
  //
  //  - /terminal, /charts — two real terminal findings in this headless
  //    environment: (1) Lightweight Charts' main pane renders blank white at
  //    deviceScaleFactor 2 (axis pane paints, data present; paints at dsf 1);
  //    (2) even at dsf 1 the pane keeps LWC's default white background in
  //    dark mode and the candle series never renders — only indicator line
  //    series — i.e. the chart's theme/series effect does not run here.
  //    Rejoin the set when those are fixed in apps/web.
  //  - /sandbox — the stub's fixture positions (avg cost ₹2,500) marked
  //    against the synthetic feed's unrelated prices produce a −90% P&L that
  //    reads as breakage. Rejoin when the pipeline runs a real orders-sim
  //    and seeds fills against the same feed it marks from.
  //  - /risk — the e2e stub serves no risk API; the page renders only its
  //    honest unavailable states. Rejoin with a real svc-risk + seeded book.
  {
    id: "options",
    path: "/options",
    ready: "table",
    settle: 3000,
    caption: "The option chain — Black-76 IV and Greeks, PCR, Max Pain.",
  },
];

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

function spawnServer(label, args, env, cwd) {
  const child = spawn(process.execPath, args, { cwd, env, stdio: "ignore" });
  child.on("exit", (code) => {
    if (!shuttingDown) {
      console.error(`${label} exited early (code ${code})`);
      process.exit(1);
    }
  });
  return child;
}

async function waitFor(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`${url} never became ready`);
}

let shuttingDown = false;

function spawnUvicorn(label, app, port, extraEnv = {}) {
  const child = spawn(
    UV,
    ["run", "uvicorn", app, "--port", String(port), "--host", "127.0.0.1"],
    { cwd: REPO_ROOT, env: { ...process.env, ...extraEnv }, stdio: "ignore" },
  );
  child.on("exit", (code) => {
    if (!shuttingDown) {
      console.error(`${label} exited early (code ${code})`);
      process.exit(1);
    }
  });
  return child;
}

const stub = spawnServer("stub-upstream", [join(WEB_ROOT, "e2e", "stub-upstream.mjs")], process.env, WEB_ROOT);
const gateway = spawnUvicorn("market-gateway", "market_gateway.main:app", GATEWAY_PORT, {
  AE_MARKET_GATEWAY_SYNTHETIC_FEED: "true",
});
const candles = spawnUvicorn("svc-candles", "svc_candles.main:app", CANDLES_PORT, {
  AE_CANDLES_SYNTHETIC_FEED: "true",
});
const options = spawnUvicorn("svc-options", "svc_options.main:app", OPTIONS_PORT);
const web = spawnServer("terminal", [join(WEB_ROOT, "e2e", "serve.mjs")], TERMINAL_ENV, WEB_ROOT);

const entries = [];
try {
  await waitFor(`${STUB}/health`);
  await waitFor(`http://127.0.0.1:${GATEWAY_PORT}/healthz`);
  await waitFor(`http://127.0.0.1:${CANDLES_PORT}/healthz`);
  await waitFor(`http://127.0.0.1:${OPTIONS_PORT}/healthz`);
  await waitFor(`${TERMINAL}/api/health`);
  mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const capturedAt = new Date().toISOString();

  for (const spec of CAPTURES) {
    const variants = [];
    const shots = [
      { theme: "dark", viewport: DESKTOP, kind: "desktop" },
      { theme: "light", viewport: DESKTOP, kind: "desktop" },
      ...(spec.mobile ? [{ theme: "dark", viewport: MOBILE, kind: "mobile" }] : []),
    ];
    for (const shot of shots) {
      const context = await browser.newContext({
        viewport: shot.viewport,
        deviceScaleFactor: spec.dsf ?? 2,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      // The terminal's theme bootstrap reads these before first paint.
      await page.addInitScript(
        ([theme]) => {
          localStorage.setItem("ae.theme", theme);
          localStorage.setItem("ae.cvd", "none");
        },
        [shot.theme],
      );
      await page.goto(`${TERMINAL}${spec.path}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(spec.ready, { timeout: 20_000 });
      await page.waitForLoadState("networkidle", { timeout: 4_000 }).catch(() => {});
      await page.waitForTimeout(spec.settle);

      // Refuse to ship an error boundary as a product screen.
      const broken = await page
        .getByText(/application error|something went wrong/i)
        .count()
        .catch(() => 0);
      if (broken > 0) throw new Error(`${spec.id} (${shot.theme}) rendered an error state`);

      const file = `${spec.id}-${shot.kind}-${shot.theme}.png`;
      await page.screenshot({ path: join(OUT_DIR, file) });
      variants.push({ file: `/screens/${file}`, theme: shot.theme, kind: shot.kind, ...shot.viewport });
      await context.close();
      console.log(`captured ${file}`);
    }
    entries.push({ id: spec.id, path: spec.path, caption: spec.caption, variants });
  }
  await browser.close();

  writeFileSync(
    MANIFEST,
    JSON.stringify(
      {
        _generated_by: "website/app/scripts/capture-screens.mjs — do not edit by hand",
        captured_at: capturedAt,
        source: SOURCE_LINE,
        screens: entries,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`wrote ${MANIFEST} (${entries.length} screens)`);
} finally {
  shuttingDown = true;
  // `uv run` wraps uvicorn: killing the wrapper orphans the server on
  // Windows (observed — a rerun then fails to bind the port). Kill trees.
  for (const child of [stub, gateway, candles, options, web]) {
    if (process.platform === "win32") {
      spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      child.kill();
    }
  }
}
