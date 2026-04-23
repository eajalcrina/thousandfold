# Diagnóstico RIZOMA — Rediseño de `/diagnostico` + actualización de landing

**Fecha:** 2026-04-23
**Autor:** Equipo ThousandFold (vía brainstorming asistido)
**Estado:** Design aprobado — pendiente plan de implementación

---

## 1. Objetivo

Reemplazar el diagnóstico actual de ThousandFold (9 preguntas, 3 etapas) por el **Diagnóstico RIZOMA** (24 preguntas, 5 arquetipos + 3 niveles, 6 capas), adaptado al stack Next.js/React del sitio. Dar a la sub-página `/diagnostico` una hero section propia y actualizar la sección `DiagnosticCTA` de la landing para que funcione como preview del nuevo sistema.

## 2. Alcance

### Incluye

1. Nueva sub-página `/diagnostico` con título visible "Diagnóstico RIZOMA" (ruta se mantiene).
2. Reemplazo total del componente `DiagnosticWizard.tsx` y del módulo `src/lib/diagnostic-data.ts`.
3. Banco completo de 24 preguntas RIZOMA (3 perfil sin scoring + 21 con scoring).
4. Lógica de cálculo: arquetipo dominante, nivel, score global, scores por capa (6), top 3 brechas.
5. Pantalla de resultados con radar chart (Recharts), barras por capa, top 3 brechas, ruta ThousandFold.
6. **Email gate** (opción B de la spec RIZOMA) — tras arquetipo + nivel, gate con form extendido antes de desbloquear el resto.
7. Actualización de `src/app/api/diagnostic/route.ts` y nuevo schema Supabase (`rizoma_diagnostics`).
8. Email automático de seguimiento tras enviar el gate.
9. Actualización de `src/components/sections/DiagnosticCTA.tsx` en la landing.
10. Navbar: link "Diagnóstico" apunta directo a `/diagnostico`.
11. Reemplazo global del email `thousandfold@redesignlab.org` por `regenbrands@redesignlab.org`.

### No incluye

- Migración del histórico de diagnósticos anteriores (se descarta).
- A/B testing del CTA.
- Exportación del resultado a PDF descargable en el cliente (el email de seguimiento cubre este flujo).
- Rediseño de otras secciones de la landing que no sean `DiagnosticCTA` y el Footer (email).

## 3. Decisiones arquitectónicas

| Decisión | Elegida | Razón |
|---|---|---|
| Stack | Adaptar al Next.js/React existente | Coherencia con el sitio; la spec original propone HTML/JS vanilla que no encaja. |
| Modelo de reemplazo | Reemplazo total | User confirmó; simplifica el código y el schema. |
| CTA post-resultado | Opción B (email gate) | Captura de leads prioritaria. |
| Radar chart | Recharts | React-native; evita Chart.js CDN; SSR-safe. |
| Ruta | `/diagnostico` se mantiene | Evita redirects. |
| Nav | Link directo a `/diagnostico` | Hace la sub-página de primera clase. |
| Flujo del sub-page | Hero first → fade a wizard → resultados abajo | Mismo patrón que la spec RIZOMA original. |
| CTA de resultados | Único, sin segmentar por nivel | Sesión gratuita con el equipo cubre los tres casos. |

## 4. Arquitectura de componentes

```
src/
├── app/
│   ├── diagnostico/
│   │   └── page.tsx                      ← metadata + render <RizomaDiagnostic/>
│   └── api/
│       └── diagnostic/
│           └── route.ts                  ← POST handler (nuevo payload)
├── components/
│   ├── diagnostic/
│   │   ├── RizomaDiagnostic.tsx          ← orchestrator (estados: hero | wizard | results)
│   │   ├── rizoma/
│   │   │   ├── Hero.tsx                  ← Estado 1: hero section
│   │   │   ├── Wizard.tsx                ← Estado 2: preguntas + progreso
│   │   │   ├── QuestionSingle.tsx        ← input tipo 'single'
│   │   │   ├── QuestionScale.tsx         ← input tipo 'scale' 1-5
│   │   │   ├── ProgressBar.tsx           ← 7 segmentos con label de sección
│   │   │   ├── Results.tsx               ← Estado 3: resultados completos
│   │   │   ├── ArchetypeBlock.tsx        ← bloque principal del arquetipo
│   │   │   ├── LevelBadge.tsx            ← nivel + score global
│   │   │   ├── RadarChart.tsx            ← Recharts radar de 6 capas
│   │   │   ├── LayerBars.tsx             ← barras horizontales por capa
│   │   │   ├── BrechasCards.tsx          ← top 3 brechas
│   │   │   ├── RutaThousandfold.tsx      ← servicio recomendado + CTA
│   │   │   └── EmailGate.tsx             ← form completo
│   │   └── (se elimina DiagnosticWizard.tsx)
│   └── sections/
│       └── DiagnosticCTA.tsx             ← actualizado (landing)
├── lib/
│   ├── rizoma-data.ts                    ← questions, archetypes, levels, layers, brechas, services
│   ├── rizoma-scoring.ts                 ← computeResults(answers, scaleValues)
│   └── (se elimina diagnostic-data.ts)
└── (sin cambios)
```

