// WorldScene.js — World Viewer + Mesh Root
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createWorldViewer(renderer, camera) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(5, 5, 5);

  scene.add(ambient);
  scene.add(directional);

  const worldRoot = new THREE.Group();
  worldRoot.name = 'WorldRoot';
  scene.add(worldRoot);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  return { scene, controls };
}

export function updateWorld(scene, packet) {
  const root = scene.getObjectByName('WorldRoot');
  if (!root) return;

  const nodes = packet?.world?.nodes || [];

  root.children
    .filter((c) => c.userData.dynamicNode)
    .forEach((c) => root.remove(c));

  nodes.forEach((n) => {
    const geo = new THREE.SphereGeometry(0.05, 16, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(n.x, n.y, n.z);
    mesh.userData.dynamicNode = true;
    root.add(mesh);
  });
}
