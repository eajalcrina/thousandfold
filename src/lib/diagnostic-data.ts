// ============================================================
// Impact Brand Score — Complete Data & Scoring Logic
// Aligned with Regen Brands Framework v7.0
// ============================================================

export interface QuestionOption {
  id: string;
  text: string;
  score: number;
}

export interface Question {
  id: string;
  blockLabel: string;
  blockDescription: string;
  dimension: string;
  text: string;
  options: QuestionOption[];
}

export type Etapa = "observadora" | "caminante" | "nativa";
export type Temperatura = "caliente" | "tibio" | "frio";

export interface DiagnosticResult {
  etapa: Etapa;
  porVeto: boolean;
  veto: string | null;
  temperatura: Temperatura;
  scoreEspectro: number;
  dimensiones: Record<string, number>;
  tagCRM: string;
}

export interface EtapaContent {
  badge: string;
  badgeColor: string;
  etiqueta: string;
  titular: string;
  datoContexto: string;
  momentoActual: string;
  riesgoPrincipal: string;
  oportunidadConcreta: string;
  ctaPrimario: { label: string; href: string };
  ctaSecundario: { label: string; href: string };
  ctaWhatsApp?: { label: string; href: string };
}

export const DIMENSION_LABELS: Record<string, string> = {
  naturaleza_modelo: "Naturaleza del Modelo",
  proposito_verificable: "Propósito Verificable",
  voces_territorio: "Voces del Territorio",
  identidad_visual: "Identidad Visual",
  demostracion_impacto: "Demostración de Impacto",
  coherencia_narrativa: "Coherencia Narrativa",
  pricing_regenerativo: "Pricing Regenerativo",
  retroalimentacion_aprendizaje: "Retroalimentación y Aprendizaje",
};

