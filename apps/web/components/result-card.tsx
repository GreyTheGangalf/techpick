import type { Card as EngineCard } from "@techpick/engine";
import type { CardDetails } from "@/lib/candidates";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { label: string; card: EngineCard; details: CardDetails };

function formatTl(kurus: number): string {
    return `${Math.round(kurus / 100).toLocaleString("tr-TR")} TL`;
}

function formatDay(date: Date): string {
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "long", timeZone: "Europe/Istanbul" });
}

export function ResultCard({ label, card, details }: Props) {
    const c = card.ranked.candidate;
    const { strengths, weaknesses } = card.explanation;

    return (
        <Card>
            <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle>{details.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    {c.cpu.model} · {c.gpu.model} · {c.ramGb} GB RAM
                </p>
                <p className="text-2xl font-semibold">{formatTl(details.priceKurus)}</p>
                <p className="text-xs text-muted-foreground">
                    Fiyat {formatDay(details.checkedAt)} tarihinde kontrol edildi
                </p>
                <ul className="space-y-1 text-sm">
                    {strengths.map((s) => (
                        <li key={s}>✓ {s}</li>
                    ))}

                </ul>
                <ul className="space-y-1 text-sm text-muted-foreground">
                    {weaknesses.map((w) => (
                        <li key={w}>- {w}</li>
                    ))}

                </ul>
            </CardContent>
            <CardFooter>
                <a href={details.url} target="_blank" rel="noopener noreferrer nofollow" className="text-sm font-medium underline">
                    {details.storeName} sayfasında gör
                </a>
            </CardFooter>
        </Card>
    );
}