import { test } from "node:test";
import assert from "node:assert/strict";
import type { Answers, Candidate } from "./types.ts";
import { penalty } from "./penalties.ts";

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

test("price over budget and weight is in range", () => {
  const c = makeCandidate({ priceKurus: 3_150_000 })
  assert.equal(penalty(c, makeAnswers()), 10);
});

test("price in budget and weight is out of range", () => {
  const c = makeCandidate({ priceKurus: 3_000_000, weightG: 2500 })
  assert.equal(penalty(c, makeAnswers({ portability: "daily" })), 10);
});

test("Suites both", () => {
  const c = makeCandidate({ priceKurus: 3_000_000, weightG: 1500 })
  assert.equal(penalty(c, makeAnswers()), 0);
});

test("portability = sometimes and weight is out of range", () => {
  const c = makeCandidate({ weightG: 2300 });
  assert.equal(penalty(c, makeAnswers({ portability: "sometimes" })), 0)
});
test("portability is daily and weight is at maximum,in range,", () => {
  const c = makeCandidate({ weightG: 2200 });
  assert.equal(penalty(c, makeAnswers({ portability: "daily" })), 0)
});
