import * as THREE from 'three';

export class RegionMeshGenerator {
  constructor(world) {
    this.world = world;
    this.voxels = [];
  }

  update(packet) {
    // If no packet yet, do nothing
    if (!packet || !packet.world || !packet.world.nodes) {
      this.voxels = [];
      return;
    }

    // Convert world nodes → voxel points
    this.voxels = packet.world.nodes.map(n => ({
      x: n.x,
      y: n.y,
      z: n.z,
      s: n.s || 1.0
    }));
  }
}
