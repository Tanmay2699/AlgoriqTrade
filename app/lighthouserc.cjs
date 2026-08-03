/**
 * Lighthouse CI budgets (website/docs/07 §3, §8): ≥ 0.95 across categories on
 * `/` and `/pricing`, mobile emulation (the LCP budget is a 4G-mobile
 * number), three runs with the median asserted.
 *
 * Two deliberate softenings, both documented:
 *  - `categories:seo` is a WARN until launch: the whole site is `noindex`
 *    pre-cutover (src/app/robots.ts), and Lighthouse's `is-crawlable` audit
 *    rightly fails on that. The cutover launch gate (website/docs/08 §4)
 *    flips robots AND promotes this assertion to error in the same change.
 *  - script transfer budget 120 KB: the ≤100 KB-gzip copy budget plus
 *    headroom for transfer-size accounting differences; tightened in W4 once
 *    RUM corroborates.
 *
 * Upload target is the local filesystem — never public storage; a perf
 * report of an unlaunched site is not something we publish by accident.
 */
module.exports = {
  ci: {
    collect: {
      startServerCommand: "node e2e/serve.mjs",
      startServerReadyPattern: "Ready|Listening|started",
      startServerReadyTimeout: 60000,
      url: ["http://127.0.0.1:3105/", "http://127.0.0.1:3105/pricing"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["warn", { minScore: 0.95 }],
        "resource-summary:script:size": ["error", { maxNumericValue: 120000 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci/reports",
    },
  },
};
