// cave/runtime/runtime-loop.js

import { scheduler } from "./scheduler.js";
import { stateBus } from "./state-bus.js";

import { createEmergenceEngine } from "../emergence/emergence-engine.js";
import { createSymbolicVM } from "../symbolic/symbolic-vm.js";
import { createResonanceEngine } from "../physics/resonance-engine.js";

import { computePhysics } from "../physics/infophyz-bridge.js";
import { observeState } from "../observer/observer-core.js";

let intervalId = null;

const emergenceEngine = createEmergenceEngine(stateBus);
const symbolicVM = createSymbolicVM(stateBus);
const resonanceEngine = createResonanceEngine(stateBus);

export function startRuntime() {
  stateBus.append("runtime", { type: "START", at: Date.now() });

  if (intervalId) return;

  intervalId = setInterval(tick, 100);
}

export function stopRuntime() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  stateBus.append("runtime", { type: "STOP", at: Date.now() });
}

function tick() {
  console.log("[tick]", Date.now());

  // 1. Scheduler step
  scheduler.step();
  stateBus.append("schedulerTrace", { tickAt: Date.now() });

  // 2. Physics (InfoPhyzx bridge)
  const physics = computePhysics(stateBus.getState());
  stateBus.append("physicsTrace", physics);

  // 3. Core engines
  emergenceEngine.step();
  symbolicVM.step();
  resonanceEngine.step();

  // 4. Observer Organ
  const observation = observeState({
    physics,
    symbolic: symbolicVM.getState(),
    resonance: resonanceEngine.getState(),
    scheduler: scheduler.getState()
  });

  stateBus.append("observerTrace", observation);

  // Optional: quick resonance summary
  const fields = resonanceEngine.getFields();
  console.log("[resonance fields]", fields.size || 0);
}
