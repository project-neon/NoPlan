const Vector = require('../lib/Vector')

const Intention = require('./')

module.exports = class LineIntention extends Intention{
  constructor(name, params) {
    super(name, params)

    this.params = params
  }

  compute({x, y, theta}) {

    let position = typeof this.params.pos === "function" ? this.params.pos(): this.params.pos

    let distToPoint = Vector.sub({x, y}, position)
    let relToPoint = Vector.rotate(distToPoint, -this.params.theta)

    //   Posição na reta: relToPoint.x
    // Distancia da reta: relToPoint.y

    // Output 0 if outside line segment
    if (this.params.lineSize && Math.abs(relToPoint.x) > this.params.lineSize) {
      return {vx: 0, vy: 0, vtheta: 0, info:'outside'}
    }

    let distanceToLine = relToPoint.y
    let force = this.params.decay(distanceToLine)
    let output = Vector.mult(Vector.fromTheta(this.params.theta), force)

    return {vx: output.x, vy: output.y, vtheta: 0}
  }
}