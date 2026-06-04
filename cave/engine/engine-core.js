// cave/engine/engine-core.js

import { startRuntime, stopRuntime } from "../runtime/runtime-loop.js";

export function createEngineCore() {
  return {
    start() {
      startRuntime();
    },

    stop() {
      stopRuntime();
    }
  };
}
