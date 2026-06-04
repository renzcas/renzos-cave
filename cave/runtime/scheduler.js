export const scheduler = {
  tick: 0,

  step() {
    this.tick++;
  },

  getState() {
    return { tick: this.tick };
  }
};
