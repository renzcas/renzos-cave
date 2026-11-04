import * as THREE from 'three';
import { Croman } from '../../../src/hyboreanage/characters/Croman.js';
import { Trog } from '../../../src/hyboreanage/characters/Trog.js';

let scene, camera, renderer;
let clock;
let croman;
let trog;

init();
animate();

function init() {

    // --- SCENE ---
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x10151a);
    scene.fog = new THREE.Fog(0x10151a, 18, 60);

    // --- CAMERA ---
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.set(3, 5, 14);
    camera.lookAt(2.5, 1, -1.5);

    // --- RENDERER ---
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // --- CLOCK ---
    clock = new THREE.Clock();

    // --- GROUND ---
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 80),
        new THREE.MeshStandardMaterial({ color: 0x26332f, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    scene.add(ground);
    scene.add(new THREE.GridHelper(40, 40, 0x56706a, 0x35443f));

    // --- LIGHTING ---
    const light = new THREE.DirectionalLight(0xffe6c2, 2.2);
    light.position.set(-4, 10, 8);
    light.castShadow = true;
    scene.add(light);

    const ambient = new THREE.HemisphereLight(0xc3e6ff, 0x3c3028, 1.5);
    scene.add(ambient);

    // --- CHARACTERS ---
    croman = new Croman();
    scene.add(croman.mesh);

    trog = new Trog();
    scene.add(trog.mesh);

    renderer.domElement.setAttribute('aria-label', '3D character viewer: Croman and Trog');

    // --- RESIZE HANDLER ---
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // --- UPDATE CRO-MAN ---
    croman.update(delta);

    // --- UPDATE TROG (stalking AI) ---
    trog.update(delta, croman.mesh.position);

    // --- RENDER ---
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