export const QUESTIONS: Question[] = [
  {
    id: "P1",
    blockLabel: "BLOQUE 1 — BASE REGENERATIVA",
    blockDescription: "Evalúa la raíz del sistema: tu modelo de negocio y la presencia de un propósito verificable.",
    dimension: "naturaleza_modelo",
    text: "¿Cómo describirías la naturaleza del impacto de tu modelo de negocio hoy?",
    options: [
      { id: "P1_A", text: "Mi modelo está diseñado para devolver más de lo que toma — restaura ecosistemas, comunidades o conocimiento de forma verificable", score: 3 },
      { id: "P1_B", text: "Mitigamos activamente nuestro impacto negativo y buscamos crear valor positivo en el siguiente nivel", score: 2 },
      { id: "P1_C", text: "Operamos de forma convencional y estamos explorando cómo hacer la transición hacia algo más regenerativo", score: 1 },
      { id: "P1_D", text: "No hemos trabajado formalmente en definir o medir el impacto de nuestro modelo", score: 0 },
    ],
  },
  {
    id: "P2",
    blockLabel: "BLOQUE 1 — BASE REGENERATIVA",
    blockDescription: "Evalúa la raíz del sistema: tu modelo de negocio y la presencia de un propósito verificable.",
    dimension: "proposito_verificable",
    text: "¿Tu empresa tiene un propósito definido que puedas demostrar con datos o hechos verificables?",
    options: [
      { id: "P2_A", text: "Sí — tenemos un propósito claro, documentado, con métricas de avance y verificable por cualquier stakeholder", score: 3 },
      { id: "P2_B", text: "Tenemos un propósito definido, pero todavía nos cuesta medirlo o demostrarlo con datos concretos", score: 2 },
      { id: "P2_C", text: "Estamos trabajando en articularlo con más precisión — existe la intención pero no el sistema", score: 1 },
      { id: "P2_D", text: "Tenemos valores generales pero no un propósito específico y verificable", score: 0 },
    ],
  },
  {
    id: "P3",
    blockLabel: "BLOQUE 2 — TERRITORIO E IDENTIDAD",
    blockDescription: "Evalúa la conexión con el territorio de origen y la madurez visual de tu marca.",
    dimension: "voces_territorio",
    text: "¿La narrativa de tu marca incluye y está informada por el territorio, las comunidades o el ecosistema de donde proviene tu producto o servicio?",
    options: [
      { id: "P3_A", text: "Sí — el territorio, las comunidades y/o el ecosistema son el corazón de nuestra identidad y narrativa, y está documentado y verificable", score: 3 },
      { id: "P3_B", text: "Lo integramos en nuestra comunicación, pero no de forma sistemática ni como ventaja narrativa central", score: 2 },
      { id: "P3_C", text: "Sabemos que es importante pero aún no hemos desarrollado esa narrativa de forma estructurada", score: 1 },
      { id: "P3_D", text: "No — nuestra narrativa es genérica o está centrada en atributos del producto, sin conexión explícita con el territorio", score: 0 },
    ],
  },
  {
    id: "P4",
    blockLabel: "BLOQUE 2 — TERRITORIO E IDENTIDAD",
    blockDescription: "Evalúa la conexión con el territorio de origen y la madurez visual de tu marca.",
    dimension: "identidad_visual",
    text: "¿Cómo describirías la identidad visual de tu marca hoy?",
    options: [
      { id: "P4_A", text: "Tiene una identidad propia y técnicamente diferenciada — al verla, no se confunde con ninguna otra marca del sector", score: 3 },
      { id: "P4_B", text: "Es profesional y consistente, pero si la comparo con marcas similares, visualmente no hay mucha diferencia", score: 2 },
      { id: "P4_C", text: "Es básica o fue construida sin un proceso estratégico detrás — funcional pero sin carácter propio", score: 1 },
      { id: "P4_D", text: "No hemos invertido en identidad visual todavía o la actual está claramente desactualizada", score: 0 },
    ],
  },
  {
    id: "P5",
    blockLabel: "BLOQUE 3 — DEMOSTRACIÓN Y NARRATIVA",
    blockDescription: "Evalúa si demuestras (no solo comunicas) tu impacto, y la coherencia narrativa de tu marca.",
    dimension: "demostracion_impacto",
    text: "¿Tienes mecanismos concretos para demostrar el impacto de tu marca — no solo para comunicarlo?",
    options: [
      { id: "P5_A", text: "Sí — trazabilidad verificable, certificaciones, reportes auditables o datos públicos que cualquiera puede consultar", score: 3 },
      { id: "P5_B", text: "Tenemos datos e iniciativas reales, pero no están sistematizados ni comunicados de forma que el cliente pueda verificarlos", score: 2 },
      { id: "P5_C", text: "Estamos trabajando en ello — tenemos las prácticas pero todavía no el sistema de documentación y comunicación", score: 1 },
      { id: "P5_D", text: "Por ahora solo comunicamos afirmaciones — no tenemos mecanismos de demostración estructurados", score: 0 },
    ],
  },
  {
    id: "P6",
    blockLabel: "BLOQUE 3 — DEMOSTRACIÓN Y NARRATIVA",
    blockDescription: "Evalúa si demuestras (no solo comunicas) tu impacto, y la coherencia narrativa de tu marca.",
    dimension: "coherencia_narrativa",
    text: "¿Existe coherencia entre lo que tu marca comunica, lo que tu empresa realmente hace y lo que cobra?",
    options: [
      { id: "P6_A", text: "Sí — lo que comunicamos, lo que hacemos y lo que cobramos están alineados y podemos demostrarlo en cualquier punto de contacto", score: 3 },
      { id: "P6_B", text: "Hay coherencia en los elementos principales pero existen brechas en algunos puntos de contacto que sabemos que debemos cerrar", score: 2 },
      { id: "P6_C", text: "Detectamos inconsistencias entre nuestra comunicación y nuestra operación real, pero aún no tenemos un plan para resolverlas", score: 1 },
      { id: "P6_D", text: "Hay una brecha significativa entre lo que comunicamos hacia afuera y lo que somos hoy — es un tema pendiente", score: 0 },
    ],
  },
  {
    id: "P7",
    blockLabel: "BLOQUE 4 — PRECIO Y APRENDIZAJE",
    blockDescription: "Evalúa si el precio refleja el valor regenerativo y si tu marca aprende y evoluciona.",
    dimension: "pricing_regenerativo",
    text: "¿El precio de tu producto o servicio refleja el valor regenerativo que genera, o compites principalmente por precio?",
    options: [
      { id: "P7_A", text: "Tenemos precio premium sostenido — nuestros clientes lo pagan específicamente por la identidad y el impacto verificable de la marca", score: 3 },
      { id: "P7_B", text: "Queremos cobrar más y creemos tener los atributos para ello, pero el mercado aún no lo reconoce suficientemente", score: 2 },
      { id: "P7_C", text: "Competimos en precio porque no hemos construido la diferenciación que justifica un precio mayor", score: 1 },
      { id: "P7_D", text: "Nuestros márgenes actuales no nos permiten plantearnos el precio premium todavía — sobrevivimos antes de crecer", score: 0 },
    ],
  },
  {
    id: "P8",
    blockLabel: "BLOQUE 4 — PRECIO Y APRENDIZAJE",
    blockDescription: "Evalúa si el precio refleja el valor regenerativo y si tu marca aprende y evoluciona.",
    dimension: "retroalimentacion_aprendizaje",
    text: "¿Tu marca tiene mecanismos para escuchar al territorio, los clientes y las comunidades, aprender de esa retroalimentación, y evolucionar sin perder coherencia?",
    options: [
      { id: "P8_A", text: "Sí — tenemos procesos sistemáticos de escucha (comunidades, clientes, territorio) y la marca evoluciona a partir de esa retroalimentación", score: 3 },
      { id: "P8_B", text: "Escuchamos de forma informal y reactiva, pero no tenemos un sistema estructurado de retroalimentación que informe la marca", score: 2 },
      { id: "P8_C", text: "Lo hacemos ocasionalmente pero sin consistencia — depende de la iniciativa individual más que de un proceso establecido", score: 1 },
      { id: "P8_D", text: "La marca fue definida en un momento específico y desde entonces no ha incorporado retroalimentación sistemática", score: 0 },
    ],
  },
  {
    id: "P9",
    blockLabel: "BLOQUE 5 — URGENCIA",
    blockDescription: "Determina tu horizonte temporal de transformación.",
    dimension: "urgencia",
    text: "¿En qué horizonte de tiempo necesitas transformar la identidad y el posicionamiento de tu marca?",
    options: [
      { id: "P9_A", text: "Es urgente — hay una oportunidad de mercado abierta, un proceso de inversión en curso, o una crisis de posicionamiento real", score: 3 },
      { id: "P9_B", text: "En los próximos 6 meses — hay presión comercial o competitiva real que lo hace prioritario", score: 2 },
      { id: "P9_C", text: "En el próximo año — es una prioridad estratégica planificada pero sin urgencia inmediata", score: 2 },
      { id: "P9_D", text: "No tenemos un plazo definido — es un \"cuando podamos\"", score: 0 },
    ],
  },
];

