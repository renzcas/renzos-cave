import * as THREE from 'three';
import './four-pillar-trial.css';

const PILLARS = [
  {
    name: 'Eikasia · Shadows',
    lesson: 'A shadow is evidence of light and an object, but not the object itself.',
    question: 'The Hydra’s shadow moves, but the creature is hidden. What should you do?',
    answers: [
      { label: 'Follow the shadow; it must show the whole truth.', correct: false },
      { label: 'Trace the light and look for what casts it.', correct: true }
    ],
    success: 'You separated appearance from its source. The first step out of the cave is learning to question what you see.'
  },
  {
    name: 'Pistis · Tested Belief',
    lesson: 'Observation becomes stronger when a belief is checked against the world.',
    question: 'Two trails cross in the dust. How do you decide which leads deeper into the cave?',
    answers: [
      { label: 'Measure the tracks and compare them with what you can observe.', correct: true },
      { label: 'Choose the trail that sounds most dramatic.', correct: false }
    ],
    success: 'You tested a claim instead of accepting it on authority. Belief becomes reliable when it answers to evidence.'
  },
  {
    name: 'Dianoia · Mathematical Logos',
    lesson: 'Reason can discover a rule that is not visible in any single observation.',
    question: 'The gate pulses in this pattern: 2, 4, 8, … What number completes it?',
    answers: [
      { label: '12', correct: false },
      { label: '16', correct: true },
      { label: '18', correct: false }
    ],
    success: 'You found the doubling rule. Mathematical thought turns scattered events into a structure you can explain.'
  },
  {
    name: 'Noesis · The Good',
    lesson: 'Knowledge is not enough; wisdom asks what understanding is for.',
    question: 'The transporter can open now, but its shortcut strands one of your companions. What do you choose?',
    answers: [
      { label: 'Take the shortcut and leave them behind.', correct: false },
      { label: 'Find a path that brings everyone through safely.', correct: true }
    ],
    success: 'You chose understanding in service of the Good. The transporter recognizes a purpose beyond power.'
  }
];

const REALM_COLORS = [0x9b6742, 0x68a6a2, 0x61d8e8, 0xffd27a];

export class FourPillarTrial {
  constructor(scene, ionChamber) {
    this.scene = scene;
    this.ionChamber = ionChamber;
    this.time = 0;
    this.stageIndex = -1;
    this.answeredCorrectly = false;
    this.complete = false;
    this.environment = new THREE.Group();
    this.environment.name = 'GoldenBoughThreshold';
    scene.add(this.environment);

    this.buildThreshold();
    this.prepareTransporter();
    this.createInterface();
    this.showIntro();
    this.setRealmVisuals(0);
  }

