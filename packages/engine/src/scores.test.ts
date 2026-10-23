import { test } from "node:test";
import assert from "node:assert/strict";
import { subScores } from "./scores.ts";
import type { Candidate } from "./types.ts";

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

test("identical candidates score 100 everywhere", () => {
    const[a, b] = subScores([makeCandidate(), makeCandidate({configurationId: 2})]);
    assert.deepEqual(a, b);
    assert.equal(a.cpu, 100);
    assert.equal(a.portability, 100);
});

test("lighter laptop with a bigger battery wins portability", () => {
    const [light, heavy] = subScores([
        makeCandidate({ weightG: 1500, batteryWh: 80 }),
        makeCandidate({ weightG: 2500, batteryWh: 50 }),
    ]);
    assert.equal(light.portability, 100);
    assert.equal(heavy.portability, 0);
});

test("With the same hardware, the more affordable “Value” model comes out on top", () => {
    const[a, b] = subScores([makeCandidate({priceKurus: 2_500_000}), makeCandidate({priceKurus: 3_500_000})]);
    assert.equal(a.value, 100);
    assert.equal(b.value, 0);
});
