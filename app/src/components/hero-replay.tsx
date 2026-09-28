"use client";

/**
 * The hero's animated interior (website/docs/05 §3): a sliding candle window
 * plus ticking watchlist rows, driven by the deterministic script in
 * hero-data.ts.
 *
 * Behavioural rules, all from the design docs:
 *  - SSR renders the initial window, so no-JS visitors and the LCP get a
 *    complete, labelled frame; animation is enhancement only.
 *  - `prefers-reduced-motion` ⇒ the timers never start; the static frame IS
 *    the experience (docs/04 §5), not a degraded one.
 *  - `document.hidden` pauses the timers — ambience should not burn a
 *    background tab's battery.
 *  - Data animates; chrome does not. No panel motion, only candles and
 *    prices (docs/04 §5 "the hero animates data, not chrome").
 */

import { type ReactNode, useEffect, useRef, useState } from "react";
import {
  INITIAL_CANDLES,
  SCRIPT,
  VIEW_H,
  VIEW_W,
  WATCH_ROWS,
  WINDOW,
  type Candle,
} from "@/components/hero-data";

const CANDLE_MS = 900;
const TICK_MS = 1100;
const FLASH_MS = 450;
const EMA_PERIOD = 9;

// EMA over the whole script once, so a sliding window never restarts the
// average (a restarted EMA would visibly kink at the left edge).
const EMA: number[] = (() => {
  const k = 2 / (EMA_PERIOD + 1);
  const out: number[] = [];
  SCRIPT.forEach((c, i) => out.push(i === 0 ? c.c : c.c * k + out[i - 1] * (1 - k)));
  return out;
})();

function formatValue(value: number, decimals: number): string {
  return value.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

interface WatchState {
  value: number;
  pct: string;
  up: boolean;
  flash: "up" | "down" | null;
}

export function HeroReplayCanvas({ children }: { children?: ReactNode }) {
  const [offset, setOffset] = useState(0);
  const [watch, setWatch] = useState<WatchState[]>(() =>
    // SSR/first paint: scripted first step, no flash — identical on server
    // and client, so hydration has nothing to disagree about.
    WATCH_ROWS.map((row) => ({
      value: row.base,
      pct: row.steps[0].pct,
      up: row.steps[0].up,
      flash: null,
    })),
  );
  const stepRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let candleTimer: ReturnType<typeof setInterval> | null = null;
    let tickTimer: ReturnType<typeof setInterval> | null = null;
    let flashTimer: ReturnType<typeof setTimeout> | null = null;

    const start = () => {
      if (candleTimer) return;
      candleTimer = setInterval(() => {
        setOffset((o) => (o + 1) % (SCRIPT.length - WINDOW));
      }, CANDLE_MS);
      tickTimer = setInterval(() => {
        const step = ++stepRef.current;
        const rowIndex = step % WATCH_ROWS.length;
        const row = WATCH_ROWS[rowIndex];
        const scripted = row.steps[step % row.steps.length];
        setWatch((prev) =>
          prev.map((s, i) =>
            i === rowIndex
              ? {
                  value: Math.max(0, s.value + scripted.delta),
                  pct: scripted.pct,
                  up: scripted.up,
                  flash: scripted.up ? "up" : "down",
                }
              : s,
          ),
        );
        flashTimer = setTimeout(() => {
          setWatch((prev) => prev.map((s, i) => (i === rowIndex ? { ...s, flash: null } : s)));
        }, FLASH_MS);
      }, TICK_MS);
    };
    const stop = () => {
      if (candleTimer) clearInterval(candleTimer);
      if (tickTimer) clearInterval(tickTimer);
      if (flashTimer) clearTimeout(flashTimer);
      candleTimer = null;
      tickTimer = null;
      flashTimer = null;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const candles: Candle[] = offset === 0 ? INITIAL_CANDLES : SCRIPT.slice(offset, offset + WINDOW);

  const ema = EMA.slice(offset, offset + WINDOW);
  // Autoscale to the visible window (a terminal chart does the same), so
  // the candles fill the frame instead of hugging one band of it.
  const lo = Math.min(...candles.map((k) => k.l), ...ema);
  const hi = Math.max(...candles.map((k) => k.h), ...ema);
  const PAD = 12;
  const y = (price: number) => PAD + ((hi - price) / (hi - lo || 1)) * (VIEW_H - 2 * PAD);
  const emaPath = ema
    .map((v, i) => `${i === 0 ? "M" : "L"}${i * 20 + 10},${y(v).toFixed(1)}`)
    .join(" ");

  return (
    <>
      <div className="relative px-4 pb-1 pt-3">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label="Candlestick chart replaying simulated illustration data, not live quotes"
          className="block w-full"
          preserveAspectRatio="none"
          style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
        >
          {[0.2, 0.4, 0.6, 0.8].map((f) => (
            <line
              key={f}
              x1="0"
              x2={VIEW_W}
              y1={VIEW_H * f}
              y2={VIEW_H * f}
              stroke="var(--ae-chart-grid)"
              strokeWidth="1"
            />
          ))}
          {candles.map((k, i) => {
            const cx = i * 20 + 10;
            const up = k.c >= k.o;
            const top = y(Math.max(k.o, k.c));
            const bodyH = Math.max(2, Math.abs(y(k.o) - y(k.c)));
            const newest = i === candles.length - 1;
            return (
              <g key={`${offset}-${i}`} className={up ? "text-up" : "text-down"}>
                <line
                  x1={cx}
                  x2={cx}
                  y1={y(k.h)}
                  y2={y(k.l)}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x={cx - 5}
                  y={top}
                  width="10"
                  height={bodyH}
                  fill="currentColor"
                  rx="1.5"
                  opacity={newest ? 0.85 : 1}
                />
              </g>
            );
          })}
          <path
            className="ae-draw"
            d={emaPath}
            fill="none"
            stroke="var(--ae-link)"
            strokeWidth="2"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="ae-num absolute left-5 top-4 text-[11px] text-ink-subtle">
          EMA {EMA_PERIOD} <span className="text-link">━</span>
        </span>
      </div>

      <div className="grid gap-3 px-4 pb-4 pt-2 sm:grid-cols-2">
        <div className="overflow-hidden rounded-[10px] border border-line bg-sunk">
          <p className="border-b border-line px-3 py-2.5 text-[11px] uppercase tracking-[0.06em] text-ink-subtle">
            Watchlist
          </p>
          <ul className="divide-y divide-line">
            {WATCH_ROWS.map((row, i) => {
              const s = watch[i];
              return (
                <li
                  key={row.name}
                  className={`flex items-center gap-2 px-3 py-2 text-[13px] ${
                    s.flash === "up" ? "flash-up" : s.flash === "down" ? "flash-down" : ""
                  }`}
                >
                  <span className="grow text-ink">{row.name}</span>
                  <span className="ae-num w-[88px] text-right text-ink">
                    {formatValue(s.value, row.decimals)}
                  </span>
                  <span className={`ae-num w-16 text-right ${s.up ? "text-up" : "text-down"}`}>
                    {s.pct}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        {children}
      </div>
    </>
  );
}
