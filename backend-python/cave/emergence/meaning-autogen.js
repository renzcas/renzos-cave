// meaning-autogen.js
// Emits synthetic "meaning events" for testing.

export function createMeaningAutogen({ stateBus }) {
  let counter = 0;

  function step() {
    counter++;
    if (counter % 30 === 0) {
      stateBus.enqueue("symbolicOps", {
        type: "EMERGENT_PING",
        payload: { counter }
      });
    }
  }

  return { step };
}
