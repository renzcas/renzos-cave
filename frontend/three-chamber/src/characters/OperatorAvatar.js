import * as THREE from 'three';

export class OperatorAvatar {
  constructor(world, position) {
    this.time = 0;
    this.baseY = position.y;
    this.root = new THREE.Group();
    this.root.name = 'OperatorAvatar';
    this.root.position.copy(position);
    this.root.position.x += 0.22;
    this.root.rotation.y = Math.PI / 2;
    world.scene.add(this.root);

    const suit = new THREE.MeshStandardMaterial({
      color: 0x425359,
      roughness: 0.72,
      metalness: 0.28
    });
    const armor = new THREE.MeshStandardMaterial({
      color: 0x9b6242,
      roughness: 0.52,
      metalness: 0.48
    });
    const dark = new THREE.MeshStandardMaterial({
      color: 0x152126,
      roughness: 0.66,
      metalness: 0.22
    });
    const glow = new THREE.MeshStandardMaterial({
      color: 0x4ce5d0,
      emissive: 0x17bda9,
      emissiveIntensity: 1.3,
      roughness: 0.26,
      metalness: 0.2
    });

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.58, 5, 12), suit);
    torso.position.y = 1.0;
    this.root.add(torso);

    const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.12), armor);
    chestPlate.position.set(0, 1.12, 0.245);
    this.root.add(chestPlate);

    const belt = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.045, 8, 24), dark);
    belt.position.y = 0.67;
    this.root.add(belt);

    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.36, 1.34, 0);
    const leftUpperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.38, 4, 10), suit);
    leftUpperArm.position.y = -0.22;
    leftUpperArm.rotation.z = 0.15;
    this.leftArm.add(leftUpperArm);
    const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), armor);
    this.leftArm.add(leftShoulder);
    this.root.add(this.leftArm);

    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.36, 1.34, 0);
    const rightUpperArm = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, 0.38, 4, 10), suit);
    rightUpperArm.position.y = -0.22;
    rightUpperArm.rotation.z = -0.15;
    this.rightArm.add(rightUpperArm);
    const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), armor);
    this.rightArm.add(rightShoulder);
    this.root.add(this.rightArm);

    for (const side of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.42, 4, 10), dark);
      leg.position.set(side * 0.15, 0.34, 0);
      this.root.add(leg);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.16, 0.34), armor);
      boot.position.set(side * 0.15, 0.08, 0.06);
      this.root.add(boot);
    }

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.27, 20, 14), armor);
    helmet.position.y = 1.78;
    this.root.add(helmet);

    this.visor = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 14),
      new THREE.MeshStandardMaterial({
        color: 0x55e9dd,
        emissive: 0x20c9c1,
        emissiveIntensity: 0.9,
        metalness: 0.35,
        roughness: 0.18
      })
    );
    this.visor.scale.set(1, 0.66, 0.45);
    this.visor.position.set(0, 1.79, 0.205);
    this.root.add(this.visor);

    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.56, 0.24), dark);
    backpack.position.set(0, 1.08, -0.31);
    this.root.add(backpack);

    const packLight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.025), glow);
    packLight.position.set(0, 1.13, -0.438);
    this.root.add(packLight);

    this.halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.018, 8, 40),
      new THREE.MeshBasicMaterial({ color: 0x4ce5d0, transparent: true, opacity: 0.48 })
    );
    this.halo.position.y = 1.08;
    this.halo.rotation.x = Math.PI / 2;
    this.root.add(this.halo);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.025, 0.28, 8), dark);
    antenna.position.set(0.16, 2.02, -0.03);
    this.root.add(antenna);
    const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), glow);
    antennaTip.position.set(0.16, 2.17, -0.03);
    this.root.add(antennaTip);

    const localLight = new THREE.PointLight(0x42dcca, 0.8, 3.2, 2);
    localLight.position.set(0, 1.55, 0.36);
    this.root.add(localLight);
  }

  update(dt) {
    this.time += dt;
    const breath = Math.sin(this.time * 1.6);
    this.root.position.y = this.baseY + breath * 0.035;
    this.leftArm.rotation.z = Math.sin(this.time * 1.2) * 0.035;
    this.rightArm.rotation.z = -Math.sin(this.time * 1.2) * 0.035;
    this.halo.material.opacity = 0.4 + (breath + 1) * 0.08;
    this.visor.material.emissiveIntensity = 0.75 + (breath + 1) * 0.15;
  }
}