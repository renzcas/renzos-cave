
import tkinter as tk
from tkinter import ttk

from panels.utility_panel import UtilityPanel
from panels.recon_panel import ReconPanel
from panels.system_panel import SystemPanel
from panels.agent_metrics_panel import AgentMetricsPanel
from panels.world_model_panel import WorldModelPanel
from panels.fusion_panel import FusionPanel

root = tk.Tk()
root.title("RB-App Cockpit")
root.geometry("1100x750")

tabs = ttk.Notebook(root)
tabs.pack(expand=True, fill="both")

UtilityPanel(tabs)
ReconPanel(tabs)
SystemPanel(tabs)
AgentMetricsPanel(tabs)
WorldModelPanel(tabs)
FusionPanel(tabs)

root.mainloop()
