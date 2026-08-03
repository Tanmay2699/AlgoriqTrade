# 01 — Product Inventory (STEP 1)

**Purpose:** The complete, codebase-verified feature catalog the website sells
from. Every entry was discovered by sweeping `services/` (16 services),
`packages/` (8 shared libs), `lakehouse/` (6 packages), and `apps/web` (the
terminal) on 2026-08-03. Each module lists what exists, the receipt (file
path), and what the site may/may not claim. 03 turns this into pages; 06's
claims ledger pins the numbers.

**Key decisions**

1. Marketing groups the platform into **12 business modules** (below), not 16
   services — visitors buy capabilities, not architecture.
2. Numbers in this doc are **as-configured today** and enter site copy only
   via the claims ledger (rates, quotas, and prices can change; copy renders
   from live sources wherever possible).
3. The strongest marketing material is the honesty machinery itself — the
   §14 "claims with receipts" table is a first-class content source, not an
   appendix.

---

## 1. Platform at a glance

16 FastAPI/Node services · 8 shared packages · 6 lakehouse packages (pure-
Python ports of the Databricks reference, each with a CI gate) · Next.js 15
terminal (~24 authenticated screens, ~70 BFF routes) · Terraform/Helm/Actions
in `platform/` (authored, parser-verified via 52 checks, **not yet applied**).
Money is integer paise everywhere. Every service ships `/healthz`, `/readyz`,
Prometheus `/metrics`, RFC 9457 errors, and prod-requirement guards that
refuse to boot misconfigured (`alphaedge_common.prodcheck`).

## 2. Tiers, quotas, prices (verified cross-service)

Prices from `services/billing/src/svc_billing/plans.py:100-133`; quotas from
the cited files. **Site copy renders these from the billing catalog / a single
quotas module — never hardcoded.**

| | Free ₹0 | Pro ₹999/mo | Elite ₹2,999/mo | Institutional (custom) |
|---|---|---|---|---|
| Market data | 15-min delayed | real-time NSE/BSE | + MCX real-time | contract |
| Stream instruments | 50 | 500 | 3,000 | 3,000 (`market-gateway/…/entitlements.py:42-55`) |
| Depth | — | 5-level | top-20 book | top-20 |
| Alerts | 3 | 10 | 500 | 500 (`alerts/…/config.py:76`) |
| Watchlists (×100 items) | 2 | 10 | 50 | 50 (`alerts/…/watchlists.py:46-61`) |
| AI chat questions/day | 0 | 30 | 200 | 500 (`ai-orchestrator/…/config.py:47-51`) |
| Backtests/day | 0 | 3 (presets) | 25 (full DSL) | 100 (`strategy-lab/…/api/lab.py:27`) |
| Research report | scorecard + track record | full report | + options strategy, per-agent rationale | full (`recs/…/api/recs.py:201-210`) |
| API keys | — | — | 2 active | 2 active (`billing/…/apikeys.py:47-63`) |
| Risk defaults (order cap / daily loss) | ₹2L / ₹10k | ₹50L / ₹50k | ₹2Cr / ₹2L | ₹20Cr / ₹20L (`risk/…/limits.py:16-45`) |

GST-inclusive prices; Razorpay-hosted checkout (we never see card/UPI data —
`billing/…/razorpay.py:10-12`).

## 3. Market data & terminal

Real-time WebSocket fan-out with tier entitlement enforced structurally: two
depth channels so a Pro socket can never carry an Elite book; delayed tape is
its own channel (`md.t15.*`, 900 s); per-socket freshest-wins conflation with
bounded memory; snapshot-on-subscribe so panels paint instantly; slow clients
closed with 1013 rather than degrading everyone (`market-gateway/…/
conflate.py`, `dispatch.py`, `entitlements.py`). One socket per browser via
SharedWorker with refcounts and widest-wins modes — two tabs watching RELIANCE
cost one subscription (`apps/web/public/workers/market-shared.js`). Terminal:
dockable Command Center (dockview) ≥1024 px, Simplicity Mode below, Ctrl-K
palette + one command grammar for keyboard and voice, Bloomberg-style A/B/C
panel linking. Dashboard: sector heatmap/breadth/movers with per-payload
coverage disclosure; FII/DII flows with earned-only z-scores; market status
answered from the exchange calendar, independent of the feed
(`dashboard/…/api/dashboard.py`). Reference data: instrument search, tri-state
circuit bands, sector classification, corporate-action previews
(`instruments/…/api/instruments.py`).

