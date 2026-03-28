"use client";

import { useRef } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionLabel from "../ui/SectionLabel";
import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";
import { motion, useInView } from "motion/react";

const steps = [
  {
    number: "00",
    name: "DIAGNÓSTICO",
    summary: "¿Dónde estás hoy?",
    detail:
      "Auditoría de marca, mapeo de ecosistema competitivo, inventario de activos intangibles y diagnóstico de percepción de valor.",
  },
  {
    number: "01",
    name: "ARQUITECTURA",
    summary: "Propósito · Audiencia · Plataforma",
    detail:
      "Definición de propósito, segmentación de audiencia, arquitectura de plataforma, estrategia de naming y modelo de pricing regenerativo.",
  },
  {
    number: "02",
    name: "EXPRESIÓN",
    summary: "Cómo se ve, suena y se toca",
    detail:
      "Sistema visual, identidad verbal, paleta sensorial, diseño de puntos de contacto y guía de estilo integral.",
  },
  {
    number: "03",
    name: "NARRATIVA",
    summary: "La marca como activo cultural",
    detail:
      "Historia de origen, manifiesto de marca, framework de contenido, storytelling de impacto y estrategia editorial.",
  },
  {
    number: "04",
    name: "DESPLIEGUE",
    summary: "El mercado te elige y te paga",
    detail:
      "Go-to-market, estrategia de canales, partnerships estratégicos, métricas de marca y plan de activación comunitaria.",
  },
];

function StepCard({ step, index }: { step: typeof steps[number]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Connecting line (hidden on last item) */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-wire/30" />
      )}

      <div className="border border-wire/20 p-6 md:p-8 transition-all duration-[400ms] hover:border-signal/40 h-full flex flex-col">
        {/* Number + Name row */}
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-3xl md:text-4xl text-signal/30 font-bold leading-none transition-colors duration-300 group-hover:text-signal/60">
            {step.number}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-signal/40 to-transparent" />
        </div>

        <span className="font-mono text-xs uppercase tracking-widest text-signal block mb-2">
          {step.name}
        </span>

        <p className="text-sm text-cream/80 font-medium mb-3">
          {step.summary}
        </p>

        <p className="text-sm text-mute leading-relaxed mt-auto">
          {step.detail}
        </p>
      </div>
    </motion.div>
  );
}

export default function Framework() {
  return (
    <SectionWrapper id="framework" bg="dark">
      <SectionLabel number="//04" text="EL FRAMEWORK REGEN BRANDS" />

      {/* Title */}
      <TextReveal>
        <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold text-cream max-w-3xl">
          No es branding sostenible.
          <br />
          <span className="text-signal">Es una estrategia para regenerar el planeta.</span>
        </h2>
      </TextReveal>

      {/* Subtitle */}
      <FadeIn>
        <p className="mt-4 text-base md:text-lg text-mute max-w-2xl">
          El framework Regen Brands organiza el proceso de construcción de marca
          en 5 momentos que ninguna agencia convencional recorre completos.
        </p>
      </FadeIn>

      {/* ── Framework steps — card grid ── */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-4">
        {steps.map((step, i) => (
          <StepCard key={step.number} step={step} index={i} />
        ))}
      </div>

      {/* ── Differentiator box ── */}
      <FadeIn>
        <div className="mt-16 border-l-2 border-signal pl-6 max-w-2xl">
          <p className="text-sm text-mute leading-relaxed italic">
            Antes de conceptualizar la marca, escuchamos al territorio.
            Comunidades, ecosistemas, conocimiento ancestral — las voces que
            ninguna sala de reuniones puede reemplazar son las que generan el
            moat más difícil de copiar.
          </p>
        </div>
      </FadeIn>

      {/* ── CTA ── */}
      <div className="mt-8">
        <a href="#libro" className="text-signal text-sm hover:underline">
          El libro desarrolla los 5 momentos en profundidad. →
        </a>
      </div>
    </SectionWrapper>
  );
}