  buildThreshold() {
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x201d1a,
      roughness: 0.96
    });
    const ground = new THREE.Mesh(new THREE.CircleGeometry(6.5, 48), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -1.28, -1);
    this.environment.add(ground);

    this.stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x39332e,
      roughness: 0.94,
      flatShading: true
    });
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(3.15, 0.38, 10, 48),
      this.stoneMaterial
    );
    arch.position.set(0, 0.15, -2.2);
    this.environment.add(arch);

    for (const x of [-3.15, 3.15]) {
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.38, 0.55, 2.8, 8),
        this.stoneMaterial
      );
      pillar.position.set(x, -1.05, -2.2);
      this.environment.add(pillar);
    }

    const caveMouth = new THREE.Mesh(
      new THREE.CircleGeometry(2.75, 40),
      new THREE.MeshBasicMaterial({ color: 0x090b11 })
    );
    caveMouth.position.set(0, 0.15, -2.28);
    this.environment.add(caveMouth);

    this.grid = new THREE.GridHelper(12, 24, 0x54e3ec, 0x24737b);
    this.grid.position.set(0, -1.25, -1);
    this.grid.material.transparent = true;
    this.grid.material.opacity = 0.42;
    this.grid.visible = false;
    this.environment.add(this.grid);

    this.createTraveler(-1.05, 0x806044, 0.72);
    this.createTraveler(0.35, 0xc49a70, 0.55);
    this.createGoldenBough();
    this.createHydra();
    this.createDragon();

    this.realmLight = new THREE.PointLight(0xffa05c, 2.2, 14);
    this.realmLight.position.set(0, 2.2, 1);
    this.environment.add(this.realmLight);
  }

  createTraveler(x, color, headScale) {
    const traveler = new THREE.Group();
    traveler.position.set(x, -0.88, -0.35);

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.9,
      flatShading: true
    });
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.28, 0.65, 4, 8),
      bodyMaterial
    );
    body.position.y = -0.08;
    traveler.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.23 * headScale, 12, 10),
      bodyMaterial
    );
    head.position.y = 0.48;
    traveler.add(head);

    for (const side of [-1, 1]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.095, 0.12, 0.45, 6),
        bodyMaterial
      );
      leg.position.set(side * 0.15, -0.55, 0);
      traveler.add(leg);
    }

    this.environment.add(traveler);
  }

  createGoldenBough() {
    const gold = new THREE.MeshStandardMaterial({
      color: 0xf2c85a,
      emissive: 0x9b6914,
      emissiveIntensity: 0.65,
      roughness: 0.55,
      metalness: 0.38
    });
    const bough = new THREE.Group();
    bough.position.set(2.35, -0.2, -1.2);

    const branch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.075, 1.65, 7),
      gold
    );
    branch.rotation.z = -0.65;
    bough.add(branch);

    for (const [x, y, angle] of [
      [-0.33, 0.25, -0.7],
      [0.08, 0.43, 0.55],
      [0.32, -0.12, 0.8],
      [-0.04, -0.43, -0.5]
    ]) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), gold);
      leaf.scale.set(0.55, 1.4, 0.35);
      leaf.position.set(x, y, 0);
      leaf.rotation.z = angle;
      bough.add(leaf);
    }

    this.environment.add(bough);
    this.boughLight = new THREE.PointLight(0xffc95e, 1.4, 4);
    this.boughLight.position.set(2.35, 0.5, -0.8);
    this.environment.add(this.boughLight);
  }

  createHydra() {
    const hydra = new THREE.Group();
    const hide = new THREE.MeshStandardMaterial({
      color: 0x344640,
      roughness: 0.85,
      flatShading: true
    });
    const eye = new THREE.MeshBasicMaterial({ color: 0xf4be54 });

    for (const x of [-0.52, 0, 0.52]) {
      const neckCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(x * 0.55, -0.65, -3.8),
        new THREE.Vector3(x * 0.85, -0.1, -3.65),
        new THREE.Vector3(x, 0.42 + (x === 0 ? 0.14 : 0), -3.6)
      ]);
      const neck = new THREE.Mesh(
        new THREE.TubeGeometry(neckCurve, 12, 0.13, 7, false),
        hide
      );
      hydra.add(neck);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), hide);
      head.position.set(x, 0.47 + (x === 0 ? 0.14 : 0), -3.58);
      head.scale.set(1.2, 0.8, 1);
      hydra.add(head);

      const eyeDot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), eye);
      eyeDot.position.set(x + 0.08, head.position.y + 0.025, -3.37);
      hydra.add(eyeDot);
    }

    this.environment.add(hydra);
  }

  createDragon() {
    const dragon = new THREE.Group();
    dragon.position.set(-1.2, -1.05, -4.5);
    dragon.rotation.y = -0.2;
    const scales = new THREE.MeshStandardMaterial({
      color: 0x474a3c,
      roughness: 1,
      flatShading: true
    });

    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.24, 0.9, 4, 8),
      scales
    );
    body.rotation.z = Math.PI / 2;
    dragon.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), scales);
    head.position.set(0.62, 0.02, 0);
    dragon.add(head);

    const tail = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.9, 8),
      scales
    );
    tail.rotation.z = -Math.PI / 2;
    tail.position.set(-0.95, 0, 0);
    dragon.add(tail);
    this.environment.add(dragon);
    this.dragon = dragon;
  }

  prepareTransporter() {
    this.ionChamber.root.visible = false;
    this.ionChamber.root.position.set(0, 1.15, -4.4);
    this.ionChamber.root.scale.setScalar(0.55);
  }

  createInterface() {
    this.root = document.createElement('section');
    this.root.id = 'four-pillar-trial';
    this.root.setAttribute('aria-labelledby', 'trial-title');
    this.root.innerHTML = `
      <p class="trial-kicker">RENZO'S CAVE · OFFLINE STORY PROTOTYPE</p>
      <h1 id="trial-title"></h1>
      <div class="trial-progress" aria-label="Four realm progress"></div>
      <div class="trial-content" aria-live="polite"></div>
      <p class="trial-feedback" aria-live="polite"></p>
      <div class="trial-actions"></div>
      <p class="trial-footnote">No live news feed or real-world conflict data is connected.</p>
    `;
    document.body.append(this.root);
    this.title = this.root.querySelector('#trial-title');
    this.progress = this.root.querySelector('.trial-progress');
    this.content = this.root.querySelector('.trial-content');
    this.feedback = this.root.querySelector('.trial-feedback');
    this.actions = this.root.querySelector('.trial-actions');
    this.renderProgress();
  }

  showIntro() {
    this.title.textContent = 'The Golden Bough';
    this.content.textContent =
      'At the cave mouth, Trog and Cro-Mag meet beneath an impossible golden branch. The Hydra guards the passage; a Komodo dragon waits in the dark beyond. Begin with what can be seen, then test what can be known.';
    this.feedback.textContent = '';
    this.actions.replaceChildren();
    this.addButton('Enter the cave', () => this.enterTrial());
  }

  enterTrial() {
    this.stageIndex = 0;
    this.renderStage();
  }

  renderStage() {
    const pillar = PILLARS[this.stageIndex];
    this.answeredCorrectly = false;
    this.root.dataset.realm = String(this.stageIndex + 1);
    this.title.textContent = `Trial ${this.stageIndex + 1} · ${pillar.name}`;
    this.content.replaceChildren();

    const lesson = document.createElement('p');
    lesson.className = 'trial-lesson';
    lesson.textContent = pillar.lesson;
    const question = document.createElement('p');
    question.className = 'trial-question';
    question.textContent = pillar.question;
    const choices = document.createElement('div');
    choices.className = 'trial-choices';

    pillar.answers.forEach((answer) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'trial-choice';
      button.textContent = answer.label;
      button.addEventListener('click', () => this.answer(answer, choices));
      choices.append(button);
    });

    this.content.append(lesson, question, choices);
    this.feedback.textContent = '';
    this.actions.replaceChildren();
    this.renderProgress();
    this.setRealmVisuals(this.stageIndex);
  }

  answer(answer, choices) {
    if (this.answeredCorrectly) return;

    if (!answer.correct) {
      this.feedback.textContent = 'Not quite. Look again, then choose a different way forward.';
      this.feedback.dataset.kind = 'try-again';
      return;
    }

    this.answeredCorrectly = true;
    this.feedback.textContent = PILLARS[this.stageIndex].success;
    this.feedback.dataset.kind = 'success';
    choices.querySelectorAll('button').forEach((button) => {
      button.disabled = true;
    });
    this.actions.replaceChildren();

    if (this.stageIndex === PILLARS.length - 1) {
      this.addButton('Activate the transporter', () => this.unlockTransporter());
    } else {
      this.addButton('Continue to the next realm', () => {
        this.stageIndex += 1;
        this.renderStage();
      });
    }
  }

  unlockTransporter() {
    this.complete = true;
    this.ionChamber.root.visible = true;
    this.title.textContent = 'The Alien SI Transporter';
    this.content.textContent =
      'The four trials are complete. The transporter is awake—but what it means to use it is the next question. This prototype ends at the threshold.';
    this.feedback.textContent = 'Eikasia → Pistis → Dianoia → Noesis';
    this.feedback.dataset.kind = 'success';
    this.actions.replaceChildren();
    this.renderProgress();
    this.setRealmVisuals(3);
  }

  addButton(label, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'trial-primary';
    button.textContent = label;
    button.addEventListener('click', onClick);
    this.actions.append(button);
  }

  renderProgress() {
    this.progress.replaceChildren();
    PILLARS.forEach((pillar, index) => {
      const item = document.createElement('span');
      item.className = 'trial-step';
      item.textContent = `${index + 1}. ${pillar.name.split(' · ')[0]}`;
      if (index < this.stageIndex || this.complete) item.dataset.state = 'complete';
      else if (index === this.stageIndex) item.dataset.state = 'current';
      this.progress.append(item);
    });
  }

  setRealmVisuals(index) {
    const color = REALM_COLORS[index];
    this.realmLight.color.setHex(color);
    this.boughLight.intensity = index === 3 ? 0.8 : 1.4;
    this.grid.visible = index >= 2;
    this.scene.background = new THREE.Color(index >= 2 ? 0x070d14 : 0x050509);
    this.stoneMaterial.emissive.setHex(index === 3 ? 0x14352f : 0x000000);
    this.stoneMaterial.emissiveIntensity = index === 3 ? 0.8 : 0;
  }

  update(dt) {
    this.time += dt;
    this.dragon.position.y = -1.05 + Math.sin(this.time * 1.4) * 0.025;
    this.boughLight.intensity = 1.2 + Math.sin(this.time * 2) * 0.18;
  }
}
