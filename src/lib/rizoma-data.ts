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

export const QUESTIONS: Question[] = [

  // ─────────────────────────────────────────
  // BLOQUE 1: PERFIL (3 preguntas)
  // Contexto de la marca — no contribuye a arquetipos
  // ─────────────────────────────────────────

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
  {
    id: 'p2',
    section: 'perfil',
    tag: 'Perfil de la marca',
    q: '¿En qué etapa se encuentra tu empresa?',
    type: 'single',
    opts: [
      { t: 'Pre-lanzamiento o validación temprana (0–1 año)',               v: 0, arc: [0,0,0,0,0] },
      { t: 'Tracción inicial, primeras ventas (1–3 años)',                   v: 1, arc: [0,0,0,0,0] },
      { t: 'Crecimiento, mercados nacionales activos (3–7 años)',            v: 2, arc: [0,0,0,0,0] },
      { t: 'Escala, con presencia regional o internacional (7+ años)',       v: 3, arc: [0,0,0,0,0] },
    ],
  },
  {
    id: 'p3',
    section: 'perfil',
    tag: 'Perfil de la marca',
    q: '¿Cuántos mercados activos tiene tu marca actualmente?',
    type: 'single',
    opts: [
      { t: 'Solo mercado local o ciudad',                          v: 0, arc: [0,0,0,0,0] },
      { t: 'Mercado nacional',                                     v: 1, arc: [0,0,0,0,0] },
      { t: '2–3 países de ALC',                                    v: 2, arc: [0,0,0,0,0] },
      { t: 'Fuera de ALC (EE.UU., Europa u otros)',                v: 3, arc: [0,0,0,0,0] },
    ],
  },

  // ─────────────────────────────────────────
  // BLOQUE 2: TERRITORIO (4 preguntas)
  // Capa 0 del framework RIZOMA
  // ─────────────────────────────────────────

  {
    id: 't1',
    section: 'territorio',
    tag: 'Capa 0 — Territorio',
    q: '¿Qué tan bien documentado está el origen territorial de tu marca?',
    hint: 'Piensa en si puedes describir con precisión el ecosistema, las comunidades y las coordenadas de donde vienen tus ingredientes o materiales.',
    type: 'scale',
    layer: 'territorio',
    labels: ['Sin documentar', 'Completamente documentado'],
  },
  {
    id: 't2',
    section: 'territorio',
    tag: 'Capa 0 — Territorio',
    q: '¿Tu cadena de valor incluye actores del territorio (productores, comunidades, artesanos) con roles activos y remunerados?',
    type: 'single',
    layer: 'territorio',
    opts: [
      { t: 'No, trabajamos con proveedores estándar sin vínculo territorial específico', v: 1, arc: [0, 0, 1, 0, 0] },
      { t: 'Sí, tenemos relaciones con productores locales pero sin formalización de impacto', v: 2, arc: [0, 1, 1, 1, 0] },
      { t: 'Sí, y pagamos precio justo documentado por encima del mercado', v: 3, arc: [1, 0, 0, 3, 0] },
      { t: 'Sí, y los actores del territorio participan en la construcción del valor de marca', v: 4, arc: [1, 0, 0, 4, 1] },
    ],
  },
  {
    id: 't3',
    section: 'territorio',
    tag: 'Capa 0 — Territorio',
    q: '¿Tienes datos medibles del impacto de tu marca en el ecosistema de origen?',
    type: 'single',
    layer: 'territorio',
    opts: [
      { t: 'No tenemos métricas de impacto en el territorio', v: 1, arc: [0, 0, 0, 0, 0] },
      { t: 'Tenemos algunas métricas pero no son sistemáticas', v: 2, arc: [0, 0, 1, 0, 0] },
      { t: 'Sí, medimos impacto regularmente (suelos, biodiversidad, ingresos)', v: 3, arc: [0, 0, 1, 2, 1] },
      { t: 'Sí, y los publicamos con verificación de terceros', v: 4, arc: [1, 0, 1, 3, 0] },
    ],
  },
  {
    id: 't4',
    section: 'territorio',
    tag: 'Capa 0 — Territorio',
    q: '¿Los elementos visuales o narrativos de tu marca se inspiran directamente en el territorio de origen?',
    type: 'single',
    layer: 'territorio',
    opts: [
      { t: 'Todavía no — la identidad visual es genérica o estándar del sector', v: 1, arc: [0, 1, 0, 0, 1] },
      { t: 'Parcialmente — hay algunas referencias visuales al territorio', v: 2, arc: [0, 1, 0, 0, 1] },
      { t: 'Sí — el territorio es una inspiración visible en el sistema visual', v: 3, arc: [1, 1, 0, 0, 2] },
      { t: 'Sí — el territorio es la fuente constitutiva del sistema de identidad completo', v: 4, arc: [1, 1, 0, 0, 2] },
    ],
  },

  // ─────────────────────────────────────────
  // BLOQUE 3: PROPÓSITO (3 preguntas)
  // Capa 1 del framework RIZOMA
  // ─────────────────────────────────────────

  {
    id: 'pr1',
    section: 'proposito',
    tag: 'Capa 1 — Propósito',
    q: '¿Tu empresa tiene un propósito declarado que describe específicamente qué sistema regenera?',
    type: 'single',
    layer: 'proposito',
    opts: [
      { t: 'No tenemos un propósito declarado formalmente', v: 1, arc: [0, 0, 0, 0, 0] },
      { t: 'Tenemos misión y valores, pero no un propósito regenerativo específico', v: 2, arc: [0, 0, 0, 0, 0] },
      { t: 'Sí, declaramos explícitamente qué queremos regenerar y cómo', v: 3, arc: [0, 0, 1, 1, 1] },
      { t: 'Sí, y el propósito informa decisiones de negocio diarias verificablemente', v: 4, arc: [0, 0, 1, 1, 2] },
    ],
  },
  {
    id: 'pr2',
    section: 'proposito',
    tag: 'Capa 1 — Propósito',
    q: '¿El crecimiento de tu negocio está directamente vinculado al bienestar del territorio o comunidades de origen?',
    type: 'scale',
    layer: 'proposito',
    labels: ['Sin vínculo claro', 'Vínculo directo y medible'],
  },
  {
    id: 'pr3',
    section: 'proposito',
    tag: 'Capa 1 — Propósito',
    q: '¿Tu marca tiene límites declarados sobre lo que NO puede regenerar? (honestidad sobre los alcances del impacto)',
    type: 'single',
    layer: 'proposito',
    opts: [
      { t: 'No hemos pensado en eso formalmente', v: 1, arc: [0, 0, 1, 0, 0] },
      { t: 'Lo sabemos internamente pero no lo comunicamos', v: 2, arc: [0, 0, 1, 0, 0] },
      { t: 'Sí, somos explícitos sobre los alcances y límites de nuestro impacto', v: 3, arc: [0, 0, 1, 1, 0] },
    ],
  },

  // ─────────────────────────────────────────
  // BLOQUE 4: IDENTIDAD (3 preguntas)
  // Capa 2 del framework RIZOMA
  // ─────────────────────────────────────────

  {
    id: 'id1',
    section: 'identidad',
    tag: 'Capa 2 — Identidad',
    q: '¿Tu marca tiene un arquetipo de personalidad claramente definido que guíe la comunicación?',
    type: 'single',
    layer: 'identidad',
    opts: [
      { t: 'No, la personalidad de marca varía según quien comunica', v: 1, arc: [0, 0, 0, 0, 0] },
      { t: 'Tenemos guías básicas de tono pero no un arquetipo estratégico', v: 2, arc: [0, 0, 0, 0, 0] },
      { t: 'Sí, la personalidad está definida y es consistente', v: 3, arc: [0, 0, 0, 0, 0] },
      { t: 'Sí, y el arquetipo está directamente anclado en el territorio y propósito', v: 4, arc: [1, 1, 0, 1, 1] },
    ],
  },
  {
    id: 'id2',
    section: 'identidad',
    tag: 'Capa 2 — Identidad',
    q: '¿Cómo describirías la relación entre tu marca y el territorio?',
    type: 'single',
    layer: 'identidad',
    opts: [
      { t: 'La conservación es nuestra razón de existir — todo parte de proteger el ecosistema',        v: 4, arc: [4, 0, 0, 0, 0] },
      { t: 'Transformamos el conocimiento o la materia prima en algo de mayor valor, con maestría',      v: 4, arc: [0, 4, 0, 0, 0] },
      { t: 'Nuestra diferencia principal es la transparencia radical sobre origen y proceso',            v: 4, arc: [0, 0, 4, 0, 0] },
      { t: 'El modelo de negocio entero está diseñado para devolver más de lo que toma al territorio',   v: 4, arc: [0, 0, 0, 4, 0] },
      { t: 'Innovamos con el territorio como fuente — imaginamos lo que todavía no existe',              v: 4, arc: [0, 0, 0, 0, 4] },
    ],
  },
  {
    id: 'id3',
    section: 'identidad',
    tag: 'Capa 2 — Identidad',
    q: '¿Tu equipo describe la marca de manera consistente cuando se le pregunta sin prepararlos?',
    type: 'scale',
    layer: 'identidad',
    labels: ['Muy inconsistente', 'Totalmente alineado'],
  },

  // ─────────────────────────────────────────
  // BLOQUE 5: ARQUITECTURA (3 preguntas)
  // Capa 3 del framework RIZOMA
  // ─────────────────────────────────────────

  {
    id: 'ar1',
    section: 'arquitectura',
    tag: 'Capa 3 — Arquitectura',
    q: '¿El nombre de tu marca tiene raíz verificable en el territorio, la cultura o el idioma de origen?',
    type: 'single',
    layer: 'arquitectura',
    opts: [
      { t: 'No, el nombre es genérico o en inglés sin vínculo territorial', v: 1, arc: [0, 0, 1, 0, 0] },
      { t: 'Parcialmente — hay una conexión pero no está documentada ni comunicada', v: 2, arc: [0, 1, 1, 0, 0] },
      { t: 'Sí, el nombre tiene una historia de origen verificable y la comunicamos', v: 3, arc: [1, 1, 1, 0, 0] },
      { t: 'Sí, y además el nombre pasa los 5 filtros de escalabilidad global RIZOMA', v: 4, arc: [1, 1, 1, 0, 1] },
    ],
  },
  {
    id: 'ar2',
    section: 'arquitectura',
    tag: 'Capa 3 — Arquitectura',
    q: '¿Tu marca tiene claridad sobre quién es su comprador principal y cómo toma decisiones de compra?',
    type: 'scale',
    layer: 'arquitectura',
    labels: ['Sin claridad de audiencia', 'Perfil de comprador preciso'],
  },
  {
    id: 'ar3',
    section: 'arquitectura',
    tag: 'Capa 3 — Arquitectura',
    q: '¿Has pensado en cómo escalaría la arquitectura de tu marca si entraras a mercados internacionales?',
    type: 'single',
    layer: 'arquitectura',
    opts: [
      { t: 'No, todavía no es una prioridad', v: 1, arc: [0, 0, 0, 0, 0] },
      { t: 'Lo hemos pensado pero no tenemos un plan concreto', v: 2, arc: [0, 0, 0, 0, 1] },
      { t: 'Sí, la arquitectura actual está diseñada para escalar globalmente', v: 3, arc: [0, 0, 0, 0, 2] },
      { t: 'Sí, y tenemos la estructura legal y de marca preparada para la expansión', v: 4, arc: [0, 0, 0, 0, 2] },
    ],
  },

  // ─────────────────────────────────────────
  // BLOQUE 6: EXPRESIÓN (4 preguntas)
  // Capa 4 del framework RIZOMA
  // ─────────────────────────────────────────

  {
    id: 'ex1',
    section: 'expresion',
    tag: 'Capa 4 — Expresión',
    q: '¿Cómo describirías la identidad visual de tu marca en el espectro del diseño regenerativo?',
    type: 'single',
    layer: 'expresion',
    opts: [
      { t: 'Usamos códigos visuales comunes del sector sostenible (verde, kraft, hojas)', v: 1, arc: [0, 0, 2, 0, 0] },
      { t: 'Hemos empezado a diferenciarnos pero aún hay elementos genéricos', v: 2, arc: [0, 0, 1, 0, 0] },
      { t: 'El sistema visual es distintivo y está anclado en el territorio de origen', v: 3, arc: [1, 1, 1, 1, 1] },
      { t: 'Luxury Sustainability: sofisticado, sin clichés ecológicos, precio que habla solo', v: 4, arc: [1, 0, 1, 0, 2] },
    ],
  },
  {
    id: 'ex2',
    section: 'expresion',
    tag: 'Capa 4 — Expresión',
    q: '¿Cuánto cobra tu marca respecto al precio de referencia de mercado (commodity o producto convencional similar)?',
    type: 'single',
    layer: 'expresion',
    opts: [
      { t: 'Similar o ligeramente superior (menos de 30% de premium)', v: 1, arc: [0, 0, 0, 0, 0] },
      { t: 'Premium moderado (30–100% por encima del referente)', v: 2, arc: [0, 0, 0, 0, 0] },
      { t: 'Premium significativo (100–300% por encima del referente)', v: 3, arc: [0, 0, 0, 1, 1] },
      { t: 'Premium extremo (+300%) o modelo de precio único sin referente directo', v: 4, arc: [1, 0, 0, 2, 2] },
    ],
  },
  {
    id: 'ex3',
    section: 'expresion',
    tag: 'Capa 4 — Expresión',
    q: '¿Tienes al menos una certificación internacional que soporte el precio premium de tu marca?',
    type: 'single',
    layer: 'expresion',
    opts: [
      { t: 'No tenemos certificaciones actualmente', v: 1, arc: [0, 0, 0, 0, 0] },
      { t: 'Estamos en proceso de certificación', v: 2, arc: [0, 0, 0, 0, 0] },
      { t: 'Sí, una certificación (Orgánico, Fair Trade, B Corp u otro)', v: 3, arc: [0, 0, 1, 1, 0] },
      { t: 'Sí, múltiples certificaciones que se refuerzan mutuamente', v: 4, arc: [0, 0, 1, 2, 0] },
    ],
  },
  {
    id: 'ex4',
    section: 'expresion',
    tag: 'Capa 4 — Expresión',
    q: '¿Tu packaging o presentación de producto refleja los valores regenerativos de la marca de manera verificable?',
    type: 'scale',
    layer: 'expresion',
    labels: ['Packaging estándar', 'Ecodiseño documentado y coherente'],
  },

  // ─────────────────────────────────────────
  // BLOQUE 7: NARRATIVA (4 preguntas)
  // Capa 5 del framework RIZOMA
  // ─────────────────────────────────────────

  {
    id: 'na1',
    section: 'narrativa',
    tag: 'Capa 5 — Narrativa',
    q: '¿Tu comunicación está basada principalmente en hechos verificables del territorio o en aspiraciones declaradas?',
    type: 'single',
    layer: 'narrativa',
    opts: [
      { t: 'Principalmente aspiracional — comunicamos lo que queremos ser', v: 1, arc: [0, 0, 2, 0, 0] },
      { t: 'Mixto — combinamos hechos reales con aspiraciones no verificadas', v: 2, arc: [0, 0, 1, 0, 0] },
      { t: 'Principalmente factual — nuestros claims tienen evidencia verificable', v: 3, arc: [1, 0, 1, 1, 0] },
      { t: '100% storydoing — todo lo que comunicamos puede verificarse con datos o una visita', v: 4, arc: [1, 0, 1, 2, 0] },
    ],
  },
  {
    id: 'na2',
    section: 'narrativa',
    tag: 'Capa 5 — Narrativa',
    q: '¿Realizas visitas regulares al territorio de origen para documentar y generar contenido auténtico?',
    type: 'single',
    layer: 'narrativa',
    opts: [
      { t: 'No realizamos visitas regulares de campo', v: 1, arc: [0, 0, 0, 1, 0] },
      { t: 'Las hacemos ocasionalmente, sin protocolo definido', v: 2, arc: [0, 0, 0, 1, 0] },
      { t: 'Sí, de forma regular con protocolo de documentación', v: 3, arc: [2, 0, 0, 1, 0] },
      { t: 'Sí, y el campo es nuestra principal fuente de contenido de marca', v: 4, arc: [2, 0, 0, 2, 0] },
    ],
  },
  {
    id: 'na3',
    section: 'narrativa',
    tag: 'Capa 5 — Narrativa',
    q: '¿Has identificado los patrones de greenwashing que podrían estar presentes en tu comunicación actual?',
    type: 'single',
    layer: 'narrativa',
    opts: [
      { t: 'No hemos hecho ese ejercicio', v: 1, arc: [0, 0, 2, 0, 0] },
      { t: 'Lo hemos pensado pero no de manera sistemática', v: 2, arc: [0, 0, 1, 0, 0] },
      { t: 'Sí, y hemos corregido o aclarado los claims problemáticos', v: 3, arc: [0, 0, 1, 1, 0] },
      { t: 'Sí, y comunicamos abiertamente nuestras brechas y el plan para cerrarlas', v: 4, arc: [0, 0, 1, 1, 0] },
    ],
  },
  {
    id: 'na4',
    section: 'narrativa',
    tag: 'Capa 5 — Narrativa',
    q: '¿Qué tan alineado está el equipo interno con el propósito y narrativa de la marca?',
    type: 'scale',
    layer: 'narrativa',
    labels: ['Desalineado', 'Completamente comprometido'],
  },

]; // fin QUESTIONS
