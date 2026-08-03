import type { MetadataRoute } from "next";

// Public hostname is a launch-time fact (website/docs/00 Open-3); until then
// the env var keeps this file environment-agnostic, matching the
// runtime-config-over-baked-values rule.
const BASE = process.env.SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/pricing",
    "/track-record",
    "/security",
    "/how-its-built",
    "/live-trading",
    "/waitlist",
    "/legal/terms",
    "/legal/privacy",
    "/legal/disclaimers",
    "/legal/refunds",
    "/legal/grievance",
  ].map((path) => ({ url: `${BASE}${path}` }));
}
