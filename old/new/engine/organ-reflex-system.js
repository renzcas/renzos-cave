// organ-reflex-system.js (ESM)
export class OrganReflexSystem {
    constructor(spine, scheduler) {
        this.spine = spine;
        this.scheduler = scheduler;

        this.spine.on("stress", (level) => {
            if (level > 0.8) this.energyReflex(level);
        });

        this.spine.on("chaos-rise", (chaos) => {
            if (chaos > 0.7) this.entropyReflex(chaos);
        });

        this.spine.on("memory-pressure", (pressure) => {
            if (pressure > 0.75) this.memoryReflex(pressure);
        });
    }

    energyReflex(level) {
        this.scheduler.loopRate = Math.max(0.1, 1 - level);
    }

    entropyReflex(chaos) {
        this.spine.emit("request-compression", { intensity: chaos });
    }

    memoryReflex(pressure) {
        this.spine.emit("request-gc", { urgency: pressure });
    }
}
