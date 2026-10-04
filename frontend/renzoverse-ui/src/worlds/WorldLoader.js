import * as THREE from 'three';

export async function loadWorld(scene) {
  // Placeholder world geometry — replace with your CaveEngine data later
  const geometry = new THREE.SphereGeometry(2, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0x2222ff,
    roughness: 0.4,
    metalness: 0.2
  });

  const worldSphere = new THREE.Mesh(geometry, material);
  worldSphere.name = "WorldRoot";

  scene.add(worldSphere);

  return worldSphere;
}
