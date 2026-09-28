import { OG_SIZE, ogImage } from "@/lib/og-template";

export const alt = "How Algoryq Trade is built — invariants, gates and receipts.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogImage(
    "Built like it has to be right.",
    "Invariants, gates and receipts — enforced by CI, not by intentions.",
  );
}
