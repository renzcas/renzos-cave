// script.js v7 — Full Cave Engine + Chamber + Dynasty + Symbolic + InfoEngine + CaveOS + Curriculum + Challenges + Minimap
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js';

import { Chamber } from "./engine/Chamber.js";
import { OperatorDynasty } from "./engine/OperatorDynasty.js";
import { SymbolicEngine } from "./engine/SymbolicEngine.js";
import { InfoEngine } from "./engine/InfoEngine.js";
import { CaveOS } from "./engine/CaveOS.js";
import { RPGCurriculum } from "./engine/RPGCurriculum.js";
import { ChallengeSystem } from "./engine/ChallengeSystem.js";
import { Minimap } from "./engine/Minimap.js";

let scene, camera, renderer, clock;
let boulders = [];
let fireLights = [];

let chamber;
let dynasty;
let symbolic;
let infoEngine;
let curriculum;
let challenges;
let caveOS;
let minimap;

let t = 0;

// ----------------------
// Init
// ----------------------
initScene();
createCave();

chamber = new Chamber(scene);
dynasty = new OperatorDynasty();
symbolic = new SymbolicEngine(scene, dynasty);
curriculum = new RPGCurriculum({ dynasty, symbolic });
challenges = new ChallengeSystem({ dynasty, symbolic, curriculum });
infoEngine = new InfoEngine({ chamber, dynasty, symbolic });

caveOS = new CaveOS({
    chamber,
    dynasty,
    symbolic,
    infoEngine,
    curriculum,
    challenges
});

minimap = new Minimap({ chamber, symbolic });

animate();

// ----------------------
// Scene setup
// ----------------------
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050308);

    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100);
    camera.position.set(0, 2.2, 6);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.zIndex = "-1";

    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ----------------------
// Cave geometry
// ----------------------
function createCave() {
    const groundGeo = new THREE.CircleGeometry(10, 32);
    const groundMat = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const boulderGeo = new THREE.DodecahedronGeometry(0.6, 0);
    const boulderMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.2,
    });

    for (let i = 0; i < 10; i++) {
        const b = new THREE.Mesh(boulderGeo, boulderMat);
        const angle = (i / 10) * Math.PI * 2;
        const radius = 2.5 + Math.random() * 1.5;
        b.position.set(
            Math.cos(angle) * radius,
            0.3 + Math.random() * 0.4,
            Math.sin(angle) * radius
        );
        b.castShadow = true;
        b.receiveShadow = true;
        scene.add(b);
        boulders.push(b);
    }

    const ambient = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambient);

    addFireLight(new THREE.Vector3(0, 0.6, 0));
    addFireLight(new THREE.Vector3(-2, 0.6, -1.5));
    addFireLight(new THREE.Vector3(2, 0.6, -1.5));
}

function addFireLight(position) {
    const light = new THREE.PointLight(0xff5500, 2, 8, 2);
    light.position.copy(position);
    light.castShadow = true;
    scene.add(light);
    fireLights.push(light);

    const sphereGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    const ember = new THREE.Mesh(sphereGeo, sphereMat);
    ember.position.copy(position);
    scene.add(ember);
}

// ----------------------
// Animation loop
// ----------------------
function animate() {
    requestAnimationFrame(animate);

    const dt = clock.getDelta();
    t += dt;

    camera.position.x = Math.sin(t * 0.2) * 1.2;
    camera.position.z = 6 + Math.cos(t * 0.2) * 0.5;
    camera.lookAt(0, 1.2, 0);

    boulders.forEach((b, i) => {
        b.rotation.y += 0.1 * dt;
        b.rotation.x += 0.05 * dt * (i % 2 === 0 ? 1 : -1);
    });

    fireLights.forEach((light, i) => {
        const baseIntensity = 2;
        const flicker =
            0.4 * Math.sin(t * 8 + i * 1.3) +
            0.2 * Math.sin(t * 17 + i * 0.7);
        light.intensity = baseIntensity + flicker;
    });

    chamber.update(dt);
    dynasty.update(dt);
    symbolic.update(dt, chamber);
    curriculum.update(dt);
    challenges.update(dt);
    infoEngine.update(dt);
    caveOS.update(dt);
    minimap.update(dt);

    updateHeart(t);

    renderer.render(scene, camera);
}

// ----------------------
// DOM Heart sync
// ----------------------
function updateHeart(time) {
    const heart = document.getElementById("cave-heart");
    if (!heart) return;

    const glow = 40 + Math.sin(time * 3) * 20;
    const scale = 1 + Math.sin(time * 2.2) * 0.08;

    heart.style.boxShadow = `0 0 ${glow}px #ff00ff`;
    heart.style.transform = `translate(-50%, -50%) scale(${scale})`;
}
