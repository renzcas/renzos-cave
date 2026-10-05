import * as THREE from 'three';

export class OperatorAura {
  constructor(world) {
    this.world = world;
    this.time = 0;

    // Outer neon ring
    const ringGeo = new THREE.RingGeometry(0.9, 1.1, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6faaff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });

    this.outerRing = new THREE.Mesh(ringGeo, ringMat);
    this.outerRing.position.set(0, -0.5, -1.2);
    this.outerRing.rotation.x = Math.PI / 2;
    this.outerRing.renderOrder = 9998;

    // Inner breathing ring
    const innerGeo = new THREE.RingGeometry(0.5, 0.7, 64);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x3f6fff,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });

    this.innerRing = new THREE.Mesh(innerGeo, innerMat);
    this.innerRing.position.set(0, -0.5, -1.2);
    this.innerRing.rotation.x = Math.PI / 2;
    this.innerRing.renderOrder = 9999;

    world.scene.add(this.outerRing);
    world.scene.add(this.innerRing);
  }

  update(dt, packet) {
    this.time += dt;

    // Breathing pulse
    const pulse = Math.sin(this.time * 2.0) * 0.3 + 0.7;

    this.innerRing.material.opacity = pulse * 0.35;
    this.outerRing.material.opacity = pulse * 0.25;

    // Subtle rotation
    this.outerRing.rotation.z += 0.002;
    this.innerRing.rotation.z -= 0.003;
  }
}
