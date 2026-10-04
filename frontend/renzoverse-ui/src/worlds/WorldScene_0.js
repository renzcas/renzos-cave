import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { loadWorld } from './WorldLoader.js';

export function createWorldViewer(renderer, camera) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(5, 5, 5);

  scene.add(ambient);
  scene.add(directional);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Load world
  loadWorld(scene);

  return { scene, controls };
}
