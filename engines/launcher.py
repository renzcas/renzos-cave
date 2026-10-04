import subprocess
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PYTHON_BACKEND = os.path.join(ROOT, "backend-python")
CSHARP_BACKEND = os.path.join(ROOT, "backend-csharp")
FRONTEND = os.path.join(ROOT, "frontend", "renzoverse-ui")

def run_python_engines():
    engines = [
        "core",
        "cave",
        "cyber-recon",
        "fastapi-backend"
    ]

    for eng in engines:
        eng_path = os.path.join(PYTHON_BACKEND, eng)
        print(f"[PYTHON] Starting engine: {eng}")
        subprocess.Popen(["python3", "-m", eng], cwd=PYTHON_BACKEND)

def run_master_core():
    mc = os.path.join(PYTHON_BACKEND, "master_core.py")
    if os.path.exists(mc):
        print("[PYTHON] Starting master_core.py")
        subprocess.Popen(["python3", mc])

def run_stress_modules():
    stress_dir = os.path.join(PYTHON_BACKEND, "stress")
    if os.path.exists(stress_dir):
        print("[PYTHON] Starting stress router")
        subprocess.Popen(["python3", os.path.join(stress_dir, "stress_router.py")])

def run_csharp_engine():
    csproj = os.path.join(CSHARP_BACKEND, "GRID", "core", "VerseSharpEngine.csproj")
    if os.path.exists(csproj):
        print("[C#] Starting VerseSharpEngine")
        subprocess.Popen(["dotnet", "run", "--project", csproj])

def run_frontend():
    print("[NODE] Starting Renzoverse UI")
    subprocess.Popen(["npm", "run", "dev"], cwd=FRONTEND)

def start_all():
    print("=== Renzoverse OS Boot Sequence ===")
    run_python_engines()
    run_master_core()
    run_stress_modules()
    run_csharp_engine()
    run_frontend()

if __name__ == "__main__":
    start_all()
