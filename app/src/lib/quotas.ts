/**
 * The per-tier quota matrix, in one module (website/docs/05 §7: "sourced from
 * a single quotas module, not typed into JSX").
 *
 * Prices are NOT here — they render live from svc-billing's catalog, always.
 * These are the operational limits each tier enforces, and every row cites the
 * file that enforces it, because a quota stated on a pricing page and a quota
 * enforced by a service must be the same number (claims ledger CL-020).
 *
 * If a limit changes in a service, this module is the one place the site has
 * to follow. Quarterly review per website/docs/06 §4.
 */

export interface QuotaRow {
  label: string;
  /** Repo-relative file that enforces this row — the receipt. */
  source: string;
  free: string;
  pro: string;
  elite: string;
  institutional: string;
}

export const QUOTA_ROWS: QuotaRow[] = [
  {
    label: "Market data",
    source: "services/market-gateway/src/market_gateway/entitlements.py",
    free: "15-min delayed",
    pro: "Real-time NSE & BSE",
    elite: "Real-time incl. MCX",
    institutional: "Per contract",
  },
  {
    label: "Streaming instruments",
    source: "services/market-gateway/src/market_gateway/entitlements.py",
    free: "50",
    pro: "500",
    elite: "3,000",
    institutional: "3,000",
  },
  {
    label: "Market depth",
    source: "services/market-gateway/src/market_gateway/entitlements.py",
    free: "—",
    pro: "5-level",
    elite: "20-level book",
    institutional: "20-level book",
  },
  {
    label: "Price & indicator alerts",
    source: "services/alerts/src/svc_alerts/config.py",
    free: "3",
    pro: "10",
    elite: "500",
    institutional: "500",
  },
  {
    label: "Watchlists (100 instruments each)",
    source: "services/alerts/src/svc_alerts/watchlists.py",
    free: "2",
    pro: "10",
    elite: "50",
    institutional: "50",
  },
  {
    label: "AI analyst questions / day",
    source: "services/ai-orchestrator/src/svc_ai_orchestrator/config.py",
    free: "0",
    pro: "30",
    elite: "200",
    institutional: "500",
  },
  {
    label: "Strategy Lab backtests / day",
    source: "services/strategy-lab/src/svc_strategy_lab/api/lab.py",
    free: "—",
    pro: "3 (presets)",
    elite: "25 (full DSL)",
    institutional: "100",
  },
  {
    label: "Daily research report",
    source: "services/recs/src/svc_recs/api/recs.py",
    free: "Scorecard & track record",
    pro: "Full report",
    elite: "Incl. options strategy & agent rationale",
    institutional: "Full",
  },
  {
    label: "API keys",
    source: "services/billing/src/svc_billing/apikeys.py",
    free: "—",
    pro: "—",
    elite: "2 active",
    institutional: "2 active",
  },
];
