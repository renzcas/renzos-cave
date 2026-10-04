// cave-ui/panels/organ-upgrade-panel.js

import { createActionButton } from "../actions/ui-actions.js";

export function OrganUpgradePanel(stateBus, organs) {
  const el = document.createElement("div");
  el.className = "panel organ-upgrade-panel";

  function render() {
    el.innerHTML = `
      <h2>Organ Upgrades</h2>
      ${organs.map(o => `
        <div class="organ-upgrade-block">
          <strong>${o.name}</strong>
          <div>Level: ${o.level}</div>
          <div>Output: ${o.stats.output}</div>
          <div>Stability: ${o.stats.stability}</div>
          <div>Corruption Resist: ${o.stats.corruptionResistance}</div>
          <div class="organ-buttons" data-organ="${o.id}"></div>
        </div>
      `).join("")}
    `;

    // Attach buttons after rendering
    organs.forEach(o => {
      const container = el.querySelector(`[data-organ="${o.id}"]`);

      container.appendChild(
        createActionButton("Upgrade", "organOps", { type: "UPGRADE", id: o.id }, stateBus)
      );

      container.appendChild(
        createActionButton("Cleanse", "organOps", { type: "CLEANSE", id: o.id }, stateBus)
      );

      container.appendChild(
        createActionButton("Mutate", "organOps", { type: "MUTATE", id: o.id }, stateBus)
      );
    });
  }

  stateBus.subscribe("organUpdate", render);
  render();
  return el;
}
