const assert = require('assert')

const util = require('./util')
const Intention = require('./')

const Vector = require('../lib/Vector')

module.exports = class LookAtIntention extends Intention{
  constructor(name, params) {
    super(name, params)

    assert(params)
    this.params = params

    assert.notEqual(this.params.theta || this.params.target, null)
    this.theta = this.params.theta
    this.target = this.params.target

    assert.notEqual(this.params.decay, null)
    this.decay = this.params.decay

    this.multiplier = this.params.multiplier || 1
  }

  compute({x, y, theta}) {

    let absRobotAngle = theta
    let absTargetAngle = util.callOrReturn(this.theta)

    if (absTargetAngle == null) {
      let targetLookAt = util.callOrReturn(this.target)
      absTargetAngle = Vector.angle(Vector.sub(targetLookAt, {x,y}))
    }
    
    let deltaAngle = Vector.normalRelativeAngle(absRobotAngle - absTargetAngle)

    // Allow any side to look
    if (Math.abs(deltaAngle) > Math.PI / 2) {
      deltaAngle = -Vector.normalRelativeAngle(Math.PI - deltaAngle)
      // console.log(Vector.toDegrees(deltaAngle).toFixed(2))
    }

    let deltaAngleNorm = deltaAngle / Math.PI

    let vtheta = util.applyReflectedDecay(this.decay, deltaAngleNorm)

    return {
      vx: 0,
      vy: 0,
      vtheta: vtheta * this.multiplier
    }
  }
}