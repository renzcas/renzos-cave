// engine/Chamber.js — Renzo’s 3D Chamber Organ
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js';

export class Chamber {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        scene.add(this.group);

        this.t = 0;

        this.createWalls();
        this.createFog();
        this.createPortal();
        this.createDust();
        this.createLightShafts();
    }

    createWalls() {
        const geo = new THREE.CylinderGeometry(10, 10, 8, 32, 1, true);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.95,
            metalness: 0.05,
            side: THREE.BackSide
        });

        this.walls = new THREE.Mesh(geo, mat);
        this.walls.position.y = 3;
        this.group.add(this.walls);
    }

    createFog() {
        this.scene.fog = new THREE.FogExp2(0x050308, 0.08);
    }

    createPortal() {
        const geo = new THREE.RingGeometry(1.2, 1.8, 64);
        const mat = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            side: THREE.DoubleSide
        });

        this.portal = new THREE.Mesh(geo, mat);
        this.portal.position.set(0, 2, -4);
        this.group.add(this.portal);
    }

    createDust() {
        const geo = new THREE.BufferGeometry();
        const count = 300;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3 + 0] = (Math.random() - 0.5) * 12;
            positions[i * 3 + 1] = Math.random() * 6;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
        }

        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.03,
            transparent: true,
            opacity: 0.6
        });

        this.dust = new THREE.Points(geo, mat);
        this.group.add(this.dust);
    }

    createLightShafts() {
        const geo = new THREE.CylinderGeometry(0.2, 1.5, 6, 32, 1, true);
        const mat = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.08,
            side: THREE.DoubleSide
        });

        this.shaft = new THREE.Mesh(geo, mat);
        this.shaft.position.set(0, 3, -2);
        this.group.add(this.shaft);
    }

    update(dt) {
        this.t += dt;

        // Portal pulse
        const pulse = 1 + Math.sin(this.t * 2) * 0.1;
        this.portal.scale.set(pulse, pulse, pulse);

        // Dust drift
        this.dust.rotation.y += dt * 0.1;

        // Walls breathing
        this.walls.scale.x = 1 + Math.sin(this.t * 0.5) * 0.02;
        this.walls.scale.z = 1 + Math.sin(this.t * 0.5) * 0.02;
    }
}
