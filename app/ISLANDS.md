# Client islands budget

The rule (website/docs/07 §3): the site works with JavaScript disabled, and
every client island is enumerated here with what it costs and why it earns
it. **A PR adding an island adds a row**; an island without a row fails
review. The homepage JS budget is ≤ 100 KB gzipped total (asserted by
Lighthouse CI, `resource-summary:script:size`).

| Island | File | ~Cost (min+gz) | Why it must be client-side |
|---|---|---|---|
| Hero replay | `src/components/hero-replay.tsx` | ~3 kB | The deterministic scripted session animates candles/ticks with rAF; SSR renders its static first frame, so LCP never waits on it |
| Theme toggle | `src/components/theme-toggle.tsx` | ~1 kB | Writes `ae.theme`/`ae.cvd` to localStorage and flips the root attributes |
| Waitlist form | `src/components/waitlist-form.tsx` | ~2 kB | Availability check + POST + the four honest submit states |
| Gloss terms | `src/components/gloss-term.tsx` | ~2 kB | Toggletip open/close, Escape/outside-pointer dismissal, edge-aware alignment |
| RUM beacon | `src/components/rum-beacon.tsx` (+`web-vitals`) | ~3 kB | LCP/CLS/INP/TTFB finalise in the browser, some only on tab hide |

Not islands, deliberately:

- **Section reveals** (docs/04 §5) run from `public/theme-init.js` — the
  same pre-paint file that stamps the `.js` hiding marker, so a failed
  React bundle can never strand content hidden, and reveals don't wait for
  hydration. Vanilla IntersectionObserver, ~0.4 kB.
- **FAQ accordion** is native `<details>` — no JS at all.
- **Nav** is server-rendered links; no sheet, no hamburger JS.

Everything else on every page is a React Server Component with zero client
JavaScript beyond the framework runtime.
