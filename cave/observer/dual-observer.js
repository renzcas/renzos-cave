// dual-observer.js
// Two coupled observers: structural + resonant.

export function createDualObserver({ stateBus }) {
  const structural = { id: "architect-structural", mode: "structural" };
  const resonant = { id: "architect-resonant", mode: "resonant" };

  function observeStructural(evt) {
    stateBus.append("observerStructural", { evt, ...structural });
  }

  function observeResonant(evt) {
    stateBus.append("observerResonant", { evt, ...resonant });
  }

  return {
    structural,
    resonant,
    observeStructural,
    observeResonant
  };
}
