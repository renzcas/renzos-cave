# backend-python/fastapi-backend/app/main.py
import asyncio
import json
import random
import httpx
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn

app = FastAPI()


@app.get("/")
async def root():
    return {"status": "ok", "websocket": "/ws"}


cockpit_state = {
    "cycle": 0,
    "stress": 0.45,
    "efficiency": 0.82,
    "branchEntropy": 0.12,
    "erasureEntropy": 0.04,
    "timeSteps": 32,
    "spaceBytes": 50,
    "ioBytes": 10,
    "algoComplexity": 40,
    "activeTasks": [{"label": "Ready"}],
    "deferredTasks": []
}


def get_cockpit_telemetry():
    return {
        **cockpit_state,
        "activeTasks": [dict(task) for task in cockpit_state["activeTasks"]],
        "deferredTasks": [dict(task) for task in cockpit_state["deferredTasks"]]
    }


def execute_cockpit_cycle():
    cockpit_state["cycle"] += 1
    cycle = cockpit_state["cycle"]
    cockpit_state["stress"] = min(1, cockpit_state["stress"] + 0.1)
    cockpit_state["efficiency"] = max(0, cockpit_state["efficiency"] - 0.05)
    cockpit_state["branchEntropy"] = min(1, cockpit_state["branchEntropy"] + 0.125)
    cockpit_state["erasureEntropy"] = min(1, cockpit_state["erasureEntropy"] + 0.025)
    cockpit_state["timeSteps"] = min(100, cockpit_state["timeSteps"] + 7)
    cockpit_state["ioBytes"] = min(100, cockpit_state["ioBytes"] + 10)
    cockpit_state["algoComplexity"] = min(100, cockpit_state["algoComplexity"] + 5)
    cockpit_state["activeTasks"] = [{"label": f"Cycle {cycle}: node mutation complete"}]


@app.websocket("/ws")
async def cockpit_websocket(ws: WebSocket):
    await ws.accept()
    await ws.send_json({"type": "TELEMETRY", "state": get_cockpit_telemetry()})

    try:
        while True:
            message = await ws.receive_json()
            if not isinstance(message, dict) or message.get("action") != "EXECUTE_CYCLE":
                await ws.send_json({"type": "ERROR", "message": "Unsupported action"})
                continue

            execute_cockpit_cycle()
            await ws.send_json({"type": "TELEMETRY", "state": get_cockpit_telemetry()})
    except WebSocketDisconnect:
        pass

# ---------------------------------------------------------
# C# CaveSharp Engine Bridge
# ---------------------------------------------------------
async def get_csharp_state():
    """
    Pulls live state from the C# CaveSharp engine.
    If the engine is offline, returns safe defaults.
    """
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get("http://localhost:5000/engine/state")
            return r.json()
    except Exception:
        return {
            "tick": 0,
            "heat": 0,
            "archetype": "default",
            "regions": []
        }

# ---------------------------------------------------------
# WebSocket: Engine Stream → Cockpit
# ---------------------------------------------------------
@app.websocket("/engine")
async def engine_stream(ws: WebSocket):
    await ws.accept()

    while True:
        # Pull C# engine state
        csharp = await get_csharp_state()

        # Build stress field from C# regions
        stress_field = [
            {
                "x": r.get("x", 0),
                "y": r.get("y", 0),
                "z": r.get("z", 0),
                "s": r.get("s", 0)
            }
            for r in csharp.get("regions", [])
        ]

        # Build world nodes from C# regions
        world_nodes = [
            {
                "x": r.get("x", 0),
                "y": r.get("y", 0),
                "z": r.get("z", 0),
                "s": r.get("s", 0)
            }
            for r in csharp.get("regions", [])
        ]

        # ---------------------------------------------------------
        # ⭐ Cave Signals (J)
        # ---------------------------------------------------------
        signals = {
            "danger": max(
                random.uniform(0, 1),
                csharp.get("heat", 0),
                random.uniform(0, 1)
            ),
            "heat": csharp.get("heat", 0),
            "resonance": random.uniform(0, 10),
            "archetype": csharp.get("archetype", "default")
        }

        # ---------------------------------------------------------
        # ⭐ Portal Data (G)
        # ---------------------------------------------------------
        portals = [
            {
                "x": r.get("x", 0),
                "y": r.get("y", 0),
                "z": r.get("z", 0),
                "color": "#00ffff",
                "spin": 0.5 + r.get("s", 0) * 2
            }
            for r in csharp.get("regions", [])[:5]
        ]

        # ---------------------------------------------------------
        # ⭐ Unified Engine Packet
        # ---------------------------------------------------------
        packet = {
            "density": random.uniform(0, 1),
            "resonance": random.uniform(0, 10),
            "stress": random.uniform(0, 5),

            # C# CaveSharp engine state
            "archetype": csharp.get("archetype", "default"),
            "csharp": {
                "tick": csharp.get("tick", 0),
                "heat": csharp.get("heat", 0)
            },

            # World geometry
            "world": {
                "nodes": world_nodes
            },

            # Stress field (war-engine visualizer)
            "stressField": stress_field,

            # Portal system
            "portals": portals,

            # Cave signals (danger flashes, runes, harmonic warnings)
            "signals": signals
        }

        await ws.send_text(json.dumps(packet))
        await asyncio.sleep(0.05)  # 20 FPS engine stream

# ---------------------------------------------------------
# Run server
# ---------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
