const util = require('./util')
const Intention = require('./')
const assert = require('assert')
const Vector = require('../lib/Vector')

module.exports = class OrbitalIntention extends Intention {
  constructor (name, params) {
    super(name, params)

    // Asserting that the parameters exist
    assert(params)
    this.params = params

    // Target has to exist
    assert.notEqual(this.params.target, null)
    this.target = this.params.target

    assert.notEqual(this.params.clockwise, null)
    this.clockwise = this.params.clockwise

    assert.notEqual(this.params.decay, null)
    this.decay = this.params.decay

    // Radius of the orbitation movement
    assert.notEqual(this.params.radius, null)
    this.radius = this.params.radius

    // Is there a maximum radius?
    this.radiusMax = this.params.radiusMax || false

    // If multiplier is not declared it is 1
    this.multiplier = this.params.multiplier || 1
  }

  compute ({x, y}) {
    // Instanciate target values
    let target = util.callOrReturn(this.target)
    let clockwise = util.callOrReturn(this.clockwise)
    let angleToTarget = Math.atan2(target.y - y, target.x - x)
    let K = 1/200
    let distanceBetweenTarget = Vector.distBetween({x, y}, target)
    let endAngle
    let radiusMax = this.radiusMax

        // Out of max radius ? output is 0
    if (radiusMax && distanceBetweenTarget > radiusMax) return {vx: 0, vy: 0, vtheta: 0}

    if (distanceBetweenTarget > this.radius) {
      endAngle = angleToTarget + clockwise * (Math.PI / 2) * (2 - ((this.radius + K) / (distanceBetweenTarget + K)))
    } else {
      endAngle = angleToTarget + clockwise * (Math.PI / 2) * Math.sqrt(distanceBetweenTarget / this.radius)
    }

    let toTargetScalarNorm = Math.max(0, Math.min(1, distanceBetweenTarget / (this.radius)))
    let finalVector = Vector.norm(Vector.fromTheta(endAngle))

    let force = util.applyReflectedDecay(this.decay, toTargetScalarNorm)

    return {
      // Returning result vector times the multiplier as output.
      vx: finalVector.x * force * this.multiplier,
      vy: finalVector.y * force * this.multiplier,
      vtheta: 0
    }
  }
}
