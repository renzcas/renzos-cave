// PortalField.js — Wormhole / Portal Visualizer
import * as THREE from 'three';

export class PortalField {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.name = "PortalField";
    scene.add(this.group);

    this.portals = [];
  }

  update(portalData) {
    // Remove old portals
    this.portals.forEach(p => this.group.remove(p.mesh));
    this.portals = [];

    if (!portalData || portalData.length === 0) return;

    portalData.forEach(p => {
      const geo = new THREE.RingGeometry(0.4, 0.8, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(p.color || "#00ffff"),
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.x, p.y, p.z);
      mesh.rotation.x = Math.PI / 2;

      this.group.add(mesh);

      this.portals.push({ mesh, speed: p.spin || 1 });
    });
  }

  animate(dt) {
    this.portals.forEach(p => {
      p.mesh.rotation.z += dt * p.speed;
    });
  }
}
