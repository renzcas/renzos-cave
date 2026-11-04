import { GRID_EVENTS, GridBus } from "../core/event_bus.js";

export function initGridHUD(AgentDash) {
  GridBus.subscribe(GRID_EVENTS.CREATURE_STATE_UPDATE, (msg) => {
    AgentDash.pushTelemetry("cave", msg.payload);
  });

  GridBus.subscribe(GRID_EVENTS.CYBER_ATTACK_DETECTED, (msg) => {
    AgentDash.pushTelemetry("cyber", msg.payload);
  });

  GridBus.subscribe(GRID_EVENTS.ATTENTION_SHIFT, (msg) => {
    AgentDash.pushTelemetry("llm", msg.payload);
  });
}
