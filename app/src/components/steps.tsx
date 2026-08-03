/**
 * Numbered step flow (website/docs/05 §8) — the shared shape behind the
 * research-pipeline and four-gates diagrams: an ordered list styled as
 * connected stages. Real HTML, selectable text, no raster — an <ol> is
 * already the correct semantics for "these happen in this order, and order
 * is the point".
 */

export interface Step {
  title: string;
  body: string;
}

export function Steps({ items, columns = 4 }: { items: Step[]; columns?: 2 | 4 }) {
  return (
    <ol
      className={`grid gap-4 ${
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {items.map((step, i) => (
        <li key={step.title} className="relative rounded-lg border border-line bg-surface p-5">
          <span
            aria-hidden="true"
            className="tabular inline-flex h-7 w-7 items-center justify-center rounded-full border border-line-strong text-xs font-semibold text-ink"
          >
            {i + 1}
          </span>
          <h3 className="mt-3 text-sm font-semibold text-ink">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
