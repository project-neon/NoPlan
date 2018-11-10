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

module.exports = class PointIntention extends Intention{
  constructor(name, params) {
    super(name, params)

    // Asserting that the parameters exist
    assert(params)
    this.params = params

    // Target has to be exist
    assert.notEqual(this.params.target, null)
    this.target = this.params.target

    // Decay has to be exist
    assert.notEqual(this.params.decay, null)
    this.decay = this.params.decay

    // Radius has to be exist
    assert.notEqual(this.params.radius , null)
    this.radius = this.params.radius || this.radiusMax

    // Is there a maximum radius?
    this.radiusMax = this.params.radiusMax || false

    // If multiplier is not declared it is 1
    this.multiplier = this.params.multiplier || 1
  }

  getIntentionInfo() {
    return {
      'type': PointIntention.name,
      'name': this.name,
      'params': JSON.parse(JSON.stringify(util.mapDict(this.params, x => util.callOrReturn(x))))// util.mapDict(this.params , function(v, k, o) { return util.callOrReturn(v)})
    }
  }

  compute({x, y, theta}) {
    // Instaciate target values
    let targetGoto = util.callOrReturn(this.target)
    let radiusMax = util.callOrReturn(this.radiusMax)
    let multiplier = util.callOrReturn(this.multiplier)

    // Create Vectors
    let toTarget = Vector.sub(targetGoto, {x, y})
    let toTargetScalar = Vector.size(toTarget)

    // Out of max radius ? output is 0 
    if (radiusMax && toTargetScalar > radiusMax) {
      // console.log('Outside radius')
      return {vx: 0, vy: 0, vtheta: 0}
    }

    // Normalized Vector
    let toTargetNorm = Vector.norm(toTarget)
    
    // Normalized Scalar
    let toTargetScalarNorm = Math.max(0, Math.min(1, toTargetScalar / (this.radius)))

    // Apply decay to normalized scalar distance
    let force = util.applyReflectedDecay(this.decay, toTargetScalarNorm)

    // console.log("Name: ",this.name, force)
    return {
      // Returning result vector times the multiplier as output
      vx: -1 * toTargetNorm.x * force * multiplier,
      vy: -1 * toTargetNorm.y * force * multiplier,
      vtheta: 0
    }
  }
}