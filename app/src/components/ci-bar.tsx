/**
 * Wilson-interval bar (website/docs/05 §4) — the terminal's CiBar pattern
 * (duplicated in apps/web recs + track-record pages; extracted here per the
 * spec, upstream consolidation is 05 §Open-1). Renders a [low, high]
 * confidence band with a point marker on a 0–100% track.
 *
 * The bar is presentational; the numbers it draws are announced via
 * aria-label so a screen reader gets the interval, not a mystery rectangle.
 */

interface CiBarProps {
  /** Point estimate, 0–1. */
  rate: number;
  /** Interval bounds, 0–1. */
  low: number;
  high: number;
  /** What the rate is a rate of, e.g. "Hit rate, ORB-15 setup". */
  label: string;
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export function CiBar({ rate, low, high, label }: CiBarProps) {
  return (
    <div
      role="img"
      aria-label={`${label}: ${pct(rate)}, 95% confidence interval ${pct(low)} to ${pct(high)}`}
      className="relative h-2 w-full overflow-hidden rounded-full bg-line"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 rounded-full bg-up/30"
        style={{ left: pct(low), width: `${Math.max(0, (high - low) * 100)}%` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-up"
        style={{ left: pct(rate) }}
      />
    </div>
  );
}
