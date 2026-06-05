// complexity-tensor-organ.js (ESM)
export class ComplexityTensorOrgan {
    constructor() {
        this.vector = {
            T: 0, // time
            S: 0, // space
            I: 0, // IO
            E: 0, // energy
            K: 0  // algorithmic complexity
        };

        this.last = { ...this.vector };
        this.derivatives = { T: 0, S: 0, I: 0, E: 0, K: 0 };
    }

    update({ timeSteps, spaceBytes, ioBytes, energyCost, algoComplexity }) {
        this.vector = {
            T: timeSteps,
            S: spaceBytes,
            I: ioBytes,
            E: energyCost,
            K: algoComplexity
        };

        this.derivatives = {
            T: this.vector.T - this.last.T,
            S: this.vector.S - this.last.S,
            I: this.vector.I - this.last.I,
            E: this.vector.E - this.last.E,
            K: this.vector.K - this.last.K
        };

        this.last = { ...this.vector };
    }

    getVector() {
        return this.vector;
    }

    getDerivatives() {
        return this.derivatives;
    }
}
