# Cave Architecture

## Overview
The Cave is organized into three major layers plus a surface layer:

1. Core Simulation Brain
2. World & Visualization Layers
3. Command & Control Systems
4. Surface Layer

## Core Simulation Brain
The core simulation is centered on `src/master_core.py` and the organ packages.

### MasterCore
`src/master_core.py` orchestrates the simulation heartbeat:
- Physics update (`InfoPhyzx`)
- Perception/transform (`INFOPHYS-PIPELINE`)
- Organ lifecycle (`pre_tick`, `tick`, `post_tick`)
- Cockpit/logging (`agentdash`)
- Info ingestion (`InfoEngine`)
- Event cascades (`EventCascade`)

### Organ packages
- `InfoPhyzx/`
- `LLM_Organism/`
- `InfoEngine/`
- `CyberArena/`
- `Phase-1/`
- `core/`
- `organs/`
- `cave/core/`

## World & Visualization Layers
These folders contain the UI and visualization surface for the Cave.

- `cave-ui/`
- `cave-viewer/`
- `three-chamber/`
- `universes/`
- `vue-admin/`

## Command & Control Systems
These folders handle external access and orchestration.

- `command-center/`
- `cyber-recon/`
- `fastapi-backend/`
- `fusion/`

## Surface Layer
Root files and documentation that present the Cave.

- `index.html`
- `README.md`
- `script.js`
- `styles.css`
- `.gitmodules`

## Data Flow Summary
1. `MasterCore.tick()` builds a snapshot.
2. `InfoPhyzx` updates physics state.
3. `INFOPHYS_PIPELINE` transforms physics into perception.
4. Registered organs consume and emit state via snapshot.
5. `agentdash` logs and updates the cockpit.
6. `InfoEngine` ingests and persists the snapshot.

## Recommended wiring
- Keep all organ state exchange inside the `snapshot` dictionary.
- Avoid direct cross-organ method calls.
- Use `OrganBase` interface for lifecycle consistency.
