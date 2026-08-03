# 00 — Website Brief

**Purpose:** Define what the AlphaEdge marketing website is, what success looks
like, and the hard constraints every later doc inherits. This is the contract
between the "world-class algorithmic trading platform website" ambition and the
regulated, honesty-enforced product this repo actually builds.

**Key decisions**

1. The site sells **discipline and transparency**, not profits. Profit claims
   are both illegal for us (SEBI RA framing, REG-03) and off-brand; the
   product's differentiator — honesty enforced in code — *is* the premium story.
2. The site is a **standalone Next.js app in `website/`**, replacing
   `apps/web (marketing)` at cutover; it consumes platform sources of truth
   (billing catalog, disclaimer registry, transparency API) and fabricates
   nothing.
3. The hero and all "live" visuals run on **labeled replayed or simulated
   data** — anonymous visitors can never receive real market data (the signup
   wall is a licensing and abuse control, docs/11 §8), and unlabeled fake data
   is banned by working rule 1.
4. **Dark-first, terminal-grade aesthetic** with a light theme; Apple-keynote
   scroll pacing; zero third-party scripts; Lighthouse ≥ 95 with 100 as target
   (docs/10 §8.1 sets ≥ 95 for marketing).
5. Launch copy assumes **pre-RA-registration dark launch**: the research
   product is described, the track-record surface is wired, and publication
   status is stated honestly ("registration pending" state) until the RA gate
   opens (CLAUDE.md guardrail 3).

---

## 1. Mission

Build the public website for AlphaEdge that:

- **Educates** — a first-time visitor understands, within one scroll, what
  AlphaEdge is: an AI-powered market intelligence terminal and paper-trading
  platform for Indian markets (NSE, BSE, MCX, currency derivatives, mutual
  funds) where you practice on live data with virtual money.
- **Demonstrates** — every major capability is *shown*, not asserted: the
  terminal, charts, option chain, order ticket, risk console, AI research
  report, strategy lab. Real screenshots, replayed data, honest labels.
- **Converts** — a retail trader starts a free sandbox account; an options/algo
  trader sees the Pro/Elite depth; an institution finds the API/webhook/seat
  story and a contact path. Every scroll answers the next objection before it
  is asked.
- **Withstands scrutiny** — a SEBI reviewer, a journalist, or a quant reading
  the site finds nothing they can falsify. Every claim has a receipt.

The site must feel like it belongs to a serious financial-technology firm —
Bloomberg's authority, TradingView's clarity, Stripe's restraint — while being
recognizably Indian-market-native (IST sessions, ₹ and paise, NSE/BSE/MCX,
Indian charge stack) and recognizably *ours*: the platform that refuses to lie.

## 2. What AlphaEdge actually is (one paragraph the whole site serializes)

A real-time market terminal (WebSocket fan-out, tier-gated live/delayed data,
charts with 30 CI-verified indicators, option chain with Black-76 Greeks,
heatmap/breadth/movers/FII-DII flows), a **sandbox trading engine** that fills
orders against realistic rules and charges every rupee of the Indian charge
stack (brokerage, STT/CTT, exchange txn, SEBI fee, stamp duty, GST — to the
paisa), a **risk engine** (ten pre-trade checks, VaR, heat score, breakers,
kill switch), server-side **trade management** (trailing stops, invalidation
exits, R-progress alerts), a **multi-agent AI research pipeline** (5 analysts +
CIO on LangGraph/Claude via Databricks) whose every output is audit-chained
before publication and gated behind a human SEBI Research Analyst, a public
**track record** scored net of charges with Wilson confidence intervals, a
**strategy lab** with a validated backtesting engine (walk-forward, embargo,
Deflated Sharpe, Monte Carlo, publishability gates), **mutual funds** (AMFI
NAVs, SIP tracking, XIRR), and a hard-gated **Graduate-to-Live** broker bridge
(feature flag off by default, versioned DPDP consent, step-up MFA, per-order
manual confirmation). Monetized Free/Pro/Elite/Institutional via Razorpay.

## 3. Success criteria

