import { recommend } from "@techpick/engine";
import { loadCandidates } from "@/lib/candidates";
import { answersFromSearch } from "@/lib/answers-url";

export const dynamic = "force-dynamic";

export default async function ResultPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const answers = answersFromSearch(await searchParams);
    const result = recommend(answers, await loadCandidates());

    const ids = {
        bestMatch: result.bestMatch?.ranked.candidate.configurationId ?? null,
        bestValue: result.bestValue?.ranked.candidate.configurationId ?? null,
        stepUp: result.stepUp?.ranked.candidate.configurationId ?? null,
    };
    return <pre className="p-8">{JSON.stringify({ answers, ids }, null, 2)}</pre>;
}