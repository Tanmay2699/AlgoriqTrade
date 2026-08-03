/**
 * First-party RUM ingest (website/docs/07 §6) — the terminal's web-vitals
 * beacon pattern. Cookieless and identifier-free by design: the payload is
 * a metric name, a value, a route, and coarse device class — nothing that
 * could single out a visitor, which is why no consent banner is required
 * for measurement this shape (documented in /legal/privacy).
 *
 * Sink: structured stdout. Container logs are the collection path (Log
 * Analytics on AKS; `docker logs` locally) — no third-party analytics
 * runtime, and no fabricated dashboard: until the logs are wired to one,
 * the logs are the truth.
 */

export const dynamic = "force-dynamic";

const METRICS = new Set(["LCP", "CLS", "INP", "TTFB", "FCP"]);
const MAX_BODY_BYTES = 2_048;

export async function POST(request: Request): Promise<Response> {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }
  const beacon = body as { metric?: unknown; value?: unknown; route?: unknown; device?: unknown };
  if (
    typeof beacon.metric !== "string" ||
    !METRICS.has(beacon.metric) ||
    typeof beacon.value !== "number" ||
    !Number.isFinite(beacon.value) ||
    typeof beacon.route !== "string" ||
    beacon.route.length > 128
  ) {
    return new Response(null, { status: 400 });
  }
  console.log(
    JSON.stringify({
      type: "rum",
      metric: beacon.metric,
      value: Math.round(beacon.value * 1000) / 1000,
      route: beacon.route,
      device: beacon.device === "mobile" ? "mobile" : "desktop",
      at: new Date().toISOString(),
    }),
  );
  return new Response(null, { status: 204 });
}
