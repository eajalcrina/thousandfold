import { JWT } from "google-auth-library";

type SheetValue = string | number;

let cachedClient: JWT | null = null;

function getSheetsClient(): JWT | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) return null;

  if (cachedClient) return cachedClient;

  cachedClient = new JWT({
    email,
    // Vercel env vars store the key as a single line with literal "\n" —
    // turn those back into real newlines before handing it to the JWT lib.
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return cachedClient;
}

/**
 * Appends one row to the given tab of GOOGLE_SHEET_ID. Requires
 * GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY,
 * and the sheet must be shared with that service account's email as an
 * Editor. Mirrors the pattern used on redesignlab.org (lib/lead-notify.ts).
 */
export async function appendSheetRow(
  tabName: string,
  values: SheetValue[]
): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const client = getSheetsClient();
  if (!sheetId || !client) {
    throw new Error("Google Sheets no configurado");
  }

  const { token } = await client.getAccessToken();
  const range = encodeURIComponent(`${tabName}!A:A`);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [values] }),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google Sheets append error: ${res.status} ${text}`);
  }
}
