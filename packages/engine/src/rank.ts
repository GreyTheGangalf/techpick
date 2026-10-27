import type { Answers, Candidate } from "./types.ts";
import type { SubScores } from "./scores.ts";
import { filterCandidates } from "./filter.ts";
import { subScores } from "./scores.ts";
import { combineWeights, weightedScore } from "./weights.ts";
import { penalty } from "./penalties.ts";

export type Ranked = { candidate: Candidate; sub: SubScores; score: number };

export function rankCandidates(answers: Answers, candidates: Candidate[]): Ranked[] {
    const eligible = filterCandidates(answers, candidates);
    const subs = subScores(eligible); // normalized within the eligible set only
    const weights = combineWeights(answers.profiles);

    const ranked = eligible.map((c, i) => ({
        candidate: c,
        sub: subs[i],
        score: weightedScore(subs[i], weights) - penalty(c, answers),
    }));

    ranked.sort((a, b) => b.score - a.score);

    const seen = new Set<number>();

    return ranked.filter((r) => {
        const family = r.candidate.familyId;
        if (seen.has(family)) {
            return false;        // this family already has a better candidate above
        }
        seen.add(family);
        return true;
    });
}