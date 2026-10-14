import Image from "next/image";

/**
 * Site-wide loading mark: the glass-orb render the user supplied, floating
 * over a breathing aurora glow with a shadow that pulses opposite it — the
 * same `.ae-aurora` glow the hero already uses, not a new effect.
 */
export function LoadingMark({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-5">
      <div className="relative">
        <div
          aria-hidden="true"
          className="ae-aurora left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2"
        />
        <div className="ae-float relative">
          <div
            aria-hidden="true"
            className="ae-shadow-pulse absolute -bottom-2 left-1/2 h-4 w-28 rounded-full bg-black/40 blur-md"
          />
          <Image
            src="/images/loading-orb.webp"
            alt=""
            width={280}
            height={158}
            priority
            className="relative rounded-2xl bg-[#edeef3]"
          />
        </div>
      </div>
      <span className="ae-num text-xs text-ink-subtle">
        {label}
        <span className="sr-only"> — please wait</span>
      </span>
    </div>
  );
}
