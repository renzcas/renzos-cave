export function bugbotEngine(stateBus, bugbots) {
  const ops = stateBus.getQueue("bugbotOps");
  const state = stateBus.getState();
  state.bugbotLogs ||= [];

  for (const op of ops) {
    if (op.type === "SCAN") {
      state.bugbotLogs.push("Bug‑Bots scanned the region.");
    }
    if (op.type === "PATCH") {
      state.bugbotLogs.push("Bug‑Bots patched corruption pockets.");
    }
    if (op.type === "DEBUG") {
      state.bugbotLogs.push("Bug‑Bots debugged anomalies.");
    }
    if (op.type === "REPLICATE") {
      state.bugbotLogs.push("A Bug‑Bot replicated.");
    }
  }

  stateBus.flushQueue("bugbotOps");
  stateBus.append("bugbotUpdate", {});
}
