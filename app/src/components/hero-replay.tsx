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

import { useEffect, useRef, useState } from "react";
import {
  INITIAL_CANDLES,
  priceToY,
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

export function HeroReplayCanvas() {
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

  return (
    <div className="grid gap-0 md:grid-cols-[1fr_180px]">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label="Candlestick chart replaying simulated illustration data, not live quotes"
        className="block w-full"
        preserveAspectRatio="none"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
      >
        {[0.25, 0.5, 0.75].map((f) => (
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
          const top = priceToY(Math.max(k.o, k.c));
          const bodyH = Math.max(2, Math.abs(priceToY(k.o) - priceToY(k.c)));
          const newest = i === candles.length - 1;
          return (
            <g key={`${offset}-${i}`} className={up ? "text-up" : "text-down"}>
              <line
                x1={cx}
                x2={cx}
                y1={priceToY(k.h)}
                y2={priceToY(k.l)}
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x={cx - 5}
                y={top}
                width="10"
                height={bodyH}
                fill="currentColor"
                rx="1"
                opacity={newest ? 0.85 : 1}
              />
            </g>
          );
        })}
      </svg>

      <ul className="divide-y divide-line border-t border-line md:border-l md:border-t-0">
        {WATCH_ROWS.map((row, i) => {
          const s = watch[i];
          return (
            <li
              key={row.name}
              className={`flex items-center justify-between gap-2 px-3 py-2.5 ${
                s.flash === "up" ? "flash-up" : s.flash === "down" ? "flash-down" : ""
              }`}
            >
              <div>
                <p className="text-xs font-medium text-ink">{row.name}</p>
                <p className="tabular text-xs text-ink-muted">
                  {formatValue(s.value, row.decimals)}
                </p>
              </div>
              <span
                className={`tabular rounded px-1.5 py-0.5 text-xs font-medium ${
                  s.up ? "bg-up-soft text-up-ink" : "bg-down-soft text-down-ink"
                }`}
              >
                {s.pct}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
