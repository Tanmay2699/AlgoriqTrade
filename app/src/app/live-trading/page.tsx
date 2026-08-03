import type { Metadata } from "next";
import Link from "next/link";
import { FlowDiagram } from "@/components/flow-diagram";

/**
 * /live-trading (website/docs/03 §4) — act 18 expanded: the four gates one
 * by one, the SEBI Feb-2025 positioning in plain words, and the Zerodha
 * Kite specifics shown honestly (BO→GTT-OCO risk-shape note, the
 * UNKNOWN-never-retried rule). Broker roster policy per 01 §Open-3
 * (resolved 2026-08-03): we name the adapter that exists, and describe the
 * architecture — we do not name integrations that are planned but unbuilt.
 * Copy here is a declared REG-03 surface.
 */

export const metadata: Metadata = {
  title: "Live trading",
  description:
    "How AlphaEdge graduates you to a real broker: four gates checked together, no " +
    "automated live orders ever, honest capability mapping on Zerodha Kite, and a " +
    "timeout rule that never risks a duplicate order.",
};

const GATES = [
  {
    title: "1 · Deployment flag",
    body:
      "Live trading is off by default in every deployment — the default is written " +
      "into the values files our infrastructure checks lint. The admin console can " +
      "display the switch; it cannot flip it. Turning live trading on is a deploy, " +
      "reviewed like one.",
  },
  {
    title: "2 · Versioned consent",
    body:
      "You consent to specific wording under the DPDP Act, and the consent stores " +
      "the version you saw. If the wording changes by one clause, prior consent is " +
      "invalid and you are asked again. Nothing is inferred from your continued use.",
  },
  {
    title: "3 · A fresh second factor",
    body:
      "Step-up MFA with a fifteen-minute lifetime. A session you opened this " +
      "morning does not get to place a real order this afternoon — recent is the " +
      "point.",
  },
  {
    title: "4 · Your confirmation, on every order",
    body:
      "The confirmation field defaults to absent, so an integration that forgets to " +
      "ask is refused rather than trusted. There is no bulk mode, no standing " +
      "instruction, no “confirm all”. One order, one deliberate yes.",
  },
] as const;

export default function LiveTradingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Live trading is a graduation, not a default.
      </h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        The sandbox is the product; a real broker is the opt-in. A real order can
        only leave AlphaEdge through four gates, checked together so none can be
        skipped — and when one refuses, the refusal names the gate that stopped it.
        (CL-009)
      </p>

      <div className="mt-10">
        <FlowDiagram
          label="The four gates a real order must pass"
          nodes={[
            { title: "Deployment flag", sub: "off by default" },
            { title: "Versioned consent", sub: "exact wording" },
            { title: "Step-up MFA", sub: "15-minute lifetime" },
            { title: "Your confirmation", sub: "every single order" },
          ]}
        />
      </div>

      <section aria-labelledby="gates-title" className="mt-14">
        <h2 id="gates-title" className="text-xl font-semibold text-ink">
          The gates, one by one
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {GATES.map((gate) => (
            <div key={gate.title} className="rounded-lg border border-line bg-panel p-5">
              <h3 className="text-sm font-semibold text-ink">{gate.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{gate.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="sebi-title" className="mt-14">
        <h2 id="sebi-title" className="text-xl font-semibold text-ink">
          Where this stands with SEBI, in plain words
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          SEBI&apos;s February 2025 framework regulates retail algorithmic trading —
          automated orders placed on your behalf. AlphaEdge places no automated live
          orders, ever: gate four means every real order carries your explicit,
          per-order confirmation, which is what keeps this product outside that
          perimeter. The refusal text in the product names the framework, so the
          reason is in front of you at the moment it matters, not buried here.
          (CL-009) We treat this line as load-bearing — it is listed on our homepage
          under “what we will not do”, and it is not negotiable for convenience
          features.
        </p>
      </section>

      <section aria-labelledby="kite-title" className="mt-14">
        <h2 id="kite-title" className="text-xl font-semibold text-ink">
          Zerodha Kite, mapped honestly
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
          Kite is the adapter that exists today. The architecture is broker-agnostic —
          adapters declare capabilities, and the bridge maps orders loss-transparently —
          but we name integrations when they work, not when they are planned.
        </p>
        <div className="mt-6 space-y-4">
          <div className="max-w-3xl rounded-lg border border-line bg-panel p-5">
            <h3 className="text-sm font-semibold text-ink">
              A bracket order becomes a GTT-OCO — and says so
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Zerodha discontinued bracket orders, so a sandbox BO graduates to a
              GTT-OCO trigger. That is a different risk shape: a bracket&apos;s stop is a
              live order resting at the exchange; a GTT is a trigger sitting with the
              broker that becomes an order only when touched. The adapter attaches
              that note to the mapped order where you can see it, because the failure
              mode we refuse is believing you have a bracket when you do not. The
              adapter also declines to claim bracket support — a capability it does
              not have is not listed. (CL-032)
            </p>
          </div>
          <div className="max-w-3xl rounded-lg border border-line bg-panel p-5">
            <h3 className="text-sm font-semibold text-ink">
              A timed-out order is never retried
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              If a live order times out, its state is unknown — the broker may or may
              not have it. AlphaEdge marks the attempt UNKNOWN and refuses further
              attempts until it has reconciled against the broker&apos;s own book. You
              cannot route around this by clicking again, and neither can our code.
              The duplicate order is the disaster this rule exists to make
              impossible. (CL-033)
            </p>
          </div>
          <div className="max-w-3xl rounded-lg border border-line bg-panel p-5">
            <h3 className="text-sm font-semibold text-ink">
              Your broker password has nowhere to live
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              We integrate through the broker&apos;s own token flow. The session model has
              no field a password could occupy, a scanner refuses any payload that
              carries one, and the tokens we do hold are envelope-encrypted — the
              details are on the{" "}
              <Link
                href="/security"
                className="text-up underline underline-offset-2 hover:opacity-80"
              >
                security page
              </Link>
              . (CL-031)
            </p>
          </div>
        </div>
      </section>

      <p className="mt-14 max-w-2xl text-sm text-ink-muted">
        Until you choose to graduate, nothing here applies to you: the sandbox runs
        on virtual money, full stop. Start there —{" "}
        <Link href="/waitlist" className="text-up underline underline-offset-2 hover:opacity-80">
          join early access
        </Link>
        .
      </p>
    </div>
  );
}
