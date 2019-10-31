const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 45

module.exports = class GoalkeeperSides extends RulePlays {
    setup () {
      super.setup()
      let crossbar = () => {
        let ballY = this.frame.cleanData.ball.y
        let side = ballY/Math.abs(ballY)
        return {x: -685, y: side * 160}
      }

      let ball = () => {
          let ball = {x: this.frame.cleanData.x, y: this.frame.cleanData.ball.y}
          return ball
      }

      this.addIntetion(new LineIntention('KeepGoalLine', {
        target: {x: -685, y: 0},
        theta: Vector.direction("up"),
        lineSize: 1700,
        lineDist: 260,
        decay: TensorMath.new.finish,
        multiplier: BASE_SPEED
      }))

      this.addIntetion(new PointIntention('followCrossBall', {
        target: crossbar,
        radius: 150,
        radiusMax: false,
        decay: TensorMath.new.finish,
        multiplier: BASE_SPEED
      }))

      this.addIntetion(new LookAtIntention('LookAtBall', {
          target: ball,
          decay: TensorMath.new.constant(1).finish,
          multiplier: 85
        }))

    }
    loop () {}
}
