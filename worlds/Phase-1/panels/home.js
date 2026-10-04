export function HomePanel() {
  const div = document.createElement("div")
  div.className = "panel"
  div.innerHTML = "<h2>Welcome to the Cave</h2><p>Select a panel above.</p>"
  return div
}
