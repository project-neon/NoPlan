const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const OrbitalIntention = require('../../Intention/OrbitalIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 65

module.exports = class AttackerForward extends RulePlays {

    isLeft(P0, P1, P2 ) {
      return ( (P1.x - P0.x) * (P2.y - P0.y) - (P2.x - P0.x) * (P1.y - P0.y) )
    }
    pointInRectangle(X, Y, Z, W, P) {
      return (this.isLeft(X, Y, P) > 0 && this.isLeft(Y, Z, P) > 0 && this.isLeft(Z, W, P) > 0 && this.isLeft(W, X, P) > 0)
    }

    setup () {
        this.attackingLock = false

        super.setup()
        let ball = () => {
            let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
            return ball
        }

        let ballSpeedBasedMultiplier = () => {
            let ballSpeed = Vector.size(this.match.dataManager.ball.speed)
            let multiplier = Math.max(Math.min(ballSpeed + 35, 80), 60)
            return multiplier
        }

        this.$lookAtBall = new Intention()
        this.$Attack = new Intention()
        this.$followBall = new Intention()

        this.addIntetion(this.$lookAtBall)
        this.addIntetion(this.$Attack)

        this.$Attack.addIntetion(new PointIntention('goGoal', {
            target: {x:700, y:0},
            radius: 150,
            decay: TensorMath.new.constant(1).deadWidth(0.15).finish,
            multiplier: ballSpeedBasedMultiplier
        }))

        this.$followBall.addIntetion(new PointIntention('goBall', {
            target: ball,
            radius: 150,
            decay: TensorMath.new.constant(1).deadWidth(0.15).finish,
            multiplier: ballSpeedBasedMultiplier
        }))

        this.$lookAtBall.addIntetion(new LookAtIntention('lookAtBall', {
            target: ball,
            decay: TensorMath.new.constant(1).deadWidth(0.15).finish,
            multiplier: 100,
        }))

      }
      loop () {
          let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
          let robotDir = Vector.norm(Vector.fromTheta(this.orientation))
          let robotToBall = Vector.sub(this.position, ball)
          let angle = Vector.toDegrees(Vector.angleBetween(robotDir, robotToBall))
          let normVector = Vector.fromTheta(Vector.toDegrees(this.orientation) + 90)
          normVector = Vector.norm(normVector)
          let robotLeft = {x: this.position.x + normVector.x * 40, y: this.position.y + normVector.y * 40}
          let robotRight = {x: this.position.x - normVector.x * 40, y: this.position.y - normVector.y * 40}
          let robotLeftFinal = {x: robotLeft.x + robotDir.x * 400, y: robotLeft.y + robotDir.y * 400}
          let robotRightFinal = {x: robotRight.x + robotDir.x * 400, y: robotRight.y + robotDir.y * 400}

          let insideRectangle = this.pointInRectangle(robotLeft, robotRight, robotLeftFinal, robotRightFinal, ball)
          if (this.attackingLock && insideRectangle) {
            this.attackingLock = true
            this.$lookAtBall.weight = 0
            this.$Attack.weight = 1
            this.$followBall = 0.5
          }
          else if (Math.abs(angle) > 20 && Math.abs(angle) < 160 && !this.attackingLock) {
            this.$lookAtBall.weight = 1
            this.$Attack.weight = 0
          } else {
            this.attackingLock = true
            this.$lookAtBall.weight = 0
            this.$Attack.weight = 1
            this.$followBall = 0.5
          }
      }
}
