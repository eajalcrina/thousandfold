"use client";

import { motion } from "motion/react";

interface Props {
  onStart: () => void;
}

const METRICS = [
  { num: "24", label: "preguntas" },
  { num: "~8", label: "minutos" },
  { num: "6", label: "capas RIZOMA" },
];

const CHIPS = [
  "Arquetipo de marca",
  "Score por capa",
  "Brechas prioritarias",
  "Ruta ThousandFold",
];

export default function Hero({ onStart }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto max-w-5xl px-6 pt-32 pb-16 md:pt-40 md:pb-24 text-center"
    >
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">
        FRAMEWORK RIZOMA · THOUSANDFOLD STUDIO
      </p>

      <h1 className="mt-8 text-[clamp(2.25rem,6vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-cream">
        Tu marca hace lo correcto.
        <br />
        <span className="text-signal">El mercado todavía no lo paga.</span>
      </h1>

      <p className="mx-auto mt-8 max-w-xl text-base md:text-lg leading-relaxed text-cream/70">
        En 8 minutos, descubre tu arquetipo RIZOMA, tu nivel en el espectro
        regenerativo y las tres brechas concretas que separan a tu marca del
        precio que realmente vale.
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {METRICS.map((m) => (
          <div key={m.label} className="text-center">
            <p className="font-mono text-3xl md:text-4xl font-medium text-cream">{m.num}</p>
            <p className="mt-1 text-[11px] tracking-widest uppercase text-mute">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {CHIPS.map((c) => (
          <span
            key={c}
            className="rounded-full border border-cream/20 px-4 py-1.5 text-xs text-cream/70"
          >
            {c}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-12 cursor-pointer bg-signal px-10 py-4 font-medium text-cream transition-colors hover:bg-flash"
      >
        Iniciar diagnóstico →
      </button>
    </motion.section>
  );
}
