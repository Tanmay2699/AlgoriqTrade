"use client";

/**
 * Early-access form (website/docs/05 §10). Three honesty rules govern it:
 *
 * 1. Availability is checked before the form accepts anything — a deployment
 *    with no waitlist sink renders "not open yet" instead of an input that
 *    accepts an address and loses it (the terminal's watchlist rule: an input
 *    that loses data on reload is worse than one that says the feature is
 *    unavailable).
 * 2. DPDP consent is explicit, purpose-limited, and unchecked by default —
 *    submitting without it is refused server-side too.
 * 3. Every state reserves its height so the section never shifts.
 */

import { useEffect, useState } from "react";

type Phase = "checking" | "open" | "closed" | "submitting" | "done" | "error";

export function WaitlistForm() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPhase("submitting");
    setDetail(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, consent }),
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
    <div className="min-h-44 max-w-xl">
      {phase === "checking" ? (
        <p role="status" className="text-sm text-ink-muted">
          Checking availability…
        </p>
      ) : phase === "closed" ? (
        <div className="rounded-md border border-line bg-panel p-4 text-sm text-ink-muted">
          The early-access list isn&apos;t taking sign-ups from this deployment yet. Rather
          than accept your address and lose it, we&apos;d rather say so — please check back.
        </div>
      ) : phase === "done" ? (
        <div role="status" className="rounded-md border border-line bg-panel p-4 text-sm text-ink">
          You&apos;re on the list. We&apos;ll email you when early access opens — and for
          nothing else.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" aria-busy={phase === "submitting"}>
          <div>
            <label htmlFor="waitlist-email" className="mb-1 block text-sm font-medium text-ink">
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle"
              placeholder="you@example.com"
            />
          </div>
          <label className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5"
              required
            />
            <span>
              Email me when early access opens. This address is used for launch updates
              only — no other purpose, no sharing — and you can withdraw at any time
              (DPDP Act 2023).
            </span>
          </label>
          {phase === "error" && detail ? (
            <p role="alert" className="text-xs text-down">
              {detail}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={phase === "submitting" || !consent}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {phase === "submitting" ? "Joining…" : "Join early access"}
          </button>
        </form>
      )}
    </div>
  );
}
