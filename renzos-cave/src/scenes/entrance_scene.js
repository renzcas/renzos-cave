//renzos-cave/src/scenes/entranceScene.js

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createEntranceScene() {

  // --------------------------------------------------
  // 1. Scene + Renderer
  // --------------------------------------------------
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050509, 0.008);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // --------------------------------------------------
  // 2. Camera + Controls
  // --------------------------------------------------
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    4000
  );
  camera.position.set(140, 80, 220);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 30, -20);

  // --------------------------------------------------
  // 3. Lighting
  // --------------------------------------------------
  const ambient = new THREE.AmbientLight(0x404040, 1.4);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(300, 400, 200);
  sun.castShadow = true;
  scene.add(sun);

  // --------------------------------------------------
  // 4. GLTF Loader
  // --------------------------------------------------
  const loader = new GLTFLoader();

  // Cave Mesh
  loader.load('/assets/models/cave.glb', (gltf) => {
    const cave = gltf.scene;
    cave.position.set(0, 0, 0);
    cave.scale.set(1, 1, 1);
    scene.add(cave);
  });

  // Golden Tree
  let tree;
  loader.load('/assets/models/golden_tree.glb', (gltf) => {
    tree = gltf.scene;
    tree.position.set(0, 25, -20);
    tree.scale.set(1.2, 1.2, 1.2);
    scene.add(tree);
  });

  // Hydra
  let hydra;
  loader.load('/assets/models/hydra.glb', (gltf) => {
    hydra = gltf.scene;
    hydra.position.set(0, 28, -30);
    hydra.scale.set(1.4, 1.4, 1.4);
    scene.add(hydra);
  });

  // --------------------------------------------------
  // 5. Ground Plane
  // --------------------------------------------------
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshStandardMaterial({ color: 0x151515 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // --------------------------------------------------
  // 6. Golden Glow
  // --------------------------------------------------
  const goldenGlow = new THREE.PointLight(0xffd27f, 4, 400);
  goldenGlow.position.set(0, 35, -20);
  scene.add(goldenGlow);

  // --------------------------------------------------
  // 7. Mist Layers
  // --------------------------------------------------
  const mistMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.05,
    depthWrite: false
  });

  for (let i = 0; i < 3; i++) {
    const mist = new THREE.Mesh(
      new THREE.PlaneGeometry(300, 300),
      mistMaterial.clone()
    );
    mist.rotation.x = -Math.PI / 2;
    mist.position.set(0, 5 + i * 10, -20);
    scene.add(mist);
  }

  // --------------------------------------------------
  // 8. Transport Glyph + Portal
  // --------------------------------------------------
  const glyph = new THREE.Mesh(
    new THREE.RingGeometry(7, 9, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffd27f,
      transparent: true,
      opacity: 0.25
    })
  );
  glyph.rotation.x = -Math.PI / 2;
  glyph.position.set(0, 0.6, -40);
  scene.add(glyph);

  const portal = new THREE.Mesh(
    new THREE.CircleGeometry(7, 48),
    new THREE.MeshBasicMaterial({
      color: 0xfff8e6,
      transparent: true,
      opacity: 0.0
    })
  );
  portal.rotation.x = -Math.PI / 2;
  portal.position.set(0, 0.61, -40);
  scene.add(portal);

  // --------------------------------------------------
  // 9. Entrance Logic
  // --------------------------------------------------
  let playerHasGoldenBough = false;

  function updateEntranceLogic(time) {
    const pulse = 0.5 + 0.5 * Math.sin(time * 0.8);

    if (!playerHasGoldenBough) {
      if (hydra) hydra.traverse((c) => { if (c.isMesh) c.material.color.set(0x550000); });
      if (tree) tree.traverse((c) => { if (c.isMesh) c.material.emissiveIntensity = 0.8 + 0.2 * pulse; });
      glyph.material.opacity = 0.12;
      portal.material.opacity = 0.0;
    } else {
      if (hydra) hydra.traverse((c) => { if (c.isMesh) c.material.color.set(0x222222); });
      if (tree) tree.traverse((c) => { if (c.isMesh) c.material.emissiveIntensity = 1.8 + 0.4 * pulse; });
      glyph.material.opacity = 0.6 + 0.2 * pulse;
      portal.material.opacity = 0.6 + 0.2 * pulse;
    }
  }

  // --------------------------------------------------
  // 10. Render Loop
  // --------------------------------------------------
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();
    updateEntranceLogic(t);

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // --------------------------------------------------
  // 11. Resize Handling
  // --------------------------------------------------
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
