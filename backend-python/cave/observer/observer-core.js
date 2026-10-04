import influenceVectors from "./influence-vectors.js"
export function observeState(state) {
  const { physics, symbolic, resonance, scheduler } = state;

  return {
    timestamp: Date.now(),
    coherence: computeCoherence(physics, symbolic, resonance),
    drift: computeDrift(scheduler),
    influence: computeInfluence(symbolic, influenceVectors)
  };
}

function computeCoherence(physics, symbolic, resonance) {
  return {
    fieldSymbolAlignment: dot(physics.field, symbolic.vector),
    resonanceDensity: resonance.density,
    symbolicEnergy: symbolic.energy
  };
}

function computeDrift(scheduler) {
  return {
    tick: scheduler.tick,
    driftRate: scheduler.tick % 50 === 0 ? 1 : 0
  };
}

function computeInfluence(symbolic, vectors) {
  return vectors.map(v => ({
    name: v.name,
    weight: dot(symbolic.vector, v.vector)
  }));
}

function dot(a, b) {
  if (!a || !b) return 0;
  return a.reduce((sum, x, i) => sum + x * (b[i] || 0), 0);
}
