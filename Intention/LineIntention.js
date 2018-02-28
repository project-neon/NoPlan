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

module.exports = class LineIntention extends Intention{
  constructor(name, params) {
    super(name, params)

    // Asserting that the parameters exist
    assert(params)
    this.params = params

    // Target has to exist
    assert.notEqual(this.params.target, null)
    this.target = this.params.target

    // Theta has to exist
    assert.notEqual(this.params.theta, null)
    this.theta = this.params.theta

    // Decay has to exist
    assert.notEqual(this.params.decay, null)
    this.decay = this.params.decay
    
    // Linesize has to exist
    assert.notEqual(this.params.lineSize, null)
    this.lineSize = this.params.lineSize
    
    // LineDist has to exist    
    assert.notEqual(this.params.lineDist, null)
    this.lineDist = this.params.lineDist
    
    this.lineDistMax = this.params.lineDistMax || false

    // Use this to make the line work on only one size
    this.lineSizeSingleSide = this.params.lineSizeSingleSide || false
    this.lineDistSingleSide = this.params.lineDistSingleSide || false

    // If multiplier is not declared it is 1
    this.multiplier = this.params.multiplier || 1
  }

  getIntentionInfo() {
    return {
      'type': LineIntention.name,
      'name': this.name,
      'params': JSON.parse(JSON.stringify(util.mapDict(this.params, x => util.callOrReturn(x))))
    }
  }

  compute({x, y, theta}) {
    // Instanciate target values
    let targetLine = util.callOrReturn(this.target)
    let targetTheta = util.callOrReturn(this.theta)
    let lineDistMax = util.callOrReturn(this.lineDistMax)
    
    // Create vectors
    let toLine = Vector.sub({x, y}, targetLine)
    let toLineScalar = Vector.size(toLine)
    let toLineWithTheta = Vector.rotate(toLine, -targetTheta)

    // Position at line: toLineWithTheta.y
    // Distance from line: toLineWithTheta.x
   
    // Normalizing vector
    let toLineNorm = Vector.norm(Vector.rotate({y: toLineWithTheta.y, x: 0}, targetTheta))

    // Normalized Scalar
    let toLineScalarNorm = Math.max(0, Math.min(1, (Math.abs(toLineWithTheta.y) / this.lineDist)))
    //console.log(toLineNorm, toLineScalarNorm, )

    // Apply decay function to normalized distance from the beginning to the end of the field
    let force = util.applyReflectedDecay(this.decay, toLineScalarNorm)


    // Output 0 if outside line segment
    if (this.lineSize && Math.abs(toLineWithTheta.x) > this.lineSize) {
      // console.log('Outside line segment')
      return {vx: 0, vy: 0, vtheta: 0}
    }

    // Output 0 if on the other side of the line and single side is active
    if (this.lineSizeSingleSide && toLineWithTheta.x < 0) {
      // console.log('On other side of line size')
      return {vx: 0, vy: 0, vtheta: 0}
    }

    // Output 0 if outside maximum distance
    if (lineDistMax && Math.abs(toLineWithTheta.y) > lineDistMax) {
      // console.log('Outside maximum distance')
      return {vx: 0, vy: 0, vtheta: 0}
    }

    // Output 0 if on the other side of the line and single side is active
    if (this.lineDistSingleSide && toLineWithTheta.y < 0) {
      // console.log('on other side of line dist')
      return {vx: 0, vy: 0, vtheta: 0}
    }

    return {
      // Returning result vector times the multiplier as output. 
      vx: toLineNorm.x * force * this.multiplier,
      vy: toLineNorm.y * force * this.multiplier,
      vtheta: 0
    }
  }
}