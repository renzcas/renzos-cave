import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyMatrix,
  commutatorNorm,
  composeOperators,
  OPERATOR_KINDS,
  OperatorState,
  resonanceScore,
  vectorNorm
} from '../src/operator/OperatorState.js';

test('rotation is unitary and preserves vector length', () => {
  const rotation = new OperatorState(OPERATOR_KINDS.ROTATION, 73);
  const vector = [2.5, -4];

  assert.ok(Math.abs(rotation.normOf(vector) - vectorNorm(vector)) < 1e-12);
});

test('projection is idempotent and removes the orthogonal component', () => {
  const projection = new OperatorState(OPERATOR_KINDS.PROJECTION, 35);
  const projected = projection.apply([1, 0]);
  const projectedAgain = projection.apply(projected);

  assert.ok(Math.abs(projectedAgain[0] - projected[0]) < 1e-12);
  assert.ok(Math.abs(projectedAgain[1] - projected[1]) < 1e-12);
  assert.ok(projection.normOf([1, 0]) < 1);
});

test('aligned projections commute and have full resonance', () => {
  const first = new OperatorState(OPERATOR_KINDS.PROJECTION, 35);
  const second = new OperatorState(OPERATOR_KINDS.PROJECTION, 35);

  assert.ok(commutatorNorm(first.matrix, second.matrix) < 1e-12);
  assert.equal(resonanceScore(first.matrix, second.matrix), 1);
});

test('different projection axes do not commute in the general case', () => {
  const first = new OperatorState(OPERATOR_KINDS.PROJECTION, 0);
  const second = new OperatorState(OPERATOR_KINDS.PROJECTION, 35);

  assert.ok(commutatorNorm(first.matrix, second.matrix) > 0);
  assert.ok(resonanceScore(first.matrix, second.matrix) < 1);
});

test('operator composition is ordered and matrix application matches it', () => {
  const rotation = new OperatorState(OPERATOR_KINDS.ROTATION, 40);
  const projection = new OperatorState(OPERATOR_KINDS.PROJECTION, 0);
  const vector = [0, 1];
  const rotationThenProjection = composeOperators(projection.matrix, rotation.matrix);
  const projectionThenRotation = composeOperators(rotation.matrix, projection.matrix);

  assert.deepEqual(applyMatrix(rotationThenProjection, vector), projection.apply(rotation.apply(vector)));
  assert.notDeepEqual(
    applyMatrix(rotationThenProjection, vector),
    applyMatrix(projectionThenRotation, vector)
  );
});

test('invalid operators and vectors report input errors', () => {
  assert.throws(() => new OperatorState('scale', 0), RangeError);
  assert.throws(() => new OperatorState(OPERATOR_KINDS.ROTATION, Number.NaN), TypeError);
  assert.throws(() => new OperatorState().apply([1]), TypeError);
});
