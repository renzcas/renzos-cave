export function waveEngine(stateBus, arenaWaves, beastRegistry) {
  const ops = stateBus.getQueue("arenaOps");
  const state = stateBus.getState();
  state.arena ||= {};

  for (const op of ops) {
    if (op.type === "ENTER") {
      startArena();
    }

    if (op.type === "NEXT_WAVE") {
      nextWave();
    }

    if (op.type === "EXIT") {
      exitArena();
    }
  }

  stateBus.flushQueue("arenaOps");

  function startArena() {
    state.arena.active = true;
    state.arena.currentWave = 0;
    state.arena.log = ["Arena initiated."];
    nextWave();
  }

  function nextWave() {
    state.arena.currentWave++;

    const wave = arenaWaves.find(w => w.wave === state.arena.currentWave);
    if (!wave) {
      state.arena.log.push("Arena complete!");
      state.arena.active = false;
      return;
    }

    // Spawn enemy
    const enemyId = wave.enemies[0];
    state.arena.enemy = JSON.parse(JSON.stringify(beastRegistry[enemyId]));

    // Apply modifiers
    state.arena.modifiers = wave.modifiers;

    state.arena.log.push(`Wave ${wave.wave} begins.`);
    if (wave.boss) {
      state.arena.log.push("Boss wave detected.");
    }

    stateBus.append("combatUpdate", {});
  }

  function exitArena() {
    state.arena.active = false;
    state.arena.currentWave = 0;
    state.arena.enemy = null;
    state.arena.log.push("Arena exited.");
  }
}
