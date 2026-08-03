/**
 * Compliance assertions for the marketing site (website/docs/06 §2) — the
 * terminal's compliance.e2e pattern: assert the rendered DOM carries the
 * right `data-disclaimer-id`s post-hydration, at both viewports (the
 * projects matrix runs every test on desktop + mobile).
 *
 * These are the invariants the REG-03 file lint cannot see — that the
 * disclaimers actually *render*, that labeled-simulated visuals keep their
 * labels, and that the standing footer statements reach every page.
 */

import { expect, test } from "@playwright/test";

test("homepage renders the SIM, TRACK_RECORD, AI_CHAT and BACKTEST disclaimers", async ({ page }) => {
  await page.goto("/");
  for (const id of ["DISC-SIM", "DISC-TRACK-RECORD", "DISC-AI-CHAT", "DISC-BACKTEST"]) {
    await expect(page.locator(`[data-disclaimer-id="${id}"]`)).toBeVisible();
  }
});

test("track-record page carries its disclaimers and is honest when the service is absent", async ({
  page,
}) => {
  // The e2e stack deliberately sets no RECS_API_URL (playwright.config): the
  // unavailable state is the behavior under test — named as unreachable,
  // never an empty table, and the page's disclaimers render regardless.
  await page.goto("/track-record");
  await expect(page.getByText("Track record temporarily unreachable")).toBeVisible();
  await expect(page.locator('[data-disclaimer-id="DISC-TRACK-RECORD"]')).toBeVisible();
  await expect(page.locator('[data-disclaimer-id="DISC-SIM"]')).toBeVisible();
  // Methodology is served even when the data is not.
  await expect(page.getByText("Collisions resolve against us")).toBeVisible();
});

test("security page states what does not exist yet", async ({ page }) => {
  await page.goto("/security");
  await expect(page.getByText("No external security audit yet")).toBeVisible();
});

test("how-its-built renders the ledger, pending rows included", async ({ page }) => {
  await page.goto("/how-its-built");
  // CL-014 is pending (kept out of copy); the receipts page shows the row
  // anyway — a claim we are not yet allowed to make, listed as such.
  await expect(page.getByText("CL-014")).toBeVisible();
});

test("simulated visuals carry their data labels", async ({ page }) => {
  await page.goto("/");
  // The hero vignette: badge + caption are part of the frame component.
  // `.first()`: the badge is a span-in-span, and both ancestors match the
  // text — strict mode rightly refuses to guess, so we say "the outermost".
  await expect(page.getByText("SIMULATED DATA").first()).toBeVisible();
  await expect(page.getByText("Simulated data for illustration — not live quotes.")).toBeVisible();
  // The coverage heatmap's mandatory label prop.
  await expect(page.getByText(/Simulated sector data for illustration/)).toBeVisible();
  // Product screenshots carry their capture-provenance line (ProductFrame
  // renders it from the manifest; it cannot be omitted by props).
  await expect(
    page.getByText(/Captured from the AlphaEdge terminal on a stub data feed/).first(),
  ).toBeVisible();
});

test("the disclaimer registry page lists every canonical entry", async ({ page }) => {
  await page.goto("/legal/disclaimers");
  for (const id of [
    "DISC-RESEARCH-FULL",
    "DISC-RESEARCH-SHORT",
    "DISC-SIM",
    "DISC-BACKTEST",
    "DISC-TRACK-RECORD",
    "DISC-AI-CHAT",
  ]) {
    await expect(page.getByText(id, { exact: false }).first()).toBeVisible();
  }
});

test("the standing compliance footer reaches every page", async ({ page }) => {
  // Scoped to <footer>: the FAQ answer quotes the same registration phrase in
  // the page body, and this test is about the standing footer specifically.
  for (const path of ["/", "/pricing", "/track-record", "/security", "/how-its-built", "/waitlist", "/legal/terms"]) {
    await page.goto(path);
    const footer = page.locator("footer");
    await expect(
      footer.getByText("Virtual money. Not a broker. Not investment advice."),
    ).toBeVisible();
    await expect(
      footer.getByText(/Research publication requires SEBI Research Analyst registration/),
    ).toBeVisible();
  }
});

test("dark-launch honesty: no performance figures, pending states render", async ({ page }) => {
  await page.goto("/");
  // The track-record act must render its dark-launch status, not numbers.
  await expect(page.getByText("Status today: dark launch.")).toBeVisible();
  // The waitlist form on a sink-less deployment says so instead of accepting.
  await page.goto("/waitlist");
  await expect(page.getByText(/isn't taking sign-ups from this deployment yet/)).toBeVisible();
});
