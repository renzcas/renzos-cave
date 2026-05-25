// ------------------------------------------------------------
//  Renzo’s Cave — Full Room System (Rooms 1–4)
//  Includes: Fog, Mist, Dust, Trog, Wraith, Crystals, Heart Core
// ------------------------------------------------------------

import { CaveCockpitUI } from "./main-ui.js";
import { startRuntimeLoop } from "./engine/runtime-loop.js";

// ------------------------------------------------------------
//  SETUP
// ------------------------------------------------------------

const container = document.getElementById("cave-room-container");

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050509);
scene.fog = new THREE.FogExp2(0x050509, 0.12);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  container.clientWidth / container.clientHeight,
  0.1,
  200
);
camera.position.set(0, 1.2, 3);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Resize
window.addEventListener("resize", () => {
  renderer.setSize(container.clientWidth, container.clientHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
});

// ------------------------------------------------------------
//  AUDIO SYSTEM
// ------------------------------------------------------------

const listener = new THREE.AudioListener();
camera.add(listener);
const audioLoader = new THREE.AudioLoader();

// Global cave ambience
const caveAmbience = new THREE.Audio(listener);
audioLoader.load("https://cdn.jsdelivr.net/gh/renzcas/assets/cave_ambience.mp3", (buffer) => {
  caveAmbience.setBuffer(buffer);
  caveAmbience.setLoop(true);
  caveAmbience.setVolume(0.35);
  caveAmbience.play();
});

// ------------------------------------------------------------
//  ROOM 1 — MAIN CHAMBER
// ------------------------------------------------------------

const caveGeo = new THREE.SphereGeometry(6, 64, 64);
const caveMat = new THREE.MeshStandardMaterial({
  color: 0x1a1a2e,
  roughness: 0.95,
  metalness: 0.05,
  side: THREE.BackSide
});
const cave = new THREE.Mesh(caveGeo, caveMat);
scene.add(cave);

// Mist
const mistGeo = new THREE.PlaneGeometry(20, 20);
const mistMat = new THREE.MeshLambertMaterial({
  color: 0x8899ff,
  transparent: true,
  opacity: 0.15,
  depthWrite: false
});
const mist = new THREE.Mesh(mistGeo, mistMat);
mist.rotation.x = -Math.PI / 2;
mist.position.y = 0.1;
scene.add(mist);

// Dust
const dustGeo = new THREE.BufferGeometry();
const dustCount = 200;
const dustPos = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) {
  dustPos[i * 3 + 0] = (Math.random() - 0.5) * 8;
  dustPos[i * 3 + 1] = Math.random() * 3;
  dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
}
dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(
  dustGeo,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, opacity: 0.6 })
);
scene.add(dust);

// Torch light
const torch = new THREE.PointLight(0xffa366, 2, 10);
torch.position.set(1, 1.2, 1);
scene.add(torch);

const ambient = new THREE.AmbientLight(0x334455, 0.4);
scene.add(ambient);

// ------------------------------------------------------------
//  ROOM 2 — SECOND CHAMBER
// ------------------------------------------------------------

const room2Geo = new THREE.SphereGeometry(6, 64, 64);
const room2Mat = new THREE.MeshStandardMaterial({
  color: 0x0f1628,
  roughness: 0.95,
  metalness: 0.05,
  side: THREE.BackSide
});
const room2 = new THREE.Mesh(room2Geo, room2Mat);
room2.position.set(0, 0, -14);
scene.add(room2);

// Tunnel
const tunnelGeo = new THREE.CylinderGeometry(2, 2, 10, 32, 1, true);
const tunnelMat = new THREE.MeshStandardMaterial({
  color: 0x111a2e,
  roughness: 0.95,
  metalness: 0.05,
  side: THREE.BackSide
});
const tunnel = new THREE.Mesh(tunnelGeo, tunnelMat);
tunnel.rotation.x = Math.PI / 2;
tunnel.position.set(0, 0, -7);
scene.add(tunnel);

// Tunnel light
const tunnelLight = new THREE.PointLight(0x3344ff, 0.7, 14);
tunnelLight.position.set(0, 0, -7);
scene.add(tunnelLight);

// ------------------------------------------------------------
//  ROOM 3 — VERTICAL SHAFT
// ------------------------------------------------------------

const shaftGeo = new THREE.CylinderGeometry(5, 5, 40, 32, 32, true);
const shaftMat = new THREE.MeshStandardMaterial({
  color: 0x0a0f1a,
  roughness: 0.95,
  metalness: 0.05,
  side: THREE.BackSide
});
const shaft = new THREE.Mesh(shaftGeo, shaftMat);
shaft.position.set(0, -20, -14);
scene.add(shaft);

