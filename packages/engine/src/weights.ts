import type { Criteria, Profile, SubScoreKey, Weights } from "./types";

/**
 * Starting weights per profile, in percent. Each row sums to 100.
 * These are the published "how we score" numbers, so keep them in sync with the site copy.
 */
export const PROFILE_WEIGHTS: Record<Profile, Weights> = {
  student: { cpu: 15, gpu: 5, memory: 15, display: 15, portability: 30, value: 20 },
  developer: { cpu: 30, gpu: 5, memory: 25, display: 15, portability: 15, value: 10 },
  gaming: { cpu: 15, gpu: 45, memory: 10, display: 15, portability: 0, value: 15 },
  creator: { cpu: 25, gpu: 25, memory: 15, display: 25, portability: 0, value: 10 },
};

const KEYS: SubScoreKey[] = ["cpu", "gpu", "memory", "display", "portability", "value"];

const PORTABILITY_FACTOR = { daily: 1.5, sometimes: 1, rarely: 0.5 } as const;

/** Blends the selected profiles into one weight set that sums to 100. */
export function resolveWeights(criteria: Criteria): Weights {
  const parts: { weights: Weights; factor: number }[] = criteria.profiles.map((p) => ({
    weights: PROFILE_WEIGHTS[p],
    factor: 1,
  }));

  // Gaming answered outside the profile question still has to count.
  if (!criteria.profiles.includes("gaming") && criteria.gaming !== "none") {
    parts.push({ weights: PROFILE_WEIGHTS.gaming, factor: criteria.gaming === "heavy" ? 1 : 0.5 });
  }
  if (parts.length === 0) parts.push({ weights: PROFILE_WEIGHTS.student, factor: 1 });

  const totalFactor = parts.reduce((sum, p) => sum + p.factor, 0);
  const blended = Object.fromEntries(
    KEYS.map((k) => [k, parts.reduce((sum, p) => sum + p.weights[k] * p.factor, 0) / totalFactor]),
  ) as Weights;

  blended.portability *= PORTABILITY_FACTOR[criteria.portability];

  const total = KEYS.reduce((sum, k) => sum + blended[k], 0);
  return Object.fromEntries(KEYS.map((k) => [k, (blended[k] / total) * 100])) as Weights;
}
