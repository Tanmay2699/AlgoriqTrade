import type { Metadata } from "next";
import { CounselPending, LegalShell } from "../_shared";

export const metadata: Metadata = {
  title: "Refunds & cancellation",
  description: "AlphaEdge subscription cancellation and refund policy.",
};

export default function RefundsPage() {
  return (
    <LegalShell title="Refunds & cancellation">
      <CounselPending />
      <h2>Cancellation</h2>
      <p>
        Subscriptions are monthly and can be cancelled at any time from the terminal.
        Cancellation stops future charges; access continues to the end of the period
        already paid for. A cancelled subscription resolves down to the Free tier — it
        does not close your account, and your sandbox history stays yours.
      </p>
      <h2>Payments</h2>
      <p>
        Payments are processed by Razorpay on their hosted pages. AlphaEdge never sees
        or stores card or UPI details. Prices shown in the catalog are GST-inclusive.
      </p>
      <h2>Refunds</h2>
      <p>
        The formal refund policy (including failed-payment and duplicate-charge
        handling) will be published here before paid tiers open.
      </p>
    </LegalShell>
  );
}