// Shaft hum
const shaftHum = new THREE.PositionalAudio(listener);
audioLoader.load("https://cdn.jsdelivr.net/gh/renzcas/assets/shaft_hum.mp3", (buffer) => {
  shaftHum.setBuffer(buffer);
  shaftHum.setRefDistance(6);
  shaftHum.setLoop(true);
  shaftHum.setVolume(0.4);
  shaftHum.play();
});
shaft.add(shaftHum);

// ------------------------------------------------------------
//  ROOM 4 — HEART CHAMBER
// ------------------------------------------------------------

const heartGeo = new THREE.SphereGeometry(10, 64, 64);
const heartMat = new THREE.MeshStandardMaterial({
  color: 0x0a0f1a,
  roughness: 0.9,
  metalness: 0.2,
  side: THREE.BackSide
});
const heartRoom = new THREE.Mesh(heartGeo, heartMat);
heartRoom.position.set(0, -55, -14);
scene.add(heartRoom);

// Heart Core
const coreGeo = new THREE.IcosahedronGeometry(1.8, 2);
const coreMat = new THREE.MeshPhysicalMaterial({
  color: 0xff3366,
  emissive: 0xff1133,
  emissiveIntensity: 1.8,
  roughness: 0.2,
  metalness: 0.4,
  transmission: 0.4,
  thickness: 1.2
});
const heartCore = new THREE.Mesh(coreGeo, coreMat);
heartCore.position.set(0, -55, -14);
scene.add(heartCore);

const coreLight = new THREE.PointLight(0xff3366, 3.5, 40);
heartCore.add(coreLight);

// ------------------------------------------------------------
//  WRAITH — ROOM 3 CREATURE
// ------------------------------------------------------------

const wraithTex = new THREE.TextureLoader().load("https://i.imgur.com/6pQ0x2T.png");
wraithTex.magFilter = THREE.NearestFilter;
wraithTex.minFilter = THREE.NearestFilter;

const wraith = new THREE.Sprite(
  new THREE.SpriteMaterial({
    map: wraithTex,
    transparent: true,
    opacity: 0.85,
    color: 0x88bbff
  })
);
wraith.scale.set(1.8, 1.8, 1.8);
wraith.position.set(0, -25, -14);
scene.add(wraith);

// Wraith light
const wraithLight = new THREE.PointLight(0x88bbff, 1.2, 12);
wraith.add(wraithLight);

// Wraith whisper
const wraithWhisper = new THREE.PositionalAudio(listener);
audioLoader.load("https://cdn.jsdelivr.net/gh/renzcas/assets/wraith_whisper.mp3", (buffer) => {
  wraithWhisper.setBuffer(buffer);
  wraithWhisper.setRefDistance(3);
  wraithWhisper.setLoop(true);
  wraithWhisper.setVolume(0.55);
  wraithWhisper.play();
});
wraith.add(wraithWhisper);

// Wraith scream
const wraithScream = new THREE.PositionalAudio(listener);
audioLoader.load("https://cdn.jsdelivr.net/gh/renzcas/assets/wraith_scream.mp3", (buffer) => {
  wraithScream.setBuffer(buffer);
  wraithScream.setRefDistance(4);
  wraithScream.setLoop(false);
  wraithScream.setVolume(0.9);
});
wraith.add(wraithScream);

// ------------------------------------------------------------
//  CRYSTALS — ROOM 3
// ------------------------------------------------------------

const crystalGeo = new THREE.ConeGeometry(0.3, 1.2, 8);
const crystals = [];

function spawnCrystal(x, y, z) {
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x66ccff,
    emissive: 0x2288ff,
    emissiveIntensity: 0.6,
    roughness: 0.1,
    metalness: 0.3,
    transmission: 0.8,
    thickness: 0.8
  });

  const c = new THREE.Mesh(crystalGeo, mat);
  c.position.set(x, y, z);
  c.rotation.y = Math.random() * Math.PI * 2;
  scene.add(c);
  crystals.push(c);
}

// Crystal cluster
spawnCrystal(1.2, -22, -14);
spawnCrystal(-1.4, -24, -14);
spawnCrystal(0.8, -26, -14);
spawnCrystal(-0.6, -28, -14);
spawnCrystal(1.0, -30, -14);

