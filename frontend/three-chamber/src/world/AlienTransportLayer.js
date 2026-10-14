import * as THREE from 'three';

const FIELD_VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FIELD_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uEnergy;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float radius = length(centered) * 2.0;
    float waves = sin(radius * 34.0 - uTime * (1.8 + uEnergy * 1.5));
    float scan = sin(vUv.y * 54.0 + uTime * 0.7) * 0.5 + 0.5;
    float edge = 1.0 - smoothstep(0.78, 1.0, radius);
    float shimmer = 0.52 + waves * 0.12 + scan * 0.14 + uEnergy * 0.18;
    vec3 deep = vec3(0.015, 0.16, 0.19);
    vec3 bright = vec3(0.16, 0.92, 0.79);
    vec3 color = mix(deep, bright, clamp(shimmer, 0.0, 1.0));
    gl_FragColor = vec4(color, edge * (0.42 + uEnergy * 0.22));
  }
`;

function createPylon(material, x) {
  const pylon = new THREE.Group();
  pylon.position.x = x;

  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 2.3, 10), material);
  shaft.position.y = -0.23;
  pylon.add(shaft);

  const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), material);
  shoulder.position.y = 0.92;
  pylon.add(shoulder);

  return pylon;
}

export class AlienTransportLayer {
  constructor(world) {
    this.time = 0;
    this.root = new THREE.Group();
    this.root.name = 'AlienTransportLayer';
    this.root.position.set(16.1, 0, 0);
    world.scene.add(this.root);

    const alloy = new THREE.MeshStandardMaterial({
      color: 0x30474a,
      roughness: 0.36,
      metalness: 0.82
    });
    const copper = new THREE.MeshStandardMaterial({
      color: 0xa45d3d,
      emissive: 0x4a1c10,
      emissiveIntensity: 0.7,
      roughness: 0.42,
      metalness: 0.68
    });
    const cyan = new THREE.MeshBasicMaterial({ color: 0x48e7cf });

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(2.15, 2.35, 0.34, 12),
      new THREE.MeshStandardMaterial({ color: 0x182528, roughness: 0.58, metalness: 0.7 })
    );
    platform.position.y = -1.32;
    this.root.add(platform);

    const deckRing = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.045, 8, 64), cyan);
    deckRing.rotation.x = Math.PI / 2;
    deckRing.position.y = -1.12;
    this.root.add(deckRing);

    for (let index = 0; index < 8; index += 1) {
      const angle = (index / 8) * Math.PI * 2;
      const marker = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.045, 0.12), cyan);
      marker.position.set(Math.cos(angle) * 1.72, -1.1, Math.sin(angle) * 1.72);
      marker.rotation.y = -angle;
      this.root.add(marker);
    }

    this.ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.13, 12, 72), alloy);
    this.ring.position.y = 1.05;
    this.root.add(this.ring);

    this.innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.045, 8, 72), copper);
    this.innerRing.position.y = 1.05;
    this.root.add(this.innerRing);

    this.fieldMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uEnergy: { value: 0.4 }
      },
      vertexShader: FIELD_VERTEX_SHADER,
      fragmentShader: FIELD_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const field = new THREE.Mesh(new THREE.CircleGeometry(1.47, 72), this.fieldMaterial);
    field.position.set(0, 1.05, -0.025);
    this.root.add(field);

    this.pylons = [-1.82, 1.82].map((x) => createPylon(alloy, x));
    for (const pylon of this.pylons) this.root.add(pylon);

    for (const side of [-1, 1]) {
      const brace = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.16), copper);
      brace.position.set(side * 1.55, 0.72, 0);
      brace.rotation.z = side * -0.58;
      this.root.add(brace);
    }

    const approachCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.1, -1.18, 5.1),
      new THREE.Vector3(-3.0, -1.18, 4.4),
      new THREE.Vector3(-2.2, -1.18, 3.1),
      new THREE.Vector3(-1.8, -1.18, 1.85)
    ]);
    this.approach = new THREE.Mesh(
      new THREE.TubeGeometry(approachCurve, 32, 0.32, 10, false),
      new THREE.MeshBasicMaterial({ color: 0x42d8c5, transparent: true, opacity: 0.62 })
    );
    this.root.add(this.approach);

    this.markers = Array.from({ length: 4 }, (_, index) => {
      const marker = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.16, 0),
        new THREE.MeshStandardMaterial({
          color: index % 2 === 0 ? 0x54ddcf : 0xd47e56,
          emissive: index % 2 === 0 ? 0x1aa99d : 0x6a2d17,
          emissiveIntensity: 0.9,
          metalness: 0.54,
          roughness: 0.3
        })
      );
      marker.userData.phase = (index / 4) * Math.PI * 2;
      marker.userData.radius = index % 2 === 0 ? 2.35 : 2.05;
      this.root.add(marker);
      return marker;
    });

    this.light = new THREE.PointLight(0x45dbc9, 2.2, 8, 2);
    this.light.position.set(0, 1.0, 0.3);
    this.root.add(this.light);
  }

  update(dt, packet) {
    this.time += dt;
    const resonance = Number(packet?.signals?.resonance ?? packet?.resonance) || 0;
    const energy = THREE.MathUtils.clamp(resonance / 10, 0, 1);
    const pulse = 1 + Math.sin(this.time * (1.6 + energy)) * 0.035;

    this.fieldMaterial.uniforms.uTime.value = this.time;
    this.fieldMaterial.uniforms.uEnergy.value = energy;
    this.ring.scale.setScalar(pulse);
    this.innerRing.rotation.z += dt * (0.12 + energy * 0.3);
    this.approach.material.opacity = 0.48 + pulse * 0.14;
    this.light.intensity = 1.8 + energy * 2.2 + Math.sin(this.time * 2.2) * 0.35;

    for (const marker of this.markers) {
      const angle = this.time * 0.36 + marker.userData.phase;
      marker.position.set(
        Math.cos(angle) * marker.userData.radius,
        1.05 + Math.sin(angle * 1.4) * 0.28,
        Math.sin(angle) * 0.38
      );
      marker.rotation.x += dt * 0.5;
      marker.rotation.y += dt * 0.7;
    }
  }
}