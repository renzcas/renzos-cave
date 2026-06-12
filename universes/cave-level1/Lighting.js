import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class Lighting {
  constructor(scene) {
    const fire = new THREE.PointLight(0xff4400, 2, 40);
    fire.position.set(0, 1, -5);
    scene.add(fire);

    const ambient = new THREE.AmbientLight(0x220000, 0.2);
    scene.add(ambient);
  }
}
