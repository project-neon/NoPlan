const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const OrbitalIntention = require('../../Intention/OrbitalIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 65

module.exports = class AttackerSides extends RulePlays {

  setup () {
    super.setup()

    let ball = () => {
      let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
      return ball
    }

    this.addIntetion(new PointIntention('goBallSides', {
      target: ball,
      radius: 150,
      decay: TensorMath.new.constant(1).deadWidth(0.15).finish,
      multiplier: 60
    }))

    this.addIntetion(new LineIntention('avoidHitSide', {
      target: {x: 0, y: -655},
      theta: Vector.direction("right"),
      lineSize: 2000, // Largura do segmento de reta
      lineDist: 100, // Tamanho da repelência
      lineDistMax:100,
      lineDistSingleSide: true,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 30
    }))

    this.addIntetion(new LineIntention('avoidHitSide', {
      target: {x: 0, y: 655},
      theta: Vector.direction("left"),
      lineSize: 2000, // Largura do segmento de reta
      lineDist: 100, // Tamanho da repelência
      lineDistMax:100,
      lineDistSingleSide: true,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 30
    }))
  }

  loop () {}

}
