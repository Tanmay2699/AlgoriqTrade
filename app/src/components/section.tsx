import type { ReactNode } from "react";
import { WithClaims } from "@/components/claims";
import { Photo } from "@/components/photo";
import type { PhotoKey } from "@/lib/photos";

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
 *
 * `n` numbers the eyebrow ("03 — Risk management"); `photo` sets an
 * editorial image beside the heading, alternating sides by `n` so a long
 * page doesn't read as one column of left-aligned text.
 */
export function Section({
  id,
  n,
  eyebrow,
  title,
  lede,
  photo,
  children,
  tone = "default",
}: {
  id: string;
  n?: number;
  eyebrow?: string;
  title: string;
  lede?: string;
  photo?: PhotoKey;
  children?: ReactNode;
  tone?: "default" | "panel";
}) {
  const headingId = `${id}-title`;
  const flip = n !== undefined && n % 2 === 0;
  const head = (
    <div className="flex max-w-[760px] flex-col gap-5">
      {eyebrow ? (
        <p className="ae-eyebrow">
          {n !== undefined ? `${String(n).padStart(2, "0")} — ` : null}
          {eyebrow}
        </p>
      ) : null}
      <h2 id={headingId} className="ae-h2">
        {title}
      </h2>
      {lede ? (
        <p className="ae-lede">
          <WithClaims text={lede} />
        </p>
      ) : null}
    </div>
  );
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={tone === "panel" ? "border-y border-line bg-sunk" : undefined}
    >
      <div data-reveal className="ae-container py-20 md:py-[110px]">
        {photo ? (
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>{head}</div>
            <Photo k={photo} className={`lg:col-span-5 ${flip ? "lg:order-1" : ""}`} />
          </div>
        ) : (
          head
        )}
        {children ? <div className="mt-12">{children}</div> : null}
      </div>
    </section>
  );
}