export const SECTORS = [
  "Agricultura / Agroforestería / FoodTech",
  "Moda / Textiles / Artesanía",
  "Turismo Regenerativo / Hospitalidad",
  "Cosmética / Cuidado Personal / Bionegocios",
  "Consultoría / Servicios de Impacto",
  "Climate Tech / AgTech / Startups de impacto",
  "Retail / Consumo consciente",
  "Manufactura / Packaging circular",
  "Educación / Comunicación de impacto",
  "Otro",
];

export const COMPANY_SIZES = [
  "Solo o dupla fundadora",
  "2 a 10 personas",
  "11 a 50 personas",
  "Más de 50 personas",
  "División de empresa corporativa",
];

export const COUNTRIES = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica",
  "Cuba", "Ecuador", "El Salvador", "Guatemala", "Honduras", "México",
  "Nicaragua", "Panamá", "Paraguay", "Perú", "República Dominicana",
  "Uruguay", "Venezuela", "Otro",
];

export const CALCULATING_MESSAGES = [
  "Evaluando la base regenerativa del modelo...",
  "Analizando identidad, territorio y narrativa...",
  "Revisando coherencia entre impacto y precio...",
  "Calculando tu posición en el espectro regenerativo...",
  "Generando análisis personalizado...",
];

// ============================================================
// Scoring Logic
// ============================================================

function getTemperatura(scoreP9: number): Temperatura {
  if (scoreP9 === 3) return "caliente";
  if (scoreP9 >= 2) return "tibio";
  return "frio";
}

