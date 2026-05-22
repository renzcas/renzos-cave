// engine/SymbolicEngine.js — Symbolic Cognition Organ
export class SymbolicEngine {
    constructor(scene, dynasty) {
        this.scene = scene;
        this.dynasty = dynasty;
        this.t = 0;

        this.state = {
            archetype: this.randomArchetype(),
            hexagram: this.randomHexagram(),
            trigram: this.randomTrigram(),
            triad: this.randomTriad()
        };

        this.createOverlay();
        this.updateOverlay();
    }

    // --------------------------
    // Symbolic Sets
    // --------------------------
    randomArchetype() {
        const list = ["Dragon", "Tiger", "Serpent", "Phoenix", "Bear"];
        return list[Math.floor(Math.random() * list.length)];
    }

    randomHexagram() {
        const list = [
            "䷀ Creative",
            "䷁ Receptive",
            "䷂ Difficulty",
            "䷃ Youthful Folly",
            "䷄ Waiting",
            "䷅ Conflict",
            "䷆ Army",
            "䷇ Holding Together"
        ];
        return list[Math.floor(Math.random() * list.length)];
    }

    randomTrigram() {
        const list = [
            "Heaven",
            "Earth",
            "Thunder",
            "Water",
            "Mountain",
            "Wind",
            "Fire",
            "Lake"
        ];
        return list[Math.floor(Math.random() * list.length)];
    }

    randomTriad() {
        const list = ["Mind", "Body", "Spirit"];
        return list[Math.floor(Math.random() * list.length)];
    }

    // --------------------------
    // Overlay UI
    // --------------------------
    createOverlay() {
        this.overlay = document.createElement("div");
        this.overlay.id = "symbolic-overlay";
        this.overlay.style.position = "fixed";
        this.overlay.style.bottom = "20px";
        this.overlay.style.right = "20px";
        this.overlay.style.color = "#ff00ff";
        this.overlay.style.fontFamily = "monospace";
        this.overlay.style.fontSize = "16px";
        this.overlay.style.textAlign = "right";
        this.overlay.style.textShadow = "0 0 8px #ff00ff";
        this.overlay.style.pointerEvents = "none";
        this.overlay.style.zIndex = "10";

        document.body.appendChild(this.overlay);
    }

    updateOverlay() {
        this.overlay.innerHTML = `
            <div><b>Archetype:</b> ${this.state.archetype}</div>
            <div><b>Hexagram:</b> ${this.state.hexagram}</div>
            <div><b>Trigram:</b> ${this.state.trigram}</div>
            <div><b>Triad:</b> ${this.state.triad}</div>
        `;
    }

    // --------------------------
    // Symbolic Transitions
    // --------------------------
    cycleState() {
        this.state.archetype = this.randomArchetype();
        this.state.hexagram = this.randomHexagram();
        this.state.trigram = this.randomTrigram();
        this.state.triad = this.randomTriad();
        this.updateOverlay();
    }

    // --------------------------
    // Integration with Chamber & Dynasty
    // --------------------------
    update(dt, chamber) {
        this.t += dt;

        // Every 12 seconds, shift symbolic state
        if (this.t > 12) {
            this.t = 0;
            this.cycleState();
        }

        // Portal color shifts based on archetype
        if (chamber && chamber.portal) {
            const p = chamber.portal.material;
            const a = this.state.archetype;

            if (a === "Dragon") p.color.set("#ff0000");
            if (a === "Tiger") p.color.set("#ffaa00");
            if (a === "Serpent") p.color.set("#00ff88");
            if (a === "Phoenix") p.color.set("#ff00ff");
            if (a === "Bear") p.color.set("#8888ff");
        }

        // Fog modulation based on trigram
        if (this.scene.fog) {
            const f = this.scene.fog;
            const tri = this.state.trigram;

            if (tri === "Water") f.density = 0.12;
            else if (tri === "Fire") f.density = 0.06;
            else if (tri === "Thunder") f.density = 0.1;
            else f.density = 0.08;
        }

        // Operator aura influences overlay pulse
        const aura = this.dynasty.current.aura;
        const pulse = 1 + Math.sin(this.t * 2) * 0.1 * aura;
        this.overlay.style.opacity = pulse;
    }
}
