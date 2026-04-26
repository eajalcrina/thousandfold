import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "organization",
  "country",
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    for (const k of REQUIRED_FIELDS) {
      const v = body?.[k];
      if (typeof v !== "string" || !v.trim()) {
        return NextResponse.json(
          { error: `Campo requerido: ${k}` },
          { status: 400 }
        );
      }
    }
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const supabase = getSupabaseServer();
    if (supabase) {
      const { error } = await supabase.from("rizoma_downloads").insert({
        first_name: body.firstName.trim(),
        last_name: body.lastName.trim(),
        email: body.email.trim().toLowerCase(),
        organization: body.organization.trim(),
        country: body.country.trim(),
        document_version: "1.1",
      });
      if (error) console.error("[rizoma-download] supabase insert error:", error);
    } else {
      console.warn("[rizoma-download] Supabase not configured — submission not persisted.");
      console.log(
        "[rizoma-download submission]",
        JSON.stringify(
          {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            organization: body.organization,
            country: body.country,
          },
          null,
          2
        )
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[rizoma-download] error:", error);
    return NextResponse.json(
      { error: "Error procesando la solicitud" },
      { status: 500 }
    );
  }
}
