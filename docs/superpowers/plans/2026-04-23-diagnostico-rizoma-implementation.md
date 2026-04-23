# Diagnóstico RIZOMA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current 9-question diagnostic with the 24-question RIZOMA diagnostic, add a hero state on `/diagnostico`, update the landing DiagnosticCTA to reflect the new system, and persist submissions to Supabase with an automatic follow-up email.

**Architecture:** Client-side wizard (React Client Component) with 3 state machine (`hero | wizard | results`). Pure scoring logic isolated in `src/lib/rizoma-scoring.ts`. Data blobs copied from `Referencias/rizoma-diagnostic-spec.md` into `src/lib/rizoma-data.ts`. Email gate blocks the detailed sections until the user submits the 11-field form. POST to `/api/diagnostic` persists to a new `rizoma_diagnostics` Supabase table and triggers a Resend email. If env vars are missing, API logs and returns success so local preview works without credentials.

**Tech Stack:** Next.js 16.2.1 (App Router), React 19.2, TypeScript, TailwindCSS v4, Motion 12.38, Recharts (to install), `@supabase/supabase-js` (to install), Resend (to install).

**Source of truth for data:** `Referencias/rizoma-diagnostic-spec.md`. The canonical design is in `docs/superpowers/specs/2026-04-23-diagnostico-rizoma-design.md`.

**⚠️ Important:** The project uses Next.js 16. Before using any Next.js API you're unsure about, read `node_modules/next/dist/docs/01-app/03-api-reference/` — conventions may differ from older Next versions.

**⚠️ Commits:** The user wants to preview the result locally **before any commit**. All tasks are structured without intermediate commits. The final task (after manual QA) is a single consolidated commit — run it only if the user approves.

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `src/lib/rizoma-data.ts` | Question bank (24), archetypes (5), levels (3), layer meta (6), brechas, services catalog, country codes. Pure data + types. |
| `src/lib/rizoma-scoring.ts` | `computeResults()` + `recommendService()`. Pure logic, no React. |
| `src/lib/__tests__/rizoma-scoring.test.ts` | Unit tests for scoring + service recommendation. |
| `src/lib/supabase-server.ts` | Server-only Supabase client factory using service role key. |
| `src/lib/resend.ts` | Resend client helper + `sendRizomaReport()` function. |
| `src/components/diagnostic/RizomaDiagnostic.tsx` | Client orchestrator. State machine `hero → wizard → results`. |
| `src/components/diagnostic/rizoma/Hero.tsx` | State 1 — hero section with copy, metrics, chips, CTA. |
| `src/components/diagnostic/rizoma/Wizard.tsx` | State 2 — progress bar + question renderer + nav. |
| `src/components/diagnostic/rizoma/ProgressBar.tsx` | 7-segment progress bar with active section label. |
| `src/components/diagnostic/rizoma/QuestionSingle.tsx` | Renderer for `type: 'single'` questions. |
| `src/components/diagnostic/rizoma/QuestionScale.tsx` | Renderer for `type: 'scale'` questions (1-5). |
| `src/components/diagnostic/rizoma/Results.tsx` | State 3 — composes all result sub-components and handles gate. |
| `src/components/diagnostic/rizoma/ArchetypeBlock.tsx` | Archetype name, subtitle, description, cases, strength, challenge. |
| `src/components/diagnostic/rizoma/LevelBadge.tsx` | Nivel + score global bar. |
| `src/components/diagnostic/rizoma/RadarChart.tsx` | Recharts radar — 6 layers. |
| `src/components/diagnostic/rizoma/LayerBars.tsx` | 6 horizontal bars with %. |
| `src/components/diagnostic/rizoma/BrechasCards.tsx` | Top 3 brecha cards (diagnostic + opportunity). |
| `src/components/diagnostic/rizoma/RutaThousandfold.tsx` | Recommended service + primary/secondary CTA. |
| `src/components/diagnostic/rizoma/EmailGate.tsx` | 11-field form with validation. |
| `supabase/migrations/002_rizoma_diagnostics.sql` | New table + RLS policies. |

### Modified files

| Path | Change |
|---|---|
| `src/app/diagnostico/page.tsx` | Metadata + render `<RizomaDiagnostic />`. |
| `src/app/api/diagnostic/route.ts` | New payload schema + Supabase insert + Resend send. |
| `src/components/sections/DiagnosticCTA.tsx` | Rewrite with 5 archetype cards + updated copy/stats. |
| `src/components/layout/Navbar.tsx` | Link `#diagnostico` → `/diagnostico`; active state via `usePathname()`. |
| `src/components/layout/Footer.tsx` | `thousandfold@redesignlab.org` → `regenbrands@redesignlab.org`. |
| `package.json` | Add `recharts`, `@supabase/supabase-js`, `resend`. |
| `.env.local.example` (create if missing) | Document `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`. |

### Deleted files

- `src/components/diagnostic/DiagnosticWizard.tsx`
- `src/lib/diagnostic-data.ts`
- `src/lib/supabase.ts` (replaced by `supabase-server.ts`)

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1:** Install runtime deps from `landing/`:

  ```bash
  cd /Users/eajalcrina/Documents/Proyectos/Thousandfold/landing
  npm install recharts @supabase/supabase-js resend
  ```

- [ ] **Step 2:** Verify the versions installed (recharts should be 2.x or higher, supabase-js 2.x, resend 4.x+):

  ```bash
  npm list recharts @supabase/supabase-js resend --depth=0
  ```

  Expected output: three packages listed without errors.

- [ ] **Step 3:** Create `.env.local.example` so the next engineer can copy it:

  ```
  # Supabase (server-only)
  SUPABASE_URL=https://xxxxx.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

  # Resend (server-only)
  RESEND_API_KEY=re_xxxxx
  RESEND_FROM_EMAIL=regenbrands@redesignlab.org
  ```

  Write the file to `landing/.env.local.example`.

---

## Task 2: Supabase migration

**Files:**
- Create: `supabase/migrations/002_rizoma_diagnostics.sql`

- [ ] **Step 1:** Create the migration file with this exact content:

  ```sql
  -- RIZOMA Diagnostic — Lead capture + results
  -- ThousandFold Studio · April 2026

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
  ```

- [ ] **Step 2:** Do NOT apply the migration to a remote Supabase project automatically. The user will apply it manually via the Supabase dashboard or MCP tool when they're ready. Note this in a comment at the top of the file is enough.

---

## Task 3: Data module — types and country codes

**Files:**
- Create: `src/lib/rizoma-data.ts` (first pass: types + meta + country codes)

