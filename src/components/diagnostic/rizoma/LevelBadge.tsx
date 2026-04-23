"use client";

import { LEVELS, type Level } from "@/lib/rizoma-data";

interface Props {
  level: Level;
  totalScore: number;
}

export default function LevelBadge({ level, totalScore }: Props) {
  const meta = LEVELS[level];
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">Nivel en el espectro</p>
      <div className="mt-2 flex items-baseline gap-6">
        <p
          className="font-mono text-3xl md:text-4xl tracking-widest uppercase"
          style={{ color: meta.color }}
        >
          {level}
        </p>
        <p className="font-mono text-sm text-cream/45">{totalScore} / 100</p>
      </div>
      <div className="mt-4 h-1 w-full max-w-md overflow-hidden rounded-full bg-wire">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${totalScore}%`, background: meta.color }}
        />
      </div>
      <p className="mt-4 max-w-2xl text-sm text-cream/70 leading-relaxed">{meta.description}</p>
    </div>
  );
}
