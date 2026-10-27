import { test } from "node:test";
import assert from "node:assert/strict";
import { normalize } from "./normalize.ts";

test("slowest gets 0, fastest gets 100, others scale linearly", () => {
  const [a, b, c] = normalize([700, 1000, 1600]);
  assert.equal(a, 0);
  assert.equal(c, 100);
  assert.ok(Math.abs(b - 33.33) < 0.01);
});

test("a single candidate gets 100 instead of NaN", () => {
  assert.deepEqual(normalize([958]), [100]);
});

test("equal candidates all get 100", () => {
  assert.deepEqual(normalize([500, 500]), [100, 100]);
});

test("lowerIsBetter: lightest gets 100, heaviest gets 0", () => {
  assert.deepEqual(normalize([1500, 2000, 2500], true), [100, 50, 0]);
});

test("lowerIsBetter still gives 100 to equal candidates", () => {
  assert.deepEqual(normalize([1800, 1800], true), [100, 100]);
});