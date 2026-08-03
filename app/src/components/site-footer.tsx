import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Site-wide footer (website/docs/05 §2, 06 §6). The three compliance
 * paragraphs carry the same standing statements as apps/web's marketing
 * footer — not the DISC-* registry (those attach to research and simulated
 * results), but the site-wide facts: not a registered research analyst today,
 * virtual money only, data in India. This file is a declared REG-03 surface;
 * edits here are linted in CI.
 */

const LEGAL_LINKS = [
  { href: "/legal/terms", label: "Terms of use" },
  { href: "/legal/privacy", label: "Privacy (DPDP)" },
  { href: "/legal/disclaimers", label: "Disclaimers & risk disclosure" },
  { href: "/legal/refunds", label: "Refunds & cancellation" },
  { href: "/legal/grievance", label: "Grievance redressal" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <p className="text-sm font-medium text-ink">
          Virtual money. Not a broker. Not investment advice.
        </p>

        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          {LEGAL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-6 items-center text-ink-muted transition hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-3 text-xs leading-relaxed text-ink-muted">
          <p>
            AlphaEdge is a market-intelligence and paper-trading platform. Trading in
            securities is subject to market risk. Nothing on this site is investment
            advice or a recommendation to buy or sell any security. Sandbox trading uses
            virtual money only — no real orders are placed and no real funds are at risk.
          </p>
          <p>
            Research publication requires SEBI Research Analyst registration and human
            analyst review. Until both are in place no research output is published, and
            no performance figures are shown anywhere on this site.
          </p>
          <p>© AlphaEdge. Data hosted in India (DPDP Act 2023).</p>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-xs text-ink-subtle">
            Alpha<span className="text-up">Edge</span>
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
