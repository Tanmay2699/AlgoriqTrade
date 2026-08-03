/**
 * Generates src/lib/disclaimers.gen.ts from the canonical registry:
 *   packages/compliance/src/alphaedge_compliance/data/disclaimers.yaml
 *
 * Working rule 3 (website/README.md): the site never forks or rewords a
 * disclaimer. This generator is the mechanism — compliance/legal edit the
 * YAML, `pnpm gen:disclaimers` re-emits the TS, and `--check` (run in CI)
 * fails if the committed output has drifted, copying the contracts package's
 * freshness-guard pattern.
 *
 * The parser below handles exactly the subset that file uses — comments,
 * one scalar top-level key, a `disclaimers:` map of entries with `id`,
 * quoted `version`, and a `>-` folded `text` block — and throws on anything
 * else. It is deliberately not a YAML parser; a general dependency for one
 * fixed file adds a supply-chain surface for no benefit, and an unrecognised
 * construct should stop the build, not be guessed at (the repo-wide
 * refuse-rather-than-guess rule).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const YAML_PATH = join(
  HERE,
  "../../../packages/compliance/src/alphaedge_compliance/data/disclaimers.yaml",
);
const OUT_PATH = join(HERE, "../src/lib/disclaimers.gen.ts");

function parseRegistry(raw) {
  const lines = raw.split(/\r?\n/);
  let pinned = null;
  const entries = [];
  let current = null; // { key, id, version, text: [] }
  let inText = false;

  const finish = () => {
    if (!current) return;
    for (const field of ["id", "version"]) {
      if (!current[field]) throw new Error(`disclaimer ${current.key}: missing ${field}`);
    }
    if (current.text.length === 0) throw new Error(`disclaimer ${current.key}: missing text`);
    entries.push(current);
    current = null;
  };

  for (const line of lines) {
    if (/^\s*#/.test(line) || (!inText && line.trim() === "")) continue;

    // Folded text body: 6-space-indented continuation lines. A blank line (or
    // any dedent) ends the block — in this file blank lines only ever separate
    // entries, never occur inside a disclaimer's text.
    if (inText) {
      const m = /^ {6}(\S.*)$/.exec(line);
      if (m) {
        current.text.push(m[1].trimEnd());
        continue;
      }
      inText = false;
      if (line.trim() === "") continue;
      // otherwise fall through — this line belongs to the outer structure
    }

    let m;
    if ((m = /^pinned_report_disclaimer:\s*(\S+)\s*$/.exec(line))) {
      pinned = m[1];
    } else if (/^disclaimers:\s*$/.test(line)) {
      // section header — nothing to record
    } else if ((m = /^ {2}([A-Z_]+):\s*$/.exec(line))) {
      finish();
      current = { key: m[1], id: null, version: null, text: [] };
    } else if ((m = /^ {4}id:\s*(\S+)\s*$/.exec(line))) {
      current.id = m[1];
    } else if ((m = /^ {4}version:\s*"([^"]+)"\s*$/.exec(line))) {
      current.version = m[1];
    } else if (/^ {4}text:\s*>-\s*$/.test(line)) {
      inText = true;
    } else {
      throw new Error(`unrecognised line in disclaimers.yaml (refusing to guess): ${line}`);
    }
  }
  finish();

  if (!pinned) throw new Error("pinned_report_disclaimer not found");
  if (entries.length === 0) throw new Error("no disclaimers parsed");
  // `>-` folds lines with single spaces and strips the trailing newline.
  return {
    pinned,
    entries: entries.map((e) => ({ ...e, text: e.text.join(" ") })),
  };
}

function render({ pinned, entries }) {
  const keys = entries.map((e) => JSON.stringify(e.key)).join(" | ");
  const body = entries
    .map(
      (e) =>
        `  ${e.key}: {\n` +
        `    id: ${JSON.stringify(e.id)},\n` +
        `    version: ${JSON.stringify(e.version)},\n` +
        `    text: ${JSON.stringify(e.text)},\n` +
        `  },`,
    )
    .join("\n");
  return `// GENERATED FILE — do not edit.
//
// Source of truth: packages/compliance/src/alphaedge_compliance/data/disclaimers.yaml
// Regenerate: pnpm --filter @alphaedge/website gen:disclaimers
// CI freshness: pnpm --filter @alphaedge/website check:disclaimers
//
// Wording is canonical and compliance-owned; every surface renders these by id
// and never rewords them (website/docs/06 §1).

export type DisclaimerKey = ${keys};

export interface DisclaimerEntry {
  id: string;
  version: string;
  text: string;
}

export const PINNED_REPORT_DISCLAIMER: DisclaimerKey = ${JSON.stringify(pinned)};

export const DISCLAIMERS: Record<DisclaimerKey, DisclaimerEntry> = {
${body}
};
`;
}

const generated = render(parseRegistry(readFileSync(YAML_PATH, "utf8")));

if (process.argv.includes("--check")) {
  let existing = null;
  try {
    existing = readFileSync(OUT_PATH, "utf8");
  } catch {
    /* missing counts as stale */
  }
  if (existing !== generated) {
    console.error(
      "disclaimers.gen.ts is stale — run `pnpm --filter @alphaedge/website gen:disclaimers`",
    );
    process.exit(1);
  }
  console.log("disclaimers.gen.ts is fresh");
} else {
  writeFileSync(OUT_PATH, generated);
  console.log(`wrote ${OUT_PATH}`);
}
