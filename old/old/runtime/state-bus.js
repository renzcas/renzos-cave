// cave/runtime/state-bus.js

export const stateBus = {
  state: {},
  queues: {},
  listeners: {},

  getState() {
    return this.state;
  },

  set(key, value) {
    this.state[key] = value;
    this.emit(key);
  },

  append(key, value) {
    if (!this.queues[key]) this.queues[key] = [];
    this.queues[key].push(value);
    this.emit(key);
  },

  getQueue(key) {
    if (!this.queues[key]) this.queues[key] = [];
    return this.queues[key];
  },

  flushQueue(key) {
    this.queues[key] = [];
  },

  subscribe(key, fn) {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(fn);
  },

  emit(key) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(fn => fn(this.state));
    }
  }
};
