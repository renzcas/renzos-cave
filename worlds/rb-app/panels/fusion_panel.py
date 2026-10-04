
import tkinter as tk
from tkinter import ttk, scrolledtext
from agents.recon_ai.fusion_bridge import fusion_loop

class FusionPanel:
    def __init__(self, tabs):
        frame = ttk.Frame(tabs)
        tabs.add(frame, text="Fusion Panel")

        self.log = scrolledtext.ScrolledText(frame, width=120, height=30)
        self.log.pack(pady=10)

        tk.Button(frame, text="Run Fusion Loop",
                  command=lambda: fusion_loop(self.log)).pack()
