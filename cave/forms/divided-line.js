export const RealityLevel = {
  EIKASIA: 0,
  PISTIS: 1,
  DIANOIA: 2,
  NOESIS: 3
};

export class DividedLine {
  constructor() {
    this.level = RealityLevel.PISTIS;
  }

  computeLevel(chamber, cameraMode) {
    const chamberBias = {
      entrance: RealityLevel.EIKASIA,
      fire:     RealityLevel.PISTIS,
      grove:    RealityLevel.DIANOIA,
      deep:     RealityLevel.NOESIS
    }[chamber] ?? RealityLevel.PISTIS;

    const cameraBias = {
      subjective: RealityLevel.EIKASIA,
      physical:   RealityLevel.PISTIS,
      symbolic:   RealityLevel.DIANOIA,
      form:       RealityLevel.NOESIS
    }[cameraMode] ?? RealityLevel.PISTIS;

    this.level = Math.max(chamberBias, cameraBias);
    return this.level;
  }

  cognitiveBias(level) {
    switch (level) {
      case RealityLevel.EIKASIA: return { noise: 0.6, structure: 0.1, clarity: 0.1 };
      case RealityLevel.PISTIS:  return { noise: 0.2, structure: 0.3, clarity: 0.3 };
      case RealityLevel.DIANOIA: return { noise: 0.1, structure: 0.6, clarity: 0.4 };
      case RealityLevel.NOESIS:  return { noise: 0.05, structure: 0.8, clarity: 0.9 };
    }
  }

  geometryBias(level) {
    switch (level) {
      case RealityLevel.EIKASIA: return { warp: 0.4, attractor: 0.1 };
      case RealityLevel.PISTIS:  return { warp: 0.2, attractor: 0.3 };
      case RealityLevel.DIANOIA: return { warp: 0.1, attractor: 0.5 };
      case RealityLevel.NOESIS:  return { warp: 0.05, attractor: 0.9 };
    }
  }
}
