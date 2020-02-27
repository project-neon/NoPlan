const TensorMath = require('../../lib/TensorMath')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')
const LookAtIntention = require('../../Intention/LookAtIntention')

const BASE_SPEED = 40
const MAX_SPEED = 80

const GOAL_LINE = -670

module.exports = class GoalkeeperSides2 extends RulePlays {
    setup(){
        super.setup()
        let ball = () => {
          let ball = {x: this.frame.cleanData.ball.x, y: this.frame.cleanData.ball.y}
          return ball
      }
        let crossbar = () => {
            let ballY = this.frame.cleanData.ball.y
            let side = ballY/Math.abs(ballY)
            return {x: GOAL_LINE - 15, y: side * 160}
          }

        // Fixar goleiro na linha do gol
        this.addIntetion(new LineIntention('KeepGoalLine', {
            target: {x: GOAL_LINE, y: 0},
            theta: Vector.direction("up"),
            lineSize: 1700,
            lineDist: 260,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED * 1.6
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
          decay: TensorMath.new.pow(1/2).finish,
          multiplier: 320
        }))
      }

      loop(){
      }
}
