// engine/OperatorHUD.js — Floating Aura Ring + Symbolic Pulse HUD
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js';

export class OperatorHUD {
    constructor({ scene, camera, dynasty, symbolic }) {
        this.scene = scene;
        this.camera = camera;
        this.dynasty = dynasty;
        this.symbolic = symbolic;

        this.t = 0;

        this.group = new THREE.Group();
        this.camera.add(this.group); // attach HUD to camera

        this.createAuraRing();
        this.createGlyph();
    }

    // --------------------------
    // Aura Ring
    // --------------------------
    createAuraRing() {
        const geo = new THREE.RingGeometry(0.8, 1.0, 64);
        const mat = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide
        });

        this.auraRing = new THREE.Mesh(geo, mat);
        this.auraRing.position.set(0, -0.2, -1.5);
        this.group.add(this.auraRing);
    }

    // --------------------------
    // Glyph (Symbolic Engine)
    // --------------------------
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

    // --------------------------
    // Update Loop
    // --------------------------
    update(dt) {
        this.t += dt;

        // Aura pulse based on Operator Aura
        const aura = this.dynasty.current.aura;
        const pulse = 0.35 + Math.sin(this.t * 3) * 0.15 * aura;

        this.auraRing.material.opacity = pulse;

        // Archetype color sync
        const arche = this.symbolic.state.archetype;

        if (arche === "Dragon") this.setColor("#ff0000");
        if (arche === "Tiger") this.setColor("#ffaa00");
        if (arche === "Serpent") this.setColor("#00ff88");
        if (arche === "Phoenix") this.setColor("#ff00ff");
        if (arche === "Bear") this.setColor("#8888ff");

        // Glyph rotation
        this.glyph.rotation.z += dt * 0.8;

        // Ritual cycle expansion
        const ritual = 1 + Math.sin(this.t * 1.5) * 0.05 * this.dynasty.current.level;
        this.auraRing.scale.set(ritual, ritual, ritual);
    }

    setColor(hex) {
        this.auraRing.material.color.set(hex);
        this.glyph.material.color.set(hex);
    }
}
