import * as THREE from 'three';

export class PortalSystem {
  constructor(world) {
    this.world = world;
    this.portals = [];
  }

  spawnPortal(position) {
    const geo = new THREE.RingGeometry(0.8, 1.0, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x6faaff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });

    const ring = new THREE.Mesh(geo, mat);
    ring.position.copy(position);
    ring.rotation.x = Math.PI / 2;

    this.world.scene.add(ring);
    this.portals.push(ring);
  }

  update(packet) {
    // pulse portals
    for (const p of this.portals) {
      p.material.opacity = 0.7 + Math.sin(Date.now() * 0.002) * 0.25;
    }
  }
}
