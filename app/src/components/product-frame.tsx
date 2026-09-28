import Image from "next/image";
import manifest from "@/lib/screens-manifest.gen.json";

/**
 * A real product screenshot in a frame (website/docs/05 §5). The image comes
 * from the capture pipeline (scripts/capture-screens.mjs) and can ONLY render
 * through its manifest entry — an id with no entry throws at render, so a
 * screen cannot appear without its provenance line. Captures are committed as
 * taken; there is no prop to override the caption or the source.
 *
 * Motion: a slow camera move (push in, pan, pull back) and a scan line
 * play over the capture while it is on screen — transform only, so the
 * screenshot itself is never altered.
 *
 * Theme swap: both variants are in the DOM, toggled by the `dark` class the
 * theme bootstrap maintains — the screenshot follows the visitor's theme the
 * way every token does.
 */

interface Variant {
  file: string;
  theme: string;
  kind: string;
  width: number;
  height: number;
}

interface Screen {
  id: string;
  path: string;
  caption: string;
  variants: Variant[];
}

function requireVariant(screen: Screen, theme: string): Variant {
  const v = screen.variants.find((x) => x.theme === theme && x.kind === "desktop");
  if (!v) throw new Error(`capture "${screen.id}" has no desktop/${theme} variant`);
  return v;
}

export function ProductFrame({ id }: { id: string }) {
  const screen = (manifest.screens as Screen[]).find((s) => s.id === id);
  if (!screen) {
    throw new Error(
      `no capture manifest entry for "${id}" — run scripts/capture-screens.mjs`,
    );
  }
  const dark = requireVariant(screen, "dark");
  const light = requireVariant(screen, "light");
  const alt = `Screenshot of the Algoryq Trade terminal: ${screen.caption}`;

  return (
    <figure data-capture-source={manifest.source}>
      {/* The camera moves; the capture's pixels never change. */}
      <div
        data-loop
        className="relative overflow-hidden rounded-2xl border border-line bg-panel shadow-[var(--ae-shadow)]"
      >
        <div className="ae-cam-inner">
          <Image
            src={dark.file}
            alt={alt}
            width={dark.width}
            height={dark.height}
            sizes="(min-width: 1024px) 1400px, 150vw"
            className="hidden w-full dark:block"
          />
          <Image
            src={light.file}
            alt={alt}
            width={light.width}
            height={light.height}
            sizes="(min-width: 1024px) 1400px, 150vw"
            className="w-full dark:hidden"
          />
        </div>
        <div aria-hidden="true" className="ae-scan" />
        <span aria-hidden="true" className="ae-pill absolute right-3 top-3 !bg-panel/80 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-link" />
          REAL CAPTURE · STUB FEED
        </span>
      </div>
      <figcaption className="mt-2 text-xs leading-relaxed text-ink-subtle">
        {screen.caption} {manifest.source}
      </figcaption>
    </figure>
  );
}
