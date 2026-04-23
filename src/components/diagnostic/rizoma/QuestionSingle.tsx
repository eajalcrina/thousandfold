"use client";

import type { QuestionSingle } from "@/lib/rizoma-data";

interface Props {
  question: QuestionSingle;
  selectedIndex: number | undefined;
  onSelect: (index: number) => void;
}

export default function QuestionSingleView({ question, selectedIndex, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {question.opts.map((opt, i) => {
        const isSelected = selectedIndex === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={
              "w-full rounded-md border px-4 py-3 text-left text-sm leading-relaxed transition-colors " +
              (isSelected
                ? "border-signal bg-signal/10 text-cream"
                : "border-cream/15 text-cream/70 hover:border-signal/50 hover:text-cream")
            }
          >
            {opt.t}
          </button>
        );
      })}
    </div>
  );
}
