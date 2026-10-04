export class NeuralInterface {
  constructor(organism) {
    this.organism = organism;
  }

  processCreatureState(state) {
    return this.organism.attend(state);
  }

  generateBehavior(signals) {
    return this.organism.decide(signals);
  }
}
