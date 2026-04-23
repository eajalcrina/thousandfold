"use client";

import { BRECHAS_META, LAYER_META, type Layer } from "@/lib/rizoma-data";

interface Props {
  topBrechas: Layer[];
}

export default function BrechasCards({ topBrechas }: Props) {
  return (
    <div className="space-y-4">
      {topBrechas.map((layer, i) => {
        const meta = LAYER_META[layer];
        const brecha = BRECHAS_META[layer];
        return (
          <div key={layer} className="border border-cream/15 p-6">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="font-mono text-[11px] text-cream/45">#{i + 1}</span>
              <p
                className="font-mono text-[11px] tracking-[0.2em] uppercase"
                style={{ color: meta.color }}
              >
                {meta.label}
              </p>
            </div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-red-400 mb-1">Qué resolver ya</p>
            <p className="text-sm text-cream/80 leading-relaxed mb-4">{brecha.urgente}</p>
            <p className="font-mono text-[10px] tracking-widest uppercase text-green-400 mb-1">Oportunidad de negocio</p>
            <p className="text-sm text-cream/80 leading-relaxed">{brecha.oportunidad}</p>
          </div>
        );
      })}
    </div>
  );
}
