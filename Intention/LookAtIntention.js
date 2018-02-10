/******************************************
 *            Project Neon 2017           *
 ******************************************

To see more of the documentation visit: 

https://github.com/Project-Neon/NoPlan/blob/master/Intention/README.md

*/
const util = require('./util')
const Intention = require('./')
const assert = require('assert')
const Vector = require('../lib/Vector')

module.exports = class LookAtIntention extends Intention{
  constructor(name, params) {
    super(name, params)

    // Asserting that the params exist    
    assert(params)
    this.params = params

    // Either target or theta has to be declared
    assert.notEqual(this.params.theta || this.params.target, null)
    this.theta = this.params.theta
    this.target = this.params.target

    // Decay has to be declared
    assert.notEqual(this.params.decay, null)
    this.decay = this.params.decay

    // If multiplier is not declared it is 1
    this.multiplier = this.params.multiplier || 1
  }

  getIntentionInfo() {
    return {
      'type': LookAtIntention.name,
      'name': this.name,
      'params': JSON.parse(JSON.stringify(util.mapDict(this.params, x => util.callOrReturn(x))))// util.mapDict(this.params , function(v, k, o) { return util.callOrReturn(v)})
    }
  }

  compute({x, y, theta}) {
    // Instaciate theta values
    let absRobotAngle = theta
    let absTargetAngle = util.callOrReturn(this.theta)

    // If no theta was used but target was:
    if (absTargetAngle == null) {
      let targetLookAt = util.callOrReturn(this.target)
      absTargetAngle = Vector.angle(Vector.sub(targetLookAt, {x,y}))
    }
    
    // The difference between angles.
    let deltaAngle = Vector.normalRelativeAngle(absRobotAngle - absTargetAngle)

    // Allow any side to look
    if (Math.abs(deltaAngle) > Math.PI / 2) {
      deltaAngle = -Vector.normalRelativeAngle(Math.PI - deltaAngle)
    }

    // Normalize delta angle
    let deltaAngleNorm = deltaAngle / Math.PI

    // Apply decay on normalized angle
    let vtheta = util.applyReflectedDecay(this.decay, deltaAngleNorm)

    return {
      // Returning result as the vtheta times multiplier
      vx: 0,
      vy: 0,
      vtheta: vtheta * this.multiplier
    }
  }
}