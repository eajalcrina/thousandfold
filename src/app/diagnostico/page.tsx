import DiagnosticWizard from "@/components/diagnostic/DiagnosticWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact Brand Score — ThousandFold",
  description:
    "Diagnóstico gratuito de madurez de marca regenerativa. 9 preguntas. 3 minutos. Resultado inmediato.",
};

export default function DiagnosticoPage() {
  return <DiagnosticWizard />;
}
