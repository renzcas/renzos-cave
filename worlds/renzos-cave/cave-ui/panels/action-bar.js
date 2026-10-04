// cave-ui/panels/action-bar.js

import { createActionButton } from "../actions/ui-actions.js";

export function ActionBar(stateBus) {
  const el = document.createElement("div");
  el.className = "panel action-bar";

  const actions = [
    { label: "Cleanse", op: "resonanceOps", payload: { type: "CLEANSE" } },
    { label: "Stabilize", op: "arenaOps", payload: { type: "STABILIZE" } },
    { label: "Recurse", op: "arenaOps", payload: { type: "RECURSE" } },
    { label: "Pulse", op: "observerOps", payload: { type: "PULSE" } },
    { label: "Scan", op: "observerOps", payload: { type: "SCAN" } },
    { label: "Enter Arena", op: "arenaOps", payload: { type: "ENTER" } },
    { label: "Exit Arena", op: "arenaOps", payload: { type: "EXIT" } }
  ];

  actions.forEach(a => {
    el.appendChild(createActionButton(a.label, a.op, a.payload, stateBus));
  });

  return el;
}
