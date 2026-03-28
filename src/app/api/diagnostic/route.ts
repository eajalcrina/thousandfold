import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { answers, selectedOptions, userData, result } = body;

    if (!answers || !userData?.nombre || !userData?.email || !userData?.pais || !result) {
      return NextResponse.json(
        { error: "Campos requeridos faltantes" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // Build submission object matching the data structure from the spec
    const submission = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      nombre: userData.nombre,
      email: userData.email,
      pais: userData.pais,
      sector: userData.sector || null,
      tamano_empresa: userData.tamano || null,
      respuestas: selectedOptions,
      scores: answers,
      score_espectro: result.scoreEspectro,
      dimensiones: result.dimensiones,
      etapa: result.etapa,
      por_veto: result.porVeto,
      tipo_veto: result.veto,
      temperatura: result.temperatura,
      tag_crm: result.tagCRM,
    };

    // TODO: Insert into Supabase
    // const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    // const { error } = await supabase.from('diagnostic_submissions').insert(submission);
    // if (error) throw error;

    console.log("[Diagnostic Submission]", JSON.stringify(submission, null, 2));

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error("[Diagnostic Error]", error);
    return NextResponse.json(
      { error: "Error procesando el diagnóstico" },
      { status: 500 }
    );
  }
}
