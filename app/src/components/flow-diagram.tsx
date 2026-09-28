/**
 * FlowDiagram (website/docs/05 §8) — the site's diagram primitive: an
 * ordered sequence of stages rendered as real HTML (selectable text, token
 * colors, screen-reader order = visual order), never text baked into a
 * raster. Wraps on narrow viewports; the connector glyphs are decoration
 * and hidden from AT — the <ol> semantics carry the sequence.
 *
 * Motion: a signal walks the stages in order on a loop — each node lights
 * as it arrives and a dot rides each connector (paused offscreen).
 */

interface FlowNode {
  title: string;
  sub?: string;
}

export function FlowDiagram({ nodes, label }: { nodes: readonly FlowNode[]; label: string }) {
  return (
    <ol
      aria-label={label}
      data-loop
      className="flex flex-wrap items-stretch gap-y-3"
      style={{ "--n": nodes.length } as React.CSSProperties}
    >
      {nodes.map((node, i) => (
        <li key={node.title} className="flex items-center" style={{ "--i": i } as React.CSSProperties}>
          <span className="ae-flow-node flex h-full max-w-60 flex-col justify-center rounded-2xl border border-line bg-panel px-4 py-3">
            <span className="text-base font-semibold text-ink-strong">{node.title}</span>
            {node.sub ? (
              <span className="mt-1 text-xs leading-relaxed text-ink-muted">{node.sub}</span>
            ) : null}
          </span>
          {i < nodes.length - 1 ? (
            <span aria-hidden="true" className="relative mx-2 flex h-0.5 w-7 shrink-0 items-center rounded bg-line-strong">
              <span className="ae-flow-dot absolute -left-0.5 h-1.5 w-1.5 rounded-full bg-link shadow-[0_0_8px_var(--ae-glow)]" />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
