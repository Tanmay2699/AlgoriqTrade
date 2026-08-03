/**
 * Deep-act copy (homepage acts 5–13, 18, 20 of website/docs/03 §3) — one
 * lintable module, claims annotated with ledger ids (claims-ledger.md).
 * Numbers here are facts about the codebase, not market outcomes; anything
 * that could read as a performance figure belongs to the track-record embed
 * (W3) and its disclaimer, never to this file.
 */

import type { Step } from "@/components/steps";
import type { StatTileProps } from "@/components/stat-tile";
import type { SectorTile } from "@/components/heatmap-tiles";

export const CHARTS_ACT = {
  eyebrow: "Charts & indicators",
  title: "The alert fires on the line you saw.",
  lede:
    "Thirty indicators are declared once, in one canonical spec. The chart's " +
    "Web Worker, the alert engine, and the backtester each implement that " +
    "spec — and a CI test computes all three and fails if any two disagree. " +
    "An alert on a Supertrend(10, 3) flip fires on exactly the line the " +
    "chart drew. (CL-006)",
  families: [
    { name: "Trend", items: "SMA, EMA, WMA, HMA, Supertrend, Ichimoku, PSAR, ADX" },
    { name: "Momentum", items: "RSI, MACD, Stochastic, CCI, Williams %R, ROC, TRIX, Aroon" },
    { name: "Volatility & bands", items: "ATR, Bollinger, Keltner, Donchian, StdDev" },
    { name: "Volume & flow", items: "VWAP, OBV, MFI, CMF" },
    {
      name: "Market structure (server-side)",
      items: "Max Pain, PCR, IV percentile, volume profile, delivery %",
    },
  ],
} as const;

export const TERMINAL_ACT = {
  eyebrow: "The workspace",
  title: "One terminal, first week to power user.",
  lede:
    "The Command Center is a dockable workspace: arrange panels, save the " +
    "layout, and link chart, chain and depth into groups that follow one " +
    "symbol together. Below 1024 pixels the same panels recompose into " +
    "Simplicity Mode — one registry, two compositions, nothing dumbed down. " +
    "(CL-027)",
  bullets: [
    {
      title: "Linked panels",
      body:
        "Assign panels to group A, B or C and a symbol change in one flows " +
        "to the rest — the chart, the option chain and the depth ladder stay " +
        "on the same story.",
    },
    {
      title: "Ctrl-K for everything",
      body:
        "One palette for navigation, symbols and actions, keyboard-complete. " +
        "A recognised order phrase pre-fills the ticket for your review.",
    },
    {
      title: "Voice that cannot submit",
      body:
        "The voice grammar's output has prefill fields and no submit — " +
        "“buy 10 Reliance” fills a ticket you still have to confirm. That is " +
        "a property of the parser's type, not a setting.",
    },
  ],
} as const;

export const DATA_ACT = {
  eyebrow: "Live market data",
  title: "The feed you can afford to trust.",
  lede:
    "Real-time WebSocket fan-out with the honesty stated per tier — including " +
    "the Free tier's delay, which we treat as a disclosure, not a secret. " +
    "(CL-028)",
  bullets: [
    {
      title: "Free is honestly delayed",
      body:
        "Fifteen-minute delayed quotes, said twice: a badge in the interface " +
        "and a watermark drawn onto the chart canvas itself — because a badge " +
        "you can crop out of a screenshot is not a disclosure.",
    },
    {
      title: "One socket per browser",
      body:
        "A shared worker owns the connection; every tab subscribes through " +
        "it. Ten tabs cost one socket — and count once against your " +
        "subscription limit.",
    },
    {
      title: "Paint now, tick after",
      body:
        "Subscribing delivers the last known values immediately, then the " +
        "stream takes over. No panel sits empty waiting for the next trade " +
        "to happen.",
    },
    {
      title: "Depth by tier",
      body:
        "Five-level order book on Pro, the top-20 book on Elite — conflated " +
        "to a steady cadence so a fast market stays readable.",
    },
  ],
} as const;

export const OPTIONS_ACT = {
  eyebrow: "The options desk",
  title: "A chain that shows its work.",
  lede:
    "Every strike priced with Black-76 implied volatility and Greeks, PCR by " +
    "OI and by volume, Max Pain, and OI build-up shading — one computation " +
    "serving every viewer. On your own book, unpriceable legs are named and " +
    "excluded, never written as zeros: a zero delta beside a real holding " +
    "would be a claim of no exposure.",
} as const;

