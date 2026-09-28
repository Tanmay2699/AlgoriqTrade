/**
 * Sector heatmap tiles (website/docs/05 §4) — the terminal's breadth-panel
 * intensity scale (`tileStyle`) rebuilt on tokens: `color-mix` against
 * `--ae-up`/`--ae-down` so theme and deutan switches reach every tile, with
 * intensity saturating at ±1.5%. Sign glyphs accompany colour (colour is
 * never the only signal — 04 §8). Motion: light rakes across the tiles and
 * each glyph nudges the way it points; the values never change.
 *
 * The data label is a REQUIRED prop rendered by the component itself, so no
 * composition can show these tiles without saying what the numbers are
 * (04 §7.1). The homepage feeds it simulated values; a future live embed
 * feeds it the dashboard API and the label changes with the source.
 */

export interface SectorTile {
  name: string;
  bps: number; // signed basis points
}

const SATURATE_BPS = 150;

function tileBackground(bps: number): string {
  const intensity = Math.min(1, Math.abs(bps) / SATURATE_BPS);
  const token = bps >= 0 ? "var(--ae-up)" : "var(--ae-down)";
  return `color-mix(in oklab, ${token} ${Math.round(intensity * 26)}%, transparent)`;
}

function formatBps(bps: number): string {
  const pct = (Math.abs(bps) / 100).toFixed(2);
  return `${bps >= 0 ? "+" : "−"}${pct}%`;
}

export function HeatmapTiles({ sectors, label }: { sectors: SectorTile[]; label: string }) {
  return (
    <figure aria-describedby="heatmap-label" data-loop>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {sectors.map((s, i) => (
          <div
            key={s.name}
            className="ae-tile rounded-xl border border-line px-4 py-4"
            style={{ background: tileBackground(s.bps), "--i": i } as React.CSSProperties}
          >
            <p className="text-sm font-medium text-ink">{s.name}</p>
            <p className="ae-num mt-1.5 text-sm text-ink-muted">
              <span aria-hidden="true" className={s.bps >= 0 ? "ae-tick-up" : "ae-tick-down"}>
                {s.bps >= 0 ? "▲" : "▼"}
              </span>{" "}
              {formatBps(s.bps)}
            </p>
          </div>
        ))}
      </div>
      <figcaption id="heatmap-label" className="mt-2 text-xs text-ink-subtle">
        {label}
      </figcaption>
    </figure>
  );
}
