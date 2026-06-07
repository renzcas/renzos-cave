import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

export class PlayerControls {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.speed = 6;
    this.sensitivity = 0.002;

    this.keys = {};

    window.addEventListener('keydown', e => this.keys[e.code] = true);
    window.addEventListener('keyup', e => this.keys[e.code] = false);

    window.addEventListener('mousemove', e => {
      if (document.pointerLockElement === document.body) {
        camera.rotation.y -= e.movementX * this.sensitivity;
        camera.rotation.x -= e.movementY * this.sensitivity;
        camera.rotation.x = Math.max(-1.5, Math.min(1.5, camera.rotation.x));
      }
    });

    document.body.onclick = () => {
      document.body.requestPointerLock();
    };
  }

  update(dt) {
    this.direction.set(0, 0, 0);

    if (this.keys['KeyW']) this.direction.z -= 1;
    if (this.keys['KeyS']) this.direction.z += 1;
    if (this.keys['KeyA']) this.direction.x -= 1;
    if (this.keys['KeyD']) this.direction.x += 1;

    this.direction.normalize();

    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    this.velocity.copy(forward).multiplyScalar(this.direction.z * this.speed);
    this.velocity.add(right.multiplyScalar(this.direction.x * this.speed));

    this.camera.position.addScaledVector(this.velocity, dt);
  }
}