import type { Metadata } from "next";
import { Photo } from "@/components/photo";
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
    "How Algoryq Trade graduates you to a real broker: four gates checked together, no " +
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
    <div className="ae-container py-14 md:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="ae-h1 max-w-4xl">
        Live trading is a graduation, not a default.
      </h1>
      <p className="ae-lede mt-6 max-w-3xl">
        The sandbox is the product; a real broker is the opt-in. A real order can
        only leave Algoryq Trade through four gates, checked together so none can be
        skipped — and when one refuses, the refusal names the gate that stopped it.
        (CL-009)
      </p>
        </div>
        <Photo k="handPhone2" className="lg:col-span-5" priority />
      </div>

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

      <section aria-labelledby="gates-title" className="mt-16 md:mt-24">
        <h2 id="gates-title" className="ae-h3">
          The gates, one by one
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {GATES.map((gate) => (
            <div key={gate.title} className="rounded-2xl border border-line bg-panel p-6">
              <h3 className="text-base font-semibold text-ink-strong">{gate.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{gate.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="sebi-title" className="mt-16 md:mt-24">
        <h2 id="sebi-title" className="ae-h3">
          Where this stands with SEBI, in plain words
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
          SEBI&apos;s February 2025 framework regulates retail algorithmic trading —
          automated orders placed on your behalf. Algoryq Trade places no automated live
          orders, ever: gate four means every real order carries your explicit,
          per-order confirmation, which is what keeps this product outside that
          perimeter. The refusal text in the product names the framework, so the
          reason is in front of you at the moment it matters, not buried here.
          (CL-009) We treat this line as load-bearing — it is listed on our homepage
          under “what we will not do”, and it is not negotiable for convenience
          features.
        </p>
      </section>

      <section aria-labelledby="kite-title" className="mt-16 md:mt-24">
        <h2 id="kite-title" className="ae-h3">
          Zerodha Kite, mapped honestly
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
          Kite is the adapter that exists today. The architecture is broker-agnostic —
          adapters declare capabilities, and the bridge maps orders loss-transparently —
          but we name integrations when they work, not when they are planned.
        </p>
        <div className="mt-6 space-y-4">
          <div className="max-w-3xl rounded-2xl border border-line bg-panel p-6">
            <h3 className="text-base font-semibold text-ink-strong">
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
          <div className="max-w-3xl rounded-2xl border border-line bg-panel p-6">
            <h3 className="text-base font-semibold text-ink-strong">
              A timed-out order is never retried
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              If a live order times out, its state is unknown — the broker may or may
              not have it. Algoryq Trade marks the attempt UNKNOWN and refuses further
              attempts until it has reconciled against the broker&apos;s own book. You
              cannot route around this by clicking again, and neither can our code.
              The duplicate order is the disaster this rule exists to make
              impossible. (CL-033)
            </p>
          </div>
          <div className="max-w-3xl rounded-2xl border border-line bg-panel p-6">
            <h3 className="text-base font-semibold text-ink-strong">
              Your broker password has nowhere to live
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              We integrate through the broker&apos;s own token flow. The session model has
              no field a password could occupy, a scanner refuses any payload that
              carries one, and the tokens we do hold are envelope-encrypted — the
              details are on the{" "}
              <Link
                href="/security"
                className="ae-link"
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
        <Link href="/waitlist" className="ae-link">
          join early access
        </Link>
        .
      </p>
    </div>
  );
}
