import type { ReactNode } from "react";

/**
 * Shared shell for the legal pages (website/docs/06 §6). The underscore
 * prefix keeps this out of the route table. Pages state what is already true
 * in code today and carry an explicit counsel-pending notice for the rest —
 * an unfinished legal page that says so is honest; one that reads as final is
 * not. Publishing final versions is a launch gate (docs/08 §4).
 */

export function CounselPending() {
  return (
    <div className="rounded-xl border border-warn-soft bg-warn-soft px-4 py-3 text-xs leading-relaxed">
      <span className="font-semibold text-warn-ink">Draft status: </span>
      <span className="text-warn-ink">
        This page is being finalised with counsel and will change before launch. What is
        stated below is accurate today, but it is not yet the complete legal text.
      </span>
    </div>
  );
}

export function LegalShell({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <div className="ae-container py-14 md:py-20">
      <div className="max-w-3xl">
        <p className="ae-eyebrow">Legal</p>
        <h1 className="ae-h1 mt-5 !text-[clamp(34px,2.4vw+1rem,48px)]">{title}</h1>
        {lede ? <p className="ae-lede mt-5">{lede}</p> : null}
        <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-ink-muted [&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink-strong">
          {children}
        </div>
      </div>
    </div>
  );
}
