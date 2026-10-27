import { test } from "node:test";
import assert from "node:assert/strict";
import type { Answers, Candidate } from "./types.ts";
import {recommend} from "./recommend.ts"

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

test("every card has at least one weakness", () => {
    const r = recommend(makeAnswers(), [
        makeCandidate({ configurationId: 1, familyId: 1, ramGb: 32 }),
        makeCandidate({ configurationId: 2, familyId: 2, priceKurus: 2_400_000 }),
        makeCandidate({ configurationId: 3, familyId: 3, ramGb: 8, priceKurus: 3_100_000 }),
    ]);
    for (const card of [r.bestMatch, r.bestValue, r.stepUp]) {
        assert.ok(card !== null);
        assert.ok(card.explanation.weaknesses.length >= 1);
    }
});

test("nothing fits the filters: three empty cards", () => {
    const r = recommend(makeAnswers({ os: ["macos"] }), [makeCandidate()]);
    assert.deepEqual(r, { bestMatch: null, bestValue: null, stepUp: null });
});