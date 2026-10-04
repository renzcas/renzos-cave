import * as THREE from 'three';

export default class MarchingCubesGenerator {
  constructor(resolution = 32, scale = 1) {
    this.resolution = resolution;
    this.scale = scale;
    this.field = new Float32Array(resolution * resolution * resolution);
  }

  generateField(noiseFn) {
    const size = this.resolution;
    let ptr = 0;

    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const nx = x / size;
          const ny = y / size;
          const nz = z / size;

          this.field[ptr++] = noiseFn(nx, ny, nz);
        }
      }
    }
  }

  buildMesh() {
    // Placeholder — real marching cubes logic comes next
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x444444 });
    return new THREE.Mesh(geometry, material);
  }
}
