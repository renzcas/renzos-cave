export function boughEngine(stateBus, bough) {
  const ops = stateBus.getQueue("boughOps");

  const state = stateBus.getState();
  state.unlockedBoughNodes ||= [];

  for (const op of ops) {
    if (op.type === "UNLOCK") {
      state.unlockedBoughNodes.push(op.id);
    }

    if (op.type === "ACTIVATE") {
      // apply node effect here
      state.activeBoughNode = op.id;
    }
  }

  stateBus.flushQueue("boughOps");
}
