// cave-ui/panels/region-effects-panel.js

export function RegionEffectsPanel(stateBus, regionRegistry) {
  const el = document.createElement("div");
  el.className = "panel region-effects-panel";

  function render() {
    const region = stateBus.getState().currentRegion;

    if (!region) {
      el.innerHTML = `
        <h2>Region Effects</h2>
        <div>No region selected.</div>
      `;
      return;
    }

    const r = regionRegistry[region.id];

    el.innerHTML = `
      <h2>Region Effects</h2>

      <div class="effect-block">
        <strong>Corruption Storm:</strong> ${r.effects.corruptionStorm || "None"}
      </div>

      <div class="effect-block">
        <strong>Weather:</strong> ${r.effects.weather || "Calm"}
      </div>

      <div class="effect-block">
        <strong>Anomalies:</strong>
        ${
          r.effects.anomalies?.length
            ? r.effects.anomalies.map(a => `<div>- ${a}</div>`).join("")
            : "None"
        }
      </div>

      <div class="effect-block">
        <strong>Modifiers:</strong>
        ${
          r.effects.modifiers?.length
            ? r.effects.modifiers.map(m => `<div>- ${m}</div>`).join("")
            : "None"
        }
      </div>
    `;
  }

  stateBus.subscribe("regionChange", render);
  render();
  return el;
}
