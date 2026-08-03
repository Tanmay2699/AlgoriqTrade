# 05 — Component Spec

**Purpose:** The site's component library: what gets built, what gets
extracted from the terminal, and the quality bar every component meets. 03
composes these into pages; 04 governs their look; 06 governs their words.

**Key decisions**

1. **Adopt the terminal's token layer, not its component code.** The terminal
   hand-rolled its UI kit (no shadcn/Radix/lucide — verified); the site builds
   its own small kit on the same `--ae-*` + `@theme inline` token pattern so
   product embeds and page chrome share one color source.
2. **Extract, don't imitate, the data components.** The terminal already
   contains dependency-free, themeable pieces built for honesty — the SVG
   equity sparkline, the Wilson-CI bar, the heatmap tile scale, the
   evidence-window progress bar. The site lifts these (long-term: into a
   shared package) so marketing charts *are* product charts.
3. **Every component ships all its states.** Loading/ready/unavailable is a
   platform law (`Collection<T>`); site components that fetch (pricing, track
   record) implement it — an outage renders as "unavailable", never as an
   empty pricing page asserting the product has no plans.
4. **Brand assets are part of this spec** — the repo has none today (text
   wordmark only, zero files in `public/`): logo/wordmark, favicon set,
   `theme-color`, OG image template are W1 deliverables.

---

## 1. Foundations

- `SiteShell` — header + footer + skip link + theme bootstrap (nonce-free
  pattern, 07 §4) + `#main` landmark. Max-width and section rhythm from 04 §4.
- `Section` — the storytelling shell: eyebrow · headline · support · media
  slot · optional receipt-line (claims-ledger footnote). Variants: text-left /
  text-right / centered / full-bleed. Handles reveal motion (04 §5) and
  `prefers-reduced-motion` internally so pages never hand-roll animation.
- `Prose` primitives — headline/subhead/body components enforcing scale,
  measure, `text-wrap: balance`, sentence case.

## 2. Navigation

