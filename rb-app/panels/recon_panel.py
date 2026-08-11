
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
