import { WithClaims } from "@/components/claims";

/**
 * Stat tile (website/docs/05 §4, 04 §7.6): the consolidation of the
 * terminal's three near-identical KPI tiles, with the marketing-side rule
 * added — every tile declares whether its number is *measured* (verified in
 * CI / code, claims-ledger-linked) or a *budget* (a target we hold ourselves
 * to). The SKIPPED-check lesson applied to marketing numbers: a reader must
 * be able to tell the two apart at a glance.
 */

export interface StatTileProps {
  value: string;
  label: string;
  sub?: string;
  kind: "measured" | "budget";
  /** Soft blue breathing ring — reserved for the numbers CI re-proves. */
  featured?: boolean;
}

export function StatTile({ value, label, sub, kind, featured = false }: StatTileProps) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-[14px] bg-panel p-6 md:p-7 ${
        featured ? "ae-pulse" : "border border-line"
      }`}
    >
      <p className="ae-num text-4xl tracking-[-0.03em] text-ink-strong md:text-[44px]">{value}</p>
      <p className="text-sm font-medium text-ink">{label}</p>
      {sub ? (
        <p className="text-xs leading-relaxed text-ink-muted">
          <WithClaims text={sub} />
        </p>
      ) : null}
      <p className="ae-num mt-auto pt-3 text-[11px] uppercase tracking-[0.06em] text-ink-subtle">
        {kind === "measured" ? "Verified in code & CI" : "Budget — enforced target"}
      </p>
    </div>
  );
}
