export class InfoPhyzxOrgan {
  state: any

  constructor() {
    this.state = {
      energy: 0,
      entropy: 0,
      field: {},
      updated: Date.now()
    }
  }

  update(dt: number) {
    this.state.energy += dt * 0.1
    this.state.entropy += dt * 0.05
    this.state.updated = Date.now()
  }

  getState() {
    return this.state
  }
}
