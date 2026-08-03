import type { Metadata } from "next";
import { CounselPending, LegalShell } from "../_shared";

export const metadata: Metadata = {
  title: "Grievance redressal",
  description: "How to raise a complaint with AlphaEdge and where it escalates.",
};

export default function GrievancePage() {
  return (
    <LegalShell title="Grievance redressal">
      <CounselPending />
      <h2>Raising a complaint</h2>
      <p>
        The grievance officer&apos;s name, contact details and response timelines will
        be published here before launch, as required under the DPDP Act 2023 and — once
        research publication begins — SEBI&apos;s Research Analyst regulations.
      </p>
      <h2>Escalation</h2>
      <p>
        After SEBI Research Analyst registration is granted, complaints relating to
        research services will additionally be escalatable through SEBI&apos;s SCORES
        platform and the securities-market Online Dispute Resolution portal; links and
        registration details will appear here at that time. We will not describe an
        escalation path that does not exist yet.
      </p>
    </LegalShell>
  );
}
