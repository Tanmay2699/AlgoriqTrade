import type { Metadata } from "next";
import Link from "next/link";

/**
 * /security (website/docs/06 §6, 03 §4) — the public security & data
 * posture. Structural facts with claims-ledger receipts, DPDP posture in
 * plain words, and — deliberately first-class — the section on what does
 * not exist yet (06 §Open-3: the honesty default says publish it). Copy
 * here is a declared REG-03 surface.
 */

export const metadata: Metadata = {
  title: "Security",
  description:
    "AlphaEdge's security and data posture: no broker passwords by construction, " +
    "envelope-encrypted tokens, India-only processing, server-side session timeouts, " +
    "hash-chained audit logs — and an honest list of what doesn't exist yet.",
};

const SECTIONS = [
  {
    id: "construction",
    title: "Safe by construction, where it matters most",
    intro:
      "The strongest control is a state that cannot be represented. Where we could " +
      "build the risk out of the data model, we did.",
    facts: [
      {
        title: "Your broker password has nowhere to live",
        body:
          "The broker-session model has no field a password could occupy, and a " +
          "scanner refuses any payload that carries one. We integrate with brokers " +
          "through their token flows; the credential itself never reaches us. (CL-009)",
      },
      {
        title: "Broker tokens are envelope-encrypted",
        body:
          "Access tokens are encrypted with AES-256-GCM under a Key Vault key, bound " +
          "to their own database row so a ciphertext cannot be replayed into another " +
          "account, with key rotation designed in. Production refuses to start with " +
          "the development cipher. (CL-031)",
      },
      {
        title: "The sandbox is virtual money, full stop",
        body:
          "Paper trading uses virtual money on live prices. A real order can only " +
          "leave through four gates — deployment flag, versioned consent, fresh " +
          "second factor, and your explicit confirmation on every single order. (CL-009)",
      },
    ],
  },
  {
    id: "data",
    title: "Where your data lives, and why it stays there",
    intro:
      "AlphaEdge is built for the DPDP Act 2023 posture: Indian-region processing, " +
      "purpose-limited consent, no dark patterns.",
    facts: [
      {
        title: "India-only, checked by machines",
        body:
          "Our infrastructure code is linted by 52 checks that refuse non-India " +
          "regions and public network access before anything deploys — the policy is " +
          "a build failure, not a memo. (CL-013)",
      },
      {
        title: "Consent is per purpose, and versioned",
        body:
          "A contact you verify for alerts is used for alerts. Consent for live " +
          "trading binds to the exact wording you saw — if the wording changes, the " +
          "old consent is invalid and you are asked again. (CL-009)",
      },
      {
        title: "Leaderboard consent works in both directions",
        body:
          "The leaderboard is opt-in and pseudonymous, and consent is re-checked " +
          "when the board is served: withdraw it and the very next read excludes " +
          "you. (CL-023)",
      },
    ],
  },
  {
    id: "operations",
    title: "Sessions, staff and the audit trail",
    intro: "Operational controls, as implemented — not as aspired to.",
    facts: [
      {
        title: "Sessions expire at the server",
        body:
          "Thirty minutes idle and the session is revoked server-side. A stale tab " +
          "does not stay signed in because its JavaScript stopped running. (CL-029)",
      },
      {
        title: "Staff are not users",
        body:
          "Staff authenticate against a separate directory from customers, and roles " +
          "are split by consequence: the role that approves research publication is " +
          "not the role that operates the platform. In production, a missing staff " +
          "configuration refuses access rather than degrading. (CL-030)",
      },
      {
        title: "Four audit logs no one can rewrite",
        body:
          "Research, risk, billing and AI chat each write hash-chained, append-only " +
          "records, and every read re-verifies the chain. Corrections attach; " +
          "history does not change. (CL-017)",
      },
    ],
  },
] as const;

const NOT_YET = [
  {
    title: "No external security audit yet",
    body:
      "AlphaEdge has not yet been through an independent penetration test or " +
      "security audit. One is planned before general availability; when it has " +
      "happened, this page will say so — and until it has, this page will not " +
      "pretend otherwise.",
  },
  {
    title: "Dual control on staff actions is designed, not implemented",
    body:
      "Destructive staff operations are role-separated today; requiring a second " +
      "approver is on the roadmap. We say this because a security page that lists " +
      "only finished things is an advertisement, not a posture.",
  },
  {
    title: "Responsible disclosure, pre-launch",
    body:
      "A security.txt and dedicated disclosure address ship with the public launch. " +
      "Until then, security reports reach the same team through the waitlist " +
      "contact path — small platform, short path.",
  },
] as const;

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Security posture, stated plainly.
      </h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        Everything below is a statement about our codebase and infrastructure, with a
        claims-ledger id linking it to the code that makes it true — the same standard
        as every other page here. The last section lists what does not exist yet,
        because a posture you can verify includes the gaps.
      </p>

      {SECTIONS.map((section) => (
        <section key={section.id} aria-labelledby={`${section.id}-title`} className="mt-14">
          <h2 id={`${section.id}-title`} className="text-xl font-semibold text-ink">
            {section.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">{section.intro}</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {section.facts.map((fact) => (
              <div key={fact.title} className="rounded-lg border border-line bg-panel p-5">
                <h3 className="text-sm font-semibold text-ink">{fact.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{fact.body}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section aria-labelledby="not-yet-title" className="mt-14">
        <h2 id="not-yet-title" className="text-xl font-semibold text-ink">
          What doesn&apos;t exist yet
        </h2>
        <div className="mt-6 space-y-4">
          {NOT_YET.map((item) => (
            <div key={item.title} className="max-w-3xl rounded-lg border border-line bg-panel p-5">
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-14 max-w-2xl text-sm text-ink-muted">
        How this posture is enforced — the CI gates, the invariants, the full receipts
        table — is on{" "}
        <Link href="/how-its-built" className="text-up underline underline-offset-2 hover:opacity-80">
          the engineering page
        </Link>
        . Data rights and retention are in the{" "}
        <Link href="/legal/privacy" className="text-up underline underline-offset-2 hover:opacity-80">
          privacy notice
        </Link>
        .
      </p>
    </div>
  );
}
