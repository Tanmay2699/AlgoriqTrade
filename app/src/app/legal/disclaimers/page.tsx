import type { Metadata } from "next";
import { DISCLAIMERS } from "@/lib/disclaimers.gen";
import { LegalShell } from "../_shared";

export const metadata: Metadata = {
  title: "Disclaimers & risk disclosure",
  description:
    "The canonical Algoryq Trade disclaimer registry and standing risk disclosures.",
};

/**
 * Renders the full canonical registry, verbatim — template slots like
 * {ra_name} are shown as slots on purpose: this page documents the exact
 * wording each surface carries and the version it carries it at. The
 * registry is compliance-owned YAML; this page cannot drift from it because
 * the module it renders is generated from that file and freshness-checked in
 * CI (website/docs/06 §1).
 */
export default function DisclaimersPage() {
  return (
    <LegalShell
      title="Disclaimers & risk disclosure"
      lede="Every research, simulation and performance surface on Algoryq Trade carries one of the disclaimers below, pinned by id and version."
    >
      <h2>Standing disclosures</h2>
      <p>
        Investment in securities markets is subject to market risks. Algoryq Trade is a
        market-intelligence and paper-trading platform — not a broker, and not (today)
        a SEBI-registered Research Analyst. Research publication requires that
        registration and a human analyst&apos;s approval; until both are in place, no
        research output is published and no performance figures appear on this site.
        Sandbox trading uses virtual money only.
      </p>

      <h2>The disclaimer registry</h2>
      <p>
        Wording is canonical and owned by compliance. Template slots such as{" "}
        <code className="rounded bg-panel px-1 py-0.5 text-xs">{"{ra_name}"}</code> are
        filled at render time; during dark launch they read &ldquo;registration
        pending&rdquo;.
      </p>
      <dl className="space-y-6">
        {Object.entries(DISCLAIMERS).map(([key, entry]) => (
          <div key={key} className="rounded-2xl border border-line bg-panel p-5">
            <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-semibold text-ink">{key}</span>
              <span className="tabular text-xs text-ink-subtle">
                {entry.id} · v{entry.version}
              </span>
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{entry.text}</dd>
          </div>
        ))}
      </dl>
    </LegalShell>
  );
}
