import * as THREE from 'three';
import { MarchingCubes as MC } from 'three/examples/jsm/objects/MarchingCubes.js';

export class MarchingCubes {
  constructor(world) {
    this.world = world;

    this.resolution = 32;

    this.field = new MC(
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

    this.field.position.set(0, 0, 0);
    this.field.scale.set(4, 4, 4);
    this.field.name = "CaveSharpMarchingCubes";

    world.scene.add(this.field);
  }

  update(voxels) {
    if (!voxels || voxels.length === 0) {
      this.field.reset();
      return;
    }

    this.field.reset();

    for (const v of voxels) {
      const x = (v.x + 2) / 4;
      const y = (v.y + 2) / 4;
      const z = (v.z + 2) / 4;

      const strength = v.s * 0.8 + 0.2;

      this.field.addBall(x, y, z, strength);
    }

    this.field.update();
  }
}
