import { NextRequest, NextResponse } from "next/server";
import { sendLeadNotification } from "@/lib/brevo";
import { appendSheetRow } from "@/lib/google-sheets";
import { sendRizomaReport } from "@/lib/rizoma-report-email";
import { ARCHETYPES, BRECHAS_META, LAYER_META, SERVICES_CATALOG, type Layer } from "@/lib/rizoma-data";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SHEET_TAB = process.env.GOOGLE_SHEETS_TAB_DIAGNOSTICS ?? "RIZOMA Diagnostics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers, scaleValues, result, user } = body;

    if (!answers || !scaleValues || !result || !user) {
      return NextResponse.json({ error: "Payload incompleto" }, { status: 400 });
    }

    const required = [
      "firstName","lastName","email","phoneCountryCode","phone",
      "brandCountry","brandName","brandOffering","revenueRange","marketScope",
    ] as const;
    for (const k of required) {
      if (!user[k] || typeof user[k] !== "string" || !user[k].trim()) {
        return NextResponse.json({ error: `Campo requerido: ${k}` }, { status: 400 });
      }
    }
    if (!emailRegex.test(user.email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const arcIndex: number = result.arcIndex;
    const arcName = ARCHETYPES[arcIndex]?.name ?? "Desconocido";
    const service = SERVICES_CATALOG.find(s => s.id === result.recommendedServiceId);
    const email = user.email.trim().toLowerCase();

    // 1) Notify the team by email (Brevo) and log the lead to Google Sheets
    // in parallel. Each is independent — one failing doesn't block the other.
    const [brevoResult, sheetsResult] = await Promise.allSettled([
      sendLeadNotification(
        `Nuevo diagnóstico RIZOMA · ${arcName} — ${user.brandName}`,
        [
          ["Nombre", `${user.firstName} ${user.lastName}`],
          ["Email", email],
          ["Teléfono", `${user.phoneCountryCode}${user.phone}`],
          ["Marca", user.brandName],
          ["País de la marca", user.brandCountry],
          ["Qué ofrece", user.brandOffering],
          ["Link de la marca", user.brandLink || null],
          ["Rango de ingresos", user.revenueRange],
          ["Alcance de mercado", user.marketScope],
          ["Arquetipo RIZOMA", arcName],
          ["Nivel", result.level],
          ["Score total", result.totalScore],
          [
            "Servicio recomendado",
            service?.name ?? result.recommendedServiceId ?? "",
          ],
        ]
      ),
      appendSheetRow(SHEET_TAB, [
        new Date().toISOString(),
        user.firstName,
        user.lastName,
        email,
        `${user.phoneCountryCode}${user.phone}`,
        user.brandName,
        user.brandCountry,
        user.brandOffering,
        user.brandLink || "",
        user.revenueRange,
        user.marketScope,
        arcName,
        result.level,
        result.totalScore,
        service?.name ?? result.recommendedServiceId ?? "",
        JSON.stringify(result.layerScores ?? {}),
        JSON.stringify(result.topBrechas ?? []),
      ]),
    ]);

    if (brevoResult.status === "rejected") {
      console.error("[rizoma] Brevo error:", brevoResult.reason);
    }
    if (sheetsResult.status === "rejected") {
      console.error("[rizoma] Google Sheets error:", sheetsResult.reason);
    }

    // Only fail the request if BOTH destinations failed — that's the one
    // case where the lead would otherwise be silently lost. The results
    // screen is already visible client-side, so we still send the email
    // below on a best-effort basis regardless.
    const leadPersisted =
      brevoResult.status === "fulfilled" || sheetsResult.status === "fulfilled";

    // 2) Send follow-up email (non-blocking failure)
    try {
      const topBrechaLayer = result.topBrechas[0] as Layer;
      await sendRizomaReport({
        to: user.email,
        firstName: user.firstName,
        brandName: user.brandName,
        arcName,
        arcDescription: ARCHETYPES[arcIndex]?.description ?? "",
        level: result.level,
        totalScore: result.totalScore,
        topBrecha: {
          label: LAYER_META[topBrechaLayer].label,
          urgente: BRECHAS_META[topBrechaLayer].urgente,
          oportunidad: BRECHAS_META[topBrechaLayer].oportunidad,
        },
        recommendedService: {
          name: service?.name ?? "Consultoría RIZOMA",
          description: service?.description ?? "",
          price: service?.price ?? "",
        },
      });
    } catch (err) {
      console.error("[rizoma] email send error:", err);
    }

    if (!leadPersisted) {
      return NextResponse.json(
        {
          error:
            "No pudimos registrar tu diagnóstico. Intenta de nuevo en unos minutos.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[rizoma] error:", error);
    return NextResponse.json({ error: "Error procesando el diagnóstico" }, { status: 500 });
  }
}
