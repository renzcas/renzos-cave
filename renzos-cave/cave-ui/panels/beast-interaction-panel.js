// cave-ui/panels/beast-interaction-panel.js

import { createActionButton } from "../actions/ui-actions.js";

export function BeastInteractionPanel(stateBus, beastRegistry) {
  const el = document.createElement("div");
  el.className = "panel beast-interaction-panel";

  function render() {
    const selected = stateBus.getState().selectedBeast;
    if (!selected) {
      el.innerHTML = "<h2>Beast</h2><div>No beast selected.</div>";
      return;
    }

    const b = beastRegistry[selected];

    el.innerHTML = `
      <h2>${b.name}</h2>
      <div>Tier: ${b.tier}</div>
      <div>Corruption: ${b.corruption}%</div>
      <div>Organ Link: ${b.organLink}</div>
      <div>Biome: ${b.biomeAffinity.join(", ")}</div>
    `;

    el.appendChild(createActionButton("Inspect", "beastOps", { type: "INSPECT", id: selected }, stateBus));
    el.appendChild(createActionButton("Fight", "beastOps", { type: "FIGHT", id: selected }, stateBus));
    el.appendChild(createActionButton("Cleanse", "beastOps", { type: "CLEANSE", id: selected }, stateBus));
  }

  stateBus.subscribe("selectedBeast", render);
  render();
  return el;
}
