/** Algoryq Trade mark + wordmark. The bars are brand blue, never up-green. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5 text-ink">
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="7" stroke="var(--ae-ring)" strokeWidth="1.5" />
        <rect x="7" y="14" width="3" height="7" rx="1" fill="var(--ae-link)" />
        <rect x="12.5" y="10" width="3" height="11" rx="1" fill="var(--ae-link)" />
        <rect x="18" y="6" width="3" height="15" rx="1" fill="var(--ae-text-strong)" />
      </svg>
      <span className="whitespace-nowrap text-[17px] font-bold tracking-[-0.02em] md:text-[19px]">
        Algoryq<span className="text-link"> Trade</span>
      </span>
    </span>
  );
}
