// cave-room.js
// Three.js Cave Renderer for Renzo’s Cave Engine

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.module.js";

// Reactive state (updated by runtime-loop)
const reactive = {
  stress: 0,
  entropy: 0,
  reflex: "Idle",
  neural: 0,
  energy: 0
};

// Called by runtime-loop.js each tick
export function updateCaveReactivity(signals) {
  reactive.stress = signals.stress ?? 0;
  reactive.entropy = signals.branchEntropy ?? 0;
  reactive.reflex = signals.reflexState ?? "Idle";
  reactive.neural = signals.neuralLoad ?? 0;
  reactive.energy = signals.energyFlow ?? 0;
}


let scene, camera, renderer;
let coreOrb, caveMesh;
let lastTime = performance.now();

init();
animate();

function init() {
  const container = document.getElementById("cave-room-container");
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050509);
  scene.fog = new THREE.Fog(0x050509, 10, 40);

  // Camera
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
  camera.position.set(0, 1.5, 6);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0x404040, 1.2);
  scene.add(ambient);

  const point = new THREE.PointLight(0x3da9ff, 2, 15);
  point.position.set(0, 2, 3);
  scene.add(point);

  // Cave geometry (simple noise-displaced sphere)
  const caveGeo = new THREE.SphereGeometry(20, 64, 64);
  const caveMat = new THREE.MeshStandardMaterial({
    color: 0x0a0a12,
    roughness: 0.95,
    metalness: 0.05,
    side: THREE.BackSide
  });

  caveMesh = new THREE.Mesh(caveGeo, caveMat);
  scene.add(caveMesh);

  // Operator Core Orb
  const orbGeo = new THREE.SphereGeometry(0.4, 32, 32);
  const orbMat = new THREE.MeshStandardMaterial({
    color: 0x3dd68c,
    emissive: 0x3dd68c,
    emissiveIntensity: 0.8,
    metalness: 0.2,
    roughness: 0.3
  });

  coreOrb = new THREE.Mesh(orbGeo, orbMat);
  coreOrb.position.set(0, 1, 0);
  scene.add(coreOrb);

  // Resize handling
  window.addEventListener("resize", () => onResize(container));
}

function onResize(container) {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  // Subtle camera drift
  camera.position.x = Math.sin(now * 0.0002) * 0.4;
  camera.position.y = 1.5 + Math.sin(now * 0.0003) * 0.2;
  camera.lookAt(0, 1, 0);

  // Orb pulsing
  const pulse = 0.5 + 0.5 * Math.sin(now * 0.003);
  coreOrb.scale.setScalar(1 + pulse * 0.1);

  // Cave slow rotation
  caveMesh.rotation.y += dt * 0.02;

  renderer.render(scene, camera);
}
