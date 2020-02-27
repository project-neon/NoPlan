const TensorMath = require('../../lib/TensorMath')
const LineIntention = require('../../Intention/LineIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 60
const MAX_SPEED = 80

const GOAL_LINE = -650

module.exports = class GoalkeeperMain2 extends RulePlays {
    setup(){
        super.setup()
        let ball = () => {
            let ball = {
                x: this.frame.cleanData.ball.x,
                y: Math.max(Math.min(this.frame.cleanData.ball.y, 200), -200)
            }
            return ball
        }

        // Fixar goleiro na linha do gol
        this.addIntetion(new LineIntention('KeepGoalLine', {
            target: {x: GOAL_LINE, y: 0},
            theta: Vector.direction("up"),
            lineSize: 1700,
            lineDist: 260,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
        }))

        //Mantem o goleiro fixado na bola, seguindo eixo Y
        this.addIntetion(new LineIntention('KeepOnBall', {
            target: ball,
            theta: Vector.direction("left"),
            lineSize: 1700,
            lineDist: 160,
            decay: TensorMath.new.magic().finish,
            multiplier: BASE_SPEED
        }))


      }

      loop(){
      }
}
