"use client";

import SectionWrapper from "../ui/SectionWrapper";
import SectionLabel from "../ui/SectionLabel";
import Button from "../ui/Button";
import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";

export default function FinalCTA() {
  return (
    <SectionWrapper id="contacto" bg="black" fullScreen={true}>
      <div className="text-center">
        <SectionLabel number="//07" text="EL PRIMER PASO" />

        <TextReveal>
          <span className="text-display text-cream">
            Tu marca tiene el producto correcto.
          </span>
        </TextReveal>
        <TextReveal>
          <span className="text-display text-cream">
            La pregunta es si tiene la capacidad de{" "}
            <span className="text-signal">regenerar nuestra región</span>.
          </span>
        </TextReveal>

        <FadeIn delay={0.3}>
          <div className="mt-8 text-mute max-w-lg mx-auto">
            <p>Empieza con el diagnóstico gratuito. Tres minutos. Sin compromiso.</p>
            <p className="mt-2">O ve directo al libro si ya sabes que lo necesitas.</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="primary"
              href="/diagnostico"
              className="text-base px-12 py-5"
            >
              Diagnostica tu marca
            </Button>
            <Button
              variant="ghost"
              href="https://wa.me/51974620309?text=Hola%2C%20quiero%20pre-ordenar%20el%20libro%20Regen%20Brand"
            >
              Pre-ordenar el libro
            </Button>
            <Button
              variant="text"
              href="https://wa.me/51974620309?text=Hola%2C%20quiero%20que%20mi%20marca%20sea%20regenerativa"
            >
              Hablar con el equipo
            </Button>
          </div>
        </FadeIn>

        <p className="mt-20 font-mono text-[0.625rem] tracking-[0.3em] text-mute uppercase text-center">
          THOUSANDFOLD &middot; Regenerativo, de raíz.
        </p>
      </div>
    </SectionWrapper>
  );
}
