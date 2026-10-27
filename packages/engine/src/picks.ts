import type { Ranked } from "./rank.ts";

export type Picks = { bestMatch: Ranked | null; bestValue: Ranked | null; stepUp: Ranked | null };

export function pickThree(ranked: Ranked[]): Picks {
    if (ranked.length === 0) {
        return { bestMatch: null, bestValue: null, stepUp: null };
    }
    const bestMatch = ranked[0];
    const rest = ranked.slice(1);

    let bestValue: Ranked | null = null;
    for (const r of rest) {
        if (bestValue === null || r.sub.value > bestValue.sub.value) {
            bestValue = r;
        }
    }
    
    const stepUp = rest.find((r) => r !== bestValue && r.candidate.priceKurus > bestMatch.candidate.priceKurus) ?? null;

    return { bestMatch, bestValue, stepUp };
}