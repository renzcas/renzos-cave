class CaveManager:
    def __init__(self, config):
        # --- WORLD ENGINES ---
        self.macro_nca = config.make_macro_nca()
        self.micro_nca = config.make_micro_nca()

        # --- DRONE PIPELINE ---
        self.ingestor = config.make_ingestor()
        self.perception = config.make_perception()
        self.graph_builder = config.make_graph_builder()
        self.synthesizer = config.make_synthesizer()

        # --- ENTITIES ---
        self.entities = config.make_entities()
        self.entity_integration = config.make_entity_integration()

        # --- EVALUATOR ---
        self.evaluator = config.make_evaluator()

        # --- META-AGENT ---
        self.meta_agent = config.make_meta_agent()

        # --- UI STREAM ---
        self.ui = config.make_ui_stream()

        # --- STATE ---
        self.state = config.make_macro_seed()

    def step_world(self):
        # 1. Macro NCA update
        self.state = self.macro_nca(self.state, steps=4)

    def step_drone_pipeline(self):
        frame, gps, imu = self.ingestor.next_frame()
        objects = self.perception.run(frame)
        graph = self.graph_builder.build(objects)
        summary = self.synthesizer.summarize(graph)
        return frame, graph, summary

    def step_entities(self, graph):
        self.entity_integration.update(self.entities, graph)

    def step_evaluator(self):
        return self.evaluator.run(self)

    def step_meta_agent(self, logs):
        self.meta_agent.improve(
            path="backend/drone/perception.py",
            spec="mission spec here",
            logs=logs,
            evaluator=self.evaluator,
            agent=self
        )

    def stream_to_ui(self, frame, graph, summary):
        self.ui.send({
            "macro": self.state,
            "scene": graph,
            "summary": summary,
            "entities": self.entities,
            "score": self.evaluator.last_score
        })

    def run(self):
        while True:
            self.step_world()
            frame, graph, summary = self.step_drone_pipeline()
            self.step_entities(graph)
            score = self.step_evaluator()
            self.stream_to_ui(frame, graph, summary)
