import * as THREE from 'three';

import { WorldScene } from './world/WorldScene.js';
import { AtmosphereEngine } from './world/AtmosphereEngine.js';
import { RegionMeshGenerator } from './world/RegionMeshGenerator.js';
import { MarchingCubes } from './world/MarchingCubes.js';
import { PortalSystem } from './world/PortalSystem.js';
import { CaveSignals } from './hud/CaveSignals.js';
import { OperatorAura } from './hud/OperatorAura.js';

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);
document.body.style.margin = 0;
document.body.appendChild(renderer.domElement);

// === CaveSharp World Scene ===
const world = new WorldScene(renderer);

// === Atmosphere (breathing fog + neon pulses) ===
const atmosphere = new AtmosphereEngine(world);

// === Region Mesh Generator (voxel staging) ===
const regionGen = new RegionMeshGenerator(world);

// === Marching Cubes (mesh extraction) ===
const marching = new MarchingCubes(world);

// === Portal System (neon holographic rings) ===
const portals = new PortalSystem(world);

// Spawn a test portal
portals.spawnPortal(new THREE.Vector3(0, 0, -2));

// === CaveSignals (HUD danger pulses) ===
const signals = new CaveSignals(world);

// Trigger a test pulse
signals.trigger(1.0);

// === Operator Aura (neon breathing halo) ===
const aura = new OperatorAura(world);

// === Test holographic object ===
const geo = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
const mat = new THREE.MeshStandardMaterial({
  color: 0x6faaff,
  metalness: 0.8,
  roughness: 0.2,
  emissive: 0x1a2a4f,
  emissiveIntensity: 0.6
});
const knot = new THREE.Mesh(geo, mat);
world.scene.add(knot);

// === Animation Loop ===
let last = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = (now - last) / 1000;
  last = now;

  // holographic rotation
  knot.rotation.x += 0.01;
  knot.rotation.y += 0.01;

  // subsystem updates
  atmosphere.update(dt, null);
  regionGen.update(null);
  marching.update(regionGen.voxels);
  portals.update(null);
  signals.update(dt, null);
  aura.update(dt, null);
  world.update(null);

  // render
  renderer.render(world.scene, world.camera);
}

requestAnimationFrame(animate);
