"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerChildren";
import CountUp from "@/components/motion/CountUp";

const profiles = [
  {
    label: "OBSERVADORA",
    description:
      "Tu marca tiene potencial no articulado. El mercado no lo ve todavía — pero está ahí.",
    highlighted: false,
  },
  {
    label: "CAMINANTE",
    description:
      "Haces las cosas bien. El problema es que nadie lo paga. Estás atrapada en el Error del Medio.",
    highlighted: true,
  },
  {
    label: "NATIVA",
    description:
      "Tienes el ADN correcto. Lo que te falta es el sistema para escalarlo.",
    highlighted: false,
  },
];

const stats = [
  { target: 9, suffix: " preguntas" },
  { target: 3, suffix: " minutos" },
  { target: 100, suffix: "% gratuito" },
];

export default function DiagnosticCTA() {
  return (
    <SectionWrapper id="diagnostico" bg="dark">
      <SectionLabel number="//02" text="IMPACT BRAND SCORE" />

      <TextReveal>
        <h2 className="text-[clamp(2.5rem,6vw,80px)] font-normal text-cream leading-[1.05] tracking-[-0.02em]">
          Empieza a diseñar tu marca regenerativa
        </h2>
      </TextReveal>

      <FadeIn delay={0.15}>
        <p className="mt-4 text-base md:text-lg text-mute max-w-xl">
          En 3 minutos. 9 preguntas. Un análisis que ninguna agencia
          convencional te daría de forma gratuita — porque no tienen el
          framework para hacerlo.
        </p>
      </FadeIn>

      {/* Profile cards */}
      <StaggerContainer
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        stagger={0.15}
      >
        {profiles.map((card) => (
          <StaggerItem key={card.label}>
            <div
              className={`border p-8 ${
                card.highlighted
                  ? "border-signal bg-signal/5"
                  : "border-wire"
              }`}
            >
              <span
                className={`font-mono text-sm tracking-widest uppercase mb-3 block ${
                  card.highlighted ? "text-signal" : "text-cream"
                }`}
              >
                {card.label}
              </span>
              <p className="text-sm text-mute">{card.description}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Stats row */}
      <FadeIn delay={0.3}>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-20">
          {stats.map((stat) => (
            <div key={stat.suffix} className="text-center">
              <CountUp
                target={stat.target}
                className="font-mono text-4xl md:text-5xl font-bold text-cream"
              />
              <span className="block text-sm text-mute mt-1">
                {stat.suffix.trim()}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.4}>
        <div className="mt-16 text-center">
          <Button
            href="/diagnostico"
            variant="primary"
            className="text-base px-12 py-5"
          >
            Iniciar diagnóstico
          </Button>
          <p className="text-xs text-mute mt-3">
            Sin registro. Tu email se pide al final.
          </p>
        </div>
      </FadeIn>

      {/* Bottom note */}
      <FadeIn delay={0.5}>
        <div className="mt-16 border-l-2 border-signal pl-6 text-sm text-mute max-w-2xl">
          <p>
            El resultado no es un tipo genérico. Es un análisis técnico con:
            porcentaje de madurez regenerativa por dimensión — acciones concretas
            para tu etapa — y una ruta hacia el siguiente nivel.
          </p>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}
