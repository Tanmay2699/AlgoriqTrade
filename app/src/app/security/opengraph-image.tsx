import { OG_SIZE, ogImage } from "@/lib/og-template";

export const alt = "AlphaEdge security — the posture, stated plainly.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return ogImage("Security posture, stated plainly.", "Including what doesn't exist yet.");
}
