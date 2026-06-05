import { CaveEngine } from './CaveEngine.js';
import { SPAWN_POINT } from './SpawnPoints.js';
import { createPortal } from './Portals.js';

const container = document.getElementById('app');

const engine = new CaveEngine(container);

engine.camera.position.set(
    SPAWN_POINT.x,
    SPAWN_POINT.y,
    SPAWN_POINT.z
);

const firstPortal = createPortal({ x: 10, y: 5, z: -20 });
console.log("Portal created:", firstPortal);
