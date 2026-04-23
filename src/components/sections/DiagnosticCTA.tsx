"use client";

import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerChildren";
import CountUp from "@/components/motion/CountUp";

const ARCHETYPE_CARDS = [
  { name: "EL CUSTODIO",     subtitle: "Proteger es crear valor" },
  { name: "EL CONSTRUCTOR",  subtitle: "El saber-hacer como moat" },
  { name: "EL REVELADOR",    subtitle: "La transparencia como diferencial" },
  { name: "EL REGENERADOR",  subtitle: "Devolver más de lo que se toma" },
  { name: "EL VISIONARIO",   subtitle: "Imaginar lo que aún no existe" },
];

const STATS = [
  { target: 24, suffix: " preguntas" },
  { target: 8, suffix: " minutos" },
  { target: 6, suffix: " capas RIZOMA" },
];

export default function DiagnosticCTA() {
  return (
    <SectionWrapper id="diagnostico" bg="dark">
      <SectionLabel number="//02" text="DIAGNÓSTICO RIZOMA" />

      <TextReveal>
        <h2 className="text-[clamp(2.5rem,6vw,80px)] font-normal text-cream leading-[1.05] tracking-[-0.02em]">
          Descubre el arquetipo de tu marca regenerativa
        </h2>
      </TextReveal>

      <FadeIn delay={0.15}>
        <p className="mt-4 text-base md:text-lg text-mute max-w-xl">
          24 preguntas. 8 minutos. Un análisis técnico basado en el framework
          RIZOMA — el primer sistema diseñado para evaluar marcas regenerativas
          en América Latina.
        </p>
      </FadeIn>

      <StaggerContainer
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-16"
        stagger={0.1}
      >
        {ARCHETYPE_CARDS.map((c) => (
          <StaggerItem key={c.name}>
            <div className="border border-wire p-6 h-full transition-colors hover:border-signal/50">
              <span className="font-mono text-sm tracking-widest uppercase text-cream block">
                {c.name}
              </span>
              <p className="mt-3 text-xs italic text-mute leading-relaxed">
                {c.subtitle}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.3}>
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-20">
          {STATS.map((stat) => (
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
            Gratuito. Tus datos se piden al final, al desbloquear el reporte
            completo.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.5}>
        <div className="mt-16 border-l-2 border-signal pl-6 text-sm text-mute max-w-2xl">
          <p>
            El resultado incluye: tu arquetipo RIZOMA, score por cada una de las 6
            capas, top 3 brechas prioritarias con oportunidad de negocio, y la ruta
            de servicio ThousandFold recomendada para tu etapa.
          </p>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}
