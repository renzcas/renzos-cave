// engine/CaveOS.js — Window Manager + All Organs + HUD Panel
export class CaveOS {
    constructor({ dynasty, symbolic, chamber, infoEngine, curriculum, challenges }) {
        this.dynasty = dynasty;
        this.symbolic = symbolic;
        this.chamber = chamber;
        this.infoEngine = infoEngine;
        this.curriculum = curriculum;
        this.challenges = challenges;

        this.windows = [];
        this.zIndexCounter = 50;

        this.createTaskbar();
        this.registerApps();
    }

    createTaskbar() {
        this.taskbar = document.createElement("div");
        Object.assign(this.taskbar.style, {
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100%",
            height: "40px",
            background: "rgba(0,0,0,0.7)",
            borderTop: "1px solid #444",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            gap: "10px",
            zIndex: "40",
            fontFamily: "monospace",
            color: "#fff"
        });

        document.body.appendChild(this.taskbar);
    }

    registerApps() {
        this.apps = [
            { name: "Operator", action: () => this.openOperatorWindow() },
            { name: "Symbols", action: () => this.openSymbolWindow() },
            { name: "Chamber", action: () => this.openChamberWindow() },
            { name: "Info", action: () => this.openInfoWindow() },
            { name: "Academy", action: () => this.openAcademyWindow() },
            { name: "Challenges", action: () => this.openChallengeWindow() },
            { name: "HUD", action: () => this.openHUDWindow() }
        ];

        this.apps.forEach(app => {
            const btn = document.createElement("div");
            btn.innerText = app.name;
            Object.assign(btn.style, {
                padding: "6px 12px",
                background: "#222",
                border: "1px solid #555",
                borderRadius: "4px",
                cursor: "pointer"
            });

            btn.onclick = () => app.action();
            this.taskbar.appendChild(btn);
        });
    }

    createWindow(title, contentHTML) {
        const win = document.createElement("div");

        Object.assign(win.style, {
            position: "fixed",
            top: `${80 + Math.random() * 80}px`,
            left: `${80 + Math.random() * 80}px`,
            width: "300px",
            background: "rgba(0,0,0,0.85)",
            border: "1px solid #666",
            borderRadius: "6px",
            color: "#fff",
            fontFamily: "monospace",
            zIndex: this.zIndexCounter++,
            boxShadow: "0 0 12px #000"
        });

        const bar = document.createElement("div");
        bar.innerText = title;
        Object.assign(bar.style, {
            padding: "8px",
            background: "#111",
            borderBottom: "1px solid #444",
            cursor: "move",
            fontWeight: "bold"
        });

        const content = document.createElement("div");
        content.innerHTML = contentHTML;
        content.style.padding = "10px";

        win.appendChild(bar);
        win.appendChild(content);
        document.body.appendChild(win);

        this.makeDraggable(win, bar);
        this.windows.push(win);

        return win;
    }

    makeDraggable(win, bar) {
        let offsetX = 0, offsetY = 0, dragging = false;

        bar.onmousedown = (e) => {
            dragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
            win.style.zIndex = this.zIndexCounter++;
        };

        document.onmouseup = () => dragging = false;

        document.onmousemove = (e) => {
            if (!dragging) return;
            win.style.left = `${e.clientX - offsetX}px`;
            win.style.top = `${e.clientY - offsetY}px`;
        };
    }

    openOperatorWindow() {
        this.createWindow("Operator Dynasty", `
            <div><b>Name:</b> ${this.dynasty.current.name}</div>
            <div><b>Level:</b> ${this.dynasty.current.level}</div>
            <div><b>XP:</b> ${this.dynasty.current.xp}</div>
            <div><b>Aura:</b> ${this.dynasty.current.aura.toFixed(2)}</div>
        `);
    }

    openSymbolWindow() {
        this.createWindow("Symbolic Engine", `
            <div><b>Archetype:</b> ${this.symbolic.state.archetype}</div>
            <div><b>Hexagram:</b> ${this.symbolic.state.hexagram}</div>
            <div><b>Trigram:</b> ${this.symbolic.state.trigram}</div>
            <div><b>Triad:</b> ${this.symbolic.state.triad}</div>
        `);
    }

    openChamberWindow() {
        this.createWindow("Chamber Status", `
            <div><b>Fog Density:</b> ${this.chamber.scene.fog?.density.toFixed(3)}</div>
            <div><b>Portal Color:</b> ${this.chamber.portal.material.color.getStyle()}</div>
        `);
    }

    openInfoWindow() {
        this.createWindow("InfoEngine", `
            <div>Diagnostics panel is running.</div>
            <div>FPS updates live.</div>
        `);
    }

    openAcademyWindow() {
        this.createWindow("RPG Curriculum", `
            <div><b>Lessons:</b></div>
            <ul>
                ${this.curriculum.lessons.map(l => `<li>${l.title} (+${l.xp} XP)</li>`).join("")}
            </ul>

            <div><b>Quests:</b></div>
            <ul>
                ${this.curriculum.quests.map(q => `<li>${q.name} ${q.completed ? "(✔)" : ""}</li>`).join("")}
            </ul>

            <div><b>Skills:</b></div>
            <ul>
                ${this.curriculum.skills.map(s => `<li>${s.name}: ${s.level}/${s.max}</li>`).join("")}
            </ul>
        `);
    }

    openChallengeWindow() {
        this.createWindow("Challenge System", `
            <div><b>Daily Challenge:</b></div>
            <div>${this.challenges.dailyChallenge?.name || "Loading..."}</div>
            <div style="margin-bottom:10px;">${this.challenges.dailyChallenge?.description || ""}</div>

            <div><b>All Challenges:</b></div>
            <ul>
                ${this.challenges.challenges.map(c => `
                    <li>${c.name} ${c.completed ? "(✔)" : ""}</li>
                `).join("")}
            </ul>
        `);
    }

    openHUDWindow() {
        this.createWindow("Operator HUD", `
            <div><b>HUD Type:</b> Floating Aura Ring</div>
            <div><b>Archetype Color Sync:</b> Enabled</div>
            <div><b>Ritual Pulse:</b> Active</div>
            <div><b>Glyph Rotation:</b> Active</div>
        `);
    }

    update(dt) {
        // Future OS animations go here
    }
}
