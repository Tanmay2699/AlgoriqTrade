/**
 * Homepage copy — one lintable module (website/docs/06 §2: copy lives where
 * `python -m alphaedge_compliance` can scan it; this directory is a declared
 * REG-03 surface). Voice rules are website/docs/02 §5; banned phrasing is
 * 02 §6 + the canonical banned-language list. Claims marked CL-xxx trace to
 * website/docs/claims-ledger.md.
 */

export const HERO = {
  eyebrow: "NSE · BSE · MCX · Currency · Mutual funds",
  title: "The market is real. The money is virtual. The discipline is yours.",
  lede:
    "AlphaEdge is a market-intelligence terminal and paper-trading platform for " +
    "Indian markets. Trade live prices with virtual money, pay every simulated " +
    "rupee of real-world charges, and build your process under an " +
    "institutional-grade risk engine — with AI research that a human analyst " +
    "must approve before anyone sees it.",
  primaryCta: { href: "/waitlist", label: "Join early access" },
  secondaryCta: { href: "/pricing", label: "See pricing" },
} as const;

// Trust strip: verifiable facts only (website/docs/03 act 2). No customer
// logos, no user counts, no awards — none exist, so none render.
export const TRUST_FACTS = [
  "Five market segments: NSE, BSE, MCX, currency derivatives, mutual funds",
  "Built on Microsoft Azure and Azure Databricks",
  "Money is integer paise in code and storage — never a float (CL-002)",
  "Capability claims trace to code and CI checks in our repository (CL-001)",
] as const;

export const PROBLEM = {
  title: "Losing real money is the default way to learn trading.",
  lede:
    "Tips channels sell certainty. Hindsight gurus sell yesterday. Most " +
    "simulators sell fills at prices you would never have got. None of them " +
    "teach the thing that matters: a process — entries you can explain, exits " +
    "you planned, costs you counted, risk you sized before you clicked.",
} as const;

export const ANSWER = {
  title: "Practice on the live market — honestly.",
  lede:
    "A sandbox is only useful if it refuses to flatter you. Ours is built to " +
    "behave like the real thing, including the parts that hurt:",
  bullets: [
    {
      title: "Fills that cost what fills cost",
      body:
        "Orders walk the book and pay market impact; ticks round against you; " +
        "an order outside the trading session or the circuit band is refused, " +
        "not filled. (CL-003)",
    },
    {
      title: "Every rupee of charges",
      body:
        "Brokerage, STT or CTT, exchange transaction charges, SEBI fee, stamp " +
        "duty, GST — computed to the paisa by the same engine our backtester " +
        "uses, so the two can never disagree. (CL-004)",
    },
    {
      title: "A risk engine that doesn't bluff",
      body:
        "Eleven pre-trade checks that report which of them actually ran, " +
        "session-scoped loss breakers, VaR that refuses to print a number it " +
        "cannot compute, and limits you can only tighten mid-session. (CL-005)",
    },
  ],
} as const;

export const CAPABILITIES = {
  title: "And the rest of the desk.",
  lede:
    "Three more modules with the same rule applied: everything here exists " +
    "today, and every sentence has a receipt in our claims ledger.",
  cards: [
    {
      title: "Alerts & watchlists",
      body:
        "Thirteen alert conditions — price, volume, open interest, RSI, MACD " +
        "and Supertrend crossings — indicator rules evaluated on bar close, " +
        "delivered to verified contacts only. Quiet hours exist, and never " +
        "mute a trailing stop-loss or an invalidation exit. (CL-021)",
    },
    {
      title: "Mutual funds & SIPs",
      body:
        "AMFI NAVs with honest gaps, SIP allotment the forward-looking way " +
        "units are actually allotted — never a nearby NAV substituted — and " +
        "an XIRR that returns nothing rather than a guess. (CL-024)",
    },
    {
      title: "Institutional rails",
      body:
        "API keys hashed at rest with two active slots so rotation has no " +
        "downtime, webhooks signed with timestamped HMAC and a retry ladder " +
        "that ends, and organisation seats whose offboarding revokes the " +
        "member's keys in the same call. (CL-025)",
    },
  ],
} as const;

export const REFUSALS = {
  title: "What we will not do",
  lede:
    "The platform enforces these in code, and continuous-integration checks " +
    "keep them true. They are the product.",
  items: [
    "Promise returns, in any wording. Ever.",
    "Auto-trade your live broker account. Every real order requires your " +
      "explicit confirmation — that line is what keeps this outside SEBI's " +
      "retail algo perimeter, and it is not negotiable. (CL-009)",
    "Delete a bad research call. Corrections attach to the published record; " +
      "nothing is rewritten and nothing disappears. (CL-010)",
    "Show you a number we did not compute. When data is missing, the screen " +
      "says so — an empty panel is never dressed up as a quiet market.",
  ],
} as const;

export const FINAL_CTA = {
  title: "Learn the discipline before it costs you.",
  lede:
    "The Free tier is a full sandbox on delayed data with honest charges — " +
    "free, no card required. Paid tiers add real-time data, depth, research " +
    "and the Strategy Lab.",
} as const;
