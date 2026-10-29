import { recommend } from "@techpick/engine";
import { loadCandidates, loadCardDetails } from "@/lib/candidates";
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
    const details = await loadCardDetails(
        [ids.bestMatch, ids.bestValue, ids.stepUp].filter((id) => id !== null),
    );
    return <pre className="p-8">{JSON.stringify({ answers, ids, details: Object.fromEntries(details)}, null, 2)}</pre>;
}