import type { Profile } from "./types.ts";
import type { SubScores } from "./scores.ts";


export type Weights = Record<keyof SubScores, number>;

export const PROFILE_WEIGHTS: Record<Profile,Weights> = {
    student:  { cpu: 15, gpu: 5,  memory: 15, screen: 15, portability: 30, value: 20 },
    software: { cpu: 30, gpu: 5,  memory: 25, screen: 15, portability: 15, value: 10 },
    gaming:   { cpu: 15, gpu: 45, memory: 10, screen: 15, portability: 0,  value: 15 },
    creative: { cpu: 25, gpu: 25, memory: 15, screen: 25, portability: 0,  value: 10 },
};

export function combineWeights(profiles: Profile[]): Weights {
    if(profiles.length === 0){
        return PROFILE_WEIGHTS.student;
    }

    const rows = profiles.map((p) => PROFILE_WEIGHTS[p]);

    const avg = (key: keyof Weights): number => {
        let sum = 0;

        for(const row of rows){
            sum += row[key]
        }
        return sum / rows.length
    };

    return {
            cpu: avg("cpu"),
            gpu: avg("gpu"),
            memory: avg("memory"),
            screen: avg("screen"),
            portability: avg("portability"),
            value: avg("value"),
    };
}

export function weightedScore(sub: SubScores, w: Weights): number {
    let sum = 0;

    for (const key of Object.keys(w) as (keyof Weights)[]) { 
        sum += sub[key] * w[key]
    }

    return sum / 100
}