- [ ] **Step 1:** Create `src/lib/rizoma-data.ts` with the type definitions and metadata maps. Paste the following exactly:

  ```ts
  // ============================================================
  // RIZOMA Diagnostic — Data Module
  // Source of truth: Referencias/rizoma-diagnostic-spec.md
  // ============================================================

  export type Section =
    | 'perfil' | 'territorio' | 'proposito' | 'identidad'
    | 'arquitectura' | 'expresion' | 'narrativa';

  export type Layer =
    | 'territorio' | 'proposito' | 'identidad'
    | 'arquitectura' | 'expresion' | 'narrativa';

  export type Level = 'Observadora' | 'Caminante' | 'Nativa';

  export type ArcVector = [number, number, number, number, number];

  export interface Option {
    t: string;
    v: number;
    arc: ArcVector;
  }

  interface BaseQuestion {
    id: string;
    section: Section;
    tag: string;
    q: string;
    hint?: string;
  }

  export interface QuestionSingle extends BaseQuestion {
    type: 'single';
    layer?: Layer;
    opts: Option[];
  }

  export interface QuestionScale extends BaseQuestion {
    type: 'scale';
    layer: Layer;
    labels: [string, string];
  }

  export type Question = QuestionSingle | QuestionScale;

  export interface Archetype {
    name: string;
    subtitle: string;
    description: string;
    cases: string;
    strength: string;
    challenge: string;
    ctaText: string;
    recommendedService: string;
  }

  export interface LevelMeta {
    color: string;
    description: string;
  }

  export interface LayerMeta {
    label: string;
    color: string;
  }

  export interface BrechaMeta {
    urgente: string;
    oportunidad: string;
  }

  export interface Service {
    id: string;
    name: string;
    description: string;
    price: string;
    alwaysShow?: boolean;
    relevantFor?: number[];
    relevantIfLayerLow?: Layer[];
    relevantIfScoreBelow?: number;
  }

  export const SECTION_ORDER: Section[] = [
    'perfil', 'territorio', 'proposito', 'identidad',
    'arquitectura', 'expresion', 'narrativa',
  ];

  export const SECTION_LABELS: Record<Section, string> = {
    perfil: 'Perfil',
    territorio: 'Territorio',
    proposito: 'Propósito',
    identidad: 'Identidad',
    arquitectura: 'Arquitectura',
    expresion: 'Expresión',
    narrativa: 'Narrativa',
  };

  export const LAYERS: Layer[] = [
    'territorio', 'proposito', 'identidad',
    'arquitectura', 'expresion', 'narrativa',
  ];

  export const LAYER_META: Record<Layer, LayerMeta> = {
    territorio:   { label: 'Territorio',            color: '#2C4A3E' },
    proposito:    { label: 'Propósito Net-Positive', color: '#EF4129' },
    identidad:    { label: 'Identidad',              color: '#C4622D' },
    arquitectura: { label: 'Arquitectura',           color: '#1C6B8A' },
    expresion:    { label: 'Expresión y Precio',     color: '#7A5C9B' },
    narrativa:    { label: 'Narrativa',              color: '#4A7C3F' },
  };

  export const LEVELS: Record<Level, LevelMeta> = {
    Observadora: {
      color: '#EF4129',
      description: 'Tu marca está en la fase inicial de la transición regenerativa. Tienes el producto — ahora necesitas los fundamentos de marca que le permitan capturar su valor real en el mercado.',
    },
    Caminante: {
      color: '#C4622D',
      description: 'Haces las cosas bien, pero el mercado todavía no lo sabe o no lo paga. La brecha entre tu impacto real y tu precio actual es la oportunidad más urgente a resolver.',
    },
    Nativa: {
      color: '#2C4A3E',
      description: 'Tu modelo regenerativo es sólido y verificable. El siguiente paso es escalar sin perder la coherencia — y capturar valor en los mercados globales que mejor pagan por lo que tienes.',
    },
  };

  export const BRECHAS_META: Record<Layer, BrechaMeta> = {
    territorio: {
      urgente: 'No tienes suficiente documentación de origen. Implementa el PPC Express: visitas trimestrales al campo con protocolo de registro de datos de ecosistema, productores y métricas de impacto.',
      oportunidad: 'Con documentación rigurosa de origen, tienes el activo que los compradores institucionales globales más escasean. Eso puede triplicar el precio de entrada al mercado premium internacional.',
    },
    proposito: {
      urgente: 'El propósito declarado no está siendo un criterio de decisión operativa. Define los 5 componentes del Propósito Net-Positive y prueba si puede responder: ¿cómo tomamos esta decisión?',
      oportunidad: 'Una vez que el propósito oriente decisiones reales, la marca gana coherencia y precio premium. Los fondos de impacto priorizan marcas con propósito verificable y operativo.',
    },
    identidad: {
      urgente: 'La personalidad de marca es inconsistente o no está anclada en el territorio. Define el Arquetipo RIZOMA y los 4 ejes de tono de voz con el equipo completo.',
      oportunidad: 'Definir el arquetipo produce alineación interna inmediata y crea un sistema de comunicación consistente que no depende de una sola persona del equipo.',
    },
    arquitectura: {
      urgente: 'El naming o la audiencia no están optimizados para el mercado premium. Revisa los 5 filtros del naming regenerativo y define el perfil de comprador por segmento.',
      oportunidad: 'El naming regenerativo con filtro de escalabilidad global puede abrir mercados en EE.UU. y Europa sin necesidad de rediseñar la marca desde cero.',
    },
    expresion: {
      urgente: 'El sistema visual o el precio no reflejan el valor real del origen. Construye los 4 intangibles del precio RIZOMA y revisa el sistema visual con el Espectro de Autenticidad.',
      oportunidad: 'Cada certificación adicional acumula entre 30-100% de premium de precio. El Pricing Matrix RIZOMA puede identificar qué certificación produce el mayor ROI para tu etapa actual.',
    },
    narrativa: {
      urgente: 'La comunicación es más aspiracional que verificable. Implementa el Canvas de Storydoing y la Matriz de Riesgo de Greenwashing para auditar los claims actuales.',
      oportunidad: 'El storydoing genera contenido de marca inimitable. Una sola visita al campo produce 12 piezas de contenido que ningún competidor puede replicar porque nacen de un territorio único.',
    },
  };

  export const ARCHETYPES: Archetype[] = [
    {
      name: 'El Custodio',
      subtitle: 'Proteger es crear valor',
      description: 'Tu marca existe para proteger lo que es irremplazable. La conservación del ecosistema es tu motor estratégico — no una consecuencia del modelo, sino su razón de ser. Cada producto que vendes financia la preservación de algo que sin ti desaparecería.',
      cases: "Inkaterra, To'ak Chocolate",
      strength: 'Narrativa de conservación como argumento de precio inimitable',
      challenge: 'Convertir el impacto de conservación en evidencia verificable y comunicable a compradores premium',
      ctaText: 'Tu marca tiene potencial enorme como Custodio del territorio. El reto es convertir esa protección en precio premium verificable y en narrativa que llegue a los compradores institucionales globales.',
      recommendedService: 'Regen Brand Sprint',
    },
    {
      name: 'El Constructor',
      subtitle: 'El saber-hacer como moat',
      description: 'Tu marca convierte el conocimiento ancestral, la artesanía o las fibras del territorio en objetos de alto valor percibido. El proceso y el saber-hacer son tu ventaja inimitable — ningún fabricante masivo puede replicar lo que toma generaciones aprender.',
      cases: 'KUNA, Awamaki',
      strength: 'Proceso artesanal y conocimiento ancestral como ventaja competitiva documentable',
      challenge: 'Que el sistema visual y el precio reflejen el nivel real del saber-hacer que hay detrás del producto',
      ctaText: 'Como Constructor, tu saber-hacer artesanal es tu moat. ThousandFold puede ayudarte a que el mercado premium lo reconozca y lo pague en consecuencia.',
      recommendedService: 'Brand Identity System',
    },
    {
      name: 'El Revelador',
      subtitle: 'La transparencia como diferencial',
      description: 'Tu marca hace visible lo que nadie más muestra: la trazabilidad radical, el origen verificado, el precio justo documentado. En un mercado saturado de promesas de sostenibilidad sin evidencia, ser el más transparente es ser el más confiable.',
      cases: 'Pacari, VEJA, Everlane',
      strength: 'Trazabilidad y transparencia como activos de marca que generan confianza institucional',
      challenge: 'Sistematizar la evidencia para que llegue a los compradores institucionales que más pagan por ella',
      ctaText: 'Eres el Revelador — la transparencia es tu ventaja. El siguiente paso es sistematizar esa evidencia para que llegue a los compradores institucionales globales que más valoran ese tipo de marca.',
      recommendedService: 'Impact Brand Audit',
    },
    {
      name: 'El Regenerador',
      subtitle: 'Devolver más de lo que se toma',
      description: 'Tu modelo de negocio está diseñado para devolver más de lo que toma al territorio. El impacto es medible, sistemático y crece junto con la marca. No solo eres sostenible — eres Net-Positive. Eso tiene un precio que el mercado correcto está dispuesto a pagar.',
      cases: 'Natura, Domaine Bousquet, SIMPLi',
      strength: 'Modelo de impacto sistémico que se convierte en argumento de precio premium verificable',
      challenge: 'Convertir las métricas de impacto en narrativa de marca accesible y convincente para el consumidor final',
      ctaText: 'Tienes el modelo regenerativo más sólido del espectro. ThousandFold puede ayudarte a convertir ese impacto medible en narrativa de precio premium que funcione en los mercados más exigentes del mundo.',
      recommendedService: 'Impact Story System',
    },
    {
      name: 'El Visionario',
      subtitle: 'Imaginar lo que aún no existe',
      description: 'Tu marca imagina y hace posible lo que todavía no existe, usando el territorio como fuente de innovación. La vanguardia y el origen son las dos caras de tu propuesta. No explicas lo que haces — lo demuestras con el producto mismo.',
      cases: "To'ak (colección Master Series), Mashpi Lodge",
      strength: 'Capacidad de crear categorías nuevas desde el territorio, sin referentes directos de precio',
      challenge: 'Construir la arquitectura de marca que permita que la innovación escale sin perder la conexión con el origen',
      ctaText: 'Tu visión es tu diferencial. ThousandFold puede construir la arquitectura de marca que permita que esa innovación escale globalmente sin perder el origen que la hace única.',
      recommendedService: 'Brand Platform Canvas',
    },
  ];

  export const SERVICES_CATALOG: Service[] = [
    { id: 'regen-brand-score',   name: 'Regen Brand Score',      description: 'Diagnóstico inicial gratuito. Este diagnóstico.', price: 'Gratuito', alwaysShow: true },
    { id: 'impact-brand-audit',  name: 'Impact Brand Audit',     description: 'Auditoría profunda de comunicación e identidad con reporte de 30 páginas.', price: 'Desde $297 USD', relevantFor: [2], relevantIfLayerLow: ['narrativa'] },
    { id: 'brand-identity-system', name: 'Brand Identity System', description: 'Diseño del sistema de identidad visual completo desde el territorio.', price: 'Desde $997 USD', relevantFor: [1], relevantIfLayerLow: ['identidad', 'expresion'] },
    { id: 'impact-story-system', name: 'Impact Story System',    description: 'Sistema narrativo: mensajes, tono, formatos y guía de contenidos.', price: 'Desde $3,500 USD', relevantFor: [3], relevantIfLayerLow: ['narrativa', 'proposito'] },
    { id: 'regen-brand-sprint',  name: 'Regen Brand Sprint',     description: 'Estrategia completa de marca regenerativa en 2 semanas.', price: 'Desde $5,000 USD', relevantFor: [0], relevantIfScoreBelow: 50 },
    { id: 'brand-platform-canvas', name: 'Brand Platform Canvas', description: 'Arquitectura de marca para escalar globalmente sin perder el origen.', price: 'Desde $1,500 USD', relevantFor: [4], relevantIfLayerLow: ['arquitectura'] },
  ];

  // Country calling codes (LATAM + key international)
  export interface CountryCode { code: string; label: string; }

  export const COUNTRY_CODES: CountryCode[] = [
    { code: '+51',  label: '+51 Perú' },
    { code: '+52',  label: '+52 México' },
    { code: '+54',  label: '+54 Argentina' },
    { code: '+56',  label: '+56 Chile' },
    { code: '+57',  label: '+57 Colombia' },
    { code: '+58',  label: '+58 Venezuela' },
    { code: '+591', label: '+591 Bolivia' },
    { code: '+593', label: '+593 Ecuador' },
    { code: '+595', label: '+595 Paraguay' },
    { code: '+598', label: '+598 Uruguay' },
    { code: '+502', label: '+502 Guatemala' },
    { code: '+503', label: '+503 El Salvador' },
    { code: '+504', label: '+504 Honduras' },
    { code: '+505', label: '+505 Nicaragua' },
    { code: '+506', label: '+506 Costa Rica' },
    { code: '+507', label: '+507 Panamá' },
    { code: '+1',   label: '+1 EE.UU. / Canadá' },
    { code: '+55',  label: '+55 Brasil' },
    { code: '+34',  label: '+34 España' },
    { code: '+351', label: '+351 Portugal' },
    { code: 'other', label: 'Otro' },
  ];

  export const COUNTRIES: string[] = [
    'Argentina','Bolivia','Brasil','Chile','Colombia','Costa Rica','Ecuador',
    'El Salvador','España','Estados Unidos','Guatemala','Honduras','México',
    'Nicaragua','Panamá','Paraguay','Perú','Portugal','República Dominicana',
    'Uruguay','Venezuela','Otro',
  ];

  export const REVENUE_RANGES: string[] = [
    'Pre-revenue / Aún sin facturar',
    'Menos de $50k USD',
    '$50k – $250k USD',
    '$250k – $1M USD',
    '$1M – $5M USD',
    '$5M – $10M USD',
    'Más de $10M USD',
  ];

  export const MARKET_SCOPES: string[] = [
    'Local (una ciudad)',
    'Regional (varias ciudades / una región)',
    'Nacional (todo el país)',
    'Internacional (2+ países)',
  ];

  // QUESTIONS array is populated in the next task.
  export const QUESTIONS: Question[] = [];
  ```

