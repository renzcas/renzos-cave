export class ArchetypeEngine {
  compute({ beastInfluence, attentionVector, oagSnapshot, resonance, vmState }) {
    const out = {};

    for (const [beast, influence] of Object.entries(beastInfluence)) {
      out[beast] =
        influence * 0.5 +
        (attentionVector[beast] || 0) * 0.3 +
        (oagSnapshot[beast] || 0) * 0.1 +
        resonance.coherence * 0.1;
    }

    return out;
  }
}
