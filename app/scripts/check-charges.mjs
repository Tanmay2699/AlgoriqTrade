/**
 * The homepage calculator (src/lib/charges.ts) must reproduce the charges
 * engine's generated example to the paisa. If packages/charges changes its
 * schedule and the example is regenerated, this fails until the mirror is
 * updated — the calculator can never quietly disagree with the engine.
 *
 * Node ≥ 22.18 strips TypeScript types natively, so the lib imports as-is.
 */
import { readFileSync } from "node:fs";
import { intradayCharges } from "../src/lib/charges.ts";

const example = JSON.parse(
  readFileSync(new URL("../src/lib/charges-example.gen.json", import.meta.url), "utf8"),
);
const got = intradayCharges(example.inputs.notional_paise_per_side);
const errors = [];

for (const want of example.lines) {
  const line = got.lines.find((l) => l.label === want.label);
  if (!line) errors.push(`missing line ${want.label}`);
  else if (line.buy !== want.buy_paise || line.sell !== want.sell_paise)
    errors.push(`${want.label}: got ${line.buy}/${line.sell}, engine ${want.buy_paise}/${want.sell_paise}`);
}
if (got.buyTotal !== example.buy_total_paise) errors.push(`buy total ${got.buyTotal} ≠ ${example.buy_total_paise}`);
if (got.sellTotal !== example.sell_total_paise) errors.push(`sell total ${got.sellTotal} ≠ ${example.sell_total_paise}`);
if (got.roundTrip !== example.round_trip_total_paise) errors.push(`round trip ${got.roundTrip} ≠ ${example.round_trip_total_paise}`);

if (errors.length) {
  console.error(`check-charges: calculator disagrees with the engine example\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`check-charges: OK — calculator matches the engine example (${example.lines.length} lines, round trip ${got.roundTrip} paise).`);
