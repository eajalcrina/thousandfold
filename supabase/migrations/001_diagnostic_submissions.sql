-- Impact Brand Score — Diagnostic Submissions Table
-- ThousandFold Studio · March 2026

CREATE TABLE IF NOT EXISTS diagnostic_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- User data
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  pais TEXT NOT NULL,
  sector TEXT,
  tamano_empresa TEXT,

  -- Raw responses (option IDs)
  respuestas JSONB NOT NULL,
  -- Numeric scores per question
  scores JSONB NOT NULL,

  -- Calculated results
  score_espectro INTEGER NOT NULL CHECK (score_espectro >= 0 AND score_espectro <= 24),
  dimensiones JSONB NOT NULL,

  -- Classification
  etapa TEXT NOT NULL CHECK (etapa IN ('observadora', 'caminante', 'nativa')),
  por_veto BOOLEAN DEFAULT FALSE,
  tipo_veto TEXT CHECK (tipo_veto IN ('caliente', 'frio', NULL)),
  temperatura TEXT NOT NULL CHECK (temperatura IN ('caliente', 'tibio', 'frio')),
  tag_crm TEXT NOT NULL,

  -- Marketing attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT
);

-- Indexes for common queries
CREATE INDEX idx_diagnostic_email ON diagnostic_submissions(email);
CREATE INDEX idx_diagnostic_etapa ON diagnostic_submissions(etapa);
CREATE INDEX idx_diagnostic_tag_crm ON diagnostic_submissions(tag_crm);
CREATE INDEX idx_diagnostic_created_at ON diagnostic_submissions(created_at DESC);

-- Row Level Security
ALTER TABLE diagnostic_submissions ENABLE ROW LEVEL SECURITY;

-- Only service role can insert (from the API route)
CREATE POLICY "Service role can insert" ON diagnostic_submissions
  FOR INSERT TO service_role WITH CHECK (true);

-- Only service role can read (for admin dashboard later)
CREATE POLICY "Service role can read" ON diagnostic_submissions
  FOR SELECT TO service_role USING (true);

-- Rate limiting helper: check recent submissions by email
CREATE OR REPLACE FUNCTION check_recent_submission(check_email TEXT, minutes_ago INTEGER DEFAULT 60)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM diagnostic_submissions
    WHERE email = check_email
    AND created_at > NOW() - (minutes_ago || ' minutes')::INTERVAL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
