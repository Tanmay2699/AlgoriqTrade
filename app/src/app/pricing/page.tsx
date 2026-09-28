import type { Metadata } from "next";
import { Photo } from "@/components/photo";
import Link from "next/link";
import { ComparisonTable } from "@/components/comparison-table";
import { COMPARISON } from "@/copy/comparison";
import { formatPaise } from "@/lib/money";
import { QUOTA_ROWS } from "@/lib/quotas";

/**
 * Pricing (website/docs/03 §4, 05 §7). Two sources, deliberately different:
 *
 *  - Plan cards render the live svc-billing catalog per request — a price
 *    never lives in two places, and if billing is unreachable we show no
 *    prices rather than stale ones (the rule apps/web's pricing page set).
 *  - The quota matrix renders from src/lib/quotas.ts, the one module that
 *    mirrors the limits services enforce, with per-row source files recorded
 *    there and in the claims ledger (CL-020).
 */

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Algoryq Trade tiers: Free sandbox on delayed data; Pro and Elite add real-time data, " +
    "depth, research and backtesting. Monthly, GST-inclusive, cancel any time.",
};

// Per-request, not build-time: a price baked into a digest-promoted image
// would ship dev's catalog to prod. Same trade as the terminal's pricing page;
// ISR tuning is a W4 question (website/docs/07 Open-2).
export const dynamic = "force-dynamic";

interface Plan {
  code: string;
  name: string;
  price_paise: number;
  interval: string;
  features: string[];
  blurb: string;
}

const FEATURE_LABELS: Record<string, string> = {
  delayed_data: "15-minute delayed quotes",
  realtime_data: "Real-time NSE & BSE quotes",
  mcx_realtime: "Real-time MCX commodities",
  depth20: "20-level market depth",
  sandbox: "Paper-trading sandbox",
  watchlists: "Watchlists",
  options_chain: "Option chain & Greeks",
  ai_recs: "AI research reports",
  alerts: "Price & indicator alerts",
  backtesting: "Strategy Lab backtesting",
  api_access: "REST/WS API access",
};

async function loadPlans(): Promise<Plan[] | null> {
  const svc = process.env.BILLING_API_URL;
  if (!svc) return null;
  try {
    const res = await fetch(`${svc}/billing/plans`, { cache: "no-store" });
    if (!res.ok) return null;
    const body = await res.json();
    return Array.isArray(body) ? (body as Plan[]) : null;
  } catch {
    return null;
  }
}

