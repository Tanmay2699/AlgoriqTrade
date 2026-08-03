import type { Metadata } from "next";
import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { TrackRecordEmbed } from "@/components/track-record-embed";

/**
 * /track-record (website/docs/03 §4) — the transparency surface, full page:
 * the live embed plus the scoring methodology, written from the code that
 * implements it (receipts: CL-012, CL-016, CL-018). Copy here is a declared
 * REG-03 surface.
 */

export const metadata: Metadata = {
  title: "Track record",
  description:
    "Every published research call is scored to its exit — losers included, net of the " +
    "full charge stack, with a Wilson 95% confidence interval and monthly content-hashed " +
    "transparency reports.",
};

// Per-request like /pricing: a performance figure baked into an image digest
// would be stale the day after it was built. ISR tuning is a W4 question.
export const dynamic = "force-dynamic";

const METHODOLOGY = [
  {
    title: "Triggered calls only",
    body:
      "A call that never reached its entry zone is reported as published-but-untriggered — " +
      "it is not a win, not a loss, and not quietly dropped. The hit rate's denominator " +
      "is triggered calls; a win means the first target or beyond.",
  },
  {
    title: "Collisions resolve against us",
    body:
      "Outcomes are measured by replaying each call through the same state machine that " +
      "tracked it live. When one tick spans both the stop and a target, the stop is " +
      "evaluated first — the ambiguous case is always scored as the loss.",
  },
  {
    title: "Net of the full charge stack",
    body:
      "Every P&L figure has brokerage, STT, exchange transaction charges, SEBI fee, " +
      "stamp duty and GST deducted, computed by the same charges engine the sandbox " +
      "uses — per ₹1,00,000 deployed, in integer paise.",
  },
  {
    title: "Uncertainty stated, not hidden",
    body:
      "Hit rates carry a Wilson 95% confidence interval, drawn on the page. Twelve " +
      "wins from twenty calls is not the same evidence as one hundred twenty from two " +
      "hundred, and the interval is how we say so.",
  },
  {
    title: "Monthly reports are content-hashed",
    body:
      "Each month's report is hashed (SHA-256 over its canonical contents) and anchored " +
      "to the append-only audit record before it is served. Corrections attach to the " +
      "record; nothing is rewritten and nothing disappears. (CL-010)",
  },
] as const;

export default function TrackRecordPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-ink md:text-4xl">
        A track record no one can edit.
      </h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        This page renders live from the same anonymous, public transparency API anyone
        can query — you do not need an account, and neither does anyone auditing us.
        (CL-018) What it shows is decided by the scoring code, not by marketing.
      </p>

      <div className="mt-10">
        <TrackRecordEmbed />
      </div>
      {/* Adjacent to the embed in every state — 06 §1 binds the disclaimer to
          the surface, not to whether the data happened to load. */}
      <div className="mt-6 max-w-2xl">
        <Disclaimer which="TRACK_RECORD" />
      </div>

      <section aria-labelledby="methodology-title" className="mt-16">
        <h2 id="methodology-title" className="text-xl font-semibold text-ink">
          How we score — the rules the code enforces
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          The methodology below is not policy prose; each rule cites the implementation
          in our repository, and continuous integration re-verifies the pieces that can
          drift. (CL-012)
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {METHODOLOGY.map((m) => (
            <div key={m.title} className="rounded-lg border border-line bg-panel p-5">
              <h3 className="text-sm font-semibold text-ink">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 max-w-2xl space-y-6">
        <Disclaimer which="SIM" />
        <p className="text-sm text-ink-muted">
          How the calls are produced — five analysts, deterministic conviction, a human
          gate — is on the{" "}
          <Link href="/#research" className="text-up underline underline-offset-2 hover:opacity-80">
            research section of the homepage
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
