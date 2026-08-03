/**
 * Liveness/readiness probe target (the chart's probes point here, matching
 * apps/web's /api/health). Deliberately dependency-free: the site must be
 * "up" even when billing/recs upstreams are absent — their absence renders
 * honest unavailable states, it does not make the site unhealthy.
 */

export const dynamic = "force-dynamic";

export function GET(): Response {
  return Response.json({ status: "ok" });
}
