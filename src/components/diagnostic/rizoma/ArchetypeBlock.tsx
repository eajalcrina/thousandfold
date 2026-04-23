"use client";

import { ARCHETYPES } from "@/lib/rizoma-data";

interface Props {
  arcIndex: number;
  brandName: string | null;
}

export default function ArchetypeBlock({ arcIndex, brandName }: Props) {
  const a = ARCHETYPES[arcIndex];
  const subject = brandName ?? "Tu marca";
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">Arquetipo</p>
      <h2 className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-normal leading-tight text-cream">
        {subject} es <span className="text-signal">{a.name}</span>.
      </h2>
      <p className="mt-3 text-base italic text-cream/70">{a.subtitle}</p>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/70">
        {brandName
          ? `Como ${a.name.replace("El ", "")}, ${brandName} ${a.description.replace(/^Tu marca /, "")}`
          : a.description}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="border border-cream/15 p-5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-cream/45 mb-2">Fortaleza</p>
          <p className="text-sm text-cream">{a.strength}</p>
        </div>
        <div className="border border-cream/15 p-5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-cream/45 mb-2">Reto principal</p>
          <p className="text-sm text-cream">{a.challenge}</p>
        </div>
      </div>

      <p className="mt-4 text-xs text-cream/45">Referencias: {a.cases}</p>
    </div>
  );
}
