// cave/runtime/state-bus.js

export const stateBus = {
  state: {},
  queues: {},

  append(key, value) {
    if (!this.state[key]) {
      this.state[key] = [];
    }
    this.state[key].push({
      at: Date.now(),
      value
    });
  },

  getState() {
    return this.state;
  },

  // NEW: queue system for symbolic VM, emergence engine, etc.
  enqueue(queueName, item) {
    if (!this.queues[queueName]) {
      this.queues[queueName] = [];
    }
    this.queues[queueName].push(item);
  },

  getQueue(queueName) {
    if (!this.queues[queueName]) {
      this.queues[queueName] = [];
    }
    return this.queues[queueName];
  },

  flushQueue(queueName) {
    const q = this.getQueue(queueName);
    this.queues[queueName] = [];
    return q;
  }
};
