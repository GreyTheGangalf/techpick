import type { Candidate } from "./types";

/** Synthetic laptops for tests. Numbers are plausible but not real products. */
export function makeCandidate(overrides: Partial<Candidate> & Pick<Candidate, "id">): Candidate {
  const { id, ...rest } = overrides;
  return {
    id,
    familyId: id,
    brand: "Generic",
    name: `Test ${id}`,
    priceTry: 30000,
    os: "windows",
    cpu: { model: "Mid CPU", multiScore: 12000 },
    gpu: { model: "iGPU", score: 2500, integrated: true },
    ramGb: 16,
    ramUpgradeable: true,
    storageGb: 512,
    display: { inches: 15.6, width: 1920, height: 1080, refreshHz: 60, panel: "ips", srgbPct: 60 },
    weightKg: 1.8,
    batteryWh: 55,
    ...rest,
  };
}

export const FIXTURES: Candidate[] = [
  makeCandidate({
    id: "gamer",
    priceTry: 42000,
    cpu: { model: "Fast CPU H", multiScore: 18000 },
    gpu: { model: "RTX 4060", score: 10500, integrated: false },
    display: { inches: 15.6, width: 1920, height: 1080, refreshHz: 144, panel: "ips", srgbPct: 100 },
    weightKg: 2.4,
    batteryWh: 60,
  }),
  makeCandidate({
    id: "ultrabook",
    priceTry: 38000,
    cpu: { model: "Efficient CPU U", multiScore: 11000 },
    display: { inches: 14, width: 2880, height: 1800, refreshHz: 90, panel: "oled", srgbPct: 100 },
    weightKg: 1.2,
    batteryWh: 75,
    ramUpgradeable: false,
  }),
  makeCandidate({
    id: "budget",
    priceTry: 22000,
    cpu: { model: "Entry CPU", multiScore: 8000 },
    ramGb: 8,
    storageGb: 256,
    weightKg: 1.7,
    batteryWh: 42,
  }),
  makeCandidate({
    id: "dev",
    priceTry: 40000,
    cpu: { model: "Fast CPU H", multiScore: 19000 },
    gpu: { model: "iGPU Plus", score: 3500, integrated: true },
    ramGb: 32,
    display: { inches: 16, width: 2560, height: 1600, refreshHz: 120, panel: "ips", srgbPct: 100 },
    weightKg: 1.9,
    batteryWh: 70,
  }),
  makeCandidate({
    id: "mac",
    brand: "Apple",
    priceTry: 45000,
    os: "macos",
    cpu: { model: "Apple M-series", multiScore: 15000 },
    gpu: { model: "Apple GPU", score: 5000, integrated: true },
    ramUpgradeable: false,
    display: { inches: 13.6, width: 2560, height: 1664, refreshHz: 60, panel: "ips", srgbPct: 100 },
    weightKg: 1.24,
    batteryWh: 52.6,
  }),
  makeCandidate({
    id: "big-gamer",
    priceTry: 47000,
    cpu: { model: "Fast CPU HX", multiScore: 24000 },
    gpu: { model: "RTX 4070", score: 12500, integrated: false },
    display: { inches: 16, width: 2560, height: 1600, refreshHz: 240, panel: "ips", srgbPct: 100 },
    weightKg: 2.6,
    batteryWh: 80,
  }),
];
