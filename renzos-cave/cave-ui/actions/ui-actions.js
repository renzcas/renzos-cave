// cave-ui/actions/ui-actions.js

export function createActionButton(label, opType, payload, stateBus) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.className = "ui-action-btn";

  btn.onclick = () => {
    stateBus.append(opType, payload);
  };

  return btn;
}
