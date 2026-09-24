import { describe, expect, it } from "vitest";
import { FIXTURES, makeCandidate } from "./fixtures";
import { filterCandidates } from "./filters";
import { recommend } from "./recommend";
import { memoryScore, normalize } from "./scoring";
import type { Criteria } from "./types";
import { PROFILE_WEIGHTS, resolveWeights } from "./weights";

const base: Criteria = {
  budgetTry: 45000,
  profiles: ["student"],
  gaming: "none",
  portability: "sometimes",
  screen: "any",
  os: "any",
};

const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

describe("weights", () => {
  it("every profile row sums to 100", () => {
    for (const w of Object.values(PROFILE_WEIGHTS)) expect(sum(w)).toBe(100);
  });

  it("blended weights always sum to 100", () => {
    const w = resolveWeights({ ...base, profiles: ["developer", "creator"], gaming: "light", portability: "daily" });
    expect(sum(w)).toBeCloseTo(100);
  });

  it("gaming answered outside profiles raises the GPU weight", () => {
    const without = resolveWeights(base);
    const withHeavy = resolveWeights({ ...base, gaming: "heavy" });
    expect(withHeavy.gpu).toBeGreaterThan(without.gpu);
  });

  it("daily carrying raises the portability weight", () => {
    expect(resolveWeights({ ...base, portability: "daily" }).portability).toBeGreaterThan(
      resolveWeights({ ...base, portability: "rarely" }).portability,
    );
  });
});

describe("filters", () => {
  it("macOS preference keeps only Macs", () => {
    const pool = filterCandidates(FIXTURES, { ...base, os: "macos" });
    expect(pool.map((c) => c.id)).toEqual(["mac"]);
  });

  it("Windows preference accepts FreeDOS machines", () => {
    const freedos = makeCandidate({ id: "freedos", os: "freedos" });
    expect(filterCandidates([freedos], { ...base, os: "windows" })).toHaveLength(1);
  });

  it("drops anything above the stretch cap", () => {
    const pool = filterCandidates(FIXTURES, { ...base, budgetTry: 30000 });
    expect(pool.every((c) => c.priceTry <= 30000 * 1.15)).toBe(true);
  });

  it("small screen means under 15 inches", () => {
    const pool = filterCandidates(FIXTURES, { ...base, screen: "small" });
    expect(pool.every((c) => c.display.inches < 15)).toBe(true);
  });

  it("must-have OLED", () => {
    const pool = filterCandidates(FIXTURES, { ...base, mustHave: { oled: true } });
    expect(pool.map((c) => c.id)).toEqual(["ultrabook"]);
  });
});

describe("normalize", () => {
  it("maps to 0-100 and handles ties", () => {
    expect(normalize([1, 2, 3])).toEqual([0, 50, 100]);
    expect(normalize([5, 5])).toEqual([100, 100]);
  });
});

describe("memoryScore", () => {
  it("16 GB soldered is far ahead of 8 GB upgradeable", () => {
    const soldered16 = memoryScore(makeCandidate({ id: "a", ramGb: 16, ramUpgradeable: false }));
    const upgradeable8 = memoryScore(makeCandidate({ id: "b", ramGb: 8, ramUpgradeable: true }));
    expect(soldered16).toBeGreaterThan(upgradeable8 + 30);
  });

  it("saturates at 100", () => {
    expect(memoryScore(makeCandidate({ id: "c", ramGb: 64, storageGb: 2048 }))).toBe(100);
  });
});

describe("recommend", () => {
  it("a heavy gamer gets a dedicated GPU first", () => {
    const { picks } = recommend(FIXTURES, { ...base, profiles: ["gaming"], gaming: "heavy", portability: "rarely" });
    expect(picks[0]?.candidate.gpu.integrated).toBe(false);
  });

  it("a student carrying daily gets a light laptop first", () => {
    const { picks } = recommend(FIXTURES, { ...base, portability: "daily" });
    expect(picks[0]?.candidate.weightKg).toBeLessThan(1.5);
  });

  it("returns at most three picks from distinct families", () => {
    const { picks } = recommend(FIXTURES, base);
    expect(picks.length).toBeLessThanOrEqual(3);
    expect(new Set(picks.map((p) => p.candidate.familyId)).size).toBe(picks.length);
  });

  it("skips variants of the same family", () => {
    const variants = [
      makeCandidate({ id: "a1", familyId: "a", cpu: { model: "X", multiScore: 20000 } }),
      makeCandidate({ id: "a2", familyId: "a", cpu: { model: "Y", multiScore: 19000 } }),
      makeCandidate({ id: "b1", familyId: "b" }),
    ];
    const { picks } = recommend(variants, base);
    expect(picks.map((p) => p.candidate.id)).toEqual(["a1", "b1"]);
  });

  it("returns nothing when the budget is too low", () => {
    const { picks, poolSize } = recommend(FIXTURES, { ...base, budgetTry: 10000 });
    expect(picks).toEqual([]);
    expect(poolSize).toBe(0);
  });

  it("offers a stretch pick above budget only when it is clearly better", () => {
    const { picks } = recommend(FIXTURES, { ...base, budgetTry: 43000, profiles: ["gaming"], gaming: "heavy" });
    const stretch = picks.find((p) => p.slot === "stretch");
    expect(stretch?.candidate.id).toBe("big-gamer");
    expect(stretch?.reasons.some((r) => r.key === "budget")).toBe(true);
  });

  it("never picks from above budget for the main slot", () => {
    const { picks } = recommend(FIXTURES, { ...base, budgetTry: 41000 });
    expect(picks[0]!.candidate.priceTry).toBeLessThanOrEqual(41000 * 1.05);
  });

  it("every pick explains itself", () => {
    const { picks } = recommend(FIXTURES, { ...base, profiles: ["developer"] });
    for (const p of picks) expect(p.reasons.length).toBeGreaterThan(0);
  });

  it("ranking ignores store data by construction", () => {
    // Candidate has no store field; this guards against someone adding one to the scorer's input.
    const keys = Object.keys(FIXTURES[0]!);
    expect(keys.some((k) => /store|affiliate|commission/i.test(k))).toBe(false);
  });
});
