import * as THREE from 'three';

export class WorldScene {
  constructor(renderer) {
    this.renderer = renderer;

    this.scene = new THREE.Scene();

    // CaveSharp holographic fog
    this.scene.fog = new THREE.FogExp2(0x0a0f1f, 0.04);

    // Blue neon ambient
    this.ambient = new THREE.AmbientLight(0x3f6fff, 0.6);
    this.scene.add(this.ambient);

    // Holographic rim light
    this.rim = new THREE.DirectionalLight(0x6faaff, 1.2);
    this.rim.position.set(5, 10, 7);
    this.scene.add(this.rim);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 1.2, 6);

    // Resize
    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    });
  }

  update(packet) {
    // Future: camera drift, chamber breathing, holographic pulses
  }
}