- `SiteNav` — sticky, translucent-blur over canvas (opaque below `md`, the
  terminal's occlusion rule), wordmark, 4–5 links (Product, Pricing, Track
  record, Security, How it's built), theme toggle, primary CTA. Mobile: sheet
  with full link list, 44 px targets. Keyboard: skip link first, visible
  focus, Escape closes sheet.
- `Footer` — inherits the existing marketing footer's 3-paragraph compliance
  pattern (`apps/web/src/app/(marketing)/layout.tsx`): not-an-RA/status line,
  virtual-money statement, DPDP residency — plus legal links (06 §6), theme +
  CVD toggles, and the plain-words strip.

## 3. HeroTerminal (the flagship component)

A composed, animated terminal vignette: chart painting candles, watchlist rows
ticking, an order ticket confirming — driven by a **scripted synthetic
session** through the real wire shapes (`packages/contracts` types), so the
animation is a replay of the product's actual data path, not a video.

- **Data label on canvas** ("Simulated feed") — non-negotiable (04 §7.1).
- **LCP strategy:** server-rendered static first frame (inline SVG/HTML, no
  chart runtime); the animation layer hydrates after. The chart runtime is
  the terminal's own Lightweight Charts *only if* it fits the JS budget
  (07 §3) — otherwise the dependency-free SVG sparkline approach extended
  with a candle renderer. Decide in W2 with the profiler, not taste.
- **Reduced motion:** the static frame is the experience (still labeled).
- **Pause on `document.hidden`;** no autoplay audio, obviously.
- Theme- and CVD-aware via tokens.

## 4. Extracted product-data components

| Component | Source to extract | Site use |
|---|---|---|
| `SparklineSVG` | `apps/web/src/components/equity-curve.tsx:170-223` — pure `<polyline>`, `stroke="currentColor"`, gap-honest (one polyline per contiguous run) | Hero accents, stat tiles, section dividers |
| `CiBar` | duplicated in `(app)/recs/page.tsx` + `(app)/track-record/page.tsx` (extraction fixes a real duplication) | Track-record embed |
| `HeatmapTiles` | `market-breadth.tsx` `tileStyle(bps)` intensity scale | Market-coverage act (labeled demo data) |
| `ProgressMeter` | recs evidence-window bar | Dark-launch status, roadmap acts |
| `StatTile` | consolidation of the terminal's three near-identical KPI tiles (recs `Stat`, portfolio `MetricCard`/`SummaryCard`) | Stat rows; variants `measured` (ledger-linked, dated) vs `budget` (target), per 04 §7.6 |

Extraction lands in `website/` first; promoting to a shared `packages/`
UI module is an explicit later decision with the terminal team (open q. 1).

## 5. ProductFrame & DeviceShowcase

- `ProductFrame` — a real screenshot in a minimal chrome frame: data-source
  caption, optional annotation overlay (rings/dimming applied in code over the
  untouched capture, 04 §6), theme-matched variant swap, full alt text.
  Captures come from the W2 screenshot pipeline; hand-edited images are
  rejected in review.
- `DeviceShowcase` — the same flow captured at 390 px (tab-bar shell) and
  1440 px (Command Center) in neutral device frames; proves "works
  everywhere" without app-store badges.

## 6. TrackRecordEmbed

Server-rendered from `svc-recs` (`/v1/recs/track-record`,
`/v1/recs/transparency/{month}`), revalidated on a short TTL:

- Renders the API's own series whole (no windowing/cherry-picking), CiBars,
  net-of-charges basis line, `TRACK_RECORD` disclaimer adjacent.
- **Dark-launch state:** evidence-window progress + "no published calls yet;
  registration pending" — designed as carefully as the data state; never
  falls back to illustrative numbers.
- Transparency rows show the content hash with a "what is this?" gloss —
  the verifiability *is* the feature.
- Unavailable state names the cause ("track record temporarily unreachable"),
  never an empty table.

## 7. PricingTable

- Catalog fetched from `svc-billing` `/v1/billing/plans` (the existing
  pricing page's rule: prices live in one place); `formatPaise`-style ₹
  rendering with Indian digit grouping; feature-code → label map carried over.
- Augmented with the docs/11 per-tier quota rows (instrument budget, WS
  connections, alerts, watchlists, lab runs, API access) — sourced from a
  single quotas module, not typed into JSX.
- Free column leads with "delayed data, full sandbox" honesty; Institutional
  column is a contact CTA with the API/webhook/seat facts.
- States: loading skeleton sized to the grid; unavailable = "catalog
  unavailable" card (inherited behavior), never stale prices.

## 8. Diagrams

`FourGatesDiagram` (flag → consent → step-up MFA → per-order confirm),
`AuditChainDiagram` (draft → lint → RA gate → hash chain → publish → score),
`PipelineDiagram` (readiness → 5 analysts → fusion → CIO → compliance lint →
RA), `StackDiagram` (Azure/Databricks/AKS path). All SVG/HTML with selectable
text, tokens for color, alt/`aria-describedby` narrative, no text baked into
raster images.

## 9. Social-proof components (dormant at launch)

`TestimonialCard`, `LogoStrip`, `PressQuote` — built, tested, and **feature-
flag-dormant** until real content exists (06 §5). The components require
attribution fields (`name`, `role`, `permissionRef`) — unattributable content
is unrenderable by construction, the platform's "no field a password could go
in" move applied to marketing.

## 10. Conversion components

- `CtaBand` — final act: headline, primary CTA, no-urgency support line
  ("Free tier. No card. Virtual money.").
- `WaitlistForm` (pre-identity launch): email + explicit DPDP-purpose consent
  checkbox (unchecked by default), first-party endpoint, success/failure
  states, no third-party form vendor. Retired when Entra signup lands
  (00 §Open-2).
- `StickyCta` — appears after the hero leaves viewport; dismissible; never
  overlaps the mobile tab-bar zone; hidden for `print`.

## 11. Content utilities

- `GlossTerm` — accessible jargon gloss (MIS, OI, VaR…): `<button>` +
  tooltip/popover pattern with keyboard + touch support; glossary content in
  one module (lintable).
- `DisclaimerBand` — port of the terminal's `<Disclaimer which={...}>`
  (`apps/web/src/lib/disclaimer.tsx`): registry-backed, emits
  `data-disclaimer-id`/`-ver` attributes so the compliance e2e can assert
  presence on marketing pages exactly as it does in-app.
- `ReceiptFootnote` — the claims-ledger link rendered as a quiet superscript
  ("verified · CL-014"); expands to the receipt on tap. This component is the
  visible face of working rule 5.
- `FaqAccordion` — native `<details>`-based, deep-linkable ids, FAQPage
  JSON-LD emitted from the same content module (07 §8).
- `ComparisonTable` — sticky first column, horizontal scroll container with
  focusable wrapper (terminal's pattern), fact-cell props require a
  `receipt` ref.

## 12. Quality bar (every component)

Both themes + deutan axis · 320 px → 4K · keyboard complete + visible focus ·
`prefers-reduced-motion` state · loading/ready/unavailable where data is
fetched · zero CLS (reserved space, sized skeletons — the terminal's
documented discipline) · axe-clean in CI at two viewports · copy via lintable
modules only · no third-party runtime dependencies without a 07 §3 budget
line.

## Open questions

1. When do extracted components graduate to a shared package consumed by both
   `apps/web` and `website/` (fixes the CiBar duplication upstream)? Proposal:
   after launch, as its own change with the terminal's owners.
2. Icon approach: continue the terminal's inline-SVG-only rule (no icon
   library) for the site, or admit a tree-shaken set? Leaning: inline SVG
   only; the site needs < 20 icons.
3. ~~Does `StickyCta` survive the taste bar?~~ — **resolved 2026-08-03 (W4):
   no. Not built.** The full-page prototype answered it: the homepage already
   offers a CTA in the hero, mid-page links out of the track-record and
   engineering acts, and the final CtaBand — a floating chrome element adds
   urgency theater (02 §6 territory) for no navigational need, and it
   competes with the mobile tab-bar zone. If conversion data post-launch
   argues otherwise, rebuild behind a flag with RUM evidence attached.
