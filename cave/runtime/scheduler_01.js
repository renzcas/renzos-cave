// scheduler.js
// Simple scheduler placeholder.

export function createScheduler({ stateBus }) {
  function step() {
    // TODO: schedule tasks, deferred ops, etc.
    stateBus.append("schedulerTrace", { tickAt: Date.now() });
  }

  return { step };
}
