import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { GlossRow } from "@/components/gloss-term";
import { HeatmapTiles } from "@/components/heatmap-tiles";
import { HeroFrame } from "@/components/hero-frame";
import { Section } from "@/components/section";
import { StatTile } from "@/components/stat-tile";
import { Steps } from "@/components/steps";
import chargesExample from "@/lib/charges-example.gen.json";
import { formatPaise } from "@/lib/money";
import { ProductFrame } from "@/components/product-frame";
import {
  AI_CHAT_ACT,
  AUTOMATION_ACT,
  CHARTS_ACT,
  COSTS_ACT,
  COVERAGE_ACT,
  DATA_ACT,
  ENGINEERING_ACT,
  JOURNAL_ACT,
  LAB_ACT,
  LIVE_ACT,
  OPTIONS_ACT,
  RESEARCH_ACT,
  RISK_ACT,
  SECURITY_ACT,
  TERMINAL_ACT,
  TRACK_RECORD_ACT,
} from "@/copy/acts";
import { FAQ_ITEMS } from "@/copy/faq";
import {
  ANSWER,
  CAPABILITIES,
  FINAL_CTA,
  HERO,
  PROBLEM,
  REFUSALS,
  TRUST_FACTS,
} from "@/copy/home";

/**
 * Homepage — the full W3 narrative (website/docs/03 §3, all acts): hero →
 * trust → problem → answer → terminal → live data → charts → options →
 * costs → risk → automation → research → track record → AI chat → Strategy
 * Lab → journal → coverage → four gates → security → engineering →
 * remaining desk → refusals → FAQ → final CTA. Copy lives in src/copy
 * (lintable); acts alternate plain/panel tone (show → prove rhythm).
 *
 * The track-record act stays a static dark-launch card with a link to the
 * live /track-record page: the homepage is fully static by budget (07 §3),
 * and the live embed is per-request. The words here and the embed's
 * dark-launch state say the same thing.
 */

function FaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

// SoftwareApplication JSON-LD (07 §5) — deliberately WITHOUT offers: prices
// live only in svc-billing, and an offer baked into this static page would
// ship a digest-promoted image with stale prices. /pricing emits offers from
// the live catalog on the same request that renders them. No AggregateRating
// — we have none, and fabricating one is exactly what we don't do.
function AppJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AlphaEdge",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Market-intelligence terminal and paper-trading sandbox for Indian markets: live NSE/BSE/MCX data, virtual money, the full charge stack, and AI research gated by a human analyst.",
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

/** Card rows for an act. `onPanel` = the act has tone="panel", so cards sit
 *  on bg-surface for contrast (and vice versa) — the alternation rule every
 *  act followed by hand before this helper existed. */
