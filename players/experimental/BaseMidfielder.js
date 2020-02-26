const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('../experimental/RulePlays')

module.exports = class BaseMidfielder extends RulePlays {
    setup () {
        super.setup()
        // let attacker = () => {
        //     let pos = this.match.gameManager.coach.attackerRobot.robots.self.position
        //     /*
        //     A projeção não é usada nos casos onde:
        //     - Não existe vetor projeção (ocorre no primeiro frame de execução)
        //     - Velocidade da bola inferior a 1.2 cm/s (praticamente parada)
        //     - Quando a bola ira bater longe do gol (acima de 30 cm em relação ao centro do gol)
        //     */
        //     return pos
        // }

        this.addIntetion(new PointIntention('avoidPartner', {
            target: {x:0, y:0},
            radius: 400,
            radiusMax: 400,
            decay: TensorMath.new.mult(-1).finish,
            multiplier: 160
        }))

    }
    loop () {}
}
