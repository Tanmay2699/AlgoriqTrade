/**
 * Claims-ledger resolver (website/docs/06 §4, 07 §8 item 3) — the CI half of
 * working rule 5 ("claims with receipts"). Three mechanical checks:
 *
 *  1. Every `CL-xxx` id referenced in site source resolves to a ledger row.
 *  2. No referenced row is `pending` — a pending claim may not appear in
 *     published copy (the CL-014 rule).
 *  3. Every repo-relative receipt path in the ledger still exists — a moved
 *     receipt flags the row for re-verification instead of silently rotting.
 *
 * Unreferenced verified rows are reported informationally, not failed: some
 * rows receipt whole surfaces (e.g. the quota matrix) rather than a copy
 * string.
 */

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const APP_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(APP_DIR, "..", "..");
const LEDGER = join(REPO_ROOT, "website", "docs", "claims-ledger.md");
const SRC = join(APP_DIR, "src");

// ---- 1. Parse the ledger table -------------------------------------------

const rows = new Map(); // id -> { receipt, status, pending }
for (const line of readFileSync(LEDGER, "utf8").split("\n")) {
  if (!line.startsWith("| CL-")) continue;
  const cells = line.split("|").map((c) => c.trim());
  // ["", id, claim, receipt, status, trigger, ""]
  const [, id, , receipt, status] = cells;
  if (!/^CL-\d{3}$/.test(id)) continue;
  rows.set(id, { receipt, status, pending: /\bpending\b/i.test(status) });
}
if (rows.size === 0) {
  console.error(`check-claims: no ledger rows parsed from ${LEDGER}`);
  process.exit(1);
}

// ---- 2. Scan site source for CL- references ------------------------------

/** @type {{ id: string, file: string, line: number }[]} */
const refs = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(ts|tsx|mjs)$/.test(entry.name)) {
      const lines = readFileSync(p, "utf8").split("\n");
      lines.forEach((text, i) => {
        for (const m of text.matchAll(/CL-\d{3}/g)) {
          refs.push({ id: m[0], file: p.slice(REPO_ROOT.length + 1), line: i + 1 });
        }
      });
    }
  }
}
walk(SRC);

const errors = [];

for (const ref of refs) {
  const row = rows.get(ref.id);
  if (!row) {
    errors.push(`${ref.file}:${ref.line} references ${ref.id}, which has no ledger row`);
  } else if (row.pending) {
    errors.push(
      `${ref.file}:${ref.line} references ${ref.id}, whose ledger status is pending — ` +
        `a pending claim may not appear in published copy`,
    );
  }
}

// ---- 3. Receipt paths still exist ----------------------------------------

// Repo-relative, extension-bearing tokens only; prose, endpoint fragments and
// directory mentions are deliberately not checked.
const PATH_RE =
  /(?:services|packages|lakehouse|apps|platform|website|docs|tests|\.github)\/[A-Za-z0-9_./-]+/g;

for (const [id, row] of rows) {
  for (const m of row.receipt.matchAll(PATH_RE)) {
    let token = m[0].replace(/:[\d-]+$/, "").replace(/[),;.]+$/, "");
    if (!/\.[a-z]{1,4}$/i.test(token) || token.endsWith("/")) continue;
    const abs = join(REPO_ROOT, token);
    if (!existsSync(abs) || !statSync(abs).isFile()) {
      errors.push(`${id}: receipt path does not exist — ${token} (re-verify or fix the row)`);
    }
  }
}

// ---- Report --------------------------------------------------------------

const referenced = new Set(refs.map((r) => r.id));
const unreferenced = [...rows.keys()].filter((id) => !referenced.has(id) && !rows.get(id).pending);

if (errors.length > 0) {
  console.error(`check-claims: ${errors.length} error(s)\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log(
  `check-claims: OK — ${referenced.size} claim id(s) referenced across ${refs.length} site(s), ` +
    `${rows.size} ledger rows, all receipts present.`,
);
if (unreferenced.length > 0) {
  console.log(`  note: rows not referenced in code (surface-level receipts): ${unreferenced.join(", ")}`);
}
const pendingRows = [...rows.entries()].filter(([, r]) => r.pending).map(([id]) => id);
if (pendingRows.length > 0) {
  console.log(`  note: pending rows (must stay out of copy): ${pendingRows.join(", ")}`);
}
