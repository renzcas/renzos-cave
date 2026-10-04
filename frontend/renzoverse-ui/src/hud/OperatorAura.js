// OperatorAura.js — Breathing aura, glyph orbit, energy halo
import * as THREE from 'three';

export class OperatorAura {
  constructor(camera) {
    this.group = new THREE.Group();
    camera.add(this.group);

    this.aura = this.createAura();
    this.orbitGlyph = this.createOrbitGlyph();
    this.halo = this.createHalo();

    this.t = 0;
  }

  createAura() {
    const geo = new THREE.RingGeometry(0.9, 1.4, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.25
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0, -1.5);
    return mesh;
  }

  createOrbitGlyph() {
    const geo = new THREE.CircleGeometry(0.15, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.8
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0.7, 0.2, -1.2);
    return mesh;
  }

  createHalo() {
    const geo = new THREE.RingGeometry(1.5, 1.8, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0, -1.8);
    return mesh;
  }

  update(dt, packet) {
    this.t += dt;

    const stress = packet?.stress || 0;
    const heat = packet?.csharp?.heat || 0;
    const resonance = packet?.resonance || 0;
    const arche = packet?.archetype || "default";

    // Breathing aura (stress + heat)
    const breath = 0.25 + Math.sin(this.t * 2 + stress) * 0.1 + heat * 0.2;
    this.aura.material.opacity = breath;

    // Orbit glyph (archetype color + resonance speed)
    const colors = {
      Dragon: "#ff0000",
      Tiger: "#ffaa00",
      Serpent: "#00ff88",
      Phoenix: "#ff00ff",
      Bear: "#8888ff",
      default: "#00ffff"
    };

    this.orbitGlyph.material.color.set(colors[arche]);
    this.orbitGlyph.position.x = Math.cos(this.t * (1 + resonance * 0.1)) * 0.7;
    this.orbitGlyph.position.y = Math.sin(this.t * (1 + resonance * 0.1)) * 0.4;

    // Energy halo (heat + resonance)
    this.halo.material.opacity = 0.1 + heat * 0.4 + resonance * 0.03;
    this.halo.rotation.z += dt * (0.5 + resonance * 0.2);
  }
}
