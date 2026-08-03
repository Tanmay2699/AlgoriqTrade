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
}

export function StatTile({ value, label, sub, kind }: StatTileProps) {
  return (
    <div className="rounded-lg border border-line bg-panel p-5">
      <p className="tabular text-3xl font-bold tracking-tight text-ink">{value}</p>
      <p className="mt-1 text-sm font-medium text-ink">{label}</p>
      {sub ? <p className="mt-1 text-xs leading-relaxed text-ink-muted">{sub}</p> : null}
      <p className="mt-3 text-xs text-ink-subtle">
        {kind === "measured" ? "Verified in code & CI" : "Budget — enforced target"}
      </p>
    </div>
  );
}
