import * as THREE from 'three';
import { Croman } from '../src/hyboreanage/characters/Croman.js';
import { Trog } from '../src/hyboreanage/characters/Trog.js';
import { CaveEngine } from '../src/cave/CaveEngine.js';
import { PlayerController } from '../src/player/PlayerController.js';

let scene, camera, renderer;
let clock;
let cave;
let player;
let croman;
let trog;

init();
animate();

function init() {

    // --- SCENE ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // --- CAMERA ---
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(0, 2, 5);

    // --- RENDERER ---
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // --- CLOCK ---
    clock = new THREE.Clock();

    // --- CAVE ENGINE ---
    cave = new CaveEngine(scene);
    cave.generate(); // marching cubes cave

    // --- LIGHTING ---
    const light = new THREE.PointLight(0xffffff, 1.2, 50);
    light.position.set(5, 10, 5);
    light.castShadow = true;
    scene.add(light);

    const ambient = new THREE.AmbientLight(0x222222);
    scene.add(ambient);

    // --- PLAYER ---
    player = new PlayerController(camera, renderer.domElement);

    // --- CRO-MAN ---
    croman = new Croman();
    scene.add(croman.mesh);

    // --- TROG ---
    trog = new Trog();
    scene.add(trog.mesh);

    // --- RESIZE HANDLER ---
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // --- UPDATE PLAYER ---
    player.update(delta);

    // --- UPDATE CRO-MAN ---
    croman.update(delta);

    // --- UPDATE TROG (stalking AI) ---
    trog.update(delta, croman.position);

    // --- RENDER ---
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
