import type { Candidate, Panel } from "./types.ts";
import { normalize } from "./normalize.ts";
import { gpuScore } from "./gpu.ts";

// Raw panel quality before normalization (decision 22 Nov).
const PANEL_SCORE: Record<Panel, number> = { oled: 100, ips: 75, va: 50, tn: 20 };
// Unknown panel: most laptops without a listed panel are IPS; don't punish or reward missing data.
const UNKNOWN_PANEL_SCORE = PANEL_SCORE.ips;

export type SubScores = {
  cpu: number;
  gpu: number;
  memory: number;
  screen: number;
  portability: number;
  value: number;
};

export function subScores(candidates: Candidate[]): SubScores[] {
  // Unknown GPUs are left out of normalization so they don't shift the scale for the others,
  // then get 0. rank.ts decides whether that 0 counts (decision 22 Nov).
  const gpuRaw = candidates.map(gpuScore);
  const knownGpu = normalize(gpuRaw.filter((g): g is number => g !== null));
  let k = 0;
  const gpu = gpuRaw.map((g) => (g === null ? 0 : knownGpu[k++]));
  const memory = normalize(candidates.map((c) => c.ramGb));
  const screen = normalize(
  candidates.map((c) => (c.panel === null ? UNKNOWN_PANEL_SCORE : PANEL_SCORE[c.panel])),
  );

  const cpuSingle = normalize(candidates.map((c) => c.cpu.cb2024Single));
  const cpuMulti = normalize(candidates.map((c) => c.cpu.cb2024Multi));
  const cpu = cpuSingle.map((s, i) => (s + cpuMulti[i]) / 2);

  const weight = normalize(candidates.map((c) => c.weightG), true);
  const battery = normalize(candidates.map((c) => c.batteryWh));
  const portability = weight.map((w, i) => (w + battery[i]) / 2);

    // Unknown GPU: performance = CPU only, so a missing score doesn't halve value.
  const value = normalize(
    candidates.map((c, i) => (gpuRaw[i] === null ? cpu[i] : (cpu[i] + gpu[i]) / 2) / c.priceKurus),
  );

  return candidates.map((_, i) => ({
    cpu: cpu[i], gpu: gpu[i], memory: memory[i],
    screen: screen[i], portability: portability[i], value: value[i],
  }));
}