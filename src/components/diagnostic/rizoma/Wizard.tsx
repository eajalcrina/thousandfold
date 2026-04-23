"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { QUESTIONS, type Section } from "@/lib/rizoma-data";
import ProgressBar from "./ProgressBar";
import QuestionSingleView from "./QuestionSingle";
import QuestionScaleView from "./QuestionScale";

interface Props {
  answers: Record<string, number>;
  scaleValues: Record<string, number>;
  setAnswer: (id: string, index: number) => void;
  setScaleValue: (id: string, val: number) => void;
  onComplete: () => void;
}

export default function Wizard({ answers, scaleValues, setAnswer, setScaleValue, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const total = QUESTIONS.length;
  const question = QUESTIONS[step];

  const completedSections = useMemo(() => {
    const done = new Set<Section>();
    for (let i = 0; i < step; i++) {
      const q = QUESTIONS[i];
      if (q.section !== question.section) done.add(q.section);
    }
    return done;
  }, [step, question.section]);

  const isAnswered = question.type === "single"
    ? answers[question.id] !== undefined
    : scaleValues[question.id] !== undefined;

  const handleNext = () => {
    if (!isAnswered) return;
    if (step < total - 1) setStep(step + 1);
    else onComplete();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="mx-auto max-w-[680px] px-6 py-16"
    >
      <ProgressBar currentSection={question.section} completedSections={completedSections} />

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mb-2 font-mono text-[11px] tracking-[0.14em] uppercase text-signal">
            {question.tag}
          </p>
          <p className="mb-4 font-mono text-[11px] text-cream/45">
            Pregunta {step + 1} de {total}
          </p>
          <h2 className="text-lg md:text-xl font-medium text-cream leading-snug mb-3">
            {question.q}
          </h2>
          {question.hint && (
            <p className="mb-6 border-l-2 border-cream/15 pl-3 text-sm text-cream/45 leading-relaxed">
              {question.hint}
            </p>
          )}

          {question.type === "single" ? (
            <QuestionSingleView
              question={question}
              selectedIndex={answers[question.id]}
              onSelect={(i) => setAnswer(question.id, i)}
            />
          ) : (
            <QuestionScaleView
              question={question}
              value={scaleValues[question.id]}
              onChange={(v) => setScaleValue(question.id, v)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="rounded-full border border-cream/45 px-6 py-2 text-sm text-cream/70 transition-colors hover:border-cream hover:text-cream"
          >
            ← Anterior
          </button>
        ) : <span />}
        <button
          type="button"
          onClick={handleNext}
          disabled={!isAnswered}
          className="bg-cream px-8 py-2.5 text-sm font-medium text-void transition-colors hover:bg-cream/80 disabled:cursor-not-allowed disabled:opacity-40 rounded-full"
        >
          {step < total - 1 ? "Siguiente →" : "Ver resultados →"}
        </button>
      </div>
    </motion.section>
  );
}
