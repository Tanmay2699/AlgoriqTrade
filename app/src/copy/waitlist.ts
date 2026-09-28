/**
 * Early-access consent — the single source for the wording the visitor sees
 * and the version the API records against it (DPDP: consent is to specific
 * words). Any change to CONSENT_TEXT must bump CONSENT_VERSION; the form
 * shows the version beside the checkbox and the route sends it to the sink.
 */

export const CONSENT_VERSION = "2026-09-28.1";

export const CONSENT_TEXT =
  "I agree that Algoryq Trade may use this email address, and the segments I " +
  "pick, only to send me early-access updates. No other purpose, no sharing. " +
  "I can withdraw at any time (DPDP Act 2023).";

/** Optional "what do you trade?" chips — a closed list, so the sink never
 *  receives free text. */
export const SEGMENTS = ["Equity", "F&O", "MCX commodities", "Currency", "Mutual funds"] as const;
export type Segment = (typeof SEGMENTS)[number];

export const WAITLIST_PAGE = {
  eyebrow: "Early access · DPDP-native",
  title: "Learn the discipline before it costs you.",
  lede:
    "Algoryq Trade is in its build phase. Tell us what you trade and we'll let " +
    "you in as seats open — one email address, one purpose, and a consent " +
    "record versioned to the exact words below.",
  points: [
    "Data hosted in India (DPDP Act 2023)",
    "Consent versioned to the exact wording you agree to",
    "Export and erasure on request, with the audit trail kept as a tombstone",
  ],
  footnote: "No card. The Free tier stays free — this list is for launch seats.",
} as const;
