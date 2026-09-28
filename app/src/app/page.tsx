import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChargesCalculator } from "@/components/charges-calculator";
import { WithClaims } from "@/components/claims";
import { Disclaimer } from "@/components/disclaimer";
import { GlossRow } from "@/components/gloss-term";
import { HeatmapTiles } from "@/components/heatmap-tiles";
import { HeroFrame } from "@/components/hero-frame";
import { Section } from "@/components/section";
import { StatTile } from "@/components/stat-tile";
import { ResearchPipeline } from "@/components/research-pipeline";
import { Steps } from "@/components/steps";
import { AuditChain, EvidenceStatus, IntervalExample } from "@/components/track-proof";
import { PHOTOS } from "@/lib/photos";
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
 * (lintable); acts alternate plain/panel tone (show → prove rhythm) and are
 * numbered in the eyebrow, the way the redesign reads.
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
    name: "Algoryq Trade",
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
 *  on the panel colour against the sunk section (and vice versa). */
function CardGrid({
  items,
  cols,
  icons,
}: {
  items: readonly { title: string; body: string }[];
  cols: 2 | 3 | 4;
  icons?: readonly ReactNode[];
}) {
  const colsClass =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 3
        ? "md:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div data-stagger className={`grid gap-5 ${colsClass}`}>
      {items.map((item, i) => (
        <article key={item.title} className="ae-card flex flex-col gap-3">
          {icons?.[i] ? <span className="mb-1 text-link">{icons[i]}</span> : null}
          <h3 className="text-lg font-semibold tracking-[-0.01em] text-ink-strong md:text-[21px]">
            {item.title}
          </h3>
          <p className="text-[15px] leading-relaxed text-ink-muted">
            <WithClaims text={item.body} />
          </p>
        </article>
      ))}
    </div>
  );
}

const icon = (d: string) => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const ANSWER_ICONS = [
  icon("M4 19V5M4 19h16M8 15l3-4 3 2 5-6"),
  icon("M6 4h12M6 9h12M9 4c4 0 4 5 0 5H6l8 11"),
  icon("M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3zM9 12l2 2 4-4"),
] as const;

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p className="mt-8 text-sm">
      <Link href={href} className="ae-link">
        {children}
      </Link>
    </p>
  );
}

