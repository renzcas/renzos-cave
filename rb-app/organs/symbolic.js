import { UnifiedEngine } from "../engine/unified.js";

export const Symbolic = {
    phase: 0,
    motifs: [],
    resonance: 0,

    update() {
        const world = UnifiedEngine.fuse();

        // Symbolic phase driven by labyrinth complexity
        const complexityAvg = world.labyrinth
            .reduce((a, b) => a + b.complexity, 0) / world.labyrinth.length;

        this.phase += complexityAvg * 0.05;

        // Volcano turbulence adds symbolic instability
        this.resonance = world.volcano * 0.8 + world.alien * 0.2;

        // Color resonance
        const hue = (this.phase * 40) % 360;
        const sat = 60 + this.resonance * 40;
        const light = 50 + this.resonance * 20;

        const panel = document.getElementById("panel-container");
        if (panel) {
            panel.style.borderColor = `hsl(${hue}, ${sat}%, ${light}%)`;
        }

        // Motif detection (symbolic turbulence spikes)
        if (this.resonance > 0.7 && Math.random() < 0.02) {
            const motif = {
                type: ["loop", "pulse", "fracture"][Math.floor(Math.random() * 3)],
                time: performance.now(),
                resonance: this.resonance
            };
            this.motifs.push(motif);
            console.log("Symbolic motif:", motif.type, "resonance:", motif.resonance.toFixed(2));
        }
    },

    getMotifs() {
        return this.motifs.slice(-10);
    }
};
