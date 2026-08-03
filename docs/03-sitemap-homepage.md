# 03 — Sitemap & Homepage Narrative

**Purpose:** The information architecture and the scroll-by-scroll homepage
specification. Every act names its messaging pillar (02 §3), its proof source
(01), its visual (05 components), and the objection it retires (02 §4). The
master prompt's 72-section flow is consolidated here into 23 acts — the
mapping and the deliberate omissions are §5.

**Key decisions**

1. **One long homepage** does the selling; secondary pages carry depth
   (pricing, track record, security, how-it's-built, live-trading). No
   per-feature microsite sprawl at launch.
2. Acts alternate **show → prove**: a product visual act is followed by the
   mechanism that makes it trustworthy. The rhythm *is* the brand.
3. Three receipts on the homepage, the full receipts table on
   `/how-its-built` — engineering credibility without turning the homepage
   into documentation.
4. Every act ends within one viewport-height of its start on desktop; mobile
   gets the same order, tighter media.

---

## 1. Site map

```
/                     Homepage (this doc §3)
/pricing              Tier grid + quotas + FAQ subset (05 §7)
/track-record         Public transparency surface (05 §6; 07 §Open-1)
/security             Security & data posture (06 §6)
/how-its-built        Engineering page: receipts table, architecture, CI gates
/live-trading         Graduate-to-Live: the four gates, broker support, SEBI positioning
/legal/{terms,privacy,disclaimers,refunds,grievance}   (06 §6)
/waitlist → /signup   CTA target (config-switched, 08 §6)
[reserved: /changelog, /blog, /docs]
```

Nav: Product (scrolls home) · Pricing · Track record · Security ·
How it's built · CTA. Footer: full legal + compliance strip (05 §2).

## 2. Global page mechanics

Sticky nav appears after the hero; sticky CTA after act 4 (05 §10, behind a
flag). Section reveals per 04 §5 — no scroll-jacking, reduced-motion renders
final states. Every act's copy lives in one lintable module per act.

## 3. The homepage acts

Format — **Act (pillar): goal.** Content · Visual · Proof · CTA/objection.

**1. Hero (A): say everything in five seconds.**
Headline candidate 1 (*The market is real. The money is virtual. The
discipline is yours.*) + subhead naming NSE/BSE/MCX, live-data paper trading,
AI research with a human gate, risk engine. Primary CTA "Start free" (or
early-access variant), secondary "See the track record". · Visual:
`HeroTerminal` — chart painting, watchlist ticking, an order confirming, all
labeled "Simulated feed"; beneath it a thin market-status strip computed from
the exchange calendar ("NSE closed · pre-open 09:00 IST"), labeled "per
exchange calendar". · Proof: the product itself. · Objection: "what is
this?" answered before scrolling.

**2. Trust strip (D): only verifiable facts.**
Segments covered (NSE · BSE · MCX · currency · mutual funds) · "Built on
Azure + Databricks" · "Every claim on this site links to code" (→
/how-its-built) · CI-gate count. Text-only marks (06 §7). No logos of
customers that don't exist, no user counts.

**3. The problem (A): why practice, honestly.**
SEBI's own study: most individual F&O traders lose money (exact figure +
year pinned as CL-014 before publish, 06 §4). The usual answers — tips
channels, hindsight gurus, sims with fake fills — teach the wrong lessons. ·
Visual: restrained typographic stat, sourced and dated, no scare-graphics. ·
Objection: "will it make me money?" reframed to competence (02 §4 row 2).

**4. The answer (A): what AlphaEdge is.**
One paragraph (00 §2 serialized): live market, virtual money, real costs,
real risk engine, research with receipts. · Visual: annotated wide terminal
capture (`ProductFrame`). · CTA repeat.

**5. The terminal (A): the workspace.**
Command Center (dockable panels, saved workspaces, A/B/C panel linking,
Ctrl-K + voice command grammar that pre-fills but never submits), Simplicity
Mode below 1024 px — one registry, two compositions. · Visual:
`DeviceShowcase` desktop capture with panel callouts. · Objection: "can
beginners use it?" (Simplicity Mode) + "can pros scale?" (dock).

