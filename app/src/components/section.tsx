import type { ReactNode } from "react";

/**
 * The storytelling shell (website/docs/05 §1): eyebrow · headline · lede ·
 * content. Every homepage act renders through this so rhythm, measure, and
 * heading structure stay uniform — an act never hand-rolls its own section
 * chrome. `aria-labelledby` makes each section a named landmark (an unnamed
 * <section> is not one).
 *
 * Reveal motion (04 §5) is handled here so pages never hand-roll animation:
 * the inner container carries data-reveal (the <section> itself keeps its
 * borders/background static — chrome doesn't move, content rises).
 */
export function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
  tone = "default",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
  tone?: "default" | "panel";
}) {
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={tone === "panel" ? "border-y border-line bg-panel" : undefined}
    >
      <div data-reveal className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-widest text-ink-subtle">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={headingId}
          className="mt-2 max-w-3xl text-balance text-3xl font-bold tracking-tight text-ink md:text-4xl"
        >
          {title}
        </h2>
        {lede ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
            {lede}
          </p>
        ) : null}
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
