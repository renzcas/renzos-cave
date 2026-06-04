export function skillEngine(stateBus, skillTree) {
  const ops = stateBus.getQueue("skillOps");
  const state = stateBus.getState();
  state.unlockedSkills ||= [];

  for (const op of ops) {
    if (op.type === "UNLOCK") {
      state.unlockedSkills.push(op.id);
      stateBus.append("skillUpdate", {});
    }
  }

  stateBus.flushQueue("skillOps");
}
