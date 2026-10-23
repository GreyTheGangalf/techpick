import { test } from "node:test";
import assert from "node:assert/strict";
import { combineWeights, PROFILE_WEIGHTS, weightedScore } from "./weights.ts";

test("a single profile returns its own row", () => {
    assert.deepEqual(combineWeights(["gaming"]), PROFILE_WEIGHTS.gaming);
});

test("two profiles are averaged field by field", () => {
    assert.deepEqual(combineWeights(["gaming", "software"]), {
        cpu: 22.5, gpu: 25, memory: 17.5, screen: 15, portability: 7.5, value: 12.5,
    });
});

test("no profile falls back to student", () => {
    assert.deepEqual(combineWeights([]), PROFILE_WEIGHTS.student);
});

test("weightedScore: all 100s give 100, gaming favours gpu", () => {
    const all100 = { cpu: 100, gpu: 100, memory: 100, screen: 100, portability: 100, value: 100 };
    assert.equal(weightedScore(all100, PROFILE_WEIGHTS.gaming), 100);
    const onlyGpu = { ...all100, cpu: 0, memory: 0, screen: 0, portability: 0, value: 0 };
    assert.equal(weightedScore(onlyGpu, PROFILE_WEIGHTS.gaming), 45);
});