// script.js v2 — Fire & Boulders Gothic Cave Engine
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { createMinotaur } from './engine/creatures/minotaur.js';

// Canvas
const canvas = document.getElementById('cave-canvas');

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0d0a07, 0.04);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 2, 14);

// Lighting — Fire + Darkness
const ambient = new THREE.AmbientLight(0x332211, 0.6);
scene.add(ambient);

const fireLight = new THREE.PointLight(0xff5522, 2.5, 40);
fireLight.position.set(0, 2.5, 4);
scene.add(fireLight);

// Rocky Cave Geometry
const caveGeometry = new THREE.CylinderGeometry(10, 10, 300, 32, 128, true);
caveGeometry.rotateZ(Math.PI / 2);

// Add noise to cave walls
for (let i = 0; i < caveGeometry.attributes.position.count; i++) {
  const x = caveGeometry.attributes.position.getX(i);
  const y = caveGeometry.attributes.position.getY(i);
  const z = caveGeometry.attributes.position.getZ(i);

  const noise = (Math.sin(x * 0.3) + Math.sin(y * 0.2) + Math.sin(z * 0.15)) * 0.6;
  caveGeometry.attributes.position.setXYZ(i, x + noise, y + noise, z);
}
caveGeometry.attributes.position.needsUpdate = true;

const caveMaterial = new THREE.MeshStandardMaterial({
  color: 0x3a2a1a,
  roughness: 0.95,
  metalness: 0.05,
  side: THREE.BackSide
});

const cave = new THREE.Mesh(caveGeometry, caveMaterial);
scene.add(cave);

// Ember Particles
const emberGeometry = new THREE.BufferGeometry();
const emberCount = 200;
const emberPositions = new Float32Array(emberCount * 3);

for (let i = 0; i < emberCount; i++) {
  emberPositions[i * 3 + 0] = (Math.random() - 0.5) * 20;
  emberPositions[i * 3 + 1] = Math.random() * 5;
  emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
}

emberGeometry.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));

const emberMaterial = new THREE.PointsMaterial({
  color: 0xffaa55,
  size: 0.1,
  transparent: true,
  opacity: 0.8
});

const embers = new THREE.Points(emberGeometry, emberMaterial);
scene.add(embers);

// ShadowWolf (Level 1)
function createShadowWolf() {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x1a1a22, roughness: 0.8 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1, 0.8), mat);
  body.position.set(0, 1, 0);
  group.add(body);

  const head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
  head.position.set(1.7, 1.3, 0);
  group.add(head);

  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x88ccff });
  const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.1), eyeMat);
  const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.1), eyeMat);
  eye1.position.set(2.1, 1.35, 0.25);
  eye2.position.set(2.1, 1.35, -0.25);
  group.add(eye1, eye2);

  const tail = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 0.2), mat);
  tail.position.set(-1.6, 1.1, 0);
  group.add(tail);

  group.position.set(0, 0, 0);
  return { group, body, tail };
}

const shadowWolf = createShadowWolf();
scene.add(shadowWolf.group);

// Minotaur (Level 2)
const minotaur = createMinotaur();
minotaur.group.visible = false;
scene.add(minotaur.group);

// State
let time = 0;
let caveDepth = 0;

// Resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Scroll → Depth
window.addEventListener('scroll', () => {
  const maxDepth = 120;
  const t = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
  caveDepth = -t * maxDepth;
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  time += 0.016;

  // Camera movement
  camera.position.z = 14 + caveDepth;
  camera.lookAt(0, 1.5, caveDepth);

  // Fire flicker
  fireLight.intensity = 2 + Math.sin(time * 8) * 0.3;

  // Embers rising
  const pos = embers.geometry.attributes.position;
  for (let i = 0; i < emberCount; i++) {
    let y = pos.getY(i);
    y += 0.02;
    if (y > 5) y = 0;
    pos.setY(i, y);
  }
  pos.needsUpdate = true;

  // ShadowWolf idle
  shadowWolf.body.position.y = 1 + Math.sin(time * 2) * 0.05;
  shadowWolf.tail.rotation.z = Math.sin(time * 6) * 0.3;

  // Minotaur fade-in zone
  if (caveDepth < -20) {
    minotaur.group.visible = true;
    minotaur.group.position.z = -25;
    minotaur.torso.position.y = 2.5 + Math.sin(time * 1.5) * 0.1;
  } else {
    minotaur.group.visible = false;
  }

  renderer.render(scene, camera);
}

animate();