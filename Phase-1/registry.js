// Phase-1 registry.js (Cave v1)
export const registry = {
  panels: {},

  register(name, panelFn) {
    this.panels[name] = panelFn
  },

  get(name) {
    return this.panels[name]
  }
}
