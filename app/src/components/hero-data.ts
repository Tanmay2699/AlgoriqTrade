/**
 * The hero replay's scripted session (website/docs/05 §3).
 *
 * Everything here is deterministic: a fixed seed drives a small PRNG, so the
 * server render, the client hydration, and every visitor see the same frames
 * in the same order — there is no hydration mismatch and no per-visit
 * variance to screenshot-diff around. The data is simulated and the frame
 * says so on the canvas; determinism is what keeps that label honest and the
 * component testable.
 */

export interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}

export const VIEW_W = 480;
export const VIEW_H = 180;
export const WINDOW = 24; // candles visible at once
const PRICE_MIN = 88;
const PRICE_MAX = 142;
const SCRIPT_LEN = 96; // total scripted candles; the window slides then loops

export function priceToY(price: number): number {
  return VIEW_H - ((price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * VIEW_H;
}

/** mulberry32 — tiny deterministic PRNG; seed fixed so the script is stable. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildScript(): Candle[] {
  const rand = mulberry32(20260803);
  const out: Candle[] = [];
  let prev = 100;
  for (let i = 0; i < SCRIPT_LEN; i++) {
    const o = prev;
    // Mild drift with pullbacks; clamped so the window never clips.
    const delta = (rand() - 0.47) * 7;
    const c = Math.min(PRICE_MAX - 6, Math.max(PRICE_MIN + 6, o + delta));
    const h = Math.min(PRICE_MAX - 1, Math.max(o, c) + rand() * 4);
    const l = Math.max(PRICE_MIN + 1, Math.min(o, c) - rand() * 4);
    out.push({ o, h, l, c });
    prev = c;
  }
  return out;
}

export const SCRIPT: Candle[] = buildScript();
export const INITIAL_CANDLES: Candle[] = SCRIPT.slice(0, WINDOW);

export interface WatchRow {
  name: string;
  /** Scripted tick deltas in display units; looped. */
  base: number;
  decimals: number;
  steps: { delta: number; pct: string; up: boolean }[];
}

function buildWatch(name: string, base: number, decimals: number, seed: number): WatchRow {
  const rand = mulberry32(seed);
  const steps = Array.from({ length: 32 }, () => {
    const up = rand() > 0.45;
    const magnitude = rand() * base * 0.0012;
    const pctValue = (rand() * 0.9 + 0.05).toFixed(2);
    return { delta: up ? magnitude : -magnitude, pct: `${up ? "+" : "−"}${pctValue}%`, up };
  });
  return { name, base, decimals, steps };
}

export const WATCH_ROWS: WatchRow[] = [
  buildWatch("NIFTY 50", 24812.4, 2, 11),
  buildWatch("BANKNIFTY", 51204.15, 2, 22),
  buildWatch("RELIANCE", 2931.55, 2, 33),
];
