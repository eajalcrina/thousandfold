"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { label: "Diagnóstico", href: "#diagnostico" },
  { label: "Libro", href: "#libro" },
  { label: "Framework", href: "#framework" },
  { label: "Nosotros", href: "#nosotros" },
];

const CTA_LINK = { label: "Contacto", href: "#contacto" };

const SECTION_IDS = ["diagnostico", "libro", "framework", "nosotros", "contacto"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track scroll position for background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver for active section detection
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const callback = (id: string) => (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(id);
        }
      });
    };

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(callback(id), {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      });
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
      setMobileOpen(false);
    },
    []
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-void/90 backdrop-blur-md border-b border-wire/40"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, "#hero")}
            className="font-mono text-[11px] font-medium tracking-[0.2em] text-cream min-h-[44px] flex items-center"
          >
            THOUSANDFOLD
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`font-mono text-[11px] tracking-wide transition-colors duration-200 min-h-[44px] flex items-center ${
                      isActive ? "text-cream" : "text-mute hover:text-cream"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}

            {/* Separator */}
            <li className="w-px h-3 bg-wire/40" aria-hidden="true" />

            {/* CTA */}
            <li>
              <a
                href={CTA_LINK.href}
                onClick={(e) => handleLinkClick(e, CTA_LINK.href)}
                className="font-mono text-[11px] tracking-wide text-signal hover:text-flash transition-colors duration-200 min-h-[44px] flex items-center"
              >
                {CTA_LINK.label}
              </a>
            </li>

            {/* Contextual info */}
            <li className="font-mono text-[10px] tracking-wide text-mute/50 ml-2">
              ALC · 2026
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] text-cream"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-void flex flex-col"
          >
            {/* Close button */}
            <div className="flex items-center justify-end h-14 px-6">
              <button
                type="button"
                aria-label="Cerrar menú"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center min-w-[44px] min-h-[44px] text-cream"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Centered links */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {[...NAV_LINKS, CTA_LINK].map((link, i) => {
                const isActive = activeSection === link.href.slice(1);
                const isCta = link.href === CTA_LINK.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={`font-mono text-sm tracking-[0.15em] transition-colors duration-200 ${
                        isCta
                          ? "text-signal hover:text-flash"
                          : isActive
                            ? "text-cream"
                            : "text-mute hover:text-cream"
                      }`}
                    >
                      {link.label}
                    </a>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom contextual */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="pb-10 text-center"
            >
              <span className="font-mono text-[10px] tracking-wide text-mute/40">
                ALC · 2026
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
