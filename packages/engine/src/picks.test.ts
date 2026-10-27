import { test } from "node:test";
import assert from "node:assert/strict";
import { pickThree } from "./picks.ts";
import type { Ranked } from "./rank.ts";

function makeRanked(id: number, score: number, value: number, priceKurus: number): Ranked {
    return {
        candidate: {
            configurationId: id, familyId: id, os: "windows",
            cpu: { model: "x", cb2024Single: 100, cb2024Multi: 1000 },
            gpu: { model: "y", timespyGraphics: 10000, timespyRefTgpW: null },
            gpuTgpW: null, ramGb: 16, storageGb: 512, weightG: 2000, batteryWh: 60,
            screenSizeIn: 15.6, priceKurus
        },
        sub: { cpu: 50, gpu: 50, memory: 50, screen: 100, portability: 50, value },
        score,
    };
}

test("picks three different laptops by their roles", () => {
    const p = pickThree([
        makeRanked(1, 80, 60, 3_000_000),
        makeRanked(2, 75, 40, 3_100_000),
        makeRanked(3, 70, 100, 2_400_000),
    ]);
    assert.equal(p.bestMatch?.candidate.configurationId, 1);
    assert.equal(p.bestValue?.candidate.configurationId, 3);
    assert.equal(p.stepUp?.candidate.configurationId, 2);
});

test("no pricier option means no step-up", () => {
    const p = pickThree([makeRanked(1, 80, 60, 3_000_000), makeRanked(2, 70, 90, 2_500_000)]);
    assert.equal(p.bestValue?.candidate.configurationId, 2);
    assert.equal(p.stepUp, null);
});

test("empty list gives three nulls", () => {
    assert.deepEqual(pickThree([]), { bestMatch: null, bestValue: null, stepUp: null });
});