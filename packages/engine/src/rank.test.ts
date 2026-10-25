import type { Answers, Candidate } from "./types.ts";
import { rankCandidates } from "./rank.ts";
import { test } from "node:test";
import assert from "node:assert/strict";

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

test("best score comes first", () => {
  const ranked = rankCandidates(makeAnswers(), [
    makeCandidate({ configurationId: 1, familyId: 1, ramGb: 8 }),
    makeCandidate({ configurationId: 2, familyId: 2, ramGb: 32 }),
  ]);
  assert.deepEqual(ranked.map((r) => r.candidate.configurationId), [2, 1]);
});

test("only the best variant of a family survives", () => {
  const ranked = rankCandidates(makeAnswers(), [
    makeCandidate({ configurationId: 1, familyId: 7, ramGb: 16 }),
    makeCandidate({ configurationId: 2, familyId: 7, ramGb: 32 }),
    makeCandidate({ configurationId: 3, familyId: 8, ramGb: 8 }),
  ]);
  assert.deepEqual(ranked.map((r) => r.candidate.configurationId), [2, 3]);
});

test("filtered-out candidates never appear", () => {
  const ranked = rankCandidates(makeAnswers(), [makeCandidate({ priceKurus: 4_000_000 })]);
  assert.deepEqual(ranked, []);
});