import { GridBus } from "../core/event_bus.js";

export function wireCaveAgents(CaveWorld, neuralInterface) {
  GridBus.on("AGENT_DECISION", (msg) => {
    const { id, action } = msg.payload;
    CaveWorld.applyBehavior(id, action);
  });

  GridBus.on("CREATURE_STATE_UPDATE", (msg) => {
    const signals = neuralInterface.processCreatureState(msg.payload);
    const decision = neuralInterface.generateBehavior(signals);

    GridBus.emit("AGENT_DECISION", {
      from: "llm:organism-core",
      realm: "llm",
      payload: decision,
      ts: Date.now()
    });
  });
}