export function calculateResult(scores: Record<string, number>): DiagnosticResult {
  const scoreEspectro = scores.P1 + scores.P2 + scores.P3 + scores.P4 +
    scores.P5 + scores.P6 + scores.P7 + scores.P8;

  const temperatura = getTemperatura(scores.P9);

  const dimensiones: Record<string, number> = {
    naturaleza_modelo: Math.round((scores.P1 / 3) * 100),
    proposito_verificable: Math.round((scores.P2 / 3) * 100),
    voces_territorio: Math.round((scores.P3 / 3) * 100),
    identidad_visual: Math.round((scores.P4 / 3) * 100),
    demostracion_impacto: Math.round((scores.P5 / 3) * 100),
    coherencia_narrativa: Math.round((scores.P6 / 3) * 100),
    pricing_regenerativo: Math.round((scores.P7 / 3) * 100),
    retroalimentacion_aprendizaje: Math.round((scores.P8 / 3) * 100),
  };

  // Veto Caliente → Nativa
  if (scores.P5 === 3 && scores.P7 === 3) {
    const etapa: Etapa = "nativa";
    return { etapa, porVeto: true, veto: "caliente", temperatura, scoreEspectro, dimensiones, tagCRM: `${etapa}_${temperatura}` };
  }

  // Veto Frío → Observadora
  if (scores.P3 === 0 && scores.P4 === 0) {
    const etapa: Etapa = "observadora";
    return { etapa, porVeto: true, veto: "frio", temperatura, scoreEspectro, dimensiones, tagCRM: `${etapa}_${temperatura}` };
  }

  // Clasificación base
  let etapa: Etapa;
  if (scoreEspectro >= 20) etapa = "nativa";
  else if (scoreEspectro >= 12) etapa = "caminante";
  else etapa = "observadora";

  return { etapa, porVeto: false, veto: null, temperatura, scoreEspectro, dimensiones, tagCRM: `${etapa}_${temperatura}` };
}

// ============================================================
// Result Content per Etapa
// ============================================================

