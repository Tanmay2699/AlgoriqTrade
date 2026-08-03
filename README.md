# AlphaEdge Website

The public marketing website for AlphaEdge — a standalone product surface whose
job is to explain, demonstrate, and convert: a visitor should understand what
AlphaEdge is, why it is different, and feel confident starting a free sandbox
account without ever seeing a demo call.

This folder is **docs-first**. The documentation suite below is written and
agreed before any site code lands, the same discipline `docs/` applies to the
platform itself. The site implementation will land in `website/app/` (a Next.js
app, pnpm workspace member) once the docs are settled.

## Why a separate folder

- `apps/web` already contains a minimal `(marketing)` route group (landing +
  pricing). That surface stays until this site replaces it; the replacement is
  an explicit cutover recorded in [docs/08-build-plan.md](docs/08-build-plan.md).
- The marketing site has a different deploy cadence, a different performance
  envelope (static-first, Lighthouse ≥ 95), and a different risk profile (public,
  anonymous, SEO-indexed) than the authenticated terminal. Isolating it keeps
  terminal CI fast and keeps the site unable to import terminal-only code paths.
- Everything the site *claims* still comes from the platform's single sources of
  truth (see working rules) — separation is about build artifacts, not content.

## Doc map

| Doc | Covers |
|---|---|
| [00-brief.md](docs/00-brief.md) | Mission, success criteria, hard constraints, and the master-prompt → AlphaEdge-reality translation table |
| [01-product-inventory.md](docs/01-product-inventory.md) | STEP 1: the complete codebase-derived feature catalog, grouped into business modules, with file references and per-module "what the site may claim" |
| [02-audience-messaging.md](docs/02-audience-messaging.md) | Personas, objection→answer matrix, messaging pillars, positioning, banned messaging |
| [03-sitemap-homepage.md](docs/03-sitemap-homepage.md) | Site map + the homepage narrative: every act with goal, copy direction, visual spec, data source, CTA |
| [04-design-language.md](docs/04-design-language.md) | Brand feel, color tokens, typography, spacing, motion, data-visualization honesty rules, device showcase |
| [05-component-spec.md](docs/05-component-spec.md) | The site component library: hero terminal, section shells, stat components, pricing table, disclaimer bands |
| [06-content-compliance.md](docs/06-content-compliance.md) | SEBI RA / DPDP copy rules, the canonical disclaimer registry bindings, claims ledger, legal page inventory |
| [07-tech-performance.md](docs/07-tech-performance.md) | Stack decision, performance/a11y/SEO budgets, analytics, hosting, CI gates |
| [08-build-plan.md](docs/08-build-plan.md) | Phased delivery with exit tests, launch-gate checklist, cutover from `apps/web (marketing)` |

## Working rules (non-negotiable)

1. **No fabricated data, ever.** No invented user counts, testimonials, awards,
   partner logos, or performance figures. A visual that shows market data shows
   *labeled* recorded/replayed or synthetic data — the same rule the terminal's
   breadth panel enforces ([README.md](../README.md), GAP-17b lineage).
2. **Copy is lintable.** All site copy lives where `python -m
   alphaedge_compliance` (the REG-03 banned-language lint) can scan it, and CI
   runs that scan against this folder. No guaranteed-returns phrasing, ever.
3. **One source per fact.** Pricing renders from `svc-billing`'s live catalog
   (a price never lives in two places — the rule `apps/web`'s pricing page
   already follows). Disclaimers render from the canonical registry in
   `packages/compliance` by id, never re-worded. Tier limits quote
   docs/11 §"Per-tier quotas". Track-record numbers come from `svc-recs`'
   transparency API or do not appear.
4. **Product screenshots are real.** Every UI visual is a capture of the actual
   terminal (dev feed clearly labeled), never a designed fiction of screens that
   do not exist.
5. **Claims with receipts.** Any capability claim on the site traces to a file,
   test, or CI gate in this repo via the claims ledger in
   [06-content-compliance.md](docs/06-content-compliance.md).

