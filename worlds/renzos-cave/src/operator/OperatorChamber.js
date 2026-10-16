import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class OperatorChamber {
  constructor(container, { onTextureError }) {
    this.container = container;
    this.onTextureError = onTextureError;
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x081114);
    this.scene.fog = new THREE.Fog(0x081114, 18, 38);

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    this.camera.position.set(0, 8.2, 15.5);
    this.camera.lookAt(0, 1, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 1, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 9;
    this.controls.maxDistance = 24;
    this.controls.maxPolarAngle = Math.PI * 0.47;

    this.mappedField = new THREE.Group();
    this.mappedField.matrixAutoUpdate = false;
    this.scene.add(this.mappedField);

    this.animatedEntities = [];
    this.makeLighting();
    this.makeArchitecture();
    this.makeMappedGeometry();
    this.loadEntities();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
  }

  makeLighting() {
    this.scene.add(new THREE.HemisphereLight(0x9dd9d3, 0x101619, 1.3));
    const key = new THREE.DirectionalLight(0xb2fff3, 2.2);
    key.position.set(-5, 11, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    this.scene.add(key);

    const cyan = new THREE.PointLight(0x47e9db, 38, 18, 1.7);
    cyan.position.set(0, 2.2, 0);
    this.scene.add(cyan);
    this.coreLight = cyan;

    const amber = new THREE.PointLight(0xffa454, 15, 13, 1.8);
    amber.position.set(5, 3, -4);
    this.scene.add(amber);
  }

  makeArchitecture() {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(8, 80),
      new THREE.MeshStandardMaterial({ color: 0x121e20, roughness: 0.92, metalness: 0.12 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.13;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const grid = new THREE.GridHelper(16, 32, 0x2a7773, 0x1c3c3e);
    grid.position.y = -0.115;
    grid.material.transparent = true;
    grid.material.opacity = 0.36;
    this.scene.add(grid);

    const outerRing = new THREE.Mesh(
      new THREE.TorusGeometry(7.2, 0.1, 10, 96),
      new THREE.MeshStandardMaterial({
        color: 0x28625e,
        emissive: 0x123b38,
        emissiveIntensity: 0.8,
        roughness: 0.35,
        metalness: 0.65
      })
    );
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = 0.02;
    this.scene.add(outerRing);

    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.25, 3.5, 5),
        new THREE.MeshStandardMaterial({
          color: 0x26383a,
          emissive: 0x0c2727,
          emissiveIntensity: 0.7,
          roughness: 0.55,
          metalness: 0.45
        })
      );
      pillar.position.set(Math.cos(angle) * 6.9, 1.55, Math.sin(angle) * 6.9);
      pillar.rotation.y = angle;
      pillar.castShadow = true;
      this.scene.add(pillar);

      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.28, 0),
        new THREE.MeshStandardMaterial({
          color: 0x9affed,
          emissive: 0x3af0d3,
          emissiveIntensity: 1.6,
          roughness: 0.18,
          metalness: 0.25
        })
      );
      crystal.position.set(Math.cos(angle) * 6.9, 3.38, Math.sin(angle) * 6.9);
      this.scene.add(crystal);
      this.animatedEntities.push({ object: crystal, pulse: index * 0.42, baseY: 3.38 });
    }
  }

  makeMappedGeometry() {
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x66f5df,
      emissive: 0x1aa99a,
      emissiveIntensity: 1.15,
      roughness: 0.28,
      metalness: 0.62
    });

    for (const radius of [2.1, 3.55, 5.05]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.035, 8, 96), ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.11;
      this.mappedField.add(ring);
    }

    const axisX = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0.18, 0),
      4.8,
      0x65f4df,
      0.38,
      0.22
    );
    const axisZ = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0.18, 0),
      4.8,
      0xff9f67,
      0.38,
      0.22
    );
    this.mappedField.add(axisX, axisZ);

    for (let index = 0; index < 8; index += 1) {
      const angle = (index / 8) * Math.PI * 2;
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 2.4, 1.1),
        new THREE.MeshStandardMaterial({
          color: 0x2d7470,
          emissive: 0x0b2524,
          emissiveIntensity: 0.8,
          transparent: true,
          opacity: 0.74,
          metalness: 0.55,
          roughness: 0.32
        })
      );
      wall.position.set(Math.cos(angle) * 5.35, 1.25, Math.sin(angle) * 5.35);
      wall.rotation.y = -angle;
      this.mappedField.add(wall);
    }

    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.4, 0.3, 8),
      new THREE.MeshStandardMaterial({
        color: 0x234643,
        emissive: 0x124d46,
        emissiveIntensity: 0.9,
        metalness: 0.7,
        roughness: 0.25
      })
    );
    plinth.position.y = 0.13;
    this.mappedField.add(plinth);

    this.core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.56, 1),
      new THREE.MeshStandardMaterial({
        color: 0xa8fff2,
        emissive: 0x4bead2,
        emissiveIntensity: 1.9,
        metalness: 0.25,
        roughness: 0.12
      })
    );
    this.core.position.y = 1.35;
    this.mappedField.add(this.core);
    this.animatedEntities.push({ object: this.core, pulse: 0, baseY: 1.35 });
  }

  async loadEntities() {
    const dragonUrl = new URL('../assets/sprites/dragon.png', import.meta.url).href;
    const trogUrl = new URL('../assets/sprites/trog-3-vers.png', import.meta.url).href;
    try {
      const [dragonTexture, trogTexture] = await Promise.all([
        loadTexture(dragonUrl, { removeWhite: true }),
        loadTexture(trogUrl, { cropRightPanel: true })
      ]);
      const dragon = makeCharacterSprite(dragonTexture, 3.8, 3.2);
      dragon.position.set(-3.45, 1.6, 0.15);
      const trog = makeCharacterSprite(trogTexture, 2.15, 3.45);
      trog.position.set(3.3, 1.7, -0.35);
      this.mappedField.add(dragon, trog);
      this.animatedEntities.push(
        { object: dragon, pulse: 0.9, baseY: 1.6, bob: 0.14 },
        { object: trog, pulse: 2.6, baseY: 1.7, bob: 0.1 }
      );
      document.getElementById('loading-status').textContent = '';
    } catch (error) {
      this.onTextureError(error);
      document.getElementById('loading-status').textContent =
        'Could not load character art. Check the sprite asset paths and reload.';
    }
  }

  setOperatorMatrix(matrix) {
    this.mappedField.matrix.set(
      matrix[0], 0, matrix[1], 0,
      0, 1, 0, 0,
      matrix[2], 0, matrix[3], 0,
      0, 0, 0, 1
    );
    this.mappedField.matrixWorldNeedsUpdate = true;
  }

  setResonance(score) {
    const dissonance = 1 - score;
    const color = new THREE.Color().setRGB(
      0.2 + 0.8 * dissonance,
      0.95 - 0.52 * dissonance,
      0.84 - 0.42 * dissonance
    );
    this.core.material.emissive.copy(color);
    this.core.material.color.copy(color).lerp(new THREE.Color(0xffffff), 0.45);
    this.coreLight.color.copy(color);
    this.coreLight.intensity = 24 + 24 * score;
    this.mappedField.children.forEach((child) => {
      if (child.material?.emissive && child !== this.core) {
        child.material.emissiveIntensity = 0.55 + score * 1.1;
      }
    });
  }

  update(dt) {
    const elapsed = this.clock.elapsedTime;
    this.controls.update();
    this.core.rotation.y += dt * 0.32;
    this.core.rotation.x += dt * 0.17;
    this.animatedEntities.forEach(({ object, pulse, baseY, bob = 0.05 }) => {
      const wave = Math.sin(elapsed * 1.5 + pulse);
      object.position.y = baseY + wave * bob;
      if (object.isSprite) object.material.rotation = wave * 0.025;
      else object.scale.setScalar(1 + (wave + 1) * 0.035);
    });
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (width === 0 || height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  start() {
    const tick = () => {
      this.frame = requestAnimationFrame(tick);
      this.update(Math.min(this.clock.getDelta(), 0.05));
    };
    tick();
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
  }
}

function makeCharacterSprite(texture, width, height) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.025,
      depthWrite: false,
      toneMapped: false
    })
  );
  sprite.scale.set(width, height, 1);
  return sprite;
}