// Offers JSON-LD from the SAME live fetch the cards render — the one place
// prices may appear in structured data, for the same reason they appear on
// this page at all (07 §5; never baked into a static page).
function OffersJsonLd({ plans }: { plans: Plan[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Algoryq Trade",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: plans
      .filter((p) => p.interval !== "custom")
      .map((p) => ({
        "@type": "Offer",
        name: p.name,
        price: (p.price_paise / 100).toFixed(2),
        priceCurrency: "INR",
      })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

const TIERS = ["Free", "Pro", "Elite", "Institutional"] as const;

export default async function PricingPage() {
  const plans = await loadPlans();

  return (
    <div className="ae-container py-14 md:py-20">
      {plans !== null && plans.length > 0 ? <OffersJsonLd plans={plans} /> : null}
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h1 className="ae-h1 max-w-4xl">
        Four tiers, no asterisks.
      </h1>
      <p className="ae-lede mt-6 max-w-3xl">
        Monthly, GST-inclusive, in Indian rupees. Cancel any time — access runs to the
        end of the paid period. The Free tier is not a trial: delayed data, full
        sandbox, honest charges, for as long as you like.
      </p>
        </div>
        <Photo k="laptopFloor" className="lg:col-span-5" priority />
      </div>

      {plans === null ? (
        <div className="mt-10 rounded-2xl border border-line bg-panel p-7 text-sm text-ink-muted">
          The plan catalog is temporarily unavailable. Rather than show prices that
          might be out of date, we would rather show none — please try again shortly.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.code}
              className="flex flex-col rounded-2xl border border-line bg-panel p-7"
            >
              <h2 className="text-lg font-semibold text-ink">{plan.name}</h2>
              <p className="tabular mt-2 text-2xl font-bold text-ink">
                {plan.interval === "custom" ? (
                  "Custom"
                ) : (
                  <>
                    {formatPaise(plan.price_paise)}
                    <span className="text-sm font-normal text-ink-muted"> /month</span>
                  </>
                )}
              </p>
              <p className="mt-3 text-sm text-ink-muted">{plan.blurb}</p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-ink-muted">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span aria-hidden="true" className="text-link">
                      ✓
                    </span>
                    <span>{FEATURE_LABELS[f] ?? f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/waitlist"
                className="ae-btn-ghost ae-btn-sm mt-6"
              >
                {plan.interval === "custom" ? "Contact us" : "Get started"}
              </Link>
            </article>
          ))}
        </div>
      )}

      <section aria-labelledby="quota-title" className="mt-16">
        <h2 id="quota-title" className="ae-h3">
          What each tier enforces
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
          These are the operational limits the platform applies, quoted from the code
          that enforces them. If a limit changes there, this table follows.
        </p>
        {/* Tier selector: CSS-only (radios + :has). Until a visitor picks,
            a spotlight walks the four columns on a loop; picking one pins
            it. Works without JavaScript. */}
        <div data-loop className="ae-tiers mt-6">
          <fieldset className="mb-4">
            <legend className="sr-only">Highlight a tier in the table</legend>
            <div className="relative grid w-full max-w-[560px] grid-cols-4 rounded-xl border border-line bg-sunk p-1">
              <span
                aria-hidden="true"
                className="ae-tier-thumb absolute inset-y-1 left-1 w-[calc((100%-8px)/4)] rounded-[9px] bg-panel-raised shadow-[0_0_0_1px_var(--ae-border-strong),0_0_18px_color-mix(in_oklab,var(--ae-glow)_25%,transparent)]"
              />
              {TIERS.map((t, i) => (
                <span key={t} className="relative">
                  <input type="radio" name="tier" id={`tier-${i}`} className="peer sr-only" />
                  <label
                    htmlFor={`tier-${i}`}
                    className="flex h-10 cursor-pointer items-center justify-center rounded-[9px] text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
                  >
                    {t}
                  </label>
                </span>
              ))}
            </div>
          </fieldset>
          {/* Focusable scroll container: a keyboard user must be able to reach
              and scroll a wide table (the terminal's pattern). */}
          <div
            tabIndex={0}
            role="region"
            aria-labelledby="quota-title"
            className="overflow-x-auto rounded-2xl border border-line"
          >
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <caption className="sr-only">
                Per-tier operational limits for Free, Pro, Elite and Institutional plans
              </caption>
              <thead>
                <tr className="border-b border-line bg-panel text-left">
                  <th scope="col" className="px-4 py-3 font-medium text-ink">
                    Limit
                  </th>
                  {TIERS.map((t, i) => (
                    <th
                      key={t}
                      scope="col"
                      data-col={i}
                      style={{ "--c": i } as React.CSSProperties}
                      className="px-4 py-3 font-medium text-ink"
                    >
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {QUOTA_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-line transition-colors last:border-b-0 hover:bg-panel">
                    <th scope="row" className="px-4 py-3 text-left font-normal text-ink">
                      {row.label}
                    </th>
                    {[row.free, row.pro, row.elite, row.institutional].map((v, i) => (
                      <td
                        key={i}
                        data-col={i}
                        style={{ "--c": i } as React.CSSProperties}
                        className="ae-num px-4 py-3 text-ink-muted"
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="comparison-title" className="mt-16">
        <h2 id="comparison-title" className="ae-h3">
          {COMPARISON.title}
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-muted">{COMPARISON.lede}</p>
        <div className="mt-6">
          <ComparisonTable />
        </div>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-ink-subtle">
          {COMPARISON.footnote}
        </p>
      </section>

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-ink-muted">
        Subscriptions are billed through Razorpay from inside the terminal — we never
        see or store card or UPI details. A paid tier buys market data, tooling and
        research access. It does not buy investment advice, and no tier includes order
        execution on your behalf.
      </p>
    </div>
  );
}
