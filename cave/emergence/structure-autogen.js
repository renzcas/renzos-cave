// structure-autogen.js
// Very simple: occasionally emit "new chamber" events.

export function createStructureAutogen({ stateBus }) {
  let counter = 0;

  function step() {
    counter++;
    if (counter % 50 === 0) {
      const chamber = {
        id: `chamber-${counter}`,
        createdAt: Date.now()
      };
      stateBus.append("newChambers", chamber);
    }
  }

  return { step };
}
