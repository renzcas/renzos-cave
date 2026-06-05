// runtime-loop.js
// Unified Cave Engine Runtime Loop (HUD + Panels + Engines)

import { stateBus } from "../../renzos-cave/cave/runtime/state-bus.js";

// Engines
import { computeMetabolicSchedule } from "./engine/metabolic-scheduler.js";
import { computeBoughEntropy } from "../../engine/bough-engine.js";
import { computeComplexity } from "./engine/complexity-tensor-organ.js";
import { computeFreeEnergy } from "./engine/free-energy-organ.js";
import { computeReflexState } from "./engine/organ-reflex-system.js";
import { computeSymbolicOps } from "./engine/symbolic-vm.js";
import { computeNeuralFlow } from "./engine/neural-spine.js";

// Tick rate
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;

let lastTime = performance.now();
let uiRef = null;

export function startRuntimeLoop(engine, ui) {
  uiRef = ui;

  function tick(now) {
    const delta = now - lastTime;
    if (delta >= FRAME_TIME) {
      lastTime = now;

      const signals = collectSignals(engine, delta);

      // Update cockpit HUD
      if (uiRef) uiRef.update(signals);

      // Update panel system
      stateBus.emit("tick", signals);
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ---------------- SIGNAL COLLECTION ----------------

function collectSignals(engine, delta) {
  // Base signals from engine (user-defined)
  const base = engine?.collectSignals?.() ?? {};

  // Metabolic scheduler
  const schedule = computeMetabolicSchedule(stateBus);

  // Bough entropy
  const entropy = computeBoughEntropy(stateBus);

  // Complexity tensor
  const complexity = computeComplexity(stateBus);

  // Free energy
  const freeEnergy = computeFreeEnergy(stateBus);

  // Reflex system
  const reflex = computeReflexState(stateBus);

  // Symbolic VM
  const symbolic = computeSymbolicOps(stateBus);

  // Neural flow
  const neural = computeNeuralFlow(stateBus);

  return {
    delta,

    // Base engine signals
    ...base,

    // Metabolic scheduler
    activeTasks: schedule.active,
    deferredTasks: schedule.deferred,
    stress: schedule.stress,
    efficiency: schedule.efficiency,

    // Entropy
    branchEntropy: entropy.branch,
    erasureEntropy: entropy.erasure,

    // Complexity
    timeSteps: complexity.time,
    spaceBytes: complexity.space,
    ioBytes: complexity.io,
    algoComplexity: complexity.algo,

    // Free energy
    energyCost: freeEnergy.cost,
    energyFlow: freeEnergy.flow,

    // Reflex
    reflexState: reflex.state,

    // Symbolic VM
    opcodeRate: symbolic.rate,
    opcodeComplexity: symbolic.complexity,

    // Neural
    neuralLoad: neural.load,
    neuralFlow: neural.flow
  };
}
