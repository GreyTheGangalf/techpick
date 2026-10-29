import { loadCandidates } from "@/lib/candidates";

export const dynamic = "force-dynamic";

export default async function ResultPage() {
    const candidates = await loadCandidates();
    return <pre className="p-8">{JSON.stringify(candidates, null, 2)}</pre>;
}