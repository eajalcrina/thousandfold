import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeResults, recommendService } from '../rizoma-scoring';

test('computeResults — empty answers yields defaults', () => {
  const r = computeResults({}, {});
  assert.equal(r.totalScore, 40);
  assert.equal(r.level, 'Caminante');
  assert.equal(r.arcScores.reduce((a, b) => a + b, 0), 0);
  assert.equal(r.topBrechas.length, 3);
});

test('computeResults — territorio floor yields observadora', () => {
  const r = computeResults({ t2: 0, t3: 0, t4: 0 }, {});
  assert.equal(r.layerScores.territorio, 0);
  assert.equal(r.level, 'Observadora');
});

test('computeResults — maximized answers yield nativa', () => {
  const answers: Record<string, number> = {
    t2: 3, t3: 3, t4: 3,
    pr1: 3, pr3: 2,
    id1: 3, id2: 0,
    ar1: 3, ar3: 3,
    ex1: 3, ex2: 3, ex3: 3,
    na1: 3, na2: 3, na3: 3,
  };
  const scaleValues: Record<string, number> = {
    t1: 5, pr2: 5, id3: 5, ar2: 5, ex4: 5, na4: 5,
  };
  const r = computeResults(answers, scaleValues);
  assert.ok(r.totalScore >= 65, `expected nativa, got ${r.totalScore}`);
  assert.equal(r.level, 'Nativa');
});

test('recommendService — prefers archetype + brecha match', () => {
  const id = recommendService(1, 50, ['identidad', 'expresion', 'narrativa']);
  assert.equal(id, 'brand-identity-system');
});

test('recommendService — falls back by low score', () => {
  const id = recommendService(99, 30, ['territorio', 'proposito', 'identidad']);
  assert.equal(id, 'regen-brand-sprint');
});
