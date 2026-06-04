import { registry } from "./registry.js"
import { state } from "./state.js"

const container = document.getElementById("panel-container")

function renderPanel(name) {
  const panel = registry.get(name)
  if (!panel) return

  container.innerHTML = ""
  container.appendChild(panel())
  state.active_panel = name
}

document.querySelectorAll("nav button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const panel = btn.getAttribute("data-panel")
    renderPanel(panel)
  })
})

// default panel
renderPanel("home")
