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
  }

  connect(url) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log("EngineStream connected");
    };

    this.ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        this.packet = data;
      } catch (e) {
        console.error("Bad packet:", e);
      }
    };

    this.ws.onerror = (err) => {
      console.error("EngineStream error:", err);
    };
  }

  read() {
    return this.packet;
  }
}
