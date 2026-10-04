# backend-python/fastapi-backend/app/main.py
import asyncio
import json
import random
import httpx
from fastapi import FastAPI, WebSocket
import uvicorn

app = FastAPI()

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
