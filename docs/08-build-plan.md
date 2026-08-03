# 08 — Build Plan

**Purpose:** Phased delivery from this docs suite to a launched site, with
exit tests per phase (the house style: a phase is done when its tests pass,
not when its code merges), the launch-gate checklist, and the cutover from
`apps/web (marketing)`.

**Key decisions**

1. Four phases, W1–W4, each shippable to staging behind `noindex`.
2. **Compliance plumbing lands in W1, before any real copy** — the lint
   cannot protect copy written before it watches the folder.
3. The screenshot pipeline is W2 infrastructure, not an art task — images are
   builds, reproducible from the terminal + synthetic feed.
4. Launch is a checklist, not a date. Every gate below is mechanical.

---

## W1 — Foundations (compliance rails + shell)

Scaffold `@alphaedge/website` (Next.js, Tailwind v4 CSS-first, standalone
output) · port the token layer + theme/CVD axes + pre-paint bootstrap
(hash-CSP variant) · `SiteShell`, `Section`, `SiteNav`, `Footer`, `Prose` ·
**brand assets**: wordmark treatment, favicon set, `theme-color`, OG template
(the repo has none today) · disclaimer-registry TS codegen + freshness check ·
extend `python -m alphaedge_compliance` scan roots to `website/` · create
`claims-ledger.md` + CI resolver · legal page shells with counsel-pending
states (06 §6) · waitlist endpoint with DPDP-purposed consent · CI: full §8
suite from 07 wired, including Lighthouse CI and axe.

**Exit tests:** CI green with seeded copy (incl. a deliberate banned-phrase
fixture proving the lint fails) · Lighthouse ≥ 95 ×4 on the shell pages ·
axe zero violations, both viewports · both themes + deutan render · 320 px
clean · fonts swap with zero CLS in lab.

## W2 — Hero + spine

`HeroTerminal` (static SSR frame + scripted synthetic replay, labeled,
reduced-motion frame) · screenshot pipeline: Playwright boots the terminal on
the synthetic feed, captures 2x both themes, stamps data-source labels,
commits versioned captures · extract `SparklineSVG`, `CiBar`, `StatTile`,
`ProgressMeter`, `HeatmapTiles` · `/pricing` (live catalog + quotas module +
all three data states) · homepage acts 1–8 (03 §3) with draft-final copy ·
OG images per route.

**Exit tests:** LCP ≤ 1.5 s p75 on a throttled mid-range-mobile lab profile
*with the hero animation enabled* · JS on `/` ≤ 100 KB gz · hero shows its
label in every state (animated, static, reduced-motion) — snapshot-asserted ·
pricing renders loading/ready/unavailable correctly with `BILLING_API_URL`
unset/set/broken · screenshot job reproduces byte-stable captures.

## W3 — Full narrative

Remaining homepage acts (03 §3) · `TrackRecordEmbed` with dark-launch state
(resolve 07 §Open-1: anonymous read path) · diagrams (four gates, audit
chain, pipeline, stack) · FAQ + JSON-LD · `ComparisonTable` with
receipt-bearing rows · `/security` page · glossary/`GlossTerm` content ·
legal copy finalized with counsel · full claims ledger populated.

**Exit tests:** compliance e2e asserts every required `DISC-*` id on every
flagged page · claims-ledger resolver passes with zero unverified rows ·
copy review against 02 §6 signed off · axe + keyboard suites green on all
routes · dark-launch states render truthfully with `RECS_API_URL` unset.

## W4 — Polish, SEO, ship

Motion tuning to 04 §5 (60 fps traces attached to PR) · perf hardening to
budgets · sitemap/robots/canonical/JSON-LD complete; `noindex` lifted at
cutover only · RUM live with p75 dashboards · Dockerfile + Helm entry +
upstream-declaration check + change-window step (07 §9) · staging bake ·
cutover (§5).

**Exit tests:** Lighthouse ≥ 95 ×4 on `/` and `/pricing` in CI **and** on the
staging URL · RUM beacons visible end-to-end · `python -m alphaedge_platform`
green with the website chart included · launch-gate checklist (§4) 100%.

## 4. Launch gates (all mechanical, all blocking)

- [ ] REG-03 lint green over `website/` (with the failing-fixture test proving it bites)
- [ ] Disclaimer e2e green (every flagged surface carries its `DISC-*` id + version)
- [ ] Claims ledger: zero unverified rows; external stats pinned to primary sources
- [ ] Dark-launch honesty: RA-pending states verified on recs/track-record surfaces; no "SEBI-registered" phrasing anywhere
- [ ] Social-proof components confirmed dormant (no testimonials/logos/user counts render)
- [ ] Lighthouse ≥ 95 × 4 on `/` and `/pricing`; JS ≤ 100 KB gz; CLS ≤ 0.05; LCP ≤ 1.5 s lab
- [ ] axe zero violations all routes, both viewports; keyboard suite green; reduced-motion verified
- [ ] Both themes + deutan verified on every act; 320 px → 4K pass
- [ ] Legal pages counsel-approved; grievance/entity details resolved or their absence honestly stated
- [ ] Pricing/track-record render all three data states; no fabricated fallback anywhere
- [ ] Screenshot pipeline reproducible; no hand-edited images in the repo
- [ ] Public track-record decision implemented (07 §Open-1)
- [ ] Waitlist/signup CTA matches identity reality (Entra live ⇒ signup; else waitlist)
- [ ] Front Door routing + redirects tested on staging; `robots` flips at cutover

## 5. Cutover from `apps/web (marketing)`

1. Staging bake ≥ 1 week with RUM + error monitoring quiet.
2. Front Door: public hostname routes `/`, `/pricing`, and new public pages to
   the website; app routes stay on `apps/web`.
3. `apps/web (marketing)` pages become 308 redirects (the terminal already
   uses config-level 308s; same mechanism), keeping deep links alive.
4. One release later: delete the `(marketing)` group + its tests; update root
   README + CLAUDE.md doc pointers; record the removal in the execution log
   (docs/18) like any other landing.
5. Rollback = Front Door route flip back; nothing in `apps/web` is deleted
   until the site has survived a full week of market mornings.

## 6. Dependencies & risks

| Dependency | Impact | Mitigation |
|---|---|---|
| Entra External ID (identity unbuilt; auth stub refuses prod) | No real signup CTA | Waitlist CTA until live (00 §Open-2); copy switches by config |
| SEBI RA registration timing | Research acts must render pending states | Both states designed from W2; flip is data (06 §1) |
| Vendor licensing for recorded replay data | Hero data source | Ship synthetic labeled feed; upgrade to recorded replay only after rights review (00 §Open-1) |
| Entity/incorporation details | Legal pages | Counsel-pending states; launch gate blocks on resolution |
| svc-recs anonymous read | Public track record | 07 §Open-1; fallback is launching the section with the embed pointing users to sign in — stated, not hidden |

## Open questions

1. Who owns copywriting finalization (founder voice vs. this doc's drafts)?
   Copy review is a named launch-gate step; assign the reviewer in W1.
2. Do we want a `/changelog` (public build-log excerpts — the root README's
   narrative style would market well)? Post-launch candidate; reserve route.
3. Blog/education content strategy (SEO long game) — separate doc when the
   core site ships.