## 5. Flujo de usuario y estados

### Estado 1 — Hero (inicial)

Al llegar a `/diagnostico`:

```
┌─────────────────────────────────────────────┐
│ FRAMEWORK RIZOMA · THOUSANDFOLD STUDIO      │ ← eyebrow
│                                             │
│ Tu marca hace lo correcto.                  │ ← H1 (cream)
│ El mercado todavía no lo paga.              │ ← H1 (signal red)
│                                             │
│ En 8 minutos, descubre tu arquetipo RIZOMA, │ ← sub
│ tu nivel en el espectro regenerativo y      │
│ las tres brechas concretas que separan a    │
│ tu marca del precio que realmente vale.     │
│                                             │
│    24            ~8            6            │ ← métricas
│ preguntas    minutos       capas RIZOMA     │
│                                             │
│ [ Arquetipo ][ Score ][ Brechas ][ Ruta ]   │ ← chips
│                                             │
│         [ Iniciar diagnóstico → ]           │ ← CTA primario
│                                             │
└─────────────────────────────────────────────┘
```

Clic en "Iniciar diagnóstico" → fade out 200ms → fade in Wizard.

### Estado 2 — Wizard

- Barra de progreso fija superior con 7 segmentos (Perfil, Territorio, Propósito, Identidad, Arquitectura, Expresión, Narrativa). Segmento activo en `--tf-red`, completados en `--tf-green-dark`, pendientes en `--tf-cream-15`. Label de sección activa visible a la derecha (uppercase, mono).
- Contenedor principal: `max-w-[680px]`.
- Una pregunta a la vez con transición fade-slide-in (translateY 12px → 0, opacity 0 → 1, 200ms ease).
- Cada pregunta renderiza:
  - Eyebrow con `question.tag` (color signal, uppercase).
  - Contador "Pregunta X de 24".
  - Enunciado de la pregunta.
  - Hint opcional con border-left.
  - Input: `QuestionSingle` o `QuestionScale`.
- Navegación inferior: `← Anterior` (ghost) / `Siguiente →` (primary).
- Primera pregunta oculta el botón Anterior.
- Botón Siguiente deshabilitado hasta que haya respuesta para la pregunta activa.

### Estado 3 — Resultados

Renderizado tras terminar la pregunta 24. Layout vertical, sin paginación. Orden:

1. **Arquetipo dominante** — grande, arriba. Antes del gate: copy genérico. Tras gate: copy con `{brand_name}`.
2. **Nivel + Score global /100** — badge + barra horizontal.
3. **Email gate** (si aún no enviado) — form a ancho completo con overlay blur suave sobre las secciones 4-7 (que están en el DOM pero visualmente bloqueadas).
4. **Radar chart** — 6 capas.
5. **Barras por capa** — 6 barras horizontales con %.
6. **Top 3 brechas** — 3 cards con capa, diagnóstico urgente, oportunidad.
7. **Ruta ThousandFold** — card grande: servicio recomendado derivado de arquetipo + score + brechas, precio de entrada, CTA primario a Calendly, secundario a mailto.
8. Footer del diagnóstico: "Hacer el diagnóstico de nuevo" · "Volver a la landing".

## 6. Banco de preguntas y scoring

### 6.1 Estructura de datos (TypeScript)