function CardGrid({
  items,
  cols,
  onPanel = false,
}: {
  items: readonly { title: string; body: string }[];
  cols: 2 | 3 | 4;
  onPanel?: boolean;
}) {
  const colsClass =
    cols === 2
      ? "sm:grid-cols-2"
      : cols === 3
        ? "md:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div className={`grid gap-6 ${colsClass}`}>
      {items.map((item) => (
        <div
          key={item.title}
          className={`rounded-lg border border-line p-5 ${onPanel ? "bg-surface" : "bg-panel"}`}
        >
          <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <AppJsonLd />
      {/* Act 1 — hero. The one h1 on the page. */}
      <section aria-labelledby="hero-title" className="border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink-subtle">
              {HERO.eyebrow}
            </p>
            <h1
              id="hero-title"
              className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink md:text-5xl"
            >
              {HERO.title}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
              {HERO.lede}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={HERO.primaryCta.href}
                className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
              >
                {HERO.primaryCta.label}
              </Link>
              <Link
                href={HERO.secondaryCta.href}
                className="rounded-md border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition hover:border-up hover:text-up"
              >
                {HERO.secondaryCta.label}
              </Link>
            </div>
          </div>
          <HeroFrame />
        </div>
      </section>

      {/* Act 2 — trust strip: verifiable facts only. */}
      <section aria-label="Platform facts" className="border-b border-line bg-panel">
        <ul className="mx-auto grid max-w-6xl gap-x-8 gap-y-3 px-4 py-6 text-xs text-ink-muted sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_FACTS.map((fact) => (
            <li key={fact} className="flex gap-2">
              <span aria-hidden="true" className="text-up">
                ▪
              </span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Act 3 — the problem. */}
      <Section id="why-practice" eyebrow="Why practice" title={PROBLEM.title} lede={PROBLEM.lede} />

      {/* Act 4 — the answer. */}
      <Section id="honest-sandbox" tone="panel" title={ANSWER.title} lede={ANSWER.lede}>
        <CardGrid items={ANSWER.bullets} cols={3} onPanel />
        <div className="mt-8">
          <Disclaimer which="SIM" />
        </div>
      </Section>

      {/* Act 5 — the workspace. */}
      <Section
        id="terminal"
        eyebrow={TERMINAL_ACT.eyebrow}
        title={TERMINAL_ACT.title}
        lede={TERMINAL_ACT.lede}
      >
        <CardGrid items={TERMINAL_ACT.bullets} cols={3} />
      </Section>

      {/* Act 6 — live market data, honesty per tier. */}
      <Section
        id="market-data"
        tone="panel"
        eyebrow={DATA_ACT.eyebrow}
        title={DATA_ACT.title}
        lede={DATA_ACT.lede}
      >
        <CardGrid items={DATA_ACT.bullets} cols={4} onPanel />
      </Section>

      {/* Act 7 — charts & indicators (receipt #1). */}
      <Section
        id="charts"
        eyebrow={CHARTS_ACT.eyebrow}
        title={CHARTS_ACT.title}
        lede={CHARTS_ACT.lede}
      >
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHARTS_ACT.families.map((family) => (
            <div key={family.name} className="rounded-lg border border-line bg-panel p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-ink-subtle">
                {family.name}
              </dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">{family.items}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Act 8 — the options desk, shown with a real capture. */}
      <Section
        id="options"
        tone="panel"
        eyebrow={OPTIONS_ACT.eyebrow}
        title={OPTIONS_ACT.title}
        lede={OPTIONS_ACT.lede}
      >
        <div className="max-w-4xl">
          <ProductFrame id="options" />
        </div>
        <GlossRow keys={["oi", "pcr", "maxPain", "iv", "greeks", "black76"]} />
      </Section>

      {/* Act 9 — the cost stack, computed by the real engine. */}
      <Section
        id="costs"
        eyebrow={COSTS_ACT.eyebrow}
        title={COSTS_ACT.title}
        lede={COSTS_ACT.lede}
      >
        {/* Focusable scroll region (the terminal's pattern): on narrow
            viewports this scrolls horizontally, and a keyboard user must be
            able to reach and scroll it. */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Charges on a one-lakh-rupee intraday round trip"
          className="max-w-2xl overflow-x-auto rounded-lg border border-line bg-surface"
        >
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <caption className="sr-only">
              Charges on a one-lakh-rupee intraday round trip, by charge line and side
            </caption>
            <thead>
              <tr className="border-b border-line text-left">
                <th scope="col" className="px-4 py-2.5 font-medium text-ink">
                  Charge
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium text-ink">
                  Buy
                </th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium text-ink">
                  Sell
                </th>
              </tr>
            </thead>
            <tbody>
              {chargesExample.lines.map((line) => (
                <tr key={line.label} className="border-b border-line">
                  <th scope="row" className="px-4 py-2 text-left font-normal text-ink-muted">
                    {line.label}
                  </th>
                  <td className="tabular px-4 py-2 text-right text-ink-muted">
                    {formatPaise(line.buy_paise)}
                  </td>
                  <td className="tabular px-4 py-2 text-right text-ink-muted">
                    {formatPaise(line.sell_paise)}
                  </td>
                </tr>
              ))}
              <tr>
                <th scope="row" className="px-4 py-2.5 text-left font-semibold text-ink">
                  Round trip total
                </th>
                <td
                  colSpan={2}
                  className="tabular px-4 py-2.5 text-right font-semibold text-ink"
                >
                  {formatPaise(chargesExample.round_trip_total_paise)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-ink-subtle">
          {COSTS_ACT.tableCaption}
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted">
          {COSTS_ACT.commodityNote}
        </p>
        <GlossRow keys={["mis", "cnc", "nrml", "stt", "ctt"]} />
      </Section>

      {/* Act 10 — risk engine (receipt #2). */}
      <Section
        id="risk"
        tone="panel"
        eyebrow={RISK_ACT.eyebrow}
        title={RISK_ACT.title}
        lede={RISK_ACT.lede}
      >
        <CardGrid items={RISK_ACT.bullets} cols={2} onPanel />
        <GlossRow keys={["var", "circuitBand", "rMultiple"]} />
      </Section>

      {/* Act 11 — automation where it's safe. */}
      <Section
        id="automation"
        eyebrow={AUTOMATION_ACT.eyebrow}
        title={AUTOMATION_ACT.title}
        lede={AUTOMATION_ACT.lede}
      >
        <CardGrid items={AUTOMATION_ACT.bullets} cols={2} />
      </Section>

      {/* Act 12 — the research pipeline. */}
      <Section
        id="research"
        tone="panel"
        eyebrow={RESEARCH_ACT.eyebrow}
        title={RESEARCH_ACT.title}
        lede={RESEARCH_ACT.lede}
      >
        <Steps items={[...RESEARCH_ACT.steps]} />
      </Section>

      {/* Act 13 — track record, dark-launch honest (receipt #3). The live,
          per-request embed lives on /track-record; this static act must
          never say more than the embed would. */}
      <Section
        id="track-record"
        eyebrow={TRACK_RECORD_ACT.eyebrow}
        title={TRACK_RECORD_ACT.title}
        lede={TRACK_RECORD_ACT.lede}
      >
        <div className="max-w-2xl rounded-lg border border-line bg-panel p-5">
          <h3 className="text-sm font-semibold text-ink">{TRACK_RECORD_ACT.statusTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {TRACK_RECORD_ACT.statusBody}
          </p>
          <p className="mt-3 text-sm">
            <Link
              href="/track-record"
              className="text-up underline underline-offset-2 hover:opacity-80"
            >
              The live page, and how we score →
            </Link>
          </p>
        </div>
        <div className="mt-6 max-w-2xl">
          <Disclaimer which="TRACK_RECORD" />
        </div>
      </Section>

      {/* Act 14 — AI chat: the refusal is the feature. */}
      <Section
        id="ai-chat"
        tone="panel"
        eyebrow={AI_CHAT_ACT.eyebrow}
        title={AI_CHAT_ACT.title}
        lede={AI_CHAT_ACT.lede}
      >
        <figure className="max-w-2xl">
          <blockquote className="rounded-lg border-l-4 border-up bg-surface p-5 text-sm leading-relaxed text-ink-muted">
            {AI_CHAT_ACT.refusalQuote}
          </blockquote>
          <figcaption className="mt-2 text-xs leading-relaxed text-ink-subtle">
            {AI_CHAT_ACT.refusalLabel}
          </figcaption>
        </figure>
        <div className="mt-6 max-w-2xl">
          <Disclaimer which="AI_CHAT" />
        </div>
      </Section>

      {/* Act 15 — Strategy Lab. */}
      <Section id="lab" eyebrow={LAB_ACT.eyebrow} title={LAB_ACT.title} lede={LAB_ACT.lede}>
        <CardGrid items={LAB_ACT.bullets} cols={2} />
        <GlossRow keys={["walkForward", "deflatedSharpe"]} />
        <div className="mt-6 max-w-2xl">
          <Disclaimer which="BACKTEST" />
        </div>
      </Section>

      {/* Act 16 — journal & leaderboard. */}
      <Section
        id="journal"
        tone="panel"
        eyebrow={JOURNAL_ACT.eyebrow}
        title={JOURNAL_ACT.title}
        lede={JOURNAL_ACT.lede}
      >
        <div className="max-w-2xl rounded-lg border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold text-ink">{JOURNAL_ACT.leaderboard.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {JOURNAL_ACT.leaderboard.body}
          </p>
        </div>
        <GlossRow keys={["tri"]} />
      </Section>

      {/* Act 17 — coverage. */}
      <Section
        id="coverage"
        eyebrow={COVERAGE_ACT.eyebrow}
        title={COVERAGE_ACT.title}
        lede={COVERAGE_ACT.lede}
      >
        <div className="max-w-3xl">
          <HeatmapTiles sectors={[...COVERAGE_ACT.sectors]} label={COVERAGE_ACT.heatmapLabel} />
        </div>
      </Section>

      {/* Act 18 — graduate to live: the four gates. */}
      <Section
        id="live"
        tone="panel"
        eyebrow={LIVE_ACT.eyebrow}
        title={LIVE_ACT.title}
        lede={LIVE_ACT.lede}
      >
        <Steps items={[...LIVE_ACT.steps]} />
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-muted">{LIVE_ACT.footer}</p>
        <p className="mt-4 text-sm">
          <Link
            href="/live-trading"
            className="text-up underline underline-offset-2 hover:opacity-80"
          >
            The gates one by one, and the Kite mapping shown honestly →
          </Link>
        </p>
      </Section>

      {/* Act 19 — security & DPDP fact grid → /security. */}
      <Section
        id="security"
        eyebrow={SECURITY_ACT.eyebrow}
        title={SECURITY_ACT.title}
        lede={SECURITY_ACT.lede}
      >
        <CardGrid items={SECURITY_ACT.facts} cols={3} />
        <p className="mt-6 text-sm">
          <Link href="/security" className="text-up underline underline-offset-2 hover:opacity-80">
            The full security page — including what doesn&apos;t exist yet →
          </Link>
        </p>
      </Section>

      {/* Act 20 — engineering receipts. */}
      <Section
        id="engineering"
        tone="panel"
        eyebrow={ENGINEERING_ACT.eyebrow}
        title={ENGINEERING_ACT.title}
        lede={ENGINEERING_ACT.lede}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENGINEERING_ACT.stats.map((stat) => (
            <StatTile key={stat.label} {...stat} />
          ))}
        </div>
        <p className="mt-6 text-sm">
          <Link
            href="/how-its-built"
            className="text-up underline underline-offset-2 hover:opacity-80"
          >
            The full receipts table, invariants and CI gates →
          </Link>
        </p>
      </Section>

      {/* Act 21 — the rest of the desk. */}
      <Section id="capabilities" title={CAPABILITIES.title} lede={CAPABILITIES.lede}>
        <CardGrid items={CAPABILITIES.cards} cols={3} />
      </Section>

      {/* Act 22 — the refusals. */}
      <Section id="refusals" tone="panel" title={REFUSALS.title} lede={REFUSALS.lede}>
        <ul className="max-w-3xl space-y-4">
          {REFUSALS.items.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
              <span aria-hidden="true" className="mt-0.5 text-up">
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Act 23 — FAQ (the objection map, with FAQPage JSON-LD). */}
      <Section id="faq" title="Fair questions" lede="Asked the way people actually ask them.">
        <FaqJsonLd />
        <div className="max-w-3xl divide-y divide-line rounded-lg border border-line bg-panel">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="mr-2 inline-block text-ink-subtle transition group-open:rotate-90">
                  ›
                </span>
                {item.q}
              </summary>
              <p className="mt-3 pl-5 text-sm leading-relaxed text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Final CTA. */}
      <Section id="get-started" title={FINAL_CTA.title} lede={FINAL_CTA.lede}>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/waitlist"
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition hover:opacity-90"
          >
            Join early access
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-line-strong px-5 py-2.5 text-sm font-medium text-ink transition hover:border-up hover:text-up"
          >
            Compare tiers
          </Link>
        </div>
      </Section>
    </>
  );
}
