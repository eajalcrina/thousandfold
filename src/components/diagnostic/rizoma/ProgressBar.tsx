"use client";

import { SECTION_ORDER, SECTION_LABELS, type Section } from "@/lib/rizoma-data";

interface Props {
  currentSection: Section;
  completedSections: Set<Section>;
}

export default function ProgressBar({ currentSection, completedSections }: Props) {
  return (
    <div className="mb-10 flex items-center gap-3">
      <div className="flex flex-1 items-center gap-1.5">
        {SECTION_ORDER.map((s) => {
          const state =
            s === currentSection ? "active" :
            completedSections.has(s) ? "done" : "pending";
          return (
            <span
              key={s}
              aria-label={`Sección ${SECTION_LABELS[s]} — ${state}`}
              className={
                "h-[2px] flex-1 rounded-sm transition-colors duration-300 " +
                (state === "active" ? "bg-signal"
                  : state === "done" ? "bg-[#2C4A3E]"
                  : "bg-cream/15")
              }
            />
          );
        })}
      </div>
      <span className="min-w-[90px] text-right font-mono text-[11px] uppercase tracking-[0.14em] text-cream/45">
        {SECTION_LABELS[currentSection]}
      </span>
    </div>
  );
}
