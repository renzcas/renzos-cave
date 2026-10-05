import * as THREE from 'three';

export class CaveSignals {
  constructor(world) {
    this.world = world;

    // HUD flash plane
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x6faaff,
      transparent: true,
      opacity: 0.0
    });

    this.flash = new THREE.Mesh(geo, mat);
    this.flash.position.set(0, 0, -1.5);
    this.flash.renderOrder = 9999;

    world.scene.add(this.flash);

    this.time = 0;
    this.intensity = 0;
  }

  trigger(level = 1.0) {
    this.intensity = Math.min(1.0, this.intensity + level);
  }

  update(dt, packet) {
    this.time += dt;

    // decay intensity
    this.intensity *= 0.92;

    // neon pulse
    const pulse = Math.sin(this.time * 8.0) * 0.5 + 0.5;

    this.flash.material.opacity = this.intensity * pulse * 0.6;
  }
}
