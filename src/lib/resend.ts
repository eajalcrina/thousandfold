import { Resend } from 'resend';

interface SendRizomaReportInput {
  to: string;
  firstName: string;
  brandName: string;
  arcName: string;
  arcDescription: string;
  level: string;
  totalScore: number;
  topBrecha: { label: string; urgente: string; oportunidad: string };
  recommendedService: { name: string; description: string; price: string };
}

const CALENDLY_URL = 'https://calendar.app.google/9nv4ou6CEBwucfJp8';
const FROM = process.env.RESEND_FROM_EMAIL ?? 'regenbrands@redesignlab.org';

export async function sendRizomaReport(input: SendRizomaReportInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[rizoma] RESEND_API_KEY missing — email not sent');
    return;
  }
  const resend = new Resend(key);
  const subject = `El perfil RIZOMA de ${input.brandName}: ${input.arcName}`;
  const html = renderEmail(input);
  await resend.emails.send({
    from: `ThousandFold Studio <${FROM}>`,
    to: input.to,
    subject,
    html,
  });
}

function renderEmail(i: SendRizomaReportInput): string {
  return `<!doctype html>
<html><body style="font-family:system-ui,sans-serif;background:#F5F0E8;color:#1C1A19;padding:24px;line-height:1.55;">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:32px;border-radius:8px;">
    <p style="font-size:11px;letter-spacing:0.2em;color:#C4622D;text-transform:uppercase;margin:0 0 16px;">Diagnóstico RIZOMA · ThousandFold Studio</p>
    <h1 style="font-size:22px;margin:0 0 8px;font-weight:500;">Hola ${escapeHtml(i.firstName)},</h1>
    <p style="margin:0 0 16px;">Aquí está el perfil RIZOMA de <strong>${escapeHtml(i.brandName)}</strong>.</p>

    <h2 style="font-size:18px;margin:24px 0 4px;font-weight:500;">Arquetipo: ${escapeHtml(i.arcName)}</h2>
    <p style="margin:0 0 12px;color:#1C1A19B3;">${escapeHtml(i.arcDescription)}</p>

    <h3 style="font-size:14px;margin:24px 0 4px;font-weight:500;">Nivel: ${escapeHtml(i.level)} · Score global: ${i.totalScore}/100</h3>

    <h3 style="font-size:14px;margin:24px 0 4px;font-weight:500;">Brecha prioritaria: ${escapeHtml(i.topBrecha.label)}</h3>
    <p style="margin:0 0 8px;"><strong>Urgencia:</strong> ${escapeHtml(i.topBrecha.urgente)}</p>
    <p style="margin:0 0 12px;"><strong>Oportunidad:</strong> ${escapeHtml(i.topBrecha.oportunidad)}</p>

    <h3 style="font-size:14px;margin:24px 0 4px;font-weight:500;">Servicio recomendado: ${escapeHtml(i.recommendedService.name)}</h3>
    <p style="margin:0 0 4px;">${escapeHtml(i.recommendedService.description)}</p>
    <p style="margin:0 0 16px;color:#1C1A19B3;">${escapeHtml(i.recommendedService.price)}</p>

    <p style="margin:32px 0 0;">
      <a href="${CALENDLY_URL}" style="display:inline-block;background:#1C1A19;color:#F5F0E8;padding:12px 24px;border-radius:999px;text-decoration:none;font-size:13px;">Agenda una sesión con nuestro equipo →</a>
    </p>

    <p style="margin:24px 0 0;font-size:12px;color:#8A847E;">¿Prefieres escribir? Responde a este correo o a regenbrands@redesignlab.org.</p>
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]!));
}
