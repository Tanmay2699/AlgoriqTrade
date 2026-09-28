import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Site-wide footer (website/docs/05 §2, 06 §6). The three compliance
 * paragraphs carry the same standing statements as apps/web's marketing
 * footer — not the DISC-* registry (those attach to research and simulated
 * results), but the site-wide facts: not a registered research analyst today,
 * virtual money only, data in India. This file is a declared REG-03 surface;
 * edits here are linted in CI.
 */

const PRODUCT_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/track-record", label: "Track record" },
  { href: "/security", label: "Security" },
  { href: "/how-its-built", label: "How it's built" },
  { href: "/live-trading", label: "Live trading" },
  { href: "/waitlist", label: "Early access" },
] as const;

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms of use" },
  { href: "/legal/privacy", label: "Privacy (DPDP)" },
  { href: "/legal/disclaimers", label: "Disclaimers & risk disclosure" },
  { href: "/legal/refunds", label: "Refunds & cancellation" },
  { href: "/legal/grievance", label: "Grievance redressal" },
] as const;

function LinkColumn({
  label,
  links,
}: {
  label: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <nav aria-label={label} className="flex flex-col gap-2.5 text-sm">
      <p className="ae-num text-xs uppercase tracking-[0.06em] text-ink-subtle">{label}</p>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="ae-nl inline-flex min-h-6 items-center self-start">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-line">
      <div className="ae-container flex flex-col gap-10 pb-12 pt-16">
        <div className="flex flex-col gap-10 md:flex-row md:gap-20">
          <div className="flex max-w-[360px] flex-col gap-3">
            <Logo />
            <p className="text-sm leading-relaxed text-ink-subtle">
              Paper trading and market intelligence for Indian markets.
            </p>
            <p className="text-sm font-medium text-ink">
              Virtual money. Not a broker. Not investment advice.
            </p>
          </div>
          <LinkColumn label="Product" links={PRODUCT_LINKS} />
          <LinkColumn label="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="max-w-[860px] space-y-3 border-t border-line pt-6 text-xs leading-relaxed text-ink-subtle">
          <p>
            Algoryq Trade is a market-intelligence and paper-trading platform. Trading in
            securities is subject to market risk. Nothing on this site is investment
            advice or a recommendation to buy or sell any security. Sandbox trading uses
            virtual money only — no real orders are placed and no real funds are at risk.
          </p>
          <p>
            Research publication requires SEBI Research Analyst registration and human
            analyst review. Until both are in place no research output is published, and
            no performance figures are shown anywhere on this site.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-ink-subtle">
            © Algoryq Trade. Data hosted in India (DPDP Act 2023).
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
