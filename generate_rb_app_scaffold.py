import os

def create_file(path, content):
    """Create file only if it does NOT already exist."""
    if not os.path.exists(path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"[CREATED] {path}")
    else:
        print(f"[SKIPPED] {path} (already exists)")

BASE = "rb-app"

# ============================
# Cockpit main file
# ============================
create_file(f"{BASE}/rb_app_cockpit.py", """
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
""")

# ============================
# Panels
# ============================
create_file(f"{BASE}/panels/utility_panel.py", """
import tkinter as tk
from tkinter import ttk, scrolledtext
from utilities.file_organizer import organize_folder
from utilities.duplicate_finder import find_duplicates
from utilities.smart_renamer import rename_files
from utilities.folder_cleaner import clean_folder

class UtilityPanel:
    def __init__(self, tabs):
        frame = ttk.Frame(tabs)
        tabs.add(frame, text="Utility Panel")

        self.folder_var = tk.StringVar()

        tk.Label(frame, text="Folder:").pack()
        tk.Entry(frame, textvariable=self.folder_var, width=60).pack()

        self.log = scrolledtext.ScrolledText(frame, width=120, height=30)
        self.log.pack(pady=10)

        tk.Button(frame, text="Organize Files",
                  command=lambda: organize_folder(self.folder_var.get(), self.log)).pack()

        tk.Button(frame, text="Find Duplicates",
                  command=lambda: find_duplicates(self.folder_var.get(), self.log)).pack()

        tk.Button(frame, text="Rename Files",
                  command=lambda: rename_files(self.folder_var.get(), self.log)).pack()

        tk.Button(frame, text="Clean Folder",
                  command=lambda: clean_folder(self.folder_var.get(), self.log)).pack()
""")

create_file(f"{BASE}/panels/recon_panel.py", """
import tkinter as tk
from tkinter import ttk, scrolledtext

from utilities.url_scanner import scan_url
from utilities.directory_bruteforcer import brute_force
from utilities.api_recon_engine import api_recon
from utilities.auth_bypass_tester import test_auth
from utilities.param_fuzzer import fuzz_params

class ReconPanel:
    def __init__(self, tabs):
        frame = ttk.Frame(tabs)
        tabs.add(frame, text="Recon Panel")

        self.base_var = tk.StringVar()
        self.ep_var = tk.StringVar()

        tk.Label(frame, text="Base URL:").pack()
        tk.Entry(frame, textvariable=self.base_var, width=60).pack()

        tk.Label(frame, text="Endpoint:").pack()
        tk.Entry(frame, textvariable=self.ep_var, width=60).pack()

        self.log = scrolledtext.ScrolledText(frame, width=120, height=30)
        self.log.pack(pady=10)

        tk.Button(frame, text="URL Scan",
                  command=lambda: scan_url(self.base_var.get(), self.log)).pack()

        tk.Button(frame, text="Directory Brute-Force",
                  command=lambda: brute_force(self.base_var.get(), self.log)).pack()

        tk.Button(frame, text="API Recon Engine",
                  command=lambda: api_recon(self.base_var.get(), self.log)).pack()

        tk.Button(frame, text="Auth Bypass Tester",
                  command=lambda: test_auth(self.base_var.get(), self.ep_var.get(), self.log)).pack()

        tk.Button(frame, text="Parameter Fuzzer",
                  command=lambda: fuzz_params(self.base_var.get(), self.ep_var.get(), self.log)).pack()
""")

create_file(f"{BASE}/panels/system_panel.py", """
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
""")

create_file(f"{BASE}/panels/agent_metrics_panel.py", """
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
""")

create_file(f"{BASE}/panels/world_model_panel.py", """
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
""")

create_file(f"{BASE}/panels/fusion_panel.py", """
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
""")

# ============================
# Utilities
# ============================
create_file(f"{BASE}/utilities/url_scanner.py", """
import requests
import time

def scan_url(url, log):
    log.insert("end", f"\\n--- Scanning {url} ---\\n")
    try:
        start = time.time()
        r = requests.get(url, timeout=10)
        end = time.time()

        log.insert("end", f"Status: {r.status_code}\\n")
        log.insert("end", f"Time: {round(end-start,3)}s\\n")

        for k,v in r.headers.items():
            log.insert("end", f"{k}: {v}\\n")

    except Exception as e:
        log.insert("end", f"Error: {e}\\n")
""")

create_file(f"{BASE}/utilities/directory_bruteforcer.py", """
import requests

COMMON = ["admin","api","login","config","debug","test","v1","v2"]

def brute_force(base, log):
    log.insert("end", f"\\n[DIR BRUTE] {base}\\n")
    for d in COMMON:
        url = f"{base}/{d}"
        try:
            r = requests.get(url, timeout=8)
            log.insert("end", f"{r.status_code} → {url}\\n")
        except Exception as e:
            log.insert("end", f"Error: {e}\\n")
""")

create_file(f"{BASE}/utilities/api_recon_engine.py", """
import requests
import json

ENDPOINTS = ["api","api/v1","api/v2","auth","users","status","debug"]

def api_recon(base, log):
    log.insert("end", f"\\n[API RECON] {base}\\n")
    for ep in ENDPOINTS:
        url = f"{base}/{ep}"
        try:
            r = requests.get(url, timeout=10)
            log.insert("end", f"{r.status_code} → {url}\\n")
            try:
                log.insert("end", json.dumps(r.json(), indent=2) + "\\n")
            except:
                pass
        except Exception as e:
            log.insert("end", f"Error: {e}\\n")
""")