```ts
export type Section =
  | 'perfil' | 'territorio' | 'proposito' | 'identidad'
  | 'arquitectura' | 'expresion' | 'narrativa';

export type Layer =
  | 'territorio' | 'proposito' | 'identidad'
  | 'arquitectura' | 'expresion' | 'narrativa';

export interface Option {
  t: string;               // texto mostrado
  v: number;               // valor de capa (1-4)
  arc: [number, number, number, number, number]; // peso por arquetipo
}

export interface QuestionSingle {
  id: string;
  section: Section;
  tag: string;             // eyebrow
  q: string;               // enunciado
  hint?: string;
  type: 'single';
  layer?: Layer;           // si puntúa a una capa
  opts: Option[];
}

export interface QuestionScale {
  id: string;
  section: Section;
  tag: string;
  q: string;
  hint?: string;
  type: 'scale';
  layer: Layer;
  labels: [string, string]; // [izq, der]
}

export type Question = QuestionSingle | QuestionScale;
```

### 6.2 Contenido

El banco completo de 24 preguntas, los 5 arquetipos, los 3 niveles, los metadatos de las 6 capas, los textos de brechas y el catálogo de servicios se copian **literalmente** desde `Referencias/rizoma-diagnostic-spec.md` secciones 3.2 y 3.4.

Implementación en `src/lib/rizoma-data.ts`. No modificar copy.

### 6.3 Lógica de cálculo

Implementación TS de `computeResults(answers, scaleValues)` en `src/lib/rizoma-scoring.ts`. La implementación porta literalmente el algoritmo de la sección 3.3 de la spec, con ajuste de tipos a TS:

```ts
export interface RizomaResult {
  arcIndex: number;                    // 0-4
  arcScores: [number, number, number, number, number];
  layerScores: Record<Layer, number>;  // 0-100
  totalScore: number;                  // 0-100 = promedio de 6 capas
  level: 'Observadora' | 'Caminante' | 'Nativa';
  topBrechas: Layer[];                 // 3 capas con menor score
  recommendedServiceId: string;        // derivado de arcIndex + level + brechas
}
```

**Reglas de nivel:**
- `totalScore < 35` → Observadora
- `35 <= totalScore < 65` → Caminante
- `totalScore >= 65` → Nativa

**Servicio recomendado:**
Derivación a partir de `SERVICES_CATALOG` (ver spec 3.4):
1. Priorizar `relevantFor: [arcIndex]`.
2. Si hay varios, elegir aquel cuyo `relevantIfLayerLow` intersecta con `topBrechas`.
3. Si no hay match, usar `Regen Brand Sprint` para scores < 50, y `Brand Platform Canvas` para el resto.

## 7. Email gate — campos

Form que bloquea secciones 4-7 de resultados hasta que se completa.

| # | Campo | Tipo | Requerido | Notas |
|---|---|---|---|---|
| 1 | Nombre | text | sí | |
| 2 | Apellido | text | sí | |
| 3 | Email | email | sí | validación de formato |
| 4 | Código país teléfono | select | sí | +51, +52, +54, +56, +57, +58, +591, +593, +595, +598, +502, +503, +504, +505, +506, +507, +1, +34, +55, +351, Otro |
| 5 | Teléfono | tel | sí | mínimo 7 dígitos |
| 6 | País de la marca | select | sí | lista LATAM + internacional |
| 7 | Nombre de la marca | text | sí | se usa en el reporte |
| 8 | Producto o servicio | textarea (2 líneas) | sí | descripción corta |
| 9 | Enlace principal | text | no | placeholder: `https://tumarca.com · @tumarca · tiktok.com/@tumarca` |
| 10 | Rango de facturación anual (USD) | select | sí | Pre-revenue · <$50k · $50k–$250k · $250k–$1M · $1M–$5M · $5M–$10M · >$10M |
| 11 | Mercado actual | select | sí | Local · Regional · Nacional · Internacional |

**UX:**
- Scroll interno si excede viewport.
- Validación inline en blur.
- Nota de privacidad debajo del CTA: "Usamos esta información sólo para enviarte tu reporte y un análisis personalizado de ThousandFold. No spam."
- Botón: "Ver mi reporte completo →".
- Al enviar: POST al API → fade-in de las secciones bloqueadas + scroll suave al radar.

## 8. Personalización del reporte con `brand_name`

Antes del gate, las copias usan "Tu marca" genérico. Tras el gate exitoso:

