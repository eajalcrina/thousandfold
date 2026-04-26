"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { COUNTRIES } from "@/lib/rizoma-data";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  country: string;
}

const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  organization: "",
  country: "",
};

const PDF_URL = "/downloads/rizoma-framework-v1.1.pdf";
const PDF_FILENAME = "RIZOMA-Framework-v1.1-ThousandFold.pdf";

const inputCls =
  "w-full bg-transparent border border-cream/15 px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:border-signal focus:outline-none rounded-md transition-colors";
const labelCls =
  "block font-mono text-[10px] uppercase tracking-[0.18em] text-cream/55 mb-2";

export default function RizomaDownloadModal({ open, onClose }: Props) {
  const [data, setData] = useState<FormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = <K extends keyof FormData>(k: K, v: FormData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setData(emptyForm);
        setSubmitting(false);
        setError(null);
        setDone(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const canSubmit = Boolean(
    data.firstName.trim() &&
      data.lastName.trim() &&
      emailValid &&
      data.organization.trim() &&
      data.country &&
      !submitting
  );

  const triggerDownload = () => {
    const link = document.createElement("a");
    link.href = PDF_URL;
    link.download = PDF_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rizoma-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error ?? `HTTP ${res.status}`);
      }
      setDone(true);
      // Auto-trigger download once registration succeeds
      setTimeout(triggerDownload, 400);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos registrar tu solicitud. Intenta de nuevo."
      );
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute inset-0 bg-ink/85 backdrop-blur-md cursor-default"
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rizoma-download-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-void border border-wire/40 shadow-[0_30px_80px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-10 h-10 text-cream/60 hover:text-cream transition-colors"
            >
              <svg
                width="18"
                height="18"
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

            {!done ? (
              <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-5">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal">
                    {"// Descarga gratuita · v1.1"}
                  </p>
                  <h3
                    id="rizoma-download-title"
                    className="mt-3 text-2xl sm:text-[28px] font-normal text-cream leading-[1.15] tracking-[-0.01em]"
                  >
                    Descarga el documento RIZOMA.
                  </h3>
                  <p className="mt-3 text-sm text-cream/60 leading-relaxed">
                    Completa tus datos para acceder al PDF completo del
                    framework — 21 páginas con las siete capas del sistema, los
                    cinco arquetipos y las diez herramientas operativas.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelCls}>Nombre *</label>
                    <input
                      className={inputCls}
                      value={data.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                      autoComplete="given-name"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Apellido *</label>
                    <input
                      className={inputCls}
                      value={data.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                      autoComplete="family-name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Email *</label>
                  <input
                    type="email"
                    className={inputCls}
                    value={data.email}
                    onChange={(e) => set("email", e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className={labelCls}>Organización *</label>
                  <input
                    className={inputCls}
                    value={data.organization}
                    onChange={(e) => set("organization", e.target.value)}
                    placeholder="Nombre de tu marca, estudio o empresa"
                    autoComplete="organization"
                    required
                  />
                </div>

                <div>
                  <label className={labelCls}>País *</label>
                  <select
                    className={`${inputCls} appearance-none`}
                    value={data.country}
                    onChange={(e) => set("country", e.target.value)}
                    required
                  >
                    <option value="">Selecciona un país</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {error && (
                  <p className="text-sm text-signal" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-signal py-4 font-mono text-xs tracking-[0.18em] uppercase text-cream transition-colors hover:bg-flash disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Enviando…" : "Descargar PDF →"}
                </button>

                <p className="text-center font-mono text-[10px] tracking-[0.12em] uppercase text-cream/40">
                  Sin spam · Solo para enviarte el documento y novedades del
                  framework
                </p>
              </form>
            ) : (
              <div className="p-8 sm:p-10 space-y-6">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-signal">
                    {"// Descarga iniciada"}
                  </p>
                  <h3 className="mt-3 text-2xl sm:text-[28px] font-normal text-cream leading-[1.15] tracking-[-0.01em]">
                    Gracias, {data.firstName}.
                  </h3>
                  <p className="mt-3 text-sm text-cream/70 leading-relaxed">
                    Tu descarga del documento{" "}
                    <span className="text-cream">RIZOMA v1.1</span> ha
                    comenzado. Si no se inicia automáticamente, usa el botón a
                    continuación.
                  </p>
                </div>

                <div className="border border-signal/40 bg-signal/5 p-5 space-y-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/60">
                      Archivo
                    </span>
                    <span className="font-mono text-xs text-cream/80 truncate">
                      {PDF_FILENAME}
                    </span>
                  </div>
                  <div className="h-px bg-cream/10" />
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/60">
                      Versión · Páginas
                    </span>
                    <span className="font-mono text-xs text-cream/80">
                      v1.1 · 21 pp.
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={PDF_URL}
                    download={PDF_FILENAME}
                    className="flex-1 text-center bg-signal py-4 font-mono text-xs tracking-[0.18em] uppercase text-cream transition-colors hover:bg-flash"
                  >
                    Descargar PDF de nuevo
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 border border-wire/60 py-4 font-mono text-xs tracking-[0.18em] uppercase text-cream/80 hover:text-cream hover:border-signal transition-colors"
                  >
                    Cerrar
                  </button>
                </div>

                <p className="text-center font-mono text-[10px] tracking-[0.12em] uppercase text-cream/40">
                  Documento confidencial · Uso profesional · © 2026 ThousandFold
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
