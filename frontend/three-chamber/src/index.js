import * as THREE from 'three';
import { EngineStream } from './stream/EngineStream.js';

import { WorldScene } from './world/WorldScene.js';
import { AtmosphereEngine } from './world/AtmosphereEngine.js';
import { RegionMeshGenerator } from './world/RegionMeshGenerator.js';
import { MarchingCubes } from './world/MarchingCubes.js';
import { PortalSystem } from './world/PortalSystem.js';
import { VolcanoLake } from './world/VolcanoLake.js';
import { Labyrinth } from './world/Labyrinth.js';
import { AlienTransportLayer } from './world/AlienTransportLayer.js';
import { OperatorAvatar } from './characters/OperatorAvatar.js';
import { CaveSignals } from './hud/CaveSignals.js';
import { OperatorAura } from './hud/OperatorAura.js';

// === Renderer ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000);
document.body.style.margin = 0;
document.body.appendChild(renderer.domElement);

const stream = new EngineStream();
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const streamUrl = import.meta.env.VITE_ENGINE_WS || `${wsProtocol}//${window.location.hostname}:8001/engine`;
stream.connect(streamUrl);

// === CaveSharp World Scene ===
const world = new WorldScene(renderer);
const volcanoLake = new VolcanoLake(world);
volcanoLake.root.position.x = 8.5;
const labyrinth = new Labyrinth(world);
const operator = new OperatorAvatar(world, labyrinth.entrancePosition);
const alienTransport = new AlienTransportLayer(world);

// === Atmosphere (breathing fog + neon pulses) ===
const atmosphere = new AtmosphereEngine(world);

// === Region Mesh Generator (voxel staging) ===
const regionGen = new RegionMeshGenerator(world);

// === Marching Cubes (mesh extraction) ===
const marching = new MarchingCubes(world);

// === Portal System (neon holographic rings) ===
const portals = new PortalSystem(world);

// === CaveSignals (HUD danger pulses) ===
const signals = new CaveSignals(world);

// Trigger a test pulse
signals.trigger(1.0);

// === Operator Aura (neon breathing halo) ===
const aura = new OperatorAura(world);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  world.camera.aspect = window.innerWidth / window.innerHeight;
  world.camera.updateProjectionMatrix();
});

// === Animation Loop ===
let last = performance.now();

function animate(now) {
  requestAnimationFrame(animate);

  const dt = (now - last) / 1000;
  last = now;
  const packet = stream.read();

  // subsystem updates
  labyrinth.update(dt);
  operator.update(dt);
  volcanoLake.update(dt);
  alienTransport.update(dt, packet);
  atmosphere.update(dt, packet);
  regionGen.update(null);
  marching.update(regionGen.voxels);
  portals.update(packet);
  signals.update(dt, packet);
  aura.update(dt, null);
  world.update(null);

  // render
  renderer.render(world.scene, world.camera);
}

requestAnimationFrame(animate);
