const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const Vector = require('../../lib/Vector')

const BASE_SPEED = 40

module.exports = class GoalkeeperPush extends IntentionPlayer {
    setup(){
        let ball = () => {
            let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
            return ball
        }

        this.$AttackBallIntentionGroup = new Intention()

        this.$AttackBallIntentionGroup.addIntetion(
            new PointIntention('PushBall', {
                target: ball,
                radius: 20,
                radiusMax: false,
                decay: TensorMath.new.finish,
                multiplier: 50,
              })
        )
        
        this.$AttackBallIntentionGroup.addIntetion(
            new LineIntention('followBallX', {
                target: ball,
                theta: Vector.direction("left"),
                lineSize: 1700,
                lineDist: 250,
                decay: TensorMath.new.constant(1).finish,
                multiplier: 5
            })
        )

        this.addIntetion(this.$AttackBallIntentionGroup)
        
        this.$lookAtBeforeAttack = new Intention()

        this.$lookAtBeforeAttack.addIntetion(
            new LookAtIntention('LookAtBall', {
                target: ball,
                decay: TensorMath.new.constant(1).finish,
                multiplier: 120
            })
        )

        this.addIntetion(this.$lookAtBeforeAttack)
    }
    loop(){
        let ball =  {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
        let toBall = Vector.sub({x: ball.x, y: ball.y}, this.position)
        let toBallAngle = Vector.angleBetween(toBall, Vector.fromTheta(this.orientation))
        let withinAttackArea = Math.abs(toBallAngle) < (10)

        if (withinAttackArea) {
            this.$AttackBallIntentionGroup.height = 1
            this.$lookAtBeforeAttack.height = 0
        } else {
            this.$AttackBallIntentionGroup.height = 0
            this.$lookAtBeforeAttack.height = 1
        }
    }
}