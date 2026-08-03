import { NextResponse } from "next/server";

/**
 * Waitlist endpoint (website/docs/05 §10, 07 §2).
 *
 * Sink-or-honest: with no `WAITLIST_SINK_URL` configured this answers 503 and
 * the form renders "not open yet" — an endpoint that accepted an address and
 * dropped it would be the watchlist bug (data the user believes saved, gone).
 * The sink receives a purpose-limited record: the address, the DPDP purpose,
 * and the consent version it was given against — a wording change bumps the
 * version, mirroring the platform's consent semantics.
 *
 * The sink this contract was written for now exists (2026-08-03, docs/18
 * finding 5): svc-notify's `POST /v1/notify/waitlist` — anonymous, durable
 * (Postgres via alembic 0001), idempotent on the address, and itself refusing
 * with 503 in prod when it has no database, which this route surfaces as the
 * honest "nothing was recorded" message below. Point `WAITLIST_SINK_URL` at
 * it in the deploy that provisions svc-notify's database
 * (platform/helm/values/website/values.yaml documents the pairing).
 */

// Bump on any change to the consent wording in waitlist-form.tsx.
const CONSENT_VERSION = "2026-08-03.1";
const PURPOSE = "launch_updates";

// Deliberately permissive shape check — real validation is the sink's job;
// this only refuses obvious non-addresses before they travel.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  return NextResponse.json({ available: Boolean(process.env.WAITLIST_SINK_URL) });
}

export async function POST(req: Request) {
  const sink = process.env.WAITLIST_SINK_URL;
  if (!sink) {
    return NextResponse.json(
      {
        available: false,
        detail: "The early-access list is not taking sign-ups from this deployment yet.",
      },
      { status: 503 },
    );
  }

  let body: { email?: unknown; consent?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Malformed request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL_SHAPE.test(email)) {
    return NextResponse.json(
      { detail: "That does not look like an email address." },
      { status: 400 },
    );
  }
  if (body.consent !== true) {
    // Consent is not implied by submission (DPDP: explicit, purpose-limited).
    return NextResponse.json(
      { detail: "Consent to launch-update emails is required to join the list." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(sink, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        purpose: PURPOSE,
        consent_version: CONSENT_VERSION,
        consented_at: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`sink answered ${res.status}`);
  } catch {
    // The address was NOT saved — say so plainly rather than a vague error.
    return NextResponse.json(
      { detail: "We could not save your address — nothing was recorded. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
