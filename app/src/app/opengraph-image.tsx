import { OG_SIZE, ogImage } from "@/lib/og-template";

export const alt =
  "AlphaEdge — the market is real, the money is virtual, the discipline is yours.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogImage(
    "The market is real. The money is virtual. The discipline is yours.",
    "Market intelligence & paper trading for Indian markets",
  );
}
