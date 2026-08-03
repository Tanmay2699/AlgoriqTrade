import { ImageResponse } from "next/og";

/**
 * Shared OG-image template (website/docs/07 §5) — one layout, a per-route
 * headline + support line. Claim-free by rule: OG images bypass the REG-03
 * lint, and the safe number of numbers in an unlintable surface is zero, so
 * callers pass words only. Colours are the dark tokens, hardcoded because
 * this renders outside the CSS pipeline.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const BG = "#09090b";
const INK = "#e4e4e7";
const INK_MUTED = "#a1a1aa";
const UP = "#34d399";
const LINE = "#27272a";

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
          <svg width="56" height="56" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill={BG} stroke={LINE} />
            <path
              d="M13 43 L26 27 L34 34 L51 16"
              fill="none"
              stroke={UP}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="51" cy="16" r="4" fill={UP} />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: INK }}>
            Alpha<span style={{ color: UP }}>Edge</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: INK,
              lineHeight: 1.15,
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
