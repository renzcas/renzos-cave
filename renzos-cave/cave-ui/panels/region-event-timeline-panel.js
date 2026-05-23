// cave-ui/panels/region-event-timeline-panel.js

export function RegionEventTimelinePanel(stateBus) {
  const el = document.createElement("div");
  el.className = "panel region-event-timeline-panel";

  function render() {
    const state = stateBus.getState();
    const events = state.regionEvents || [];

    el.innerHTML = `
      <h2>Region Timeline</h2>
      <div class="timeline-log">
        ${events.slice(-20).map(e => `
          <div class="timeline-entry">
            <strong>[${e.time}]</strong> ${e.text}
          </div>
        `).join("")}
      </div>
    `;
  }

  stateBus.subscribe("regionEvent", render);
  stateBus.subscribe("regionChange", render);
  render();
  return el;
}