export const COSTS_ACT = {
  eyebrow: "The sandbox engine",
  title: "Every rupee of the real cost stack.",
  lede:
    "The sandbox charges the full Indian stack on every executed order — " +
    "computed by the same engine the backtester and the ML cost controls " +
    "import, so no two surfaces can disagree to the paisa. Here is one " +
    "₹1,00,000 intraday round trip, computed by that engine: (CL-004)",
  tableCaption:
    "Illustration computed by packages/charges at build time — FY26 rate " +
    "schedule, NSE equity intraday (MIS), ₹1,00,000 notional per side. When " +
    "rates change, this table is regenerated, never edited.",
  commodityNote:
    "MCX commodities pay CTT, not STT — a different statute and a separate " +
    "contract-note line — and agricultural contracts are CTT-exempt. The " +
    "engine models all of it, with real lot sizes: one CRUDEOIL lot is 100 " +
    "barrels, and turnover math that forgets that is wrong by 100×.",
} as const;

export const RISK_ACT = {
  eyebrow: "Risk management",
  title: "A risk engine that tells you what it didn't check.",
  lede:
    "Before an order is accepted, eleven evaluations run — and the response " +
    "reports each one as passed, warned, or explicitly skipped with its " +
    "reason. A check that did not run is not a check that passed. (CL-005)",
  bullets: [
    {
      title: "Eleven evaluations per order",
      body:
        "Kill switch, daily and weekly loss breakers, order size, instrument " +
        "and sector concentration, gross exposure, margin utilisation, " +
        "open-order runaway guard, the exchange circuit band, and a " +
        "portfolio heat warning.",
    },
    {
      title: "Exits are never blocked",
      body:
        "Reduce-only orders are exempt from our own limits. You are never " +
        "trapped in a losing position by the policy that exists to protect " +
        "you.",
    },
    {
      title: "VaR that refuses to guess",
      body:
        "A book without enough return history gets a refusal with the " +
        "reason — never ₹0, the most dangerous number a risk page could " +
        "print. Symbols it cannot cover are named, with the exposure behind " +
        "them.",
    },
    {
      title: "Limits you can only tighten",
      body:
        "Mid-session, your own limits move one way: down. A limit you could " +
        "raise at the moment you most want it gone is not a limit.",
    },
  ],
} as const;

export const AUTOMATION_ACT = {
  eyebrow: "Automation where it's safe",
  title: "Trade management that works while your laptop is closed.",
  lede:
    "Sandbox positions are managed server-side — and every rule below emits " +
    "alerts and sandbox orders only. What it takes to reach a real broker is " +
    "the four-gate story further down. (CL-019)",
  bullets: [
    {
      title: "Stops that only ratchet",
      body:
        "Trailing stops in three modes — ATR, percent, Supertrend — that " +
        "move one way. The tighten-only rule is a code path, not a promise: " +
        "a widening amendment is simply never written.",
    },
    {
      title: "Regime-aware, floored",
      body:
        "When volatility regime shifts, stop parameters adapt — but never " +
        "below the stop you started with. The floor is your initial risk, " +
        "clamped in code.",
    },
    {
      title: "Invalidation exits on bar close",
      body:
        "Every setup carries the condition that falsifies it. When the bar " +
        "closes against that condition, the position exits — holding and " +
        "hoping is not a state the machine has.",
    },
    {
      title: "Warnings that name the exposure",
      body:
        "R-progress alerts as a trade crosses risk milestones, and " +
        "correlation warnings in plain words — “Bank Nifty down 0.8% — your " +
        "HDFCBANK long is exposed.” Events, never commands.",
    },
  ],
} as const;

export const RESEARCH_ACT = {
  eyebrow: "AI research",
  title: "Five analysts, one human gate.",
  lede:
    "The daily pre-market report is produced like a desk, not a chatbot — " +
    "and it cannot reach you without a named, registered human approving it. " +
    "(CL-007) Research publication awaits our SEBI Research Analyst " +
    "registration: the pipeline below runs today; publication stays gated " +
    "until then.",
  steps: [
    {
      title: "Readiness gate",
      body: "Six data probes run first. Missing core data aborts the run; a degraded feed drops its sections and caps conviction.",
    },
    {
      title: "Five analysts",
      body: "Technical, fundamental, sentiment, sector and quant specialists independently score a screened universe.",
    },
    {
      title: "Deterministic fusion",
      body: "Conviction is computed by code from the panel's scores. The model never assigns its own conviction.",
    },
    {
      title: "CIO sizing",
      body: "Risk-first position sizing — quarter-Kelly, capped at 10% per stock and 30% per sector.",
    },
    {
      title: "Blocking compliance lint",
      body: "Banned language, stops on the correct side, targets in order, risk-reward recomputed, maximum loss always defined.",
    },
    {
      title: "Human approval",
      body: "A registered research analyst approves, vetoes, or drops calls. Publishing without that approval is not possible in the system.",
    },
    {
      title: "Audit chain",
      body: "Every step lands on a hash-linked, append-only record before anything is served. (CL-010)",
    },
    {
      title: "Scored, either way",
      body: "Every published call is followed to its exit and scored net of the full charge stack — losers included.",
    },
  ] satisfies readonly Step[],
} as const;

