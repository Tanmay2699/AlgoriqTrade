import type { Metadata } from "next";
import { WaitlistForm } from "@/components/waitlist-form";

export const metadata: Metadata = {
  title: "Early access",
  description:
    "Join the AlphaEdge early-access list. One email when access opens — nothing else.",
};

/**
 * The pre-identity CTA target (website/docs/00 Open-2): until Entra External
 * ID lands there is no signup, so every "get started" path resolves here.
 * When identity ships, this page and its API retire in favour of /signup —
 * recorded in website/docs/08 §6.
 */
export default function WaitlistPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Early access
      </h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        AlphaEdge is in its build phase. Accounts open when identity and the evidence
        window are ready — leave an address and we will send exactly one kind of email:
        launch updates.
      </p>
      <div className="mt-10">
        <WaitlistForm />
      </div>
    </div>
  );
}
