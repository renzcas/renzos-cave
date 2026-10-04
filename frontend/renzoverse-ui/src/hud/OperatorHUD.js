import * as THREE from 'three';

export class OperatorHUD {
  constructor(camera) {
    this.group = new THREE.Group();
    camera.add(this.group);

    this.t = 0;

    this.createAuraRing();
    this.createGlyph();
    this.createEnergyLines();
  }

  createAuraRing() {
    const geo = new THREE.RingGeometry(0.8, 1.0, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });

    this.auraRing = new THREE.Mesh(geo, mat);
    this.auraRing.position.set(0, -0.2, -1.5);
    this.group.add(this.auraRing);
  }

  createGlyph() {
    const geo = new THREE.CircleGeometry(0.25, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8
    });

    this.glyph = new THREE.Mesh(geo, mat);
    this.glyph.position.set(0, 0.15, -1.2);
    this.group.add(this.glyph);
  }

  createEnergyLines() {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.5, -0.5, -1.5),
      new THREE.Vector3(0.5, -0.5, -1.5)
    ]);

    const mat = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.4
    });

    this.energyLine = new THREE.Line(geo, mat);
    this.group.add(this.energyLine);
  }

  update(dt, telemetry) {
    this.t += dt;

    // Pulse aura with engine density
    const pulse = 0.35 + Math.sin(this.t * 3) * 0.15 * (telemetry?.density || 1);
    this.auraRing.material.opacity = pulse;

    // Rotate glyph with resonance
    this.glyph.rotation.z += dt * (telemetry?.resonance || 1);

    // Flash energy line with stress
    const stress = telemetry?.stress || 0;
    this.energyLine.material.opacity = 0.2 + stress * 0.15;

    // Archetype color sync
    const arche = telemetry?.archetype || "default";
    const colors = {
      default: "#00ffff",
      Dragon: "#ff0000",
      Tiger: "#ffaa00",
      Serpent: "#00ff88",
      Phoenix: "#ff00ff",
      Bear: "#8888ff"
    };

    const color = colors[arche] || colors.default;
    this.auraRing.material.color.set(color);
    this.glyph.material.color.set(color);
    this.energyLine.material.color.set(color);
  }
}
