-- RIZOMA Diagnostic — Lead capture + results
-- ThousandFold Studio · April 2026
-- Apply manually via Supabase dashboard or MCP — do NOT auto-apply.

CREATE TABLE IF NOT EXISTS rizoma_diagnostics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Result
  arc_index SMALLINT NOT NULL CHECK (arc_index BETWEEN 0 AND 4),
  arc_name TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Observadora', 'Caminante', 'Nativa')),
  total_score SMALLINT NOT NULL CHECK (total_score BETWEEN 0 AND 100),
  layer_scores JSONB NOT NULL,
  top_brechas JSONB NOT NULL,
  recommended_service TEXT NOT NULL,

  -- Raw responses (for analysis)
  answers JSONB NOT NULL,
  scale_values JSONB NOT NULL,

  -- Lead
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_country_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  brand_country TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  brand_offering TEXT NOT NULL,
  brand_link TEXT,
  revenue_range TEXT NOT NULL,
  market_scope TEXT NOT NULL,

  -- Attribution (optional)
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  referrer TEXT
);

CREATE INDEX IF NOT EXISTS idx_rizoma_email ON rizoma_diagnostics(email);
CREATE INDEX IF NOT EXISTS idx_rizoma_arc ON rizoma_diagnostics(arc_index);
CREATE INDEX IF NOT EXISTS idx_rizoma_level ON rizoma_diagnostics(level);
CREATE INDEX IF NOT EXISTS idx_rizoma_created_at ON rizoma_diagnostics(created_at DESC);

ALTER TABLE rizoma_diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert rizoma"
  ON rizoma_diagnostics FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service role can read rizoma"
  ON rizoma_diagnostics FOR SELECT TO service_role USING (true);
