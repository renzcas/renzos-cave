// timeline-engine.js
// Manages a simple list of timeline events.

export function createTimelineEngine({ stateBus }) {
  const events = [];

  function addEvent(evt) {
    events.push({ ...evt, timestamp: Date.now() });
    stateBus.append("timelineTrace", evt);
  }

  function getEvents() {
    return events.slice();
  }

  return { addEvent, getEvents };
}
