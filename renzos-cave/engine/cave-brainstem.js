// cave-brainstem.js (ESM)
export class CaveBrainstem {
    constructor({ spine, tensor, freeEnergy, scheduler, opcodeGovernor }) {
        this.spine = spine;
        this.tensor = tensor;
        this.freeEnergy = freeEnergy;
        this.scheduler = scheduler;
        this.opcodeGovernor = opcodeGovernor;

        this.globalMode = "normal";

        this.registerListeners();
    }

    registerListeners() {
        this.spine.on("stress", (level) => {
            if (level > 0.8) this.globalMode = "conserving";
            else if (level > 0.5) this.globalMode = "stressed";
            else this.globalMode = "normal";
        });

        this.spine.on("chaos-rise", (chaos) => {
            if (chaos > 0.7) this.globalMode = "chaotic";
        });

        this.spine.on("memory-pressure", (pressure) => {
            if (pressure > 0.75) this.globalMode = "conserving";
        });
    }

    update() {
        switch (this.globalMode) {
            case "normal":
                this.scheduler.loopRate = 1.0;
                break;

            case "stressed":
                this.scheduler.loopRate = 0.8;
                break;

            case "chaotic":
                this.scheduler.loopRate = 0.6;
                this.spine.emit("request-compression", { intensity: 1.0 });
                break;

            case "conserving":
                this.scheduler.loopRate = 0.4;
                this.spine.emit("request-gc", { urgency: 1.0 });
                break;
        }
    }
}
