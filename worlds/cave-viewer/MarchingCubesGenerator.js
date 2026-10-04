// MarchingCubesGenerator.js
import * as THREE from 'three';

export function generateMarchingCubes() {
    const geometry = new THREE.IcosahedronGeometry(20, 3);
    const material = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    return mesh;
}
