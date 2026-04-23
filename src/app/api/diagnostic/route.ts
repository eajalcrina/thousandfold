import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { sendRizomaReport } from "@/lib/resend";
import { ARCHETYPES, BRECHAS_META, LAYER_META, SERVICES_CATALOG, type Layer } from "@/lib/rizoma-data";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    // 1) Persist to Supabase if configured
    const supabase = getSupabaseServer();
    if (supabase) {
      const { error } = await supabase.from("rizoma_diagnostics").insert({
        arc_index: arcIndex,
        arc_name: arcName,
        level: result.level,
        total_score: result.totalScore,
        layer_scores: result.layerScores,
        top_brechas: result.topBrechas,
        recommended_service: result.recommendedServiceId,
        answers,
        scale_values: scaleValues,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone_country_code: user.phoneCountryCode,
        phone: user.phone,
        brand_country: user.brandCountry,
        brand_name: user.brandName,
        brand_offering: user.brandOffering,
        brand_link: user.brandLink || null,
        revenue_range: user.revenueRange,
        market_scope: user.marketScope,
      });
      if (error) console.error("[rizoma] supabase insert error:", error);
    } else {
      console.warn("[rizoma] Supabase not configured — submission not persisted.");
      console.log("[rizoma submission]", JSON.stringify({ result, user }, null, 2));
    }

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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[rizoma] error:", error);
    return NextResponse.json({ error: "Error procesando el diagnóstico" }, { status: 500 });
  }
}
