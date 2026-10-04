export function createTelemetryPanel() {
  const panel = document.createElement("div");
  panel.style.position = "absolute";
  panel.style.top = "10px";
  panel.style.left = "10px";
  panel.style.padding = "10px";
  panel.style.background = "rgba(0,0,0,0.6)";
  panel.style.color = "#0ff";
  panel.style.fontFamily = "monospace";
  panel.style.fontSize = "14px";
  panel.style.border = "1px solid #0ff";

  panel.innerHTML = `
    <div><b>ENGINE TELEMETRY</b></div>
    <div id="density">density: --</div>
    <div id="resonance">resonance: --</div>
    <div id="timeline">timeline: --</div>
    <div id="stress">stress: --</div>
    <div id="csharp">csharp: --</div>
  `;

  document.body.appendChild(panel);

  return {
    update(data) {
      if (data.density !== undefined)
        document.getElementById("density").innerText = `density: ${data.density}`;

      if (data.resonance !== undefined)
        document.getElementById("resonance").innerText = `resonance: ${data.resonance}`;

      if (data.timeline !== undefined)
        document.getElementById("timeline").innerText = `timeline: ${data.timeline}`;

      if (data.stress !== undefined)
        document.getElementById("stress").innerText = `stress: ${data.stress}`;

      if (data.csharp !== undefined)
        document.getElementById("csharp").innerText = `csharp: ${data.csharp}`;
    }
  };
}
