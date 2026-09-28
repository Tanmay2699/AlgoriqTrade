import { OG_SIZE, ogImage } from "@/lib/og-template";

export const alt = "Algoryq Trade pricing — four tiers, no asterisks.";
export const size = OG_SIZE;
export const contentType = "image/png";

// Words only — prices render live from svc-billing on the page itself, and
// an OG image is exactly the kind of baked surface they must never enter.
export default function OpengraphImage() {
  return ogImage(
    "Four tiers, no asterisks.",
    "The Free tier is a full sandbox on delayed data — free, no card required.",
  );
}
