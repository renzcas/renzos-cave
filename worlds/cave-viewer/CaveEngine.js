// CaveEngine.js
import * as THREE from 'three';
import { createLighting } from './Lighting.js';
import { createAtmosphere } from './Atmosphere.js';
import { generateMarchingCubes } from './MarchingCubesGenerator.js';

export class CaveEngine {
    constructor(container) {
        this.container = container;

        // Scene + fog
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.08);

        // CAMERA (must be this.camera, not local variable)
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            500
        );

        // Pull camera back so we SEE the cave
        this.camera.position.set(0, 10, 40);
        this.camera.lookAt(0, 0, 0);

        // RENDERER
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // Slightly brighter than pure black
        this.renderer.setClearColor(0x111111);

        // Enable shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        container.appendChild(this.renderer.domElement);

        // LIGHTING + ATMOSPHERE
        createLighting(this.scene);
        createAtmosphere(this.scene);

        // CAVE GEOMETRY
        this.caveMesh = generateMarchingCubes();
        this.scene.add(this.caveMesh);

        // CLOCK + LOOP
        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        // RESIZE HANDLER
        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        const delta = this.clock.getDelta();

        // Rotate cave slowly so we SEE it
        if (this.caveMesh) {
            this.caveMesh.rotation.y += delta * 0.1;
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    }
}
