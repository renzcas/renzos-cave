// frontend/renzoverse-ui/src/main.js

import * as THREE from 'three';

import { createWorldViewer, updateWorld } from './worlds/WorldScene.js';
import { OperatorHUD } from './hud/OperatorHUD.js';
import { StressField } from './hud/StressField.js';
import { CaveSignals } from './hud/CaveSignals.js';
import { OperatorAura } from './hud/OperatorAura.js';

import { initEngineStream } from './stream/EngineStream.js';
import { sendCaveSharpCommand } from './controls/CaveSharpControl.js';

import { applyRegionMeshes } from './worlds/RegionMeshGenerator.js';
import { PortalField } from './worlds/PortalField.js';
import { generatePortals } from './worlds/PortalGenerator.js';
import { MarchingCubesField } from './worlds/MarchingCubesField.js';

import { OperatorUI } from './ui/OperatorUI.js';
import './ui/operator.css';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = "0";
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 8);

const { scene, controls } = createWorldViewer(renderer, camera);

const hud = new OperatorHUD(camera);
const stressField = new StressField(scene);
const portalField = new PortalField(scene);
const marchingCubes = new MarchingCubesField(scene);
const caveSignals = new CaveSignals(camera);
const operatorAura = new OperatorAura(camera);

const operatorUI = new OperatorUI();

let packet = {};

initEngineStream((p) => {
  packet = p;

  updateWorld(scene, packet);
  applyRegionMeshes(scene, packet);

  const stressNodes = packet?.stressField || [];
  stressField.update(stressNodes);

  hud.updateArchetype(packet?.archetype);

  const portals = packet?.portals || generatePortals(packet?.world?.nodes);
  portalField.update(portals);

  marchingCubes.update(packet?.world?.nodes);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "1") sendCaveSharpCommand("boost");
  if (e.key === "2") sendCaveSharpCommand("pulse");
  if (e.key === "3") sendCaveSharpCommand("stabilize");
});

let last = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const dt = (now - last) / 1000;
  last = now;

  controls.update();
  hud.update(dt, packet);
  portalField.animate(dt);
  caveSignals.update(dt, packet);
  operatorAura.update(dt, packet);

  renderer.render(scene, camera);
}

animate();
