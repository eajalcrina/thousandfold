const BREVO_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

const EMAIL_FROM = process.env.EMAIL_FROM ?? "regenbrands@redesignlab.org";
const EMAIL_NOTIFY = process.env.EMAIL_NOTIFY ?? "regenbrands@redesignlab.org";

type FieldValue = string | number | null | undefined;

interface SendTransactionalEmailInput {
  to: string;
  subject: string;
  html: string;
  fromEmail?: string;
  fromName?: string;
}

/**
 * Low-level transactional send via Brevo's SMTP API. Used both for the
 * internal "new lead" notification and for lead-facing emails (e.g. the
 * RIZOMA diagnostic report) — same account, same delivery path, no need
 * for a second provider (Resend) just for the latter.
 */
export async function sendTransactionalEmail(
  input: SendTransactionalEmailInput
): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY no configurada");
  }

  const res = await fetch(BREVO_EMAIL_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: input.fromEmail ?? EMAIL_FROM,
        name: input.fromName ?? "ThousandFold Studio",
      },
      to: [{ email: input.to }],
      subject: input.subject,
      htmlContent: input.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Brevo email error: ${res.status} ${text}`);
  }
}

/**
 * Sends a transactional notification email to the team whenever a lead
 * capture form is submitted. This is the "don't lose the lead" channel —
 * mirrors the pattern used on redesignlab.org (lib/lead-notify.ts).
 */
export async function sendLeadNotification(
  subject: string,
  fields: Array<[string, FieldValue]>
): Promise<void> {
  await sendTransactionalEmail({
    to: EMAIL_NOTIFY,
    subject,
    html: `<div style="padding:24px;">${renderFieldsHtml(fields)}</div>`,
    fromName: "ThousandFold — Sitio web",
  });
}

function renderFieldsHtml(fields: Array<[string, FieldValue]>): string {
  const rows = fields
    .map(([label, value]) => {
      const display =
        value === null || value === undefined || value === ""
          ? "—"
          : String(value);
      return `<tr><td style="padding:6px 12px 6px 0;color:#8A8478;font-size:13px;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 0;color:#17130F;font-size:14px;">${escapeHtml(display).replace(/\n/g, "<br/>")}</td></tr>`;
    })
    .join("");
  return `<table cellpadding="0" cellspacing="0" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">${rows}</table>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