## Status

**W1 complete; W2 in progress (2026-08-03).**

W1 (foundations): `@alphaedge/website` at [app/](app/) — terminal token layer
ported, theme/CVD axes with pre-paint bootstrap, shell components, live-catalog
`/pricing` with the quota matrix, legal shells with counsel-pending states,
sink-or-honest `/waitlist`, disclaimer codegen from `packages/compliance` with
a CI freshness check, REG-03 lint extended to this folder.

W2 (so far): the **hero replay** — a deterministic scripted session animating
candles + ticking watchlist (SSR static frame, reduced-motion = static,
pauses when hidden, ~2 kB route JS); the **charges illustration** computed by
`packages/charges` itself (committed fixture via
`app/scripts/gen_charges_example.py` — ₹82.44 on a ₹1L intraday round trip,
line by line); deep homepage acts (charts drift-gate, cost stack, risk
SKIPPED-honesty, 8-step research pipeline, dark-launch track record, coverage
heatmap on labeled simulated data, four live gates, engineering receipts as
stat tiles); FAQ with FAQPage JSON-LD; claim-free OG image; extracted
`StatTile`/`HeatmapTiles`/`Steps` components; website steps added to
`.github/workflows/ci.yml`. Build static, REG-03 green (48 surfaces),
compliance tests green, runtime smoke green.

W2 (continued): **browser suites live** — `app/e2e/` runs axe (WCAG 2.1 A/AA)
over all 8 routes at desktop + Pixel 7 with the terminal's route-coverage
assertion, plus keyboard tests (skip link, FAQ, theme/CVD selects) and a
compliance suite asserting rendered `DISC-*` ids, simulated-data labels, the
standing footer on every page, and the dark-launch pending states. 36/36
green; the sweep caught one real defect (the homepage charges table's scroll
region wasn't keyboard-focusable — fixed with the terminal's focusable-region
pattern). **Lighthouse budgets wired**: `app/lighthouserc.cjs` (≥0.95
perf/a11y/best-practices on `/` + `/pricing`; SEO warn-level until the launch
cutover lifts the deliberate noindex) with a CI job; measured locally via
`app/scripts/lh-local.mjs` (chrome-launcher's temp cleanup EPERMs on this
Windows box, so the script drives the lighthouse API against Playwright's
Chromium directly): perf 0.97/1.0, a11y 1.0, best-practices 1.0.

W2 (complete, 2026-08-03): **screenshot pipeline live** —
`app/scripts/capture-screens.mjs` boots the real terminal (standalone build)
against the documented dev stack (real market-gateway + svc-candles +
svc-options on synthetic feeds, e2e stub for the rest), captures both themes
at set viewports, and writes `screens-manifest.gen.json`; `ProductFrame`
renders captures only through the manifest, so the provenance line cannot be
omitted (asserted by the compliance e2e). Shipping set after human review:
the **options chain** pair (real Black-76 chain), embedded in a new homepage
options act. Screens reviewed *out* of the set are documented in the script
with reasons — including three real findings for the terminal team:
(1) Lightweight Charts' main pane renders blank white in headless Chromium at
deviceScaleFactor 2; (2) even at dsf 1 the chart keeps LWC's default white
background in dark mode and never renders the candle series in the stub
environment (only indicator lines) — `/charts/[param]` is excluded from
apps/web's own e2e, so no browser test covers it; (3) stub fixture positions
marked against synthetic-feed prices render a nonsensical −90% P&L.

