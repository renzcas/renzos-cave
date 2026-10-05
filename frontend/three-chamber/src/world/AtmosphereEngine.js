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

    // subtle breathing: fog density oscillation
    const breath = 0.04 + Math.sin(this.time * 0.4) * 0.01;
    this.fog.density = breath;

    // resonance glow: ambient intensity pulse
    const glow = 0.6 + Math.sin(this.time * 0.7) * 0.15;
    this.ambient.intensity = glow;
  }
}
