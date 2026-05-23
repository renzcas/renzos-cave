// cave-ui/panels/organ-fusion-panel.js

import { createActionButton } from "../actions/ui-actions.js";

export function OrganFusionPanel(stateBus, organs, fusionRecipes) {
  const el = document.createElement("div");
  el.className = "panel organ-fusion-panel";

  let selectedA = null;
  let selectedB = null;

  function render() {
    const state = stateBus.getState();
    const fusionResult = state.fusionPreview || null;

    el.innerHTML = `
      <h2>Organ Fusion</h2>

      <h3>Select Organs</h3>
      <div class="fusion-grid">
        ${organs.map(o => `
          <div class="fusion-organ ${selectedA === o.id || selectedB === o.id ? "selected" : ""}"
               data-organ="${o.id}">
            <strong>${o.name}</strong>
            <div>Level: ${o.level}</div>
            <div>Output: ${o.stats.output}</div>
          </div>
        `).join("")}
      </div>

      <h3>Fusion Result</h3>
      <div class="fusion-result">
        ${fusionResult
          ? `
            <strong>${fusionResult.name}</strong>
            <div>${fusionResult.description}</div>
            <div>Mutation Chance: ${fusionResult.mutationChance}%</div>
          `
          : "Select two organs to preview fusion."
        }
      </div>

      <div class="fusion-actions"></div>
    `;

    // Attach fusion button
    const actions = el.querySelector(".fusion-actions");
    if (fusionResult) {
      actions.appendChild(
        createActionButton(
          "Fuse",
          "fusionOps",
          { type: "FUSE", organA: selectedA, organB: selectedB },
          stateBus
        )
      );
    }
  }

  // Handle organ selection
  el.addEventListener("click", e => {
    const id = e.target.closest("[data-organ]")?.dataset.organ;
    if (!id) return;

    if (!selectedA) selectedA = id;
    else if (!selectedB && id !== selectedA) selectedB = id;
    else {
      selectedA = id;
      selectedB = null;
    }

    // Preview fusion
    if (selectedA && selectedB) {
      stateBus.append("fusionPreview", { organA: selectedA, organB: selectedB });
    }

    render();
  });

  stateBus.subscribe("fusionUpdate", render);
  stateBus.subscribe("fusionPreview", render);
  render();
  return el;
}
