// Phase-1 state.js (Cave v1)
export const state = {
  activePanel: "home",
  memory: {},

  set(key, value) {
    this.memory[key] = value
  },

  get(key) {
    return this.memory[key]
  }
}
