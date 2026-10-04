// StressField.js — Operator War‑Engine Stress Visualizer
import * as THREE from 'three';

export class StressField {
  constructor(scene) {
    this.group = new THREE.Group();
    this.group.name = "StressField";
    scene.add(this.group);

    this.maxPoints = 200;
    this.points = [];

    this.material = new THREE.PointsMaterial({
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      vertexColors: true
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute([], 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute([], 3));

    this.pointsMesh = new THREE.Points(geo, this.material);
    this.group.add(this.pointsMesh);
  }

  update(stressNodes) {
    if (!stressNodes || stressNodes.length === 0) return;

    const positions = [];
    const colors = [];

    stressNodes.slice(0, this.maxPoints).forEach(n => {
      positions.push(n.x, n.y, n.z);

      // Stress → color mapping
      const s = Math.min(Math.max(n.s, 0), 1);
      const color = new THREE.Color().setHSL(0.0 + s * 0.1, 1.0, 0.5 + s * 0.25);

      colors.push(color.r, color.g, color.b);
    });

    this.pointsMesh.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    this.pointsMesh.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    this.pointsMesh.geometry.computeBoundingSphere();
  }
}