**Claim:** real-time terminal, honest coverage, session-aware everything.
**Don't claim:** uptime SLAs (none measured yet), symbol universe sizes.

## 4. Charts & indicators

Lightweight Charts with candles/line/area/baseline + volume pane; timeframe
map 1D→1m … Max→1w; URL-driven state; indicator math in a Web Worker;
watermark "15-MIN DELAYED" burned into Free-tier canvases; right-click a
price → create alert. **30 indicators in one canonical YAML** consumed by the
chart worker, the alert engine, and the backtester, with a CI drift gate
comparing all three (`packages/indicators/indicators.yaml`,
`tests/integration/test_indicator_spec.py`): 25 client-side (SMA, EMA, RSI,
MACD, Bollinger, ATR, Supertrend, Stochastic, VWAP, Donchian, OBV, ADX,
Ichimoku, CCI, Williams %R, ROC, MFI, Keltner, PSAR, Aroon, WMA, HMA, TRIX,
StdDev, CMF) + 5 server-side (Max Pain, PCR, IV percentile, volume profile,
delivery %). `null` means "not enough history", never zero.

**Claim:** "an alert on Supertrend(10,3) fires on exactly the line the chart
drew — a test proves the three implementations agree."

## 5. Options analytics

Chain around ATM (23 rows) with server-computed Black-76 IV + Greeks, PCR (OI
and volume), Max Pain, ATM detection; 2 s snapshot cache; TTE runs to the
15:30 IST expiry instant (`options/…/chain.py`, `black76.py` — line-for-line
port of the terminal's TS so both agree to the last digit). Position-level
book Greeks with signed values, "3 of 5 legs priced" coverage, unpriceable
legs named and excluded, Θ-burn measured against remaining *time value*
(default warn at 30%/day) (`options/…/positions.py`). Elite: 20-level depth
ladder that never fabricates an empty book.

## 6. Sandbox trading engine

Order types MARKET/LIMIT/SL/SL-M + Bracket (OCO children), Cover
(non-cancellable SL), GTT and GTT-OCO; products CNC/MIS/NRML; mandatory
idempotency keys; live order-status WebSocket (`orders-sim/…/api/`). Fills
walk the opposite book best-first, then price the residual with square-root
market impact (k≈12 bp equities / 8 bp F&O, α=0.5); tick rounding is always
against the taker; an empty book raises rather than inventing a fill
(`engine/fill.py:29-75`). Orders outside a tradeable session, outside the
circuit band, or into a limit-lock are refused with the verdict attached —
and every response distinguishes "checked and passed" from "not checked"
(`engine/tradeability.py`). Margin: MIS equity 5× (SEBI peak-margin shape),
SPAN-lite for F&O; margin watch sweeps every 5 s, alerts at 80%, force-
flattens the largest losing MIS/F&O position at 100% — and a book it cannot
mark is UNKNOWN, and **UNKNOWN liquidates nothing**; CNC is never force-sold
(`engine/margin_watch.py`). 15:15 IST auto square-off behind Postgres
advisory-lock leader election + calendar check (`scheduler.py`, `leader.py`).
Default virtual capital ₹1,00,000, deposit/reset endpoints. Portfolio: win
rate, profit factor, expectancy, XIRR (Newton + bisection fallback), equity
curve where a gap is a gap and drawdown from an incomplete curve is published
as a floor ("at least 8.30%") (`engine/analytics.py`, `engine/equity.py`).
Journal: auto-tagged trades + the half no platform can derive — closed-
vocabulary emotions, notes, user tags; absence is a value (`annotations.py`).
Leaderboard: opt-in, pseudonymous (HMAC handles), 90-session excess return vs
**NIFTY 50 TRI** (total-return, so the benchmark never flatters), Sharpe
tie-break, anti-gaming floors, consent re-applied per read — withdrawal is
immediate for every viewer (`leaderboard.py`; build:
`lakehouse/data-platform/…/leaderboard.py`).

**Claim:** "practice with fills that cost you the spread and the impact, and
a margin engine that will never sell your position on a cache miss."

## 7. Charges engine (the honesty flex)

One engine for sandbox, backtester, and ML cost floor — agreement to the
paisa is CI-enforced. Seven charge lines: brokerage (min(flat, pct) discount-
broker model), STT, **CTT** (separate statute, separate line — exactly one of
the two ever non-zero), exchange txn, SEBI fee, stamp duty, GST. Effective-
dated YAML rate book in exact `Fraction`s — a Budget change is a dated config
PR, not code (`packages/charges/…/ratebook.py`, `engine.py`). 10 segments;
agri commodities CTT-exempt as a visible `0` in YAML ("EXEMPT — not an
oversight"); 19 MCX contracts with real lot sizes (one CRUDEOIL lot = 100
barrels) and `turnover = price × lot × lots`; unknown symbols raise
(`commodities.py`).

## 8. Risk management

Eleven pre-trade evaluations — kill switch, daily-loss and weekly-drawdown
breakers, order size/notional, instrument & sector concentration, gross
exposure, margin utilisation (warn 80/block 95), open-order runaway guard,
exchange band, heat-score warning — each returning ALLOW/WARN/REDUCE_ONLY/
REJECT **plus an explicit SKIPPED when its facts were unavailable**: "a check
that did not run is not a check that passed" (`risk/…/engine.py:8-44`).
Reduce-only exits are exempt from our own limits — a user is never trapped in
a losing position by policy. Limits are tighten-only for their owner, capped
at tier ceiling for admins, journaled before effect (`store.py:31-46`). Heat
score 1–10 with published weights (exposure .35 / leverage .20 / correlation
.25 / volatility .20), versioned formula, assumptions disclosed, short-option
books floored at 7.0; VaR = 95% 1-day historical simulation (EWMA λ=0.94 as
drift cross-check), pure Python inside a p99 ≤ 25 ms budget, **refuses ₹0**
and names uncovered symbols with their notional (`heat.py`, `var.py`).
Breakers scoped to the IST session; equity snapshots can trip them between
orders and fan out an MIS square-off; the platform kill switch survives
restarts in Redis and **fails engaged** on an unreadable flag — the one place
the platform fails safe rather than "cannot say" (`hotstate.py`). Every admin
action lands on a hash chain whose integrity is verified on read
(`audit.py`).

## 9. Alerts, notifications & server-side trade management

13 alert conditions (price/%, volume spike, OI build/unwind, RSI, MACD
crosses, Supertrend flips) with tier quotas, atomic dedup/cooldown (300 s),
indicator evaluation strictly on bar close (`alerts/…/rules.py`,
`engine.py`). Watchlists live here too (order preserved — a watchlist is a
layout; duplicate adds idempotent). **Module E**: when a sandbox position
fills, a system rule population materializes — trailing stops (ATR
chandelier / percent / Supertrend, ratchet-only, HWM survives restarts),
regime classifier (TRENDING/RANGING/VOLATILE, hysteresis, volatility wins,
max 2 switches/session) that reparameterizes the trail, setup-invalidation
DSL exits on bar close, R-progress alerts (R fixed at arming, bands latch,
gap through T1→T2 reports both), correlation-risk sweeps that report
`assessed` and `unassessed` separately (`trailing.py`, `regime.py`,
`invalidation.py`, `progress.py`, `correlation.py`). Commands to the sandbox
are idempotent `(rule_id, seq)`; amendments may only tighten. Delivery:
push/email/SMS/Telegram with quiet hours (22:00–07:00 IST) that **never
suppress a stop-loss or invalidation**; contacts are verified-before-
delivery, masked on read, purpose-limited (`notify/…/events.py`,
`contacts.py`). Institutional webhooks: timestamp-signed HMAC, retry ladder
1m→6h that *ends*, per-endpoint circuit breaker, compliance envelope attached
by sender (`webhooks.py`).

## 10. AI research firm (recs) + track record + AI chat

**Pipeline** (`recs/…/pipeline.py`): readiness gate (6 probes; missing core
data ABORTS, degraded data drops sections and caps conviction at 7) →
universe screen (60) → five analysts (technical/fundamental/sentiment/sector/
quant; deterministic dev panel, Claude-on-Databricks production seam) →
**deterministic conviction fusion — the LLM never assigns conviction** → CIO
synthesis with risk-first sizing (¼-Kelly, ≤10% stock / ≤30% sector) →
blocking compliance lint (banned language, SL on correct side, T1<T2<T3, R:R
recomputed ±0.05, max_loss never "unlimited") → **DRAFT. Nothing
auto-publishes.** A human SEBI-RA approves via a separate role
(`ra.reviewer` ≠ `platform.admin` — an engineer cannot publish under an
analyst's registration), re-linted at approval (`api/recs.py:187-198`).
**Audit chain**: SHA-256 hash chain, 17 record types, persisted before
publication, DB-trigger-protected against UPDATE/DELETE, corrections are new
rows naming the original by hash — a pulled report keeps serving with the
correction attached (`audit.py`, `correction.py`). **SLA watchdog**: 08:45
IST publish-by, 08:50 miss recorded on-chain and a "no report today" notice
sent down the same delivery path; exchange-calendar-aware (`sla.py`).
**Scoring**: every published call replays through the same follow-up state
machine (stop evaluated before target on a shared tick — resolves against
us), P&L net of the full charge stack per ₹1L, hit rate over *triggered*
calls with Wilson 95% CI, per-setup and per-conviction breakdowns, monthly
content-hashed transparency reports anchored to the chain (`scorecard.py`,
`transparency.py`). Dark launch: 47 of 60 evidence sessions as of the sweep;
nothing published until RA registration.
**AI chat** (`ai-orchestrator`): REG-06 guardrail runs **before** the model —
"should I buy" framing never reaches inference and cannot be jailbroken out
of a model that never ran; refusals are free, audited, and never echo the
banned phrase; answers are grounded in published reports or curated education
**or silent**; every answer streams with tool progress, citations, audit id,
and the AI_CHAT disclaimer (no RA attribution — deliberately)
(`guardrails.py`, `api/chat.py`).

**Claim:** pillar B and F material — strongest module on the platform.
**Don't claim:** "SEBI-registered" (pending), any performance number outside
the live API.

## 11. Strategy Lab, backtesting & ML

Two-tier backtesting: event-driven engine whose `Context` physically cannot
serve the future (orders fill from the *next* bar), sandbox fill rules
(touch ≠ fill, gap-throughs fill at the gap, stop-first same-bar), shared
charges engine; Tier-1 vectorized screen always watermarked
SCREENING_ESTIMATE (`lakehouse/backtesting/…/engine.py`, `fills.py`).
Validation protocol: walk-forward (3-year min train, 63-session test,
5-session embargo, published number = stitched OOS), Deflated Sharpe Ratio,
parameter-plateau check, Monte-Carlo drawdown block bootstrap (10k paths,
refuses <30 trades). **Publishability gate**: OOS + costs-on + DSR ≥ 0.95 +
plateau + ≥100 trades, else non-dismissable watermarks; sustained OOS Sharpe
>2 after costs is treated as a leakage alarm (`publish.py`). Elite DSL
compiles to the same engine through a closed AST evaluator — never user
Python (`dsl.py`, `expr.py`). Lab UI shows charges as a first-class row and
the run's own watermarks + BACKTEST disclaimer. ML: UC feature tables stamped
19:30 IST so T−1 holds by construction; triple-barrier labels stop-first with
a **cost floor 3× round-trip charges** ("a model can never learn a 4 bp edge
that is entirely brokerage and GST"); LambdaMART baseline + LSTM/PatchTST
challengers on a gradient-checked autodiff; promotion gates (hit ≥55%, worst
regime ≥50%, net Sharpe ≥1.2, MC p95 DD ≤8%, holdout → 20 shadow sessions →
human sign-off → hash-chained audit); drift monitors with automatic kill
criteria K1–K6; the CI gate trains on shuffled labels and fails if the
control closes the gap (`lakehouse/ml/…`).

## 12. News intelligence & risk feeds

News: source tiers EXCHANGE > WIRE > SOCIAL that **fail downward**;
syndication dedupe before embedding (SimHash prefilter + shingle containment
on the body) so six reprints are one story and corroboration counts distinct
sources; entity resolution that refuses ambiguous word-tickers (IDEA, POWER)
rather than fabricating a citation; retrieval takes `as_of` as a required
argument — lookahead is unrepresentable; results carry `corroboration`,
`is_rumour`, and rumours are never citable evidence (`lakehouse/news/…`).
Risk feeds: nightly returns/correlation/beta jobs where **a gap is absent,
never zero** (every zero-fill bias points toward a book that looks safer),
pairs need ≥30 common observations, pruning is published so absent ≠ zero,
and a CI check proves the published matrix runs through `svc_risk.var` to the
same paise (`lakehouse/risk-analytics/…`).

## 13. Mutual funds, identity, live broker bridge

**MF**: AMFI catalog + NAV history (gaps stay gaps; `N.A.` is never zero — a
zero NAV divides a SIP into infinite units), four-decimal NAV precision for
allotment, forward-looking allotment (a weekend instalment gets the *next*
struck NAV), SIP tracker computes exactly what needs no market data and says
"needs NAV data" for the rest (`mf/…/amfi.py`, `api/mf.py`).
**Identity**: Entra External ID is the credential authority — no password
field exists anywhere and a test enforces it (`identity/…/model.py:309-329`);
real session management (list devices, revoke one/all, 30-min server-side
idle timeout); onboarding as a 5-state machine ending in a trading mode that
defaults MANUAL; DPDP consent per purpose, versioned to exact wording,
append-only, with data export and typed-confirmation erasure that preserves
the audit trail via tombstones (`api/identity.py`).
**Broker bridge (Graduate-to-Live)**: the only path to a real broker. Four
gates checked together so none can be skipped — deploy-time feature flag
(off by default, console can display but not toggle), versioned DPDP consent
(wording bump invalidates prior consent), step-up MFA (15-min TTL), and
per-order manual confirmation that **defaults to absent** — the refusal text
itself states this keeps AlphaEdge outside SEBI's Feb-2025 retail algo
framework (`broker-bridge/…/consent.py:243-270`). `BrokerSession` has no
field a password could occupy; inbound payloads are credential-scanned;
tokens are AES-256-GCM envelope-encrypted, row-bound, hot-rotatable. A
timed-out order becomes UNKNOWN and is **never retried** — reconciliation
against the broker's own book is the only way out (`idempotency.py`). Kite
(Zerodha) is the reference adapter — BO maps to GTT-OCO **with a
user-visible note**; Angel One/Upstox/Dhan/Fyers are the declared roster,
not yet built. The 60-day readiness checklist is advisory and never gates a
user's own broker account.

## 14. Claims with receipts (CI gates as marketing content)

Every row is a marketing claim whose proof runs on every PR:

| Gate | What it proves (site-usable claim) |
|---|---|
| `python -m alphaedge_compliance` | No banned promise-language anywhere in product copy; disclaimers present on every performance surface (REG-03) |
| `python -m alphaedge_agent_evals` | 8 adversarial researcher failures (banned language, hallucinated ticker, wrong-side stop, size over cap, stale-data publish…) — 100% caught or the build is red (REG-06) |
| `python -m alphaedge_data_platform` | The 49-byte tick contract is byte-pinned; an unloaded calendar year fails CI; a synthetic session conserves volume end-to-end; leaderboard refusals hold |
| `python -m alphaedge_ml` | Cost floor equals the charges engine to 1e-9; as-of/purge/embargo hold; a model trained on shuffled labels must fail — leakage has a tripwire |
| `python -m alphaedge_news` | Nothing published after `as_of` is ever retrievable; reprints collapse; ambiguous tickers refuse |
| `python -m alphaedge_risk_analytics` | Return gaps never zero-filled; pruning reported; the nightly matrix and the live service compute the same paise |
| `python -m alphaedge_platform` | 52 IaC checks: India-only regions, private access, digest-only images, live trading off in every values file, audit-before-publish ordering, deploy freeze on every prod job |
| Indicator drift gate | Chart, alerts, and backtester compute the same value for every indicator |
| Contracts freshness | TS and Python wire types are generated from one schema, never hand-copied |

## 15. What the site must NOT claim (verified absences)

No SEBI RA registration yet (dark launch; pending state everywhere) · no
published research or real performance history yet (evidence window in
progress) · one broker adapter (Kite); the other four are a roster · no live
auto-trading, ever, by design · no native mobile apps, no PWA manifest yet ·
no i18n (English, en-IN formatting) · no uptime/SLA history · `platform/`
IaC never applied (no "battle-tested on Azure" claims) · no users/testimonials/
awards/partners · REST client has no retry/circuit breaker (don't over-claim
SDK maturity) · live matching engine pending vendor ingestion (sandbox fills
via simulator — described honestly as such).

## Open questions

1. Universe size ("~5,000 symbols") appears in docs/11's threat model — get a
   verified instruments-master count before any coverage number ships.
2. Which of the §14 gate claims make the homepage vs. the "How it's built"
   page? (03 proposes: three on homepage, full table on the engineering page.)
3. ~~The declared-but-unbuilt broker roster~~ — **resolved 2026-08-03 (W4,
   with `/live-trading`): name only Kite.** The site names integrations that
   work, never ones that are planned — naming four unbuilt brokers reads as
   a commitment (and a trademark question) we don't need. "Built
   broker-agnostic; adapters declare capabilities" covers the architecture
   without naming names (`website/app/src/app/live-trading/page.tsx`).
