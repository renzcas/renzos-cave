// main.js
import { CaveEngine } from './CaveEngine.js';
import { SPAWN_POINT } from './SpawnPoints.js';
import { createPortal } from './Portals.js';

// Grab the container div
const container = document.getElementById('app');

// Start the Cave Engine
const engine = new CaveEngine(container);

// Set initial spawn point
engine.camera.position.set(
    SPAWN_POINT.x,
    SPAWN_POINT.y,
    SPAWN_POINT.z
);

// Example: create a portal in the first chamber
const firstPortal = createPortal({ x: 10, y: 5, z: -20 });
console.log("Portal created:", firstPortal);
