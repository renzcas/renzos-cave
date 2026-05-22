// runtime-loop.js
// Main tick loop.

import { observeState } from "../observer/observer-core.js";


export function createRuntimeLoop({
  stateBus,
  scheduler,
  symbolicVM,
  resonanceEngine,
  observerCore,
  emergenceEngine,
  config
}) {
  let timer = null;
  const interval = config.tickIntervalMs ?? 100;

function tick() {
  console.log("[tick]", Date.now());

  scheduler.step();
  emergenceEngine.step();
  symbolicVM.step();
  resonanceEngine.step();

  // Optional: show resonance field count
  const fields = resonanceEngine.getFields();
  console.log("[resonance fields]", fields.size);

  // Optional: show new chambers
  const chambers = stateBus.getLog("newChambers");
  if (chambers.length && chambers.length % 5 === 0) {
    console.log("[emergent chamber]", chambers[chambers.length - 1]);
  }
  
}


  function start() {
    if (timer) return;
    timer = setInterval(tick, interval);
    stateBus.append("runtime", { type: "START", at: Date.now() });
  }

  function stop() {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
    stateBus.append("runtime", { type: "STOP", at: Date.now() });
  }

  return { start, stop };
}
