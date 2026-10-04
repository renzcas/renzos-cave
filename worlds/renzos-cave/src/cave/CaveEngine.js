import * as THREE from 'three';
import MarchingCubesGenerator from './MarchingCubesGenerator.js';
import Atmosphere from './Atmosphere.js';
import Lighting from './Lighting.js';

export default class CaveEngine {
  constructor() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.renderer = null;
    this.camera = null;

    this.atmosphere = null;
    this.lighting = null;
    this.caveMesh = null;
  }

  init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.set(0, 1.6, 3);

    // Lighting system
    this.lighting = new Lighting(this.scene);
    this.lighting.init();

    // Atmosphere system
    this.atmosphere = new Atmosphere(this.scene);
    this.atmosphere.init();

    // Cave geometry (currently voxel-based placeholder)
    const generator = new MarchingCubesGenerator();
    this.caveMesh = generator.buildMesh();
    this.scene.add(this.caveMesh);

    // Resize handler
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  start() {
    const loop = () => {
      requestAnimationFrame(loop);
      const dt = this.clock.getDelta();
      this.update(dt);
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  update(dt) {
    if (this.atmosphere) this.atmosphere.update(dt);
    if (this.lighting) this.lighting.update(dt);
  }
}
