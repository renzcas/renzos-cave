import { OrganRegistry } from "./organ-registry.js";

export function loadPanel(organName) {
  const organ = OrganRegistry[organName];
  if (!organ) return;

  fetch(organ.panel)
    .then(res => res.text())
    .then(html => {
      document.getElementById("main-panel").innerHTML = html;
    });
}
