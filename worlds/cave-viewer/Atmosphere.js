// Atmosphere.js
import * as THREE from 'three';

export function createAtmosphere(scene) {
    const fogColor = new THREE.Color(0x000000);
    scene.background = fogColor;
}
