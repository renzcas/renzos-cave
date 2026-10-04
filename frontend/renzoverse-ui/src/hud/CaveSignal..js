// CaveSignals.js — Danger flashes, runes, harmonic warnings
import * as THREE from 'three';

export class CaveSignals {
  constructor(camera) {
    this.group = new THREE.Group();
    camera.add(this.group);

    this.flash = this.createFlash();
    this.rune = this.createRune();
    this.harmonic = this.createHarmonic();
  }

  createFlash() {
    const geo = new THREE.PlaneGeometry(2, 2);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0, -1.2);
    this.group.add(mesh);
    return mesh;
  }

  createRune() {
    const geo = new THREE.CircleGeometry(0.35, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0.4, -1.1);
    this.group.add(mesh);
    return mesh;
  }

  createHarmonic() {
    const geo = new THREE.RingGeometry(0.6, 0.9, 64);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, -0.3, -1.3);
    this.group.add(mesh);
    return mesh;
  }

  update(dt, packet) {
    const stress = packet?.stress || 0;
    const heat = packet?.csharp?.heat || 0;
    const resonance = packet?.resonance || 0;

    // Danger flash (stress or heat spike)
    const danger = Math.max(stress / 5, heat);
    this.flash.material.opacity = danger > 0.6 ? 0.4 : danger * 0.3;

    // Rune pulse (archetype)
    const arche = packet?.archetype || "default";
    const runeColors = {
      Dragon: "#ff0000",
      Tiger: "#ffaa00",
      Serpent: "#00ff88",
      Phoenix: "#ff00ff",
      Bear: "#8888ff",
      default: "#ffffff"
    };
    this.rune.material.color.set(runeColors[arche]);
    this.rune.material.opacity = 0.2 + Math.sin(dt * 10) * 0.1;

    // Harmonic warning (resonance instability)
    const instability = Math.min(resonance / 10, 1);
    this.harmonic.material.opacity = instability * 0.5;
    this.harmonic.rotation.z += dt * (instability * 4);
  }
}
