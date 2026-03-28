"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  QUESTIONS,
  COUNTRIES,
  SECTORS,
  COMPANY_SIZES,
  CALCULATING_MESSAGES,
  DIMENSION_LABELS,
  calculateResult,
  getEtapaContent,
  type DiagnosticResult,
} from "@/lib/diagnostic-data";

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface UserData {
  nombre: string;
  email: string;
  pais: string;
  sector: string;
  tamano: string;
}

// ────────────────────────────────────────────
// Slide animation variants
// ────────────────────────────────────────────

const slideVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
};

// ────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────

export default function DiagnosticWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [userData, setUserData] = useState<UserData>({
    nombre: "",
    email: "",
    pais: "",
    sector: "",
    tamano: "",
  });
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Progress bar (steps 1-9) ──
  const showProgress = step >= 1 && step <= 9;
  const progress = showProgress ? ((step) / 9) * 100 : 0;

  // ── Handle option selection ──
  const handleOptionSelect = useCallback(
    (questionId: string, optionId: string, score: number) => {
      setAnswers((prev) => ({ ...prev, [questionId]: score }));
      setSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
      setTimeout(() => setStep((s) => s + 1), 400);
    },
    []
  );

  // ── Handle data capture submit ──
  const handleDataSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userData.nombre.trim() || !userData.email.trim() || !userData.pais) return;

      setIsSubmitting(true);
      setStep(11); // go to calculating

      // Calculate result
      const calculatedResult = calculateResult(answers);
      setResult(calculatedResult);

      // POST to API (non-blocking)
      try {
        await fetch("/api/diagnostic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            selectedOptions,
            userData,
            result: calculatedResult,
          }),
        });
      } catch {
        // Silently fail — don't block the user
      } finally {
        setIsSubmitting(false);
      }
    },
    [answers, selectedOptions, userData]
  );

  // ── Reset ──
  const handleReset = useCallback(() => {
    setStep(0);
    setAnswers({});
    setSelectedOptions({});
    setUserData({ nombre: "", email: "", pais: "", sector: "", tamano: "" });
    setResult(null);
    setIsSubmitting(false);
  }, []);

  return (
    <div className="min-h-screen bg-void">
      {/* Progress bar */}
      {showProgress && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-wire">
          <motion.div
            className="h-full bg-signal"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 0 && <WelcomeScreen key="welcome" onStart={() => setStep(1)} />}

          {step >= 1 && step <= 9 && (
            <QuestionScreen
              key={`q-${step}`}
              step={step}
              question={QUESTIONS[step - 1]}
              prevBlockLabel={step > 1 ? QUESTIONS[step - 2].blockLabel : null}
              selectedOptionId={selectedOptions[QUESTIONS[step - 1].id] ?? null}
              onSelect={handleOptionSelect}
            />
          )}

          {step === 10 && (
            <DataCaptureScreen
              key="data"
              userData={userData}
              setUserData={setUserData}
              isSubmitting={isSubmitting}
              onSubmit={handleDataSubmit}
            />
          )}

          {step === 11 && (
            <CalculatingScreen key="calculating" onDone={() => setStep(12)} />
          )}

          {step === 12 && result && (
            <ResultScreen key="result" result={result} onReset={handleReset} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Step 0 — Welcome
// ────────────────────────────────────────────

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <p className="font-mono text-xs tracking-[0.3em] text-mute">
        THOUSANDFOLD &middot; IMPACT BRAND SCORE &middot; DIAGN&Oacute;STICO GRATUITO
      </p>

      <h1 className="mt-6 text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-tight text-cream">
        &iquest;En qu&eacute; etapa del espectro regenerativo est&aacute; tu marca hoy?
      </h1>

      <p className="mt-4 text-base text-mute">
        No medimos si tu logo es bonito. Medimos si tu marca puede cobrar lo que realmente vale
        &mdash; y qu&eacute; est&aacute; impidiendo que lo haga.
      </p>

      <p className="mt-6 text-sm leading-relaxed text-mute">
        Un diagn&oacute;stico t&eacute;cnico basado en el framework Regen Brands: el primer
        sistema dise&ntilde;ado espec&iacute;ficamente para evaluar la madurez de marca
        regenerativa en Am&eacute;rica Latina.
        <br />
        <br />
        El resultado incluye tu posici&oacute;n en el espectro, un an&aacute;lisis por dimensiones
        con porcentajes, y acciones concretas para tu etapa.
      </p>

      <p className="mt-8 font-mono text-xs text-mute">
        9 preguntas &middot; 3 minutos &middot; Resultado inmediato con an&aacute;lisis enriquecido
      </p>

      <button
        onClick={onStart}
        className="mt-8 cursor-pointer bg-signal px-10 py-4 font-medium text-void transition-colors hover:bg-flash"
      >
        Iniciar diagn&oacute;stico &rarr;
      </button>

      <p className="mt-4 text-xs text-mute">
        Gratuito. Sin compromiso. Sin spam.
      </p>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// Steps 1-9 — Questions
// ────────────────────────────────────────────

function QuestionScreen({
  step,
  question,
  prevBlockLabel,
  selectedOptionId,
  onSelect,
}: {
  step: number;
  question: (typeof QUESTIONS)[number];
  prevBlockLabel: string | null;
  selectedOptionId: string | null;
  onSelect: (questionId: string, optionId: string, score: number) => void;
}) {
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const showBlockLabel = question.blockLabel !== prevBlockLabel;

  const handleClick = (optionId: string, score: number) => {
    if (justSelected) return; // prevent double-click
    setJustSelected(optionId);
    onSelect(question.id, optionId, score);
  };

  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {showBlockLabel && (
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-signal">
          {question.blockLabel}
        </p>
      )}

      <p className="mb-6 font-mono text-xs text-mute">
        Pregunta {step} de 9
      </p>

      <h2 className="text-xl font-medium leading-snug text-cream md:text-2xl">
        {question.text}
      </h2>

      <div className="mt-8 space-y-3">
        {question.options.map((option) => {
          const isSelected = justSelected === option.id || selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleClick(option.id, option.score)}
              className={`w-full cursor-pointer border p-5 text-left text-sm leading-relaxed transition-colors ${
                isSelected
                  ? "border-signal bg-signal/10 text-cream"
                  : "border-wire text-mute hover:border-signal/50"
              }`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// Step 10 — Data Capture
// ────────────────────────────────────────────

function DataCaptureScreen({
  userData,
  setUserData,
  isSubmitting,
  onSubmit,
}: {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const inputClass =
    "w-full bg-transparent border border-wire px-4 py-3 text-sm text-cream placeholder:text-mute focus:border-signal focus:outline-none";
  const labelClass = "block text-xs text-mute mb-1";

  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold text-cream">
        Tu diagn&oacute;stico est&aacute; listo. Dinos a qui&eacute;n envi&aacute;rselo.
      </h2>

      <p className="mt-2 text-sm text-mute">
        Recibir&aacute;s el an&aacute;lisis completo &mdash; incluyendo el desglose por
        dimensiones y las acciones espec&iacute;ficas para tu etapa &mdash; de forma inmediata en
        pantalla y por email.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className={labelClass}>Nombre *</label>
          <input
            type="text"
            required
            placeholder="Tu nombre"
            value={userData.nombre}
            onChange={(e) => setUserData((d) => ({ ...d, nombre: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Email *</label>
          <input
            type="email"
            required
            placeholder="tu@email.com"
            value={userData.email}
            onChange={(e) => setUserData((d) => ({ ...d, email: e.target.value }))}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Pa&iacute;s *</label>
          <select
            required
            value={userData.pais}
            onChange={(e) => setUserData((d) => ({ ...d, pais: e.target.value }))}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Selecciona tu pa&iacute;s</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Sector (Opcional)</label>
          <select
            value={userData.sector}
            onChange={(e) => setUserData((d) => ({ ...d, sector: e.target.value }))}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Selecciona tu sector</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Tama&ntilde;o del equipo (Opcional)</label>
          <div className="space-y-2">
            {COMPANY_SIZES.map((size) => (
              <label
                key={size}
                className="flex cursor-pointer items-center gap-3 text-sm text-mute"
              >
                <input
                  type="radio"
                  name="tamano"
                  value={size}
                  checked={userData.tamano === size}
                  onChange={(e) => setUserData((d) => ({ ...d, tamano: e.target.value }))}
                  className="accent-signal"
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !userData.nombre.trim() || !userData.email.trim() || !userData.pais}
          className="mt-6 w-full cursor-pointer bg-signal py-4 font-medium text-void transition-colors hover:bg-flash disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Procesando..." : "Ver mi diagn\u00f3stico \u2192"}
        </button>

        <p className="mt-3 text-center text-xs text-mute">
          Sin spam. Tu email se usa &uacute;nicamente para enviarte el resultado.
        </p>
      </form>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// Step 11 — Calculating
// ────────────────────────────────────────────

function CalculatingScreen({ onDone }: { onDone: () => void }) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    // Animate progress from 0 to 100 over 3 seconds
    const startTime = Date.now();
    const duration = 3000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgressPercent(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        onDone();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onDone]);

  useEffect(() => {
    // Cycle messages every 600ms
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % CALCULATING_MESSAGES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="text-sm text-mute"
        >
          {CALCULATING_MESSAGES[messageIndex]}
        </motion.p>
      </AnimatePresence>

      <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-wire">
        <div
          className="h-full bg-signal transition-[width] duration-75 ease-linear"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// Step 12 — Result
// ────────────────────────────────────────────

function ResultScreen({
  result,
  onReset,
}: {
  result: DiagnosticResult;
  onReset: () => void;
}) {
  const content = getEtapaContent(result.etapa, result.temperatura);
  const dimensionEntries = Object.entries(result.dimensiones).filter(
    ([key]) => key in DIMENSION_LABELS
  );

  const etapaName: Record<string, string> = {
    observadora: "OBSERVADORA",
    caminante: "CAMINANTE",
    nativa: "NATIVA",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Etapa */}
      <div className="text-center">
        <p className={`font-mono text-2xl tracking-widest ${content.badgeColor}`}>
          {etapaName[result.etapa]}
        </p>
        <p className="mt-1 text-sm text-mute">{content.etiqueta}</p>
      </div>

      {/* Titular */}
      <h2 className="mt-8 whitespace-pre-line text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-tight text-cream">
        {content.titular}
      </h2>

      {/* Dato de contexto */}
      <p className="mt-4 text-sm italic text-mute">{content.datoContexto}</p>

      {/* Score */}
      <p className="mt-6 font-mono text-xs text-mute">
        Score: {result.scoreEspectro}/24
      </p>

      {/* Semaforo de dimensiones */}
      <div className="mt-8">
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-signal">
          AN&Aacute;LISIS POR DIMENSIONES
        </p>

        <div className="space-y-3">
          {dimensionEntries.map(([key, pct]) => (
            <DimensionBar key={key} label={DIMENSION_LABELS[key]} percentage={pct} />
          ))}
        </div>
      </div>

      {/* Tu momento actual */}
      <div className="mt-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-signal">
          TU MOMENTO ACTUAL
        </p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-mute">
          {content.momentoActual}
        </p>
      </div>

      {/* El riesgo principal */}
      <div className="mt-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-red-400">
          EL RIESGO PRINCIPAL
        </p>
        <p className="border-l-2 border-red-400/50 pl-4 text-sm leading-relaxed text-mute">
          {content.riesgoPrincipal}
        </p>
      </div>

      {/* La oportunidad concreta */}
      <div className="mt-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-green-400">
          LA OPORTUNIDAD CONCRETA
        </p>
        <p className="border-l-2 border-green-400/50 pl-4 text-sm leading-relaxed text-mute">
          {content.oportunidadConcreta}
        </p>
      </div>

      {/* CTAs */}
      <div className="mt-10 space-y-3">
        <a
          href={content.ctaPrimario.href}
          className="block w-full bg-signal py-4 text-center font-medium text-void transition-colors hover:bg-flash"
        >
          {content.ctaPrimario.label}
        </a>

        <a
          href={content.ctaSecundario.href}
          className="block w-full border border-wire py-4 text-center text-cream transition-colors hover:border-signal/50"
        >
          {content.ctaSecundario.label}
        </a>

        {content.ctaWhatsApp && (
          <a
            href={content.ctaWhatsApp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 py-4 text-center font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {content.ctaWhatsApp.label}
          </a>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-sm text-mute">
          &iquest;El resultado no te representa del todo?
        </p>
        <p className="mt-1 text-xs text-mute">
          Es normal. 9 preguntas capturan la direcci&oacute;n &mdash; no todos los matices.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={onReset}
            className="cursor-pointer text-sm text-mute underline underline-offset-4 transition-colors hover:text-cream"
          >
            Hacer el diagn&oacute;stico de nuevo
          </button>
          <a
            href="/"
            className="text-sm text-mute underline underline-offset-4 transition-colors hover:text-cream"
          >
            Volver a la landing
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ────────────────────────────────────────────
// Dimension Bar sub-component
// ────────────────────────────────────────────

function DimensionBar({ label, percentage }: { label: string; percentage: number }) {
  const barColor =
    percentage >= 67 ? "bg-green-500" : percentage >= 34 ? "bg-yellow-500" : "bg-red-400";

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-mute">{label}</span>
        <span className="font-mono text-xs text-mute">{percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-wire">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}
