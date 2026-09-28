import type { Metadata } from "next";
import { Photo } from "@/components/photo";
import { WaitlistForm } from "@/components/waitlist-form";
import { WAITLIST_PAGE } from "@/copy/waitlist";

export const metadata: Metadata = {
  title: "Early access",
  description:
    "Join the Algoryq Trade early-access list. One email when access opens — nothing else.",
};

/**
 * The pre-identity CTA target (website/docs/00 Open-2): until Entra External
 * ID lands there is no signup, so every "get started" path resolves here.
 * When identity ships, this page and its API retire in favour of /signup —
 * recorded in website/docs/08 §6.
 */
export default function WaitlistPage() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="ae-aurora -right-40 top-10 h-[520px] w-[720px]" />
      <div className="ae-container relative grid items-start gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <p className="ae-eyebrow ae-rise">{WAITLIST_PAGE.eyebrow}</p>
          <h1 className="ae-h1 ae-rise ae-d1">{WAITLIST_PAGE.title}</h1>
          <p className="ae-lede ae-rise ae-d2">{WAITLIST_PAGE.lede}</p>
          <ul className="ae-rise ae-d3 flex flex-col gap-3">
            {WAITLIST_PAGE.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] text-ink">
                <svg className="mt-0.5 shrink-0 text-link" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
          <Photo k="smilingPhone" className="mt-4 hidden lg:block" priority />
        </div>
        <div className="ae-rise ae-d2 lg:col-span-6 lg:pt-10">
          <WaitlistForm />
        </div>
      </div>
    </div>
  );
}
