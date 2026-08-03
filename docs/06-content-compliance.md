# 06 — Content & Compliance

**Purpose:** The copy constitution. How the website inherits the platform's
compliance machinery (canonical disclaimers, REG-03 lint, audit-anchored
performance), how every claim gets a receipt, and which legal surfaces must
exist at launch. Where 02 says what we *want* to say, this doc says what we
*may* say and how that stays true over time.

**Key decisions**

1. **The site's copy is product copy.** `python -m alphaedge_compliance`
   (REG-03 banned-language lint + missing-disclaimer scan) runs against
   `website/` in CI, exactly as it scans terminal copy and notification
   templates today. Extending the lint's scan roots to this folder is a W1
   build task, not an aspiration.
2. **Disclaimers render from the canonical registry by id** —
   `packages/compliance/src/alphaedge_compliance/data/disclaimers.yaml` — via a
   generated export. The site never forks or rewords a disclaimer; a wording
   change bumps the registry version and flows here automatically.
3. **A claims ledger** (`website/docs/claims-ledger.md`, created in W1) maps
   every marketing claim → its receipt (file/test/CI gate/API/primary source).
   CI fails on a claim id used in site copy that is absent from the ledger.
4. **Dark-launch truthfulness:** until SEBI RA registration is granted, every
   research surface renders the pending state. The site ships with both states
   designed; the flip is data, not a redesign.
5. **Zero third-party trackers.** Analytics is first-party and consent-gated
   (07 §6); DPDP posture on the site matches the platform: Indian-region
   processing, purpose-limited, no dark patterns.

---

## 1. The disclaimer registry bindings

The canonical registry (compliance/legal own the YAML; version-pinned per
surface). The site uses these ids — never inline text:

| Registry id | Version today | Site surfaces that must carry it |
|---|---|---|
| `SIM` (DISC-SIM) | 1.0 | Every visual of sandbox P&L, portfolio value, fills, or the hero if it renders simulated trading outcomes: *"Simulated results using virtual money on live market data. Simulated performance does not guarantee actual results."* |
| `BACKTEST` (DISC-BACKTEST) | 1.0 | Strategy-lab / backtesting sections showing any equity curve or metric from a backtest (with its watermarks visible in the screenshot) |
| `TRACK_RECORD` (DISC-TRACK-RECORD) | 1.0 | The track-record embed and any mention of measured call outcomes |
| `RESEARCH_FULL` / `RESEARCH_SHORT` | 1.2 / 1.1 | Screenshots of the daily report must show the report's own pinned disclaimer; site copy about the research product references the RA gate. `{ra_name}`/`{ra_reg_no}` render the pending marker until registration |
| `AI_CHAT` (DISC-AI-CHAT) | 1.0 | Any depiction of the AI chat answering — the screenshot itself must include the rendered disclaimer strip |

Site-wide footer carries the standard risk line (sourced from the registry
export, id to be added if not present): securities-market risk disclosure +
"AlphaEdge is a paper-trading and research platform; virtual money only" +
RA-status line (pending/granted).

**Mechanism:** W1 adds a small codegen step that exports the registry YAML to a
typed TS module for the site (the same pattern `apps/web/src/lib/disclaimer.tsx`
mirrors today), plus a CI check that the export is fresh — copying the
contracts-package freshness-guard pattern.

## 2. REG-03 lint integration

- All renderable site copy lives in lintable form: MDX/TS string modules under
  `website/app/` — no copy buried in images (also an a11y rule, 04 §8).
- CI job: `python -m alphaedge_compliance` with `website/` added to its scan
  roots. The lint's two functions both apply: banned-language scan and
  missing-disclaimer scan (a performance surface without its pinned disclaimer
  id fails).
- Screenshots are copy too: the capture pipeline (08 §W2) re-captures from the
  live terminal, so screenshot text is the terminal's own linted copy. Ad-hoc
  edited screenshots are banned.
- The banned list lives in `banned-language.yaml` (compliance-owned). The site
  adds no private list; anything 02 §6 bans beyond REG-03 (urgency, fake
  social proof, unsourced superlatives) is enforced in review + the ledger.

## 3. Performance & outcome display rules

The only performance numbers that may appear anywhere on the site:

1. **Measured track record** — fetched from `svc-recs`
   (`/v1/recs/track-record`, `/v1/recs/transparency/{month}`), rendered with:
   net-of-charges basis stated, Wilson 95% CI shown, losers included,
   `TRACK_RECORD` disclaimer adjacent (not below the fold of the component),
   content-hash visible on transparency rows ("verify this report").
   If the API returns the dark-launch empty state, the component renders the
   pending state — it never falls back to illustrative numbers.
