"use client";

/**
 * Charges calculator (redesign board "NEW · charges calculator"). The same
 * formulas that reproduce the engine's generated example to the paisa
 * (scripts/check-charges.mjs) rendered for four trade sizes and three views.
 *
 * Motion: until a visitor touches a control it autoplays like a short
 * video — size steps up, the stacked bar re-divides, every figure tweens to
 * its new value. It pauses offscreen and in background tabs, and under
 * prefers-reduced-motion it never starts: the static ₹1 lakh state is the
 * experience. SSR renders that same state, so no-JS visitors get a
 * complete table.
 */

import { useEffect, useRef, useState } from "react";
import { intradayCharges, type ChargeBreakdown } from "@/lib/charges";
import { formatPaise } from "@/lib/money";

const SIZES = [
  { label: "₹1 lakh", paise: 10_000_000 },
  { label: "₹2.5 lakh", paise: 25_000_000 },
  { label: "₹5 lakh", paise: 50_000_000 },
  { label: "₹10 lakh", paise: 100_000_000 },
] as const;
const VIEWS = ["Buy side", "Sell side", "Round trip"] as const;
const TITLES = ["Buy-side", "Sell-side", "Round-trip"] as const;

// Autoplay script: climb the sizes on the round trip, then show the two
// sides of the biggest trade — the asymmetry (STT sells, stamp buys) is
// the lesson.
const SCRIPT: readonly [number, number][] = [
  [0, 2], [1, 2], [2, 2], [3, 2], [3, 0], [3, 1],
];
const STEP_MS = 3200;
const TWEEN_MS = 520;

const BREAKDOWNS = SIZES.map((s) => intradayCharges(s.paise));

function part(b: ChargeBreakdown, i: number, view: number) {
  const l = b.lines[i];
  return view === 0 ? l.buy : view === 1 ? l.sell : l.buy + l.sell;
}
function total(b: ChargeBreakdown, view: number) {
  return view === 0 ? b.buyTotal : view === 1 ? b.sellTotal : b.roundTrip;
}

/** Interpolated breakdown between two states, integer paise throughout. */
function lerp(a: ChargeBreakdown, b: ChargeBreakdown, t: number): ChargeBreakdown {
  const m = (x: number, y: number) => Math.round(x + (y - x) * t);
  const lines = a.lines.map((l, i) => ({
    label: l.label,
    buy: m(l.buy, b.lines[i].buy),
    sell: m(l.sell, b.lines[i].sell),
  }));
  return {
    lines,
    buyTotal: m(a.buyTotal, b.buyTotal),
    sellTotal: m(a.sellTotal, b.sellTotal),
    roundTrip: m(a.roundTrip, b.roundTrip),
  };
}

