import * as THREE from 'three';

export default class Atmosphere {
  constructor(scene) {
    this.scene = scene;
  }

  init() {
    this.scene.fog = new THREE.FogExp2(0x000000, 0.15);
  }

  update(dt) {
    // Future: drifting fog, particle effects
  }
}
