/**
 * NSE equity intraday (MIS) charge stack for the homepage calculator, in
 * integer paise with half-up rounding — the engine's conventions (CL-002).
 *
 * This is a mirror, not a second source of truth: rates are the FY26
 * schedule packages/charges uses, and scripts/check-charges.mjs fails the
 * build if these formulas stop reproducing the engine's own generated
 * example (charges-example.gen.json) to the paisa. When the schedule
 * changes, regenerate the example and this check tells you to update here.
 */

export interface ChargeLine {
  label: string;
  buy: number; // paise
  sell: number; // paise
}

export interface ChargeBreakdown {
  lines: ChargeLine[];
  buyTotal: number;
  sellTotal: number;
  roundTrip: number;
}

/** round(num / den) half-up, integers only. */
const div = (num: number, den: number) => Math.floor((2 * num + den) / (2 * den));

const BROKERAGE_PAISE = 2000; // ₹20 per executed order

export function intradayCharges(notionalPaise: number): ChargeBreakdown {
  if (!Number.isInteger(notionalPaise) || notionalPaise < 0) {
    throw new Error(`notional must be non-negative integer paise, got ${notionalPaise}`);
  }
  const n = notionalPaise;
  const exch = div(n * 297, 10_000_000); // 0.00297% per side
  const sebi = div(n, 1_000_000); // ₹10 per crore per side
  const stt = div(n * 25, 100_000); // 0.025%, sell side only
  const stamp = div(n * 3, 100_000); // 0.003%, buy side only
  const gst = div(18 * (BROKERAGE_PAISE + exch + sebi), 100); // 18% on brokerage + exch + SEBI
  const lines: ChargeLine[] = [
    { label: "Brokerage", buy: BROKERAGE_PAISE, sell: BROKERAGE_PAISE },
    { label: "STT", buy: 0, sell: stt },
    { label: "Exchange transaction", buy: exch, sell: exch },
    { label: "SEBI fee", buy: sebi, sell: sebi },
    { label: "Stamp duty", buy: stamp, sell: 0 },
    { label: "GST", buy: gst, sell: gst },
  ];
  const buyTotal = lines.reduce((a, l) => a + l.buy, 0);
  const sellTotal = lines.reduce((a, l) => a + l.sell, 0);
  return { lines, buyTotal, sellTotal, roundTrip: buyTotal + sellTotal };
}