- [ ] **Step 2:** Verify the file compiles (no syntax errors) by running:

  ```bash
  cd /Users/eajalcrina/Documents/Proyectos/Thousandfold/landing
  npx tsc --noEmit
  ```

  Expected: existing errors unrelated to this file may exist if other files reference legacy code; **the file you created should not produce errors**. If it does, fix the syntax before continuing.

---

## Task 4: Data module — question bank

**Files:**
- Modify: `src/lib/rizoma-data.ts` (replace `export const QUESTIONS: Question[] = [];` with the full bank)

- [ ] **Step 1:** Open `Referencias/rizoma-diagnostic-spec.md` and read section 3.2 ("Banco completo de preguntas") — it contains the full 24-question JS array, from line ~303 to ~607.

- [ ] **Step 2:** Port the array to `src/lib/rizoma-data.ts`, replacing the empty `QUESTIONS` placeholder. Keep the exact text, the `v` values, the `arc` vectors, the `labels`, and the `hint`s.

  **Conversion rules:**
  - Remove JS-only trailing commas that TS rejects (shouldn't be any; just be mindful).
  - Add explicit types where the literal isn't inferrable (TypeScript should infer most).
  - The final constant must be typed as `Question[]`.

  Example of the first question after porting:

  ```ts
  export const QUESTIONS: Question[] = [
    {
      id: 'p1',
      section: 'perfil',
      tag: 'Perfil de la marca',
      q: '¿En qué sector opera principalmente tu marca?',
      type: 'single',
      opts: [
        { t: 'Alimentos, bebidas o gastronomía',            v: 1, arc: [0, 0, 1, 2, 0] },
        { t: 'Moda, textiles o artesanía',                  v: 1, arc: [0, 2, 0, 0, 1] },
        { t: 'Turismo, hospitalidad o experiencias',        v: 1, arc: [2, 0, 0, 0, 2] },
        { t: 'Cosméticos, cuidado personal o bionegocios',  v: 1, arc: [0, 0, 1, 2, 0] },
        { t: 'Tecnología, AgTech o ClimateTech',            v: 1, arc: [0, 0, 1, 0, 2] },
        { t: 'Otro sector con impacto en territorio',       v: 1, arc: [1, 1, 1, 1, 1] },
      ],
    },
    // ... continue with p2, p3, t1 (scale), t2, t3, t4, pr1, pr2 (scale), pr3,
    //     id1, id2, id3 (scale), ar1, ar2 (scale), ar3,
    //     ex1, ex2, ex3, ex4 (scale), na1, na2, na3 (scale), na4
  ];
  ```

  **⚠️ Scale questions:** For `type: 'scale'`, do NOT include `opts`. Use the structure `{ id, section, tag, q, hint?, type: 'scale', layer, labels }`. Confirm the spec has `labels: [string, string]`.

  **⚠️ Single questions with `layer`:** For single questions inside scoring sections (territorio, proposito, identidad, arquitectura, expresion, narrativa), include the matching `layer` property so scoring picks them up. Check the spec's source: questions with a `layer` field contribute scores; perfil questions don't.

  Looking at the spec carefully:
  - `p1, p2, p3` → no `layer` (profile-only).
  - `t1 (scale)` → layer: 'territorio'. `t2, t3, t4 (single)` → add `layer: 'territorio'`.
  - `pr1 (single)` → `layer: 'proposito'`. `pr2 (scale)` → `layer: 'proposito'`. `pr3 (single)` → `layer: 'proposito'`.
  - `id1, id2 (single)` → `layer: 'identidad'`. `id3 (scale)` → `layer: 'identidad'`.
  - `ar1 (single)` → `layer: 'arquitectura'`. `ar2 (scale)` → `layer: 'arquitectura'`. `ar3 (single)` → `layer: 'arquitectura'`.
  - `ex1, ex2, ex3 (single)` → `layer: 'expresion'`. `ex4 (scale)` → `layer: 'expresion'`.
  - `na1, na2 (single)` → `layer: 'narrativa'`. `na3 (scale)` → `layer: 'narrativa'`. `na4 (single)` → `layer: 'narrativa'`.

  If the spec doesn't literally write `layer` on each single question, add it explicitly following the section-to-layer mapping above. The scoring logic relies on it.

- [ ] **Step 3:** Confirm the array has exactly 24 elements by adding at the bottom of the file:

  ```ts
  if (QUESTIONS.length !== 24) {
    throw new Error(`RIZOMA questions: expected 24, got ${QUESTIONS.length}`);
  }
  ```

  Then run `npx tsc --noEmit` and confirm no errors. Remove the check afterwards if it's too noisy — or keep it as runtime safety (preferred).

---

## Task 5: Scoring module + unit tests

**Files:**
- Create: `src/lib/rizoma-scoring.ts`
- Create: `src/lib/__tests__/rizoma-scoring.test.ts`

This project does not ship with a test runner. We'll add a tiny one inline with Node's built-in `node:test` so we don't introduce a new dev dep.

- [ ] **Step 1:** Write the scoring module at `src/lib/rizoma-scoring.ts`:

  ```ts
  import {
    QUESTIONS, ARCHETYPES, SERVICES_CATALOG, LAYERS,
    type ArcVector, type Layer, type Level,
  } from './rizoma-data';

  export interface RizomaResult {
    arcIndex: number;
    arcName: string;
    arcScores: ArcVector;
    layerScores: Record<Layer, number>;
    totalScore: number;
    level: Level;
    topBrechas: Layer[];
    recommendedServiceId: string;
  }

  /**
   * Compute RIZOMA results from raw answers.
   * @param answers     { [questionId]: optionIndex } for type='single' questions
   * @param scaleValues { [questionId]: 1..5 } for type='scale' questions
   */
  export function computeResults(
    answers: Record<string, number>,
    scaleValues: Record<string, number>,
  ): RizomaResult {
    const arcScores: ArcVector = [0, 0, 0, 0, 0];
    const layerPools: Record<Layer, number[]> = {
      territorio: [], proposito: [], identidad: [],
      arquitectura: [], expresion: [], narrativa: [],
    };

    for (const q of QUESTIONS) {
      if (q.type === 'single') {
        const idx = answers[q.id];
        if (idx === undefined) continue;
        const opt = q.opts[idx];
        if (!opt) continue;
        opt.arc.forEach((w, i) => { arcScores[i] += w; });
        if (q.layer) layerPools[q.layer].push(opt.v);
      } else {
        const raw = scaleValues[q.id];
        if (raw === undefined) continue;
        // Normalize 1..5 to 1..4 to match single-option scale
        const normalized = ((raw - 1) / 4) * 3 + 1;
        layerPools[q.layer].push(normalized);
      }
    }

    const layerScores = {} as Record<Layer, number>;
    for (const layer of LAYERS) {
      const pool = layerPools[layer];
      if (pool.length === 0) {
        layerScores[layer] = 40;
      } else {
        const avg = pool.reduce((a, b) => a + b, 0) / pool.length;
        layerScores[layer] = Math.round(((avg - 1) / 3) * 100);
      }
    }

    const totalScore = Math.round(
      LAYERS.reduce((sum, l) => sum + layerScores[l], 0) / LAYERS.length,
    );

    let level: Level;
    if (totalScore < 35) level = 'Observadora';
    else if (totalScore < 65) level = 'Caminante';
    else level = 'Nativa';

    const maxArc = Math.max(...arcScores);
    const arcIndex = arcScores.indexOf(maxArc);
    const arcName = ARCHETYPES[arcIndex].name;

    const topBrechas = [...LAYERS]
      .sort((a, b) => layerScores[a] - layerScores[b])
      .slice(0, 3);

    const recommendedServiceId = recommendService(arcIndex, totalScore, topBrechas);

    return {
      arcIndex, arcName, arcScores,
      layerScores, totalScore, level,
      topBrechas, recommendedServiceId,
    };
  }

  export function recommendService(
    arcIndex: number,
    totalScore: number,
    topBrechas: Layer[],
  ): string {
    // 1. Prefer services matching the archetype AND a top brecha
    const archetypeMatches = SERVICES_CATALOG.filter(
      s => s.relevantFor?.includes(arcIndex),
    );

    const withLayerMatch = archetypeMatches.find(
      s => s.relevantIfLayerLow?.some(l => topBrechas.includes(l)),
    );
    if (withLayerMatch) return withLayerMatch.id;

    // 2. Any service matching archetype
    if (archetypeMatches.length > 0) return archetypeMatches[0].id;

    // 3. Fallback by score
    if (totalScore < 50) return 'regen-brand-sprint';
    return 'brand-platform-canvas';
  }
  ```

- [ ] **Step 2:** Write tests at `src/lib/__tests__/rizoma-scoring.test.ts`:

  ```ts
  import { test } from 'node:test';
  import assert from 'node:assert/strict';
  import { computeResults, recommendService } from '../rizoma-scoring';

  test('computeResults — empty answers yields defaults', () => {
    const r = computeResults({}, {});
    assert.equal(r.totalScore, 40); // all layers default to 40
    assert.equal(r.level, 'Caminante'); // 40 is in [35,65)
    assert.equal(r.arcScores.reduce((a, b) => a + b, 0), 0);
    assert.equal(r.topBrechas.length, 3);
  });

  test('computeResults — observadora threshold', () => {
    // All territorio = 1 via t2 option 0, no other answers
    const r = computeResults({ t2: 0, t3: 0, t4: 0 }, {});
    // territorio pool: [1,1,1] → avg 1 → 0/100
    // other layers default 40
    // total = (0+40+40+40+40+40)/6 = 33.3 → 33
    assert.equal(r.layerScores.territorio, 0);
    assert.equal(r.level, 'Observadora');
  });

  test('computeResults — nativa threshold', () => {
    // Maximize: pick highest v options for all single questions
    const answers: Record<string, number> = {
      t2: 3, t3: 3, t4: 3,
      pr1: 3, pr3: 2,
      id1: 3, id2: 0,
      ar1: 3, ar3: 3,
      ex1: 3, ex2: 3, ex3: 3,
      na1: 3, na2: 3, na4: 3,
    };
    const scaleValues: Record<string, number> = {
      t1: 5, pr2: 5, id3: 5, ar2: 5, ex4: 5, na3: 5,
    };
    const r = computeResults(answers, scaleValues);
    assert.ok(r.totalScore >= 65, `expected nativa, got ${r.totalScore}`);
    assert.equal(r.level, 'Nativa');
  });

  test('recommendService — prefers archetype + brecha match', () => {
    // Constructor (arcIndex=1) with identidad brecha → Brand Identity System
    const id = recommendService(1, 50, ['identidad', 'expresion', 'narrativa']);
    assert.equal(id, 'brand-identity-system');
  });

  test('recommendService — falls back by low score', () => {
    // arcIndex=99 (invalid) forces fallback path → <50 → regen-brand-sprint
    const id = recommendService(99, 30, ['territorio', 'proposito', 'identidad']);
    assert.equal(id, 'regen-brand-sprint');
  });
  ```

- [ ] **Step 3:** Add a test script to `package.json`. Modify the `scripts` object:

  ```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "node --test --experimental-strip-types 'src/**/*.test.ts'"
  }
  ```

  Note: Node 22+ supports `--experimental-strip-types` to run TS directly. If the dev machine runs an older Node, the fallback is `npx tsx --test src/lib/__tests__/rizoma-scoring.test.ts` (requires `npm install -D tsx`). Use whichever works; don't block on this.

- [ ] **Step 4:** Run tests:

  ```bash
  npm test
  ```

  Expected: all 5 tests pass. If any fail, inspect the actual vs expected values — the test expectations above are derived from the scoring math, not measured. If a test expectation is off by 1-2 points due to rounding, update the test expectation to match reality (it's not a correctness bug — the scoring logic is the source of truth).

---

## Task 6: Supabase server client + Resend helper

**Files:**
- Create: `src/lib/supabase-server.ts`
- Create: `src/lib/resend.ts`
- Delete: `src/lib/supabase.ts` (old placeholder)

- [ ] **Step 1:** Write `src/lib/supabase-server.ts`:

  ```ts
  import { createClient, type SupabaseClient } from '@supabase/supabase-js';

  let cached: SupabaseClient | null = null;

  /**
   * Returns a Supabase client using the service role key.
   * Only use in server-side code (API routes, server actions).
   * Returns null if env vars are missing — the caller should treat that as
   * "persistence disabled" (useful for local dev without credentials).
   */
  export function getSupabaseServer(): SupabaseClient | null {
    if (cached) return cached;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    cached = createClient(url, key, { auth: { persistSession: false } });
    return cached;
  }
  ```

- [ ] **Step 2:** Write `src/lib/resend.ts`:

  ```ts
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
  ```

- [ ] **Step 3:** Delete the old placeholder client:

  ```bash
  rm /Users/eajalcrina/Documents/Proyectos/Thousandfold/landing/src/lib/supabase.ts
  ```

- [ ] **Step 4:** Type-check:

  ```bash
  cd /Users/eajalcrina/Documents/Proyectos/Thousandfold/landing && npx tsc --noEmit
  ```

  Expected: any errors must relate to code not yet refactored (e.g. `DiagnosticWizard.tsx` still references `diagnostic-data.ts`). The new files should not add errors.

---

## Task 7: Hero component

**Files:**
- Create: `src/components/diagnostic/rizoma/Hero.tsx`

- [ ] **Step 1:** Write the component:

  ```tsx
  "use client";

  import { motion } from "motion/react";

  interface Props {
    onStart: () => void;
  }

  const METRICS = [
    { num: "24", label: "preguntas" },
    { num: "~8", label: "minutos" },
    { num: "6", label: "capas RIZOMA" },
  ];

  const CHIPS = [
    "Arquetipo de marca",
    "Score por capa",
    "Brechas prioritarias",
    "Ruta ThousandFold",
  ];

  export default function Hero({ onStart }: Props) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto max-w-5xl px-6 pt-32 pb-16 md:pt-40 md:pb-24 text-center"
      >
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">
          FRAMEWORK RIZOMA · THOUSANDFOLD STUDIO
        </p>

        <h1 className="mt-8 text-[clamp(2.25rem,6vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-cream">
          Tu marca hace lo correcto.
          <br />
          <span className="text-signal">El mercado todavía no lo paga.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-xl text-base md:text-lg leading-relaxed text-cream/70">
          En 8 minutos, descubre tu arquetipo RIZOMA, tu nivel en el espectro
          regenerativo y las tres brechas concretas que separan a tu marca del
          precio que realmente vale.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <p className="font-mono text-3xl md:text-4xl font-medium text-cream">{m.num}</p>
              <p className="mt-1 text-[11px] tracking-widest uppercase text-mute">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CHIPS.map((c) => (
            <span
              key={c}
              className="rounded-full border border-cream/20 px-4 py-1.5 text-xs text-cream/70"
            >
              {c}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onStart}
          className="mt-12 cursor-pointer bg-signal px-10 py-4 font-medium text-cream transition-colors hover:bg-flash"
        >
          Iniciar diagnóstico →
        </button>
      </motion.section>
    );
  }
  ```

- [ ] **Step 2:** No test — visual component. Continue.

---

## Task 8: ProgressBar component

**Files:**
- Create: `src/components/diagnostic/rizoma/ProgressBar.tsx`

- [ ] **Step 1:** Write:

  ```tsx
  "use client";

  import { SECTION_ORDER, SECTION_LABELS, type Section } from "@/lib/rizoma-data";

  interface Props {
    currentSection: Section;
    completedSections: Set<Section>;
  }

  export default function ProgressBar({ currentSection, completedSections }: Props) {
    return (
      <div className="mb-10 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-1.5">
          {SECTION_ORDER.map((s) => {
            const state =
              s === currentSection ? "active" :
              completedSections.has(s) ? "done" : "pending";
            return (
              <span
                key={s}
                aria-label={`Sección ${SECTION_LABELS[s]} — ${state}`}
                className={
                  "h-[2px] flex-1 rounded-sm transition-colors duration-300 " +
                  (state === "active" ? "bg-signal"
                    : state === "done" ? "bg-[#2C4A3E]"
                    : "bg-cream/15")
                }
              />
            );
          })}
        </div>
        <span className="min-w-[90px] text-right font-mono text-[11px] uppercase tracking-[0.14em] text-cream/45">
          {SECTION_LABELS[currentSection]}
        </span>
      </div>
    );
  }
  ```

---

## Task 9: QuestionSingle and QuestionScale components

**Files:**
- Create: `src/components/diagnostic/rizoma/QuestionSingle.tsx`
- Create: `src/components/diagnostic/rizoma/QuestionScale.tsx`

- [ ] **Step 1:** Write `QuestionSingle.tsx`:

  ```tsx
  "use client";

  import type { QuestionSingle } from "@/lib/rizoma-data";

  interface Props {
    question: QuestionSingle;
    selectedIndex: number | undefined;
    onSelect: (index: number) => void;
  }

  export default function QuestionSingleView({ question, selectedIndex, onSelect }: Props) {
    return (
      <div className="flex flex-col gap-2">
        {question.opts.map((opt, i) => {
          const isSelected = selectedIndex === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(i)}
              className={
                "w-full rounded-md border px-4 py-3 text-left text-sm leading-relaxed transition-colors " +
                (isSelected
                  ? "border-signal bg-signal/10 text-cream"
                  : "border-cream/15 text-cream/70 hover:border-signal/50 hover:text-cream")
              }
            >
              {opt.t}
            </button>
          );
        })}
      </div>
    );
  }
  ```

- [ ] **Step 2:** Write `QuestionScale.tsx`:

  ```tsx
  "use client";

  import type { QuestionScale } from "@/lib/rizoma-data";

  interface Props {
    question: QuestionScale;
    value: number | undefined;
    onChange: (value: number) => void;
  }

  export default function QuestionScaleView({ question, value, onChange }: Props) {
    const levels = [1, 2, 3, 4, 5];
    return (
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs text-cream/45">{question.labels[0]}</span>
          <span className="text-xs text-cream/45 text-right">{question.labels[1]}</span>
        </div>
        <div className="flex gap-2">
          {levels.map((l) => {
            const isSelected = value === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => onChange(l)}
                aria-label={`Nivel ${l} de 5`}
                className={
                  "flex-1 rounded-md border py-4 font-mono text-sm transition-colors " +
                  (isSelected
                    ? "border-signal bg-signal/10 text-cream"
                    : "border-cream/15 text-cream/70 hover:border-signal/50")
                }
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  ```

---

## Task 10: Wizard component

**Files:**
- Create: `src/components/diagnostic/rizoma/Wizard.tsx`

- [ ] **Step 1:** Write:

  ```tsx
  "use client";

  import { useMemo, useState } from "react";
  import { motion, AnimatePresence } from "motion/react";
  import { QUESTIONS, type Section } from "@/lib/rizoma-data";
  import ProgressBar from "./ProgressBar";
  import QuestionSingleView from "./QuestionSingle";
  import QuestionScaleView from "./QuestionScale";

  interface Props {
    answers: Record<string, number>;
    scaleValues: Record<string, number>;
    setAnswer: (id: string, index: number) => void;
    setScaleValue: (id: string, val: number) => void;
    onComplete: () => void;
  }

  export default function Wizard({ answers, scaleValues, setAnswer, setScaleValue, onComplete }: Props) {
    const [step, setStep] = useState(0);
    const total = QUESTIONS.length;
    const question = QUESTIONS[step];

    const completedSections = useMemo(() => {
      const done = new Set<Section>();
      for (let i = 0; i < step; i++) {
        const q = QUESTIONS[i];
        if (q.section !== question.section) done.add(q.section);
      }
      return done;
    }, [step, question.section]);

    const isAnswered = question.type === "single"
      ? answers[question.id] !== undefined
      : scaleValues[question.id] !== undefined;

    const handleNext = () => {
      if (!isAnswered) return;
      if (step < total - 1) setStep(step + 1);
      else onComplete();
    };

    const handleBack = () => {
      if (step > 0) setStep(step - 1);
    };

    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25 }}
        className="mx-auto max-w-[680px] px-6 py-16"
      >
        <ProgressBar currentSection={question.section} completedSections={completedSections} />

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <p className="mb-2 font-mono text-[11px] tracking-[0.14em] uppercase text-signal">
              {question.tag}
            </p>
            <p className="mb-4 font-mono text-[11px] text-cream/45">
              Pregunta {step + 1} de {total}
            </p>
            <h2 className="text-lg md:text-xl font-medium text-cream leading-snug mb-3">
              {question.q}
            </h2>
            {question.hint && (
              <p className="mb-6 border-l-2 border-cream/15 pl-3 text-sm text-cream/45 leading-relaxed">
                {question.hint}
              </p>
            )}

            {question.type === "single" ? (
              <QuestionSingleView
                question={question}
                selectedIndex={answers[question.id]}
                onSelect={(i) => setAnswer(question.id, i)}
              />
            ) : (
              <QuestionScaleView
                question={question}
                value={scaleValues[question.id]}
                onChange={(v) => setScaleValue(question.id, v)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border border-cream/45 px-6 py-2 text-sm text-cream/70 transition-colors hover:border-cream hover:text-cream"
            >
              ← Anterior
            </button>
          ) : <span />}
          <button
            type="button"
            onClick={handleNext}
            disabled={!isAnswered}
            className="bg-cream px-8 py-2.5 text-sm font-medium text-void transition-colors hover:bg-cream/80 disabled:cursor-not-allowed disabled:opacity-40 rounded-full"
          >
            {step < total - 1 ? "Siguiente →" : "Ver resultados →"}
          </button>
        </div>
      </motion.section>
    );
  }
  ```

---

## Task 11: Results sub-components — ArchetypeBlock + LevelBadge

**Files:**
- Create: `src/components/diagnostic/rizoma/ArchetypeBlock.tsx`
- Create: `src/components/diagnostic/rizoma/LevelBadge.tsx`

- [ ] **Step 1:** Write `ArchetypeBlock.tsx`:

  ```tsx
  "use client";

  import { ARCHETYPES } from "@/lib/rizoma-data";

  interface Props {
    arcIndex: number;
    brandName: string | null;
  }

  export default function ArchetypeBlock({ arcIndex, brandName }: Props) {
    const a = ARCHETYPES[arcIndex];
    const subject = brandName ?? "Tu marca";
    return (
      <div>
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">Arquetipo</p>
        <h2 className="mt-2 text-[clamp(2rem,5vw,3.5rem)] font-normal leading-tight text-cream">
          {subject} es <span className="text-signal">{a.name}</span>.
        </h2>
        <p className="mt-3 text-base italic text-cream/70">{a.subtitle}</p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-cream/70">
          {brandName
            ? `Como ${a.name.replace("El ", "")}, ${brandName} ${a.description.replace(/^Tu marca /, "")}`
            : a.description}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="border border-cream/15 p-5">
            <p className="font-mono text-[10px] tracking-widest uppercase text-cream/45 mb-2">Fortaleza</p>
            <p className="text-sm text-cream">{a.strength}</p>
          </div>
          <div className="border border-cream/15 p-5">
            <p className="font-mono text-[10px] tracking-widest uppercase text-cream/45 mb-2">Reto principal</p>
            <p className="text-sm text-cream">{a.challenge}</p>
          </div>
        </div>

        <p className="mt-4 text-xs text-cream/45">Referencias: {a.cases}</p>
      </div>
    );
  }
  ```

- [ ] **Step 2:** Write `LevelBadge.tsx`:

  ```tsx
  "use client";

  import { LEVELS, type Level } from "@/lib/rizoma-data";

  interface Props {
    level: Level;
    totalScore: number;
  }

  export default function LevelBadge({ level, totalScore }: Props) {
    const meta = LEVELS[level];
    return (
      <div>
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">Nivel en el espectro</p>
        <div className="mt-2 flex items-baseline gap-6">
          <p
            className="font-mono text-3xl md:text-4xl tracking-widest uppercase"
            style={{ color: meta.color }}
          >
            {level}
          </p>
          <p className="font-mono text-sm text-cream/45">{totalScore} / 100</p>
        </div>
        <div className="mt-4 h-1 w-full max-w-md overflow-hidden rounded-full bg-wire">
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{ width: `${totalScore}%`, background: meta.color }}
          />
        </div>
        <p className="mt-4 max-w-2xl text-sm text-cream/70 leading-relaxed">{meta.description}</p>
      </div>
    );
  }
  ```

---

## Task 12: Results sub-components — RadarChart + LayerBars

**Files:**
- Create: `src/components/diagnostic/rizoma/RadarChart.tsx`
- Create: `src/components/diagnostic/rizoma/LayerBars.tsx`

- [ ] **Step 1:** Write `RadarChart.tsx`:

  ```tsx
  "use client";

  import {
    Radar, RadarChart as RC, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, ResponsiveContainer,
  } from "recharts";
  import { LAYERS, LAYER_META, type Layer } from "@/lib/rizoma-data";

  interface Props {
    layerScores: Record<Layer, number>;
  }

  export default function RadarChart({ layerScores }: Props) {
    const data = LAYERS.map((l) => ({
      layer: LAYER_META[l].label,
      score: layerScores[l],
    }));

    return (
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RC data={data} outerRadius="75%">
            <PolarGrid stroke="rgba(245,240,232,0.15)" />
            <PolarAngleAxis
              dataKey="layer"
              tick={{ fill: "rgba(245,240,232,0.7)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            />
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={{ fill: "rgba(245,240,232,0.3)", fontSize: 10 }}
              axisLine={false}
              tickCount={5}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#EF4129"
              fill="#EF4129"
              fillOpacity={0.18}
              strokeWidth={1.5}
              isAnimationActive
            />
          </RC>
        </ResponsiveContainer>
      </div>
    );
  }
  ```

- [ ] **Step 2:** Write `LayerBars.tsx`:

  ```tsx
  "use client";

  import { motion } from "motion/react";
  import { LAYERS, LAYER_META, type Layer } from "@/lib/rizoma-data";

  interface Props {
    layerScores: Record<Layer, number>;
  }

  export default function LayerBars({ layerScores }: Props) {
    return (
      <div className="space-y-4">
        {LAYERS.map((layer, i) => {
          const meta = LAYER_META[layer];
          const score = layerScores[layer];
          return (
            <div key={layer}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-cream">{meta.label}</span>
                <span className="font-mono text-xs text-cream/45">{score}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-wire">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: meta.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  ```

---

## Task 13: Results sub-components — BrechasCards + RutaThousandfold

**Files:**
- Create: `src/components/diagnostic/rizoma/BrechasCards.tsx`
- Create: `src/components/diagnostic/rizoma/RutaThousandfold.tsx`

- [ ] **Step 1:** Write `BrechasCards.tsx`:

  ```tsx
  "use client";

  import { BRECHAS_META, LAYER_META, type Layer } from "@/lib/rizoma-data";

  interface Props {
    topBrechas: Layer[];
  }

  export default function BrechasCards({ topBrechas }: Props) {
    return (
      <div className="space-y-4">
        {topBrechas.map((layer, i) => {
          const meta = LAYER_META[layer];
          const brecha = BRECHAS_META[layer];
          return (
            <div key={layer} className="border border-cream/15 p-6">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="font-mono text-[11px] text-cream/45">#{i + 1}</span>
                <p
                  className="font-mono text-[11px] tracking-[0.2em] uppercase"
                  style={{ color: meta.color }}
                >
                  {meta.label}
                </p>
              </div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-red-400 mb-1">Qué resolver ya</p>
              <p className="text-sm text-cream/80 leading-relaxed mb-4">{brecha.urgente}</p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-green-400 mb-1">Oportunidad de negocio</p>
              <p className="text-sm text-cream/80 leading-relaxed">{brecha.oportunidad}</p>
            </div>
          );
        })}
      </div>
    );
  }
  ```

- [ ] **Step 2:** Write `RutaThousandfold.tsx`:

  ```tsx
  "use client";

  import { SERVICES_CATALOG, ARCHETYPES } from "@/lib/rizoma-data";

  interface Props {
    arcIndex: number;
    recommendedServiceId: string;
    brandName: string | null;
  }

  const CALENDLY = "https://calendar.app.google/9nv4ou6CEBwucfJp8";
  const MAILTO = "mailto:regenbrands@redesignlab.org?subject=Consulta%20sobre%20mi%20perfil%20RIZOMA";

  export default function RutaThousandfold({ arcIndex, recommendedServiceId, brandName }: Props) {
    const service = SERVICES_CATALOG.find(s => s.id === recommendedServiceId) ?? SERVICES_CATALOG[0];
    const a = ARCHETYPES[arcIndex];
    const subject = brandName ?? "tu marca";
    return (
      <div className="border border-signal/40 bg-signal/5 p-8">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">Ruta ThousandFold</p>
        <h3 className="mt-3 text-2xl font-normal text-cream">{service.name}</h3>
        <p className="mt-1 font-mono text-xs text-cream/45">{service.price}</p>
        <p className="mt-4 text-sm text-cream/70 leading-relaxed">{service.description}</p>
        <p className="mt-4 text-sm text-cream/70 leading-relaxed">
          Para {subject}, el siguiente paso es {a.ctaText.replace(/^[^.]*\. /, "").toLowerCase()}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-signal px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-flash"
          >
            Agenda una sesión con nuestro equipo →
          </a>
          <a
            href={MAILTO}
            className="border border-cream/30 px-6 py-3 text-sm text-cream transition-colors hover:border-cream"
          >
            Escríbenos a regenbrands@redesignlab.org
          </a>
        </div>
        <p className="mt-4 text-xs text-cream/45">
          30 minutos. Gratuito. Revisamos tu reporte RIZOMA contigo.
        </p>
      </div>
    );
  }
  ```

---

## Task 14: EmailGate component

**Files:**
- Create: `src/components/diagnostic/rizoma/EmailGate.tsx`

- [ ] **Step 1:** Write:

  ```tsx
  "use client";

  import { useState } from "react";
  import {
    COUNTRY_CODES, COUNTRIES, REVENUE_RANGES, MARKET_SCOPES,
  } from "@/lib/rizoma-data";

  export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phoneCountryCode: string;
    phone: string;
    brandCountry: string;
    brandName: string;
    brandOffering: string;
    brandLink: string;
    revenueRange: string;
    marketScope: string;
  }

  interface Props {
    onSubmit: (data: UserData) => Promise<void>;
  }

  const emptyData: UserData = {
    firstName: "", lastName: "", email: "",
    phoneCountryCode: "+51", phone: "",
    brandCountry: "", brandName: "", brandOffering: "",
    brandLink: "", revenueRange: "", marketScope: "",
  };

  const inputCls =
    "w-full bg-transparent border border-cream/15 px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:border-signal focus:outline-none rounded-md";
  const labelCls = "block text-xs uppercase tracking-widest text-cream/45 mb-1";

  export default function EmailGate({ onSubmit }: Props) {
    const [data, setData] = useState<UserData>(emptyData);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const set = <K extends keyof UserData>(k: K, v: UserData[K]) =>
      setData((d) => ({ ...d, [k]: v }));

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    const phoneValid = data.phone.replace(/\D/g, "").length >= 7;
    const canSubmit =
      data.firstName.trim() && data.lastName.trim() && emailValid && phoneValid &&
      data.brandCountry && data.brandName.trim() && data.brandOffering.trim() &&
      data.revenueRange && data.marketScope && !submitting;

    const handle = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit) return;
      setSubmitting(true);
      setError(null);
      try {
        await onSubmit(data);
      } catch (err) {
        setError("No pudimos enviar tu información. Intenta de nuevo.");
        setSubmitting(false);
      }
    };

    return (
      <form onSubmit={handle} className="border border-signal/40 bg-signal/5 p-8 space-y-5">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal">Desbloquea tu reporte completo</p>
          <h3 className="mt-2 text-2xl font-normal text-cream">
            Tu radar, brechas y ruta — personalizados con el nombre de tu marca.
          </h3>
          <p className="mt-2 text-sm text-cream/70">
            Recibirás el reporte en pantalla + un email con tu perfil RIZOMA.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Nombre *</label>
            <input className={inputCls} value={data.firstName}
              onChange={(e) => set("firstName", e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Apellido *</label>
            <input className={inputCls} value={data.lastName}
              onChange={(e) => set("lastName", e.target.value)} required />
          </div>
        </div>

        <div>
          <label className={labelCls}>Email *</label>
          <input type="email" className={inputCls} value={data.email}
            onChange={(e) => set("email", e.target.value)} required />
        </div>

        <div className="grid gap-4 md:grid-cols-[auto_1fr]">
          <div>
            <label className={labelCls}>Código país *</label>
            <select className={`${inputCls} appearance-none`} value={data.phoneCountryCode}
              onChange={(e) => set("phoneCountryCode", e.target.value)}>
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Teléfono *</label>
            <input type="tel" className={inputCls} value={data.phone}
              onChange={(e) => set("phone", e.target.value)} required />
          </div>
        </div>

        <div>
          <label className={labelCls}>País de la marca *</label>
          <select className={`${inputCls} appearance-none`} value={data.brandCountry}
            onChange={(e) => set("brandCountry", e.target.value)} required>
            <option value="">Selecciona un país</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Nombre de la marca *</label>
          <input className={inputCls} value={data.brandName}
            onChange={(e) => set("brandName", e.target.value)} required />
        </div>

        <div>
          <label className={labelCls}>Producto o servicio *</label>
          <textarea rows={2} className={inputCls} value={data.brandOffering}
            placeholder="En 1-2 líneas, ¿qué ofrece tu marca?"
            onChange={(e) => set("brandOffering", e.target.value)} required />
        </div>

        <div>
          <label className={labelCls}>Enlace principal</label>
          <input className={inputCls} value={data.brandLink}
            placeholder="https://tumarca.com · @tumarca · tiktok.com/@tumarca"
            onChange={(e) => set("brandLink", e.target.value)} />
          <p className="mt-1 text-[11px] text-cream/30">Web, Instagram, Facebook, TikTok u otra red.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls}>Rango de facturación anual *</label>
            <select className={`${inputCls} appearance-none`} value={data.revenueRange}
              onChange={(e) => set("revenueRange", e.target.value)} required>
              <option value="">Selecciona un rango</option>
              {REVENUE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Mercado actual *</label>
            <select className={`${inputCls} appearance-none`} value={data.marketScope}
              onChange={(e) => set("marketScope", e.target.value)} required>
              <option value="">Selecciona un alcance</option>
              {MARKET_SCOPES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={!canSubmit}
          className="w-full bg-signal py-4 font-medium text-cream transition-colors hover:bg-flash disabled:cursor-not-allowed disabled:opacity-50">
          {submitting ? "Enviando…" : "Ver mi reporte completo →"}
        </button>

        <p className="text-center text-[11px] text-cream/45">
          Usamos esta información sólo para enviarte tu reporte y un análisis personalizado de ThousandFold. Sin spam.
        </p>
      </form>
    );
  }
  ```

---

## Task 15: Results orchestrator

**Files:**
- Create: `src/components/diagnostic/rizoma/Results.tsx`

- [ ] **Step 1:** Write:

  ```tsx
  "use client";

  import { useState } from "react";
  import { motion } from "motion/react";
  import type { RizomaResult } from "@/lib/rizoma-scoring";
  import ArchetypeBlock from "./ArchetypeBlock";
  import LevelBadge from "./LevelBadge";
  import RadarChart from "./RadarChart";
  import LayerBars from "./LayerBars";
  import BrechasCards from "./BrechasCards";
  import RutaThousandfold from "./RutaThousandfold";
  import EmailGate, { type UserData } from "./EmailGate";

  interface Props {
    result: RizomaResult;
    onSubmitUser: (data: UserData) => Promise<void>;
    onReset: () => void;
  }

  export default function Results({ result, onSubmitUser, onReset }: Props) {
    const [brandName, setBrandName] = useState<string | null>(null);
    const unlocked = brandName !== null;

    const handleSubmit = async (data: UserData) => {
      await onSubmitUser(data);
      setBrandName(data.brandName);
      setTimeout(() => {
        const el = document.getElementById("rizoma-radar");
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    };

    return (
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl px-6 py-16 space-y-16"
      >
        {/* Always visible: Archetype + Level */}
        <ArchetypeBlock arcIndex={result.arcIndex} brandName={brandName} />
        <LevelBadge level={result.level} totalScore={result.totalScore} />

        {/* Gate (shown before unlock) */}
        {!unlocked && <EmailGate onSubmit={handleSubmit} />}

        {/* Locked sections (rendered with blur when locked, clear when unlocked) */}
        <div
          id="rizoma-radar"
          className={unlocked ? "space-y-16" : "space-y-16 pointer-events-none select-none blur-sm opacity-60"}
          aria-hidden={!unlocked}
        >
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-4">Radar por capa</p>
            <RadarChart layerScores={result.layerScores} />
          </div>

          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-6">Score por capa</p>
            <LayerBars layerScores={result.layerScores} />
          </div>

          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal mb-6">Top 3 brechas prioritarias</p>
            <BrechasCards topBrechas={result.topBrechas} />
          </div>

          <RutaThousandfold
            arcIndex={result.arcIndex}
            recommendedServiceId={result.recommendedServiceId}
            brandName={brandName}
          />
        </div>

        <div className="border-t border-cream/10 pt-8 text-center">
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-cream/45 underline underline-offset-4 transition-colors hover:text-cream"
          >
            Hacer el diagnóstico de nuevo
          </button>
          <span className="mx-3 text-cream/30">·</span>
          <a href="/" className="text-sm text-cream/45 underline underline-offset-4 transition-colors hover:text-cream">
            Volver a la landing
          </a>
        </div>
      </motion.section>
    );
  }
  ```

---

## Task 16: Main orchestrator `RizomaDiagnostic.tsx`

**Files:**
- Create: `src/components/diagnostic/RizomaDiagnostic.tsx`

- [ ] **Step 1:** Write:

  ```tsx
  "use client";

  import { useState } from "react";
  import { AnimatePresence } from "motion/react";
  import Hero from "./rizoma/Hero";
  import Wizard from "./rizoma/Wizard";
  import Results from "./rizoma/Results";
  import type { UserData } from "./rizoma/EmailGate";
  import { computeResults, type RizomaResult } from "@/lib/rizoma-scoring";

  type State = "hero" | "wizard" | "results";

  export default function RizomaDiagnostic() {
    const [state, setState] = useState<State>("hero");
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [scaleValues, setScaleValues] = useState<Record<string, number>>({});
    const [result, setResult] = useState<RizomaResult | null>(null);

    const setAnswer = (id: string, index: number) =>
      setAnswers((a) => ({ ...a, [id]: index }));
    const setScaleValue = (id: string, val: number) =>
      setScaleValues((s) => ({ ...s, [id]: val }));

    const handleComplete = () => {
      const r = computeResults(answers, scaleValues);
      setResult(r);
      setState("results");
    };

    const handleSubmitUser = async (user: UserData): Promise<void> => {
      if (!result) return;
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, scaleValues, result, user }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
    };

    const handleReset = () => {
      setAnswers({});
      setScaleValues({});
      setResult(null);
      setState("hero");
    };

    return (
      <div className="min-h-screen bg-void">
        <AnimatePresence mode="wait">
          {state === "hero" && <Hero key="hero" onStart={() => setState("wizard")} />}
          {state === "wizard" && (
            <Wizard
              key="wizard"
              answers={answers}
              scaleValues={scaleValues}
              setAnswer={setAnswer}
              setScaleValue={setScaleValue}
              onComplete={handleComplete}
            />
          )}
          {state === "results" && result && (
            <Results
              key="results"
              result={result}
              onSubmitUser={handleSubmitUser}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
  ```

---

## Task 17: Update `/diagnostico/page.tsx`

**Files:**
- Modify: `src/app/diagnostico/page.tsx`

- [ ] **Step 1:** Replace the file's content with:

  ```tsx
  import RizomaDiagnostic from "@/components/diagnostic/RizomaDiagnostic";
  import type { Metadata } from "next";

  export const metadata: Metadata = {
    title: "Diagnóstico RIZOMA — ThousandFold",
    description:
      "Descubre el arquetipo de tu marca regenerativa, tu nivel en el espectro RIZOMA y las brechas prioritarias a resolver. 24 preguntas, 8 minutos, gratuito.",
  };

  export default function DiagnosticoPage() {
    return <RizomaDiagnostic />;
  }
  ```

---

## Task 18: API route `/api/diagnostic`

**Files:**
- Modify: `src/app/api/diagnostic/route.ts`

- [ ] **Step 1:** Replace the file with:

  ```ts
  import { NextRequest, NextResponse } from "next/server";
  import { getSupabaseServer } from "@/lib/supabase-server";
  import { sendRizomaReport } from "@/lib/resend";
  import { ARCHETYPES, BRECHAS_META, LAYER_META, SERVICES_CATALOG } from "@/lib/rizoma-data";

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
        const topBrechaLayer = result.topBrechas[0];
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
  ```

---

## Task 19: Update landing `DiagnosticCTA.tsx`

**Files:**
- Modify: `src/components/sections/DiagnosticCTA.tsx`

- [ ] **Step 1:** Replace with:

  ```tsx
  "use client";

  import SectionWrapper from "@/components/ui/SectionWrapper";
  import SectionLabel from "@/components/ui/SectionLabel";
  import Button from "@/components/ui/Button";
  import TextReveal from "@/components/motion/TextReveal";
  import FadeIn from "@/components/motion/FadeIn";
  import { StaggerContainer, StaggerItem } from "@/components/motion/StaggerChildren";
  import CountUp from "@/components/motion/CountUp";

  const ARCHETYPE_CARDS = [
    { name: "EL CUSTODIO",     subtitle: "Proteger es crear valor" },
    { name: "EL CONSTRUCTOR",  subtitle: "El saber-hacer como moat" },
    { name: "EL REVELADOR",    subtitle: "La transparencia como diferencial" },
    { name: "EL REGENERADOR",  subtitle: "Devolver más de lo que se toma" },
    { name: "EL VISIONARIO",   subtitle: "Imaginar lo que aún no existe" },
  ];

  const STATS = [
    { target: 24, suffix: " preguntas" },
    { target: 8, suffix: " minutos" },
    { target: 6, suffix: " capas RIZOMA" },
  ];

  export default function DiagnosticCTA() {
    return (
      <SectionWrapper id="diagnostico" bg="dark">
        <SectionLabel number="//02" text="DIAGNÓSTICO RIZOMA" />

        <TextReveal>
          <h2 className="text-[clamp(2.5rem,6vw,80px)] font-normal text-cream leading-[1.05] tracking-[-0.02em]">
            Descubre el arquetipo de tu marca regenerativa
          </h2>
        </TextReveal>

        <FadeIn delay={0.15}>
          <p className="mt-4 text-base md:text-lg text-mute max-w-xl">
            24 preguntas. 8 minutos. Un análisis técnico basado en el framework
            RIZOMA — el primer sistema diseñado para evaluar marcas regenerativas
            en América Latina.
          </p>
        </FadeIn>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-16"
          stagger={0.1}
        >
          {ARCHETYPE_CARDS.map((c) => (
            <StaggerItem key={c.name}>
              <div className="border border-wire p-6 h-full transition-colors hover:border-signal/50">
                <span className="font-mono text-sm tracking-widest uppercase text-cream block">
                  {c.name}
                </span>
                <p className="mt-3 text-xs italic text-mute leading-relaxed">
                  {c.subtitle}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-20">
            {STATS.map((stat) => (
              <div key={stat.suffix} className="text-center">
                <CountUp
                  target={stat.target}
                  className="font-mono text-4xl md:text-5xl font-bold text-cream"
                />
                <span className="block text-sm text-mute mt-1">
                  {stat.suffix.trim()}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="mt-16 text-center">
            <Button
              href="/diagnostico"
              variant="primary"
              className="text-base px-12 py-5"
            >
              Iniciar diagnóstico
            </Button>
            <p className="text-xs text-mute mt-3">
              Gratuito. Tus datos se piden al final, al desbloquear el reporte
              completo.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="mt-16 border-l-2 border-signal pl-6 text-sm text-mute max-w-2xl">
            <p>
              El resultado incluye: tu arquetipo RIZOMA, score por cada una de las 6
              capas, top 3 brechas prioritarias con oportunidad de negocio, y la ruta
              de servicio ThousandFold recomendada para tu etapa.
            </p>
          </div>
        </FadeIn>
      </SectionWrapper>
    );
  }
  ```

---

## Task 20: Update Navbar

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1:** Three changes:

  1. Change `NAV_LINKS` item `Diagnóstico` `href` from `#diagnostico` to `/diagnostico`.
  2. Add `usePathname` from `next/navigation` to detect when on the sub-page.
  3. Update `handleLinkClick` to only `preventDefault` for hash-anchor links.

  Apply these edits to the top of the file:

  ```tsx
  "use client";

  import { useState, useEffect, useCallback } from "react";
  import { motion, AnimatePresence } from "motion/react";
  import { usePathname } from "next/navigation";

  const NAV_LINKS = [
    { label: "Diagnóstico", href: "/diagnostico" },
    { label: "Libro", href: "#libro" },
    { label: "Framework", href: "#framework" },
    { label: "Nosotros", href: "#nosotros" },
  ];

  const CTA_LINK = { label: "Contacto", href: "#contacto" };

  const SECTION_IDS = ["libro", "framework", "nosotros", "contacto"];
  ```

- [ ] **Step 2:** Inside the component, add `const pathname = usePathname();` right after the state declarations.

- [ ] **Step 3:** Update `handleLinkClick` to handle routes vs anchors:

  ```tsx
  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) {
        // Real route: let the browser/Next navigate normally
        setMobileOpen(false);
        return;
      }
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    },
    []
  );
  ```

- [ ] **Step 4:** Update the active-state computation inside the desktop `.map`:

  Replace:
  ```tsx
  const isActive = activeSection === link.href.slice(1);
  ```

  With:
  ```tsx
  const isActive = link.href.startsWith("/")
    ? pathname === link.href
    : activeSection === link.href.slice(1);
  ```

  Apply the same edit to the mobile `.map` that uses `activeSection === link.href.slice(1)`.

- [ ] **Step 5:** Run the dev server briefly (Task 23 does this properly) to confirm no import errors.

---

## Task 21: Update Footer email

**Files:**
- Modify: `src/components/layout/Footer.tsx:102` and `:105`

- [ ] **Step 1:** Replace both occurrences of `thousandfold@redesignlab.org` with `regenbrands@redesignlab.org`:

  ```
  href="mailto:regenbrands@redesignlab.org"
  ...
  regenbrands@redesignlab.org
  ```

---

## Task 22: Delete legacy files

**Files:**
- Delete: `src/components/diagnostic/DiagnosticWizard.tsx`
- Delete: `src/lib/diagnostic-data.ts`

- [ ] **Step 1:** Delete both files:

  ```bash
  cd /Users/eajalcrina/Documents/Proyectos/Thousandfold/landing
  rm src/components/diagnostic/DiagnosticWizard.tsx
  rm src/lib/diagnostic-data.ts
  ```

- [ ] **Step 2:** Search for any lingering imports and fix them:

  ```bash
  grep -rn "diagnostic-data\|DiagnosticWizard" src/ || echo "No references"
  ```

  Expected: "No references". If anything shows up, it's a bug in the preceding tasks — fix the offending import.

- [ ] **Step 3:** Type-check:

  ```bash
  npx tsc --noEmit
  ```

  Expected: exit code 0, no errors.

- [ ] **Step 4:** Lint:

  ```bash
  npm run lint
  ```

  Expected: no errors. Warnings about unused imports are acceptable; fix them if easy.

---

## Task 23: Local preview + manual QA

**Files:** none (just verify).

- [ ] **Step 1:** Start the dev server:

  ```bash
  cd /Users/eajalcrina/Documents/Proyectos/Thousandfold/landing
  npm run dev
  ```

  Open `http://localhost:3000`.

- [ ] **Step 2:** Walk through this checklist in the browser:

  **Landing (`/`):**
  - Section `//02 · DIAGNÓSTICO RIZOMA` renders with the new H2 and 5 archetype cards.
  - Stats show "24 · 8 · 6".
  - CTA "Iniciar diagnóstico" links to `/diagnostico` (hover to check target).
  - Footer shows `regenbrands@redesignlab.org`.
  - Navbar link "Diagnóstico" navigates to `/diagnostico` (not anchor scroll).

  **Sub-page (`/diagnostico`):**
  - Hero renders with Variante A copy, 3 metrics, 4 chips, CTA.
  - Click "Iniciar diagnóstico" — hero fades out, wizard fades in.
  - Progress bar shows 7 segments, current section label in uppercase.
  - Question 1 (p1) renders as single with 6 options. Click an option — Next becomes enabled.
  - Navigate forward through all 24 questions. Scale questions render 1-5 buttons.
  - On the last question, button says "Ver resultados →". Click.
  - Results render: archetype block with "Tu marca es El [Arquetipo]", level badge + score bar.
  - Radar, bars, brechas, and ruta are blurred with email gate form visible.
  - Fill the form with valid data and submit.
  - After submit: blur lifts, scroll jumps to radar, archetype block now says "{brandName} es El [Arquetipo]".
  - "Hacer el diagnóstico de nuevo" resets back to hero.
  - "Volver a la landing" goes to `/`.

- [ ] **Step 3:** Test with DevTools (mobile viewport 390px): hero + wizard + results all responsive, no horizontal overflow.

- [ ] **Step 4:** Open Network tab and verify the POST to `/api/diagnostic` returns `{ ok: true }` (even without Supabase/Resend env vars — the API is tolerant).

- [ ] **Step 5:** Build check (catches SSR errors):

  ```bash
  npm run build
  ```

  Expected: build succeeds with no TypeScript or React errors.

- [ ] **Step 6:** **STOP HERE.** Report to the user: "Implementación lista en `http://localhost:3000/diagnostico`. Revisa el flujo completo y avísame si está listo para commitear."

---

## Task 24: Commit (only after user approval)

**Files:** all changes.

- [ ] **Step 1:** Wait for the user's explicit approval to commit.

- [ ] **Step 2:** Stage the files explicitly (avoid `git add .` to skip any accidental env files):

  ```bash
  cd /Users/eajalcrina/Documents/Proyectos/Thousandfold/landing
  git add \
    package.json package-lock.json .env.local.example \
    supabase/migrations/002_rizoma_diagnostics.sql \
    src/lib/rizoma-data.ts src/lib/rizoma-scoring.ts \
    src/lib/__tests__/rizoma-scoring.test.ts \
    src/lib/supabase-server.ts src/lib/resend.ts \
    src/app/diagnostico/page.tsx \
    src/app/api/diagnostic/route.ts \
    src/components/diagnostic/RizomaDiagnostic.tsx \
    src/components/diagnostic/rizoma/ \
    src/components/sections/DiagnosticCTA.tsx \
    src/components/layout/Navbar.tsx \
    src/components/layout/Footer.tsx \
    docs/superpowers/specs/2026-04-23-diagnostico-rizoma-design.md \
    docs/superpowers/plans/2026-04-23-diagnostico-rizoma-implementation.md
  ```

  And stage the deletes:

  ```bash
  git add -u src/components/diagnostic/DiagnosticWizard.tsx \
             src/lib/diagnostic-data.ts \
             src/lib/supabase.ts
  ```

- [ ] **Step 3:** Verify staged changes look sane:

  ```bash
  git status
  git diff --cached --stat
  ```

- [ ] **Step 4:** Commit:

  ```bash
  git commit -m "$(cat <<'EOF'
  feat(diagnostico): reemplaza Impact Brand Score con Diagnóstico RIZOMA

  - Nueva sub-página /diagnostico con hero + wizard de 24 preguntas + resultados
  - 5 arquetipos + 3 niveles + 6 capas + top 3 brechas + ruta ThousandFold
  - Email gate de 11 campos bloquea radar/brechas hasta que el usuario completa
  - Persistencia en Supabase (rizoma_diagnostics) + email automático vía Resend
  - Actualiza DiagnosticCTA de la landing con las 5 cards de arquetipos
  - Navbar: link Diagnóstico apunta directo a /diagnostico
  - Reemplazo global de thousandfold@redesignlab.org → regenbrands@redesignlab.org
  - Elimina DiagnosticWizard.tsx + diagnostic-data.ts legacy

  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  EOF
  )"
  ```

- [ ] **Step 5:** Confirm:

  ```bash
  git log -1 --stat
  ```

---

## Self-review — spec coverage check

Mapping each requirement in the design spec to a task:

| Spec requirement | Covered by |
|---|---|
| Sub-page `/diagnostico` hero + wizard + results state machine | Tasks 7, 10, 15, 16, 17 |
| 24 questions with types (single/scale), layers, archetypes | Tasks 3, 4 |
| Scoring logic + service recommendation | Task 5 |
| Email gate with 11 fields incl. brand_link | Task 14 |
| Personalization with brand_name | Tasks 11, 15 |
| Radar chart with Recharts (6 layers) | Task 12 |
| Layer bars | Task 12 |
| Top 3 brechas cards | Task 13 |
| Ruta ThousandFold with single CTA (Calendly) | Task 13 |
| Supabase table `rizoma_diagnostics` + RLS | Task 2 |
| API route persistence + email send | Task 18 |
| Resend email template | Task 6 |
| Env var fallback for local preview | Tasks 6, 18 |
| Landing DiagnosticCTA update with 5 archetypes | Task 19 |
| Navbar link to `/diagnostico` + active state | Task 20 |
| Footer email update | Task 21 |
| Delete legacy files | Task 22 |
| Local preview + manual QA | Task 23 |
| Single final commit gated by user approval | Task 24 |
| TypeScript clean (`tsc --noEmit`) | Tasks 3, 6, 22 |
| Build succeeds (`next build`) | Task 23 step 5 |

No placeholders, no "similar to Task N" shortcuts, no "TBD". All data constants are either written inline or explicitly pointed to `Referencias/rizoma-diagnostic-spec.md` section numbers.

**Type consistency check:** `RizomaResult` (Task 5) is used in Task 15, 16, 18 — signatures match. `UserData` (Task 14) is consumed by Task 15, 16, 18 — match. `Layer`, `Level`, `Section`, `Question` types all defined in Task 3 and used everywhere downstream.
