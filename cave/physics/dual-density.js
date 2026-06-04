// dual-density.js
// Combines symbolic density + physical density into a single value.

export function computeDualDensity({ symbolicDensity, physicalDensity }) {
  return (symbolicDensity + physicalDensity) / 2;
}
