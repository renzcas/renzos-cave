// free-energy-organ.js (ESM)
export class FreeEnergyOrgan {
    constructor() {
        this.F = 100;
        this.stress = 0;
        this.efficiency = 1;
    }

    update({ energyCost, entropyFlow, predictionError, tensor }) {
        this.F -= energyCost * 0.1;
        this.F -= entropyFlow * 0.05;
        this.F -= predictionError * 0.02;

        this.F = Math.max(0, Math.min(100, this.F));

        this.stress = 1 - (this.F / 100);
        this.efficiency = 1 / (1 + entropyFlow);

        return {
            stress: this.stress,
            efficiency: this.efficiency,
            predictedSpike: tensor.getDerivatives().E > 10
        };
    }
}