export default function HomePage() {
  return (
    <>
      <AppJsonLd />
      {/* Act 1 — hero. The one h1 on the page. The nav floats over it, so
          the section pulls up underneath the glass. */}
      <section
        aria-labelledby="hero-title"
        className="ae-grid-tex relative -mt-[76px] overflow-hidden border-b border-line pt-[76px] md:-mt-[84px] md:pt-[84px]"
      >
        <div className="ae-container grid items-start gap-12 pb-20 pt-12 md:pt-16 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-[88px]">
          <div className="flex flex-col gap-6 md:gap-7 lg:pt-9">
            <p className="ae-eyebrow ae-rise">{HERO.eyebrow}</p>
            <h1 id="hero-title" className="ae-h1 ae-rise ae-d1">
              {HERO.title}{" "}
              <span className="text-[color:var(--ae-accent-soft-ink)]">{HERO.titleAccent}</span>
            </h1>
            <p className="ae-lede ae-rise ae-d2">{HERO.lede}</p>
            <div className="ae-rise ae-d3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={HERO.primaryCta.href} className="ae-btn ae-pulse">
                {HERO.primaryCta.label}
                <Arrow />
              </Link>
              <Link href={HERO.secondaryCta.href} className="ae-btn-ghost">
                {HERO.secondaryCta.label}
              </Link>
            </div>
            <p className="text-[13px] text-ink-subtle">{HERO.note}</p>
          </div>
          <HeroFrame />
        </div>
      </section>

      {/* Act 2 — trust strip: verifiable facts only. */}
      <section aria-label="Platform facts" className="border-b border-line">
        <ul className="ae-container grid gap-x-8 gap-y-4 py-8 text-sm leading-relaxed text-ink-muted sm:grid-cols-2 md:py-10 lg:grid-cols-4">
          {TRUST_FACTS.map((fact) => (
            <li key={fact} className="max-sm:border-t max-sm:border-line max-sm:pt-4 max-sm:first:border-0 max-sm:first:pt-0">
              <WithClaims text={fact} />
            </li>
          ))}
        </ul>
      </section>

      {/* Act 3 — the problem. */}
      <Section
        id="why-practice"
        n={1}
        eyebrow="The problem"
        title={PROBLEM.title}
        lede={PROBLEM.lede}
        photo="leaningBack2"
      />

      {/* Act 4 — the answer. */}
      <Section
        id="honest-sandbox"
        n={2}
        tone="panel"
        eyebrow="The answer"
        title={ANSWER.title}
        lede={ANSWER.lede}
        photo="closedLaptopPhone"
      >
        <CardGrid items={ANSWER.bullets} cols={3} icons={ANSWER_ICONS} />
        <div className="mt-8">
          <Disclaimer which="SIM" />
        </div>
      </Section>

      {/* Act 5 — the workspace. */}
      <Section
        id="terminal"
        n={3}
        eyebrow={TERMINAL_ACT.eyebrow}
        title={TERMINAL_ACT.title}
        lede={TERMINAL_ACT.lede}
        photo="monitorsNight"
      >
        <CardGrid items={TERMINAL_ACT.bullets} cols={3} />
      </Section>

      {/* Act 6 — live market data, honesty per tier. */}
      <Section
        id="market-data"
        n={4}
        tone="panel"
        eyebrow={DATA_ACT.eyebrow}
        title={DATA_ACT.title}
        lede={DATA_ACT.lede}
        photo="deskDusk"
      >
        <CardGrid items={DATA_ACT.bullets} cols={4} />
      </Section>

      {/* Act 7 — charts & indicators (receipt #1). */}
      <Section
        id="charts"
        n={5}
        eyebrow={CHARTS_ACT.eyebrow}
        title={CHARTS_ACT.title}
        lede={CHARTS_ACT.lede}
        photo="tablet"
      >
        <dl data-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHARTS_ACT.families.map((family) => (
            <div key={family.name} className="ae-card md:!p-6">
              <dt className="ae-num text-xs uppercase tracking-[0.06em] text-link">
                {family.name}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-ink-muted">{family.items}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Act 8 — the options desk, shown with a real capture. */}
      <Section
        id="options"
        n={6}
        tone="panel"
        eyebrow={OPTIONS_ACT.eyebrow}
        title={OPTIONS_ACT.title}
        lede={OPTIONS_ACT.lede}
        photo="screenNight"
      >
        <div className="max-w-5xl">
          <ProductFrame id="options" />
        </div>
        <GlossRow keys={["oi", "pcr", "maxPain", "iv", "greeks", "black76"]} />
      </Section>

      {/* Act 9 — the cost stack, computed by the real engine's formulas:
          an interactive calculator that autoplays until touched. */}
      <Section
        id="costs"
        n={7}
        eyebrow={COSTS_ACT.eyebrow}
        title={COSTS_ACT.title}
        lede={COSTS_ACT.lede}
        photo="printedReport"
      >
        <ChargesCalculator />
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink-subtle">
          {COSTS_ACT.tableCaption}
        </p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-muted">
          {COSTS_ACT.commodityNote}
        </p>
        <GlossRow keys={["mis", "cnc", "nrml", "stt", "ctt"]} />
      </Section>

      {/* Act 10 — risk engine (receipt #2). */}
      <Section
        id="risk"
        n={8}
        tone="panel"
        eyebrow={RISK_ACT.eyebrow}
        title={RISK_ACT.title}
        lede={RISK_ACT.lede}
        photo="screenDay"
      >
        <CardGrid items={RISK_ACT.bullets} cols={2} />
        <GlossRow keys={["var", "circuitBand", "rMultiple"]} />
      </Section>

      {/* Act 11 — automation where it's safe. */}
      <Section
        id="automation"
        n={9}
        eyebrow={AUTOMATION_ACT.eyebrow}
        title={AUTOMATION_ACT.title}
        lede={AUTOMATION_ACT.lede}
        photo="handPhone"
      >
        <CardGrid items={AUTOMATION_ACT.bullets} cols={2} />
      </Section>

      {/* Act 12 — the research pipeline, drawn as the pipeline it is. */}
      <Section
        id="research"
        n={10}
        tone="panel"
        eyebrow={RESEARCH_ACT.eyebrow}
        title={RESEARCH_ACT.title}
        lede={RESEARCH_ACT.lede}
        photo="laptopReport"
      >
        <ResearchPipeline />
        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          <div className="ae-card flex items-center gap-5 !py-5 lg:col-span-5">
            <span className="ae-num text-3xl tracking-[-0.02em] text-ink-strong">08:45</span>
            <span className="text-sm leading-relaxed text-ink-muted">
              IST daily publishing SLA. Every miss is written to the audit chain, not hidden.
            </span>
          </div>
          <div className="lg:col-span-7">
            <Disclaimer which="RESEARCH_FULL" />
          </div>
        </div>
        <details className="group mt-5 max-w-4xl rounded-2xl border border-line bg-panel">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="ae-num text-link transition group-open:rotate-90">›</span>
            All eight stages, in words
          </summary>
          <ol className="grid gap-x-8 gap-y-4 px-5 pb-5 md:grid-cols-2">
            {RESEARCH_ACT.steps.map((step, i) => (
              <li key={step.title} className="flex gap-3">
                <span className="ae-num w-6 shrink-0 text-xs text-link">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm leading-relaxed text-ink-muted">
                  <span className="font-semibold text-ink">{step.title}.</span> {step.body}
                </span>
              </li>
            ))}
          </ol>
        </details>
      </Section>

      {/* Act 13 — track record, dark-launch honest (receipt #3). The live,
          per-request embed lives on /track-record; this static act must
          never say more than the embed would — so it shows the status, a
          worked example of how an interval reads, and the audit chain the
          record will live on. No results. */}
      <Section
        id="track-record"
        n={11}
        eyebrow={TRACK_RECORD_ACT.eyebrow}
        title={TRACK_RECORD_ACT.title}
        lede={TRACK_RECORD_ACT.lede}
        photo="printedReport2"
      >
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-7">
            <EvidenceStatus title={TRACK_RECORD_ACT.statusTitle} body={TRACK_RECORD_ACT.statusBody} />
            <p className="text-sm">
              <Link href="/track-record" className="ae-link">
                The live page, and how we score →
              </Link>
            </p>
          </div>
          <div className="lg:col-span-5">
            <IntervalExample />
          </div>
        </div>
        <div className="mt-5">
          <AuditChain />
        </div>
        <div className="mt-6 max-w-3xl">
          <Disclaimer which="TRACK_RECORD" />
        </div>
      </Section>

      {/* Act 14 — AI chat: the refusal is the feature. */}
      <Section
        id="ai-chat"
        n={12}
        tone="panel"
        eyebrow={AI_CHAT_ACT.eyebrow}
        title={AI_CHAT_ACT.title}
        lede={AI_CHAT_ACT.lede}
        photo="lookingPhone"
      >
        <figure className="max-w-3xl">
          <blockquote className="rounded-2xl border border-line border-l-[3px] border-l-ring bg-panel p-6 text-[15px] leading-relaxed text-ink-muted md:p-8">
            {AI_CHAT_ACT.refusalQuote}
          </blockquote>
          <figcaption className="mt-3 text-xs leading-relaxed text-ink-subtle">
            {AI_CHAT_ACT.refusalLabel}
          </figcaption>
        </figure>
        <div className="mt-6 max-w-3xl">
          <Disclaimer which="AI_CHAT" />
        </div>
      </Section>

      {/* Act 15 — Strategy Lab. */}
      <Section
        id="lab"
        n={13}
        eyebrow={LAB_ACT.eyebrow}
        title={LAB_ACT.title}
        lede={LAB_ACT.lede}
        photo="monitorsDay"
      >
        <CardGrid items={LAB_ACT.bullets} cols={2} />
        <GlossRow keys={["walkForward", "deflatedSharpe"]} />
        <div className="mt-6 max-w-3xl">
          <Disclaimer which="BACKTEST" />
        </div>
      </Section>

      {/* Act 16 — journal & leaderboard. */}
      <Section
        id="journal"
        n={14}
        tone="panel"
        eyebrow={JOURNAL_ACT.eyebrow}
        title={JOURNAL_ACT.title}
        lede={JOURNAL_ACT.lede}
        photo="journal"
      >
        <div className="ae-card max-w-3xl">
          <h3 className="text-lg font-semibold text-ink-strong">{JOURNAL_ACT.leaderboard.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
            {JOURNAL_ACT.leaderboard.body}
          </p>
        </div>
        <GlossRow keys={["tri"]} />
      </Section>

      {/* Act 17 — coverage. */}
      <Section
        id="coverage"
        n={15}
        eyebrow={COVERAGE_ACT.eyebrow}
        title={COVERAGE_ACT.title}
        lede={COVERAGE_ACT.lede}
        photo="laptopPhoneDesk"
      >
        <div className="max-w-4xl">
          <HeatmapTiles sectors={[...COVERAGE_ACT.sectors]} label={COVERAGE_ACT.heatmapLabel} />
        </div>
      </Section>

      {/* Act 18 — graduate to live: the four gates. */}
      <Section
        id="live"
        n={16}
        tone="panel"
        eyebrow={LIVE_ACT.eyebrow}
        title={LIVE_ACT.title}
        lede={LIVE_ACT.lede}
        photo="handPhone2"
      >
        <Steps items={[...LIVE_ACT.steps]} />
        <p className="mt-10 max-w-3xl text-[15px] leading-relaxed text-ink-muted">{LIVE_ACT.footer}</p>
        <MoreLink href="/live-trading">
          The gates one by one, and the Kite mapping shown honestly →
        </MoreLink>
      </Section>

      {/* Act 19 — security & DPDP fact grid → /security. */}
      <Section
        id="security"
        n={17}
        eyebrow={SECURITY_ACT.eyebrow}
        title={SECURITY_ACT.title}
        lede={SECURITY_ACT.lede}
        photo="laptopReport2"
      >
        <CardGrid items={SECURITY_ACT.facts} cols={3} />
        <MoreLink href="/security">
          The full security page — including what doesn&apos;t exist yet →
        </MoreLink>
      </Section>

      {/* Act 20 — engineering receipts. The first two tiles breathe: they
          are the numbers CI re-proves on every change. */}
      <Section
        id="engineering"
        n={18}
        tone="panel"
        eyebrow={ENGINEERING_ACT.eyebrow}
        title={ENGINEERING_ACT.title}
        lede={ENGINEERING_ACT.lede}
        photo="notebook"
      >
        <div data-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ENGINEERING_ACT.stats.map((stat, i) => (
            <StatTile key={stat.label} {...stat} featured={i < 2} />
          ))}
        </div>
        <MoreLink href="/how-its-built">The full receipts table, invariants and CI gates →</MoreLink>
      </Section>

      {/* Act 21 — the rest of the desk. */}
      <Section
        id="capabilities"
        n={19}
        eyebrow="The rest of the desk"
        title={CAPABILITIES.title}
        lede={CAPABILITIES.lede}
        photo="tablet2"
      >
        <CardGrid items={CAPABILITIES.cards} cols={3} />
      </Section>

      {/* Act 22 — the refusals. */}
      <Section
        id="refusals"
        n={20}
        tone="panel"
        eyebrow="Refusals"
        title={REFUSALS.title}
        lede={REFUSALS.lede}
        photo="deskSunset"
      >
        <ol className="max-w-4xl">
          {REFUSALS.items.map((item, i) => (
            <li
              key={item}
              className="flex gap-6 border-t border-line py-5 last:border-b md:py-[22px]"
            >
              <span className="ae-num w-7 shrink-0 pt-[3px] text-[13px] text-link">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base leading-relaxed text-ink md:text-[17px]">
                <WithClaims text={item} />
              </span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Act 23 — FAQ (the objection map, with FAQPage JSON-LD). */}
      <Section
        id="faq"
        n={21}
        eyebrow="FAQ"
        title="Fair questions"
        lede="Asked the way people actually ask them."
      >
        <FaqJsonLd />
        <div className="max-w-4xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group px-5 py-5 md:px-7">
              <summary className="flex cursor-pointer list-none items-start gap-3 text-base font-medium text-ink-strong [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="ae-num mt-px inline-block text-link transition group-open:rotate-90">
                  ›
                </span>
                {item.q}
              </summary>
              <p className="mt-3 pl-6 text-[15px] leading-relaxed text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* Final CTA — the one closing panel, aurora behind, photo as a quiet
          backdrop (heavily tinted so text contrast never depends on it). */}
      <section id="get-started" aria-labelledby="get-started-title" className="ae-container pb-10 pt-6">
        <div
          data-reveal
          className="relative isolate flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-line bg-panel px-6 py-16 text-center md:px-20 md:py-[88px]"
        >
          <Image
            src={PHOTOS.leaningBack.src}
            alt=""
            fill
            sizes="(min-width: 1440px) 1280px, 100vw"
            className="-z-20 object-cover opacity-[0.16]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-panel/60 via-panel/80 to-panel" />
          <div aria-hidden="true" className="ae-aurora -top-[40%] left-[calc(50%-380px)] -z-10 h-[420px] w-[760px]" />
          <h2 id="get-started-title" className="ae-h2 max-w-[820px] md:!text-[52px]">
            {FINAL_CTA.title}
          </h2>
          <p className="ae-lede max-w-[680px]">{FINAL_CTA.lede}</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Link href="/waitlist" className="ae-btn ae-pulse">
              Join early access
            </Link>
            <Link href="/pricing" className="ae-btn-ghost !border-line-strong">
              Compare tiers
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
