import { defineConfig, devices } from "@playwright/test";

const PORT = 3105;

/**
 * Browser tests for the marketing site (website/docs/07 §7).
 *
 * One server, deliberately configured with NO upstream env vars: the suites
 * assert the honest degraded states (pricing "catalog unavailable", waitlist
 * "not open yet") alongside a11y and compliance — those states are product
 * behaviour, not test fixtures. Production artefact only: the standalone
 * server via e2e/serve.mjs, never `next dev` (the terminal's rule, same
 * reasons).
 *
 * Desktop Chrome + Pixel 7 is the terminal's matrix; chromium only (docs/10
 * §5.3 note — engines multiply CI time for coverage not yet claimed).
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: /.*\.e2e\.ts/,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  webServer: {
    command: "pnpm build && node e2e/serve.mjs",
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    stdout: "ignore",
    env: { PORT: String(PORT) },
  },
});
