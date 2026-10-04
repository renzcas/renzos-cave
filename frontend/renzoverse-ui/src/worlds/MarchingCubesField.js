// MarchingCubesField.js — Volumetric Region Mesh Generator
import * as THREE from 'three';
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js';

export class MarchingCubesField {
  constructor(scene) {
    this.resolution = 32;
    this.effect = new MarchingCubes(
      this.resolution,
      new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        roughness: 0.4,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85
      }),
      true,
      true
    );

    this.effect.position.set(0, 0, 0);
    this.effect.scale.set(4, 4, 4);

    this.effect.name = "MarchingCubesMesh";
    scene.add(this.effect);
  }

  update(regions) {
    if (!regions || regions.length === 0) return;

    this.effect.reset();

    regions.forEach(r => {
      const x = (r.x + 2) / 4; // normalize -2..2 → 0..1
      const y = (r.y + 2) / 4;
      const z = (r.z + 2) / 4;

      const strength = r.s * 0.8 + 0.2;

      this.effect.addBall(x, y, z, strength);
    });

    this.effect.update();
  }
}
