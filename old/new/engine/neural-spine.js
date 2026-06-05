// neural-spine.js (ESM)
export class NeuralSpine {
    constructor() {
        this.listeners = {};
    }

    on(signal, callback) {
        if (!this.listeners[signal]) {
            this.listeners[signal] = [];
        }
        this.listeners[signal].push(callback);
    }

    emit(signal, payload) {
        const list = this.listeners[signal];
        if (!list) return;
        for (const cb of list) cb(payload);
    }

    reflex(signal, payload) {
        const list = this.listeners[signal];
        if (!list) return;
        for (const cb of list) cb(payload, { reflex: true });
    }
}
