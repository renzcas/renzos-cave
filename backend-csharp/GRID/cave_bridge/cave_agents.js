import { GRID_EVENTS, GridBus } from "../core/event_bus.js";

export function wireCaveAgents(CaveWorld, neuralInterface) {
  GridBus.subscribe(GRID_EVENTS.AGENT_DECISION, (msg) => {
    const { id, action } = msg.payload;
    CaveWorld.applyBehavior(id, action);
  });

  GridBus.subscribe(GRID_EVENTS.CREATURE_STATE_UPDATE, (msg) => {
    const signals = neuralInterface.processCreatureState(msg.payload);
    const decision = neuralInterface.generateBehavior(signals);

    GridBus.publish(
      GRID_EVENTS.AGENT_DECISION,
      decision,
      "llm:organism-core",
      { realm: "llm" }
    );
  });
}
