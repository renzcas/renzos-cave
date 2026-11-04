let eventSequence = 0;

export const GRID_EVENTS = Object.freeze({
  CREATURE_STATE_UPDATE: 'CREATURE_STATE_UPDATE',
  LABYRINTH_GENERATED: 'LABYRINTH_GENERATED',
  AGENT_DECISION: 'AGENT_DECISION',
  CYBER_ATTACK_DETECTED: 'CYBER_ATTACK_DETECTED',
  ATTENTION_SHIFT: 'ATTENTION_SHIFT'
});

export const GridBus = {
  listeners: new Map(),
  history: [],

  publish(topic, payload, source = 'SYSTEM', metadata) {
    const timestamp = Date.now();
    const event = {
      id: globalThis.crypto?.randomUUID?.() ?? `grid-${timestamp}-${++eventSequence}`,
      timestamp,
      source,
      topic,
      payload,
      ...(metadata ? { metadata } : {})
    };

    this.history.push(event);
    if (this.history.length > 100) this.history.shift();

    this.dispatch(topic, event);
    if (topic !== '*') this.dispatch('*', event);
    return event;
  },

  emit(event, payload) {
    this.dispatch(event, payload);
  },

  subscribe(topic, callback) {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    const group = this.listeners.get(topic);
    group.add(callback);

    return () => {
      group.delete(callback);
      if (group.size === 0) this.listeners.delete(topic);
    };
  },

  on(topic, callback) {
    return this.subscribe(topic, callback);
  },

  dispatch(topic, message) {
    const group = this.listeners.get(topic);
    if (!group) return;

    for (const callback of [...group]) {
      try {
        callback(message);
      } catch (error) {
        console.error(`GridBus listener failed for ${topic}:`, error);
      }
    }
  }
};
