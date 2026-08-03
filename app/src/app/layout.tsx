import type { Metadata, Viewport } from "next";
import { RumBeacon } from "@/components/rum-beacon";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

// Public hostname is a launch-time fact (website/docs/00 Open-3); the
// fallback keeps canonicals coherent in every non-prod environment.
const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AlphaEdge — market intelligence & paper trading for Indian markets",
    template: "%s — AlphaEdge",
  },
  description:
    "Trade NSE, BSE and MCX with live data and virtual money. Honest fills, the full " +
    "Indian charge stack, an institutional-grade risk engine, and AI research gated " +
    "by a human analyst.",
  // Relative canonical + metadataBase = every route canonicalises to itself;
  // no per-page boilerplate to forget (website/docs/07 §5).
  alternates: { canonical: "./" },
  // Pre-launch: the whole site is noindex until the cutover launch gate flips
  // it (website/docs/08 §4). The cutover PR deletes this line, promotes the
  // Lighthouse SEO assertion to error, and sets AE_SITE_INDEXABLE for the
  // runtime robots.txt — one change, three locks.
  robots: { index: false, follow: false },
};

// Organization JSON-LD (07 §5): identity only — no sameAs profiles we don't
// have, no logo file we haven't shipped, and never AggregateRating.
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AlphaEdge",
  url: SITE_URL,
  description:
    "Market intelligence and paper-trading platform for Indian markets (NSE, BSE, MCX, currency derivatives, mutual funds).",
};

export const viewport: Viewport = {
  // Matches --ae-bg dark; the browser chrome should not flash white either.
  themeColor: "#09090b",
};

/**
 * Root shell. Dark is the default regardless of prefers-color-scheme (the
 * terminal's documented rule); /theme-init.js applies any stored choice
 * before first paint. It is an external, same-origin, render-blocking script
 * on purpose — that is what lets the CSP stay static (no per-request nonce,
 * no forced dynamic rendering; see next.config.ts).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-theme="dark" data-cvd="none" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- blocking by
            design: it must run before first paint or the theme flashes. */}
        <script src="/theme-init.js" />
      </head>
      <body className="min-h-screen bg-surface text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <a href="#main" className="ae-skip-link rounded bg-panel px-3 py-2 text-sm text-ink">
          Skip to content
        </a>
        <SiteNav />
        <main id="main">{children}</main>
        <SiteFooter />
        <RumBeacon />
      </body>
    </html>
  );
}
