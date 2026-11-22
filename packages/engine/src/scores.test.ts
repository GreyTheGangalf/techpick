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
        panel: "ips",
        priceKurus: 3_000_000, // 30.000 TL
        ...overrides,
    };
}

test("identical candidates score 100 everywhere", () => {
    const [a, b] = subScores([makeCandidate(), makeCandidate({ configurationId: 2 })]);
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
    const [a, b] = subScores([makeCandidate({ priceKurus: 2_500_000 }), makeCandidate({ priceKurus: 3_500_000 })]);
    assert.equal(a.value, 100);
    assert.equal(b.value, 0);
});

test("OLED beats IPS, TN comes last", () => {
    const [oled, ips, tn] = subScores([
        makeCandidate({ panel: "oled" }),
        makeCandidate({ panel: "ips" }),
        makeCandidate({ panel: "tn" }),
    ]);
    assert.equal(oled.screen, 100);
    assert.equal(ips.screen, 68.75);
    assert.equal(tn.screen, 0);
});

test("unknown panel scores like IPS", () => {
    const [, ips, unknown] = subScores([
        makeCandidate({ panel: "oled" }),
        makeCandidate({ panel: "ips" }),
        makeCandidate({ panel: null }),
    ]);
    assert.equal(unknown.screen, ips.screen);
});

test("same panel everywhere: screen is 100 for all", () => {
    const [a, b] = subScores([makeCandidate({ panel: "tn" }), makeCandidate({ panel: "tn" })]);
    assert.equal(a.screen, 100);
    assert.equal(b.screen, 100);
});

const appleGpu = { model: "Apple M4 10-Core GPU", timespyGraphics: null, timespyRefTgpW: null };

test("unknown GPU gets 0 and does not shift the others", () => {
    const [strong, weak, unknown] = subScores([
        makeCandidate({ gpu: { model: "NVIDIA GeForce RTX 5060", timespyGraphics: 12306, timespyRefTgpW: 115 } }),
        makeCandidate({ gpu: { model: "AMD Radeon 890M", timespyGraphics: 3331, timespyRefTgpW: null }, gpuTgpW: null }),
        makeCandidate({ gpu: appleGpu, gpuTgpW: null }),
    ]);
    assert.equal(strong.gpu, 100);
    assert.equal(weak.gpu, 0);
    assert.equal(unknown.gpu, 0);
});

test("unknown GPU: value comes from the CPU alone", () => {
    const [known, unknown] = subScores([
        makeCandidate(),
        makeCandidate({ gpu: appleGpu, gpuTgpW: null }),
    ]);
    // same CPU and price: known = (100 + 100) / 2, unknown = 100 -> equal value
    assert.equal(known.value, unknown.value);
});
