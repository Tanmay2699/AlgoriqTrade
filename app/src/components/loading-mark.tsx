/**
 * Site-wide loading mark: the glass-orb clip the user supplied (Gemini
 * watermark cropped out, same as the hero footage), over the same
 * `.ae-aurora` glow the hero already uses, with an indeterminate progress
 * bar underneath — this is a static site with no real percentage to track,
 * so the bar is a sliding native CSS animation, not a wired-up progress
 * value.
 */
export function LoadingMark({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-5">
      <div className="relative">
        <div
          aria-hidden="true"
          className="ae-aurora left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2"
        />
        <video
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          src="/videos/loading-orb.mp4"
          className="relative w-[280px] rounded-2xl bg-[#edeef3]"
        />
      </div>
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-line">
        <div className="ae-loading-bar h-full w-1/3 rounded-full bg-[var(--ae-link)]" />
      </div>
      <span className="ae-num text-xs text-ink-subtle">
        {label}
        <span className="sr-only"> — please wait</span>
      </span>
    </div>
  );
}
