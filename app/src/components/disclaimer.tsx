import { DISCLAIMERS, type DisclaimerKey } from "@/lib/disclaimers.gen";

/**
 * Registry-backed disclaimer band — the site-side sibling of
 * apps/web/src/lib/disclaimer.tsx. Renders canonical wording only, and stamps
 * `data-disclaimer-id` / `data-disclaimer-ver` so the compliance e2e can
 * assert presence on marketing pages exactly as it does in the terminal
 * (website/docs/06 §2).
 *
 * During dark launch the RA slots render the pending marker; the wording of
 * that marker mirrors the compliance package's own fallback.
 */

const RA_NAME_PENDING = "the reviewing analyst (registration pending)";
const RA_REG_NO_PENDING = "pending";

export function renderDisclaimerText(
  key: DisclaimerKey,
  { raName = RA_NAME_PENDING, raRegNo = RA_REG_NO_PENDING } = {},
): string {
  return DISCLAIMERS[key].text
    .replaceAll("{ra_name}", raName)
    .replaceAll("{ra_reg_no}", raRegNo);
}

export function Disclaimer({ which }: { which: DisclaimerKey }) {
  const entry = DISCLAIMERS[which];
  return (
    <p
      data-disclaimer-id={entry.id}
      data-disclaimer-ver={entry.version}
      className="rounded-md border border-line bg-panel px-4 py-3 text-xs leading-relaxed text-ink-muted"
    >
      {renderDisclaimerText(which)}
    </p>
  );
}
