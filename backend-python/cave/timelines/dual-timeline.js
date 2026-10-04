// dual-timeline.js
// Two coupled timelines: structural + resonant.

export function createDualTimeline({ stateBus }) {
  const structural = [];
  const resonant = [];

  function addStructural(evt) {
    structural.push({ ...evt, timestamp: Date.now() });
    stateBus.append("structuralTimeline", evt);
  }

  function addResonant(evt) {
    resonant.push({ ...evt, timestamp: Date.now() });
    stateBus.append("resonantTimeline", evt);
  }

  return {
    addStructural,
    addResonant,
    getStructural: () => structural.slice(),
    getResonant: () => resonant.slice()
  };
}
