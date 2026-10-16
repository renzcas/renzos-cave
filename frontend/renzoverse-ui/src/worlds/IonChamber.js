import * as THREE from 'three';

const PARTICLE_COUNT = 180;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export class IonChamber {
  constructor(scene) {
    this.time = 0;
    this.root = new THREE.Group();
    this.root.name = 'IonChamber';
    scene.add(this.root);

    this.core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.92, 2),
      new THREE.MeshStandardMaterial({
        color: 0x123d58,
        emissive: 0x087c99,
        emissiveIntensity: 1.1,
        metalness: 0.72,
        roughness: 0.22,
        flatShading: true
      })
    );
    this.root.add(this.core);

    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1.16, 32, 24),
      new THREE.MeshBasicMaterial({
        color: 0x25d9ed,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide,
        depthWrite: false
      })
    );
    this.root.add(shell);

    const ringMaterials = [
      new THREE.MeshBasicMaterial({ color: 0x48e5dc, transparent: true, opacity: 0.78 }),
      new THREE.MeshBasicMaterial({ color: 0x8b71ff, transparent: true, opacity: 0.62 }),
      new THREE.MeshBasicMaterial({ color: 0xffa96b, transparent: true, opacity: 0.5 })
    ];
    this.rings = ringMaterials.map((material, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.5 + index * 0.22, 0.012, 8, 120),
        material
      );
      ring.rotation.set(
        Math.PI * (0.28 + index * 0.19),
        Math.PI * (0.12 + index * 0.23),
        Math.PI * index * 0.16
      );
      this.root.add(ring);
      return ring;
    });

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const y = 1 - (index / (PARTICLE_COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = GOLDEN_ANGLE * index;
      const offset = index * 3;
      positions[offset] = Math.cos(angle) * radius * 2.65;
      positions[offset + 1] = y * 2.65;
      positions[offset + 2] = Math.sin(angle) * radius * 2.65;

      const color = new THREE.Color().setHSL(0.47 + (index % 11) * 0.025, 0.82, 0.68);
      colors[offset] = color.r;
      colors[offset + 1] = color.g;
      colors[offset + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.86,
        sizeAttenuation: true
      })
    );
    this.root.add(this.particles);

    const light = new THREE.PointLight(0x37dcec, 3.2, 9, 2);
    light.position.set(0, 0.25, 0.5);
    this.root.add(light);
  }

  update(dt) {
    this.time += dt;
    const pulse = 1 + Math.sin(this.time * 1.4) * 0.035;
    this.core.scale.setScalar(pulse);
    this.core.rotation.y += dt * 0.12;
    this.core.rotation.x += dt * 0.07;
    this.particles.rotation.y -= dt * 0.035;

    this.rings.forEach((ring, index) => {
      ring.rotation.z += dt * (index % 2 === 0 ? 0.08 : -0.06);
    });
  }
}
