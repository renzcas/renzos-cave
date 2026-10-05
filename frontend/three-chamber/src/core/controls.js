import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.minDistance = 2;
  controls.maxDistance = 10;
  return controls;
}
