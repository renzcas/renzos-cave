// adaptive-opcode-governor.js (ESM)
export class AdaptiveOpcodeGovernor {
    constructor() {
        this.baseCost = {
            NOP: 1, MOV: 2, LOAD: 3, STORE: 3,
            ADD: 4, SUB: 4, XOR: 4, AND: 4, OR: 4,
            MUL: 8, DIV: 10, MOD: 10,
            CMP: 3, JMP: 5, CALL: 6, RET: 6,
            ERASE: 12
        };

        this.dynamicCost = { ...this.baseCost };
    }

    update({ freeEnergy, tensor, entropyFlow, predictionError }) {
        const stress = Math.tanh(freeEnergy / 100);
        const chaos = tensor.getVector().K / 100;
        const spike = tensor.getDerivatives().E;

        for (const op in this.baseCost) {
            let cost = this.baseCost[op];

            cost *= (1 + stress);

            if (["JMP", "CALL", "RET"].includes(op)) {
                cost *= (1 + entropyFlow * 0.05);
            }

            if (chaos > 0.5 && ["MUL", "DIV", "MOD"].includes(op)) {
                cost *= (1 + chaos);
            }

            if (predictionError > 10 && op === "JMP") {
                cost *= 1.5;
            }

            if (spike > 20) {
                cost *= 1.3;
            }

            if (["ADD", "XOR", "CMP"].includes(op)) {
                cost *= (1 - 0.2 * (1 - stress));
            }

            this.dynamicCost[op] = Math.max(1, Math.round(cost));
        }

        return this.dynamicCost;
    }
}
