// operator-link.js (ESM)
export class OperatorLink {
    constructor(memoryPalace) {
        this.memory = memoryPalace;
        this.currentMode = "normal";
    }

    setMode(mode) {
        this.currentMode = mode;
        this.memory.store("operator-mode", {
            vector: [mode],
            fractal: null,
            complexity: 1,
            notes: `Operator switched to ${mode}`
        });
    }

    getMode() {
        return this.currentMode;
    }

    annotate(note) {
        this.memory.store("operator-note", {
            vector: [],
            fractal: null,
            complexity: 1,
            notes: note
        });
    }
}
