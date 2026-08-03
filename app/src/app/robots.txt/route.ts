/**
 * Runtime robots.txt (replaces the build-time robots.ts): the crawl gate
 * must be a per-request decision because images are promoted by digest —
 * one build serves staging and prod, so a value baked at build time would
 * either open staging to crawlers or keep prod closed forever.
 *
 * Default is disallow-all. The cutover launch gate (website/docs/08 §4)
 * sets AE_SITE_INDEXABLE=true in prod values only, in the same change that
 * deletes the layout's noindex meta and promotes the Lighthouse SEO
 * assertion to error.
 */

export const dynamic = "force-dynamic";

export function GET(): Response {
  const indexable = process.env.AE_SITE_INDEXABLE === "true";
  const site = process.env.SITE_URL ?? "http://localhost:3000";
  const body = indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`
    : "User-agent: *\nDisallow: /\n";
  return new Response(body, {
    headers: { "content-type": "text/plain", "cache-control": "no-store" },
  });
}
