import { explain } from "./explain";
import { BUDGET_TOLERANCE, filterCandidates } from "./filters";
import { scorePool } from "./scoring";
import type { Candidate, Criteria, Pick, PickSlot, RecommendationResult, ScoredCandidate } from "./types";
import { resolveWeights } from "./weights";

/** "Best value" must stay within this share of the best match's score. */
const VALUE_MIN_RATIO = 0.8;
/** "Pay a bit more" must beat the best match by this many points before its budget penalty. */
const STRETCH_MIN_GAIN = 5;

export function recommend(candidates: Candidate[], criteria: Criteria, limit = 3): RecommendationResult {
  const weights = resolveWeights(criteria);
  const pool = filterCandidates(candidates, criteria);
  const scored = scorePool(pool, weights, criteria).sort((a, b) => b.score - a.score);

  const withinBudget = scored.filter((s) => s.candidate.priceTry <= criteria.budgetTry * BUDGET_TOLERANCE);
  const best = withinBudget[0];
  if (!best) return { picks: [], weights, poolSize: pool.length };

  const chosen: { scored: ScoredCandidate; slot: PickSlot }[] = [{ scored: best, slot: "best-match" }];
  const usedFamilies = new Set([best.candidate.familyId]);
  const isNew = (s: ScoredCandidate) => !usedFamilies.has(s.candidate.familyId);
  const take = (s: ScoredCandidate | undefined, slot: PickSlot) => {
    if (!s || chosen.length >= limit) return;
    chosen.push({ scored: s, slot });
    usedFamilies.add(s.candidate.familyId);
  };

  const bestValue = withinBudget
    .filter((s) => isNew(s) && s.score >= best.score * VALUE_MIN_RATIO)
    .sort((a, b) => b.subScores.value - a.subScores.value)[0];
  take(bestValue, "best-value");

  const stretch = scored
    .filter(
      (s) =>
        isNew(s) &&
        s.candidate.priceTry > criteria.budgetTry &&
        s.score + s.penalty >= best.score + STRETCH_MIN_GAIN,
    )
    .sort((a, b) => b.score + b.penalty - (a.score + a.penalty))[0];
  take(stretch, "stretch");

  for (const s of withinBudget) {
    if (chosen.length >= limit) break;
    if (isNew(s)) take(s, "alternative");
  }

  const picks: Pick[] = chosen.map(({ scored: s, slot }) => ({
    ...s,
    slot,
    reasons: explain(s, weights, criteria),
  }));

  return { picks, weights, poolSize: pool.length };
}
