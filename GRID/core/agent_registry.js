export const AgentRegistry = {
  agents: new Map(),

  register(id, agent) {
    this.agents.set(id, agent);
  },

  get(id) {
    return this.agents.get(id);
  }
};
