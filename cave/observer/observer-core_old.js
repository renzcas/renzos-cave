// observer-core.js
// Single observer abstraction.

export function createObserverCore({ stateBus }) {
  const state = {
    mode: "structural", // or "resonant"
    id: "architect-1"
  };

  function setMode(mode) {
    state.mode = mode;
    stateBus.append("observerModeChange", { mode, timestamp: Date.now() });
  }

  function observe(event) {
    stateBus.append("observerEvents", { event, mode: state.mode });
  }

  return {
    getState: () => ({ ...state }),
    setMode,
    observe
  };
}
