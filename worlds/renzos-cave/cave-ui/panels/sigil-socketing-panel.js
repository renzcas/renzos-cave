// cave-ui/panels/sigil-socketing-panel.js

import { createActionButton } from "../actions/ui-actions.js";

export function SigilSocketingPanel(stateBus, organs, inventory) {
  const el = document.createElement("div");
  el.className = "panel sigil-socketing-panel";

  function render() {
    const state = stateBus.getState();
    const selectedItem = state.selectedItem;
    const item = inventory.find(i => i.id === selectedItem);

    el.innerHTML = `
      <h2>Sigil Socketing</h2>
      ${item ? `
        <div><strong>Selected:</strong> ${item.name}</div>
        <div>${item.description}</div>
      ` : `<div>No sigil selected.</div>`}

      <h3>Organs</h3>
      <div class="socket-grid">
        ${organs.map(o => `
          <div class="socket-block">
            <strong>${o.name}</strong>
            <div>Socket: ${o.socket || "Empty"}</div>
            <div class="socket-btn" data-organ="${o.id}"></div>
          </div>
        `).join("")}
      </div>
    `;

    // Attach socket buttons
    organs.forEach(o => {
      const container = el.querySelector(`[data-organ="${o.id}"]`);

      if (!container) return;

      if (item && item.type === "sigil") {
        container.appendChild(
          createActionButton(
            "Socket",
            "socketOps",
            { type: "SOCKET", organ: o.id, item: item.id },
            stateBus
          )
        );
      }

      if (o.socket) {
        container.appendChild(
          createActionButton(
            "Unsocket",
            "socketOps",
            { type: "UNSOCKET", organ: o.id },
            stateBus
          )
        );
      }
    });
  }

  stateBus.subscribe("socketUpdate", render);
  stateBus.subscribe("inventoryUpdate", render);
  render();
  return el;
}
