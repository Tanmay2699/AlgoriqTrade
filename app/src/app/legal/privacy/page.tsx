import type { Metadata } from "next";
import { CounselPending, LegalShell } from "../_shared";

export const metadata: Metadata = {
  title: "Privacy (DPDP)",
  description: "How AlphaEdge handles personal data under the DPDP Act 2023.",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      title="Privacy notice"
      lede="Digital Personal Data Protection Act, 2023 — how AlphaEdge treats personal data."
    >
      <CounselPending />
      <h2>Where data lives</h2>
      <p>
        Personal data is processed and stored in Indian cloud regions. This is an
        architectural rule, not a policy aspiration — our infrastructure checks refuse
        non-India regions.
      </p>
      <h2>Consent, per purpose</h2>
      <p>
        The platform records consent per purpose (for example: market data, AI
        research, the leaderboard, automated sandbox trading, marketing), versioned to
        the exact wording you agreed to. A change to the wording invalidates prior
        consent and asks again. Withdrawal is effective on request — for example,
        leaving the leaderboard removes your row for every viewer on the next read.
      </p>
      <h2>Your rights</h2>
      <p>
        You can export your data and request erasure from within the product. Erasure
        removes personal identifiers while preserving the integrity of regulatory
        audit records through tombstoning.
      </p>
      <h2>This website</h2>
      <p>
        This site sets no cookies for anonymous visitors, runs no third-party
        trackers, and collects only aggregate, cookieless performance measurements.
        The early-access form stores your email for launch updates only, against the
        consent version shown at the form, and nothing else.
      </p>
      <h2>Contact</h2>
      <p>
        The grievance officer&apos;s name and contact details will be published here
        before launch.
      </p>
    </LegalShell>
  );
}
