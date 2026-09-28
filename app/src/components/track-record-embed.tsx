import { CiBar } from "@/components/ci-bar";
import { ProgressMeter } from "@/components/progress-meter";
import { formatPaise } from "@/lib/money";

/**
 * TrackRecordEmbed (website/docs/05 §6) — server-rendered from svc-recs'
 * anonymous transparency API (`GET {RECS_API_URL}/recs/track-record`; the
 * read endpoints are deliberately tokenless — website/docs/07 §Open-1,
 * resolved 2026-08-03, receipts in CL-018). Three states, all honest:
 *
 *  - unavailable — `RECS_API_URL` unset or unreachable: named as such,
 *    never an empty table, never cached numbers.
 *  - dark launch — the pipeline is accumulating its evidence window. Since
 *    2026-08-03 svc-recs redacts scored stats out of the payload server-side
 *    while status is dark_launch (docs/18 finding 4, resolved); this
 *    component renders the session count only regardless — defense in
 *    depth, because rendering outcomes here would BE publication, and
 *    publication is gated on SEBI RA registration (CLAUDE.md guardrail 3).
 *    The flip to numbers is the service's status field — data, not a
 *    redesign.
 *  - published — the API's own series rendered whole: no windowing, no
 *    cherry-picking, losers included, net-of-charges basis stated, Wilson
 *    95% CI drawn, monthly content hashes shown.
 *
 * The e2e suite runs with no upstream configured and asserts the
 * unavailable state; the dark-launch render is exercised against the real
 * service in the dev stack (scripts/capture-screens.mjs environment).
 */

interface Interval {
  low: number;
  high: number;
}

interface CoreStats {
  published_count: number;
  triggered_count: number;
  wins: number;
  hit_rate: number;
  hit_rate_ci95: Interval;
  avg_realized_r: number;
  profit_factor: number | null;
  max_losing_streak: number;
  total_net_pnl_paise_per_lakh: number;
  avg_net_pnl_paise_per_lakh: number;
}

interface Benchmark {
  name: string;
  period_return_pct: number;
  strategy_return_pct: number;
}

interface MonthlyBucket {
  month: string;
  month_label: string;
  sessions: number;
  stats: CoreStats;
  benchmark: Benchmark;
  content_sha256?: string;
}

export interface TrackRecord {
  status: string;
  generated_at_utc: string;
  as_of_date: string;
  sessions_completed: number;
  sessions_target: number;
  since_inception: CoreStats;
  since_inception_benchmark: Benchmark;
  rolling_20: CoreStats;
  months: MonthlyBucket[];
  sebi_note: string;
}

