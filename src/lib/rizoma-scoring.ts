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
