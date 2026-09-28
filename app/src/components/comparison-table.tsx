import { COMPARISON } from "@/copy/comparison";

/**
 * ComparisonTable (website/docs/05 §11): sticky first column, focusable
 * horizontal scroll region (the terminal's pattern), Algoryq Trade fact cells
 * carry their claims-ledger id — the copy module's types make a receipt-less
 * cell unrepresentable, this component just renders what that guarantees.
 * Motion: a highlighter marks the Algoryq Trade column one row at a time.
 */

export function ComparisonTable() {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Comparison of ways to learn trading"
      data-loop
      className="overflow-x-auto rounded-2xl border border-line"
    >
      <table className="w-full min-w-[840px] border-collapse text-sm">
        <caption className="sr-only">
          Ways of learning to trade compared: real money, tips channels, typical
          simulators and Algoryq Trade
        </caption>
        <thead>
          <tr className="border-b border-line bg-panel text-left">
            <th scope="col" className="sticky left-0 bg-panel px-4 py-3 font-medium text-ink">
              <span className="sr-only">Dimension</span>
            </th>
            {COMPARISON.columns.map((col, i) => (
              <th
                scope="col"
                key={col}
                className={`px-4 py-3 font-medium ${
                  i === COMPARISON.columns.length - 1 ? "text-link" : "text-ink"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON.rows.map((row, r) => (
            <tr key={row.label} className="border-b border-line align-top last:border-b-0">
              <th
                scope="row"
                className="sticky left-0 bg-surface px-4 py-3 text-left font-medium text-ink"
              >
                {row.label}
              </th>
              <td className="px-4 py-3 text-ink-muted">{row.liveMoney.text}</td>
              <td className="px-4 py-3 text-ink-muted">{row.tips.text}</td>
              <td className="px-4 py-3 text-ink-muted">{row.simulator.text}</td>
              <td className="ae-mark px-4 py-3 text-ink" style={{ "--r": r } as React.CSSProperties}>
                {row.alphaedge.text}{" "}
                <span className="whitespace-nowrap text-xs text-ink-subtle">
                  ({row.alphaedge.claim})
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
