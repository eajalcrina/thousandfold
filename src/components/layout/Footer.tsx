"use client";

const NAVEGACION_LINKS = [
  { label: "Diagnóstico", href: "#diagnostico" },
  { label: "Libro", href: "#libro" },
  { label: "Framework", href: "#framework" },
  { label: "Herramientas", href: "#herramientas" },
  { label: "Nosotros", href: "#nosotros" },
];

const RECURSOS_LINKS = [
  { label: "Diagnóstico gratuito", href: "#diagnostico" },
  { label: "Pre-ordenar libro", href: "#libro" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/thousandfold.la" },
  { label: "LinkedIn", href: "https://linkedin.com/company/thousandfold" },
  {
    label: "WhatsApp",
    href: "https://wa.me/51974620309?text=Hola%2C%20quiero%20que%20mi%20marca%20sea%20regenerativa",
  },
];

function handleSmoothClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (href.startsWith("#")) {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }
}

export default function Footer() {
  return (
    <footer className="bg-void border-t border-wire/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-cream">
              THOUSANDFOLD
            </span>
            <p className="mt-4 text-xs leading-relaxed text-mute max-w-[220px] uppercase tracking-wider">
              Iniciativa colectiva para marcas regenerativas.
            </p>
            <p className="mt-6 font-mono text-[10px] tracking-wide text-mute">
              © 2026 Thousandfold
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] text-mute uppercase mb-5">
              Navegación
            </h4>
            <ul className="flex flex-col gap-3">
              {NAVEGACION_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleSmoothClick(e, link.href)}
                    className="font-mono text-[11px] tracking-wide text-mute hover:text-cream transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] text-mute uppercase mb-5">
              Recursos
            </h4>
            <ul className="flex flex-col gap-3">
              {RECURSOS_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleSmoothClick(e, link.href)}
                    className="font-mono text-[11px] tracking-wide text-mute hover:text-signal transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-mono text-[10px] tracking-[0.15em] text-mute uppercase mb-5">
              Contacto
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:regenbrands@redesignlab.org"
                  className="font-mono text-[11px] tracking-wide text-mute hover:text-cream transition-colors duration-200"
                >
                  regenbrands@redesignlab.org
                </a>
              </li>
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] tracking-wide text-mute hover:text-signal transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-wire/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-center">
          <span className="font-mono text-[10px] tracking-[0.2em] text-mute/70">
            Regenerativo, de raíz.
          </span>
        </div>
      </div>
    </footer>
  );
}
