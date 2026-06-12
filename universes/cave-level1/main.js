import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { ShadowRealm } from './ShadowRealm.js';
import { Labyrinth1 } from './Labyrinth1.js';
import { Lighting } from './Lighting.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const realm = new ShadowRealm(scene);
const labyrinth = new Labyrinth1(scene);
const lighting = new Lighting(scene);

camera.position.set(0, 1.7, 0);

function loop() {
  requestAnimationFrame(loop);
  renderer.render(scene, camera);
}

loop();
