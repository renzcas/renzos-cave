import * as THREE from 'three';

export class Croman {
    constructor() {
        this.mesh = new THREE.Mesh(
            new THREE.CapsuleGeometry(0.5, 1.5, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
        );

        this.mesh.position.set(0, 1, 0);
        this.health = 100;
    }

    update(delta) {
        this.mesh.position.y = 1 + Math.sin(Date.now() * 0.002) * 0.05;
    }
}
