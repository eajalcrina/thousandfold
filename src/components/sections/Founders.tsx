"use client";

import Image from "next/image";
import SectionWrapper from "../ui/SectionWrapper";
import SectionLabel from "../ui/SectionLabel";
import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";

export default function Founders() {
  return (
    <SectionWrapper id="nosotros" bg="dark">
      <SectionLabel number="//06" text="QUIÉNES SOMOS" />

      <TextReveal>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-normal text-cream leading-[1.1]">
          No somos teóricos.
        </h2>
      </TextReveal>
      <TextReveal>
        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-normal text-cream leading-[1.1]">
          Somos constructores.
        </h2>
      </TextReveal>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
        {/* Photo */}
        <FadeIn direction="left" className="lg:col-span-3">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/founders/foto-editorial.jpg"
              alt="Eddie Ajalcriña y Lorenzo Ortiz — ThousandFold"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
        </FadeIn>

        {/* Text block */}
        <FadeIn direction="right" delay={0.2} className="lg:col-span-2">
          <div className="text-base leading-relaxed text-mute">
            <p>
              <span className="text-signal">ThousandFold</span> nació de años construyendo marcas regenerativas desde
              adentro del ecosistema latinoamericano — no estudiando el fenómeno,
              sino siendo parte de él.
            </p>
            <p className="mt-4">
              <a
                href="https://www.linkedin.com/in/eddieajalcrina/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal hover:underline"
              >
                Eddie Ajalcriña
              </a>{" "}
              y{" "}
              <a
                href="https://www.linkedin.com/in/lorenzoortiz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal hover:underline"
              >
                Lorenzo Ortiz
              </a>{" "}
              son business designers especializados
              en la intersección entre regeneración y arquitectura de valor de
              marca. Su formación viene de haber hecho: Cotton Nation, Neofibers,
              Endemics — proyectos donde aprendieron, en territorio y con
              comunidades reales, lo que ningún libro de branding convencional
              enseña.
            </p>
            <p className="mt-4">
              ThousandFold no es una agencia cerrada. Es una iniciativa colectiva
              que convoca a especialistas en branding, diseño, marketing y modelos
              de negocio que comparten una convicción: que las marcas regenerativas
              de América Latina tienen el potencial de redefinir lo que significa
              el lujo, la autenticidad y el valor en los mercados globales.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* Quote */}
      <div className="mt-20">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-4xl md:text-6xl leading-none text-signal">&ldquo;</span>
            <p className="text-base sm:text-lg md:text-xl italic text-cream max-w-2xl mx-auto text-center">
              No hacemos marcas verdes. Hacemos marcas verdaderas.
            </p>
            <span className="text-4xl md:text-6xl leading-none text-signal">&rdquo;</span>
          </div>
        </FadeIn>

        <FadeIn>
          <p className="mt-8 text-center text-sm text-mute max-w-lg mx-auto">
            Construido con y validado por una red de especialistas en branding,
            diseño, ecología, biocomercio y modelos de negocio a lo largo de América
            Latina.
          </p>
        </FadeIn>
      </div>
    </SectionWrapper>
  );
}
