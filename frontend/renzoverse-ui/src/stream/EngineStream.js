let socket;
let latest = {};

export function initEngineStream(onPacket) {
  socket = new WebSocket("ws://localhost:8001/engine");

  socket.onopen = () => console.log("[EngineStream] Connected");

  socket.onmessage = (msg) => {
    try {
      latest = JSON.parse(msg.data);
      onPacket(latest);
    } catch (e) {
      console.error("EngineStream parse error:", e);
    }
  };

  socket.onerror = (err) => console.error("[EngineStream] Error:", err);
}
