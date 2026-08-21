import { GridBus } from "../core/event_bus.js";

export function initGridHUD(AgentDash) {
  GridBus.on("CREATURE_STATE_UPDATE", (msg) => {
    AgentDash.pushTelemetry("cave", msg.payload);
  });

  GridBus.on("CYBER_ATTACK_DETECTED", (msg) => {
    AgentDash.pushTelemetry("cyber", msg.payload);
  });

  GridBus.on("ATTENTION_SHIFT", (msg) => {
    AgentDash.pushTelemetry("llm", msg.payload);
  });
}
