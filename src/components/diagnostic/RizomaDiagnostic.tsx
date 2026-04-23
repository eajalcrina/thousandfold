"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import Hero from "./rizoma/Hero";
import Wizard from "./rizoma/Wizard";
import Results from "./rizoma/Results";
import type { UserData } from "./rizoma/EmailGate";
import { computeResults, type RizomaResult } from "@/lib/rizoma-scoring";

type State = "hero" | "wizard" | "results";

export default function RizomaDiagnostic() {
  const [state, setState] = useState<State>("hero");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scaleValues, setScaleValues] = useState<Record<string, number>>({});
  const [result, setResult] = useState<RizomaResult | null>(null);

  const setAnswer = (id: string, index: number) =>
    setAnswers((a) => ({ ...a, [id]: index }));
  const setScaleValue = (id: string, val: number) =>
    setScaleValues((s) => ({ ...s, [id]: val }));

  const handleComplete = () => {
    const r = computeResults(answers, scaleValues);
    setResult(r);
    setState("results");
  };

  const handleSubmitUser = async (user: UserData): Promise<void> => {
    if (!result) return;
    const res = await fetch("/api/diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, scaleValues, result, user }),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setScaleValues({});
    setResult(null);
    setState("hero");
  };

  return (
    <div className="min-h-screen bg-void">
      <Link
        href="/"
        aria-label="Volver al inicio"
        className="fixed top-5 left-5 md:top-6 md:left-8 z-50 flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-cream/60 hover:text-cream transition-colors"
      >
        <span aria-hidden="true">←</span>
        <span className="hidden sm:inline">Volver al inicio</span>
      </Link>

      <AnimatePresence mode="wait">
        {state === "hero" && <Hero key="hero" onStart={() => setState("wizard")} />}
        {state === "wizard" && (
          <Wizard
            key="wizard"
            answers={answers}
            scaleValues={scaleValues}
            setAnswer={setAnswer}
            setScaleValue={setScaleValue}
            onComplete={handleComplete}
          />
        )}
        {state === "results" && result && (
          <Results
            key="results"
            result={result}
            onSubmitUser={handleSubmitUser}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
