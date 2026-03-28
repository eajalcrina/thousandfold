"use client";

import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/StaggerChildren";

const pricingRows = [
  { label: "Edición digital", price: "$59 USD" },
  { label: "Edición física + digital", price: "$79 USD" },
  { label: "Bundle con Workbook", price: "$99 USD" },
];

const highlights = [
  { number: "13", label: "capítulos" },
  { number: "6", label: "módulos" },
  { number: "17", label: "herramientas" },
];

export default function Book() {
  return (
    <SectionWrapper id="libro" bg="warm">
      <SectionLabel number="//03" text="EL PRIMER LIBRO DE BRANDING REGENERATIVO PARA LATAM" />

      {/* Title area — full width dramatic heading */}
      <div className="mb-12 md:mb-16">
        <TextReveal>
          <h2 className="text-[clamp(3rem,8vw,96px)] font-normal text-signal leading-[0.95] tracking-[-0.03em]">
            Regen Brands
          </h2>
        </TextReveal>
        <TextReveal delay={0.1}>
          <p className="mt-2 text-[clamp(1.25rem,2.5vw,1.75rem)] italic text-mute font-normal">
            Cómo crear marcas regenerativas en América Latina
          </p>
        </TextReveal>
      </div>

      {/* Two-column: book image + details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left — book mockup, centered and large */}
        <FadeIn direction="left">
          <div className="relative aspect-[4/5] sm:aspect-[3/4] max-w-sm sm:max-w-md mx-auto lg:max-w-none">
            <Image
              src="/images/book/regen-brand-mockup-2.png"
              alt="Regen Brands"
              fill
              className="object-contain drop-shadow-[0_20px_60px_rgba(239,65,41,0.12)]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </FadeIn>

        {/* Right — copy, stats, pricing, CTAs */}
        <div className="flex flex-col justify-center">
          {/* Stat counters */}
          <StaggerContainer className="flex gap-8 md:gap-10 mb-10" stagger={0.1}>
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
              El primer playbook táctico de branding regenerativo diseñado
              específicamente para el contexto latinoamericano.
            </p>
            <p className="mt-4 text-base leading-relaxed text-mute">
              No es un libro de teoría ecológica. Es un manual de operaciones:
              estrategia de marca, identidad visual, narrativa de impacto,
              go-to-market y pricing — todo con el criterio de lo regenerativo
              como columna vertebral.
            </p>
            <p className="mt-4 text-sm text-ink font-medium">
              Para fundadores, directores de marketing y emprendedores de impacto
              que quieren dejar de competir por precio y empezar a cobrar lo que
              realmente valen.
            </p>
          </FadeIn>

          {/* Pricing table */}
          <FadeIn delay={0.3}>
            <div className="mt-10 space-y-3">
              {pricingRows.map((row) => (
                <div key={row.label} className="flex items-baseline">
                  <span className="text-sm text-mute whitespace-nowrap">
                    {row.label}
                  </span>
                  <span className="flex-1 border-b border-dotted border-mute/30 mx-4" />
                  <span className="font-mono text-sm font-medium text-ink whitespace-nowrap">
                    {row.price}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.4}>
            <div className="mt-10 flex gap-4 flex-wrap">
              <Button
                href="https://wa.me/51974620309?text=Hola%2C%20quiero%20pre-ordenar%20el%20libro%20Regen%20Brand"
                variant="primary"
              >
                Pre-ordenar el libro
              </Button>
              <Button href="#" variant="text">
                Leer el primer capítulo — gratis
              </Button>
            </div>
          </FadeIn>
        </div>
      </div>
    </SectionWrapper>
  );
}
