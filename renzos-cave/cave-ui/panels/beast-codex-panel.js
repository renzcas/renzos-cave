// cave-ui/panels/beast-codex-panel.js

export function BeastCodexPanel(stateBus, beastRegistry) {
  const el = document.createElement("div");
  el.className = "panel beast-codex-panel";

  let search = "";

  function render() {
    const state = stateBus.getState();
    const unlocked = state.unlockedBeasts || [];

    const filtered = Object.values(beastRegistry).filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );

    el.innerHTML = `
      <h2>Beast Codex</h2>

      <input class="codex-search" placeholder="Search beasts..." value="${search}" />

      <div class="codex-grid">
        ${filtered.map(b => `
          <div class="codex-entry ${unlocked.includes(b.id) ? "unlocked" : "locked"}"
               data-beast="${b.id}">
            <strong>${b.name}</strong>
            <div>Tier: ${b.tier}</div>
            <div>Biome: ${b.biomeAffinity.join(", ")}</div>
            <div>Status: ${unlocked.includes(b.id) ? "Known" : "Unknown"}</div>
          </div>
        `).join("")}
      </div>

      <div class="codex-details"></div>
    `;

    // Attach search handler
    el.querySelector(".codex-search").oninput = e => {
      search = e.target.value;
      render();
    };

    // Attach beast selection
    el.querySelectorAll("[data-beast]").forEach(entry => {
      entry.onclick = () => {
        const id = entry.dataset.beast;
        stateBus.set("codexSelectedBeast", id);
        stateBus.append("codexUpdate", {});
      };
    });

    // Render details
    renderDetails();
  }

  function renderDetails() {
    const state = stateBus.getState();
    const id = state.codexSelectedBeast;
    const details = el.querySelector(".codex-details");

    if (!id) {
      details.innerHTML = "<div>Select a beast to view details.</div>";
      return;
    }

    const b = beastRegistry[id];
    const unlocked = state.unlockedBeasts || [];

    if (!unlocked.includes(id)) {
      details.innerHTML = `
        <div class="codex-locked-details">
          <strong>${b.name}</strong>
          <div>This beast is not yet fully known.</div>
        </div>
      `;
      return;
    }

    details.innerHTML = `
      <h3>${b.name}</h3>
      <div><strong>Tier:</strong> ${b.tier}</div>
      <div><strong>Biome Affinity:</strong> ${b.biomeAffinity.join(", ")}</div>
      <div><strong>Organ Link:</strong> ${b.organLink}</div>
      <div><strong>Stats:</strong></div>
      <div>HP: ${b.stats.hp}</div>
      <div>Corruption Resist: ${b.stats.corruptionResist}</div>
      <div>Aggression: ${b.stats.aggression}</div>

      <h4>Behavior</h4>
      <div>${b.behavior}</div>

      <h4>Corruption Pattern</h4>
      <div>${b.corruptionPattern}</div>

      <h4>Mutations</h4>
      <div>${b.mutations.join(", ")}</div>

      <h4>Lore</h4>
      <div>${b.lore}</div>
    `;
  }

  stateBus.subscribe("codexUpdate", render);
  render();
  return el;
}
