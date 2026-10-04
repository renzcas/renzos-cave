export function combatEngine(stateBus) {
  const ops = stateBus.getQueue("combatOps");
  const state = stateBus.getState();
  state.combat ||= {};

  for (const op of ops) {
    if (op.type === "STRIKE") {
      state.combat.log.push("Operator strikes the enemy!");
      state.combat.enemy.hp -= 10;
    }

    if (op.type === "CLEANSE") {
      state.combat.log.push("Operator cleanses corruption!");
      state.combat.enemy.corruption -= 5;
    }

    if (op.type === "PULSE") {
      state.combat.log.push("Operator emits a pulse!");
      state.combat.enemy.hp -= 5;
      state.combat.enemy.corruption -= 5;
    }

    if (op.type === "DEFEND") {
      state.combat.log.push("Operator braces for impact.");
      state.combat.operator.stability += 5;
    }
  }

  stateBus.flushQueue("combatOps");
  stateBus.append("combatUpdate", {});
}
