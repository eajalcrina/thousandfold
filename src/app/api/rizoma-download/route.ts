import { NextRequest, NextResponse } from "next/server";
import { sendLeadNotification } from "@/lib/brevo";
import { appendSheetRow } from "@/lib/google-sheets";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "organization",
  "country",
] as const;

const SHEET_TAB = process.env.GOOGLE_SHEETS_TAB_DOWNLOADS ?? "RIZOMA Downloads";

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

    const lead = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      organization: body.organization.trim(),
      country: body.country.trim(),
    };

    // Notify the team by email (Brevo) and log the lead to Google Sheets in
    // parallel. Each is independent — one failing doesn't block the other,
    // so a single outage doesn't mean the contact is lost.
    const [brevoResult, sheetsResult] = await Promise.allSettled([
      sendLeadNotification(
        `Nueva descarga · RIZOMA v1.1 — ${lead.organization}`,
        [
          ["Nombre", `${lead.firstName} ${lead.lastName}`],
          ["Email", lead.email],
          ["Organización", lead.organization],
          ["País", lead.country],
          ["Versión documento", "1.1"],
        ]
      ),
      appendSheetRow(SHEET_TAB, [
        new Date().toISOString(),
        lead.firstName,
        lead.lastName,
        lead.email,
        lead.organization,
        lead.country,
        "1.1",
      ]),
    ]);

    if (brevoResult.status === "rejected") {
      console.error("[rizoma-download] Brevo error:", brevoResult.reason);
    }
    if (sheetsResult.status === "rejected") {
      console.error("[rizoma-download] Google Sheets error:", sheetsResult.reason);
    }

    // Only fail the request (and surface an error to the visitor) if BOTH
    // destinations failed — that's the one case where the contact would
    // otherwise be silently lost.
    if (brevoResult.status === "rejected" && sheetsResult.status === "rejected") {
      return NextResponse.json(
        {
          error:
            "No pudimos registrar tu solicitud. Intenta de nuevo en unos minutos.",
        },
        { status: 502 }
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