| Dimension | Bar |
|---|---|
| Comprehension | A cold visitor can answer "what is it, who is it for, what does it cost, is it safe" after the homepage alone |
| Conversion | Primary CTA (free sandbox signup / early access) present in hero, sticky nav, and final act; every section advances one objection |
| Credibility | Zero falsifiable claims; every number sourced (claims ledger); compliance lint green |
| Craft | Lighthouse ≥ 95 all four categories on `/` and `/pricing` (target 100); WCAG 2.2 AA; flawless 320 px → 4K |
| Performance | LCP ≤ 1.5 s p75 4G on `/` (tighter than the terminal's 2.0 s, because this page is static); zero layout shift on hero |
| Longevity | Pricing, tier limits, disclaimers, and track record render from live sources — the site cannot drift from the product |

## 4. The translation table (master prompt → AlphaEdge reality)

The commissioning prompt describes a generic "algorithmic trading platform."
AlphaEdge is a *regulated Indian paper-trading and research platform with a
gated live bridge*. Where the prompt and reality diverge, reality wins — and in
every case the honest version is the stronger story. This table is binding on
all copy and design work.

| Master-prompt ask | AlphaEdge reality | Site treatment |
|---|---|---|
| "Why it is more profitable" | Profit claims are banned (REG-03; SEBI RA norms). We publish a measured track record net of charges, with CIs, including losers | Sell **transparency**: "every call scored, net of every charge, published either way." Never profitability |
| "Auto Trading" | Live auto-trading is deliberately impossible: per-order manual confirmation keeps us outside SEBI's Feb-2025 retail algo perimeter (CLAUDE.md guardrail 4). Automation is real **in the sandbox**: trailing-stop engine, invalidation exits, MIS auto square-off, margin watch | "Automation where it's safe, confirmation where it's real." Sandbox automation shown fully; live path shown as the four gates — as a *feature* |
| "Trusted by millions / testimonials / awards / institutional partners" | Pre-launch; none exist | Omit. Trust strip carries what is true: exchange/segment coverage, Azure + Databricks stack, audit-chain architecture, CI gate count. Testimonial slots exist in the design system, dormant until real (06 §5) |
| "Live market widgets" in hero | Anonymous real-time data is prohibited (licensing + abuse control, docs/11 §8) | Replay engine: a recorded or deterministic simulated session, visibly labeled ("Simulated feed" / "Recorded session, {date}"), driven by the same wire format the product uses |
| "Multi-Broker Support" | One adapter today: Zerodha Kite (reference implementation); adapter interface designed for more | "Built broker-agnostic. Zerodha Kite first." No logo wall of unintegrated brokers |
| "Multi-language" | No i18n runtime | Do not claim. English at launch; note in roadmap doc only |
| "AI Strategy Generator / AI everything" | Real AI surface: 5-analyst research pipeline, guarded AI chat (REG-06 pre-model refusal, grounded-or-silent), ML ranker behind promotion gates | Present AI as the platform's *research discipline*, with its guardrails as first-class features. Claim only what ships |
| "100 Lighthouse" | docs/10 pins marketing ≥ 95 (RUM is the real SLO) | Budget ≥ 95 enforced in CI; engineer toward 100; never trade honesty (e.g., real screenshots) for score |
| "Platform comparison" table | Fine if factual | Feature-fact comparison against named categories (broker terminals, charting tools, tipsters) — verifiable rows only, no competitor bashing |
| "Success stories / case studies" | None yet | Replaced at launch by the **transparency report** story: the monthly content-hashed report is our case study |
| Mobile apps (Android/iPhone) | Responsive web with phone-shaped shell (44 px targets, tab bar); React Native planned (E4.1) | Show real responsive captures on device frames. "Works in your browser, everywhere" — no app-store badges until real |
| "Institutional trading desk visuals" (stock imagery) | — | No stock photography of trading floors. The product *is* the visual |

## 5. Audience (summary — full personas in 02)

Primary: Indian retail traders (beginner → serious F&O), options/intraday/swing
specialists, algo-curious developers and quant hobbyists, finance educators.
Secondary: prop desks and small institutions (API keys, webhooks, seats,
white-label), broker partnership prospects, and — always reading over our
shoulder — SEBI, journalists, and skeptical quants. The site is written so the
skeptics' read *is* the pitch.

## 6. Non-goals

- Not a docs portal (the engineering suite stays in `docs/`); the site links a
  public "How it's built" page instead of duplicating it.
- Not a blog/CMS at launch (structure reserves the route).
- No A/B testing infrastructure, chat widgets, or third-party marketing pixels
  at launch — they conflict with the zero-third-party-script budget and DPDP
  posture (07 §6).
- No paid-acquisition landing-page variants until the core site ships.

## 7. Relationship to the existing `apps/web (marketing)` group

`apps/web/src/app/(marketing)/` (landing + billing-fed pricing) remains the
served surface until this site passes its launch gates; then Front Door routes
the public hostname here, the `(marketing)` group becomes a redirect, and the
removal lands as a recorded cutover (08 §5). The one rule carried over
unchanged: pricing is fetched from `svc-billing` per request/revalidation —
never baked into the page.

## Open questions

1. Hero data source: recorded real session (needs a captured tick log + rights
   review of showing exchange data, even delayed/recorded) vs. the synthetic
   dev feed (zero rights risk, visibly artificial). Leaning: synthetic at
   build, clearly labeled "simulated feed", swap to recorded replay after
   vendor-licence review. Decide in 03 before hero build.
2. Signup CTA depends on Entra External ID landing (identity is dev-stubbed
   today; the auth stub refuses prod). Until then the CTA is "Join early
   access" (email capture, DPDP-consented). Confirm sequencing with E-phase
   identity work. **Sink status (verified 2026-08-03, W4):** no durable,
   contract-compatible intake exists anywhere in the platform — svc-notify's
   contacts API is user-scoped and its store is in-process memory, so wiring
   `WAITLIST_SINK_URL` to it would silently lose addresses on restart (the
   exact bug the endpoint refuses to commit). The form stays in its honest
   refusing state until a durable anonymous intake ships; requirements and
   routing recorded in docs/18 §"Findings routed from the website build"
   item 5. **Update (2026-08-03, later the same day):** that intake now
   exists — svc-notify `POST /v1/notify/waitlist`, durable via Postgres +
   alembic, anonymous, purpose-limited, refusing in prod without a database
   so it can never silently lose an address. Wiring is now a deploy act, not
   missing machinery: set `WAITLIST_SINK_URL` in the deploy that provisions
   svc-notify's `database-url` secret (the values files document the
   pairing). The CTA-sequencing half of this question — real signup vs.
   email capture — still waits on Entra External ID.
3. Public hostname + Front Door routing split (`/` → website, `/terminal` →
   apps/web) — needs a docs/12 addendum when infra work starts.
4. Does the transparency/track-record page live on the website (public, SEO)
   or the terminal (current: terminal, all tiers)? Leaning: website renders the
   same API read-only for SEO + scrutiny; terminal keeps the interactive view.
