import { test } from "node:test";
import assert from "node:assert/strict";
import { filterCandidates, screenSizeOf } from "./filter.ts";
import type { Answers, Candidate } from "./types.ts";
 
function makeCandidate(overrides: Partial<Candidate> = {}): Candidate {
  return {
    configurationId: 1,
    familyId: 1,
    os: "windows",
    cpu: { model: "AMD Ryzen 7 260", cb2024Single: 104, cb2024Multi: 961 },
    gpu: { model: "NVIDIA GeForce RTX 5060", timespyGraphics: 12306, timespyRefTgpW: 115 },
    gpuTgpW: 115,
    ramGb: 16,
    storageGb: 512,
    weightG: 2200,
    batteryWh: 70,
    screenSizeIn: 16,
    priceKurus: 3_000_000, // 30.000 TL
    ...overrides,
  };
}
 
function makeAnswers(overrides: Partial<Answers> = {}): Answers {
  return {
    budgetKurus: 3_000_000,
    profiles: ["student"],
    portability: "sometimes",
    screenSizes: [],
    os: [],
    ...overrides,
  };
}
 
test("price exactly at budget + 5% passes, one kurus more is dropped", () => {
  const atLimit = makeCandidate({ configurationId: 1, priceKurus: 3_150_000 });
  const over = makeCandidate({ configurationId: 2, priceKurus: 3_150_001 });
  const result = filterCandidates(makeAnswers(), [atLimit, over]);
  assert.deepEqual(result.map((c) => c.configurationId), [1]);
});
 
test("empty os and screen lists accept everything", () => {
  const all = [
    makeCandidate({ configurationId: 1, os: "macos", screenSizeIn: 13.6 }),
    makeCandidate({ configurationId: 2, os: "none", screenSizeIn: 17.3 }),
  ];
  assert.equal(filterCandidates(makeAnswers(), all).length, 2);
});
 
test("os filter: FreeDOS counts as Windows, macOS does not", () => {
  const all = [
    makeCandidate({ configurationId: 1, os: "windows" }),
    makeCandidate({ configurationId: 2, os: "none" }),
    makeCandidate({ configurationId: 3, os: "macos" }),
  ];
  const result = filterCandidates(makeAnswers({ os: ["windows"] }), all);
  assert.deepEqual(result.map((c) => c.configurationId), [1, 2]);
});
 
test("screen groups: 14 small, 15.3 and 16 medium, 17.3 large", () => {
  assert.equal(screenSizeOf(14), "small");
  assert.equal(screenSizeOf(15.3), "medium");
  assert.equal(screenSizeOf(16), "medium");
  assert.equal(screenSizeOf(17.3), "large");
});
 
test("no candidate passes: returns an empty list, no error", () => {
  const result = filterCandidates(makeAnswers({ budgetKurus: 100 }), [makeCandidate()]);
  assert.deepEqual(result, []);
});
 
test("order of the remaining candidates is kept", () => {
  const all = [3, 1, 2].map((id) => makeCandidate({ configurationId: id }));
  const result = filterCandidates(makeAnswers(), all);
  assert.deepEqual(result.map((c) => c.configurationId), [3, 1, 2]);
});