- **Arquetipo:** título pasa a `{brand_name} es El [Arquetipo]`.
- **Descripción del arquetipo:** prefijo "Como [Arquetipo], {brand_name}..." antes del texto base.
- **Ruta ThousandFold:** CTA contextual "Para {brand_name}, el siguiente paso es [servicio]...".
- **Email automático:** asunto `El perfil RIZOMA de {brand_name}: [Arquetipo]` y saludo con nombre del usuario.

El `brand_name` se lee del estado tras enviar el form; no se re-renderiza el arquetipo/nivel que ya estaban visibles — se actualizan con una transición opacity suave.

## 9. API y persistencia

### 9.1 Endpoint `POST /api/diagnostic`

```ts
// Payload
{
  answers: Record<string, number>,        // qId → optionIndex (single)
  scaleValues: Record<string, number>,    // qId → 1..5 (scale)
  result: RizomaResult,
  user: {
    firstName: string, lastName: string,
    email: string, phoneCountryCode: string, phone: string,
    brandCountry: string, brandName: string, brandOffering: string,
    brandLink: string | null,
    revenueRange: string, marketScope: string,
  }
}

// Respuesta
{ ok: true } | { ok: false, error: string }
```

Side-effects del handler:
1. Insert en `rizoma_diagnostics`.
2. Trigger de email de seguimiento (ver §9.3).
3. Log de telemetría básica.

### 9.2 Schema Supabase — tabla `rizoma_diagnostics`

```sql
create table public.rizoma_diagnostics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- resultado
  arc_index smallint not null,             -- 0..4
  arc_name text not null,
  level text not null,                      -- Observadora | Caminante | Nativa
  total_score smallint not null,
  layer_scores jsonb not null,              -- { territorio:0-100, ... }
  top_brechas jsonb not null,               -- ['narrativa','expresion','proposito']
  recommended_service text not null,

  -- respuestas brutas (para análisis)
  answers jsonb not null,
  scale_values jsonb not null,

  -- lead
  first_name text not null,
  last_name text not null,
  email text not null,
  phone_country_code text not null,
  phone text not null,
  brand_country text not null,
  brand_name text not null,
  brand_offering text not null,
  brand_link text,
  revenue_range text not null,
  market_scope text not null
);

create index rizoma_diagnostics_email_idx on public.rizoma_diagnostics (email);
create index rizoma_diagnostics_created_at_idx on public.rizoma_diagnostics (created_at desc);
```

Migración va en `landing/supabase/` siguiendo la convención existente del proyecto.

### 9.3 Email automático

- **Remitente:** `regenbrands@redesignlab.org`.
- **Asunto:** `El perfil RIZOMA de {brand_name}: {arc_name}`.
- **Contenido mínimo:**
  - Saludo con `first_name`.
  - Arquetipo + descripción.
  - Nivel + score global.
  - Top 1 brecha con diagnóstico + oportunidad.
  - Servicio recomendado con precio de entrada.
  - CTA: "Agenda una sesión con el equipo → https://calendar.app.google/9nv4ou6CEBwucfJp8".
- **Implementación:** Resend vía variable de entorno `RESEND_API_KEY`. Alternativa: Supabase Edge Function. Decisión final durante el plan de implementación, no bloqueante para el diseño.
- **Fallback:** si el envío falla, la API responde `ok: true` igual (el dato ya está persistido). Se registra en logs.

## 10. CTA de resultados (único)

Aplica a los tres niveles sin distinción:

- **Label:** `Agenda una sesión con nuestro equipo`
- **Subtext:** `30 minutos. Gratuito. Revisamos tu reporte RIZOMA contigo.`
- **Href:** `https://calendar.app.google/9nv4ou6CEBwucfJp8` (target `_blank`)
- **CTA secundario:** `Escríbenos a regenbrands@redesignlab.org` (mailto con subject precargado `"Consulta sobre mi perfil RIZOMA"`).

El servicio recomendado se muestra como contexto dentro del bloque "Ruta ThousandFold", pero el CTA accionable es único.

## 11. Actualización de la landing

### 11.1 `DiagnosticCTA.tsx` (`src/components/sections/DiagnosticCTA.tsx`)

