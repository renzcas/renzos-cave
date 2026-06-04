// metabolic-scheduler.js (ESM)
export class MetabolicScheduler {
    constructor() {
        this.taskQueue = [];
        this.loopRate = 1.0;
    }

    addTask(task) {
        this.taskQueue.push(task);
    }

    update({ freeEnergy, tensor, control }) {
        if (this.taskQueue.length === 0) return null;

        const task = this.taskQueue.shift();
        return task;
    }
}
