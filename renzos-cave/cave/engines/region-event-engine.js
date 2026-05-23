export function regionEventEngine(stateBus, regionRegistry) {
  const state = stateBus.getState();
  state.regionEvents ||= [];

  const current = state.currentRegion;
  if (!current) return;

  const region = regionRegistry[current.id];

  // Example triggers
  if (region.corruption > 70 && Math.random() < 0.05) {
    pushEvent("Corruption spike detected.");
  }

  if (region.effects.anomalies?.length && Math.random() < 0.03) {
    pushEvent("Anomaly surge ripples through the region.");
  }

  if (region.beasts?.length && Math.random() < 0.02) {
    pushEvent("Beast migration detected.");
  }

  if (Math.random() < 0.01) {
    pushEvent("Weather shift: atmospheric pressure changes.");
  }

  function pushEvent(text) {
    const time = new Date().toLocaleTimeString();
    state.regionEvents.push({ time, text });
    stateBus.append("regionEvent", { text });
  }
}
