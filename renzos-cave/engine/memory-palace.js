// memory-palace.js (ESM)
export class MemoryPalace {
    constructor() {
        this.rooms = new Map();
    }

    store(room, data) {
        this.rooms.set(room, {
            timestamp: performance.now(),
            ...data
        });
    }

    recall(room) {
        return this.rooms.get(room) || null;
    }

    listRooms() {
        return [...this.rooms.keys()];
    }
}
