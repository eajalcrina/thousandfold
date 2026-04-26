"use client";

import { useState } from "react";
import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/StaggerChildren";
import RizomaDownloadModal from "@/components/sections/RizomaDownloadModal";

const documentMeta = [
  { label: "Versión", value: "1.1" },
  { label: "Edición", value: "Abril 2026" },
  { label: "Páginas", value: "21" },
  { label: "Formato", value: "PDF · A4" },
];

const highlights = [
  { number: "07", label: "capas del sistema" },
  { number: "03", label: "principios" },
  { number: "10", label: "herramientas" },
];

const tableOfContents = [
  { num: "I", title: "Por qué el mundo necesita otro framework" },
  { num: "II", title: "Los tres principios fundacionales" },
  { num: "III", title: "Las siete capas del rizoma" },
  { num: "IV", title: "El espectro de transición" },
  { num: "V", title: "La diferencia específica de RIZOMA" },
  { num: "VI", title: "Las diez herramientas del sistema" },
  { num: "VII", title: "RIZOMA y la serie editorial" },
  { num: "VIII", title: "RIZOMA como IP de ThousandFold" },
  { num: "IX", title: "Registro y propiedad intelectual" },
];

export default function Book() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <SectionWrapper id="libro" bg="warm">
      <SectionLabel
        number="//03"
        text="DOCUMENTO FRAMEWORK · DESCARGA GRATUITA"
      />

      {/* Title area */}
      <div className="mb-12 md:mb-16">
        <TextReveal>
          <h2 className="text-[clamp(3rem,8vw,96px)] font-normal text-signal leading-[0.95] tracking-[-0.03em]">
            RIZOMA
            <span className="text-ink">.</span>
          </h2>
        </TextReveal>
        <TextReveal delay={0.1}>
          <p className="mt-2 text-[clamp(1.25rem,2.5vw,1.75rem)] italic text-mute font-normal">
            El primer framework de arquitectura de marca regenerativa
            <br className="hidden md:inline" /> diseñado para América Latina y el Caribe.
          </p>
        </TextReveal>
      </div>

      {/* Two-column: document image + details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left — document mockup */}
        <div>
          <FadeIn direction="left">
            <div className="relative aspect-[1/1.414] max-w-sm sm:max-w-md mx-auto lg:max-w-none overflow-hidden shadow-[0_30px_80px_rgba(28,26,25,0.25)] ring-1 ring-ink/10">
              <Image
                src="/images/book/rizoma-cover.jpg"
                alt="Documento RIZOMA v1.1 — Framework de Arquitectura de Marca Regenerativa"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </FadeIn>

          {/* Document metadata */}
          <FadeIn delay={0.3}>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto lg:max-w-none">
              {documentMeta.map((m) => (
                <div key={m.label} className="border-l border-ink/10 pl-3">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-mute">
                    {m.label}
                  </span>
                  <span className="block font-mono text-sm font-medium text-ink mt-1">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Right — copy, stats, ToC, CTA */}
        <div className="flex flex-col justify-center">
          {/* Stat counters */}
          <StaggerContainer
            className="flex gap-8 md:gap-10 mb-10"
            stagger={0.1}
          >
            {highlights.map((h) => (
              <StaggerItem key={h.label}>
                <div>
                  <span className="font-mono text-3xl md:text-4xl font-bold text-signal leading-none">
                    {h.number}
                  </span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-mute mt-1">
                    {h.label}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Description */}
          <FadeIn delay={0.2}>
            <p className="text-base leading-relaxed text-mute">
              Los frameworks que existen — Golden Circle, Kapferer, B Corp —
              fueron diseñados para marcas que operan en economías extractivas.
              RIZOMA es el primero diseñado para marcas que quieren regenerar el
              territorio del que dependen, sin perder coherencia al escalar a
              mercados globales.
            </p>
            <p className="mt-4 text-base leading-relaxed text-mute">
              El documento v1.1 desarrolla las siete capas del sistema, los tres
              principios fundacionales, los cinco arquetipos RIZOMA, el Espectro
              de Transición y el inventario completo de herramientas operativas
              — del Mapa del Territorio al Dashboard de Doble Valor.
            </p>
            <p className="mt-4 text-sm text-ink font-medium">
              Para fundadores, equipos de marca, inversores y consultores que
              trabajan con empresas regenerativas con origen en ALC.
            </p>
          </FadeIn>

          {/* Table of contents */}
          <FadeIn delay={0.3}>
            <div className="mt-10">
              <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-mute mb-4">
                {"// Contenido"}
              </span>
              <ul className="space-y-2">
                {tableOfContents.map((item) => (
                  <li
                    key={item.num}
                    className="flex items-baseline gap-4 text-sm text-ink/80"
                  >
                    <span className="font-mono text-[10px] text-signal w-5 shrink-0">
                      {item.num}
                    </span>
                    <span className="flex-1">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* CTA */}
          <FadeIn delay={0.4}>
            <div className="mt-10 flex gap-4 flex-wrap items-center">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-block text-sm tracking-wider uppercase font-mono bg-signal text-cream hover:bg-flash font-medium px-8 py-4 transition-all duration-300 hover:translate-y-[-1px] cursor-pointer"
              >
                Descargar el documento
              </button>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                Gratuito · Registro requerido
              </span>
            </div>
            <p className="mt-4 text-xs text-mute/80 max-w-md leading-relaxed">
              Documento confidencial · Uso profesional · © 2026 ThousandFold
              Studio. Toda aplicación, adaptación, reproducción o traducción
              requiere autorización expresa del estudio.
            </p>
          </FadeIn>
        </div>
      </div>

      <RizomaDownloadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </SectionWrapper>
  );
}
