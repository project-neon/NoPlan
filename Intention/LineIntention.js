const util = require('./util')
const Intention = require('./')
const assert = require('assert')
const Vector = require('../lib/Vector')

module.exports = class LineIntention extends Intention{
  constructor(name, params) {
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


    this.lineDistMax = this.params.lineDistMax || false
    
    this.lineSizeSingleSide = this.params.lineSizeSingleSide || false
    this.lineDistSingleSide = this.params.lineDistSingleSide || false

    assert.notEqual(this.params.lineDist || this.lineDistMax, null)
    this.lineDist = this.params.lineDist || this.lineDistMax

    this.multiplier = this.params.multiplier || 1
  }

  compute({x, y, theta}) {

    let targetLine = util.callOrReturn(this.target)
    let targetTheta = util.callOrReturn(this.theta)
    let lineDistMax = util.callOrReturn(this.lineDistMax)

    let toLine = Vector.sub({x, y}, targetLine)
    let toLineScalar = Vector.size(toLine)

    let toLineWithTheta = Vector.rotate(toLine, -targetTheta)


    //   Posição na reta: toLineWithTheta.y
    // Distancia da reta: toLineWithTheta.x

    // Output 0 if outside line segment
    if (this.lineSize && Math.abs(toLineWithTheta.x) > this.lineSize) {
      // console.log('outside line segment')
      return {vx: 0, vy: 0, vtheta: 0}
    }

    if (this.lineSizeSingleSide && toLineWithTheta.x < 0) {
      // console.log('on other side of line size')
      return {vx: 0, vy: 0, vtheta: 0}
    }

    // Output 0 if outside range
    if (lineDistMax && Math.abs(toLineWithTheta.y) > lineDistMax) {
      // console.log('outside maximum distance')
      return {vx: 0, vy: 0, vtheta: 0}
    }

    if (this.lineDistSingleSide && toLineWithTheta.y < 0) {
      // console.log('on other side of line dist')
      return {vx: 0, vy: 0, vtheta: 0}
    }

    let toLineNorm = Vector.norm(Vector.rotate({y: toLineWithTheta.y, x: 0}, targetTheta))//Vector.norm(toLine)
    let toLineScalarNorm = Math.max(0, Math.min(1, (Math.abs(toLineWithTheta.y) / this.lineDist)))

    let force = util.applyReflectedDecay(this.decay, toLineScalarNorm)

    console.log(force, toLineScalarNorm, toLineNorm)
    
    return {
      vx: toLineNorm.x * force * this.multiplier,
      vy: toLineNorm.y * force * this.multiplier,
      vtheta: 0
    }
  }
}