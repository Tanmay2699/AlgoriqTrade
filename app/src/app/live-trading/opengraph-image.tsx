import { OG_SIZE, ogImage } from "@/lib/og-template";

export const alt = "AlphaEdge live trading — a graduation, not a default.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogImage(
    "Live trading is a graduation, not a default.",
    "Four gates, no automated orders, and your confirmation on every single one.",
  );
}
