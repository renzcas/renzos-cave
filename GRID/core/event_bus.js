export const GridBus = {
  listeners: new Map(),

  emit(event, payload) {
    const group = this.listeners.get(event);
    if (!group) return;
    for (const fn of group) fn(payload);
  },

  on(event, fn) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(fn);
  }
};
