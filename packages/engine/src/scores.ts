import type { Candidate } from "./types.ts";
import { normalize } from "./normalize.ts";
import { gpuScore } from "./gpu.ts";

export type SubScores = {
  cpu: number;
  gpu: number;
  memory: number;
  screen: number;
  portability: number;
  value: number;
};

export function subScores(candidates: Candidate[]): SubScores[] {
  const gpu = normalize(candidates.map(gpuScore));
  const memory = normalize(candidates.map((c) => c.ramGb));
  //No panel data, everyone is 100
  const screen = candidates.map(() => 100);

  const cpuSingle = normalize(candidates.map((c) => c.cpu.cb2024Single));
  const cpuMulti = normalize(candidates.map((c) => c.cpu.cb2024Multi));
  const cpu = cpuSingle.map((s, i) => (s + cpuMulti[i]) / 2);

  const weight = normalize(candidates.map((c) => c.weightG), true);
  const battery = normalize(candidates.map((c) => c.batteryWh));
  const portability = weight.map((w, i) => (w + battery[i]) / 2);

  const value = normalize(candidates.map((c, i) => ((cpu[i] + gpu[i]) / 2) / c.priceKurus));

  return candidates.map((_, i) => ({
    cpu: cpu[i], gpu: gpu[i], memory: memory[i],
    screen: screen[i], portability: portability[i], value: value[i],
  }));
}