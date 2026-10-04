
import tkinter as tk
from tkinter import ttk, scrolledtext
from agents.metrics.metrics_core import refresh_system_panel

class SystemPanel:
    def __init__(self, tabs):
        frame = ttk.Frame(tabs)
        tabs.add(frame, text="System Panel")

        self.log = scrolledtext.ScrolledText(frame, width=120, height=30)
        self.log.pack(pady=10)

        tk.Button(frame, text="Refresh System Info",
                  command=lambda: refresh_system_panel(self.log)).pack()
