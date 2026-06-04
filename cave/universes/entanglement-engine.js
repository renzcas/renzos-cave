// entanglement-engine.js
// Tracks entangled universe pairs.

export function createEntanglementEngine({ stateBus }) {
  const pairs = [];

  function entangle(a, b) {
    pairs.push({ a, b, createdAt: Date.now() });
    stateBus.append("entanglementTrace", { a, b });
  }

  function getPairs() {
    return pairs.slice();
  }

  return { entangle, getPairs };
}
