import type { Candidate, Criteria, PanelType, ScoredCandidate, SubScoreKey, SubScores, Weights } from "./types";

const PANEL_QUALITY: Record<PanelType, number> = {
  oled: 100,
  "mini-led": 90,
  ips: 60,
  va: 40,
  tn: 10,
};

/** Laptops above this weight get penalised when the user carries one daily. */
export const HEAVY_KG = 2.2;

/** Min-max normalise to 0-100 within the pool. A pool where everyone ties scores 100. */
export function normalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) return values.map(() => 100);
  return values.map((v) => ((v - min) / (max - min)) * 100);
}

function displayRaw(c: Candidate): number {
  const d = c.display;
  const pixels = Math.min((d.width * d.height) / (2560 * 1600), 1) * 100;
  const refresh = (Math.min(d.refreshHz, 240) / 240) * 100;
  const color = d.srgbPct ?? 50;
  return 0.35 * pixels + 0.3 * refresh + 0.2 * PANEL_QUALITY[d.panel] + 0.15 * Math.min(color, 100);
}

/** RAM has diminishing returns, so it is scored on an absolute curve rather than relative to the pool. */
const RAM_CURVE: [gb: number, score: number][] = [
  [4, 0],
  [8, 35],
  [16, 80],
  [24, 90],
  [32, 100],
];

function interpolate(curve: [number, number][], x: number): number {
  const first = curve[0]!;
  const last = curve[curve.length - 1]!;
  if (x <= first[0]) return first[1];
  if (x >= last[0]) return last[1];
  const i = curve.findIndex(([px]) => px >= x);
  const [x0, y0] = curve[i - 1]!;
  const [x1, y1] = curve[i]!;
  return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
}

export function memoryScore(c: Candidate): number {
  const storage = c.storageGb < 512 ? -10 : c.storageGb >= 1024 ? 5 : 0;
  const upgrade = c.ramUpgradeable ? 5 : 0;
  return Math.max(0, Math.min(100, interpolate(RAM_CURVE, c.ramGb) + upgrade + storage));
}

const PERF_KEYS: Exclude<SubScoreKey, "value">[] = ["cpu", "gpu", "memory", "display", "portability"];

/**
 * Most sub-scores are relative to the pool, so "100" means "best among these candidates".
 * Memory is the exception: it is absolute (see `memoryScore`).
 */
export function computeSubScores(pool: Candidate[], weights: Weights): SubScores[] {
  if (pool.length === 0) return [];

  const cpu = normalize(pool.map((c) => c.cpu.multiScore));
  const gpu = normalize(pool.map((c) => c.gpu.score));
  const memory = pool.map(memoryScore);
  const display = normalize(pool.map(displayRaw));
  const lightness = normalize(pool.map((c) => -c.weightKg));
  const battery = normalize(pool.map((c) => c.batteryWh));
  const portability = lightness.map((l, i) => 0.6 * l + 0.4 * battery[i]!);

  const perfWeight = PERF_KEYS.reduce((sum, k) => sum + weights[k], 0) || 1;
  const partial = pool.map((_, i) => ({
    cpu: cpu[i]!,
    gpu: gpu[i]!,
    memory: memory[i]!,
    display: display[i]!,
    portability: portability[i]!,
  }));
  const perf = partial.map((s) => PERF_KEYS.reduce((sum, k) => sum + weights[k] * s[k], 0) / perfWeight);
  const value = normalize(perf.map((p, i) => p / pool[i]!.priceTry));

  return partial.map((s, i) => ({ ...s, value: value[i]! }));
}

export function computePenalty(c: Candidate, criteria: Criteria): number {
  let penalty = 0;
  if (c.priceTry > criteria.budgetTry) {
    // 5% over budget costs 10 points.
    penalty += ((c.priceTry - criteria.budgetTry) / criteria.budgetTry) * 200;
  }
  if (criteria.portability === "daily" && c.weightKg > HEAVY_KG) {
    penalty += (c.weightKg - HEAVY_KG) * 25;
  }
  return penalty;
}

export function scorePool(pool: Candidate[], weights: Weights, criteria: Criteria): ScoredCandidate[] {
  const subs = computeSubScores(pool, weights);
  return pool.map((candidate, i) => {
    const subScores = subs[i]!;
    const weighted = (Object.keys(weights) as SubScoreKey[]).reduce(
      (sum, k) => sum + (weights[k] * subScores[k]) / 100,
      0,
    );
    const penalty = computePenalty(candidate, criteria);
    return { candidate, subScores, penalty, score: weighted - penalty };
  });
}
