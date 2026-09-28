import path from "node:path";
import type { NextConfig } from "next";

/**
 * Security headers (website/docs/07 §4).
 *
 * Unlike apps/web, every route here is anonymous and static-first, so the CSP
 * can be a static header — no per-request nonce, no middleware, and therefore
 * no forced dynamic rendering (the trade apps/web documents in its
 * `src/lib/csp.ts` is exactly the one this app exists to avoid).
 *
 * `script-src` honesty note: docs/07 planned `'self'` plus a hash for the
 * theme bootstrap. Two facts changed that at build time: (1) the bootstrap is
 * now an *external* file (`/theme-init.js`), so it needs no hash — but (2)
 * Next.js emits inline `self.__next_f.push(...)` flight-data scripts into
 * every prerendered page, and those cannot be hash-enumerated by supported
 * tooling. Until W4 revisits this (nonce middleware would work but costs
 * static rendering), `'unsafe-inline'` stays for scripts, recorded as a known
 * gap in website/docs/07 Open questions. Everything else is strict, and this
 * site has no auth, no cookies, and renders no user-supplied content.
 */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // See the file note: inline flight-data scripts force 'unsafe-inline'
      // until the W4 CSP pass. No third-party script origin is allowed either
      // way — the zero-third-party budget (docs/07 §1.4) is what this
      // directive actually enforces.
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

async function headers() {
  return [{ source: "/:path*", headers: SECURITY_HEADERS }];
}

// Vercel packages the app itself and must trace from inside the cloned repo;
// the standalone bundle and the monorepo tracing root are for the Docker
// image only (on Vercel "../.." resolves outside the checkout and the build
// fails at "Collecting build traces").
const DOCKER_BUILD = !process.env.VERCEL;

const nextConfig: NextConfig = {
  ...(DOCKER_BUILD && {
    // Same deployment shape as apps/web: a self-contained server bundle the
    // Dockerfile copies and runs, promoted by digest (docs/07 §9).
    output: "standalone",

    // pnpm hoists to the repo root two levels up; without this the traced
    // standalone bundle misses hoisted dependencies.
    outputFileTracingRoot: path.join(import.meta.dirname, "../.."),
  }),

  headers,
};

export default nextConfig;
