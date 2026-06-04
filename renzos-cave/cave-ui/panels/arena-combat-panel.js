// cave-ui/panels/arena-combat-panel.js

import { createActionButton } from "../actions/ui-actions.js";

export function ArenaCombatPanel(stateBus) {
  const el = document.createElement("div");
  el.className = "panel arena-combat-panel";

  function render() {
    const state = stateBus.getState();
    const combat = state.combat || {};
    const enemy = combat.enemy || {};
    const operator = combat.operator || {};
    const log = combat.log || [];

    el.innerHTML = `
      <h2>Arena Combat</h2>

      <div class="combat-section">
        <strong>Enemy:</strong> ${enemy.name || "None"}
        <div>HP: ${enemy.hp ?? "—"}</div>
        <div>Corruption: ${enemy.corruption ?? "—"}%</div>
      </div>

      <div class="combat-section">
        <strong>Operator:</strong>
        <div>HP: ${operator.hp ?? "—"}</div>
        <div>Stability: ${operator.stability ?? "—"}</div>
      </div>

      <div class="combat-section">
        <strong>Phase:</strong> ${combat.phase || "Idle"}
      </div>

      <div class="combat-actions"></div>

      <h3>Combat Log</h3>
      <div class="combat-log">
        ${log.map(line => `<div>${line}</div>`).join("")}
      </div>
    `;

    // Attach combat action buttons
    const actions = el.querySelector(".combat-actions");

    actions.appendChild(
      createActionButton("Strike", "combatOps", { type: "STRIKE" }, stateBus)
    );

    actions.appendChild(
      createActionButton("Cleanse", "combatOps", { type: "CLEANSE" }, stateBus)
    );

    actions.appendChild(
      createActionButton("Pulse", "combatOps", { type: "PULSE" }, stateBus)
    );

    actions.appendChild(
      createActionButton("Defend", "combatOps", { type: "DEFEND" }, stateBus)
    );
  }

  stateBus.subscribe("combatUpdate", render);
  render();
  return el;
}
