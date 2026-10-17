import { test } from "node:test";
import assert from "node:assert/strict";
import { gpuScore } from "./gpu.ts";
 
const rtx5060 = { model: "NVIDIA GeForce RTX 5060", timespyGraphics: 12306, timespyRefTgpW: 115 };
const radeon890m = { model: "AMD Radeon 890M", timespyGraphics: 3331, timespyRefTgpW: null };
 
test("same TGP as the reference: score unchanged", () => {
  assert.equal(gpuScore({ gpu: rtx5060, gpuTgpW: 115 }), 12306);
});
 
test("lower TGP loses less than linearly", () => {
  const score = gpuScore({ gpu: rtx5060, gpuTgpW: 55 });
  assert.ok(score < 12306);
  assert.ok(score > 12306 * (55 / 115));
  assert.ok(Math.abs(score - 12306 * Math.sqrt(55 / 115)) < 1);
});
 
test("integrated GPU: no TGP correction", () => {
  assert.equal(gpuScore({ gpu: radeon890m, gpuTgpW: null }), 3331);
});
 
test("unknown laptop TGP: use the reference score", () => {
  assert.equal(gpuScore({ gpu: rtx5060, gpuTgpW: null }), 12306);
});
 
test("higher TGP than the reference: no bonus", () => {
  assert.equal(gpuScore({ gpu: rtx5060, gpuTgpW: 140 }), 12306);
});
 