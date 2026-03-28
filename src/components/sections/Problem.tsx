"use client";

import TextReveal from "@/components/motion/TextReveal";
import FadeIn from "@/components/motion/FadeIn";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/StaggerChildren";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionLabel from "@/components/ui/SectionLabel";

const metrics = [
  {
    value: "73%",
    description:
      'de marcas de impacto en ALC son percibidas como "ecogenéricas" por su propio público objetivo',
  },
  {
    value: "4×",
    description:
      "más valor captura una marca regenerativa bien construida vs. una sostenible genérica",
  },
  {
    value: "$0",
    description:
      "literatura estratégica de branding regenerativo diseñada específicamente para ALC",
  },
  {
    value: "2026",
    description:
      "el año en que el estándar cambia. La metodología ThousandFold llega al mercado",
  },
];

const problems = [
  {
    number: "01",
    label: "LA FUGA DE VALOR",
    body: (
      <>
        <p>
          El café de especialidad peruano llega a Europa como commodity sin
          nombre. El cacao amazónico se convierte en chocolate belga de precio
          premium. Los biomateriales andinos regresan empaquetados como lujo
          europeo.
        </p>
        <p className="mt-4">
          América Latina exporta materia prima extraordinaria y recibe de vuelta
          el valor que no supo capturar.{" "}
          <strong className="text-ink">
            No es un problema de producto. Es un problema de marca.
          </strong>
        </p>
      </>
    ),
  },
  {
    number: "02",
    label: "EL NUEVO ECOGENÉRICO",
    body: (
      <>
        <p>
          En su afán por comunicar regeneración, cientos de marcas adoptaron los
          mismos códigos: papel kraft, tipografías rústicas, hojas verdes,
          discursos moralistas.
        </p>
        <p className="mt-4">
          El resultado: marcas que hacen las cosas bien pero se ven como todas
          las demás. Hacen la inversión de lo regenerativo. Cobran el precio de
          lo genérico.{" "}
          <strong className="text-ink">
            Eso no es branding regenerativo. Es el problema que queremos
            resolver.
          </strong>
        </p>
      </>
    ),
  },
  {
    number: "03",
    label: "EL DISEÑO SIN ESTRATEGIA",
    body: (
      <>
        <p>
          El proceso de construcción de marca convencional es una conversación
          entre la agencia y el cliente. El territorio, la comunidad, el
          ecosistema — los actores que son la fuente real del valor — no están en
          la sala.
        </p>
        <p className="mt-4">
          <strong className="text-ink">
            Una marca construida desde una sala de reuniones sin haber escuchado
            al territorio es una marca que eventualmente el territorio rechaza.
          </strong>
        </p>
      </>
    ),
  },
];

export default function Problem() {
  return (
    <SectionWrapper id="problema" bg="warm">
      <SectionLabel number="//01" text="EL PROBLEMA" />

      <TextReveal>
        <h2 className="text-[clamp(2.5rem,6vw,80px)] font-normal text-ink leading-[1.05] tracking-[-0.02em]">
          El Nuevo Ecogenérico.
        </h2>
      </TextReveal>

      <FadeIn delay={0.15}>
        <p className="mt-2 text-mute italic">(Y no es el único problema.)</p>
      </FadeIn>

      {/* Metrics bar */}
      <StaggerContainer
        className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 border-t border-ink/10 pt-12"
        stagger={0.12}
      >
        {metrics.map((metric) => (
          <StaggerItem key={metric.value}>
            <div className="border-l-2 border-signal pl-5">
              <span className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-signal leading-none tracking-[-0.02em]">
                {metric.value}
              </span>
              <p className="mt-3 text-sm text-mute leading-relaxed">
                {metric.description}
              </p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Problem cards */}
      <StaggerContainer className="mt-20 divide-y divide-ink/10">
        {problems.map((problem) => (
          <StaggerItem key={problem.number}>
            <div className="py-12 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-start">
              <span className="text-[36px] font-light leading-none text-signal/20 font-mono select-none">
                {problem.number}
              </span>
              <div>
                <span className="font-mono text-xs tracking-[0.2em] text-signal uppercase block mb-4">
                  {problem.label}
                </span>
                <div className="text-base leading-relaxed text-mute max-w-2xl">
                  {problem.body}
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.2} className="mt-16">
        <blockquote className="max-w-3xl mx-auto text-center border-l-2 border-signal pl-6 md:border-l-0 md:pl-0">
          <p className="text-lg md:text-xl italic text-ink">
            &ldquo;La regeneración no es un logo con hojas verdes. Es una
            coherencia entre lo que eres, lo que dices y lo que
            cobras.&rdquo;
          </p>
        </blockquote>
      </FadeIn>
    </SectionWrapper>
  );
}
