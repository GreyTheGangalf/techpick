"use client";

import { useState } from "react";
import type { Answers, Profile, ScreenSize } from "@techpick/engine";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { profile } from "console";
import next from "next";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Portability = Answers["portability"];  // "rarely" | "sometimes" | "daily"
type Os = Answers["os"][number];            // "windows" | "macos" | "linux"

const PORTABILITY_OPTIONS: { value: Portability; label: string }[] = [
    { value: "rarely", label: "Nadiren, genelde masada duracak" },
    { value: "sometimes", label: "Ara sıra" },
    { value: "daily", label: "Her gün çantamda olacak" },
];

const SCREEN_OPTIONS: { value: ScreenSize; label: string }[] = [
    { value: "small", label: "Küçük (15 inçten küçük)" },
    { value: "medium", label: "Orta (15-16,9 inç)" },
    { value: "large", label: "Büyük (17 inç ve üstü)" },
];

const OS_OPTIONS: { value: Os; label: string }[] = [
    { value: "windows", label: "Windows" },
    { value: "macos", label: "macOS" },
    { value: "linux", label: "Linux" },
];

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

const LAST_STEP = 4;

export function Wizard() {
    const [answers, setAnswers] = useState<Answers>(INITIAL);
    const [step, setStep] = useState(0);
    const budgetTl = answers.budgetKurus / 100;

    const toggleProfile = (p: Profile) => {
        const next = answers.profiles.includes(p) ? answers.profiles.filter((x) => x !== p) : [...answers.profiles, p];
        setAnswers({ ...answers, profiles: next });
    };
    const toggleScreen = (s: ScreenSize) => {
        const next = answers.screenSizes.includes(s) ? answers.screenSizes.filter((x) => x !== s) : [...answers.screenSizes, s];
        setAnswers({ ...answers, screenSizes: next });
    };

    const toggleOS = (o: Os) => {
        const next = answers.os.includes(o) ? answers.os.filter((x) => x !== o) : [...answers.os, o];
        setAnswers({ ...answers, os: next });
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

            {step === 2 && (
                <>
                    <h1 className="text-2xl font-semibold">Bilgisayarı ne sıklıkla taşıyacaksın?</h1>
                    <RadioGroup
                        value={answers.portability}
                        onValueChange={(v) => setAnswers({ ...answers, portability: v as Portability })}
                    >
                        {PORTABILITY_OPTIONS.map((o) => (
                            <label key={o.value} className="flex items-center gap-3">
                                <RadioGroupItem value={o.value} />
                                {o.label}
                            </label>
                        ))}
                    </RadioGroup>
                </>
            )}

            {step === 3 && (
                <>
                    <h1 className="text-2xl font-semibold">Hangi ekran boyutlarını istersin?</h1>
                    <p className="text-muted-foreground">Hiçbirini seçmezsen hepsine bakarız.</p>
                    {SCREEN_OPTIONS.map((o) => (
                        <label key={o.value} className="flex items-center gap-3">
                            <Checkbox
                                checked={answers.screenSizes.includes(o.value)}
                                onCheckedChange={() => toggleScreen(o.value)}
                            />
                            {o.label}
                        </label>
                    ))}
                </>
            )}

            {step === 4 && (
                <>
                    <h1 className="text-2xl font-semibold">Hangi işletim sistemini istersin?</h1>
                    {OS_OPTIONS.map((o) => (
                        <label key={o.value} className="flex items-center gap-3">
                            <Checkbox
                                checked={answers.os.includes(o.value)}
                                onCheckedChange={() => toggleOS(o.value)}
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
};