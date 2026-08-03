import { OG_SIZE, ogImage } from "@/lib/og-template";

export const alt = "AlphaEdge track record — a record no one can edit.";
export const size = OG_SIZE;
export const contentType = "image/png";

// No figures here ever — the page's numbers come from the live transparency
// API with their disclaimer; an OG image can carry neither, so it carries
// neither the numbers.
export default function OpengraphImage() {
  return ogImage(
    "A track record no one can edit.",
    "Every published call scored to its exit — losers included, net of charges.",
  );
}
