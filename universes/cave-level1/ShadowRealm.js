import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class ShadowRealm {
  constructor(scene) {
    const geo = new THREE.SphereGeometry(50, 64, 64);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 1,
      metalness: 0,
      side: THREE.BackSide
    });

    const cave = new THREE.Mesh(geo, mat);
    scene.add(cave);
  }
}
