import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeButton } from "@/components/theme-toggle";

/**
 * Public site header (website/docs/05 §2). Server-rendered, session-free —
 * this site has no auth and must render identically for everyone. Full link
 * set per the site map (03 §1); a nav entry never points at a route that
 * 404s. Below `md` the secondary links yield to the footer's complete list
 * rather than a JS sheet — the nav must work with JS disabled (07 §3).
 *
 * Liquid glass: a floating, blurred slab (`.ae-glass`) inset from the
 * viewport edges. The tint is dense enough that text beneath never competes
 * with the links, and a browser without backdrop-filter gets an opaque bar.
 * The outer header is click-through so the transparent gutter around the
 * slab never swallows taps on the page below.
 */
const LINKS = [
  { href: "/pricing", label: "Pricing", always: true },
  { href: "/track-record", label: "Track record", always: false },
  { href: "/security", label: "Security", always: false },
  { href: "/how-its-built", label: "How it's built", always: false },
] as const;

export function SiteNav() {
  return (
    <header className="pointer-events-none sticky top-0 z-50 pt-3 md:pt-4">
      <div className="ae-container">
        <div className="ae-glass pointer-events-auto flex h-16 items-center gap-3 pl-4 pr-2 sm:gap-6 md:h-[68px] md:gap-10 md:pl-6 md:pr-3">
          <Link href="/" aria-label="Algoryq Trade home" className="inline-flex min-h-6 items-center">
            <Logo />
          </Link>
          <nav aria-label="Site" className="flex gap-7 text-sm max-sm:ml-auto">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${link.always ? "inline-flex" : "hidden md:inline-flex"} ae-nl min-h-6 items-center`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:ml-auto md:gap-3">
            <ThemeButton />
            <Link href="/waitlist" className="ae-btn ae-btn-sm">
              <span className="max-sm:hidden">Join early access</span>
              <span className="sm:hidden">Join</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