W3 (complete, 2026-08-03): **full narrative + receipts pages.** Three new
routes — `/track-record`: the `TrackRecordEmbed` full page plus the scoring
methodology (07 §Open-1 resolved with no platform change: svc-recs'
transparency reads are anonymous by design, so the site fetches server-side
via `RECS_API_URL`; in dark launch the embed renders the evidence-window
count and deliberately **not** the payload's privately scored stats,
because rendering them would *be* publication). `/security`: posture with
ledger receipts and a first-class "what doesn't exist yet" section (no
external audit yet; dual control designed, not implemented). `/how-its-built`:
the five CI-enforced invariants plus the sixth, the seven `python -m`
gates, and the claims ledger rendered **from its own markdown at build** —
pending rows included. The homepage grew to the full 23-act narrative
(workspace, live-data honesty, automation, AI-chat refusal — a labeled
word-for-word excerpt of the product's own refusal copy — Strategy Lab,
journal/leaderboard, security grid), with `GlossTerm` jargon glosses on the
dense acts. `ComparisonTable` shipped on `/pricing` (03 §Open-1 resolved:
category-based, never named vendors; AlphaEdge cells require a ledger id at
the type level). **Claims-ledger resolver is now a CI gate**
(`check:claims`): every `CL-` id in copy must resolve to a non-pending row
and every receipt path in the ledger must exist; the ledger grew to 31 rows
with ~60 code receipts verified by a repo sweep. e2e: 50/50 (new pages in
the axe matrix, GlossTerm keyboard test, per-page disclaimer + honesty
assertions); REG-03 surfaces 48 → 55; dark-launch render smoke-tested
against the real svc-recs.

