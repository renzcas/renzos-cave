import * as THREE from 'three';

export default class Lighting {
  constructor(scene) {
    this.scene = scene;
  }

  init() {
    const ambient = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambient);

    const crystalLight = new THREE.PointLight(0x66ccff, 2, 20);
    crystalLight.position.set(0, 3, 0);
    this.scene.add(crystalLight);
  }

  update(dt) {
    // Future: flicker, pulse, crystal glow animation
  }
}
