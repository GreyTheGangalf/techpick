import { test } from "node:test";
import assert from "node:assert/strict";
import { explain } from "./explain.ts";
import { PROFILE_WEIGHTS } from "./weights.ts";
import type { Candidate } from "./types.ts";
import type { SubScores } from "./scores.ts";

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
        panel: "ips",
        priceKurus: 3_000_000, // 30.000 TL
        ...overrides,
    };
}

const sub: SubScores = { cpu: 60, gpu: 100, memory: 20, screen: 50, portability: 10, value: 80 };

test("gaming: strengths come from the biggest weighted contributions", () => {
    const e = explain(makeCandidate(), sub, PROFILE_WEIGHTS.gaming);
    assert.deepEqual(e.strengths, [
        "The graphics card is powerful enough for gaming and graphics-intensive tasks.",
        "Offers high performance for the price you pay.",
    ]);
});

test("weakness ignores sub-scores the profile does not care about", () => {
    // portability is 10 but gaming weighs it 0, so memory (20) is the weakness
    const e = explain(makeCandidate(), sub, PROFILE_WEIGHTS.gaming);
    assert.deepEqual(e.weaknesses, ["It has less memory than other options."]);
});

test("a top screen is a strength for creative work", () => {
    const e = explain(makeCandidate(), { ...sub, screen: 100 }, PROFILE_WEIGHTS.creative);
    assert.ok(e.strengths.includes("The screen is good."));
});

test("FreeDOS is always mentioned as a weakness", () => {
    const e = explain(makeCandidate({ os: "none" }), sub, PROFILE_WEIGHTS.gaming);
    assert.equal(e.weaknesses.length, 2);
});

test("unknown GPU: fixed note instead of a GPU reason", () => {
    const appleGpu = { model: "Apple M4 10-Core GPU", timespyGraphics: null, timespyRefTgpW: null };
    const e = explain(makeCandidate({ gpu: appleGpu, gpuTgpW: null }), { ...sub, gpu: 0 }, PROFILE_WEIGHTS.creative);
    assert.ok(e.weaknesses.includes("Graphics performance could not be measured; not recommended for demanding games."));
    assert.ok(!e.weaknesses.includes("The graphics card is weak compared to other options; it will struggle with demanding games."));
    assert.ok(!e.strengths.includes("The graphics card is powerful enough for gaming and graphics-intensive tasks."));
});