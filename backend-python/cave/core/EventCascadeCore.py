from OrganBase import OrganBase

class EventCascadeCore(OrganBase):
    def __init__(self):
        self.cascade = []
        self.last_event_type = None

    def tick(self, snapshot):
        event = snapshot.get("event", {}).get("event", {})
        event_type = event.get("type")

        if event_type and event_type != self.last_event_type:
            new_events = self._cascade(event_type)
            self.cascade.extend(new_events)
            self.last_event_type = event_type

        snapshot["event_cascade"] = self.snapshot()

    def _cascade(self, event_type):
        if event_type == "growth_surge":
            return [
                {"type": "energy_spike", "impact": 0.08},
                {"type": "synergy_bloom", "impact": 0.12}
            ]

        if event_type == "collapse_warning":
            return [
                {"type": "stress_spike", "impact": -0.1},
                {"type": "energy_drain", "impact": -0.08}
            ]

        if event_type == "optimism_wave":
            return [
                {"type": "activation_boost", "impact": 0.05}
            ]

        if event_type == "pessimism_cloud":
            return [
                {"type": "agency_drop", "impact": -0.05}
            ]

        return []

    def snapshot(self):
        return {
            "cascade": self.cascade[-10:]
        }
