const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const OrbitalIntention = require('../../Intention/OrbitalIntention')
const Vector = require('../../lib/Vector')

const BASE_SPEED = 55

module.exports = class GoalkeeperMain extends IntentionPlayer {
    setup () {
        let ball = () => {
            let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
            return ball
        }

        let ballSpeedBasedMultiplier = () => {
            let ballSpeed = Vector.size(this.match.dataManager.ball.speed)
            let multiplier = Math.max(Math.min(ballSpeed + 35, 80), 40)
            return multiplier
        }

        this.$lookAtBall = new Intention()
        this.$Attack = new Intention()

        this.addIntetion(this.$lookAtBall)
        this.addIntetion(this.$Attack)

        this.$Attack.addIntetion(new PointIntention('goGoal', {
            target: {x:700, y:0},
            radius: 150,
            decay: TensorMath.new.constant(1).finish,
            multiplier: ballSpeedBasedMultiplier
        }))

        this.$lookAtBall.addIntetion(new LookAtIntention('lookAtBall', {
            target: ball,
            decay: TensorMath.new.constant(1).finish,
            multiplier: 100,
        }))

      }
      loop(){
          let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
          let robotDir = Vector.fromTheta(this.orientation)
          let robotToBall = Vector.sub(this.position, ball)
          let angle = Vector.toDegrees(Vector.angleBetween(robotDir, robotToBall))
          
          if (Math.abs(angle) > 10 && Math.abs(angle) < 170) {
            this.$lookAtBall.weight = 1
            this.$Attack.weight = 0 
          } else {
            this.$lookAtBall.weight = 0
            this.$Attack.weight = 1
          }
      }
}
