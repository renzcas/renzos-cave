import { createActionButton } from "../actions/ui-actions.js";

export function BugBotControlPanel(stateBus, bugbots) {
  const el = document.createElement("div");
  el.className = "panel bugbot-control-panel";

  function render() {
    const state = stateBus.getState();
    const logs = state.bugbotLogs || [];

    el.innerHTML = `
      <h2>Bug‑Bot Control Room</h2>

      <div class="bugbot-grid">
        ${bugbots.map(b => `
          <div class="bugbot-entry" data-bugbot="${b.id}">
            <strong>${b.name}</strong>
            <div>Function: ${b.function}</div>
            <div>Status: ${b.status}</div>
          </div>
        `).join("")}
      </div>

      <div class="bugbot-actions"></div>

      <h3>Logs</h3>
      <div class="bugbot-log">
        ${logs.slice(-20).map(l => `<div>${l}</div>`).join("")}
      </div>
    `;

    const actions = el.querySelector(".bugbot-actions");

    actions.appendChild(
      createActionButton("Scan Region", "bugbotOps", { type: "SCAN" }, stateBus)
    );
    actions.appendChild(
      createActionButton("Patch Corruption", "bugbotOps", { type: "PATCH" }, stateBus)
    );
    actions.appendChild(
      createActionButton("Debug Anomalies", "bugbotOps", { type: "DEBUG" }, stateBus)
    );
    actions.appendChild(
      createActionButton("Replicate Bot", "bugbotOps", { type: "REPLICATE" }, stateBus)
    );
  }

  stateBus.subscribe("bugbotUpdate", render);
  render();
  return el;
}
