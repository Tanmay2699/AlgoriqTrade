# 04 — Design Language

**Purpose:** The visual and motion system for the website: what "premium
fintech" means concretely here — tokens, type, spacing, motion, imagery, and
the data-visualization honesty rules that make this site recognizably the same
company as the terminal.

**Key decisions**

1. **Dark-first, both themes shipped.** The site defaults dark *regardless of
   `prefers-color-scheme`* — the terminal's own documented rule ("a white
   flash at 09:15 is its own bug") — with a complete light theme, a persisted
   manual toggle in the footer, and the terminal's pre-paint bootstrap pattern
   so there is no theme flash.
2. **The terminal is the brand.** Screens, charts, and the ladder/chain/ticket
   are the imagery. No stock photography, no 3D abstractions, no illustrated
   mascots. Restraint + density-on-demand is the aesthetic.
3. **One token architecture shared in spirit with `apps/web`**: semantic CSS
   custom properties, chart canvases reading colors *from* the tokens (the
   terminal's `lib/theme.tsx` pattern) so theme switches reach every canvas.
4. **Honest visualization is a design rule, not a compliance afterthought**
   (§7): labeled data sources on the canvas, no truncated axes for drama,
   green/red reserved for signed market data.
5. Final font/hex selections happen in W1 against real specimens and the
   contrast validator; this doc pins roles, scales, and constraints so that
   choice is a swap, not a redesign. **Before any chart or stat-tile code is
   written, load the `dataviz` skill** (repo working note) — its palette
   method + validator governs chart colors.

---

## 1. Brand personality

Precision without coldness. Institutional without stuffiness. Indian without
cliché (no saffron-gradient fintech tropes; IST, ₹, and the exchanges appear
as facts, not decoration). The emotional register is the good kind of quiet:
the site feels like sitting down at a well-organized desk before the open —
everything in reach, nothing shouting.

Reference blend (from the brief): Bloomberg's authority · TradingView's
chart-forward clarity · Stripe's typographic restraint · Linear's motion
discipline · Apple's sectional storytelling. We copy none of them; we sit in
the intersection.

## 2. Color system

Token architecture (semantic layer over a raw palette; raw values chosen in
W1, validated for AA at every documented pairing):

```
--bg-canvas      page background        (near-black slate, not pure #000; light: near-white)
--bg-surface     cards, panels          (one step up from canvas)
--bg-raised      hovers, popovers       (two steps up)
--ink-strong     headlines              (≥ 12:1 on canvas)
--ink            body                   (≥ 7:1)
--ink-muted      captions, labels       (≥ 4.5:1 — never lower for text)
--accent         brand accent           (single accent family; see below)
--accent-ink     text/icons on accent
--line           hairlines, dividers    (1px, low-contrast)
--focus          focus rings            (2px, ≥ 3:1 against both bg and element)
--gain / --loss  signed market data ONLY (see §7)
--warn / --info  status semantics
```

**Inherited base — the terminal's real tokens** (`apps/web/src/app/globals.css`,
Tailwind v4 `@theme inline` over `--ae-*` variables). Product embeds use these
exact values; the site shell derives from them:

| Token | Dark (default) | Light |
|---|---|---|
| bg | `#09090b` | `#ffffff` |
| panel | `#18181b` | `#f6f7f9` |
| up / down | `#34d399` / `#f87171` | `#15803d` / `#b91c1c` |
| warn | `#f59e0b` | — |
| accent | `#34d399` | `#047857` |

Notes that bind the site: the terminal's accent *is* the gain-green ("terminal
phosphor" is already the brand); soft tints are **committed color pairs, never
one color at an opacity** (the terminal documents why: `bg-up/40 text-up`
measures 3.7:1 and no alpha fixes it — its committed pairs are ≥ 8:1); a
second theme axis `data-cvd="deutan"` swaps up/down to `#2563eb`/`#f97316` and
the site's market-data demos honor it.

**Accent direction:** keep the phosphor-green accent family for brand
continuity, but evaluate in W1 whether the *site shell* needs a
differentiated accent (green is overloaded with "gain" on data-dense
sections); candidates: stay green everywhere, or indigo shell + green data.
Decided with both themes side-by-side. Gradients: at most one, subtle, on the hero canvas glow — never
on text, never rainbow-fintech.

**Market semantics:** `--gain`/`--loss` default green/red (Indian convention:
green up, red down), with the colorblind-safe alternate palette the terminal
already supports (blue/orange class) available under the same tokens — the
site's demo charts honor the same toggle. Green/red are **never** used for
non-market meaning (no green "success" checkmarks — use accent/ink), so the
signal stays unambiguous.

## 3. Typography

| Role | Face (class) | Notes |
|---|---|---|
| Display / headlines | A sharp contemporary grotesk with real display weights (candidates: Geist, Inter Display, General Sans class) | Tight tracking at large sizes; `text-wrap: balance` |
| Body / UI | Same family as display or its text cut | 16–18px base, 1.6 line-height, 65–75ch measure |
| Data / numerals | Tabular lining numerals (`font-feature-settings: "tnum"`) everywhere a number appears; mono (Geist Mono / JetBrains Mono class) for code, order tickets, hashes | Numbers must not jiggle as they tick |

