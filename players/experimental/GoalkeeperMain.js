const TensorMath = require('../../lib/TensorMath')
const LineIntention = require('../../Intention/LineIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 50

module.exports = class GoalkeeperMain extends RulePlays {
    setup(){
        super.setup()
        let ball = () => {
            let ball = {x: this.frame.cleanData.ball.x, y: this.frame.cleanData.ball.y}
            return ball
        }

        let ballProjection = () => {
            let pos = this.frame.cleanData.ball.projection
            let ballSpeed = this.frame.cleanData.ball.speed
            let ballPos = {x: this.frame.cleanData.ball.x, y: this.frame.cleanData.ball.y}
            /*
            A projeção não é usada nos casos onde:
            - Não existe vetor projeção (ocorre no primeiro frame de execução)
            - Velocidade da bola inferior a 1.2 cm/s (praticamente parada)
            - Quando a bola ira bater longe do gol (acima de 30 cm em relação ao centro do gol)
            */
            if (!pos || Vector.size(ballSpeed) < 5 || Math.abs(pos.y) > 300 ) {
                // if (Math.abs(ballPos.y) > 450) {
                //     let ballYSector = ballPos.y/Math.abs(ballPos.y)
                //     return {x: 0, y: ballYSector * 160}
                // } else {
                //     console.log('2 :', ballPos.y/2)
                //     return {x: 0, y: ballPos.y/2}
                // }
            }
            if (Vector.size(ballSpeed) < 2) {
                return ballPos
            }
            
            if (Math.abs(pos.y) > 450 ) {
                let ballYSector = ballPos.y/Math.abs(ballPos.y)
                return {x: 0, y: ballYSector * 160}
            }

            return pos
        }

        this.addIntetion(new LineIntention('followBallProjection', {
            target: ballProjection,
            theta: Vector.direction("left"),
            lineSize: 1700,
            lineDist: 250,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
        }))

        this.addIntetion(new LookAtIntention('LookAtBall', {
        target: ball,
        decay: TensorMath.new.pow(1/2).finish,
        multiplier: 360
        }))
      }
      loop(){
      }
}
