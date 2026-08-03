import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { FlowDiagram } from "@/components/flow-diagram";

/**
 * /how-its-built (website/docs/03 §4) — the engineering page: the repo's
 * CI-enforced invariants, the CI gates, the full claims-ledger receipts
 * table, and the honesty rules as principles. "The page the skeptic
 * screenshots."
 *
 * The receipts table is parsed from website/docs/claims-ledger.md at build
 * time — the ledger is the single source; a second copy here would rot. The
 * page is fully static, so the filesystem read happens inside the build (the
 * repo is present); zero parsed rows fails the build rather than rendering
 * an empty table asserting we claim nothing.
 */

export const metadata: Metadata = {
  title: "How it's built",
  description:
    "The engineering behind AlphaEdge: CI-enforced invariants, the compliance and " +
    "data gates that run on every change, and the full claims ledger mapping every " +
    "marketing claim to the code that keeps it true.",
};

interface LedgerRow {
  id: string;
  claim: string;
  receipt: string;
  status: string;
}

function loadLedger(): LedgerRow[] {
  // website/app/src/app/... → repo root is four levels above the app dir.
  const ledgerPath = join(process.cwd(), "..", "docs", "claims-ledger.md");
  const rows: LedgerRow[] = [];
  for (const line of readFileSync(ledgerPath, "utf8").split("\n")) {
    if (!line.startsWith("| CL-")) continue;
    const cells = line.split("|").map((c) => c.trim());
    const [, id, claim, receipt, status] = cells;
    if (!/^CL-\d{3}$/.test(id)) continue;
    rows.push({ id, claim, receipt, status });
  }
  if (rows.length === 0) {
    throw new Error(`claims ledger parsed to zero rows from ${ledgerPath}`);
  }
  return rows;
}

// Root README "Five CI-enforced invariants" (README.md §"Five CI-enforced
// invariants"), plus the sixth the README adds in prose. Paraphrased for the
// page; the README is the receipt.
const INVARIANTS = [
  {
    title: "One source of charge math",
    body:
      "All brokerage, STT/CTT, stamp and GST math lives in one package. The sandbox " +
      "and the backtester both import it and must agree to the paisa — in CI, on " +
      "every change.",
  },
  {
    title: "One source of wire types",
    body:
      "Tick, candle and order schemas are defined once as JSON Schema; the TypeScript " +
      "and Python types are generated from them, never hand-copied.",
  },
  {
    title: "One source of compliance copy",
    body:
      "Disclaimer wording and the banned-language list live in one compliance package. " +
      "A lint scans every product surface — including every word on this website — " +
      "against it on every change.",
  },
  {
    title: "One source of market time",
    body:
      "Exchange sessions, holidays and expiries live in one calendar. Nothing else may " +
      "answer “is the market open” — a year with no loaded holiday circular raises an " +
      "error rather than guessing.",
  },
  {
    title: "One wire format for ticks",
    body:
      "The tick contract is 49 bytes between services that deploy independently, so CI " +
      "pins the exact bytes of a golden frame. A refactor that reorders a field fails " +
      "the build, not the market open. (CL-011)",
  },
  {
    title: "One source of portfolio math",
    body:
      "Drawdown, Sharpe and period returns live in one shared module — added after two " +
      "processes computed them differently and disagreed. This invariant earned its " +
      "place the way the first five did: by being violated once.",
  },
] as const;

// The CI gates (root CLAUDE.md "Current state"): each is a `python -m`
// module run on every change; each asserts a family of invariants.
const GATES = [
  { cmd: "alphaedge_compliance", what: "Banned-language lint over every product and marketing surface; missing-disclaimer scan (REG-03)." },
  { cmd: "alphaedge_agent_evals", what: "Eight adversarial researcher failures injected and all eight must be caught; clean baseline must pass. (CL-015)" },
  { cmd: "alphaedge_data_platform", what: "Tick wire format byte-pinned; exchange calendar loaded for the current year; medallion and market-context readiness." },
  { cmd: "alphaedge_ml", what: "Feature contracts, lookahead control, the charges cost floor, and model promotion gates." },
  { cmd: "alphaedge_news", what: "Embedding contract, source tiers, syndication dedupe, entity refusal, point-in-time retrieval." },
  { cmd: "alphaedge_risk_analytics", what: "Return gaps never zero-filled; correlation pruning reported; VaR publisher and consumer agree." },
  { cmd: "alphaedge_platform", what: "52 infrastructure checks: India-only regions, private access, digest-only images, audit-before-publish, deploy freeze on trading days. (CL-013)" },
] as const;

const PRINCIPLES = [
  "No fabricated data, ever — no invented users, testimonials, or numbers, on the product or on this site.",
  "Unavailable is not empty. A screen that cannot know says it cannot know; it never renders a zero it did not compute.",
  "A check that did not run reports SKIPPED, with the reason. Silence is never evidence of safety.",
  "Refusals are visible. When the platform declines — an order outside the band, an advice question to the AI — it names the gate that stopped it.",
  "One source per fact. Prices render from the billing service, disclaimers from the compliance registry, limits from the code that enforces them.",
  "Screenshots are builds: captured from the running terminal by a pipeline, committed as taken, provenance printed under every frame.",
] as const;

