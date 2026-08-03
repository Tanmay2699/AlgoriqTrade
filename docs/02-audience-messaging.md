# 02 — Audience & Messaging

**Purpose:** Who the site speaks to, what each visitor must feel and learn, the
objection→answer map every section is built from, and the messaging rules that
keep copy premium *and* compliant. 03 assembles these into the page; 06 owns
the legal boundaries this doc writes inside.

**Key decisions**

1. One homepage serves all personas, sequenced beginner-outward: comprehension
   first, depth signals layered in, institutional path split off early via nav.
2. Every persona's pitch is a **capability + its honesty mechanism** pair. The
   guardrails are not fine print; they are the differentiation.
3. The skeptical reader (regulator, journalist, quant) is a first-class
   persona. Copy is written so their read *is* the pitch.
4. No profit language anywhere. The aspiration we sell is **competence**:
   "become a disciplined trader" — never "become a profitable one."

---

## 1. Personas

| # | Persona | They arrive thinking | They must leave knowing | Features that land (inventory refs, 01) |
|---|---|---|---|---|
| P1 | **The learner** — new to markets, F&O-curious, loss-averse | "I'll lose money learning. Tips channels feel scammy." | Practice on the *live* market with virtual money; every cost modeled; risk engine watches you; Simplicity Mode exists | Sandbox, charges engine, margin watch, risk breakers, journal + emotion tags, Simplicity Mode, education-grounded AI chat |
| P2 | **The options/F&O trader** | "Free tools stop at LTP. Greeks/OI analytics cost a fortune." | Full chain with Black-76 IV + Greeks, PCR/Max-Pain/ATM, position-level Greeks with Θ-burn vs time value, OI alerts | svc-options, Greeks panel, OI/indicator alerts, depth20, IV percentile/skew features |
| P3 | **The intraday trader** | "Latency and slippage decide everything; sims lie about fills." | Fills walk the book with impact; MIS auto square-off at 15:15 with leader election; margin call at 80/100%; session-aware order ticket | orders-sim fill engine, tradeability checks, margin watch, market-session badge, conflated real-time fan-out |
| P4 | **The swing/positional trader** | "I want research I can trust, not a Telegram tip." | 08:45 IST daily report: 5 AI analysts + CIO, human RA approval, audit-chained before publication, every call scored net of charges, followed up to its exit | svc-recs pipeline, follow-up state machines, scorecard, transparency reports, trailing-stop engine, R-progress alerts |
| P5 | **The MF/SIP investor** | "Separate app for funds." | AMFI NAV catalog, SIP tracking with forward-looking allotment, honest XIRR | svc-mf |
| P6 | **The algo-curious developer / quant hobbyist** | "Backtests overfit; every platform sells hindsight." | Event-driven engine with no-lookahead context, walk-forward + embargo, Deflated Sharpe, Monte Carlo, publishability gates, watermarks that don't dismiss; a DSL, never arbitrary code | strategy-lab, alphaedge-backtesting, indicators spec (one YAML, three codebases), API keys |
| P7 | **The educator / community leader** | "I need a safe cohort environment." | Sandbox + consent-gated leaderboard (anti-gaming floors) + journal make a teachable loop | leaderboard, journal, sandbox |
| P8 | **Prop desk / institution** | "Retail toy?" | API keys (hashed, rotate w/o downtime), signed webhooks with retry ladders, org seats with offboarding that revokes keys, white-label with non-overridable disclaimers, contractual quotas | billing orgs/apikeys, notify webhooks, Institutional tier |
| P9 | **The skeptic** (SEBI, journalist, quant) | "Another AI-trading grift." | Dark-launch honesty, RA gate, immutable audit chains, REG-03/REG-06 CI lints, track record that publishes losers, kill switch that fails safe | audit chains, compliance package, agent-evals guardrail suite, transparency reports |

## 2. Positioning

**Category:** AI-powered market intelligence & paper-trading platform for
Indian markets.

**Positioning statement (internal):** For Indian traders who want to get
seriously good without getting hurt, AlphaEdge is the terminal where you trade
the live market with virtual money, guarded by an institutional-grade risk
engine, informed by AI research that shows its work — built by people who
believe a platform should never lie to you, and enforce that in CI.

**Headline candidates** (test in W2; all REG-03-clean):

1. *The market is real. The money is virtual. The discipline is yours.*
2. *Practice like it's real. Because it is.*
3. *An institutional-grade practice floor for Indian markets.*
4. *Trade the live market with virtual money — and research that shows its work.*
5. *Serious about markets. Honest about odds.*

**Subhead direction:** name the concrete objects — live NSE/BSE/MCX data,
paper trading with the full Indian charge stack, AI research reviewed by a
SEBI-registered analyst (status stated honestly pre-registration), risk
engine, one price: start free.

## 3. Messaging pillars

Each pillar = claim + mechanism + receipt. Sections in 03 each serve exactly
one pillar.

