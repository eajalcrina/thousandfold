"use client";

import { SERVICES_CATALOG, ARCHETYPES } from "@/lib/rizoma-data";

interface Props {
  arcIndex: number;
  recommendedServiceId: string;
  brandName: string | null;
}

const CALENDLY = "https://calendar.app.google/9nv4ou6CEBwucfJp8";
const MAILTO = "mailto:regenbrands@redesignlab.org?subject=Consulta%20sobre%20mi%20perfil%20RIZOMA";

export default function RutaThousandfold({ arcIndex, recommendedServiceId, brandName }: Props) {
  const service = SERVICES_CATALOG.find(s => s.id === recommendedServiceId) ?? SERVICES_CATALOG[0];
  const a = ARCHETYPES[arcIndex];
  const subject = brandName ?? "tu marca";
  return (
    <div className="border border-signal/40 bg-signal/5 p-8">
      <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">Ruta ThousandFold</p>
      <h3 className="mt-3 text-2xl font-normal text-cream">{service.name}</h3>
      <p className="mt-1 font-mono text-xs text-cream/45">{service.price}</p>
      <p className="mt-4 text-sm text-cream/70 leading-relaxed">{service.description}</p>
      <p className="mt-4 text-sm text-cream/70 leading-relaxed">
        Para {subject}, el siguiente paso es {a.ctaText.replace(/^[^.]*\. /, "").toLowerCase()}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={CALENDLY}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-signal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-flash"
        >
          Agenda una sesión con nuestro equipo →
        </a>
        <a
          href={MAILTO}
          className="border border-cream/30 px-6 py-3 text-sm text-cream transition-colors hover:border-cream"
        >
          Escríbenos a regenbrands@redesignlab.org
        </a>
      </div>
      <p className="mt-4 text-xs text-cream/45">
        30 minutos. Gratuito. Revisamos tu reporte RIZOMA contigo.
      </p>
    </div>
  );
}
