import type { Metadata } from "next";
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
    "AlphaEdge tiers: Free sandbox on delayed data; Pro and Elite add real-time data, " +
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
    name: "AlphaEdge",
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

export default async function PricingPage() {
  const plans = await loadPlans();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {plans !== null && plans.length > 0 ? <OffersJsonLd plans={plans} /> : null}
      <h1 className="text-balance text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Four tiers, no asterisks.
      </h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        Monthly, GST-inclusive, in Indian rupees. Cancel any time — access runs to the
        end of the paid period. The Free tier is not a trial: delayed data, full
        sandbox, honest charges, for as long as you like.
      </p>

      {plans === null ? (
        <div className="mt-10 rounded-lg border border-line bg-panel p-6 text-sm text-ink-muted">
          The plan catalog is temporarily unavailable. Rather than show prices that
          might be out of date, we would rather show none — please try again shortly.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.code}
              className="flex flex-col rounded-lg border border-line bg-panel p-6"
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
                    <span aria-hidden="true" className="text-up">
                      ✓
                    </span>
                    <span>{FEATURE_LABELS[f] ?? f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/waitlist"
                className="mt-6 rounded-md border border-line-strong px-4 py-2 text-center text-sm font-medium text-ink transition hover:border-up hover:text-up"
              >
                {plan.interval === "custom" ? "Contact us" : "Get started"}
              </Link>
            </article>
          ))}
        </div>
      )}

      <section aria-labelledby="quota-title" className="mt-16">
        <h2 id="quota-title" className="text-xl font-semibold text-ink">
          What each tier enforces
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          These are the operational limits the platform applies, quoted from the code
          that enforces them. If a limit changes there, this table follows.
        </p>
        {/* Focusable scroll container: a keyboard user must be able to reach
            and scroll a wide table (the terminal's pattern). */}
        <div
          tabIndex={0}
          role="region"
          aria-labelledby="quota-title"
          className="mt-6 overflow-x-auto rounded-lg border border-line"
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
                <th scope="col" className="px-4 py-3 font-medium text-ink">
                  Free
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-ink">
                  Pro
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-ink">
                  Elite
                </th>
                <th scope="col" className="px-4 py-3 font-medium text-ink">
                  Institutional
                </th>
              </tr>
            </thead>
            <tbody>
              {QUOTA_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0">
                  <th scope="row" className="px-4 py-3 text-left font-normal text-ink">
                    {row.label}
                  </th>
                  <td className="tabular px-4 py-3 text-ink-muted">{row.free}</td>
                  <td className="tabular px-4 py-3 text-ink-muted">{row.pro}</td>
                  <td className="tabular px-4 py-3 text-ink-muted">{row.elite}</td>
                  <td className="tabular px-4 py-3 text-ink-muted">{row.institutional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="comparison-title" className="mt-16">
        <h2 id="comparison-title" className="text-xl font-semibold text-ink">
          {COMPARISON.title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">{COMPARISON.lede}</p>
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
