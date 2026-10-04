// form-renderer.js
// Renders Form-Mode geometry using the FormCamera transform

export class FormRenderer {
  constructor(canvasId = "geometry-view") {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");

    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }

  render(geometry, camera) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();

    // Apply camera transform
    ctx.translate(this.centerX + camera.x, this.centerY + camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // Draw lines (archetype vectors)
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 2;

    geometry.lines.forEach(line => {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(line.x2 * 150, -line.y2 * 150);
      ctx.stroke();
    });

    // Draw planes (warp fields)
    geometry.planes.forEach(plane => {
      ctx.strokeStyle = "rgba(0,255,255,0.2)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.arc(0, 0, 200 + plane.warp * 300, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw attractor
    ctx.fillStyle = "#0ff";
    ctx.beginPath();
    ctx.arc(
      geometry.attractor.x * 150,
      -geometry.attractor.y * 150,
      6,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }
}
