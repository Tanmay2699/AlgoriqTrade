import { HeroReplayCanvas } from "@/components/hero-replay";
import chargesExample from "@/lib/charges-example.gen.json";
import { formatPaise } from "@/lib/money";

/**
 * The hero's terminal vignette (website/docs/05 §3): server-rendered frame
 * chrome — header, SIMULATED badge, caption — around the client replay
 * canvas. The canvas SSRs its initial frame, so no-JS visitors and the LCP
 * get a complete labelled vignette; the animation is enhancement.
 *
 * Data-honesty rules (website/docs/04 §7): the badge and caption are part of
 * this component, not the page, so no future composition can render the
 * canvas without its label. The paper-order card's charges are the charges
 * engine's generated example (buy side of the ₹1 lakh MIS round trip), not
 * numbers typed into the design.
 */

const BUY_LINES = chargesExample.lines.filter((l) => l.buy_paise > 0 || l.label === "STT");
const NOTIONAL = formatPaise(chargesExample.inputs.notional_paise_per_side).replace(".00", "");

export function HeroFrame() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="ae-aurora -left-6 -top-10 h-[520px] w-full max-w-[640px]" />
      <figure
        aria-describedby="hero-frame-caption"
        className="ae-rise ae-d2 relative overflow-hidden rounded-2xl border border-line bg-panel/90 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.06),var(--ae-shadow)]"
      >
        <div className="flex h-12 items-center gap-3 border-b border-line px-4">
          <p className="text-[13px] font-semibold text-ink">NIFTY 50</p>
          <span className="ae-num text-xs text-ink-subtle">5m</span>
          <span className="ae-pill ml-auto">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-link" />
            SIMULATED DATA
          </span>
        </div>

        <HeroReplayCanvas>
          <div className="flex flex-col gap-2 rounded-[10px] border border-line-strong bg-accent-soft/40 p-3">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ae-link)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l2.5 2.5L16 9.5" />
              </svg>
              Paper order filled
              <span className="ae-num ml-auto text-[11px] font-normal text-ink-subtle">
                BUY · {chargesExample.inputs.exchange} · {chargesExample.inputs.product}
              </span>
            </p>
            <dl className="ae-num grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11.5px] text-ink-muted">
              {BUY_LINES.map((l) => (
                <div key={l.label} className="contents">
                  <dt>{l.label === "Exchange transaction" ? "Exchange txn" : l.label}</dt>
                  <dd className="text-right">{formatPaise(l.buy_paise)}</dd>
                </div>
              ))}
            </dl>
            <p className="ae-num flex justify-between border-t border-line pt-1.5 text-[12.5px] text-ink">
              <span>Buy-side charges on {NOTIONAL}</span>
              <span className="font-semibold">{formatPaise(chargesExample.buy_total_paise)}</span>
            </p>
          </div>
        </HeroReplayCanvas>

        <figcaption
          id="hero-frame-caption"
          className="border-t border-line px-4 py-2.5 text-[11.5px] text-ink-subtle"
        >
          Simulated data for illustration — not live quotes.
        </figcaption>
      </figure>
    </div>
  );
}
