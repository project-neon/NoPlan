const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 55
module.exports = class GoalkeeperPush extends RulePlays {
    setup(){
        super.setup()
        let ballProjection = () => {
            let pos = this.frame.cleanData.ball.projection
            let ballSpeed = this.frame.cleanData.ball.speed
            let ballPos = {
                x: this.frame.cleanData.ball.x, 
                y: this.frame.cleanData.ball.y
            }
            /*
            A projeção não é usada nos casos onde:
            - Não existe vetor projeção (ocorre no primeiro frame de execução)
            - Velocidade da bola inferior a 1.2 cm/s (praticamente parada)
            - Quando a bola ira bater longe do gol (acima de 30 cm em relação ao centro do gol)
            */
            if (!pos || Vector.size(ballSpeed) < 1.2 || Math.abs(pos.y) > 300 ) {
                if (Math.abs(ballPos.y) > 450) {
                    let ballYSector = ballPos.y/Math.abs(ballPos.y)
                    return {x: 0, y: ballYSector * 160}
                } else {
                    return {x: 0, y: ballPos.y/2}
                }
            }
            return pos
        }

        this.$projectBall = new Intention()

        this.$projectBall.addIntetion(new LineIntention('followBallProjection', {
            target: ballProjection,
            theta: Vector.direction("left"),
            lineSize: 1700,
            lineDist: 125,
            decay: TensorMath.new.finish,
            multiplier: BASE_SPEED
        }))
        this.addIntetion(this.$projectBall)
    }
    loop(){}
}
