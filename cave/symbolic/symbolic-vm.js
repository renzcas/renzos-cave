// cave/symbolic/symbolic-vm.js

export function createSymbolicVM(stateBus) {
  return {
    step() {
      const ops = stateBus.getQueue("symbolicOps");

      // process ops (safe even if empty)
      for (const op of ops) {
        // TODO: implement symbolic operations
      }

      stateBus.flushQueue("symbolicOps");
    },

    getState() {
      return {
        opsPending: stateBus.getQueue("symbolicOps").length
      };
    }
  };
}