export const TRACK_RECORD_ACT = {
  eyebrow: "Transparency",
  title: "A track record no one can edit.",
  lede:
    "When publication begins, every call's outcome is measured by replaying " +
    "it through the same state machine that tracked it live: hit rate over " +
    "triggered calls with a 95% confidence interval, net of charges, broken " +
    "down by setup and by conviction, published monthly under a content " +
    "hash anchored to the audit record. Corrections attach; nothing is " +
    "deleted. (CL-010)",
  statusTitle: "Status today: dark launch.",
  statusBody:
    "The pipeline is accumulating its evidence window and nothing is " +
    "published — which is why this site shows no performance figures at " +
    "all. When the record exists, it appears here. Whatever it says.",
} as const;

export const AI_CHAT_ACT = {
  eyebrow: "AI that knows its limits",
  title: "“Should I buy?” is refused before the model runs.",
  lede:
    "The assistant answers from published research and curated education, or " +
    "it declines. A deterministic classifier runs ahead of the model, so a " +
    "personal-advice question costs no tokens and gets no improvisation — " +
    "and every answer and every refusal lands on a hash-chained audit log " +
    "with its id shown under the reply. There are no buy or sell buttons in " +
    "a chat transcript; acting is always a separate, explicit step. (CL-026)",
  // Quoted whole since refusals.yaml v1.1 (2026-08-03): the product copy no
  // longer characterises registration status, so nothing needs eliding.
  refusalLabel:
    "The refusal, word for word as it ships in the assistant's own copy:",
  refusalQuote:
    "I can't answer that one, because it asks what you should do. AlphaEdge " +
    "exists to publish research, not to advise individuals — whether a " +
    "trade suits you depends on your objectives, your finances and your " +
    "risk tolerance, none of which I know or am permitted to assess. What " +
    "I can do is show you what the published research says about a symbol, " +
    "including its levels, its assumptions and what would invalidate it, " +
    "or explain how something works so you can judge it yourself.",
} as const;

export const LAB_ACT = {
  eyebrow: "Strategy Lab",
  title: "Your backtest will try to lie to you. Ours isn't allowed to.",
  lede:
    "The Lab treats a flattering result as a bug. Every run pays the full " +
    "charge stack, and the validation stack exists to take your best number " +
    "away from you until it has earned publication. (CL-008)",
  bullets: [
    {
      title: "Walk-forward, with an embargo",
      body:
        "Parameters fit on one window are tested on the next, with an " +
        "embargo gap between them — the out-of-sample stitches are the only " +
        "part of the curve we take seriously.",
    },
    {
      title: "Deflated Sharpe & plateau",
      body:
        "The Sharpe ratio is corrected for how many variants you tried, and " +
        "a parameter-plateau check asks whether neighbours of your best " +
        "configuration also work — or whether you found a spike of luck.",
    },
    {
      title: "Ten thousand Monte-Carlo paths",
      body:
        "Trade order is resampled to a drawdown distribution, so you meet " +
        "the losing streak your strategy contains before the market " +
        "introduces you.",
    },
    {
      title: "Watermarks you cannot dismiss",
      body:
        "A result that hasn't passed out-of-sample, cost, Deflated-Sharpe " +
        "and trade-count gates renders with a non-dismissable watermark. " +
        "The gate is the feature.",
    },
  ],
} as const;

export const JOURNAL_ACT = {
  eyebrow: "Know thyself",
  title: "A journal that answers the questions you'd rather not ask.",
  lede:
    "Every sandbox trade is journaled automatically and honestly: entries " +
    "and exits tagged by what the order actually did to your position, wins " +
    "and losses counted net of charges, forced exits marked with their " +
    "reason, hold times left blank when unknowable — never zero. Emotions " +
    "come from a closed vocabulary, so “do I lose money when I'm impatient?” " +
    "stops being rhetorical. (CL-022)",
  leaderboard: {
    title: "The leaderboard is opt-in, pseudonymous, and hard to game",
    body:
      "Names are HMAC pseudonyms, the benchmark is the NIFTY 50 total-return " +
      "index, and no one appears without twenty closed trades and thirty " +
      "active days. Withdraw consent and the very next read excludes you. " +
      "(CL-023)",
  },
} as const;