export async function loadTrackRecord(): Promise<TrackRecord | null> {
  const svc = process.env.RECS_API_URL;
  if (!svc) return null;
  try {
    const res = await fetch(`${svc}/recs/track-record`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as TrackRecord;
  } catch {
    return null;
  }
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

function Headline({ stats }: { stats: CoreStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-line bg-panel p-5">
        <p className="text-xs uppercase tracking-wide text-ink-subtle">Calls triggered</p>
        <p className="tabular mt-1 text-2xl font-bold text-ink">{stats.triggered_count}</p>
        <p className="mt-1 text-xs text-ink-muted">of {stats.published_count} published</p>
      </div>
      <div className="rounded-2xl border border-line bg-panel p-5">
        <p className="text-xs uppercase tracking-wide text-ink-subtle">Hit rate (T1+, triggered)</p>
        <p className="tabular mt-1 text-2xl font-bold text-ink">{pct(stats.hit_rate)}</p>
        <div className="mt-2">
          <CiBar
            rate={stats.hit_rate}
            low={stats.hit_rate_ci95.low}
            high={stats.hit_rate_ci95.high}
            label="Hit rate over triggered calls"
          />
        </div>
        <p className="tabular mt-1 text-xs text-ink-muted">
          95% CI {pct(stats.hit_rate_ci95.low)}–{pct(stats.hit_rate_ci95.high)}
        </p>
      </div>
      <div className="rounded-2xl border border-line bg-panel p-5">
        <p className="text-xs uppercase tracking-wide text-ink-subtle">Avg realised R</p>
        <p className="tabular mt-1 text-2xl font-bold text-ink">
          {stats.avg_realized_r.toFixed(2)}
        </p>
        <p className="mt-1 text-xs text-ink-muted">max losing streak {stats.max_losing_streak}</p>
      </div>
      <div className="rounded-2xl border border-line bg-panel p-5">
        <p className="text-xs uppercase tracking-wide text-ink-subtle">Net P&L per ₹1L deployed</p>
        <p className="tabular mt-1 text-2xl font-bold text-ink">
          {formatPaise(stats.total_net_pnl_paise_per_lakh)}
        </p>
        <p className="mt-1 text-xs text-ink-muted">after the full charge stack</p>
      </div>
    </div>
  );
}

export async function TrackRecordEmbed() {
  const record = await loadTrackRecord();

  if (record === null) {
    return (
      <div className="rounded-2xl border border-line bg-panel p-7">
        <h2 className="text-base font-semibold text-ink-strong">Track record temporarily unreachable</h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
          This section renders live from the transparency service, and we could not reach
          it just now. Rather than show cached or reconstructed figures, we show none —
          the live figures are the only figures. Please try again shortly.
        </p>
      </div>
    );
  }

  if (record.status === "dark_launch") {
    return (
      <div className="rounded-2xl border border-line bg-panel p-7">
        <h2 className="text-base font-semibold text-ink-strong">Dark launch: nothing is published yet</h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-muted">
          The research pipeline runs daily and every call is scored — but nothing is
          published until our SEBI Research Analyst registration is granted and the
          evidence window completes. Until then this page shows the window&apos;s progress
          and no performance figures at all. When the record exists, it appears here,
          whatever it says.
        </p>
        <div className="mt-5 max-w-md">
          <ProgressMeter
            value={record.sessions_completed}
            max={record.sessions_target}
            unit="sessions"
            label="Evidence window"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm leading-relaxed text-ink-muted">
        As of {record.as_of_date}, over {record.sessions_completed} completed sessions.
        Hit rate is counted over triggered calls only, a win is target 1 or beyond, and
        every P&L figure is net of the full charge stack. Losers are included; nothing
        is windowed out.
      </p>
      <section aria-label="Since inception">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-subtle">
          Since inception
        </h2>
        <Headline stats={record.since_inception} />
        <p className="tabular mt-3 text-xs text-ink-muted">
          Benchmark: {record.since_inception_benchmark.name}{" "}
          {record.since_inception_benchmark.period_return_pct.toFixed(2)}% over the same
          period.
        </p>
      </section>
      <section aria-label="Rolling twenty sessions">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-subtle">
          Rolling 20 sessions
        </h2>
        <Headline stats={record.rolling_20} />
      </section>
      {record.months.length > 0 && (
        <section aria-label="Monthly transparency reports">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-subtle">
            Monthly transparency reports
          </h2>
          <div
            tabIndex={0}
            role="region"
            aria-label="Monthly transparency reports with content hashes"
            className="overflow-x-auto rounded-2xl border border-line"
          >
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <caption className="sr-only">
                Monthly report sessions, hit rate and content hash
              </caption>
              <thead>
                <tr className="border-b border-line bg-panel text-left">
                  <th scope="col" className="px-4 py-2.5 font-medium text-ink">Month</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium text-ink">Sessions</th>
                  <th scope="col" className="px-4 py-2.5 text-right font-medium text-ink">Hit rate</th>
                  <th scope="col" className="px-4 py-2.5 font-medium text-ink">Content hash</th>
                </tr>
              </thead>
              <tbody>
                {record.months.map((m) => (
                  <tr key={m.month} className="border-b border-line last:border-b-0">
                    <th scope="row" className="px-4 py-2 text-left font-normal text-ink">
                      {m.month_label}
                    </th>
                    <td className="tabular px-4 py-2 text-right text-ink-muted">{m.sessions}</td>
                    <td className="tabular px-4 py-2 text-right text-ink-muted">
                      {pct(m.stats.hit_rate)}
                    </td>
                    <td className="tabular px-4 py-2 ae-num text-xs text-ink-muted">
                      {m.content_sha256 ? m.content_sha256.slice(0, 16) + "…" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-ink-subtle">
            The hash is a SHA-256 of the report&apos;s canonical contents, anchored to the
            append-only audit record before the report is served — re-request the month
            and recompute it to verify nothing changed. (CL-016)
          </p>
        </section>
      )}
      {record.sebi_note && (
        <p className="max-w-2xl text-xs leading-relaxed text-ink-subtle">{record.sebi_note}</p>
      )}
    </div>
  );
}
