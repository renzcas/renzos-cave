export class FormAttractor {
  apply(geometry, goodPull) {
    const factor = goodPull * 0.1;

    geometry.lines = geometry.lines.map(line => ({
      ...line,
      x2: line.x2 * (1 - factor),
      y2: line.y2 * (1 - factor)
    }));

    geometry.planes = geometry.planes.map(plane => ({
      ...plane,
      warp: plane.warp * (1 - factor)
    }));

    return geometry;
  }
}
