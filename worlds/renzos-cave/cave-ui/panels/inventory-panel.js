// cave-ui/panels/inventory-panel.js

export function InventoryPanel(stateBus, inventory) {
  const el = document.createElement("div");
  el.className = "panel inventory-panel";

  function render() {
    const state = stateBus.getState();
    const items = state.inventory || inventory;

    el.innerHTML = `
      <h2>Inventory</h2>
      <div class="inventory-grid">
        ${items.map(item => `
          <div class="inventory-item" data-item="${item.id}">
            <strong>${item.name}</strong>
            <div>${item.type}</div>
            <div>${item.description}</div>
          </div>
        `).join("")}
      </div>
    `;
  }

  el.addEventListener("click", e => {
    const id = e.target.closest("[data-item]")?.dataset.item;
    if (id) {
      stateBus.set("selectedItem", id);
      stateBus.append("inventoryUpdate", {});
    }
  });

  stateBus.subscribe("inventoryUpdate", render);
  render();
  return el;
}
