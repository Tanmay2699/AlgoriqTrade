import { Fragment } from "react";

/**
 * Research pipeline diagram (redesign board "NEW · research pipeline").
 * Readiness gate → five analysts in parallel → deterministic fusion → CIO
 * sizing → blocking compliance lint → the human RA gate. Real HTML, an
 * <ol> in pipeline order for assistive tech; the connectors are decoration.
 *
 * Motion (a loop, played only while on screen): a signal leaves the
 * readiness gate, fans out to the analysts, converges, and walks each stage
 * until the RA gate lights — then the run starts over. Reduced motion shows
 * the diagram at rest.
 */

const ANALYSTS = [
  { k: "T", name: "Technical" },
  { k: "F", name: "Fundamental" },
  { k: "Q", name: "Quant" },
  { k: "M", name: "Macro" },
  { k: "S", name: "Sentiment" },
] as const;

const STAGES = [
  { title: "Conviction fusion", sub: "Deterministic. The model never sets it." },
  { title: "CIO sizing", sub: "¼-Kelly, hard caps", mono: true },
  { title: "Compliance lint", sub: "Blocking. Banned language fails the run." },
] as const;

// Five analyst rows are flex-1, so their centres sit at 10/30/50/70/90%.
const FAN = [10, 30, 50, 70, 90];

function Fan({ out }: { out: boolean }) {
  return (
    <li aria-hidden="true" className="hidden w-10 shrink-0 lg:flex xl:w-12">
    <svg viewBox="0 0 48 100" preserveAspectRatio="none" className="h-full w-full">
      {FAN.map((y, i) => {
        const d = out ? `M0,50 C24,50 24,${y} 48,${y}` : `M0,${y} C24,${y} 24,50 48,50`;
        return (
          <g key={y}>
            <path d={d} fill="none" stroke="var(--ae-border-strong)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <path
              d={d}
              fill="none"
              stroke="var(--ae-link)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              className={out ? "ae-rp-fan-out" : "ae-rp-fan-in"}
              style={{ "--i": i } as React.CSSProperties}
            />
          </g>
        );
      })}
    </svg>
    </li>
  );
}

function Connector({ step }: { step: number }) {
  return (
    <li aria-hidden="true" className="relative hidden h-0.5 w-6 shrink-0 self-center overflow-hidden rounded bg-line-strong lg:block xl:w-8">
      <span className="ae-rp-link absolute inset-y-0 left-0 w-full bg-link" style={{ "--s": step } as React.CSSProperties} />
    </li>
  );
}

function Node({
  title,
  sub,
  step,
  mono = false,
  className = "",
}: {
  title: string;
  sub: string;
  step: number;
  mono?: boolean;
  className?: string;
}) {
  return (
    <li
      className={`ae-rp-node flex flex-col justify-center gap-1.5 rounded-[14px] border border-line bg-panel px-4 py-4 ${className}`}
      style={{ "--s": step } as React.CSSProperties}
    >
      <span className="text-[15px] font-semibold text-ink-strong">{title}</span>
      <span className={`${mono ? "ae-num" : ""} text-xs leading-relaxed text-ink-muted`}>{sub}</span>
    </li>
  );
}

export function ResearchPipeline() {
  return (
    <div data-loop className="ae-rp relative overflow-hidden rounded-2xl border border-line bg-sunk p-5 md:p-8">
      <div aria-hidden="true" className="ae-grid-tex pointer-events-none absolute inset-0 opacity-60" />
      <ol
        aria-label="Research pipeline, in order"
        className="relative flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0"
      >
        <Node title="Readiness gate" sub="Stale or missing data stops the run" step={0} className="lg:w-40 xl:w-44" />
        <Fan out />
        <li className="ae-rp-node flex flex-col gap-2 rounded-[14px] lg:w-44 xl:w-48" style={{ "--s": 1 } as React.CSSProperties}>
          <span className="sr-only">Five analysts in parallel:</span>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-5 lg:flex lg:h-full lg:flex-col">
            {ANALYSTS.map((a, i) => (
              <li
                key={a.k}
                className="ae-rp-analyst flex items-center gap-3 rounded-[10px] border border-line bg-panel px-3 py-2 sm:flex-col sm:gap-1 sm:px-2 lg:flex-1 lg:flex-row lg:gap-3 lg:px-3"
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className="ae-num flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-soft text-xs text-[color:var(--ae-accent-soft-ink)]">
                  {a.k}
                </span>
                <span className="text-[13px] text-ink sm:text-[11px] lg:text-[13px]">{a.name}</span>
              </li>
            ))}
          </ul>
        </li>
        <Fan out={false} />
        {STAGES.map((s, i) => (
          <Fragment key={s.title}>
            {i > 0 ? <Connector step={i + 2} /> : null}
            <Node title={s.title} sub={s.sub} step={i + 2} mono={"mono" in s} className="lg:w-40 xl:w-44" />
          </Fragment>
        ))}
        <Connector step={5} />
        <li
          className="ae-rp-node ae-rp-gate flex flex-col items-center justify-center gap-3 rounded-[14px] border border-line-strong bg-panel px-4 py-5 text-center lg:w-48"
          style={{ "--s": 5 } as React.CSSProperties}
        >
          <span aria-hidden="true" className="ae-rp-seal flex h-12 w-12 items-center justify-center rounded-full border-2 border-ring bg-surface text-link">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <span className="text-[15px] font-semibold leading-snug text-ink-strong">
            SEBI RA approves — or nothing publishes
          </span>
        </li>
      </ol>
    </div>
  );
}
