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
    
    this.position = {x : 0, y : 0}
    this.orientation = 0

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
    
    // try{
      _angular = Vector.toDegrees(_angular)
      _linear = _linear/10
      this.match.driver.send(this.radioId, _state, _linear, _angular)
    // } catch(e){
      // fail++
    // }
  }

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