- **SectionLabel:** `//02 · DIAGNÓSTICO RIZOMA`.
- **H2:** "Descubre el arquetipo de tu marca regenerativa".
- **Sub:** "24 preguntas. 8 minutos. Un análisis técnico basado en el framework RIZOMA — el primer sistema diseñado para evaluar marcas regenerativas en América Latina."
- **Cards (5 arquetipos)** — grid 5 columnas desktop, 2-3 tablet, 1 mobile. Sin card destacada. Cada card: nombre en mono uppercase + subtitle italic.
- **Stats:** `24 preguntas · 8 minutos · 6 capas RIZOMA`.
- **CTA:** "Iniciar diagnóstico" → `/diagnostico`.
- **Nota inferior:** "Gratuito. Tus datos se piden al final, al desbloquear el reporte completo."
- **Callout final (border-left signal):** texto sobre qué incluye el resultado (arquetipo, score por capa, brechas, ruta).

### 11.2 Navbar (`src/components/layout/Navbar.tsx`)

- Link "Diagnóstico" cambia `href` de `#diagnostico` a `/diagnostico`.
- `handleLinkClick` debe distinguir links internos con ancla (`href.startsWith('#')`) de rutas (`/...`). Para rutas: no hacer `preventDefault`, dejar la navegación nativa de Next (o usar `next/link`).
- Estado activo en `/diagnostico`: usar `usePathname()` de `next/navigation` para resaltar el link como activo cuando `pathname === '/diagnostico'`.
- `SECTION_IDS` puede dejar "diagnostico" — el IntersectionObserver sigue funcionando en la home (la sección `DiagnosticCTA` sigue teniendo `id="diagnostico"`).

### 11.3 Footer (`src/components/layout/Footer.tsx`)

`thousandfold@redesignlab.org` → `regenbrands@redesignlab.org` (href y texto visible, línea 102 y 105).

## 12. Sistema visual

Sin cambios en design tokens globales. Se reutilizan `void`, `signal`, `cream`, `mute`, `wire`, `flash` y las utilidades existentes.

- Hero del diagnóstico replica el tono del hero principal (misma escala tipográfica con `clamp`, segunda línea en `text-signal`).
- Chips del hero: `border border-cream/20` + `rounded-full` + `text-xs` + `tracking-wide`.
- Progress segments: `bg-wire` default, `bg-signal` active, `bg-[#2C4A3E]` (green-dark) done.
- Cards de arquetipo en la landing: `border border-wire` + `p-6` + hover `border-signal/50`.
- Radar chart: área en `signal` con `fill-opacity: 0.15`, stroke signal, grid en `cream/10`.
- Transiciones entre estados: Motion con `fade + translateY 12px`, 200-300ms ease.

## 13. Criterios de aceptación

1. `/diagnostico` muestra el hero inicial con copy exacto de la Variante A.
2. Clic en "Iniciar diagnóstico" hace fade al wizard sin cambio de URL.
3. El wizard presenta 24 preguntas en 7 secciones, una a la vez, con progreso visible.
4. El cálculo produce un arquetipo (0-4), un nivel correcto por umbrales, un score global 0-100, scores por capa 0-100, y un top 3 de brechas.
5. Tras la pregunta 24 el usuario ve arquetipo + nivel + score. Las secciones 4-7 están en el DOM pero bloqueadas con blur.
6. El form de 11 campos desbloquea las secciones bloqueadas tras envío válido y hace scroll suave al radar.
7. El POST persiste todos los campos en `rizoma_diagnostics`.
8. Se envía email automático desde `regenbrands@redesignlab.org` con el contenido mínimo definido.
9. El CTA primario lleva al Calendly; el secundario abre mailto a `regenbrands@redesignlab.org`.
10. La landing muestra las 5 cards de arquetipos, las métricas actualizadas, y el CTA enlaza a `/diagnostico`.
11. El navbar enlaza `Diagnóstico` a `/diagnostico` directamente.
12. El footer usa `regenbrands@redesignlab.org`.
13. El componente es responsive (mobile 360px → desktop 1440px+) y mantiene contraste AA.
14. No hay regresiones en el build de Next.js (`npm run build` limpio).

## 14. Fuera del alcance explícito

- Tests automatizados del scoring (se deja para fase siguiente, pero debe ser fácil agregar — lógica aislada en `rizoma-scoring.ts`).
- i18n (el sitio es solo ES).
- Analytics events adicionales (se deja al plan de implementación si hay tiempo).
- PDF descargable del resultado.