| Pillar | Claim | Mechanism (what makes it true) | Receipt (verifiable) |
|---|---|---|---|
| **A. Real practice** | Practice on the live market without risking a rupee | Sandbox fills walk the book, refuse untradeable orders (session, circuit band, limit-lock); charges to the paisa incl. CTT/agri/MCX lot math | `packages/charges` test suite; `orders_sim/engine/tradeability.py`; contract-note-accurate charge lines |
| **B. Research with receipts** | Every research call is audited before you see it and scored after | Audit hash chain **before** publication; human RA gate; follow-up state machines; scorecard net of charges, Wilson CIs; monthly content-hashed transparency report; corrections never delete | `svc-recs` audit/scorecard/transparency; `GET /v1/recs/audit` |
| **C. Risk that tells the truth** | The risk engine warns you, blocks you, and never bluffs | Ten pre-trade checks with explicit SKIPPED; VaR refuses ₹0; heat score discloses assumptions; breakers session-scoped; limits tighten-only; exits never blocked | `svc-risk`; `test_risk_gate_agreement.py` |
| **D. Built like a trading system** | One source of truth for every number | One charge engine, one calendar, one indicator spec (TS/Py/YAML compared in CI), one tick wire format pinned by CI, one portfolio math | The six CI-enforced invariants (root README); the `python -m alphaedge_*` gates |
| **E. Safe path to live** | When you graduate to a real broker, safety is structural | Feature flag off by default, versioned DPDP consent, step-up MFA, per-order confirmation; no field a password could occupy; UNKNOWN orders never retried | `svc-broker-bridge`; `idempotency.py`; flags `DEPLOY` class |
| **F. AI with guardrails** | AI that refuses before it misleads | REG-06 classification *before* the model runs; grounded-or-silent chat; agent-eval promotion gates incl. 100% guardrail catch; per-answer audit id | `svc-ai-orchestrator/guardrails.py`; `alphaedge-agent-evals` |

## 4. Objection → answer map

The master prompt's conversion questions, answered the only way we're allowed
to — which happens to be the more convincing way. 03 assigns each to a section.

| Objection | Honest answer | Proof on page |
|---|---|---|
| Can I trust it? | Every claim on this site links to code, a test, or a published record. Research is audited before publication and scored after, losers included | Claims-ledger links; track-record embed; audit-chain diagram |
| Will it make me money? | We will never tell you that. SEBI's own study found most individual F&O traders lose money — that is why practice exists. We publish measured outcomes, net of charges, with confidence intervals | SEBI F&O study citation (verified, 06 §4); TRACK_RECORD disclaimer |
| Can it automate everything? | In the sandbox: trailing stops, invalidation exits, square-off, margin protection. On a live broker: automation is deliberately impossible — you confirm every order. That line is what keeps you outside SEBI's algo perimeter | Four-gates diagram; Module E visuals |
| Can I paper trade first? | Paper trading *is* the product. Live is the graduation, behind four gates | Hero; pricing (Free tier) |
| Does it support my broker? | Zerodha Kite first; adapter architecture for more. We never see your password — there is no field it could go in | Broker section; `BrokerSession` fact |
| Is my money/data safe? | We hold no brokerage money. Sandbox is virtual. Data stays in Indian regions (DPDP); consent is versioned and revocable; leaderboard withdrawal takes effect on next read | Security section; DPDP statement |
| Can I control risk? | Ten pre-trade checks, daily/weekly breakers, VaR, heat score, kill switch — and limits you can only tighten mid-session | Risk console screenshot annotated |
| Can beginners use it? | Simplicity Mode, education-grounded AI chat, closed-vocabulary journal that finds your patterns | Beginner act |
| Can professionals scale with it? | 3,000-instrument real-time budget, depth20, API keys at 10 req/s, signed webhooks, org seats, contractual quotas | Elite/Institutional acts |
| Does it support AI? | A research pipeline with named guardrails, not a chatbot sticker | AI acts (pillars B, F) |
| Why is it not on the app stores? | Phone-shaped responsive shell today; native app on the roadmap. Nothing about the product requires an install | Device showcase |

## 5. Voice & tone

- **Calm authority.** Short declaratives. No exclamation marks. No hype
  adjectives ("revolutionary", "cutting-edge"); the specifics do the work.
- **Numbers carry units and sources.** "₹", paise, IST, p75, bp. A number
  without a receipt doesn't ship (06 §4 claims ledger).
- **Domain vocabulary used correctly**, introduced gently: MIS/CNC/NRML, OI,
  PCR, VaR get a one-line plain-English gloss on first use (tooltip pattern,
  05). Expiry weekdays, session times, charge rates are **never hardcoded in
  copy** — they render from `packages/market-calendar` / `packages/charges`
  exports or are phrased timelessly.
- **First person plural, sparingly.** "We publish every outcome" — yes.
  "We're passionate about democratizing finance" — never.
- **The refusals are features.** Copy is allowed to say what we *don't* do
  (store passwords, auto-trade live, delete bad calls, zero-fill gaps) — that
  is the brand.

## 6. Banned messaging (enforced by REG-03 lint + review)

Guaranteed/assured/target returns · profit promises or income framing ·
"beat the market" · personalized-advice framing ("we tell you what to buy") ·
tips/calls-seller vocabulary ("jackpot", "sure-shot") · urgency & scarcity
("limited seats", countdowns — the in-app nudge policy already bans these;
the site inherits it) · fabricated social proof of any kind · superlatives
without a source ("#1", "India's best") · performance figures outside the
TRACK_RECORD surface and its disclaimer · GMP or any unofficial number without
its mandated "unofficial/unregulated" label · "SEBI-registered" before
registration is granted (dark-launch state says "registration pending").

## Open questions

1. Which headline candidate leads at W2? (Recommend 1, with 3 as the
   institutional-page lead.)
2. Do we name Zerodha/Kite on the homepage or only on the live-trading page?
   (Trademark usage review — 06 §7.)
3. SEBI F&O-study citation: pin the exact figure + year from the primary PDF
   into the claims ledger before any use (06 §4 owns verification).
4. Hindi (and other Indic) messaging is out of scope for launch — revisit when
   an i18n runtime exists platform-wide.
