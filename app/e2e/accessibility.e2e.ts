/**
 * Automated accessibility scan (WCAG 2.1 A/AA) — the terminal's suite shape
 * applied to the site, including its route-coverage trick: `PAGES` is checked
 * against the App Router by the last test, because a page nobody scans
 * reports no violations, which reads exactly like a page that has none.
 */

import { readdirSync } from "node:fs";
import { join } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  "/",
  "/pricing",
  "/track-record",
  "/security",
  "/how-its-built",
  "/live-trading",
  "/waitlist",
  "/legal/terms",
  "/legal/privacy",
  "/legal/disclaimers",
  "/legal/refunds",
  "/legal/grievance",
];

for (const path of PAGES) {
  test(`${path} has no critical or serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    // Let client islands (hero replay, waitlist form) hydrate before scanning.
    await page.waitForLoadState("networkidle", { timeout: 3_000 }).catch(() => {});
    await page.waitForTimeout(400);

    // Sweep the page the way a reader would, so every section reveal
    // (docs/04 §5) has fired and axe scans the state users actually see —
    // not the pre-reveal opacity-0 state.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(350);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    const detail = blocking
      .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)
      .join("\n");

    expect(blocking, `${path}\n${detail}`).toHaveLength(0);
  });
}

test("skip link is the first Tab stop and reaches main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.locator(".ae-skip-link");
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  expect(new URL(page.url()).hash).toBe("#main");
});

test("FAQ disclosures operate by keyboard", async ({ page }) => {
  await page.goto("/");
  const first = page.locator("#faq details").first();
  await first.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(first).not.toHaveAttribute("open", "");
});

test("reduced motion renders sections in final state with no reveal", async ({ page }) => {
  // 04 §5: reduced motion is a first-class rendering mode. Under it the
  // bootstrap never stamps the reveal marker, so a below-fold act is at full
  // opacity before any scrolling happens.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const act = page.locator("#refusals [data-reveal]");
  await expect(act).toHaveCSS("opacity", "1");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("glossary terms open by keyboard and close on Escape", async ({ page }) => {
  await page.goto("/");
  const term = page.locator("#options button", { hasText: "Put-call ratio" }).first();
  await term.scrollIntoViewIfNeeded();
  await term.focus();
  await page.keyboard.press("Enter");
  await expect(term).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText(/Put open interest divided by call open interest/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(term).toHaveAttribute("aria-expanded", "false");
});

test("theme and colour-vision selects are labelled and operable", async ({ page }) => {
  await page.goto("/");
  const theme = page.locator("#site-theme-select");
  await theme.selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  const cvd = page.locator("#site-cvd-select");
  await cvd.selectOption("deutan");
  await expect(page.locator("html")).toHaveAttribute("data-cvd", "deutan");
});

test("every static route is in the scan list", async () => {
  const appDir = join(import.meta.dirname, "..", "src", "app");

  const routes: string[] = [];
  const walk = (dir: string, url: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const { name } = entry;
      if (name.startsWith("_") || name === "api") continue;
      if (name.startsWith("[")) continue;
      const segment = name.startsWith("(") && name.endsWith(")") ? url : `${url}/${name}`;
      walk(join(dir, name), segment);
    }
    if (readdirSync(dir).includes("page.tsx")) routes.push(url || "/");
  };
  walk(appDir, "");

  const unscanned = routes.filter((r) => !PAGES.includes(r)).sort();
  expect(
    unscanned,
    `these routes exist but no accessibility scan covers them:\n  ${unscanned.join("\n  ")}\n` +
      `Add them to PAGES, and fix whatever the scan then reports.`,
  ).toEqual([]);
});

test("every page has exactly one h1", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const count = await page.locator("h1").count();
    expect(count, `${path} has ${count} <h1> elements`).toBe(1);
  }
});
