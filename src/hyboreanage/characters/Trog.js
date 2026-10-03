import * as THREE from 'three';

export class Trog {
    constructor() {

        // --- BODY GEOMETRY ---
        this.mesh = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.75, 2.2, 8, 16),
            new THREE.MeshStandardMaterial({
                color: 0x442200,      // dark earth‑skin
                roughness: 0.85,
                metalness: 0.0
            })
        );

        // --- INITIAL POSITION ---
        this.mesh.position.set(5, 1, -3);

        // --- SHADOWS ---
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // --- STATS ---
        this.health = 150;
        this.speed = 0.6;     // slower but heavy
        this.aggression = 0.02; // stalking intensity

        // --- INTERNAL STATE ---
        this._breathOffset = 0;
    }

    update(delta, targetPos) {

        // --- BREATHING ---
        this._breathOffset += delta;
        const breath = Math.sin(this._breathOffset * 1.5) * 0.04;
        this.mesh.position.y = 1 + breath;

        // --- STALKING AI ---
        if (targetPos) {
            this.mesh.position.lerp(targetPos, this.aggression);
        }
    }

    get position() {
        return this.mesh.position;
    }
}