function loadTexture(url, options = {}) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(
      url,
      (texture) => {
        try {
          const source = texture.image;
          const canvas = document.createElement('canvas');
          const crop = options.cropRightPanel
            ? {
                x: Math.floor(source.width * (2 / 3)),
                y: 0,
                width: Math.ceil(source.width / 3),
                height: Math.floor(source.height * 0.8)
              }
            : { x: 0, y: 0, width: source.width, height: source.height };
          canvas.width = crop.width;
          canvas.height = crop.height;
          const context = canvas.getContext('2d', { willReadFrequently: options.removeWhite });
          if (!context) throw new Error('Canvas 2D context is unavailable for sprite processing.');
          context.drawImage(
            source,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
          );
          if (options.removeWhite) removeNearWhiteBackground(context, crop.width, crop.height);
          texture.dispose();
          const processed = new THREE.CanvasTexture(canvas);
          processed.colorSpace = THREE.SRGBColorSpace;
          processed.needsUpdate = true;
          resolve(processed);
        } catch (error) {
          texture.dispose();
          reject(error);
        }
      },
      undefined,
      (error) => reject(new Error(`Failed to load sprite ${url}: ${error.message ?? error}`))
    );
  });
}

function removeNearWhiteBackground(context, width, height) {
  const image = context.getImageData(0, 0, width, height);
  const pixels = image.data;
  for (let index = 0; index < pixels.length; index += 4) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const brightest = Math.max(red, green, blue);
    const darkest = Math.min(red, green, blue);
    if (darkest > 235 && brightest - darkest < 24) {
      pixels[index + 3] = Math.round(pixels[index + 3] * (255 - darkest) / 20);
    }
  }
  context.putImageData(image, 0, 0);
}
