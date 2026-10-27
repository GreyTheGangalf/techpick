import type { Candidate } from "./types.ts";
import type { SubScores } from "./scores.ts";
import type { Weights } from "./weights.ts";

export type Explanation = { strengths: string[]; weaknesses: string[] };
type Key = keyof SubScores;

const STRENGTH_TEXT: Record<Key, string> = {
 cpu: "The processor is faster than most other options in this price range.",
gpu: "The graphics card is powerful enough for gaming and graphics-intensive tasks.",
memory: "Plenty of RAM; you can easily keep many tabs and applications open at the same time.",
screen: "The screen is good.",
portability: "It’s lightweight with long battery life, making it easy to carry around.",
value: "Offers high performance for the price you pay.",
};

const WEAKNESS_TEXT: Record<Key, string> = {
  cpu: "Its processor is slower compared to other options.",
  gpu: "The graphics card is weak compared to other options; it will struggle with demanding games.",
  memory: "It has less memory than other options.",
  screen: "Its screen lags behind other options.",
  portability: "It is heavier or has shorter battery life compared to other options.",
  value: "Its performance relative to its price falls short compared to other options.",
};

// No panel data yet: screen is 100 for everyone, so it can't be a real reason.
const SKIP: Key[] = ["screen"];

export function explain(c: Candidate, sub: SubScores, w: Weights): Explanation {
  // Fields the user cares about (weight > 0) and that we have real data for.
  const keys = (Object.keys(w) as Key[]).filter((k) => w[k] > 0 && !SKIP.includes(k));

  // TODO(human) 1: sort a copy of keys by contribution (sub[k] * w[k]), highest first
  const byContribution = [...keys].sort((a,b) => sub[b] * w[b] -  sub[a] * w[a]);
  const strengths = byContribution.slice(0, 2).map((k) => STRENGTH_TEXT[k]);

  // TODO(human) 2: the key with the lowest sub score
  const weakest = [...keys].sort((a,b) => sub[a] - sub[b])[0];
  const weaknesses = [WEAKNESS_TEXT[weakest]];

  if (c.os === "none") {
    weaknesses.push("No operating system is installed (FreeDOS); you will need to purchase a Windows license separately.");
  }
  return { strengths, weaknesses };
}