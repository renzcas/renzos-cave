from fastapi import FastAPI, WebSocket
import uvicorn
import asyncio
import random

app = FastAPI()

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    while True:
        data = {
            "density": random.uniform(0, 1),
            "resonance": random.uniform(0, 10),
            "timeline": random.randint(0, 100),
            "stress": random.uniform(0, 5),
            "csharp": "OK"
        }
        await ws.send_json(data)
        await asyncio.sleep(0.1)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
