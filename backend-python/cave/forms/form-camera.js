// form-camera.js
// Handles camera behavior in Form Mode (Noesis layer)

export class FormCamera {
  constructor() {
    this.zoom = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.smooth = 0.15;
  }

  update({ geometry, realityLevel }) {
    // Zoom based on reality level
    const targetZoom = {
      0: 0.8,  // Eikasia
      1: 1.0,  // Pistis
      2: 1.2,  // Dianoia
      3: 1.5   // Noesis
    }[realityLevel] ?? 1.0;

    this.zoom += (targetZoom - this.zoom) * this.smooth;

    // Camera centers on the attractor
    const ax = geometry.attractor.x * 100;
    const ay = geometry.attractor.y * 100;

    this.offsetX += (ax - this.offsetX) * this.smooth;
    this.offsetY += (ay - this.offsetY) * this.smooth;
  }

  getTransform() {
    return {
      zoom: this.zoom,
      x: this.offsetX,
      y: this.offsetY
    };
  }
}
