import Link from "next/link";
import { recommend, type Card } from "@techpick/engine";
import { loadCandidates, loadCardDetails } from "@/lib/candidates";
import { answersFromSearch } from "@/lib/answers-url";
import { ResultCard } from "@/components/result-card";

export const dynamic = "force-dynamic";

export default async function ResultPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const answers = answersFromSearch(await searchParams);
    const result = recommend(answers, await loadCandidates());

    // Keep only the slots the engine could fill, in display order.
    const slots: { label: string; card: Card }[] = [];
    if (result.bestMatch) slots.push({ label: "En iyi eşleşme", card: result.bestMatch });
    if (result.bestValue) slots.push({ label: "En iyi fiyat/performans", card: result.bestValue });
    if (result.stepUp) slots.push({ label: "Biraz daha öde, daha iyisini al", card: result.stepUp });

    const details = await loadCardDetails(slots.map((s) => s.card.ranked.candidate.configurationId));

    return (
        <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-12">
            <h1 className="text-2xl font-semibold">Sana uygun laptoplar</h1>

            {slots.length === 0 ? (
                <p>Bu bütçeye uygun laptop bulamadık. Bütçeyi biraz artırmayı ya da ekran/işletim sistemi seçimini genişletmeyi deneyebilirsin.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-3">
                    {slots.map((s) => {
                        const d = details.get(s.card.ranked.candidate.configurationId);
                        if (d === undefined) return null;
                        return <ResultCard key={s.label} label={s.label} card={s.card} details={d} />;
                    })}
                </div>
            )}

            <Link href="/sihirbaz" className="text-sm underline">
                Cevapları değiştir
            </Link>
        </main>
    );
}