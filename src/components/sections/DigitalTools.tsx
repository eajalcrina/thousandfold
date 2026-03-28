"use client";

import { useRef } from "react";
import SectionWrapper from "../ui/SectionWrapper";
import SectionLabel from "../ui/SectionLabel";
import Button from "../ui/Button";
import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/StaggerChildren";
import { motion, useInView } from "motion/react";

const tools = [
  {
    name: "ESPECTRÓMETRO REGENERATIVO",
    description: "Evalúa tu modelo contra los 6 principios.",
    icon: "◈",
  },
  {
    name: "BRAND PLATFORM CANVAS",
    description: "Construye los 7 elementos de tu plataforma de marca.",
    icon: "◇",
  },
  {
    name: "PRICING MATRIX DE REGENERACIÓN",
    description: "Calcula el premium que tu marca puede justificar hoy.",
    icon: "△",
  },
  {
    name: "MATRIZ DE RIESGO DE GREENWASHING",
    description: "Semáforo de riesgo por dimensión de comunicación.",
    icon: "⬡",
  },
  {
    name: "KIT PPC EXPRESS",
    description: "Proceso participativo de campo en 3 días.",
    icon: "◎",
  },
  {
    name: "DASHBOARD DE KPIs DE IMPACTO",
    description: "10 métricas. 3 dimensiones. Excel listo.",
    icon: "▣",
  },
];

function ToolCard({ tool, index }: { tool: typeof tools[number]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border border-ink/10 p-6 md:p-8 transition-all duration-500 hover:border-signal/60 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(239,65,41,0.08)]"
    >
      {/* Hover accent line at top */}
      <div className="absolute top-0 left-0 w-0 h-[2px] bg-signal transition-all duration-500 group-hover:w-full" />

      {/* Index + icon row */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-3xl text-signal/20 font-bold transition-colors duration-300 group-hover:text-signal/50">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-xl text-ink/20 transition-colors duration-300 group-hover:text-signal/60">
          {tool.icon}
        </span>
      </div>

      {/* Tool name */}
      <span className="font-mono text-xs uppercase tracking-widest text-ink mt-4 block transition-colors duration-300 group-hover:text-signal">
        {tool.name}
      </span>

      {/* Accent line */}
      <div className="w-8 h-px bg-signal/40 my-3 transition-all duration-500 group-hover:w-12 group-hover:bg-signal" />

      {/* Description */}
      <p className="text-sm text-mute leading-relaxed">{tool.description}</p>
    </motion.div>
  );
}

export default function DigitalTools() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });

  return (
    <SectionWrapper id="herramientas" bg="warm">
      <SectionLabel number="//05" text="PLATAFORMA PARA MARCAS REGENERATIVAS" />

      {/* Hero block — platform highlight */}
      <div ref={heroRef} className="mt-4">
        <TextReveal>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold text-ink max-w-3xl">
            Construye tu marca regenerativa con nuestro framework{" "}
            <span className="text-signal">Regen Brands</span>
          </h2>
        </TextReveal>

        <FadeIn delay={0.15}>
          <p className="mt-4 text-base text-mute max-w-xl">
            Cada herramienta del libro tiene su versión digital completable —
            canvas interactivos, calculadoras de pricing, diagnósticos por
            dimensión. Disponibles con el acceso incluido en la compra del libro.
          </p>
        </FadeIn>

        {/* Platform stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap gap-8 md:gap-12 border-t border-ink/10 pt-8"
        >
          {[
            { value: "17", label: "herramientas" },
            { value: "6", label: "módulos" },
            { value: "∞", label: "actualizaciones" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <span className="font-mono text-2xl md:text-3xl font-bold text-signal">
                {stat.value}
              </span>
              <span className="font-mono text-xs text-mute tracking-wider uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Tool cards — staggered grid */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool, i) => (
          <ToolCard key={tool.name} tool={tool} index={i} />
        ))}
      </div>

      {/* Footer + CTA */}
      <FadeIn delay={0.2} className="mt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Button
            variant="ghost"
            href="https://wa.me/51974620309?text=Hola%2C%20quiero%20acceder%20a%20la%20plataforma%20de%20herramientas%20de%20Regen%20Brands"
            className="text-cream bg-signal border-signal hover:bg-flash"
          >
            Acceder a la plataforma →
          </Button>
          <p className="font-mono text-xs text-mute tracking-wider">
            Acceso incluido con la compra del libro · Actualización periódica
          </p>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}
