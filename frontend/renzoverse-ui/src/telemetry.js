let socket;

export function initTelemetry(onUpdate) {
  socket = new WebSocket("ws://localhost:8001"); // Python FastAPI WS

  socket.onopen = () => {
    console.log("[Telemetry] Connected");
  };

  socket.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      onUpdate(data);
    } catch (e) {
      console.error("Telemetry parse error:", e);
    }
  };

  socket.onerror = (err) => {
    console.error("[Telemetry] Error:", err);
  };
}