Two new findings for the platform team (continuing W2's numbering):
(4) `services/ai-orchestrator/.../refusals.yaml` says "AlphaEdge is
registered to publish research" — RA registration is pending, so the
product ships a premature registration claim (the site quotes an excerpt
that elides it); (5) svc-recs returns fully scored performance stats inside
the `dark_launch` payload of an anonymous endpoint — any client that
renders the payload naively would publish an unapproved track record.

W4 (buildable scope complete, 2026-08-03): **launch machinery.** The W3
carry-overs landed first: `/live-trading` (the four gates one by one, the
SEBI Feb-2025 positioning in plain words, and the Kite honesty pair — BO
graduates to GTT-OCO *with the risk-shape note*, a timed-out order is
UNKNOWN and never retried; CL-032/033; 01 §Open-3 resolved: name only Kite,
never the planned roster) and the audit-chain + stack diagrams on
`/how-its-built` via the accessible `FlowDiagram` primitive (HTML, not
raster). SEO is complete for a pre-launch site: `metadataBase` +
self-canonicals, Organization + SoftwareApplication JSON-LD (offers only on
/pricing, from the same live catalog fetch that renders the cards — never
baked), and robots.txt is now a **runtime** route reading
`AE_SITE_INDEXABLE`, because a digest-promoted image cannot bake a
crawl-gate. First-party RUM: a `web-vitals` beacon island posts cookieless
aggregates to `/api/rum`, which logs structured stdout (container logs are
the collection path; no fabricated dashboard). New CI teeth: `check:links`
(every literal internal href resolves to a real route and fragment).

**The deploy path exists and the platform gate covers it**:
`website/app/Dockerfile` (standalone, no build-args at all — genuinely
digest-promotable, unlike apps/web), `platform/helm/values/website/` (all
four files; SITE_URL/WAITLIST_SINK_URL/AE_SITE_INDEXABLE deliberately unset
with reasons in comments), a `build-website` job in build-push.yml, and
zero changes to deploy.yml — the digest artifact rides the existing
resolve→dev→smoke→stage→prod pipeline, inheriting the IST change-window
gate (07 §Open-3 resolved). `config.bff_upstreams_declared` now lints
**both** Next.js apps (same check, so "52 checks" stays true); `/api/health`
added for the chart's probes. Verified: platform gate 52/52, platform tests
86/86 (both READMEs' stale "84" corrected), REG-03 clean (56 surfaces),
claims resolver 32 ids/33 rows, links clean, e2e **52/52**, build static
with `/live-trading` prerendered and robots.txt dynamic. Decisions
recorded: CSP posture accepted with a re-open trigger (07 §Open-4);
StickyCta not built (05 §Open-3).

W4 polish pass (2026-08-03, same day): **motion, budgets, OG, findings
routed.** Section reveals per 04 §5 (300ms ease-out-quint, 12px rise, once,
no re-trigger) — implemented in `public/theme-init.js` rather than a React
island so the script that hides content is the script that reveals it (a
failed bundle can never strand sections hidden; scripts-off, no
IntersectionObserver, and reduced-motion all mean nothing is ever hidden);
e2e adds a reduced-motion final-state test and the axe scans now sweep the
page so they audit the revealed state. Per-route OG images from one shared
claim-free template (pricing, track-record, security, how-its-built,
live-trading) — and OG source strings are now REG-03 surfaces (58 total),
because the rendered PNG is unlintable so the strings are where the scan
must happen. `ISLANDS.md` is the 07 §3 islands budget file. **Local
Lighthouse, all six content pages: performance 0.98–1.0, accessibility 1.0,
best-practices 1.0** (SEO stays low by design until the noindex lifts); the
one blemish found — a heading-order miss in the track-record embed — is
fixed and re-audited to 1.0. The waitlist-sink question is settled honestly:
no durable, contract-compatible intake exists anywhere in the platform
(svc-notify's store is user-scoped, in-process memory), so the form stays
in its refusing state — recorded in 00 §Open-2. All five product findings
are now routed into the platform's execution log
([docs/18](../docs/18-execution-plan.md) §"Findings routed from the website
build"). Final: e2e 54/54, REG-03 clean (58), claims + links resolvers
green.

Platform fixes (2026-08-03, same day — findings 3 and 4 resolved at the
source): svc-recs' anonymous read surfaces now **redact scored outcomes
while in dark launch** (evidence window only; unpublished monthly reports
are refused outright — the RA signature authorizes the read, not just the
write), with the contract tests rewritten to pin it and apps/web's
track-record/recs pages rendering an honest "outcomes withheld until
publication" state. `refusals.yaml` v1.1 drops the premature "is
registered" claim ("AlphaEdge exists to publish research" — true in every
registration state), and this site now quotes the refusal whole. Verified:
svc-recs 164/164, ai-orchestrator 163/163 + REG-06 gate, apps/web
typecheck + 616/616, REG-03 58 surfaces.

Waitlist sink (2026-08-03, same day — finding 5 resolved): **the durable
intake now exists.** svc-notify carries `POST /v1/notify/waitlist` —
anonymous (a waitlist is pre-user), one non-negotiable purpose
(`launch_updates`), consent version + timestamp stored verbatim with
latest-consent-wins, membership-blind responses, and **no read API**
(a tokenless list of addresses would be a PII leak with a URL). Durability
is the platform's §P0-3 pattern (`alphaedge_common.db` + alembic 0001,
selected on `AE_NOTIFY_DATABASE_URL`); in prod without a database the
endpoint refuses with 503 rather than recording into pod memory — this
form's route surfaces that as its honest "nothing was recorded" message.
The table shape is deliberately portable so the *real* Postgres store class
runs in CI on aiosqlite, restart-survival test included (svc-notify
131 → 143/143). `WAITLIST_SINK_URL` stays unset until the deploy that
provisions svc-notify's `database-url` secret; both values files document
the pairing, so wiring is now a deploy act, not missing machinery.

**Remaining to launch — everything needs a live environment or a human**
(docs/08 §4 gates): counsel-final legal copy · human copy review against
02 §6 · SEBI RA registration state · Azure apply + staging bake ≥ 1 week
with RUM quiet · Lighthouse ≥ 95 ×4 on the staging URL · Front Door
routing + 308s from `apps/web (marketing)` · the cutover change itself
(set `SITE_URL` + `AE_SITE_INDEXABLE=true` in the prod overlay, delete the
layout noindex, promote the LHCI SEO assertion to error — one PR, three
locks, documented in `values-prod.yaml` and `robots.txt/route.ts`) · set
`WAITLIST_SINK_URL` in the deploy that provisions svc-notify's
`database-url` secret (the sink itself shipped 2026-08-03).
