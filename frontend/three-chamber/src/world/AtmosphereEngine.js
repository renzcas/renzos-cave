import * as THREE from 'three';

export class AtmosphereEngine {
  constructor(world) {
    this.world = world;
    this.time = 0;

    // base fog + ambient references
    this.fog = world.scene.fog;
    this.ambient = world.ambient;
  }

  update(dt, packet) {
    this.time += dt;
    const density = THREE.MathUtils.clamp(Number(packet?.density) || 0, 0, 1);
    const resonance = THREE.MathUtils.clamp(Number(packet?.resonance) || 0, 0, 10) / 10;

    // subtle breathing: fog density oscillation
    const breath = 0.04 + Math.sin(this.time * 0.4) * 0.01 + density * 0.015;
    this.fog.density = breath;

    // resonance glow: ambient intensity pulse
    const glow = 0.6 + Math.sin(this.time * 0.7) * 0.15 + resonance * 0.15;
    this.ambient.intensity = glow;
  }
}
