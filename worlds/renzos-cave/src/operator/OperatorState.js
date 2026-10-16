const MAX_COMMUTATOR_NORM = Math.SQRT2;

export const OPERATOR_KINDS = Object.freeze({
  ROTATION: 'rotation',
  PROJECTION: 'projection'
});

export class OperatorState {
  constructor(kind = OPERATOR_KINDS.PROJECTION, angleDegrees = 0) {
    this.setKind(kind);
    this.setAngle(angleDegrees);
  }

  setKind(kind) {
    if (!Object.values(OPERATOR_KINDS).includes(kind)) {
      throw new RangeError(`Unsupported operator kind: ${kind}`);
    }
    this.kind = kind;
  }

  setAngle(angleDegrees) {
    if (!Number.isFinite(angleDegrees)) {
      throw new TypeError('Operator angle must be a finite number.');
    }
    this.angleDegrees = angleDegrees;
  }

  get matrix() {
    const angle = (this.angleDegrees * Math.PI) / 180;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);

    if (this.kind === OPERATOR_KINDS.ROTATION) {
      return [cosine, -sine, sine, cosine];
    }

    return [
      cosine * cosine,
      cosine * sine,
      cosine * sine,
      sine * sine
    ];
  }

  apply(vector) {
    if (!Array.isArray(vector) || vector.length !== 2 || !vector.every(Number.isFinite)) {
      throw new TypeError('Operator input must be a two-dimensional finite vector.');
    }
    return applyMatrix(this.matrix, vector);
  }

  normOf(vector) {
    return vectorNorm(this.apply(vector));
  }
}

export function applyMatrix(matrix, vector) {
  assertMatrix(matrix);
  if (!Array.isArray(vector) || vector.length !== 2 || !vector.every(Number.isFinite)) {
    throw new TypeError('Matrix input must be a two-dimensional finite vector.');
  }
  return [
    matrix[0] * vector[0] + matrix[1] * vector[1],
    matrix[2] * vector[0] + matrix[3] * vector[1]
  ];
}

export function composeOperators(outer, inner) {
  assertMatrix(outer);
  assertMatrix(inner);
  return [
    outer[0] * inner[0] + outer[1] * inner[2],
    outer[0] * inner[1] + outer[1] * inner[3],
    outer[2] * inner[0] + outer[3] * inner[2],
    outer[2] * inner[1] + outer[3] * inner[3]
  ];
}

export function commutatorNorm(first, second) {
  const firstThenSecond = composeOperators(first, second);
  const secondThenFirst = composeOperators(second, first);
  return Math.hypot(
    firstThenSecond[0] - secondThenFirst[0],
    firstThenSecond[1] - secondThenFirst[1],
    firstThenSecond[2] - secondThenFirst[2],
    firstThenSecond[3] - secondThenFirst[3]
  );
}

export function resonanceScore(first, second) {
  return Math.max(0, Math.min(1, 1 - commutatorNorm(first, second) / MAX_COMMUTATOR_NORM));
}

export function vectorNorm(vector) {
  if (!Array.isArray(vector) || vector.length !== 2 || !vector.every(Number.isFinite)) {
    throw new TypeError('Vector must contain two finite numbers.');
  }
  return Math.hypot(vector[0], vector[1]);
}

function assertMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length !== 4 || !matrix.every(Number.isFinite)) {
    throw new TypeError('Operator matrix must contain four finite numbers.');
  }
}
