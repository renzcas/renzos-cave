// cave/runtime/runtime-loop.js

import { stateBus } from "./state-bus.js";

// === ENGINES ===
import { beastEngine } from "../engines/beast-engine.js";
import { trialEngine } from "../engines/trial-engine.js";
import { bugbotEngine } from "../engines/bugbot-engine.js";
import { arenaEngine } from "../engines/arena-engine.js";
import { waveEngine } from "../engines/wave-engine.js";
import { fusionEngine } from "../engines/fusion-engine.js";
import { socketEngine } from "../engines/socket-engine.js";
import { skillEngine } from "../engines/skill-engine.js";
import { regionEventEngine } from "../engines/region-event-engine.js";
import { boughEffects } from "../engines/bough-effects.js";

// === DATA ===
import { beastRegistry } from "../data/beasts.js";
import { trialRegistry } from "../data/trials.js";
import { bugbots } from "../data/bugbots.js";
import { arenaWaves } from "../data/arena-waves.js";
import { fusionRecipes } from "../data/fusion-recipes.js";
import { goldenBough } from "../data/golden-bough.js";
import { regions } from "../data/regions.js";
import { organs } from "../data/organs.js";

let lastTick = performance.now();
const TICK_RATE = 100; // 10 ticks per second

function tick() {
  const now = performance.now();
  const delta = now - lastTick;

  if (delta >= TICK_RATE) {
    lastTick = now;

    // === RUN ALL ENGINES ===
    beastEngine(stateBus, beastRegistry);
    trialEngine(stateBus, trialRegistry);
    bugbotEngine(stateBus, bugbots);
    arenaEngine(stateBus);
    waveEngine(stateBus, arenaWaves, beastRegistry);
    fusionEngine(stateBus, organs, fusionRecipes);
    socketEngine(stateBus);
    skillEngine(stateBus);
    regionEventEngine(stateBus, regions);
    boughEffects(stateBus, goldenBough);

    // === NOTIFY UI ===
    stateBus.append("runtimeUpdate", {});
  }

  requestAnimationFrame(tick);
}

export function startRuntimeLoop() {
  requestAnimationFrame(tick);
}
