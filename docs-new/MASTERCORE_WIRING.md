# MasterCore Wiring

## MasterCore Registration
`src/master_core.py` registers organs in `_register()`.

Current subsystems:
- `InfoPhyzx`
- `INFOPHYS-PIPELINE`
- `LLM_Organism`
- `BIG_ANIMAL`
- `InfoEngine`
- `agentdash`
- `EventCascade`

## Recommended master wiring pattern
Use this ordered lifecycle in `tick()`:

1. Build base physics state:
```python
phyzx = self.subsystems["InfoPhyzx"]
phyzx.update()
snapshot["physics"] = phyzx.snapshot()
```

2. Transform raw physics into perception:
```python
pipeline = self.subsystems["INFOPHYS-PIPELINE"]
snapshot["transformed_physics"] = pipeline.process(snapshot["physics"])
```

3. Run unified organ lifecycle:
```python
for organ in self.subsystems.values():
    if hasattr(organ, "pre_tick"):
        organ.pre_tick(snapshot)

for organ in self.subsystems.values():
    if hasattr(organ, "tick"):
        organ.tick(snapshot)

for organ in self.subsystems.values():
    if hasattr(organ, "post_tick"):
        organ.post_tick(snapshot)
```

4. Update cockpit and ingest snapshot:
```python
self.subsystems["agentdash"].update(snapshot)
self.subsystems["InfoEngine"].ingest(snapshot)
```

## Snapshot wiring
Keep all inter-organ communication in `snapshot`.

### Example: exposing world state
```python
snapshot["world"] = {
    "structures": snapshot.get("worldgen", {}).get("structures", []),
    "threats": snapshot.get("threats_opportunities", {}).get("items", []),
    "mode": snapshot.get("global_mode", {}).get("mode", "equilibrium"),
    "season": snapshot.get("clock", {}).get("season", "spring")
}
```

### Example: API response
Backends can return the unified snapshot directly, e.g.:
```python
return jsonify(snapshot)
```

## Notes
- Register new organs in `_register()` only.
- Do not mutate other organs directly.
- Prefer `snapshot` as the single source of truth per tick.
- If there are staging or world layers, they should consume from `snapshot["world"]`.
