"use client";

import { useState } from "react";
import type { Answers } from "@techpick/engine";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const INITIAL: Answers = {
    budgetKurus: 3_000_000,
    profiles: [],
    portability: "sometimes",
    screenSizes: [],
    os: [],
};

export function Wizard() {
    const [answers, setAnswers] = useState<Answers>(INITIAL);
    const budgetTl = answers.budgetKurus / 100;

    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-semibold">
                Bütçeniz ne kadar?</h1>
            <p className="text-lg">{budgetTl.toLocaleString("tr-TR")} TL</p>
            <Slider
                min={15_000}
                max={150_000}
                step={1_000}
                value={[budgetTl]}
                onValueChange={(v) => {
                    const [tl] = v as number[];
                    setAnswers({...answers, budgetKurus: tl *100});
                }}
            />
            <Button>İlerle</Button>
        </section>
    );
}