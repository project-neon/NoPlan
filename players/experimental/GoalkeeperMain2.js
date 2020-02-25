const TensorMath = require('../../lib/TensorMath')
const LineIntention = require('../../Intention/LineIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 40
const MAX_SPEED = 80

const GOAL_LINE = -670

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
            multiplier: BASE_SPEED * 1.6
        }))

        //Mantem o goleiro fixado na bola, seguindo eixo Y
        this.addIntetion(new LineIntention('KeepOnBall', {
            target: ball,
            theta: Vector.direction("left"),
            lineSize: 1700,
            lineDist: 250,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED * 1.4
        }))

        /*
        Correção na função para o goleiro ter mais velocidade
        em casos de bola muito proxima do eixo Y
        */
        this.addIntetion(new LineIntention('KeepOnBall', {
            target: ball,
            theta: Vector.direction("left"),
            lineSize: 400,
            lineDist: 150,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED * 1.4
        }))

        this.addIntetion(new LookAtIntention('LookAtBall', {
            target: ball,
            decay: TensorMath.new.pow(1/2).finish,
            multiplier: 680
        }))
      }

      loop(){
      }
}
