export class EngineStream {
  constructor() {
    this.packet = {
      stress: 0,
      heat: 0,
      resonance: 0,
      archetype: "none",
      world: {
        nodes: []
      },
      portals: [],
      signals: []
    };

    this.ws = null;
    this.url = null;
  }

  connect(url) {
    this.url = url;
    const socket = new WebSocket(url);
    this.ws = socket;

    socket.onopen = () => {
      console.log("EngineStream connected");
    };

    socket.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (!data || typeof data !== "object" || Array.isArray(data)) {
          throw new Error("Expected an engine packet object");
        }
        this.packet = data;
      } catch (e) {
        console.error("Bad packet:", e);
      }
    };

    socket.onerror = (err) => {
      console.error("EngineStream error:", err);
    };

    socket.onclose = () => {
      if (this.ws !== socket) return;
      this.ws = null;
      window.setTimeout(() => this.connect(this.url), 2000);
    };
  }

  read() {
    return this.packet;
  }
}
