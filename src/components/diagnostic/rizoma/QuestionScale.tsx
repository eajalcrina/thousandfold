"use client";

import type { QuestionScale } from "@/lib/rizoma-data";

interface Props {
  question: QuestionScale;
  value: number | undefined;
  onChange: (value: number) => void;
}

export default function QuestionScaleView({ question, value, onChange }: Props) {
  const levels = [1, 2, 3, 4, 5];
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs text-cream/45">{question.labels[0]}</span>
        <span className="text-xs text-cream/45 text-right">{question.labels[1]}</span>
      </div>
      <div className="flex gap-2">
        {levels.map((l) => {
          const isSelected = value === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => onChange(l)}
              aria-label={`Nivel ${l} de 5`}
              className={
                "flex-1 rounded-md border py-4 font-mono text-sm transition-colors " +
                (isSelected
                  ? "border-signal bg-signal/10 text-cream"
                  : "border-cream/15 text-cream/70 hover:border-signal/50")
              }
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}
