/**
 * Paise → display rupees, ported from apps/web/src/lib/money.ts (the parsing
 * half stays behind — this site renders money, it never accepts it). Money is
 * integer paise everywhere in AlphaEdge; the divide below is integer math on
 * the digit string, never a float.
 */

export function paiseToRupees(paise: number): string {
  if (!Number.isInteger(paise)) {
    throw new Error(`${paise} paise is not an integer — money must not be a float`);
  }
  const sign = paise < 0 ? "-" : "";
  const abs = Math.abs(paise);
  return `${sign}${Math.trunc(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

/** Indian digit grouping (lakh/crore): ₹1,23,456.50 — `en-IN`, not `en-US`. */
export function formatPaise(paise: number, { symbol = true } = {}): string {
  const [whole, fraction] = paiseToRupees(paise).replace("-", "").split(".");
  const grouped = Number(whole).toLocaleString("en-IN");
  const sign = paise < 0 ? "-" : "";
  return `${sign}${symbol ? "₹" : ""}${grouped}.${fraction}`;
}
