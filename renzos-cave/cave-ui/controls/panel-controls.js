// cave-ui/controls/panel-controls.js

export function attachPanelControls(panelWrapper) {
  // === COLLAPSE / EXPAND ===
  const header = panelWrapper.querySelector("h2");
  if (!header) return;

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "–";
  toggleBtn.className = "panel-toggle";

  header.appendChild(toggleBtn);

  let collapsed = false;

  toggleBtn.onclick = () => {
    collapsed = !collapsed;
    panelWrapper.classList.toggle("collapsed", collapsed);
    toggleBtn.textContent = collapsed ? "+" : "–";
  };

  // === DRAGGING ===
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.onmousedown = e => {
    dragging = true;
    offsetX = e.clientX - panelWrapper.offsetLeft;
    offsetY = e.clientY - panelWrapper.offsetTop;
    panelWrapper.classList.add("dragging");
  };

  document.onmouseup = () => {
    dragging = false;
    panelWrapper.classList.remove("dragging");
  };

  document.onmousemove = e => {
    if (!dragging) return;
    panelWrapper.style.position = "absolute";
    panelWrapper.style.left = `${e.clientX - offsetX}px`;
    panelWrapper.style.top = `${e.clientY - offsetY}px`;
  };
}
