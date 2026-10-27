import type { Answers, Candidate } from "./types.ts";
import type { Ranked } from "./rank.ts";
import type { Explanation } from "./explain.ts";
import { rankCandidates } from "./rank.ts";
import { pickThree } from "./picks.ts";
import { combineWeights } from "./weights.ts";
import { explain } from "./explain.ts";

export type Card = { ranked: Ranked; explanation: Explanation };
export type Recommendation = { bestMatch: Card | null; bestValue: Card | null; stepUp: Card | null };

export function recommend(answers: Answers, candidates: Candidate[]): Recommendation {
    const picks = pickThree(rankCandidates(answers, candidates));
    const weights = combineWeights(answers.profiles);

    const toCard = (r: Ranked | null): Card | null => {
        if (r === null){
            return null;
        }
        return {ranked: r, explanation: explain(r.candidate, r.sub, weights)};
    };

    return {
        bestMatch: toCard(picks.bestMatch),
        bestValue: toCard(picks.bestValue),
        stepUp: toCard(picks.stepUp),
    };
}