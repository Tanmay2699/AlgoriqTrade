import { ImageResponse } from "next/og";

/**
 * Shared OG-image template (website/docs/07 §5) — one layout, a per-route
 * headline + support line. Claim-free by rule: OG images bypass the REG-03
 * lint, and the safe number of numbers in an unlintable surface is zero, so
 * callers pass words only. Colours are the dark tokens, hardcoded because
 * this renders outside the CSS pipeline.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const BG = "#070b14";
const INK = "#f8fafc";
const INK_MUTED = "#a3b1c6";
const ACCENT = "#3b82f6";
const LINK = "#60a5fa";
const LINE = "#1b2740";

export function ogImage(headline: string, support: string): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: 72,
          border: `1px solid ${LINE}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 28 28">
            <rect x="0.75" y="0.75" width="26.5" height="26.5" rx="7" fill="none" stroke={ACCENT} strokeWidth="1.5" />
            <rect x="7" y="14" width="3" height="7" rx="1" fill={LINK} />
            <rect x="12.5" y="10" width="3" height="11" rx="1" fill={LINK} />
            <rect x="18" y="6" width="3" height="15" rx="1" fill={INK} />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: INK }}>
            Algoryq<span style={{ color: LINK, marginLeft: 12 }}>Trade</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: INK,
              lineHeight: 1.1,
              letterSpacing: -1,
              maxWidth: 980,
            }}
          >
            {headline}
          </div>
          <div style={{ fontSize: 28, color: INK_MUTED, maxWidth: 980 }}>{support}</div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: INK_MUTED, letterSpacing: 2 }}>
          NSE · BSE · MCX · CURRENCY · MUTUAL FUNDS
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
