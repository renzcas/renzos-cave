// engine/OperatorDynasty.js — Operator Identity & Dynasty Organ
export class OperatorDynasty {
    constructor() {
        this.current = this.generateOperator();
        this.lineage = [this.current];
        this.t = 0;

        this.createHUD();
    }

    generateOperator() {
        const names = [
            "WallyPipHehHeh#",
            "DynastyOperator#",
            "StoneCaller#",
            "GlyphRunner#",
            "IonScribe#",
            "PulseBearer#"
        ];

        return {
            name: names[Math.floor(Math.random() * names.length)],
            level: 1,
            xp: 0,
            aura: Math.random() * 0.5 + 0.5,
            ritualCycle: 0
        };
    }

    createHUD() {
        this.hud = document.createElement("div");
        this.hud.id = "operator-hud";
        this.hud.style.position = "fixed";
        this.hud.style.top = "20px";
        this.hud.style.left = "20px";
        this.hud.style.color = "#ff00ff";
        this.hud.style.fontFamily = "monospace";
        this.hud.style.fontSize = "18px";
        this.hud.style.textShadow = "0 0 8px #ff00ff";
        this.hud.style.pointerEvents = "none";
        this.hud.style.zIndex = "10";

        document.body.appendChild(this.hud);
        this.updateHUD();
    }

    updateHUD() {
        this.hud.innerHTML = `
            <div><b>Operator:</b> ${this.current.name}</div>
            <div><b>Level:</b> ${this.current.level}</div>
            <div><b>XP:</b> ${this.current.xp}</div>
            <div><b>Aura:</b> ${this.current.aura.toFixed(2)}</div>
        `;
    }

    gainXP(amount) {
        this.current.xp += amount;
        if (this.current.xp >= this.current.level * 10) {
            this.current.level++;
            this.current.xp = 0;
        }
        this.updateHUD();
    }

    switchOperator() {
        const newOp = this.generateOperator();
        this.current = newOp;
        this.lineage.push(newOp);
        this.updateHUD();
    }

    update(dt) {
        this.t += dt;

        // Aura pulse
        const pulse = 1 + Math.sin(this.t * 2) * 0.1;
        this.hud.style.opacity = pulse;

        // Ritual cycle
        this.current.ritualCycle += dt * 0.1;
        if (this.current.ritualCycle > Math.PI * 2) {
            this.current.ritualCycle = 0;
            this.gainXP(1);
        }
    }
}
