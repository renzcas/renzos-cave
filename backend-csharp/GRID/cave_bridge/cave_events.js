import { GRID_EVENTS, GridBus } from "../core/event_bus.js";

export function wireCaveEvents(CaveWorld) {
  CaveWorld.onCreatureUpdate((creature) => {
    GridBus.publish(
      GRID_EVENTS.CREATURE_STATE_UPDATE,
      creature.getState(),
      `creature:${creature.id}`,
      { realm: "cave" }
    );
  });

  CaveWorld.onLabyrinthGenerated((lab) => {
    GridBus.publish(
      GRID_EVENTS.LABYRINTH_GENERATED,
      lab,
      "cave:worldgen",
      { realm: "cave" }
    );
  });
}
