import type { Candidate } from "./types.ts";

export const TGP_EXPONENT = 0.5;

export function gpuScore(c: Pick<Candidate, "gpu" | "gpuTgpW">): number {
    const ref = c.gpu.timespyRefTgpW;

    if (ref === null || c.gpuTgpW === null) {
    return c.gpu.timespyGraphics;
    }
    
    const ratio = Math.min(c.gpuTgpW / ref, 1);

    return c.gpu.timespyGraphics * ratio ** TGP_EXPONENT;
}
