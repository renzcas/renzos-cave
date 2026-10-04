// form-mode-panel.js
// Displays Form-Mode state: reality level, geometry stats, attractor, vectors

import { RealityLevel } from "./divided-line.js";

export class FormModePanel {
  constructor(id = "form-mode-panel") {
    this.el = document.getElementById(id);
  }

  render({ realityLevel, geometry }) {
    if (!this.el) return;

    const levelName = {
      [RealityLevel.EIKASIA]: "EIKASIA (Shadows)",
      [RealityLevel.PISTIS]:  "PISTIS (Belief)",
      [RealityLevel.DIANOIA]: "DIANOIA (Reason)",
      [RealityLevel.NOESIS]:  "NOESIS (Forms)"
    }[realityLevel] ?? "UNKNOWN";

    const attractor = geometry.attractor;
    const lines = geometry.lines.length;
    const planes = geometry.planes.length;

    this.el.innerText =
`FORM MODE
-------------------------
Reality Level: ${levelName}

Geometry:
  Lines: ${lines}
  Planes: ${planes}

Attractor:
  x: ${attractor.x.toFixed(2)}
  y: ${attractor.y.toFixed(2)}

Archetype Vectors:
${Object.entries(geometry.archetypeVectors)
  .map(([name, v]) => `  ${name}: (${v.x.toFixed(2)}, ${v.y.toFixed(2)})`)
  .join("\n")}`;
  }
}
