// index.js
// Boot the Cave Engine locally.

import { bootEngine } from "./engine/engine-runtime.js";

console.log("Booting Cave Engine...");
const engine = bootEngine();

process.on("SIGINT", () => {
  console.log("\nShutting down Cave Engine...");
  engine.stop();
  process.exit(0);
});
