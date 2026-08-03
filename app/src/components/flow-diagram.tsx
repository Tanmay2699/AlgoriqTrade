/**
 * FlowDiagram (website/docs/05 §8) — the site's diagram primitive: an
 * ordered sequence of stages rendered as real HTML (selectable text, token
 * colors, screen-reader order = visual order), never text baked into a
 * raster. Wraps on narrow viewports; the connector glyphs are decoration
 * and hidden from AT — the <ol> semantics carry the sequence.
 */

interface FlowNode {
  title: string;
  sub?: string;
}

export function FlowDiagram({ nodes, label }: { nodes: readonly FlowNode[]; label: string }) {
  return (
    <ol aria-label={label} className="flex flex-wrap items-stretch gap-y-3">
      {nodes.map((node, i) => (
        <li key={node.title} className="flex items-center">
          <span className="flex h-full max-w-60 flex-col justify-center rounded-lg border border-line bg-panel px-4 py-3">
            <span className="text-sm font-semibold text-ink">{node.title}</span>
            {node.sub ? (
              <span className="mt-1 text-xs leading-relaxed text-ink-muted">{node.sub}</span>
            ) : null}
          </span>
          {i < nodes.length - 1 ? (
            <span aria-hidden="true" className="mx-2 shrink-0 text-lg text-ink-subtle">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
