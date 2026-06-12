import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class Labyrinth1 {
  constructor(scene) {
    const wallGeo = new THREE.BoxGeometry(4, 3, 1);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 1
    });

    for (let i = 0; i < 20; i++) {
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(
        (Math.random() - 0.5) * 40,
        1.5,
        (Math.random() - 0.5) * 40
      );
      scene.add(wall);
    }
  }
}
