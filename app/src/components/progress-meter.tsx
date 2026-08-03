/**
 * Evidence-window progress bar (website/docs/05 §4) — the recs dark-launch
 * meter pattern. A count of completed sessions toward a target; deliberately
 * not a percentage headline, because "78%" reads like performance and this
 * number is plumbing.
 */

interface ProgressMeterProps {
  value: number;
  max: number;
  /** Unit noun, e.g. "sessions". */
  unit: string;
  label: string;
}

export function ProgressMeter({ value, max, unit, label }: ProgressMeterProps) {
  const width = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-subtle">{label}</span>
        <span className="tabular text-sm font-semibold text-ink">
          {value} <span className="font-normal text-ink-muted">of {max} {unit}</span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line"
      >
        <div className="h-full rounded-full bg-accent" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}