const WA_NUMBER = "51974620309";
const WA_MESSAGE = encodeURIComponent("Hola, quiero que mi marca sea regenerativa");
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export function getEtapaContent(etapa: Etapa, temperatura: Temperatura): EtapaContent {
  const content: Record<Etapa, EtapaContent> = {
    observadora: {
      badge: "",
      badgeColor: "text-signal",
      etiqueta: "La Marca con Potencial No Activado",
      titular: "Tienes el producto.\nTodavía no tienes el sistema para que el mercado lo vea.",
      datoContexto: "Este perfil aparece en aproximadamente el 38% de los diagnósticos completados en América Latina. Es el punto de partida más frecuente.",
      momentoActual: "Tienes atributos genuinamente valiosos que el mercado no está viendo todavía — no porque no existan, sino porque la arquitectura de marca que los haría visibles y pagables todavía no está construida.\n\nEn esta etapa, comunicar más no resuelve el problema. Hacer un logo nuevo tampoco. Construir el sistema sí.\n\nEl riesgo del Nuevo Ecogenérico es más alto aquí: la tentación de \"arreglar\" la marca con mejor diseño o más contenido en redes produce un resultado que se ve igual que todos los demás. Una inversión sin retorno.",
      riesgoPrincipal: "Cada mes sin arquitectura estratégica de marca es un mes compitiendo por precio con marcas que tienen menos valores que tú pero más claridad de comunicación. La ventana para definir tu territorio en tu categoría está abierta — pero no indefinidamente.",
      oportunidadConcreta: "El mayor activo de una marca Observadora es que puede construir su identidad desde cero, sin inercias que corregir ni reputación dañada que gestionar. Con el framework correcto, lo que las marcas Nativas tardaron años en construir puede trazarse en semanas. El punto de partida honesto es la ventaja.",
      ctaPrimario: { label: "Descarga el primer capítulo de Regen Brands — gratis →", href: "https://wa.me/51974620309?text=Hola%2C%20quiero%20pre-ordenar%20el%20libro%20Regen%20Brand" },
      ctaSecundario: { label: "Ver qué es el Impact Brand Audit →", href: "https://wa.me/51974620309?text=Hola%2C%20quiero%20acceder%20a%20la%20plataforma%20de%20herramientas%20de%20Regen%20Brands" },
    },
    caminante: {
      badge: "",
      badgeColor: "text-signal",
      etiqueta: "La Marca en Transición",
      titular: "Haces las cosas bien.\nEl problema es que el mercado todavía no lo paga.",
      datoContexto: "Este perfil es el más frecuente en ALC — aparece en aproximadamente el 45% de los diagnósticos. Es la etapa donde más valor se pierde y donde el framework Regen Brands tiene mayor impacto demostrado.",
      momentoActual: "Estás en el punto más peligroso del mercado de impacto: el Error del Medio. Tienes costos de una marca regenerativa — inversión real en prácticas, certificaciones, cadena de valor — pero cobras precios de una marca genérica.\n\nTu problema no es lo que haces. Es la brecha entre lo que haces y cómo lo cuentas, y entre cómo lo cuentas y lo que cobras.\n\nProbablemente has intentado comunicar tu impacto y el mensaje no resonó como esperabas. O peor: alguien ha cuestionado tus afirmaciones aunque estás siendo honesto.",
      riesgoPrincipal: "Sin arquitectura estratégica, las marcas Caminantes se quedan en esta etapa indefinidamente. El mercado no premia el esfuerzo — premia la coherencia y la narrativa verificable. El tiempo que pasa sin resolver esto es tiempo compitiendo en precio contra marcas que invierten menos que tú en impacto real.",
      oportunidadConcreta: "Las marcas Caminantes tienen el mayor retorno potencial del trabajo de branding: la base ya está. El impacto es real, las prácticas existen, la intención es auténtica. Solo falta el sistema para comunicarlo con la sofisticación que justifica el precio premium — y conectar el territorio y las comunidades de origen con la narrativa de forma que ninguna agencia urbana pueda replicar.",
      ctaPrimario: { label: "Obtener el libro Regen Brands →", href: "https://wa.me/51974620309?text=Hola%2C%20quiero%20pre-ordenar%20el%20libro%20Regen%20Brand" },
      ctaSecundario: { label: "Conocer el Impact Brand Sprint →", href: "https://wa.me/51974620309?text=Hola%2C%20quiero%20acceder%20a%20la%20plataforma%20de%20herramientas%20de%20Regen%20Brands" },
    },
    nativa: {
      badge: "",
      badgeColor: "text-signal",
      etiqueta: "La Marca Regenerativa Avanzada",
      titular: "Tienes el ADN correcto y el impacto verificable.\nEl siguiente nivel es la arquitectura que lo escale.",
      datoContexto: "Este perfil representa aproximadamente el 17% de los diagnósticos completados en América Latina. Es el grupo más selecto — y el que enfrenta los desafíos más complejos.",
      momentoActual: "Tienes lo más difícil de construir: impacto real, narrativa verificable y clientes que ya pagan por ello. Eso no se improvisa.\n\nEn esta etapa, el desafío no es construir desde cero — es sistematizar la arquitectura de marca para que funcione sin depender de ti personalmente, que resista el escrutinio de inversores internacionales, y que no se rompa cuando el crecimiento exponga grietas que hoy son invisibles.\n\nLa dimensión que más frecuentemente falta en marcas Nativas es la de retroalimentación sistemática con el territorio y las comunidades. La marca fue construida — pero ¿sigue aprendiendo de donde viene?",
      riesgoPrincipal: "Las marcas Nativas son las más vulnerables al escrutinio. Con mayor visibilidad viene mayor expectativa de coherencia. Una narrativa poderosa sin sistema de gestión es una narrativa que eventualmente se contradice bajo presión — y las crisis de credibilidad son más costosas cuando hay más que perder.",
      oportunidadConcreta: "Con el sistema correcto, una marca Nativa puede aspirar a mercados de exportación, inversión internacional y co-creación con fondos y marcas globales. La narrativa de origen que tienes puede convertirse en ventaja competitiva en mercados donde la trazabilidad y la autenticidad de territorio ya son el precio de entrada. Eso se arquitecta — no se improvisa.",
      ctaPrimario: { label: "Agenda una sesión de diagnóstico con ThousandFold →", href: WA_URL },
      ctaSecundario: { label: "Conocer el Impact Brand Sprint →", href: "https://wa.me/51974620309?text=Hola%2C%20quiero%20acceder%20a%20la%20plataforma%20de%20herramientas%20de%20Regen%20Brands" },
      ctaWhatsApp: temperatura === "caliente" ? { label: "Hablar por WhatsApp →", href: WA_URL } : undefined,
    },
  };

  return content[etapa];
}
