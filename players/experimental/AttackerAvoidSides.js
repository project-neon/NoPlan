const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const OrbitalIntention = require('../../Intention/OrbitalIntention')
const Vector = require('../../lib/Vector')
const RulePlays = require('./RulePlays')

const BASE_SPEED = 100

module.exports = class AttackerAvoidSides extends RulePlays {
    setup () {
        super.setup()
        let ball = () => {
          let ball = {x: this.match.dataManager.ball.x, y: this.match.dataManager.ball.y}
          let ballSide = ball.y/Math.abs(ball.y)


          return {x: ball.x, y: ball.y - ballSide * 100}
        }

        this.addIntetion(new PointIntention('goBallSides', {
          target: ball,
          radius: 150,
          decay: TensorMath.new.constant(1).deadWidth(0.15).finish,
          multiplier: 60
        }))

      }
      loop(){

      }
}
