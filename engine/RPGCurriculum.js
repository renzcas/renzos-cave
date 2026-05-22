// engine/RPGCurriculum.js — Academy, Quests, Skill Trees, Codex, Bestiary
export class RPGCurriculum {
    constructor({ dynasty, symbolic }) {
        this.dynasty = dynasty;
        this.symbolic = symbolic;

        this.lessons = this.generateLessons();
        this.quests = this.generateQuests();
        this.skills = this.generateSkillTree();
        this.codex = this.generateCodex();
        this.bestiary = this.generateBestiary();

        this.t = 0;
    }

    // --------------------------
    // Lessons
    // --------------------------
    generateLessons() {
        return [
            { id: 1, title: "Foundations of the Cave", xp: 2 },
            { id: 2, title: "Operator Identity & Rituals", xp: 3 },
            { id: 3, title: "Symbolic Cognition Basics", xp: 4 },
            { id: 4, title: "Chamber Geometry & Fog", xp: 5 },
            { id: 5, title: "Archetypes & Hexagrams", xp: 6 }
        ];
    }

    // --------------------------
    // Quests
    // --------------------------
    generateQuests() {
        return [
            {
                id: "Q1",
                name: "Ignite the Portal",
                requirement: () => this.symbolic.state.archetype === "Phoenix",
                reward: 5
            },
            {
                id: "Q2",
                name: "Calm the Fog",
                requirement: () => this.symbolic.state.trigram === "Earth",
                reward: 4
            },
            {
                id: "Q3",
                name: "Awaken the Dynasty",
                requirement: () => this.dynasty.current.level >= 3,
                reward: 6
            }
        ];
    }

    // --------------------------
    // Skill Tree
    // --------------------------
    generateSkillTree() {
        return [
            { name: "Awareness", level: 0, max: 3 },
            { name: "Focus", level: 0, max: 3 },
            { name: "Resonance", level: 0, max: 3 },
            { name: "Insight", level: 0, max: 3 }
        ];
    }

    levelSkill(skillName) {
        const skill = this.skills.find(s => s.name === skillName);
        if (!skill) return;

        if (skill.level < skill.max) {
            skill.level++;
            this.dynasty.gainXP(1);
        }
    }

    // --------------------------
    // Codex
    // --------------------------
    generateCodex() {
        return {
            "Archetypes": "Dragon, Tiger, Serpent, Phoenix, Bear.",
            "Hexagrams": "Creative, Receptive, Difficulty, Waiting, Conflict, Army.",
            "Trigrams": "Heaven, Earth, Thunder, Water, Mountain, Wind, Fire, Lake.",
            "Triads": "Mind, Body, Spirit."
        };
    }

    // --------------------------
    // Bestiary
    // --------------------------
    generateBestiary() {
        return [
            { name: "Glyph Serpent", description: "A creature of shifting symbols." },
            { name: "Thunder Tiger", description: "A beast of raw trigram force." },
            { name: "Fog Bear", description: "A guardian of the Chamber mist." },
            { name: "Phoenix Wisp", description: "A spark of rebirth energy." }
        ];
    }

    // --------------------------
    // Update Loop
    // --------------------------
    update(dt) {
        this.t += dt;

        // Auto-complete quests when conditions are met
        this.quests.forEach(q => {
            if (!q.completed && q.requirement()) {
                q.completed = true;
                this.dynasty.gainXP(q.reward);
            }
        });
    }
}
