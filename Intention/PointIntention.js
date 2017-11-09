const assert = require('assert')

const util = require('./util')
const Intention = require('./')

const Vector = require('../lib/Vector')

module.exports = class PointIntention extends Intention{
  constructor(name, params) {
    super(name, params)

    assert(params)
    this.params = params

    assert.notEqual(this.params.target, null)
    this.target = this.params.target

    assert.notEqual(this.params.decay, null)
    this.decay = this.params.decay

    // assert.notEqual(this.params.radiusMax, null)
    this.radiusMax = this.params.radiusMax || false

    assert.notEqual(this.params.radius || this.radiusMax, null)
    this.radius = this.params.radius || this.radiusMax

    this.multiplier = this.params.multiplier || 1
  }

  compute({x, y, theta}) {
    let targetGoto = util.callOrReturn(this.target)
    let radiusMax = util.callOrReturn(this.radiusMax)
    let multiplier = util.callOrReturn(this.multiplier)

    let toTarget = Vector.sub(targetGoto, {x, y})
    let toTargetScalar = Vector.size(toTarget)

    if (radiusMax && toTargetScalar > radiusMax) {
      // console.log('too far', toTargetScalar, radiusMax)
      return {vx: 0, vy: 0, vtheta: 0}
    }

    let toTargetNorm = Vector.norm(toTarget)
    let toTargetScalarNorm = Math.max(0, Math.min(1, toTargetScalar / (this.radius)))

    // Apply decay to normalized scalar distance
    let force = util.applyReflectedDecay(this.decay, toTargetScalarNorm)

    return {
      vx: toTargetNorm.x * force * multiplier,
      vy: toTargetNorm.y * force * multiplier,
      vtheta: 0
    }
  }
}