# 07 — Tech & Performance

**Purpose:** Stack decision, performance/accessibility/SEO budgets, security
posture, analytics, hosting, and the CI gates that keep all of it true. The
engineering counterpart to 04/05.

**Key decisions**

1. **A standalone Next.js App Router app, `@alphaedge/website`, at
   `website/app/`** — pnpm workspace member, Turbo-integrated, self-hosted
   `output: "standalone"` on AKS behind Front Door (ADR-13 posture; no
   Vercel dependency), image in ACR, promoted by digest.
2. **Static-first rendering.** Unlike `apps/web` — whose root-layout CSP
   nonce read makes every route dynamic (`src/lib/csp.ts` documents the
   trade) — the site prerenders everything and uses ISR for the two live
   surfaces (pricing, track record). CSP works without nonces: the one
   inline theme-bootstrap script is **hash-allowed**, everything else is
   external.
3. **Budgets tighter than the terminal's**, because this is a static page:
   LCP ≤ 1.5 s p75 4G · INP ≤ 200 ms · CLS ≤ 0.05 · total JS on `/` ≤ 100 KB
   gzipped (hero included) · Lighthouse ≥ 95 all four categories on `/` and
   `/pricing` (target 100), asserted in CI exactly as docs/10 §8.2 already
   does for the terminal.
4. **Zero third-party runtime.** No CDN scripts, no tag managers, no chat
   widgets, no external fonts/images. First-party RUM only (the terminal's
   `web-vitals` beacon pattern), consent-respecting and cookieless for
   anonymous visitors.
