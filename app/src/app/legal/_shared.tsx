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
    <div className="rounded-md border border-warn-soft bg-warn-soft px-4 py-3 text-xs leading-relaxed">
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
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-ink">{title}</h1>
      {lede ? <p className="mt-3 text-ink-muted">{lede}</p> : null}
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-muted [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink">
        {children}
      </div>
    </div>
  );
}
