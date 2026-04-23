"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { RizomaResult } from "@/lib/rizoma-scoring";
import ArchetypeBlock from "./ArchetypeBlock";
import LevelBadge from "./LevelBadge";
import RadarChart from "./RadarChart";
import LayerBars from "./LayerBars";
import BrechasCards from "./BrechasCards";
import RutaThousandfold from "./RutaThousandfold";
import EmailGate, { type UserData } from "./EmailGate";

interface Props {
  result: RizomaResult;
  onSubmitUser: (data: UserData) => Promise<void>;
  onReset: () => void;
}

export default function Results({ result, onSubmitUser, onReset }: Props) {
  const [brandName, setBrandName] = useState<string | null>(null);
  const unlocked = brandName !== null;

  const handleSubmit = async (data: UserData) => {
    await onSubmitUser(data);
    setBrandName(data.brandName);
    setTimeout(() => {
      const el = document.getElementById("rizoma-archetype");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl px-6 py-16 space-y-16"
    >
      {!unlocked && (
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">
            Resultados
          </p>
          <h2 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-normal leading-tight text-cream">
            Tu perfil RIZOMA está listo.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream/70">
            24 preguntas respondidas. Tu arquetipo, nivel en el espectro, radar
            por capa, top 3 brechas y ruta ThousandFold se desbloquean cuando
            completes tus datos.
          </p>
        </div>
      )}

      {!unlocked && <EmailGate onSubmit={handleSubmit} />}

      {unlocked && (
        <>
          <div id="rizoma-archetype">
            <ArchetypeBlock arcIndex={result.arcIndex} brandName={brandName} />
          </div>
          <LevelBadge level={result.level} totalScore={result.totalScore} />

          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-4">Radar por capa</p>
            <RadarChart layerScores={result.layerScores} />
          </div>

          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-6">Score por capa</p>
            <LayerBars layerScores={result.layerScores} />
          </div>

          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-6">Top 3 brechas prioritarias</p>
            <BrechasCards topBrechas={result.topBrechas} />
          </div>

          <RutaThousandfold
            arcIndex={result.arcIndex}
            recommendedServiceId={result.recommendedServiceId}
            brandName={brandName}
          />
        </>
      )}

      <div className="border-t border-cream/10 pt-8 text-center">
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-cream/45 underline underline-offset-4 transition-colors hover:text-cream"
        >
          Hacer el diagnóstico de nuevo
        </button>
        <span className="mx-3 text-cream/30">·</span>
        <a href="/" className="text-sm text-cream/45 underline underline-offset-4 transition-colors hover:text-cream">
          Volver a la landing
        </a>
      </div>
    </motion.section>
  );
}
