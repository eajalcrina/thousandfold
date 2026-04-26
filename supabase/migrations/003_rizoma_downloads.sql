-- RIZOMA Framework Document — Free download lead capture
-- ThousandFold Studio · April 2026
-- Apply manually via Supabase dashboard or MCP — do NOT auto-apply.

CREATE TABLE IF NOT EXISTS rizoma_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Lead
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT NOT NULL,
  country TEXT NOT NULL,

  -- Document
  document_version TEXT NOT NULL DEFAULT '1.1',

  -- Attribution (optional)
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT
);

CREATE INDEX IF NOT EXISTS idx_rizoma_downloads_email ON rizoma_downloads(email);
CREATE INDEX IF NOT EXISTS idx_rizoma_downloads_country ON rizoma_downloads(country);
CREATE INDEX IF NOT EXISTS idx_rizoma_downloads_created_at ON rizoma_downloads(created_at DESC);

ALTER TABLE rizoma_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert rizoma_downloads"
  ON rizoma_downloads FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can read rizoma_downloads"
  ON rizoma_downloads FOR SELECT TO service_role USING (true);
