const Vector = require('../lib/Vector')

let fail = 0
const MAX_ANGULAR = Vector.toRadians(999)

module.exports = class BasePlayer {
  constructor (id, match, options) {
    this.id = id
    this.match = match
    this.options = options
    this.state = {id: id, class: this.name}
    this.ball = {x:0,y:0}
    this.linear = 0
    this.angular = 0
    
    this.position = {x : -600, y : 400}
    this.orientation = 2

    if (options.predict) {
      console.log('Enabled prediction for', id)
      setInterval(() => {
        // Skip if no frame has arrived yet
        if (!this.position.x)
          return;

        this.simulate()
        this.update()
      }, 5)
    }
  }

  toObject () {
    return this.state
  }

  get visionId() {
    return this.options.visionId
  }

  get radioId() {
    return this.options.radioId
  }

  // Update robot state (linear and angular) targets
  async send(_state, _linear, _angular) {

    _angular = _angular > MAX_ANGULAR ? MAX_ANGULAR : _angular
    _angular = _angular < -MAX_ANGULAR ? -MAX_ANGULAR : _angular
    
    if (_state == 1) {
      this.linear = _linear
      this.angular = _angular
    } else {
      this.linear = 0
      this.angular = 0
    }
      _angular = Vector.toDegrees(_angular)
      _linear = _linear/10

      console.log(this.radioId, _state, _linear, _angular)
      return this.radioId, _state, _linear, _angular

  }

  // isActive() {
  //   if (!this.frame) {
  //     return false
  //   }
  //   // frame_number: 308954,
  //   // t_capture: 33517.520055,
  //   // t_sent: 1513650099.136511,
  //   // camera_id: 1,
  //   let delta = Date.now() / 1000 - this.frame.t_sent
  //   console.log(this.id, 'delta:', this.detection)

  //   return Math.abs(delta) < 4
  // }

  simulate(dt) {
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

    let deltaPos = Vector.mult(Vector.fromTheta(this.orientation), dt * this.linear)
    let deltaTheta = this.angular * dt
    
    if (deltaTheta) {
      this.orientation = this.orientation - deltaTheta
      // console.log(this.orientation.toFixed(2))
    }

    if (deltaPos)
      this.position = Vector.sum(this.position, deltaPos)
    // console.log('delta: ', Math.round(Vector.toDegrees(deltaTheta)))
  }
}