# CaveSharp Integration — Unified Language Layer

## 1. Purpose
CaveSharp is the scripting language that binds the entire ecosystem:
- SovereignEngine-Core (engine physics + ECS)
- Renzoverse (world events + region logic)
- BIG_ANIMAL (organism behaviors + spike reactions)
- Renzo-Hacker-Lab (operator commands)
- AgentDash (telemetry + visualization)

CaveSharp is the Leyline Language of the system.

---

## 2. Runtime Architecture
CaveSharp runtime consists of:
- Tokenizer
- Parser
- AST builder
- Interpreter
- Error system
- Execution model

The runtime lives inside the engine layer.

---

## 3. Engine Bindings (SovereignEngine-Core)
CaveSharp exposes engine functions:

spawn(entity, x, y)
move(entity, dx, dy)
apply_force(entity, fx, fy)
set_region(entity, region)
log(message)

These map to ECS + physics calls.

---

## 4. World Bindings (Renzoverse)
World scripts define:

on_enter(entity)
on_exit(entity)
on_tick
on_hazard_trigger(hazard)

Regions and entities can have CaveSharp scripts attached.

---

## 5. Organism Bindings (BIG_ANIMAL)
Organisms use CaveSharp for behaviors:

on_tick
on_energy_low
on_enemy_detected(enemy)
on_spike(pattern)

This connects biological simulation to the engine.

---

## 6. Cockpit Bindings (Renzo-Hacker-Lab)
The operator cockpit sends CaveSharp commands:

execute {
    spawn("scout", 10, 10)
    move("scout", 2, 0)
}

Commands flow:
Cockpit → CaveSharp → Engine → AgentDash

---

## 7. Telemetry Bindings (AgentDash)
CaveSharp scripts can emit telemetry:

emit("attention_shift", agent)
emit("region_event", region)
emit("organism_state", organism)

AgentDash displays these signals.

---

## 8. Next Steps
- Define the CaveSharp standard library
- Implement the runtime hooks
- Connect CaveSharp to the engine loader
- Add world script examples
- Add organism script examples
