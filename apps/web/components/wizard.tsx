"use client";

import { useState } from "react";
import type { Answers, Profile } from "@techpick/engine";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { profile } from "console";
import next from "next";

const INITIAL: Answers = {
    budgetKurus: 3_000_000,
    profiles: [],
    portability: "sometimes",
    screenSizes: [],
    os: [],
};

const PROFILE_OPTIONS: { value: Profile; label: string }[] = [
    { value: "student", label: "Okul ve ofis işleri" },
    { value: "software", label: "Yazılım geliştirme" },
    { value: "gaming", label: "Oyun" },
    { value: "creative", label: "Tasarım ve video" },
];

const LAST_STEP = 1;

export function Wizard() {
    const [answers, setAnswers] = useState<Answers>(INITIAL);
    const [step, setStep] = useState(0);
    const budgetTl = answers.budgetKurus / 100;

    const toggleProfile = (p: Profile) => {
        const next = answers.profiles.includes(p) ? answers.profiles.filter((x) => x !== p) : [...answers.profiles, p];
        setAnswers({...answers, profiles: next});
    };

    return (
        <section className="space-y-6">
            {step === 0 && (
                <>
                    <h1 className="text-2xl font-semibold">Bütçen ne kadar?</h1>
                    <p className="text-lg">{budgetTl.toLocaleString("tr-TR")} TL</p>
                    <Slider
                        min={15_000}
                        max={150_000}
                        step={1_000}
                        value={[budgetTl]}
                        onValueChange={(v) => {
                            const [tl] = v as number[];
                            setAnswers({ ...answers, budgetKurus: tl * 100 });
                        }}
                    />
                </>
            )}

            {step === 1 && (
                <>
                    <h1 className="text-2xl font-semibold">Bilgisayarı ne için kullanacaksın?</h1>
                    <p className="text-muted-foreground">Birden fazla seçebilirsin.</p>
                    {PROFILE_OPTIONS.map((o) => (
                        <label key={o.value} className="flex items-center gap-3">
                            <Checkbox
                                checked={answers.profiles.includes(o.value)}
                                onCheckedChange={() => toggleProfile(o.value)}
                            />
                            {o.label}
                        </label>
                    ))}
                </>
            )}

            <div className="flex gap-3">
                <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
                    Geri
                </Button>
                <Button disabled={step === LAST_STEP} onClick={() => setStep(step + 1)}>
                    İleri
                </Button>
            </div>
        </section>
    );
}