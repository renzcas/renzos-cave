// cave-ui/panels/operator-skill-tree-panel.js

import { createActionButton } from "../actions/ui-actions.js";

export function OperatorSkillTreePanel(stateBus, skillTree) {
  const el = document.createElement("div");
  el.className = "panel operator-skill-tree-panel";

  function render() {
    const state = stateBus.getState();
    const unlocked = state.unlockedSkills || [];

    el.innerHTML = `
      <h2>Operator Skill Tree</h2>
      <div class="skill-tree">
        ${skillTree.branches.map(branch => `
          <div class="skill-branch">
            <h3>${branch.name}</h3>
            ${branch.skills.map(skill => `
              <div class="skill-node ${unlocked.includes(skill.id) ? "unlocked" : "locked"}">
                <strong>${skill.name}</strong>
                <div>${skill.description}</div>
                <div>Requires: ${skill.requires?.join(", ") || "None"}</div>
                <div class="skill-node-btn" data-skill="${skill.id}"></div>
              </div>
            `).join("")}
          </div>
        `).join("")}
      </div>
    `;

    // Attach unlock buttons
    skillTree.branches.forEach(branch => {
      branch.skills.forEach(skill => {
        const container = el.querySelector(`[data-skill="${skill.id}"]`);
        if (!container) return;

        const isUnlocked = unlocked.includes(skill.id);

        if (!isUnlocked) {
          container.appendChild(
            createActionButton(
              "Unlock",
              "skillOps",
              { type: "UNLOCK", id: skill.id },
              stateBus
            )
          );
        }
      });
    });
  }

  stateBus.subscribe("skillUpdate", render);
  render();
  return el;
}
