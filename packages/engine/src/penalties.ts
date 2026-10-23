import type { Answers, Candidate } from "./types.ts";

export const BUDGET_PENALTY_MAX = 10;  
export const HEAVY_LIMIT_G = 2200;
export const HEAVY_PENALTY = 10;

export function penalty(c: Candidate, answers: Answers): number {
    const budget = answers.budgetKurus;
    let fine = 0;

    if(c.priceKurus - budget > 0){
        fine = (c.priceKurus - budget) / (budget * 0.05) * BUDGET_PENALTY_MAX;
    }
    if(answers.portability === 'daily' && c.weightG > HEAVY_LIMIT_G){
        fine += HEAVY_PENALTY
    }
    return fine;
}