Self-hosted only (07 §5), two families max, ≤ 4 weights total, `font-display:
swap` with metric-compatible fallbacks so CLS stays 0. Deliberate divergence
from the terminal, which uses the **system font stack** (no webfont at all, by
choice) — right for an app shell, too anonymous for a brand's front door.
Consequence to embrace, not hide: real product screenshots will show
system-stack type inside the frames while the page voice is ours.

Type scale (fluid, clamp-based): display 56→96px · h1 40→64 · h2 32→44 ·
h3 24→28 · body 16→18 · caption 13→14. Headline case: sentence case
everywhere (no Title Case, no ALL CAPS except tiny labels with letterspacing).

Numbers get typographic respect: ₹ formatting with Indian digit grouping
(1,00,000), paise only where honest precision demands it, units set in muted
ink ("p99 **25 ms**").

## 4. Spacing, grid, radius, elevation

- 4px base scale; section vertical rhythm 96–160px desktop / 64–96px mobile.
- 12-column grid, content max-width 1200px; full-bleed moments (hero canvas,
  terminal showcase) may extend to 1440px with the *text* column staying ≤
  1200. Ultra-wide (>1920): canvas backgrounds extend, content doesn't stretch.
- Radius: 8px controls, 12–16px cards, full for pills. One radius language.
- Elevation by **border + subtle bg step**, not drop-shadow soup; a single
  shadow token for popovers. Hairlines (`--line`) do most structural work —
  the terminal's aesthetic.

## 5. Motion

Principles (Linear/Apple class, enforced in review):

- **Motion explains, never decorates.** Every animation answers "what changed
  or where am I". Section reveals: 250–400ms, `cubic-bezier(0.22, 1, 0.36, 1)`
  (ease-out-quint class), translate ≤ 16px + fade, once per element, no
  re-trigger on scroll-up.
- **No scroll-jacking. Ever.** Scroll position belongs to the user. Parallax
  ≤ 8% displacement, opt-in per section, and only where it doesn't harm LCP/INP.
- The hero terminal animates **data, not chrome**: ticks paint, candles form,
  the tape moves — panels themselves don't fly around.
- Numbers count-up only on first reveal, ≤ 600ms, tabular so width is stable.
- `prefers-reduced-motion`: everything renders in final state; the hero shows
  a static (still fully labeled) frame; count-ups render final values. This is
  a first-class rendering mode, tested in CI (07 §7), not a degradation.
- 60fps floor: only `transform`/`opacity` animate; anything else needs a
  perf-note in the PR.

## 6. Imagery & screenshots

- **Real product only.** The screenshot pipeline (08 §W2) boots the terminal
  against the synthetic dev feed, captures at 2x in both themes, and stamps
  the data-source label. Screenshots are never hand-edited; annotation
  (callout rings, dimming) is applied as an overlay layer in code so the
  underlying capture stays authentic and re-capturable.
- Device frames: neutral, generic (no Apple trade-dress frames), used for the
  responsive/device act; the rest of the site shows the product full-bleed.
- Decorative texture allowed: faint grid/graph-paper motifs, subtle noise,
  glow behind the hero canvas — never fake UI, never fake charts.
- Diagrams (architecture, four-gates, audit chain) follow the same token
  system; drawn as SVG/HTML, text selectable, alt-texted (§8).

## 7. Data-visualization honesty rules (binding)

The platform refuses to fabricate; its marketing charts inherit that:

1. **Every chart names its data** on the canvas: "Simulated feed" /
   "Recorded session {date}" / "Live from API" — the terminal's
   delayed-watermark pattern, applied to marketing.
2. **No truncated axes for drama.** Bar/area baselines at zero; line charts
   may window but must label the range. No cherry-picked windows on any
   outcome data (track-record embed renders the API's own series whole).
3. Green/red only for signed market values; single-hue for everything else;
   the colorblind alternate must survive every chart (validator in the
   `dataviz` skill method at build time).
4. Charts are the terminal's own renderers where possible (Lightweight Charts
   with token-fed colors) — marketing charts that *look* different from
   product charts are a quiet lie.
5. Backtest visuals always show their watermarks (`IN_SAMPLE`, etc.) and
   sit adjacent to the `BACKTEST` disclaimer (06 §1).
6. Stat tiles distinguish **measured** (ledger-linked, dated) from
   **budget/target** ("LCP budget ≤ 1.5s") in their label — the SKIPPED-check
   lesson applied to marketing numbers.

## 8. Accessibility (design-side; engineering in 07 §7)

WCAG 2.2 AA floor: text contrast per §2 minima in both themes · focus visible
on every interactive element (`--focus`, never `outline: none` without
replacement) · all copy is HTML text, never in images (screenshots get full
alt text describing what the screen shows) · hit targets ≥ 44px · headings
form a real outline (one h1/page) · glossed jargon via accessible tooltip
pattern (05 §11) · animation obeys reduced-motion (§5) · color never the sole
carrier of meaning (gain/loss pair with sign/arrow glyphs — the terminal's
"text as well as colour" session-badge rule).

## Open questions

1. Final type pairing + accent hex: W1 specimen review (two candidates each,
   both themes, contrast-validated) — decision recorded here when made.
2. Does the site adopt the terminal's exact dark palette values for product
   embeds (visual continuity) while using its own canvas tones for the page
   shell? Leaning yes: embeds match the product pixel-for-pixel.
3. Light-theme hero: same replay canvas re-tokened, or a "daylight desk"
   variant? Decide from the W2 prototype.
4. OG/social imagery template (dark, chart-motif, claim-free) — design in W2
   alongside SEO work.
