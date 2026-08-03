/**
 * FAQ copy (website/docs/03 act 22) — the objection map of 02 §4, answered
 * the only way we are allowed to, which is also the more convincing way.
 * Rendered as the FAQ act and serialized as FAQPage JSON-LD from this same
 * module, so the structured data can never drift from the visible answers.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Will AlphaEdge make me money?",
    a:
      "We will never tell you that — not because a regulator says so (though " +
      "one does), but because nobody can honestly promise it. What AlphaEdge " +
      "offers is practice on the live market with virtual money, real costs, " +
      "and a risk engine — and, once research publication begins, measured " +
      "outcomes net of charges with confidence intervals, losers included.",
  },
  {
    q: "Is this investment advice?",
    a:
      "No. Research features are informational, carry their disclaimers, and " +
      "are gated by human analyst review before publication. The AI analyst " +
      "refuses personal-advice framing — 'should I buy' never even reaches " +
      "the model.",
  },
  {
    q: "Can I trade with real money on AlphaEdge?",
    a:
      "The sandbox is virtual money only. A live broker connection exists as " +
      "a separate, gated path: off by default, versioned consent, step-up " +
      "authentication, and your manual confirmation on every single order. " +
      "There is no automated live trading, by design.",
  },
  {
    q: "Which brokers are supported?",
    a:
      "Zerodha Kite first, through an adapter architecture built for more. " +
      "We never see or store your broker password — the system has no field " +
      "it could live in.",
  },
  {
    q: "What does the Free tier include?",
    a:
      "The full sandbox on 15-minute delayed data, with the complete charge " +
      "stack modelled, two watchlists and three alerts. It is not a trial " +
      "and it does not expire.",
  },
  {
    q: "Is my data safe?",
    a:
      "Data stays in Indian cloud regions (DPDP Act 2023). Consent is " +
      "recorded per purpose and versioned to the exact wording you agreed " +
      "to; you can export your data or erase it from within the product.",
  },
  {
    q: "Can a beginner use this?",
    a:
      "Yes — Simplicity Mode composes the same panels into a simpler layout, " +
      "the AI analyst answers education questions from a curated corpus, and " +
      "the journal is built to show you your own patterns.",
  },
  {
    q: "Why can't I see any performance numbers?",
    a:
      "Because there is nothing honest to show yet. Research publication " +
      "requires SEBI Research Analyst registration and a human review gate; " +
      "until both are in place, nothing is published — here or in the " +
      "product. When the measured record exists, it appears, whatever it " +
      "says.",
  },
];
