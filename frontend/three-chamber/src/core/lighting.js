import * as THREE from 'three';

export function createLighting(scene) {
  const ambient = new THREE.AmbientLight(0x6faaff, 0.6);
  const rim = new THREE.DirectionalLight(0x6faaff, 1.2);

  rim.position.set(2, 3, 2);

  scene.add(ambient);
  scene.add(rim);

  return { ambient, rim };
}
