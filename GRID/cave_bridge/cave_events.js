import { GridBus } from "../core/event_bus.js";

export function wireCaveEvents(CaveWorld) {
  CaveWorld.onCreatureUpdate((creature) => {
    GridBus.emit("CREATURE_STATE_UPDATE", {
      from: `creature:${creature.id}`,
      realm: "cave",
      payload: creature.getState(),
      ts: Date.now()
    });
  });

  CaveWorld.onLabyrinthGenerated((lab) => {
    GridBus.emit("LABYRINTH_GENERATED", {
      from: "cave:worldgen",
      realm: "cave",
      payload: lab,
      ts: Date.now()
    });
  });
}
