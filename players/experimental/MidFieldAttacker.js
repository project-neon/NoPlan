const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')
const BaseMidfielder = require('./BaseMidfielder')


const BASE_SPEED = 50

module.exports = class Midfielder extends BaseMidfielder {
    setup(){
        super.setup()
        let ball = () => {
            let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
            return ball
        }

        let followAttackerShadow = () => {
            //let pos = this.match.gameManager.coach.attackerRobot.robots.self.position
            /*
            A projeção não é usada nos casos onde:
            - Não existe vetor projeção (ocorre no primeiro frame de execução)
            - Velocidade da bola inferior a 1.2 cm/s (praticamente parada)
            - Quando a bola ira bater longe do gol (acima de 30 cm em relação ao centro do gol)
            */
            return {x: -250, y: -0/2}
        }

        this.addIntetion(new LineIntention('KeepGoalLine', {
          target: {x: -250, y: 0},
          theta: Vector.direction("up"),
          lineSize: 1700,
          lineDist: 260,
          decay: TensorMath.new.finish,
          multiplier: BASE_SPEED
        }))

        this.addIntetion(new LineIntention('followAttackerShadow', {
            target: followAttackerShadow,
            theta: Vector.direction("left"),
            lineSize: 1700,
            lineDist: 250,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
          }))

        this.addIntetion(new LookAtIntention('LookAtBall', {
            target: ball,
            decay: TensorMath.new.constant(1).finish,
            multiplier: 100
        }))
      }
      loop(){
      }
}
