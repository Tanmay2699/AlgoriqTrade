// GENERATED FILE — do not edit.
//
// Source of truth: packages/compliance/src/alphaedge_compliance/data/disclaimers.yaml
// Regenerate: pnpm --filter @alphaedge/website gen:disclaimers
// CI freshness: pnpm --filter @alphaedge/website check:disclaimers
//
// Wording is canonical and compliance-owned; every surface renders these by id
// and never rewords them (website/docs/06 §1).

export type DisclaimerKey = "RESEARCH_FULL" | "RESEARCH_SHORT" | "SIM" | "BACKTEST" | "TRACK_RECORD" | "AI_CHAT";

export interface DisclaimerEntry {
  id: string;
  version: string;
  text: string;
}

export const PINNED_REPORT_DISCLAIMER: DisclaimerKey = "RESEARCH_FULL";

export const DISCLAIMERS: Record<DisclaimerKey, DisclaimerEntry> = {
  RESEARCH_FULL: {
    id: "DISC-RESEARCH-FULL",
    version: "1.2",
    text: "AI-assisted research reviewed and approved by {ra_name}, SEBI Registered Research Analyst, Registration No. {ra_reg_no}. Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. This report is for informational purposes only and is not investment advice; it does not consider your investment objectives, financial situation, or needs. Investment in securities market are subject to market risks. Read all the related documents carefully before investing.",
  },
  RESEARCH_SHORT: {
    id: "DISC-RESEARCH-SHORT",
    version: "1.1",
    text: "AI-generated research reviewed by {ra_name} (SEBI RA No. {ra_reg_no}). Not investment advice. Securities markets are subject to market risks.",
  },
  SIM: {
    id: "DISC-SIM",
    version: "1.0",
    text: "Simulated results using virtual money on live market data. Simulated performance does not guarantee actual results.",
  },
  BACKTEST: {
    id: "DISC-BACKTEST",
    version: "1.0",
    text: "Hypothetical backtested performance. Results are simulated on historical data, have inherent limitations, and do not represent actual trading or guarantee future results. Not investment advice. Securities markets are subject to market risks.",
  },
  TRACK_RECORD: {
    id: "DISC-TRACK-RECORD",
    version: "1.0",
    text: "Past performance is not indicative of future results. These are the measured outcomes of AI-generated research calls, net of simulated Indian trading charges, reviewed by a SEBI Registered Research Analyst. They are published for transparency and are not a promise, projection, or guarantee of returns. Investment in securities market are subject to market risks.",
  },
  AI_CHAT: {
    id: "DISC-AI-CHAT",
    version: "1.0",
    text: "AI-generated analysis, not a recommendation and not investment advice. This answer is general in nature, is not personalised to your circumstances, and may be incomplete or wrong. It has not been reviewed by a Research Analyst. Securities markets are subject to market risks.",
  },
};
