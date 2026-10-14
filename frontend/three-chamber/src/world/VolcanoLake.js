import * as THREE from 'three';

const LAVA_VERTEX_SHADER = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LAVA_FRAGMENT_SHADER = `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float radius = length(centered);
    float flowA = sin(vUv.x * 35.0 + sin(vUv.y * 18.0 + uTime * 0.55) * 2.0 - uTime * 1.4);
    float flowB = sin(vUv.y * 29.0 - vUv.x * 13.0 + uTime * 0.8);
    float heat = smoothstep(-0.65, 0.9, flowA * 0.55 + flowB * 0.45);
    float edge = 1.0 - smoothstep(0.12, 0.5, radius);
    vec3 deep = vec3(0.16, 0.018, 0.004);
    vec3 ember = vec3(0.95, 0.12, 0.012);
    vec3 hot = vec3(1.0, 0.62, 0.08);
    vec3 color = mix(deep, ember, heat);
    color = mix(color, hot, smoothstep(0.72, 0.98, heat) * 0.72);
    gl_FragColor = vec4(color, edge);
  }
`;

function createLavaStream(angle, material) {
  const points = [
    new THREE.Vector3(Math.cos(angle) * 4.0, 0.86, Math.sin(angle) * 4.0),
    new THREE.Vector3(Math.cos(angle) * 3.65, 0.62, Math.sin(angle) * 3.65),
    new THREE.Vector3(Math.cos(angle) * 3.0, 0.12, Math.sin(angle) * 3.0),
    new THREE.Vector3(Math.cos(angle) * 2.25, -0.27, Math.sin(angle) * 2.25)
  ];
  const curve = new THREE.CatmullRomCurve3(points);
  return new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.075, 8, false), material);
}

export class VolcanoLake {
  constructor(world) {
    this.time = 0;
    this.root = new THREE.Group();
    this.root.name = 'CaveVolcanoLake';
    world.scene.add(this.root);

    const craterMaterial = new THREE.MeshStandardMaterial({
      color: 0x24292a,
      roughness: 0.94,
      metalness: 0.08,
      side: THREE.DoubleSide
    });
    const craterProfile = [
      new THREE.Vector2(6.1, -1.55),
      new THREE.Vector2(5.6, -0.95),
      new THREE.Vector2(4.8, -0.1),
      new THREE.Vector2(4.2, 0.72),
      new THREE.Vector2(3.8, 1.08),
      new THREE.Vector2(3.35, 0.94),
      new THREE.Vector2(2.95, 0.32),
      new THREE.Vector2(2.5, -0.3)
    ];
    const crater = new THREE.Mesh(new THREE.LatheGeometry(craterProfile, 96), craterMaterial);
    crater.name = 'BasaltCrater';
    this.root.add(crater);

    const base = new THREE.Mesh(
      new THREE.CircleGeometry(6.2, 96),
      new THREE.MeshStandardMaterial({ color: 0x101516, roughness: 1 })
    );
    base.rotation.x = -Math.PI / 2;
    base.position.y = -1.57;
    this.root.add(base);

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(4.0, 0.12, 10, 96),
      new THREE.MeshStandardMaterial({
        color: 0x843b20,
        emissive: 0x431305,
        emissiveIntensity: 0.8,
        roughness: 0.72
      })
    );
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 1.0;
    this.root.add(rim);

    this.lavaMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: LAVA_VERTEX_SHADER,
      fragmentShader: LAVA_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const lake = new THREE.Mesh(new THREE.CircleGeometry(2.52, 96), this.lavaMaterial);
    lake.name = 'AnimatedLava';
    lake.rotation.x = -Math.PI / 2;
    lake.position.y = -0.31;
    this.root.add(lake);

    const streamMaterial = new THREE.MeshBasicMaterial({ color: 0xff5b18 });
    for (let index = 0; index < 6; index += 1) {
      this.root.add(createLavaStream((index / 6) * Math.PI * 2 + 0.22, streamMaterial));
    }

    const light = new THREE.PointLight(0xff4b12, 8, 12, 1.8);
    light.position.set(0, 0.1, 0);
    this.root.add(light);

    const sparkMaterial = new THREE.MeshBasicMaterial({ color: 0xffad45 });
    this.sparks = Array.from({ length: 14 }, (_, index) => {
      const spark = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), sparkMaterial);
      spark.userData.phase = index * 0.71;
      spark.userData.radius = 1.45 + (index % 4) * 0.3;
      this.root.add(spark);
      return spark;
    });
  }

  update(dt) {
    this.time += dt;
    this.lavaMaterial.uniforms.uTime.value = this.time;

    for (const spark of this.sparks) {
      const angle = this.time * 0.42 + spark.userData.phase;
      spark.position.set(
        Math.cos(angle) * spark.userData.radius,
        -0.18 + Math.sin(this.time * 1.8 + spark.userData.phase) * 0.3,
        Math.sin(angle) * spark.userData.radius
      );
    }
  }
}