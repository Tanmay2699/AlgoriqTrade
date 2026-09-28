import { createHash } from "node:crypto";
import { wilson } from "@/lib/stats";

/**
 * Track-record explainers (redesign board "NEW · track record & audit
 * chain"). Neither shows our results — there are none yet, by rule:
 *
 *  - IntervalExample: a worked example with its inputs stated, computed by
 *    the same Wilson formula the scorecard uses — never typed-in numbers.
 *  - AuditChain: four sample events hashed at build time with SHA-256, each
 *    over the previous hash plus its payload. The hashes are real; the
 *    events are illustrative, and the component says so.
 *
 * Both loop gently while on screen (the band draws, the chain links block by
 * block) and rest in their final state under reduced motion.
 */

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export function IntervalExample({ hits = 58, n = 100 }: { hits?: number; n?: number }) {
  const ci = wilson(hits, n);
  return (
    <figure data-loop className="ae-card flex flex-col gap-4">
      <figcaption className="flex flex-col gap-1">
        <span className="text-base font-semibold text-ink-strong">How to read an interval</span>
        <span className="text-sm text-ink-muted">
          Worked example, not our results: {hits} hits in {n} calls.
        </span>
      </figcaption>
      <div
        role="img"
        aria-label={`Worked example: ${pct(ci.rate)} hit rate, 95% interval ${pct(ci.low)} to ${pct(ci.high)}`}
        className="relative mt-2 h-12"
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-5 h-2 rounded-full bg-line" />
        <div
          aria-hidden="true"
          className="ae-ci-band absolute top-5 h-2 rounded-full bg-link/40 shadow-[0_0_16px_color-mix(in_oklab,var(--ae-glow)_35%,transparent)]"
          style={{ left: pct(ci.low), width: pct(ci.high - ci.low) }}
        />
        <div
          aria-hidden="true"
          className="ae-ci-point absolute top-3 h-6 w-0.5 -translate-x-1/2 rounded bg-ink-strong"
          style={{ left: pct(ci.rate) }}
        />
        <span aria-hidden="true" className="ae-num absolute left-0 top-9 text-[11px] text-ink-subtle">0%</span>
        <span aria-hidden="true" className="ae-num absolute right-0 top-9 text-[11px] text-ink-subtle">100%</span>
      </div>
      <p className="ae-num text-lg text-ink-strong">
        95% CI {pct(ci.low)} – {pct(ci.high)}
      </p>
      <p className="text-sm leading-relaxed text-ink-muted">
        The honest answer is the whole band, not the {Math.round(ci.rate * 100)}. Few calls,
        wide band — we show both.
      </p>
    </figure>
  );
}

const SAMPLE_EVENTS = [
  { title: "Call written", payload: { event: "call_written", symbol: "EXAMPLE", setup: "sample" } },
  { title: "Analyst approved", payload: { event: "ra_approved", reviewer: "sample-analyst" } },
  { title: "Triggered · closed", payload: { event: "closed", outcome: "sample", net_of_charges: true } },
  { title: "Correction attached", payload: { event: "correction", note: "sample correction" } },
] as const;

function buildChain() {
  let prev = "0".repeat(64);
  return SAMPLE_EVENTS.map((e) => {
    const hash = createHash("sha256").update(prev + JSON.stringify(e.payload)).digest("hex");
    const block = { title: e.title, prev, hash };
    prev = hash;
    return block;
  });
}

const short = (h: string) => `${h.slice(0, 4)}…${h.slice(-4)}`;

export function AuditChain() {
  const chain = buildChain();
  return (
    <div data-loop className="rounded-2xl border border-line bg-sunk p-5 md:p-7">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="text-base font-semibold text-ink-strong">Audit chain</h3>
        <p className="text-sm text-ink-muted">
          Hash-linked, database-trigger-protected, written before publication.
        </p>
        <span className="ae-num ml-auto text-[11px] tracking-[0.06em] text-ink-subtle">
          SAMPLE EVENTS · REAL SHA-256
        </span>
      </div>
      <ol className="mt-6 grid gap-3 md:grid-cols-4 md:gap-8">
        {chain.map((b, i) => (
          <li key={b.hash} className="flex">
            <div
              className={`ae-chain-block relative flex w-full flex-col gap-1.5 rounded-[14px] border bg-panel p-4 ${
                i === chain.length - 1 ? "border-line-strong" : "border-line"
              }`}
              style={{ "--i": i } as React.CSSProperties}
            >
              {i > 0 ? (
                <span aria-hidden="true" className="ae-chain-link absolute -left-8 top-1/2 hidden h-0.5 w-8 -translate-y-1/2 bg-ring md:block" style={{ "--i": i } as React.CSSProperties} />
              ) : null}
              <span className="text-sm font-semibold text-ink-strong">{b.title}</span>
              <span className="ae-num text-[11px] text-ink-subtle">prev {short(b.prev)}</span>
              <span className="ae-num text-[11px] text-link">
                hash <span className="ae-chain-hash">{short(b.hash)}</span>
              </span>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
        Each hash is SHA-256 over the previous hash and the event, computed when this page
        was built. Change any earlier event and every hash after it changes — which is
        why a correction is appended, never edited in.
      </p>
    </div>
  );
}

/** Dark-launch status: progress without a number we'd have to take back. */
export function EvidenceStatus({ title, body }: { title: string; body: string }) {
  return (
    <div data-loop className="ae-card flex flex-col gap-4 !border-line-strong">
      <p className="flex items-center gap-2.5 text-base font-semibold text-ink-strong">
        <span aria-hidden="true" className="relative flex h-2 w-2">
          <span className="ae-status-ping absolute inset-0 rounded-full bg-link" />
          <span className="relative h-2 w-2 rounded-full bg-link" />
        </span>
        {title}
      </p>
      <div aria-hidden="true" className="relative h-2 overflow-hidden rounded-full bg-line">
        <span className="ae-evidence-sweep absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-link to-transparent" />
      </div>
      <p className="text-[15px] leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}
