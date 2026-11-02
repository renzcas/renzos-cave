const initialState = {
  cycle: 0,
  stress: 0.45,
  efficiency: 0.82,
  branchEntropy: 0.12,
  erasureEntropy: 0.04,
  timeSteps: 32,
  spaceBytes: 50,
  ioBytes: 10,
  algoComplexity: 40,
  activeTasks: [{ label: "Ready" }],
  deferredTasks: []
};

let state = copyState(initialState);
const listeners = new Set();

function copyState(value) {
  return {
    ...value,
    activeTasks: value.activeTasks.map(task => ({ ...task })),
    deferredTasks: value.deferredTasks.map(task => ({ ...task }))
  };
}

function publish() {
  const snapshot = copyState(state);
  listeners.forEach(listener => listener(snapshot));
}

export const simulationState = {
  getSnapshot() {
    return copyState(state);
  },

  subscribe(listener) {
    listeners.add(listener);
    listener(this.getSnapshot());
    return () => listeners.delete(listener);
  },

  update(newState) {
    state = { ...state, ...newState };
    publish();
    return this.getSnapshot();
  }
};