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

    assert.notEqual(this.params.decay, null)
    this.decay = this.params.decay
    
    this.lineSize = this.params.lineSize

    this.multiplier = this.params.multiplier || 1
  }

  compute({x, y, theta}) {

    let targetLine = util.callOrReturn(this.target)

    let toLine = Vector.sub({x, y}, position)
    let toLineScalar = Vector.size(toLine)

    let toLineWTheta = Vector.rotate(toLine, -this.params.theta)

    //   Posição na reta: relToPoint.x
    // Distancia da reta: relToPoint.y

    // Output 0 if outside line segment
    if (this.params.lineSize && Math.abs(relToPoint.x) > this.params.lineSize) {
      return {vx: 0, vy: 0, vtheta: 0, info:'outside'}
    }

    let distanceToLine = relToPoint.y
    let force = this.params.decay(distanceToLine)
    

    let toLineNorm = Vector.norm(Vector.mult(Vector.fromTheta(this.params.theta), force))


    let force = util.applyReflectedDecay(this.decay, toLineScalarNorm)

    return {
      vx: output.x,
      vy: output.y, 
      vtheta: 0
    }
  }
}