import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class CaveWorld {
  constructor(scene) {
    this.scene = scene;

    const geo = new THREE.SphereGeometry(40, 64, 64);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 1,
      metalness: 0,
      side: THREE.BackSide
    });

    const cave = new THREE.Mesh(geo, mat);
    scene.add(cave);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, 0);
    scene.add(light);
  }
}
