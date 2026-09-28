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
  // A single row of four reads as a sequence, so it gets the drawn
  // connector through the numbers; longer flows wrap and skip it.
  const connected = columns === 4 && items.length === 4;
  return (
    <div className="relative">
      {connected ? (
        <div
          aria-hidden="true"
          className="ae-connector absolute left-7 right-[calc((100%-72px)/4-28px)] top-7 hidden h-0.5 bg-ring shadow-[0_0_6px_var(--ae-glow)] lg:block"
        />
      ) : null}
      <ol
        data-stagger
        className={`relative grid gap-6 ${
          columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {items.map((step, i) => {
          const last = i === items.length - 1;
          return (
            <li key={step.title} className="flex flex-col gap-[18px]">
              <span
                aria-hidden="true"
                className={`ae-num inline-flex h-14 w-14 items-center justify-center rounded-full border-2 text-[15px] ${
                  last
                    ? "border-link bg-accent text-accent-ink shadow-[0_0_24px_color-mix(in_oklab,var(--ae-glow)_45%,transparent)]"
                    : "border-ring bg-surface text-[color:var(--ae-accent-soft-ink)]"
                }`}
              >
                {i + 1}
              </span>
              <div
                className={`flex grow flex-col gap-2 rounded-[14px] border bg-panel p-6 ${
                  last ? "border-line-strong" : "border-line"
                }`}
              >
                <h3 className="text-lg font-semibold text-ink-strong">{step.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
