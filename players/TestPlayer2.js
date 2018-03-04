const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

const FORWARD_SPEED = 500 // ~4.3s

const ANGULAR_MULTIPLIER = 10

module.exports = class TestPlayer2 extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {x: this.ball.x,
              y: this.ball.y
             }
    }
    // ----------------------------- Go Goal up
    this.$goGoalUp = new Intention('goGoalUp')
    this.$goGoalUp.addIntetion(new PointIntention('center', {
      // target: ball,
      target: {x: 600, y: 0},
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.pow(3).finish,
      multiplier: FORWARD_SPEED,
    }))

  }
  loop(){
  }
}