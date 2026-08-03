/**
 * Glossary content (website/docs/05 §11) — one lintable module, rendered by
 * GlossTerm. Definitions are explanations of market mechanics, written to
 * inform, never to advise: no term is defined in a way that implies a signal
 * to act on, and readouts (PCR, Max Pain, GMP-class numbers) are named as
 * positioning descriptions, not predictions.
 */

export const GLOSSARY = {
  mis: {
    term: "MIS",
    def:
      "Margin Intraday Square-off — an intraday product. Positions not closed by " +
      "the broker's cutoff (~15:15 IST for equities) are squared off automatically.",
  },
  cnc: {
    term: "CNC",
    def:
      "Cash and Carry — the delivery product for equities. You pay in full and the " +
      "shares settle to your account on T+1.",
  },
  nrml: {
    term: "NRML",
    def:
      "Normal margin — the overnight product for futures and options. Positions can " +
      "be carried across sessions against full exchange margin.",
  },
  oi: {
    term: "Open interest (OI)",
    def:
      "The number of derivative contracts currently open. Rising OI with rising price " +
      "is often read as fresh longs; it describes positioning, not the future.",
  },
  pcr: {
    term: "Put-call ratio (PCR)",
    def:
      "Put open interest divided by call open interest, by OI or by volume. A " +
      "positioning readout — extremes are noted, not traded on by themselves.",
  },
  maxPain: {
    term: "Max Pain",
    def:
      "The strike at which option buyers in aggregate would lose the most at expiry. " +
      "A description of where positioning is concentrated, not a forecast.",
  },
  iv: {
    term: "Implied volatility (IV)",
    def:
      "The volatility that makes an option-pricing model match the market price — " +
      "the market's priced-in expectation of movement, extracted per strike.",
  },
  greeks: {
    term: "Greeks",
    def:
      "The sensitivities of an option's price: Delta (to the underlying), Gamma (of " +
      "Delta), Theta (to time), Vega (to volatility), Rho (to rates).",
  },
  black76: {
    term: "Black-76",
    def:
      "The options-pricing model for futures-settled contracts — the standard for " +
      "Indian index and commodity options, which price off futures, not spot.",
  },
  var: {
    term: "Value at Risk (VaR)",
    def:
      "An estimate of how much a portfolio could lose over a horizon at a stated " +
      "confidence level. An estimate with assumptions — which is why ours discloses " +
      "them, and refuses to print when history is too thin.",
  },
  circuitBand: {
    term: "Circuit band",
    def:
      "The exchange's daily price limits (5, 10 or 20%). Orders priced outside the " +
      "band are invalid, and a stock locked at its limit may simply not trade.",
  },
  rMultiple: {
    term: "R",
    def:
      "Risk multiple — profit or loss measured in units of what you risked at entry. " +
      "A +2R trade made twice its planned risk; thinking in R separates process from " +
      "position size.",
  },
  stt: {
    term: "STT",
    def:
      "Securities Transaction Tax — levied on equity and equity-derivative trades. " +
      "MCX commodities pay CTT instead; the two are different statutes and different " +
      "contract-note lines.",
  },
  ctt: {
    term: "CTT",
    def:
      "Commodities Transaction Tax — the commodity-market counterpart of STT, paid on " +
      "non-agricultural MCX contracts. Agricultural contracts are exempt.",
  },
  walkForward: {
    term: "Walk-forward",
    def:
      "Backtesting in rolling windows: fit parameters on one period, test on the " +
      "next, repeat. The out-of-sample stitches are the honest part of the curve.",
  },
  deflatedSharpe: {
    term: "Deflated Sharpe",
    def:
      "A Sharpe ratio corrected for how many strategy variants were tried. Search a " +
      "thousand configurations and the best backtest looks brilliant by luck alone — " +
      "deflation prices that in.",
  },
  tri: {
    term: "Total Return Index (TRI)",
    def:
      "An index with dividends reinvested. Benchmarks against the price-only index " +
      "flatter a strategy by the dividend yield, so comparisons here use TRI.",
  },
  gtt: {
    term: "GTT",
    def:
      "Good Till Triggered — a standing instruction that places an order when a " +
      "price condition is met, valid until it fires or you cancel it.",
  },
} as const;

export type GlossKey = keyof typeof GLOSSARY;
