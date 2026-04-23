import RizomaDiagnostic from "@/components/diagnostic/RizomaDiagnostic";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnóstico RIZOMA — ThousandFold",
  description:
    "Descubre el arquetipo de tu marca regenerativa, tu nivel en el espectro RIZOMA y las brechas prioritarias a resolver. 24 preguntas, 8 minutos, gratuito.",
};

export default function DiagnosticoPage() {
  return <RizomaDiagnostic />;
}
