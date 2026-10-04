class MasterCore:
    def __init__(self):
        self.subsystems = {}
        self._register()

    def _register(self):
        from InfoPhyzx.core import InfoPhyzxCore
        from INFOPHYS_PIPELINE.core import InfoPhysPipelineCore
        from LLM_Organism.core import LLMOrganismCore
        from BIG_ANIMAL.core import BigAnimalCore
        from InfoEngine.core import InfoEngineCore
        from agentdash.core import AgentDashCore
        from cave.core.EventCascadeCore import EventCascadeCore
        # add other organs here as needed

        self.subsystems["InfoPhyzx"] = InfoPhyzxCore()
        self.subsystems["INFOPHYS-PIPELINE"] = InfoPhysPipelineCore()
        self.subsystems["LLM_Organism"] = LLMOrganismCore()
        self.subsystems["BIG_ANIMAL"] = BigAnimalCore()
        self.subsystems["InfoEngine"] = InfoEngineCore()
        self.subsystems["agentdash"] = AgentDashCore()
        self.subsystems["EventCascade"] = EventCascadeCore()

    def tick(self):
        snapshot = {}

        # 1. Physics
        phyzx = self.subsystems["InfoPhyzx"]
        phyzx.update()
        snapshot["physics"] = phyzx.snapshot()

        # 2. Perception / transform
        pipeline = self.subsystems["INFOPHYS-PIPELINE"]
        snapshot["transformed_physics"] = pipeline.process(snapshot["physics"])

        # 3. Unified organ lifecycle
        for organ in self.subsystems.values():
            if hasattr(organ, "pre_tick"):
                organ.pre_tick(snapshot)

        for organ in self.subsystems.values():
            if hasattr(organ, "tick"):
                organ.tick(snapshot)

        for organ in self.subsystems.values():
            if hasattr(organ, "post_tick"):
                organ.post_tick(snapshot)

        # 4. Cockpit + logging
        dash = self.subsystems["agentdash"]
        dash.update(snapshot)

        info = self.subsystems["InfoEngine"]
        info.ingest(snapshot)
