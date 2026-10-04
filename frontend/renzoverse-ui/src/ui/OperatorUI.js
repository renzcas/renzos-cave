// OperatorUI.js — On-screen operator command panel
import { sendCaveSharpCommand } from '../controls/CaveSharpControl.js';

export class OperatorUI {
  constructor() {
    this.root = document.createElement("div");
    this.root.id = "operator-ui";
    document.body.appendChild(this.root);

    this.createButton("BOOST", "boost");
    this.createButton("PULSE", "pulse");
    this.createButton("STABILIZE", "stabilize");

    this.createSlider("Heat Level", "heat", (v) => {
      sendCaveSharpCommand(`heat:${v}`);
    });
  }

  createButton(label, command) {
    const btn = document.createElement("button");
    btn.className = "op-btn";
    btn.innerText = label;
    btn.onclick = () => sendCaveSharpCommand(command);
    this.root.appendChild(btn);
  }

  createSlider(label, id, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "op-slider-wrap";

    const text = document.createElement("div");
    text.className = "op-slider-label";
    text.innerText = label;

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 0;
    slider.max = 100;
    slider.value = 50;
    slider.className = "op-slider";

    slider.oninput = () => onChange(slider.value);

    wrap.appendChild(text);
    wrap.appendChild(slider);
    this.root.appendChild(wrap);
  }
}
