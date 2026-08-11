
import tkinter as tk
from tkinter import ttk, scrolledtext
from agents.metrics.heartbeat_engine import heartbeat_update

class AgentMetricsPanel:
    def __init__(self, tabs):
        frame = ttk.Frame(tabs)
        tabs.add(frame, text="Agent Metrics")

        self.log = scrolledtext.ScrolledText(frame, width=120, height=30)
        self.log.pack(pady=10)

        tk.Button(frame, text="Start Heartbeat",
                  command=lambda: heartbeat_update(self.log)).pack()
