import { createScene } from '../core/scene.js';
import { createCamera } from '../core/camera.js';
import { createLighting } from '../core/lighting.js';
import { createControls } from '../core/controls.js';

export class WorldScene {
  constructor(renderer) {
    this.renderer = renderer;

    this.scene = createScene();
    this.camera = createCamera();
    this.controls = createControls(this.camera, renderer);
    const lights = createLighting(this.scene);

    this.ambient = lights.ambient;
    this.rim = lights.rim;
  }

  update(packet) {
    this.controls.update();
  }
}
