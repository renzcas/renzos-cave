
import tkinter as tk
from tkinter import ttk
from agents.symbolic.world_model import render_world, move_to

class WorldModelPanel:
    def __init__(self, tabs):
        frame = ttk.Frame(tabs)
        tabs.add(frame, text="World Model")

        self.canvas = tk.Canvas(frame, width=700, height=600, bg="#1a1a1a")
        self.canvas.pack(pady=10)

        render_world(self.canvas)

        for name in ["entrance", "lab1", "lab2", "lab3", "lab4", "volcano", "transport"]:
            tk.Button(frame, text=name.capitalize(),
                      command=lambda n=name: move_to(n, self.canvas)).pack()