create_file(f"{BASE}/utilities/auth_bypass_tester.py", """
import requests

TOKENS = {
    "no": None,
    "empty": "",
    "malformed": "abc.def",
    "expired": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired.signature",
    "random": "1234567890abcdef"
}

def test_auth(base, ep, log):
    log.insert("end", f"\\n[AUTH TEST] {base}/{ep}\\n")
    for label, token in TOKENS.items():
        headers = {}
        if token is not None:
            headers["Authorization"] = f"Bearer {token}"
        try:
            r = requests.get(f"{base}/{ep}", headers=headers, timeout=10)
            log.insert("end", f"{label}: {r.status_code}\\n")
        except Exception as e:
            log.insert("end", f"Error: {e}\\n")
""")

create_file(f"{BASE}/utilities/param_fuzzer.py", """
import requests

FUZZ = {
    "debug":["true","1"],
    "admin":["true","1"],
    "test":["true","1"],
    "verbose":["true","1"]
}

def fuzz_params(base, ep, log):
    log.insert("end", f"\\n[PARAM FUZZ] {base}/{ep}\\n")
    for p,vals in FUZZ.items():
        for v in vals:
            url = f"{base}/{ep}?{p}={v}"
            try:
                r = requests.get(url, timeout=10)
                log.insert("end", f"{r.status_code} → {url}\\n")
            except Exception as e:
                log.insert("end", f"Error: {e}\\n")
""")

# ============================
# Agents: metrics
# ============================
create_file(f"{BASE}/agents/metrics/metrics_core.py", """
import psutil

def refresh_system_panel(log):
    log.delete("1.0","end")

    cpu = psutil.cpu_percent()
    mem = psutil.virtual_memory()
    disk = psutil.disk_usage("/")
    net = psutil.net_io_counters()

    log.insert("end", f"CPU: {cpu}%\\n")
    log.insert("end", f"RAM: {mem.percent}%\\n")
    log.insert("end", f"Disk: {disk.percent}%\\n")
    log.insert("end", f"Sent: {net.bytes_sent}\\n")
    log.insert("end", f"Recv: {net.bytes_recv}\\n")
""")

create_file(f"{BASE}/agents/metrics/heartbeat_engine.py", """
import random

agent_state = {
    "attention":0.0,
    "spike":0.0,
    "entropy":0.0
}

def heartbeat_update(log):
    agent_state["attention"] = random.uniform(0.1,0.9)
    agent_state["spike"] = random.uniform(5,40)
    agent_state["entropy"] = random.uniform(0.1,0.9)

    log.delete("1.0","end")
    log.insert("end", f"Attention: {agent_state['attention']:.2f}\\n")
    log.insert("end", f"Spike: {agent_state['spike']:.2f}\\n")
    log.insert("end", f"Entropy: {agent_state['entropy']:.2f}\\n")

    log.after(1000, lambda: heartbeat_update(log))
""")

# ============================
# Agents: symbolic world model
# ============================
create_file(f"{BASE}/agents/symbolic/world_model.py", """
world = {
    "entrance":(50,50),
    "lab1":(150,150),
    "lab2":(300,150),
    "lab3":(450,150),
    "lab4":(600,150),
    "volcano":(350,300),
    "transport":(350,450)
}

agent_pos = world["entrance"]

def render_world(canvas):
    canvas.delete("all")
    for name,(x,y) in world.items():
        canvas.create_oval(x-10,y-10,x+10,y+10, fill="white")
        canvas.create_text(x,y-20,text=name,fill="white")

    ax,ay = agent_pos
    canvas.create_oval(ax-8,ay-8,ax+8,ay+8, fill="yellow")
    canvas.create_text(ax,ay-20,text="agent",fill="yellow")

def move_to(name, canvas):
    global agent_pos
    agent_pos = world[name]
    render_world(canvas)
""")

# ============================
# Agents: recon AI fusion
# ============================
create_file(f"{BASE}/agents/recon_ai/fusion_bridge.py", """
import random

agent = {
    "pos":[50,50],
    "attention":0.0,
    "entropy":0.0,
    "tasks":[]
}

def fusion_tick():
    agent["attention"] = random.uniform(0.1,0.9)
    agent["entropy"] = random.uniform(0.1,0.9)
    agent["pos"][0] += random.randint(-5,5)
    agent["pos"][1] += random.randint(-5,5)

def fusion_loop(log):
    log.insert("end","\\n=== FUSION START ===\\n")
    for i in range(10):
        fusion_tick()
        log.insert("end", f"Tick {i+1}: pos={agent['pos']} att={agent['attention']:.2f} ent={agent['entropy']:.2f}\\n")
    log.insert("end","=== FUSION END ===\\n")
""")

# ============================
# World + Config
# ============================
create_file(f"{BASE}/world/cave_layout.json", "{}")
create_file(f"{BASE}/world/world_state.json", "{}")
create_file(f"{BASE}/config/settings.json", "{}")
create_file(f"{BASE}/config/agent_profile.json", "{}")

print("\\nRB-App scaffold generation complete!")
