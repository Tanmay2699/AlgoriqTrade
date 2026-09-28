/** Wilson interval sanity: the worked example on the site must match the
 *  textbook value (58/100 → 48.2%–67.2%) and the edges must clamp. */
import assert from "node:assert/strict";
import { wilson } from "../src/lib/stats.ts";

const r = wilson(58, 100);
assert.equal((r.low * 100).toFixed(1), "48.2");
assert.equal((r.high * 100).toFixed(1), "67.2");
assert.equal(wilson(0, 10).low, 0);
assert.equal(wilson(10, 10).high, 1);
assert.deepEqual(wilson(0, 0), { rate: 0, low: 0, high: 0 });
console.log("check-stats: OK — Wilson interval matches the reference values.");
