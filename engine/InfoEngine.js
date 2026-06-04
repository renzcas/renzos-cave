// engine/InfoEngine.js — Diagnostics, Organ Registry, Engine Heartbeat Panel
export class InfoEngine {
    constructor({ chamber, dynasty, symbolic }) {
        this.chamber = chamber;
        this.dynasty = dynasty;
        this.symbolic = symbolic;

        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();

        this.createPanel();
    }

    // --------------------------
    // UI Panel
    // --------------------------
    createPanel() {
        this.panel = document.createElement("div");
        this.panel.id = "info-engine-panel";

        Object.assign(this.panel.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            width: "260px",
            padding: "12px",
            background: "rgba(0,0,0,0.65)",
            color: "#00e0ff",
            fontFamily: "monospace",
            fontSize: "14px",
            border: "1px solid #00e0ff",
            borderRadius: "8px",
            boxShadow: "0 0 12px #00e0ff",
            zIndex: "20",
            transition: "opacity 0.3s ease",
        });

        document.body.appendChild(this.panel);
        this.updatePanel();
    }

    updatePanel() {
        this.panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom:6px;">INFOENGINE PANEL</div>
            <div><b>FPS:</b> ${this.fps}</div>
            <div><b>Operator:</b> ${this.dynasty.current.name}</div>
            <div><b>Level:</b> ${this.dynasty.current.level}</div>
            <div><b>Aura:</b> ${this.dynasty.current.aura.toFixed(2)}</div>
            <hr style="border:0; border-top:1px solid #00e0ff; margin:6px 0;">
            <div><b>Archetype:</b> ${this.symbolic.state.archetype}</div>
            <div><b>Hexagram:</b> ${this.symbolic.state.hexagram}</div>
            <div><b>Trigram:</b> ${this.symbolic.state.trigram}</div>
            <div><b>Triad:</b> ${this.symbolic.state.triad}</div>
            <hr style="border:0; border-top:1px solid #00e0ff; margin:6px 0;">
            <div><b>Chamber Fog:</b> ${this.chamber.scene.fog?.density.toFixed(3)}</div>
            <div><b>Portal Color:</b> ${this.chamber.portal.material.color.getStyle()}</div>
        `;
    }

    // --------------------------
    // FPS + Diagnostics
    // --------------------------
    update(dt) {
        this.frameCount++;
        const now = performance.now();

        if (now - this.lastTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTime = now;
        }

        this.updatePanel();
    }
}