**6. Live market data (A/D): the feed you can afford to trust.**
Real-time WebSocket fan-out; Free is honestly 15-min delayed (badge *and*
canvas watermark — shown as a feature of honesty); Pro 5-level depth, Elite
top-20 book; one socket per browser so two tabs cost one subscription;
snapshot-on-subscribe instant paint. · Visual: depth ladder + watchlist
captures; small "how conflation works" inline diagram. · Proof: 01 §3
receipts. · Objection: "is free usable?" — yes, stated plainly.

**7. Charts & 30 indicators (D): one spec, three engines.**
25 client + 5 server indicators from one YAML consumed by chart, alerts, and
backtester — with the CI drift gate as the story ("an alert fires on exactly
the line you saw"). Right-click a price → alert. · Visual: chart capture
with indicator chips; receipt footnote to the drift gate. **Receipt #1 on
homepage.**

**8. The options desk (A): Greeks without the spreadsheet.**
Chain with Black-76 IV/Greeks, PCR, Max Pain; position-level Greeks that
print "3 of 5 legs priced" and warn on Θ-burn vs time value. · Visual: chain
capture (ATM ring) + Greeks panel capture. · Objection: options traders'
"free tools stop at LTP" (02 P2).

**9. Orders that behave like orders (A): the sandbox engine.**
MARKET/LIMIT/SL/SL-M/BO/CO/GTT-OCO · CNC/MIS/NRML · session badge disables
submit when the exchange is shut · refuses orders outside the circuit band or
into a limit lock — with the verdict attached · fills walk the book and pay
square-root impact, ticks round against you · **every rupee of charges**:
brokerage, STT/CTT (never conflated), exchange, SEBI, stamp, GST — computed
by the same engine the backtester uses, to the paisa. · Visual: order-ticket
capture + a charges-breakdown illustration computed by `packages/charges` at
build (06 §3.2). · Objection: "sims lie about fills" (02 P3). **SIM
disclaimer on this act's visuals.**

**10. The risk engine (C): guardrails that don't bluff.**
Eleven checks with explicit SKIPPED honesty · daily/weekly breakers scoped to
the IST session · VaR that refuses to print ₹0 · heat score that discloses
its assumptions · limits you can only tighten mid-session · kill switch that
fails engaged. · Visual: annotated risk-console capture (floor badge, em-dash
components). **Receipt #2: "a check that did not run is not a check that
passed" → engine.py.** · Objection: "can I control risk?"

**11. Automation where it's safe (E): server-side trade management.**
Trailing stops that only ratchet (ATR/percent/Supertrend), regime-aware
widening floored at the initial stop, setup-invalidation exits on bar close,
R-progress alerts, correlation warnings ("Bank Nifty down 0.9% — your
HDFCBANK long is exposed"). All sandbox-side; the live line comes in act 17.
· Visual: trailing-stop timeline diagram over a real chart capture. ·
Objection: "can it automate?" — the honest half.

**12. The AI research firm (B/F): five analysts, one human gate.**
Pipeline diagram: readiness gate → 5 specialist analysts → deterministic
conviction fusion (the model never sets conviction) → CIO sizing (¼-Kelly,
caps) → blocking compliance lint → draft → **a named SEBI-registered analyst
approves or nothing publishes** (status stated honestly pre-registration).
08:45 IST daily SLA with an on-chain miss record. · Visual:
`PipelineDiagram` + report capture with its pinned disclaimer visible. ·
Objection: "another AI grift?" — the gate is the answer.

**13. A track record no one can edit (B): the centerpiece of trust.**
Live `TrackRecordEmbed`: hit rate over triggered calls with Wilson 95% CI,
per-setup and per-conviction, net of the full charge stack, monthly
content-hashed transparency reports; corrections attach, never delete.
Dark-launch state renders the evidence-window progress honestly. · **Receipt
#3: audit chain — hash-linked, DB-trigger-protected, written before
publication.** `TRACK_RECORD` disclaimer adjacent. · Objection: "can I trust
it?"

**14. An assistant that knows its limits (F): AI chat.**
Grounded in published research + education, or silent; "should I buy?" is
refused *before* the model runs — show the refusal as the feature; audit id
under every answer; no buy/sell buttons in the transcript, ever. · Visual:
chat capture including a refusal, AI_CHAT disclaimer visible in-frame. ·
Objection: "does AI mean advice?" — no, structurally.

**15. Backtests that refuse to flatter (D): Strategy Lab.**
Event engine that physically cannot see the future · fills that model queue
pessimism and gap-throughs · walk-forward + embargo, Deflated Sharpe,
parameter plateau, 10k-path Monte Carlo · publishability gate (OOS + costs +
DSR ≥ 0.95 + ≥100 trades) with non-dismissable watermarks · Elite DSL, never
user Python. Tagline direction: *"Your backtest will try to lie to you. Ours
isn't allowed to."* · Visual: lab run capture with watermarks + MC drawdown
distribution. `BACKTEST` disclaimer. · Objection: quants' overfit fatigue
(02 P6).

**16. Know thyself (A): journal & leaderboard.**
Auto-tagged trades (entry/exit, forced exits marked), hold times, closed-
vocabulary emotions — "do I lose money when I'm impatient?" is answerable ·
opt-in pseudonymous leaderboard vs Nifty 50 **TRI** with anti-gaming floors
and consent that takes effect on the next read. · Visual: journal capture +
leaderboard capture. SIM disclaimer.

**17. Beyond stocks (A): full-market coverage.**
F&O, MCX commodities (real lot math, CTT not STT, agri-exempt), currency
derivatives, mutual funds (AMFI NAVs, forward-looking SIP allotment, honest
XIRR). · Visual: `HeatmapTiles` demo (labeled) + MF/SIP capture.

**18. Graduate to live, safely (E): the four gates.**
When you're ready for a real broker: deploy-time flag (off by default; the
admin console can *see* it, not flip it) → versioned DPDP consent → step-up
MFA (15-min TTL) → per-order confirmation that defaults to "no". "AlphaEdge
places no automated live orders — that line keeps you outside SEBI's retail
algo perimeter." No password field exists; a timed-out order is never
retried into a duplicate. Zerodha Kite first; built broker-agnostic. The
readiness checklist is advisory — we never gate your own broker account. ·
Visual: `FourGatesDiagram`. · Objection: "is my money safe?" + "my broker?"

**19. Your data, your rules (E): security & DPDP.**
India-region data · consent per purpose, versioned to exact wording,
append-only · data export and true erasure (with audit tombstones) · session
management with server-side idle timeout · staff in a separate identity
tenant; publishing and stopping are different roles · hash-chained audit in
four services, integrity verified on read. · Visual: quiet fact grid →
`/security`.

**20. Built like it has to be right (D): engineering receipts.**
Integer paise everywhere · one charge engine, one calendar, one indicator
spec, one wire schema · the 49-byte tick contract pinned byte-for-byte in CI
· gates that train on shuffled labels to catch leaks · IaC that refuses
non-India regions. Three-line teaser + link to `/how-its-built` (full §14
table from 01). · Audience: P6/P8/P9 — the section skeptics screenshot.

**21. Pricing (conversion): four tiers, no asterisks.**
`PricingTable` fetched live from the billing catalog + quota rows from one
module; Free leads with "delayed data, full sandbox — free forever" honesty;
Institutional → contact. · Objection: "what does it cost?"

**22. FAQ (conversion): the objection map, verbatim.**
The 02 §4 table rendered as `FaqAccordion` (+ FAQPage JSON-LD): trust,
profitability (the honest no), automation, brokers, safety, beginners,
pros, AI, app stores.

**23. Final CTA + compliance footer.**
CTA band ("Free tier. No card. Virtual money.") over the full footer: risk
disclosure, RA-status line, virtual-money strip, legal links (05 §2, 06 §6).

## 4. Secondary-page briefs

- **/pricing** — act 21 expanded: full quota matrix (01 §2), tier FAQ,
  Razorpay-hosted payment note, "prices include GST", cancel semantics.
- **/track-record** — the embed full-page + methodology ("how we score,"
  from 01 §10: triggered-calls basis, stop-first collisions, net-of-charges,
  Wilson CI) + transparency month list with hashes. All disclaimers.
- **/security** — 06 §6 scope: architecture posture, no-password-by-
  construction, encryption, DPDP rights walkthrough, staff separation,
  responsible disclosure. States what doesn't exist yet (external audit).
- **/how-its-built** — the 01 §14 receipts table with links into the public
  repo docs; the six CI-enforced invariants (root README); the honesty
  design rules as principles. This page is the brand for the P9 skeptic.
- **/live-trading** — act 18 expanded: gate-by-gate walkthrough, SEBI
  Feb-2025 positioning in plain words, Kite specifics (BO→GTT-OCO mapping
  note shown honestly), roster policy per 01 §Open-3.

## 5. Master-prompt 72-section mapping

| Master-prompt sections | Disposition |
|---|---|
| 1–2 Hero, Trusted-by | Acts 1–2 (trust strip = verifiable facts only) |
| 3–5 Why traditional fails / why algo / platform intro | Acts 3–4 (reframed: why *practice*, not why algo — honest per 00 §4) |
| 6 Interactive overview | Act 5 |
| 7 AI engine | Acts 12–14 |
| 8–11 Strategy builders (no/low-code, advanced) | Act 15 (presets = no-code, DSL = low-code; "advanced coding" omitted — no user Python, by security design) |
| 12–15 Paper trading, backtesting, walk-forward, optimizer | Acts 9, 15 ("optimizer" appears only as budget-capped sweeps inside ML — not a user feature; omitted) |
| 16–20 Portfolio/positions/orders/watchlists | Acts 9, 16 + terminal act 5 |
| 21–26 Live data, charts, MTF, indicators, chain, Greeks | Acts 6–8 |
| 27–31 Futures/equity/commodity/currency/multi-exchange | Act 17 |
| 32 Multi-broker | Act 18 (Kite-first honesty) |
| 33–35 Auto/semi/manual trading | Acts 11 + 18 (translation table 00 §4: sandbox automation + gated live) |
| 36–48 AI suggestions/risk/insights, alerts, journal, analytics, reports, drawdown, win rate, Sharpe, profit factor, ROI | Acts 10–16 + track record 13 (ratio metrics appear only inside product surfaces with disclaimers — never as marketing numbers) |
| 49–53 Risk, SL engine, trailing, sizing, allocation | Acts 10–11 (sizing = ¼-Kelly inside recs, act 12) |
| 54–59 Compliance, security, encryption, cloud, HA, scalability | Acts 19–20 (HA/scale claims limited to architecture facts — no SLA numbers, 01 §15) |
| 60–61 APIs, integrations | Act 20 + /pricing Institutional row (keys, webhooks) |
| 62 Mobile | Act 5 device showcase (no app-store claims) |
| 63 Dark mode | Demonstrated by the site itself (theme toggle), not a section |
| 64 Multi-language | **Omitted** — doesn't exist (00 §4) |
| 65–67 Testimonials, success stories, case studies | **Omitted until real**; transparency report is the standing case study (06 §5) |
| 68 Comparison | /pricing + optional homepage variant — fact-rows only, W3 decision |
| 69–72 Pricing, FAQ, final CTA, footer | Acts 21–23 |

## Open questions

1. ~~Comparison table on homepage vs. pricing page only~~ — **resolved
   2026-08-03 (W3): `/pricing` only, and category-based.** The table compares
   *ways of learning* (real money / tips channels / typical simulator /
   AlphaEdge), never named vendors — vendor claims can't be receipted and
   invite the feature-war framing this brand avoids. AlphaEdge cells carry
   claims-ledger ids, enforced at the type level
   (`website/app/src/copy/comparison.ts`). The homepage keeps act 3's prose
   version of the same contrast.
2. Does act 3 cite the SEBI study inline or link a short "why practice"
   page? (Depends on final counsel view of quoting regulator statistics in
   marketing — 06 §7.)
3. `/how-its-built` links "into the public repo docs" — confirm which docs
   (or excerpts) are actually public before linking.
4. Waitlist vs signup copy variants for every CTA instance — enumerate in
   the W2 copy pass (08 §6 dependency).
