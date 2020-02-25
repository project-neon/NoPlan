const TensorMath = require('../../lib/TensorMath')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const RulePlays = require('./RulePlays')
const Vector = require('../../lib/Vector')

const BASE_SPEED = 60
const GOAL_LINE = -670

module.exports = class GoalkeeperPush2 extends RulePlays {
    setup(){
        super.setup()
        let ball = () => {
            let ball = {x: this.frame.cleanData.ball.x, y: this.frame.cleanData.ball.y}
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
      this.addIntetion(new PointIntention('KeepOnBall', {
          target: ball,
          radius: 100,
          radiusMax: 100,
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