function Pill({
  on,
  onClick,
  children,
  mono = false,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`${mono ? "ae-num" : ""} h-11 rounded-[10px] border px-4 text-sm font-medium transition-colors ${
        on
          ? "border-ring bg-accent-soft text-ink-strong shadow-[0_0_18px_color-mix(in_oklab,var(--ae-glow)_22%,transparent)]"
          : "border-line bg-sunk text-ink-muted hover:border-line-strong hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function ChargesCalculator() {
  const [size, setSize] = useState(0);
  const [view, setView] = useState(2);
  const [auto, setAuto] = useState(false); // armed after mount, if motion is allowed
  const [shown, setShown] = useState<ChargeBreakdown>(BREAKDOWNS[0]);
  const [tick, setTick] = useState(0); // restarts the row flash on each change
  const rootRef = useRef<HTMLDivElement>(null);
  const shownRef = useRef(shown);
  shownRef.current = shown;

  // Arm autoplay only when motion is allowed.
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setAuto(true);
  }, []);

  // Tween every figure from what is on screen to the new target.
  useEffect(() => {
    const target = BREAKDOWNS[size];
    const from = shownRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = Math.min(1, (now - t0) / TWEEN_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(t < 1 ? lerp(from, target, eased) : target);
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    setTick((k) => k + 1);
    return () => cancelAnimationFrame(raf);
  }, [size]);

  // Autoplay: step the script while visible and the tab is foreground.
  useEffect(() => {
    if (!auto) return;
    let step = SCRIPT.findIndex(([s, v]) => s === size && v === view);
    let timer: ReturnType<typeof setInterval> | null = null;
    let visible = false;
    const run = () => {
      if (timer || !visible || document.hidden) return;
      timer = setInterval(() => {
        step = (step + 1) % SCRIPT.length;
        const [s, v] = SCRIPT[step];
        setSize(s);
        setView(v);
      }, STEP_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) run();
      else stop();
    });
    if (rootRef.current) io.observe(rootRef.current);
    const onVis = () => (document.hidden ? stop() : run());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the script owns size/view while auto
  }, [auto]);

  const pickSize = (i: number) => {
    setAuto(false);
    setSize(i);
  };
  const pickView = (i: number) => {
    setAuto(false);
    setView(i);
  };

  const shownTotal = total(shown, view);
  const exact = BREAKDOWNS[size];
  const breakeven = ((exact.roundTrip / SIZES[size].paise) * 100).toFixed(3);

  return (
    <div ref={rootRef} className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="flex flex-col gap-6 lg:col-span-4">
        <fieldset>
          <legend className="ae-num mb-3 text-xs uppercase tracking-[0.06em] text-ink-subtle">
            Notional per side
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {SIZES.map((s, i) => (
              <Pill key={s.label} mono on={i === size} onClick={() => pickSize(i)}>
                {s.label}
              </Pill>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="ae-num mb-3 text-xs uppercase tracking-[0.06em] text-ink-subtle">
            Show
          </legend>
          <div className="flex flex-wrap gap-2">
            {VIEWS.map((v, i) => (
              <Pill key={v} on={i === view} onClick={() => pickView(i)}>
                {v}
              </Pill>
            ))}
          </div>
        </fieldset>
        <p className="text-sm leading-relaxed text-ink-subtle">
          NSE equity intraday (MIS). F&amp;O, MCX (CTT, not STT) and delivery follow the
          same engine.
        </p>
        {auto ? (
          <button
            type="button"
            onClick={() => setAuto(false)}
            className="ae-pill self-start"
            aria-label="Stop the demo and pick values yourself"
          >
            <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-link" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-link" />
            </span>
            AUTO-PLAYING · TAP ANY OPTION
          </button>
        ) : null}
      </div>

      <div className="rounded-2xl border border-line bg-panel p-5 md:p-7 lg:col-span-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className="text-sm text-ink-muted">
              {TITLES[view]} charges on {SIZES[size].label} per side
            </p>
            <p className="ae-num mt-1 text-4xl tracking-[-0.02em] text-ink-strong md:text-5xl" aria-live="polite">
              {formatPaise(shownTotal)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-muted">Break-even move, round trip</p>
            <p className="ae-num mt-1 text-2xl text-[color:var(--ae-accent-soft-ink)]">{breakeven}%</p>
          </div>
        </div>

        {/* Stacked share bar — decoration; the table below carries the data. */}
        <div aria-hidden="true" className="mt-5 flex h-3 overflow-hidden rounded-full bg-sunk">
          {shown.lines.map((l, i) => {
            const share = shownTotal ? (part(shown, i, view) / shownTotal) * 100 : 0;
            return (
              <span
                key={l.label}
                className="h-full transition-[width] duration-500 ease-out"
                style={{ width: `${share}%`, background: `var(--ae-seg-${i + 1})` }}
              />
            );
          })}
        </div>

        <table className="mt-5 w-full border-collapse text-sm">
          <caption className="sr-only">
            Charges by line on a {SIZES[size].label} NSE intraday trade, buy and sell side
          </caption>
          <thead>
            <tr className="ae-num text-left text-[11px] uppercase tracking-[0.06em] text-ink-subtle">
              <th scope="col" className="py-2 font-normal">Charge</th>
              <th scope="col" className="py-2 text-right font-normal">Buy</th>
              <th scope="col" className="py-2 text-right font-normal">Sell</th>
            </tr>
          </thead>
          <tbody key={tick} className="ae-calc-rows">
            {shown.lines.map((l, i) => (
              <tr key={l.label} className="border-t border-line" style={{ "--i": i } as React.CSSProperties}>
                <th scope="row" className="py-2.5 text-left font-normal text-ink">
                  <span className="inline-flex items-center gap-2.5">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ background: `var(--ae-seg-${i + 1})` }} />
                    {l.label}
                  </span>
                </th>
                <td className={`ae-num py-2.5 text-right transition-colors ${view === 1 ? "text-ink-subtle/60" : "text-ink"}`}>
                  {formatPaise(l.buy)}
                </td>
                <td className={`ae-num py-2.5 text-right transition-colors ${view === 0 ? "text-ink-subtle/60" : "text-ink"}`}>
                  {formatPaise(l.sell)}
                </td>
              </tr>
            ))}
            <tr className="border-t border-line-strong">
              <th scope="row" className="py-3 text-left font-semibold text-ink-strong">Total</th>
              <td className="ae-num py-3 text-right font-semibold text-ink-strong">{formatPaise(shown.buyTotal)}</td>
              <td className="ae-num py-3 text-right font-semibold text-ink-strong">{formatPaise(shown.sellTotal)}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 text-xs leading-relaxed text-ink-subtle">
          Brokerage ₹20 per order; GST 18% on brokerage, exchange and SEBI fee; STT on
          the sell side, stamp duty on the buy side. Checked in CI against the charges
          engine&apos;s own generated example, to the paisa.
        </p>
      </div>
    </div>
  );
}
