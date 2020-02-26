const Vector = require('../lib/Vector')

module.exports = class BasePlayer {
  // TODO Renomear/Reestruturar necessidade de passar id
  constructor (id, match, options) {
    this.id = id
    this.match = match
    this.options = options
    this.state = {id: id, class: this.name}
    this.ball = {x: 0, y: 0}
    this.linear = 0
    this.angular = 0
    this.position = {x: 0, y: 0}
    this.orientation = 0
  }

  get visionId () {
    return this.options.visionId
  }

  get radioId () {
    return this.options.radioId
  }

  setRobot (robot) {
    this.options = robot
  }

  async send (_state, _linear, _angular) {
    if (_state === 1) {
      this.linear = _linear
      this.angular = _angular
    } else {
      this.linear = 0
      this.angular = 0
    }
  }

  simulate (dt) {
    // Compute dt if not assigned
    if (!dt) {
      let now = Date.now()
      dt = (now - this.lastTime) / 1000
      this.lastTime = now
    }
    if (dt > 0.05) {
      console.error('Dt weird:', dt)
      return
    }
    let deltaPos = Vector.mult(Vector.fromTheta(this.orientation), dt * -this.linear)
    let deltaTheta = this.angular * dt
    if (deltaTheta) {
      this.orientation = this.orientation - deltaTheta * Math.PI / 180
    }
    if (deltaPos) this.position = Vector.sum(this.position, deltaPos)
  }
}
