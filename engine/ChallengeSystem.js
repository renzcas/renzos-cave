// engine/ChallengeSystem.js — Daily Trials, XP Rewards, Symbolic Integration
export class ChallengeSystem {
    constructor({ dynasty, symbolic, curriculum }) {
        this.dynasty = dynasty;
        this.symbolic = symbolic;
        this.curriculum = curriculum;

        this.active = null;
        this.cooldown = 0;

        this.challenges = [
            {
                name: "Shadow Walk",
                desc: "Move through the cave with awareness. Observe 3 symbolic shifts.",
                xp: 25,
                condition: () => this.symbolic.state.hexagram !== "—"
            },
            {
                name: "Operator Breath",
                desc: "Hold steady focus for 10 seconds.",
                xp: 15,
                condition: () => this.dynasty.current.aura > 1.2
            },
            {
                name: "Forge Spark",
                desc: "Trigger a curriculum lesson.",
                xp: 40,
                condition: () => this.curriculum.completedLessons > 0
            }
        ];
    }

    // Pick a random challenge
    rollChallenge() {
        const idx = Math.floor(Math.random() * this.challenges.length);
        this.active = this.challenges[idx];
        this.cooldown = 10; // seconds before next roll
    }

    update(dt) {
        if (this.cooldown > 0) {
            this.cooldown -= dt;
            return;
        }

        // If no active challenge, roll one
        if (!this.active) {
            this.rollChallenge();
            return;
        }

        // Check if completed
        if (this.active.condition()) {
            this.completeChallenge(this.active);
            this.active = null;
            this.cooldown = 5;
        }
    }

    completeChallenge(ch) {
        this.dynasty.addXP(ch.xp);

        console.log(
            `%c✔ Challenge Complete: ${ch.name} (+${ch.xp} XP)`,
            "color:#00ff99;font-weight:bold;"
        );
    }
}
