import Link from "next/link";

/**
 * Public site header (website/docs/05 §2). Server-rendered, session-free —
 * this site has no auth and must render identically for everyone. Full link
 * set per the site map (03 §1); a nav entry never points at a route that
 * 404s. Below `sm` the secondary links yield to the footer's complete list
 * rather than a JS sheet — the nav must work with JS disabled (07 §3).
 *
 * `min-h-6` on inline links: WCAG 2.2 AA 2.5.8 (24px), the fix apps/web's
 * marketing header documents. The bar is opaque below `md` for the same
 * reason the terminal's tab bar is — translucency makes occluded controls
 * look tappable.
 */
const LINKS = [
  { href: "/pricing", label: "Pricing", always: true },
  { href: "/track-record", label: "Track record", always: false },
  { href: "/security", label: "Security", always: false },
  { href: "/how-its-built", label: "How it's built", always: false },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 max-md:bg-surface">
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-3">
        <Link
          href="/"
          className="inline-flex min-h-6 items-center text-lg font-bold tracking-tight text-ink"
        >
          Alpha<span className="text-up">Edge</span>
        </Link>
        <nav aria-label="Site" className="flex gap-4 text-sm">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${link.always ? "inline-flex" : "hidden md:inline-flex"} min-h-6 items-center text-ink-muted transition hover:text-ink`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/waitlist"
          className="ml-auto rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
        >
          Join early access
        </Link>
      </div>
    </header>
  );
}
