"use client";

import Image from "next/image";
import SectionLabel from "../ui/SectionLabel";
import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";

export default function Founders() {
  return (
    <section id="nosotros" className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/founders/foto-editorial.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dark overlay + blur for readability */}
        <div
          className="absolute inset-0 z-10 backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(to bottom, rgba(28,26,25,0.85) 0%, rgba(28,26,25,0.80) 50%, rgba(28,26,25,0.90) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 md:px-12 py-24 md:py-40">
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

        {/* Text block — left aligned, max width for readability */}
        <FadeIn delay={0.2} className="mt-12 md:mt-16">
          <div className="text-base leading-relaxed text-cream/70 max-w-2xl">
            <p>
              <span className="text-signal font-medium">ThousandFold</span> nació de años construyendo marcas regenerativas desde
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

        {/* Quote */}
        <FadeIn delay={0.3} className="mt-16 md:mt-20">
          <div className="max-w-2xl">
            <div className="border-l-2 border-signal pl-6">
              <p className="text-base sm:text-lg md:text-xl italic text-cream">
                &ldquo;No hacemos marcas verdes. Hacemos marcas verdaderas.&rdquo;
              </p>
            </div>
            <p className="mt-6 text-sm text-cream/50 max-w-lg">
              Construido con y validado por una red de especialistas en branding,
              diseño, ecología, biocomercio y modelos de negocio a lo largo de América
              Latina.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
