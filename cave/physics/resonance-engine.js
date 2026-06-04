// resonance-engine.js
// Simple resonance engine that reacts to "meaning" and updates fields.

export function createResonanceEngine({ stateBus }) {
  const fields = new Map(); // key -> { amplitude, phase, meta }

  function applyMeaning(meaning) {
    const key = meaning.type;
    const field = fields.get(key) ?? { amplitude: 0, phase: 0, meta: {} };
    field.amplitude += 0.1; // TODO: real mapping
    field.phase = (field.phase + 0.05) % (Math.PI * 2);
    fields.set(key, field);
    stateBus.append("resonanceTrace", { key, field });
  }

  function step() {
    const meanings = stateBus.getQueue("meanings");
    while (meanings.length) {
      const m = meanings.shift();
      applyMeaning(m);
    }
  }

  return {
    step,
    getFields: () => fields
  };
}
