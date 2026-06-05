// Lighting.js
import * as THREE from 'three';

export function createLighting(scene) {
    // Strong ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambient);

    // Strong directional light
    const dir = new THREE.DirectionalLight(0xffffff, 3.0);
    dir.position.set(20, 30, 20);
    dir.castShadow = true;
    scene.add(dir);

    // Soft blue fill light
    const fill = new THREE.PointLight(0x88aaff, 1.2, 300);
    fill.position.set(-20, 10, -20);
    scene.add(fill);
}
