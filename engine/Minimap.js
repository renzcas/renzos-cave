// engine/Minimap.js — Chamber Navigation Organ
export class Minimap {
    constructor({ chamber, symbolic }) {
        this.chamber = chamber;
        this.symbolic = symbolic;

        this.canvas = document.createElement("canvas");
        this.canvas.width = 200;
        this.canvas.height = 200;

        Object.assign(this.canvas.style, {
            position: "fixed",
            bottom: "60px",
            left: "20px",
            border: "2px solid #ff00ff",
            borderRadius: "6px",
            background: "rgba(0,0,0,0.7)",
            zIndex: "30"
        });

        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");

        this.t = 0;
    }

    drawChamber() {
        const ctx = this.ctx;
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(100, 100, 80, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawPortal() {
        const ctx = this.ctx;
        ctx.strokeStyle = "#ff00ff";
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(100, 40, 12, 0, Math.PI * 2);
        ctx.stroke();
    }

    drawSymbolNode() {
        const ctx = this.ctx;
        ctx.fillStyle = "#00e0ff";

        ctx.beginPath();
        ctx.arc(160, 160, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    drawOperator() {
        const ctx = this.ctx;
        ctx.fillStyle = "#ffffff";

        const pulse = 4 + Math.sin(this.t * 3) * 2;

        ctx.beginPath();
        ctx.arc(100, 140, pulse, 0, Math.PI * 2);
        ctx.fill();
    }

    update(dt) {
        this.t += dt;

        const ctx = this.ctx;
        ctx.clearRect(0, 0, 200, 200);

        this.drawChamber();
        this.drawPortal();
        this.drawSymbolNode();
        this.drawOperator();
    }
}
