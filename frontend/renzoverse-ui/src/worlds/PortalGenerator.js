// PortalGenerator.js — Procedural portal definitions
export function generatePortals(regions) {
  if (!regions || regions.length === 0) return [];

  return regions.slice(0, 5).map(r => ({
    x: r.x,
    y: r.y,
    z: r.z,
    color: pickColor(r.s),
    spin: 0.5 + r.s * 2
  }));
}

function pickColor(stress) {
  if (stress > 0.8) return "#ff0000"; // danger
  if (stress > 0.5) return "#ffaa00"; // unstable
  return "#00ffff"; // stable
}
