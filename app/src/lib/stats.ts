/** Wilson score interval — the interval the scorecard publishes (CL-012). */
export function wilson(hits: number, n: number, z = 1.96): { rate: number; low: number; high: number } {
  if (n <= 0) return { rate: 0, low: 0, high: 0 };
  const p = hits / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denom;
  const margin = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return { rate: p, low: Math.max(0, centre - margin), high: Math.min(1, centre + margin) };
}
