const util = require('./util')
const Intention = require('./')
const assert = require('assert')
const Vector = require('../lib/Vector')

module.exports = class LineIntention extends Intention {
  constructor (name, params) {
    super(name, params)

    assert(params)
    this.params = params

    assert.notEqual(this.params.target, null)
    this.target = this.params.target

    assert.notEqual(this.params.theta, null)
    this.theta = this.params.theta

    assert.notEqual(this.params.decay, null)
    this.decay = this.params.decay

    assert.notEqual(this.params.lineSize, null)
    this.lineSize = this.params.lineSize

    assert.notEqual(this.params.lineDist, null)
    this.lineDist = this.params.lineDist

    this.lineDistMax = this.params.lineDistMax || false

    // Use this to make the line work on only one size
    this.lineSizeSingleSide = this.params.lineSizeSingleSide || false
    this.lineDistSingleSide = this.params.lineDistSingleSide || false

    // If multiplier is not declared it is 1
    this.multiplier = this.params.multiplier || 1
  }

  compute ({x, y}) {
    // Instanciate target values
    let targetLine = util.callOrReturn(this.target)
    let targetTheta = util.callOrReturn(this.theta)
    let lineDistMax = util.callOrReturn(this.lineDistMax)
    let multiplier = util.callOrReturn(this.multiplier)

    // Create vectors
    let toLine = Vector.sub({x, y}, targetLine)
    let toLineWithTheta = Vector.rotate(toLine, -targetTheta)

    // Output 0 if outside line segment
    if (this.lineSize && Math.abs(toLineWithTheta.x) > this.lineSize) return {vx: 0, vy: 0, vtheta: 0}

    // Output 0 if on the other side of the line and single side is active
    if (this.lineSizeSingleSide && toLineWithTheta.x < 0) return {vx: 0, vy: 0, vtheta: 0}

    // Output 0 if outside maximum distance
    if (lineDistMax && Math.abs(toLineWithTheta.y) > lineDistMax) return {vx: 0, vy: 0, vtheta: 0}

    // Output 0 if on the other side of the line and single side is active
    if (this.lineDistSingleSide && toLineWithTheta.y < 0) return {vx: 0, vy: 0, vtheta: 0}

    // Normalizing vector
    let toLineNorm = Vector.norm(Vector.rotate({y: toLineWithTheta.y, x: 0}, targetTheta))

    // Normalized Scalar
    let toLineScalarNorm = Math.max(0, Math.min(1, (Math.abs(toLineWithTheta.y) / this.lineDist)))

    // Apply decay function to normalized distance from the beginning to the end of the field
    let force = util.applyReflectedDecay(this.decay, toLineScalarNorm)

    return {
      // Returning result vector times the multiplier as output.
      vx: toLineNorm.x * force * multiplier,
      vy: toLineNorm.y * force * multiplier,
      vtheta: 0
    }
  }
}
