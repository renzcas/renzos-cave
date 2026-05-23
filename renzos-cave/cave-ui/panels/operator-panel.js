// cave-ui/panels/operator-panel.js

export function OperatorPanel(stateBus, operator) {
  const el = document.createElement("div");
  el.className = "panel operator-panel";

  function render() {
    const state = stateBus.getState();
    const arena = state.arena || {};
    const region = state.currentRegion || {};

    el.innerHTML = `
      <h2>Operator</h2>

      <div><strong>Name:</strong> ${operator.name}</div>
      <div><strong>Level:</strong> ${operator.level}</div>
      <div><strong>XP:</strong> ${operator.xp}</div>

      <h3>Loadout</h3>
      <div><strong>Primary Organ:</strong> ${operator.loadout.primary}</div>
      <div><strong>Secondary Organ:</strong> ${operator.loadout.secondary}</div>

      <h3>Status</h3>
      <div><strong>Region:</strong> ${region.name || "—"}</div>
      <div><strong>Recursion:</strong> ${arena.recursionLevel ?? 0}</div>
      <div><strong>Glitch State:</strong> ${arena.glitchState ?? "stable"}</div>

      <h3>Effects</h3>
      <div>${operator.effects.length > 0 
        ? operator.effects.map(e => `<div>${e}</div>`).join("")
        : "None"
      }</div>
    `;
  }

  stateBus.subscribe("*", render);

  render();
  return el;
}