2. **Illustrative mechanics** — e.g., a charges-breakdown example ("what a
   ₹1,00,000 intraday round trip actually costs"). Must be computed by
   `packages/charges` at build time (a real invocation, committed as a
   fixture with its inputs shown), labeled "Illustration — rates as configured
   on {date}", and carry no return/outcome framing.
3. **Latency/scale engineering numbers** — only those with receipts: e.g.,
   p99 ≤ 25 ms risk-check budget (docs/08), LCP budgets (docs/10 §8.1),
   tick-contract byte size (49), indicator count (30), check counts (ten risk
   checks, 52 IaC checks, 18 risk-analytics checks). Each gets a ledger row.

Never: hypothetical portfolio growth curves, "if you had invested" framing,
annualized-return projections, or a backtest presented without its watermarks.

## 4. The claims ledger

`website/docs/claims-ledger.md` — one row per claim id:

```
| id | Claim (as worded on site) | Receipt | Verified | Review due |
|----|---------------------------|---------|----------|------------|
| CL-001 | "Charges modeled to the paisa — brokerage, STT, CTT, exchange, SEBI, stamp, GST" | packages/charges tests; docs/06 §4 | 2026-08-.. | rate-table change |
| CL-014 | "91% of individual F&O traders lost money in FY24" | SEBI study PDF (primary), pinned copy in ledger | pending | annual |
```

Rules: external statistics cite the primary source and pin the exact figure
before first use; engineering claims cite repo paths; anything whose receipt
disappears (refactor, rate change) gets flagged by the quarterly review noted
in the `Review due` column. Copy references claims by id in code comments so a
grep answers "where is CL-014 used".

## 5. Social proof policy

- Testimonials/case studies/logos: **only real, only with written permission,
  only attributable.** Components exist (05 §9) but ship dormant.
- Until then the trust strip carries verifiable facts only: segments covered,
  stack (Azure + Databricks — logo usage per their brand guidelines, §7),
  the audit-chain/CI-gate story, DPDP residency.
- User counts appear only when real and only as rounded, dated figures.
- The monthly transparency report is the standing "case study": the site's
  story section links the latest content-hashed report rather than narrating
  success anecdotes.

## 6. Legal & policy surfaces (launch inventory)

| Page | Contents | Owner/notes |
|---|---|---|
| `/legal/terms` | Terms of use: sandbox virtual-money nature; no brokerage services; account rules; Institutional/API addendum reference | Legal review required |
| `/legal/privacy` | DPDP Act 2023 notice: data categories, purposes (purpose limitation mirrors `contacts.py` purposes), Indian-region processing, consent & withdrawal (incl. leaderboard consent semantics), retention, grievance officer contact | Mirrors docs/14; DPDP §5–§6 |
| `/legal/disclaimers` | The full rendered disclaimer registry + risk disclosure + "not investment advice" page the footer links | Generated from registry |
| `/legal/refunds` | Subscription refund/cancellation policy (Razorpay-hosted payments; cancellation via `/v1/billing/subscription/cancel` semantics) | Razorpay merchant requirements |
| `/legal/grievance` | Grievance redressal: officer, escalation path, SEBI SCORES + ODR portal links once RA-registered | SEBI RA obligation post-registration |
| `/security` (public page, not legal) | Security posture: no broker passwords by construction, envelope encryption, India-only regions, private networking, hash-chained audits, responsible-disclosure contact | Sourced from docs/12/14 + platform gate facts |

Footer (every page): risk disclosure line · RA-status line · links to all of
the above · "Virtual money. Not a broker. Not investment advice." plain-words
strip · company identity & registered address (when incorporated details are
final) · no newsletter modal, no cookie banner theater (first-party,
consent-gated analytics only — 07 §6).

## 7. Third-party marks & citations

- **Zerodha/Kite, NSE/BSE/MCX, AMFI, Razorpay, Microsoft Azure, Databricks:**
  nominative use only (naming an integration/data source), no implied
  endorsement, each mark's brand guideline checked before any logo renders;
  text-only naming is the safe default at launch. Exchange data on any visual
  must respect vendor licensing — which is why the hero uses the synthetic
  feed until the recorded-replay rights review closes (00 §Open-1).
- **SEBI**: never in a way that implies approval/endorsement; registration
  number rendered only when granted, in the registry's own format.
- External stats (SEBI F&O study, market-size figures): primary sources only,
  pinned in the ledger, dated in the copy ("SEBI's September 2024 study…").

## 8. Review workflow

Copy PRs require: REG-03 lint green · ledger ids resolve · disclaimer ids
present on flagged surfaces (lint) · one human review against 02 §6's banned
list. Legal pages additionally require counsel sign-off before first publish
and on any change (tracked in the PR template checklist added in W1).

## Open questions

1. Does the registry need a site-footer disclaimer id (general risk
   disclosure) added, or does `TRACK_RECORD`+plain-words strip suffice?
   Leaning: add `SITE_FOOTER` to the YAML with legal, so the wording is
   compliance-owned like everything else.
2. Grievance-officer identity and registered-entity details — blocked on
   company formation facts; placeholder states designed but not publishable.
3. Do we publish the security page before an external pentest exists, and if
   so does it state "no external audit yet"? (Honesty default says yes,
   state it.)
