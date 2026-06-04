export class FormGeometry {
  constructor() {
    this.snapshot = {
      lines: [],
      planes: [],
      attractor: { x: 0, y: 0 },
      archetypeVectors: {}
    };
  }

  compute({ archetypes, goodPull, resonance, geometryBias }) {
    const lines = this.computeLines(archetypes);
    const planes = this.computePlanes(resonance, geometryBias.warp);
    const attractor = this.computeAttractor(goodPull, geometryBias.attractor);
    const archetypeVectors = this.computeArchetypeVectors(archetypes);

    this.snapshot = { lines, planes, attractor, archetypeVectors };
    return this.snapshot;
  }

  computeLines(archetypes) {
    return Object.entries(archetypes).map(([name, strength], i) => {
      const angle = (i / 5) * Math.PI * 2;
      return {
        name,
        x1: 0,
        y1: 0,
        x2: Math.cos(angle) * strength,
        y2: Math.sin(angle) * strength
      };
    });
  }

  computePlanes(resonance, warpBias) {
    const c = resonance.coherence;
    const t = resonance.tension;

    return [
      {
        name: "coherence_plane",
        normal: { x: 0, y: 0, z: 1 },
        warp: c * 0.1 * warpBias
      },
      {
        name: "tension_plane",
        normal: { x: 0, y: 1, z: 0 },
        warp: t * 0.2 * warpBias
      }
    ];
  }

  computeAttractor(goodPull, bias) {
    return {
      x: 0,
      y: goodPull * 0.5 * bias
    };
  }

  computeArchetypeVectors(archetypes) {
    const out = {};
    for (const [name, strength] of Object.entries(archetypes)) {
      out[name] = {
        x: strength,
        y: strength * 0.5
      };
    }
    return out;
  }
}