5. **The site fetches upstream services server-side only** (billing catalog,
   recs track record) through its own route handlers/BFF — browser talks to
   the site, the site talks to the mesh, the `Collection`-style
   unavailable-vs-empty contract applies.

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js App Router + TypeScript (versions pinned to `apps/web`'s to keep the workspace coherent) | RSC-first; client islands only for hero animation, nav sheet, theme toggle, FAQ |
| Styling | Tailwind v4, CSS-first config, `@theme inline` over `--ae-*` tokens | Same architecture as the terminal (`globals.css` pattern); tokens per 04 §2 |
| Components | First-party kit per 05 | No shadcn/Radix (matches terminal precedent); inline SVG icons |
| Charts/animation | Extracted SVG components (05 §4); Lightweight Charts only if the hero budget survives it (05 §3) | Load `dataviz` skill before chart implementation (04 note) |
| Content | Typed TS/MDX modules, copy lintable (06 §2) | No CMS at launch |
| Fonts | Two self-hosted families, ≤ 4 weights, preloaded, metric-compatible fallbacks | 04 §3 |
| Images | `next/image`, AVIF/WebP, 2x screenshot captures; OG images generated at build | `apps/web` has zero image infra — the site owns this from scratch |

## 2. Rendering & data

- All routes `generateStaticParams`/static by default; `revalidate` (ISR):
  pricing 300 s, track-record 300 s, transparency months 1 h.
- Route handlers proxy `BILLING_API_URL` / `RECS_API_URL` (same env-var seam
  as the terminal's BFF; unset ⇒ honest "unavailable" render — and the Helm
  values **must declare these upstreams**; the platform gate's
  `config.bff_upstreams_declared` lesson says an unset URL renders a truthful
  empty state forever and no one notices — extend that check to the website
  chart in W4).
- Waitlist endpoint: first-party route handler → notify/contacts path with an
  explicit DPDP purpose (the `contacts.py` purpose-limitation rule: a
  waitlist address is consent for launch news, nothing else).
- No client-side fetch to platform services, no API keys in the site, no
  cookies for anonymous visitors.

## 3. Performance engineering

- **JS discipline:** the page works with JS disabled (nav, content, pricing
  table server-rendered; hero shows its static frame). Client islands are
  enumerated in a budget file reviewed in PR; a new island needs a byte-count
  line. Bundle budget asserted in CI (fail over 100 KB gz on `/`).
- **LCP:** hero static frame is server-rendered inline SVG/HTML (no chart
  runtime on the critical path), fonts preloaded, zero blocking third-party.
  LCP element must be the hero headline or static frame — verified in CI.
- **CLS 0.05:** every media slot sized; skeleton discipline inherited from
  the terminal (their per-route CLS case studies are the playbook); fonts
  with fallback metrics.
- **INP:** animation on `transform`/`opacity` only; hero tick loop batched in
  rAF (the terminal's pattern); no long tasks > 200 ms on interaction paths.
- Measured three ways: Lighthouse CI budgets on PR · a WebPageTest-class
  4G-mobile lab run per release · first-party RUM (`web-vitals` →
  `/api/rum`, the terminal's beacon reused) with p75 by route reviewed
  weekly alongside the terminal's numbers (docs/10 §8.2 cadence).

## 4. Security

- CSP: `default-src 'self'`; `script-src 'self' 'sha256-<theme-bootstrap>'`;
  `style-src` per Next streaming needs; `frame-ancestors 'none'`;
  `object-src 'none'`; `img-src 'self' data:`; no `connect-src` beyond self
  (no WS on the marketing site). No Razorpay exception — the site never
  renders checkout; subscribing happens in the terminal's `/settings`.
- Header set mirrors `apps/web/next.config.ts`: `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options: DENY`, locked-down
  `Permissions-Policy`.
- No auth surface, no session cookies, no personalization → `Cache-Control`
  public with ISR semantics; Front Door caching on.
- Waitlist endpoint rate-limited and Turnstile-class-challenged if abused
  (progressive, per docs/11 §8 philosophy — never on page render).

## 5. SEO

`apps/web` ships none of this; the site owns all of it:

- Metadata API per route (title/description per 03's per-page specs),
  canonical URLs, `sitemap.ts`, `robots.ts` (staging: `noindex` until
  cutover).
- OG/Twitter images: branded template (04 §Open-4), generated at build,
  claim-free (imagery + wordmark, no performance numbers — OG images bypass
  the lint, so the rule is: no numbers in OG images at all).
- JSON-LD: `Organization`, `SoftwareApplication` (with offers from the
  billing catalog fetched at build), `FAQPage` from the FAQ module. No
  `AggregateRating` (we have none; fabricating it is exactly what we don't
  do).
- Semantic landmarks + one h1/page (04 §8) double as SEO structure.
- hreflang: none (English-only; revisit with platform i18n).

## 6. Analytics & privacy (DPDP)

- **Cookieless first-party page analytics**: aggregate counts via the RUM
  beacon path (route, referrer class, device class) — no cross-site
  identifiers, no fingerprinting, nothing stored client-side for anonymous
  visitors ⇒ no consent banner required for measurement this shape; the
  privacy page documents it plainly (06 §6).
- Conversion events: waitlist submit / signup click, counted server-side.
- If product analytics ever need more, that's a DPDP consent conversation in
  a future doc revision — not a tag-manager install.

## 7. Accessibility engineering

- axe (`@axe-core/playwright`) per page, two viewports, in CI — including the
  route-coverage assertion trick from the terminal's suite (a page nobody
  scans reports no violations).
- Keyboard e2e for nav sheet, FAQ, gloss tooltips, theme toggle.
- `prefers-reduced-motion` variant snapshot-tested for the hero and section
  reveals.
- Compliance e2e (disclaimer `data-disclaimer-id` assertions) runs on
  marketing pages exactly as `apps/web/e2e/compliance.e2e.ts` does in-app
  (06 §2).

## 8. CI (the site's definition of green)

1. `lint` + `typecheck` + unit tests (Turbo).
2. `python -m alphaedge_compliance` with `website/` scan roots (06 §2).
3. Claims-ledger check: every `CL-` id referenced in copy resolves (06 §4).
4. Disclaimer-registry freshness (generated TS export matches the YAML).
5. Playwright: axe + compliance + keyboard suites, Desktop Chrome + Pixel 7
   (the terminal's matrix).
6. Lighthouse CI: `/`, `/pricing` — ≥ 95 × 4 + resource budgets.
7. Bundle budget (≤ 100 KB gz on `/`).
8. Link checker (internal + legal-page anchors).
9. Screenshot-freshness job (W2+): captures rebuilt from the current terminal
   on a cadence so product images can't silently stale.

## 9. Hosting & delivery

- Dockerfile (standalone output), image to ACR, digest-only promotion —
  inheriting the platform's Helm/deploy conventions and the
  `python -m alphaedge_platform` checks (digest-only images, container-port
  agreement, change-window step on prod jobs — a marketing deploy during
  market hours is still a deploy; the freeze applies).
- Helm: one more service entry in the existing chart family with
  `BILLING_API_URL`/`RECS_API_URL` declared; probes `/healthz`-equivalent.
- Front Door: public hostname → website; `/terminal` + app routes →
  `apps/web`; cutover + redirect plan in 08 §5.
- Dev: `pnpm --filter @alphaedge/website dev` against the same local service
  env vars the terminal uses (root README's local-run block).

## Open questions

1. ~~Public track record~~ — **resolved 2026-08-03 (W3), no platform change
   needed.** The svc-recs read endpoints are already anonymous by design:
   `GET /v1/recs/{scorecard,track-record,transparency,transparency/{month}}`
   carry no auth dependency and default to the free tier
   (`services/recs/src/svc_recs/api/recs.py:276-344`; tokenless access
   asserted in `services/recs/tests/test_transparency.py:102-131`). The
   login gate on the terminal's own `/track-record` page is an apps/web
   routing choice (`src/lib/route-access.ts`), not an API restriction — its
   own BFF proxies serve the JSON anonymously. The site fetches server-side
   via `RECS_API_URL` (ledger row CL-018). One honesty rule rides on top:
   while the payload's `status` is `dark_launch`, the embed renders the
   evidence-window count only — rendering privately scored stats would *be*
   publication, which is gated on SEBI RA registration.
2. Exact ISR TTLs vs Front Door cache TTLs (double-caching) — tune during
   the staging bake with real headers (needs a live environment; the only
   W4 item that does).
3. ~~Change window for marketing deploys~~ — **resolved 2026-08-03 (W4):
   the site rides `deploy.yml` unchanged.** Its digest artifact
   (`digest-website`) flows through the same resolve → dev → smoke → stage →
   prod pipeline, so the IST change-window step, OIDC, digest-only promotion
   and environment approvals all apply automatically, with the default
   window. No `--include-mcx-evening`: a marketing deploy has no reason to
   run during any session.
4. ~~CSP script-src~~ — **revisited and resolved 2026-08-03 (W4): accept
   the posture; do not add nonce middleware.** The context: the theme
   bootstrap is external (no hash needed), but Next emits inline
   `self.__next_f.push(...)` flight-data scripts into every prerendered
   page, and those can't be hash-enumerated by supported tooling. Nonce
   middleware would close that gap at the cost of making every route
   dynamic — losing static rendering, ISR and Front Door caching, the
   architectural spine of this site (§Key decision 2). Weighed against a
   site with no auth, no cookies, no user-supplied content, and a
   zero-third-party origin allowlist, the inline-script allowance is the
   right trade. **Re-open trigger, recorded here:** the day the site gains
   any authenticated or user-generated surface, this decision is void and
   nonces (or Next's hash support, if it lands) become mandatory before
   that surface ships. `website/app/next.config.ts` documents the same.
