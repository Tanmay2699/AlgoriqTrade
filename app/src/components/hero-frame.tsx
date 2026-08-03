import { HeroReplayCanvas } from "@/components/hero-replay";

/**
 * The hero's terminal vignette (website/docs/05 §3): server-rendered frame
 * chrome — header, SIMULATED badge, caption — around the client replay
 * canvas. The canvas SSRs its initial frame, so no-JS visitors and the LCP
 * get a complete labelled vignette; the animation is enhancement.
 *
 * Data-honesty rules (website/docs/04 §7): the badge and caption are part of
 * this component, not the page, so no future composition can render the
 * canvas without its label.
 */
export function HeroFrame() {
  return (
    <figure
      aria-describedby="hero-frame-caption"
      className="overflow-hidden rounded-xl border border-line bg-panel shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-up" />
        <p className="text-xs font-medium text-ink-muted">AlphaEdge Terminal</p>
        <span className="ml-auto rounded border border-warn-soft bg-warn-soft px-2 py-0.5">
          <span className="text-xs font-semibold tracking-wide text-warn-ink">
            SIMULATED DATA
          </span>
        </span>
      </div>

      <HeroReplayCanvas />

      <figcaption
        id="hero-frame-caption"
        className="border-t border-line px-4 py-2 text-xs text-ink-subtle"
      >
        Simulated data for illustration — not live quotes.
      </figcaption>
    </figure>
  );
}