export default function HowItsBuiltPage() {
  const ledger = loadLedger();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-balance text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Built like it has to be right.
      </h1>
      <p className="mt-3 max-w-2xl text-ink-muted">
        Marketing pages usually ask for trust. This one shows its working: the
        invariants our continuous integration enforces, the gates that run on every
        change, and the ledger that maps each claim on this site to the code that
        keeps it true.
      </p>

      <section aria-labelledby="invariants-title" className="mt-14">
        <h2 id="invariants-title" className="text-xl font-semibold text-ink">
          Six invariants, enforced by CI — not by intentions
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Five were baked in from day one; the sixth was added the day it was needed.
          Each exists because the failure it prevents is silent, and each has a check
          that fails the build when it is violated.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INVARIANTS.map((inv) => (
            <div key={inv.title} className="rounded-lg border border-line bg-panel p-5">
              <h3 className="text-sm font-semibold text-ink">{inv.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{inv.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="gates-title" className="mt-14">
        <h2 id="gates-title" className="text-xl font-semibold text-ink">
          The gates that run on every change
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Each is a runnable module — the same command works on a laptop and in CI.
          None of them can be skipped on the way to a deploy.
        </p>
        <dl className="mt-6 divide-y divide-line rounded-lg border border-line bg-panel">
          {GATES.map((g) => (
            <div key={g.cmd} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[16rem_1fr] sm:gap-6">
              <dt className="font-mono text-xs text-up">python -m {g.cmd}</dt>
              <dd className="text-sm leading-relaxed text-ink-muted">{g.what}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="audit-title" className="mt-14">
        <h2 id="audit-title" className="text-xl font-semibold text-ink">
          The audit chain a research call lives on
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Every step lands on a hash-linked, append-only record before anything is
          served, and the chain is re-verified on read. Deleting a bad call is not an
          operation the system has. (CL-007, CL-010)
        </p>
        <div className="mt-6">
          <FlowDiagram
            label="Lifecycle of a research call on the audit chain"
            nodes={[
              { title: "Draft", sub: "five analysts + CIO sizing" },
              { title: "Compliance lint", sub: "blocking, pre-publication" },
              { title: "Human RA gate", sub: "approve, veto, or drop" },
              { title: "Hash chain", sub: "anchored before serving" },
              { title: "Publish", sub: "or it never leaves" },
              { title: "Score", sub: "to its exit, losers included" },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="stack-title" className="mt-14">
        <h2 id="stack-title" className="text-xl font-semibold text-ink">
          The stack, end to end
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          As architected and declared in code — the same layout the 52 infrastructure
          checks lint on every change. The cloud deployment has not yet been applied,
          and we say so rather than borrow credibility from a logo. (CL-013)
        </p>
        <div className="mt-6">
          <FlowDiagram
            label="The market-data and research path through the stack"
            nodes={[
              { title: "Vendor feeds", sub: "NSE · BSE · MCX · AMFI" },
              { title: "Event Hubs", sub: "streaming backbone" },
              { title: "AKS services", sub: "gateway, sandbox, risk, recs" },
              { title: "Databricks lakehouse", sub: "medallion Delta, ML, evals" },
              { title: "Postgres · Redis", sub: "serving stores" },
              { title: "Your terminal", sub: "one WebSocket, one truth" },
            ]}
          />
        </div>
      </section>

      <section aria-labelledby="ledger-title" className="mt-14">
        <h2 id="ledger-title" className="text-xl font-semibold text-ink">
          The claims ledger, in full
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-muted">
          Every claim id used on this site resolves to a row here, and a CI check
          fails if one ever doesn&apos;t — or if a receipt file stops existing. This table
          is rendered from the ledger itself at build time, pending rows included: a
          claim marked pending is one we are not allowed to make yet.
        </p>
        <div
          tabIndex={0}
          role="region"
          aria-label="Claims ledger: claim, receipt and verification status"
          className="mt-6 overflow-x-auto rounded-lg border border-line"
        >
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <caption className="sr-only">
              All marketing claims with their code receipts and verification status
            </caption>
            <thead>
              <tr className="border-b border-line bg-panel text-left">
                <th scope="col" className="px-4 py-2.5 font-medium text-ink">Id</th>
                <th scope="col" className="px-4 py-2.5 font-medium text-ink">Claim</th>
                <th scope="col" className="px-4 py-2.5 font-medium text-ink">Receipt</th>
                <th scope="col" className="px-4 py-2.5 font-medium text-ink">Status</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((row) => (
                <tr key={row.id} className="border-b border-line align-top last:border-b-0">
                  <th scope="row" className="tabular px-4 py-2.5 text-left font-mono text-xs font-normal text-ink">
                    {row.id}
                  </th>
                  <td className="px-4 py-2.5 text-ink-muted">{row.claim.replaceAll("**", "")}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-ink-muted">
                    {row.receipt.replaceAll("`", "").replaceAll("**", "")}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-ink-muted">
                    {row.status.replaceAll("**", "")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-ink-subtle">
          Receipts reference paths in our repository. Public excerpts of the engineering
          docs ship with the developer platform at launch; until then, the paths are the
          pointer and this page is the index.
        </p>
      </section>

      <section aria-labelledby="principles-title" className="mt-14">
        <h2 id="principles-title" className="text-xl font-semibold text-ink">
          The honesty rules, as engineering principles
        </h2>
        <ul className="mt-6 max-w-3xl space-y-4">
          {PRINCIPLES.map((p) => (
            <li key={p} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
              <span aria-hidden="true" className="mt-0.5 text-up">—</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-14 max-w-2xl text-sm text-ink-muted">
        The measured outcome of all of this — every research call scored to its exit —
        lives on the{" "}
        <Link href="/track-record" className="text-up underline underline-offset-2 hover:opacity-80">
          track record page
        </Link>
        .
      </p>
    </div>
  );
}
