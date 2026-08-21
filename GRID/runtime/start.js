// THE GRID RUNTIME — Full Implementation

import { GridBus } from "../core/event_bus.js";
import { AgentRegistry } from "../core/agent_registry.js";
import { NeuralInterface } from "../core/neural_interface.js";

// Cave# bridge
import { wireCaveEvents } from "../cave_bridge/cave_events.js";
import { wireCaveAgents } from "../cave_bridge/cave_agents.js";

// Cockpit HUD
import { initGridHUD } from "../cockpit/grid_hud.js";

// Engines (adjust paths to your repo structure)
import * as Cave from "../../renzos-cave/index.js";
import * as RBApp from "../../RB-App/index.js";
import * as CyberArena from "../../cyber-arena/index.js";
import * as LLMOrganism from "../../LLM_Organism/index.js";
import * as ComplexConscious from "../../ComplexConscious/index.js";
import * as AgentDash from "../../agentdash/index.js";

export async function startGRID() {
  console.log("=======================================");
  console.log("        ⚡ BOOTING THE GRID ⚡");
  console.log("=======================================");

  // 1. INIT CORE
  console.log("[00] INIT CORE SYSTEMS");
  const neural = new NeuralInterface(LLMOrganism);

  // 2. LINK CAVE#
  console.log("[01] LINKING CAVE# REALM");
  Cave.init(GridBus, AgentRegistry);
  wireCaveEvents(Cave);
  wireCaveAgents(Cave, neural);

  // 3. LINK CYBER ENGINES
  console.log("[02] ARMING CYBER LIMBS");
  RBApp.init(GridBus, AgentRegistry);
  CyberArena.init(GridBus, AgentRegistry);

  // 4. LINK INTELLIGENCE LAYER
  console.log("[03] AWAKENING INTELLIGENCE");
  LLMOrganism.init(GridBus, AgentRegistry);
  ComplexConscious.init(GridBus, AgentRegistry);

  // 5. LINK COCKPIT
  console.log("[04] RAISING AGENTDASH COCKPIT");
  AgentDash.init(GridBus, AgentRegistry);
  initGridHUD();

  // 6. REGISTER AGENTS
  console.log("[05] REGISTERING AGENTS");
  AgentRegistry.register("llm:core", LLMOrganism);
  AgentRegistry.register("cave:world", Cave);
  AgentRegistry.register("cyber:rbapp", RBApp);
  AgentRegistry.register("cyber:arena", CyberArena);

  // 7. FINALIZE
  console.log("[06] FINALIZING GRID LINKS");
  console.log("⚡ GRID ONLINE — All realms connected.");
  console.log("=======================================");
}
