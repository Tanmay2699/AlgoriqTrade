/**
 * Internal link checker (website/docs/07 §8 item 8): every internal href in
 * site source must resolve to a real route, and every fragment to a real id.
 *
 * Scans source rather than built HTML so links on dynamic pages (pricing,
 * track-record) are covered too. Literal hrefs only — this codebase has no
 * computed link targets, and the check exists to catch typos and routes
 * renamed out from under their links.
 *
 * Fragment ids are collected globally (not per-page); precise enough here
 * because ids are unique across the site (one homepage owns the act ids).
 */

import { readdirSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(APP_DIR, "src");
const APP_ROUTER = join(SRC, "app");

// ---- Routes from the filesystem (the e2e walker's rules) -----------------

const routes = new Set(["/robots.txt", "/sitemap.xml"]);
function walkRoutes(dir, url) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const { name } = entry;
    if (name.startsWith("_") || name === "api" || name.startsWith("[")) continue;
    const segment = name.startsWith("(") && name.endsWith(")") ? url : `${url}/${name}`;
    walkRoutes(join(dir, name), segment);
  }
  if (readdirSync(dir).includes("page.tsx")) routes.add(url || "/");
}
walkRoutes(APP_ROUTER, "");

// ---- Hrefs + ids from source ---------------------------------------------

/** @type {{ href: string, file: string, line: number }[]} */
const hrefs = [];
const ids = new Set(["main"]); // layout's <main id="main">

function walkSource(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walkSource(p);
    else if (/\.(ts|tsx)$/.test(entry.name)) {
      const lines = readFileSync(p, "utf8").split("\n");
      lines.forEach((text, i) => {
        // JSX attribute form and copy-module object form.
        for (const m of text.matchAll(/href=["']([^"']+)["']|href:\s*["']([^"']+)["']/g)) {
          const href = m[1] ?? m[2];
          if (href.startsWith("/")) {
            hrefs.push({ href, file: p.slice(APP_DIR.length + 1), line: i + 1 });
          }
        }
        for (const m of text.matchAll(/\bid=["']([A-Za-z][\w-]*)["']/g)) {
          ids.add(m[1]);
        }
      });
    }
  }
}
walkSource(SRC);

// ---- Validate ------------------------------------------------------------

const errors = [];
for (const ref of hrefs) {
  const [withoutHash, fragment] = ref.href.split("#");
  const path = withoutHash.split("?")[0].replace(/\/$/, "") || "/";
  if (path.startsWith("/api/")) continue; // endpoints, not pages
  if (!routes.has(path)) {
    errors.push(`${ref.file}:${ref.line} links to ${ref.href} — no such route (known: ${[...routes].sort().join(", ")})`);
    continue;
  }
  if (fragment && !ids.has(fragment)) {
    errors.push(`${ref.file}:${ref.line} links to ${ref.href} — no element with id="${fragment}" in source`);
  }
}

if (errors.length > 0) {
  console.error(`check-links: ${errors.length} broken internal link(s)\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log(
  `check-links: OK — ${hrefs.length} internal links across source resolve against ${routes.size} routes.`,
);
