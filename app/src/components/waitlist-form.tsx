"use client";

/**
 * Early-access form (website/docs/05 §10; redesign board "NEW · early access
 * with DPDP consent"). Three honesty rules govern it:
 *
 * 1. Availability is checked before the form accepts anything — a deployment
 *    with no waitlist sink renders "not open yet" instead of an input that
 *    accepts an address and loses it (the terminal's watchlist rule: an input
 *    that loses data on reload is worse than one that says the feature is
 *    unavailable).
 * 2. DPDP consent is explicit, purpose-limited, and unchecked by default —
 *    submitting without it is refused server-side too. The wording and its
 *    version come from src/copy/waitlist.ts, the same module the API reads.
 * 3. Every state reserves its height so the card never shifts.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_TEXT, CONSENT_VERSION, SEGMENTS, WAITLIST_PAGE, type Segment } from "@/copy/waitlist";

type Phase = "checking" | "open" | "closed" | "submitting" | "done" | "error";

const Check = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path className="ae-draw" d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);

export function WaitlistForm() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [detail, setDetail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((body: { available?: boolean }) => {
        if (!cancelled) setPhase(body.available ? "open" : "closed");
      })
      .catch(() => {
        if (!cancelled) setPhase("closed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = (s: Segment) =>
    setSegments((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPhase("submitting");
    setDetail(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, consent, segments }),
      });
      const body = (await res.json()) as { detail?: string };
      if (res.status === 503) {
        setPhase("closed");
      } else if (!res.ok) {
        setDetail(body.detail ?? "That didn't work — please check the address and try again.");
        setPhase("error");
      } else {
        setPhase("done");
      }
    } catch {
      setDetail("Network error — nothing was saved. Please try again.");
      setPhase("error");
    }
  }

  return (
    <div className="relative min-h-[460px] rounded-2xl border border-line bg-panel p-6 shadow-[var(--ae-shadow)] md:p-8">
      {phase === "checking" ? (
        <div className="flex h-full min-h-[400px] flex-col gap-4" aria-hidden="false">
          <p role="status" className="text-sm text-ink-muted">
            Checking availability…
          </p>
          {[0, 1, 2].map((i) => (
            <span key={i} aria-hidden="true" className="ae-skeleton h-12 rounded-xl bg-sunk" />
          ))}
        </div>
      ) : phase === "closed" ? (
        <div className="flex min-h-[400px] flex-col items-start justify-center gap-4">
          <span aria-hidden="true" className="ae-pill">
            <span className="h-1.5 w-1.5 rounded-full border border-link" />
            NOT OPEN ON THIS DEPLOYMENT
          </span>
          <p className="text-lg font-semibold text-ink-strong">Sign-ups aren&apos;t open here yet.</p>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            The early-access list isn&apos;t taking sign-ups from this deployment yet. Rather
            than accept your address and lose it, we&apos;d rather say so — please check back.
          </p>
        </div>
      ) : phase === "done" ? (
        <div role="status" className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <span className="text-link">
            <Check />
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-ink-strong">You&apos;re on the list.</h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-muted">
            We&apos;ll email you when early access opens — and for nothing else. Your consent
            was recorded against wording <span className="ae-num text-ink">v{CONSENT_VERSION}</span>.
          </p>
          <button
            type="button"
            onClick={() => {
              setPhase("open");
              setConsent(false);
            }}
            className="ae-btn-ghost ae-btn-sm mt-2"
          >
            Back to the form
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-6" aria-busy={phase === "submitting"}>
          <div>
            <label htmlFor="waitlist-email" className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-line bg-sunk px-4 text-[15px] text-ink transition placeholder:text-ink-subtle focus:border-ring"
              placeholder="you@example.com"
            />
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">
              What do you trade? <span className="font-normal text-ink-subtle">Optional</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {SEGMENTS.map((s) => {
                const on = segments.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(s)}
                    className={`h-10 rounded-full border px-4 text-sm transition-colors ${
                      on
                        ? "border-ring bg-accent-soft text-ink-strong"
                        : "border-line bg-sunk text-ink-muted hover:border-line-strong hover:text-ink"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <label
            className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed text-ink-muted transition-colors ${
              consent ? "border-line-strong bg-accent-soft/40" : "border-line"
            }`}
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-[var(--ae-accent)]"
              required
            />
            <span>
              {CONSENT_TEXT}{" "}
              <Link href="/legal/privacy" className="ae-link">
                Privacy notice
              </Link>{" "}
              <span className="ae-num text-xs text-ink-subtle">· consent v{CONSENT_VERSION}</span>
            </span>
          </label>
          {phase === "error" && detail ? (
            <p role="alert" className="text-sm text-down">
              {detail}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={phase === "submitting" || !consent}
            className="ae-btn w-full disabled:cursor-not-allowed disabled:bg-panel-raised disabled:text-ink-subtle disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {phase === "submitting" ? "Joining…" : "Join early access"}
          </button>
          <p className="text-center text-xs text-ink-subtle">{WAITLIST_PAGE.footnote}</p>
        </form>
      )}
    </div>
  );
}
