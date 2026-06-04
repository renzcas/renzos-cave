export function socketEngine(stateBus, organs, inventory) {
  const ops = stateBus.getQueue("socketOps");
  const state = stateBus.getState();

  for (const op of ops) {
    if (op.type === "SOCKET") {
      const organ = organs.find(o => o.id === op.organ);
      const item = inventory.find(i => i.id === op.item);
      if (organ && item) {
        organ.socket = item.name;
      }
    }

    if (op.type === "UNSOCKET") {
      const organ = organs.find(o => o.id === op.organ);
      if (organ) {
        organ.socket = null;
      }
    }
  }

  stateBus.flushQueue("socketOps");
  stateBus.append("socketUpdate", {});
}
