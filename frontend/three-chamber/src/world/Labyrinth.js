import * as THREE from 'three';

const GRID_SIZE = 15;
const CELL_SIZE = 0.9;
const WALL_HEIGHT = 2.4;
const MAZE_ORIGIN_X = -5.8;

function createMaze() {
  const maze = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('#'));
  const stack = [{ x: 1, z: 1 }];
  const directions = [[0, -2], [2, 0], [0, 2], [-2, 0]];
  let seed = 0xc0ffee;

  const nextRandom = (limit) => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed % limit;
  };

  maze[1][1] = '.';

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = directions
      .map(([dx, dz]) => ({ x: current.x + dx, z: current.z + dz, dx, dz }))
      .filter(({ x, z }) => x > 0 && z > 0 && x < GRID_SIZE - 1 && z < GRID_SIZE - 1 && maze[z][x] === '#');

    if (neighbors.length === 0) {
      stack.pop();
      continue;
    }

    const next = neighbors[nextRandom(neighbors.length)];
    maze[current.z + next.dz / 2][current.x + next.dx / 2] = '.';
    maze[next.z][next.x] = '.';
    stack.push({ x: next.x, z: next.z });
  }

  maze[1][0] = 'S';
  maze[GRID_SIZE - 2][GRID_SIZE - 1] = 'E';
  return maze;
}

function createBeacon(position, color) {
  const group = new THREE.Group();
  group.position.copy(position);

  const rings = [0, 1].map((index) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.24 + index * 0.16, 0.3 + index * 0.16, 36),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.8 - index * 0.2,
        side: THREE.DoubleSide
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -WALL_HEIGHT / 2 + 0.04 + index * 0.03;
    group.add(ring);
    return ring;
  });

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.1, 1.2, 10, 1, true),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
  );
  beam.position.y = -0.48;
  group.add(beam);

  return { group, rings, beam };
}

export class Labyrinth {
  constructor(world) {
    this.time = 0;
    this.root = new THREE.Group();
    this.root.name = 'CaveLabyrinth';
    this.root.position.x = MAZE_ORIGIN_X;
    world.scene.add(this.root);

    const maze = createMaze();
    const worldSize = GRID_SIZE * CELL_SIZE;
    const offset = (GRID_SIZE - 1) / 2;

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(worldSize, worldSize),
      new THREE.MeshStandardMaterial({ color: 0x121a1c, roughness: 0.96, metalness: 0.04 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -WALL_HEIGHT / 2 - 0.02;
    this.root.add(floor);

    const grid = new THREE.GridHelper(worldSize, GRID_SIZE, 0x4b766e, 0x263d3c);
    grid.position.y = -WALL_HEIGHT / 2 + 0.01;
    grid.material.transparent = true;
    grid.material.opacity = 0.28;
    this.root.add(grid);

    const walls = new THREE.InstancedMesh(
      new THREE.BoxGeometry(CELL_SIZE * 0.94, WALL_HEIGHT, CELL_SIZE * 0.94),
      new THREE.MeshStandardMaterial({
        color: 0x283438,
        roughness: 0.78,
        metalness: 0.18,
        emissive: 0x07110f,
        emissiveIntensity: 0.55
      }),
      GRID_SIZE * GRID_SIZE
    );
    const caps = new THREE.InstancedMesh(
      new THREE.BoxGeometry(CELL_SIZE * 0.84, 0.045, CELL_SIZE * 0.84),
      new THREE.MeshStandardMaterial({
        color: 0x45a99a,
        roughness: 0.5,
        metalness: 0.24,
        emissive: 0x104d44,
        emissiveIntensity: 0.65
      }),
      GRID_SIZE * GRID_SIZE
    );
    const transform = new THREE.Object3D();
    let wallCount = 0;
    let entrancePosition;
    let exitPosition;

    for (let z = 0; z < GRID_SIZE; z += 1) {
      for (let x = 0; x < GRID_SIZE; x += 1) {
        const cell = maze[z][x];
        const position = new THREE.Vector3((x - offset) * CELL_SIZE, 0, (z - offset) * CELL_SIZE);

        if (cell === '#') {
          transform.position.copy(position);
          transform.updateMatrix();
          walls.setMatrixAt(wallCount, transform.matrix);

          transform.position.y = WALL_HEIGHT / 2 + 0.03;
          transform.updateMatrix();
          caps.setMatrixAt(wallCount, transform.matrix);
          wallCount += 1;
        } else if (cell === 'S') {
          entrancePosition = position;
        } else if (cell === 'E') {
          exitPosition = position;
        }
      }
    }

    walls.count = wallCount;
    caps.count = wallCount;
    walls.instanceMatrix.needsUpdate = true;
    caps.instanceMatrix.needsUpdate = true;
    this.root.add(walls, caps);

    const causewayCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(exitPosition.x, -1.03, exitPosition.z),
      new THREE.Vector3(7.5, -1.04, exitPosition.z),
      new THREE.Vector3(8.0, -1.04, 4.4),
      new THREE.Vector3(8.2, -1.04, 2.3),
      new THREE.Vector3(8.2, -1.04, 0)
    ]);
    this.causeway = new THREE.Mesh(
      new THREE.TubeGeometry(causewayCurve, 48, 0.42, 10, false),
      new THREE.MeshBasicMaterial({ color: 0xff6a24, transparent: true, opacity: 0.72 })
    );
    this.causeway.name = 'LavaApproach';
    this.root.add(this.causeway);

    this.beacons = [
      createBeacon(entrancePosition, 0x45dbc1),
      createBeacon(exitPosition, 0xffa15c)
    ];
    this.entrancePosition = entrancePosition.clone();
    this.entrancePosition.x += MAZE_ORIGIN_X;
    this.entrancePosition.y = -WALL_HEIGHT / 2;
    for (const beacon of this.beacons) this.root.add(beacon.group);
  }

  update(dt) {
    this.time += dt;
    const pulse = 1 + Math.sin(this.time * 2.1) * 0.055;
    this.causeway.material.opacity = 0.62 + (pulse - 0.945) * 1.8;

    for (const beacon of this.beacons) {
      beacon.rings[0].scale.setScalar(pulse);
      beacon.rings[1].scale.setScalar(2 - pulse);
      beacon.beam.material.opacity = 0.15 + (pulse - 0.945) * 0.65;
    }
  }
}