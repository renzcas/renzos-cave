export function TrialCodexPanel(stateBus, trialRegistry) {
  const el = document.createElement("div");
  el.className = "panel trial-codex-panel";

  let search = "";

  function render() {
    const filtered = Object.values(trialRegistry).filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );

    el.innerHTML = `
      <h2>Trial Codex</h2>

      <input class="codex-search" placeholder="Search trials..." value="${search}" />

      <div class="codex-grid">
        ${filtered.map(t => `
          <div class="codex-entry" data-trial="${t.id}">
            <strong>${t.name}</strong>
            <div>Tier: ${t.tier}</div>
            <div>Corruption Pressure: ${t.corruptionPressure}</div>
          </div>
        `).join("")}
      </div>

      <div class="codex-details"></div>
    `;

    el.querySelector(".codex-search").oninput = e => {
      search = e.target.value;
      render();
    };

    el.querySelectorAll("[data-trial]").forEach(entry => {
      entry.onclick = () => {
        stateBus.set("codexSelectedTrial", entry.dataset.trial);
        stateBus.append("codexUpdate", {});
      };
    });

    renderDetails();
  }

  function renderDetails() {
    const id = stateBus.getState().codexSelectedTrial;
    const details = el.querySelector(".codex-details");

    if (!id) {
      details.innerHTML = "<div>Select a trial to view details.</div>";
      return;
    }

    const t = trialRegistry[id];

    details.innerHTML = `
      <h3>${t.name}</h3>
      <div><strong>Tier:</strong> ${t.tier}</div>
      <div><strong>Recursion Depth:</strong> ${t.recursionDepth}</div>
      <div><strong>Corruption Pressure:</strong> ${t.corruptionPressure}</div>

      <h4>Requirements</h4>
      <div>${t.organRequirements.join(", ")}</div>

      <h4>Sigils Required</h4>
      <div>${t.sigilsRequired.join(", ")}</div>

      <h4>Rewards</h4>
      <div>${t.rewards.join(", ")}</div>

      <h4>Description</h4>
      <div>${t.description}</div>
    `;
  }

  stateBus.subscribe("codexUpdate", render);
  render();
  return el;
}
