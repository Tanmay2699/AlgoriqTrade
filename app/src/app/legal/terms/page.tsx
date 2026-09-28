import type { Metadata } from "next";
import { CounselPending, LegalShell } from "../_shared";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms of use for the Algoryq Trade platform.",
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of use">
      <CounselPending />
      <h2>What Algoryq Trade is</h2>
      <p>
        Algoryq Trade is a market-intelligence and paper-trading platform. It is not a
        stock broker, not a depository participant, and it does not hold client funds
        or securities. Sandbox trading uses virtual money only: no real orders are
        placed and no real funds are at risk.
      </p>
      <h2>Not investment advice</h2>
      <p>
        Nothing on the platform or this site is investment advice or a recommendation
        to buy or sell any security. Research features are informational, carry the
        applicable disclaimers, and are gated by human analyst review before
        publication.
      </p>
      <h2>Live broker connections</h2>
      <p>
        Where a live broker connection is offered, it is disabled by default and
        requires your explicit, versioned consent, step-up authentication, and a
        manual confirmation for every individual order. Algoryq Trade never sees or
        stores your broker password. Orders you confirm are executed by your broker
        under your agreement with them.
      </p>
      <h2>Accounts and acceptable use</h2>
      <p>
        Full account terms, acceptable-use rules, liability and dispute provisions
        will be published here before accounts open.
      </p>
    </LegalShell>
  );
}
