// cockpit-ui.js
// Renzo’s Cave Cockpit HUD (Radar, Gauges, Entropy, Reflex, Scheduler)

export class CaveCockpitUI {
  constructor() {
    // Radar
    this.radarPolygon = document.getElementById("complexityPolygon");

    // Gauges
    this.stressFill = document.querySelector("#stressBar .gauge-fill");
    this.effFill = document.querySelector("#efficiencyBar .gauge-fill");

    // Entropy
    this.branchEntropyEl = document.getElementById("branchEntropy");
    this.erasureEntropyEl = document.getElementById("erasureEntropy");

    // Reflex
    this.reflexPanel = document.getElementById("reflexPanel");

    // Scheduler
    this.taskQueueEl = document.getElementById("taskQueue");
    this.deferredEl = document.getElementById("deferredTasks");

  }

  update(signals) {
    if (!signals) return;

    this.updateGauges(signals);
    this.updateRadar(signals);
    this.updateEntropy(signals);
    this.updateReflex(signals);
    this.updateScheduler(signals);
  }

  // ---------------- GAUGES ----------------

  updateGauges(s) {
    const stress = clamp01(s.stress ?? s.energyCost / 100 ?? 0.3);
    const eff = clamp01(s.efficiency ?? 1 - (s.algoComplexity ?? 40) / 100);

    this.stressFill.style.width = `${stress * 100}%`;
    this.effFill.style.width = `${eff * 100}%`;
  }

  // ---------------- RADAR ----------------

  updateRadar(s) {
    const t = normalize(s.timeSteps ?? 0, 0, 100);
    const sp = normalize(s.spaceBytes ?? 0, 0, 100);
    const io = normalize(s.ioBytes ?? 0, 0, 100);
    const algo = normalize(s.algoComplexity ?? 0, 0, 100);

    const cx = 100, cy = 100, r = 80;

    const top = point(cx, cy, -Math.PI/2, r * t);
    const right = point(cx, cy, 0, r * sp);
    const bottom = point(cx, cy, Math.PI/2, r * io);
    const left = point(cx, cy, Math.PI, r * algo);

    this.radarPolygon.setAttribute(
      "points",
      `${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`
    );
  }

  // ---------------- ENTROPY ----------------

  updateEntropy(s) {
    this.branchEntropyEl.textContent = (s.branchEntropy ?? 0).toFixed(3);
    this.erasureEntropyEl.textContent = (s.erasureEntropy ?? 0).toFixed(3);
  }

  // ---------------- REFLEX ----------------

  updateReflex(s) {
    const stress = s.stress ?? s.energyCost / 100 ?? 0.3;
    const entropy = s.branchEntropy ?? 0;

    let state = "Idle";
    let color = "#888";

    if (stress < 0.3 && entropy < 0.3) {
      state = "Calm"; color = "#3dd68c";
    } else if (stress < 0.7 && entropy < 0.7) {
      state = "Engaged"; color = "#3da9ff";
    } else {
      state = "Overloaded"; color = "#ff4b6e";
    }

    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 250);
    const glow = pulse * 0.6 + 0.4;

    this.reflexPanel.textContent = state;
    this.reflexPanel.style.color = color;
    this.reflexPanel.style.boxShadow = `0 0 ${12 * glow}px ${color}`;
  }

  // ---------------- SCHEDULER ----------------

  updateScheduler(s) {
    const active = s.activeTasks ?? [];
    const deferred = s.deferredTasks ?? [];

    renderList(this.taskQueueEl, active);
    renderList(this.deferredEl, deferred);
  }
}

// ---------------- HELPERS ----------------

function clamp01(v) { return Math.max(0, Math.min(1, v)); }
function normalize(v,min,max){ return clamp01((v-min)/(max-min)); }

function point(cx,cy,angle,r){
  return { x: cx + Math.cos(angle)*r, y: cy + Math.sin(angle)*r };
}

function renderList(ul, items) {
  ul.innerHTML = "";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item.label ?? item.id ?? "task";
    ul.appendChild(li);
  }
}