// Crystal hum
const crystalHum = new THREE.PositionalAudio(listener);
audioLoader.load("https://cdn.jsdelivr.net/gh/renzcas/assets/crystal_hum.mp3", (buffer) => {
  crystalHum.setBuffer(buffer);
  crystalHum.setRefDistance(3);
  crystalHum.setLoop(true);
  crystalHum.setVolume(0.4);
});

// ------------------------------------------------------------
//  MOVEMENT
// ------------------------------------------------------------

let yaw = 0, pitch = 0;
let keys = {};

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

container.addEventListener("click", () => container.requestPointerLock());
window.addEventListener("mousemove", e => {
  if (!document.pointerLockElement) return;
  yaw -= e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
  pitch = Math.max(-1.2, Math.min(1.2, pitch));
});

// ------------------------------------------------------------
//  UPDATE FUNCTIONS
// ------------------------------------------------------------

function updateFog() {
  const z = camera.position.z;
  const y = camera.position.y;

  if (z < -4 && z > -10) scene.fog.density = 0.18; // tunnel
  else if (y < -5 && z < -12) scene.fog.density = 0.20; // shaft
  else scene.fog.density = 0.12;
}

function updateWraith() {
  const dx = camera.position.x - wraith.position.x;
  const dy = camera.position.y - wraith.position.y;
  const dz = camera.position.z - wraith.position.z;
  const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

  // Float
  wraith.position.y += Math.sin(performance.now() * 0.001) * 0.003;

  // Face player
  wraith.material.rotation = Math.atan2(dx, dz);

  // Approach
  if (dist < 6 && dist > 2) {
    wraith.position.x += dx * 0.002;
    wraith.position.z += dz * 0.002;
  }

  // Retreat
  if (dist < 1.2) {
    if (!wraith.isAttacking) {
      wraith.isAttacking = true;
      wraithScream.play();
      wraithLight.intensity = 4.0;
      scene.fog.density = 0.28;

      wraith.position.x += dx * 0.15;
      wraith.position.z += dz * 0.15;

      setTimeout(() => {
        wraith.isAttacking = false;
        wraithLight.intensity = 1.2;
        scene.fog.density = 0.20;
      }, 800);
    }
  }

  // Reset
  if (dist > 12) {
    wraith.position.set(0, -25, -14);
  }
}

function updateCrystals() {
  const cam = camera.position;
  const t = performance.now() * 0.001;

  for (let c of crystals) {
    const dx = cam.x - c.position.x;
    const dy = cam.y - c.position.y;
    const dz = cam.z - c.position.z;
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    // Hum
    if (dist < 4 && !c.hasHum) {
      c.add(crystalHum);
      crystalHum.play();
      c.hasHum = true;
    }

    // Touch
    if (dist < 1.2) {
      c.material.emissiveIntensity = 2.0;
      c.scale.setScalar(1.3);
    } else {
      c.material.emissiveIntensity = 0.6;
      c.scale.setScalar(1.0);
    }

    // Sync with Heart Core
    c.material.emissiveIntensity += Math.sin(t * 4.0) * 0.2;
  }
}

function updateHeartCore() {
  const t = performance.now() * 0.001;
  const s = 1.8 + Math.sin(t * 2.5) * 0.15;
  heartCore.scale.set(s, s, s);
  coreLight.intensity = 3 + Math.sin(t * 3.0) * 1.2;
  heartCore.material.emissiveIntensity = 1.5 + Math.sin(t * 4.0) * 0.5;
}

// ------------------------------------------------------------
//  ANIMATE
// ------------------------------------------------------------

function animate() {
  requestAnimationFrame(animate);

  // Movement
  const speed = 0.05;
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

  if (keys["w"]) camera.position.addScaledVector(forward, -speed);
  if (keys["s"]) camera.position.addScaledVector(forward, speed);
  if (keys["a"]) camera.position.addScaledVector(right, -speed);
  if (keys["d"]) camera.position.addScaledVector(right, speed);

  camera.rotation.set(pitch, yaw, 0);

  // Torch flicker
  torch.intensity = 1.8 + Math.random() * 0.4;

  // Mist drift
  mist.position.x = Math.sin(performance.now() * 0.0002) * 0.3;

  // Updates
  updateFog();
  updateWraith();
  updateCrystals();
  updateHeartCore();

  renderer.render(scene, camera);
}

animate();

// ------------------------------------------------------------
//  COCKPIT RUNTIME
// ------------------------------------------------------------

const ui = new CaveCockpitUI();
startRuntimeLoop(ui);