export const SECURITY_ACT = {
  eyebrow: "Your data, your rules",
  title: "Security posture, stated plainly.",
  lede:
    "The full page states what exists, what is planned, and what we refuse " +
    "to build — here is the shape of it.",
  facts: [
    {
      title: "No broker passwords, by construction",
      body:
        "The broker-session model has no field a password could occupy, and " +
        "a scanner refuses any payload carrying one. (CL-009)",
    },
    {
      title: "Broker tokens envelope-encrypted",
      body:
        "AES-256-GCM under a Key Vault key, bound to their database row, " +
        "with rotation built in — and production refuses to boot with the " +
        "dev cipher. (CL-031)",
    },
    {
      title: "Sessions time out server-side",
      body:
        "Thirty minutes idle and the session is revoked at the server — not " +
        "a client timer a stale tab forgets to run. (CL-029)",
    },
    {
      title: "Staff are not users",
      body:
        "Staff authenticate against a separate directory, and the role that " +
        "publishes research is not the role that operates the platform. " +
        "(CL-030)",
    },
    {
      title: "India-only, private by default",
      body:
        "Infrastructure checks refuse non-India regions and public network " +
        "access — 52 of them, on every change. (CL-013)",
    },
    {
      title: "Four hash-chained audit logs",
      body:
        "Research, risk, billing and AI chat each write an append-only " +
        "chain whose integrity is re-verified on read. (CL-017)",
    },
  ],
} as const;

export const COVERAGE_ACT = {
  eyebrow: "Coverage",
  title: "Five segments, one desk.",
  lede:
    "NSE and BSE equities and derivatives, MCX commodities with real " +
    "contract lot math, currency derivatives, and AMFI mutual funds with " +
    "SIP tracking — in one terminal, under one risk engine.",
  heatmapLabel:
    "Simulated sector data for illustration — the product's heatmap reads " +
    "live constituents and shows its coverage on every payload.",
  sectors: [
    { name: "IT", bps: 82 },
    { name: "Banks", bps: -34 },
    { name: "Auto", bps: 51 },
    { name: "Pharma", bps: 12 },
    { name: "FMCG", bps: -8 },
    { name: "Metals", bps: -61 },
    { name: "Energy", bps: 27 },
    { name: "Realty", bps: 104 },
  ] satisfies readonly SectorTile[],
} as const;

export const LIVE_ACT = {
  eyebrow: "Graduate to live",
  title: "When you're ready for a real broker: four gates.",
  lede:
    "Paper is the product; live is the graduation. A real order can only " +
    "leave AlphaEdge through four gates, checked together so none can be " +
    "skipped — and each refusal names the gate that stopped it. (CL-009)",
  steps: [
    {
      title: "Deployment flag",
      body: "Live trading is off by default in every deployment. The admin console can display the switch; it cannot flip it.",
    },
    {
      title: "Versioned consent",
      body: "You consent to specific wording. If the wording changes, prior consent is invalid and you are asked again.",
    },
    {
      title: "Step-up authentication",
      body: "A fresh second factor with a fifteen-minute lifetime. Recent is the point.",
    },
    {
      title: "Your confirmation, every order",
      body: "No automated live orders, ever. The confirmation defaults to absent, so an integration that forgets to ask is refused.",
    },
  ] satisfies readonly Step[],
  footer:
    "Zerodha Kite is the first adapter, built broker-agnostic. Your broker " +
    "password has nowhere to live in our system — the session model has no " +
    "field for one, and a scanner refuses any payload that carries one.",
} as const;

export const ENGINEERING_ACT = {
  eyebrow: "How it's built",
  title: "Built like it has to be right.",
  lede:
    "The honesty on this page is not a tone of voice; it is enforced. These " +
    "numbers describe the codebase, and the checks behind them run on every " +
    "change.",
  stats: [
    {
      value: "49 bytes",
      label: "The tick wire contract",
      sub: "Producer and consumer share one struct; CI pins the exact bytes of a golden frame. (CL-011)",
      kind: "measured",
    },
    {
      value: "30",
      label: "Indicators, one spec",
      sub: "Chart, alerts and backtester compared by a drift gate on every change. (CL-006)",
      kind: "measured",
    },
    {
      value: "11",
      label: "Pre-trade risk evaluations",
      sub: "Each reports passed, warned, or skipped-with-reason. (CL-005)",
      kind: "measured",
    },
    {
      value: "52",
      label: "Infrastructure checks",
      sub: "India-only regions, private network access, audit-before-publish ordering, a deploy freeze on trading days. (CL-013)",
      kind: "measured",
    },
    {
      value: "8",
      label: "Adversarial researcher failures",
      sub: "Injected on every CI run — banned language, hallucinated tickers, wrong-side stops. All eight must be caught. (CL-015)",
      kind: "measured",
    },
    {
      value: "4",
      label: "Hash-chained audit logs",
      sub: "Research, risk, billing and AI chat — integrity re-verified on every read. (CL-017)",
      kind: "measured",
    },
  ] satisfies readonly StatTileProps[],
} as const;
