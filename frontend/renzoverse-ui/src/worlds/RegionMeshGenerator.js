// frontend/renzoverse-ui/src/worlds/RegionMeshGenerator.js
import * as THREE from 'three';

export function applyRegionMeshes(scene, packet) {
  const root = scene.getObjectByName('WorldRoot');
  if (!root) return;

  const regions = packet?.world?.nodes || [];

  root.children
    .filter((c) => c.userData.regionMesh)
    .forEach((c) => root.remove(c));

  regions.forEach((r) => {
    const geo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      roughness: 0.5,
      metalness: 0.2
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(r.x, r.y, r.z);
    mesh.userData.regionMesh = true;
    root.add(mesh);
  });
}
