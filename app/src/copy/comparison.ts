/**
 * Comparison content (website/docs/03 §Open-1, resolved 2026-08-03): the
 * table compares *ways of learning to trade*, not named competitors — naming
 * vendors invites feature-war framing and claims about others we cannot
 * receipt. Category cells are generic descriptions of a pattern; every
 * AlphaEdge cell carries a claims-ledger id, enforced by the component's
 * types. Lintable module (REG-03 surface).
 */

export interface CategoryCell {
  text: string;
}

export interface OursCell {
  text: string;
  /** Claims-ledger id — the type makes an unreceipted fact cell unrepresentable. */
  claim: `CL-${number}`;
}

export interface ComparisonRow {
  label: string;
  liveMoney: CategoryCell;
  tips: CategoryCell;
  simulator: CategoryCell;
  alphaedge: OursCell;
}

export const COMPARISON = {
  title: "What you're actually comparing",
  lede:
    "Not vendor against vendor — way against way. There are four common paths to " +
    "learning the market; here is what each one charges you, and what it teaches.",
  columns: [
    "Learning with real money",
    "Tips channels",
    "A typical simulator",
    "AlphaEdge",
  ],
  rows: [
    {
      label: "How orders fill",
      liveMoney: { text: "The real fill — learned at market prices." },
      tips: { text: "Someone else's entry, usually after the move." },
      simulator: { text: "Commonly instant, at the last traded price." },
      alphaedge: {
        text: "Walks the book, pays impact, ticks round against you; refused outside the session or circuit band.",
        claim: "CL-003",
      },
    },
    {
      label: "What trading costs",
      liveMoney: { text: "Every rupee, itemised on your contract note." },
      tips: { text: "Not part of the pitch." },
      simulator: { text: "Commonly omitted entirely." },
      alphaedge: {
        text: "The full Indian charge stack to the paisa — the same engine our backtester imports.",
        claim: "CL-004",
      },
    },
    {
      label: "Risk control",
      liveMoney: { text: "Whatever discipline you impose on yourself." },
      tips: { text: "A stop-loss in a message, if that." },
      simulator: { text: "Rarely modelled at all." },
      alphaedge: {
        text: "Eleven pre-trade checks that report what actually ran, and limits you can only tighten mid-session.",
        claim: "CL-005",
      },
    },
    {
      label: "Accountability",
      liveMoney: { text: "Your P&L — visible to you alone." },
      tips: { text: "Wins get reposted; losses quietly vanish." },
      simulator: { text: "No record that anything happened." },
      alphaedge: {
        text: "Every research call scored to its exit, losers included, on a record corrections attach to and no one edits.",
        claim: "CL-010",
      },
    },
    {
      label: "What you build",
      liveMoney: { text: "Experience — at whatever the market charges for it." },
      tips: { text: "Dependence on the next message." },
      simulator: { text: "Habits real fills and real charges will not honour." },
      alphaedge: {
        text: "A process: entries you can explain, exits you planned, costs you counted, risk you sized before you clicked.",
        claim: "CL-005",
      },
    },
  ] satisfies readonly ComparisonRow[],
  footnote:
    "Category columns describe common patterns, not any specific product. Every " +
    "AlphaEdge cell cites our claims ledger, which maps it to the code and CI checks " +
    "that keep it true.",
} as const;
