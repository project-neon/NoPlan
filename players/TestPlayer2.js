const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')
const Vector = require('../lib/Vector')

const FORWARD_SPEED = 50

module.exports = class TestPlayer2 extends IntentionPlayer {
  setup(){
    // ----------------------------- Go Goal up
    this.addIntetion(new LineIntention('test', {
      target: {x: 0, y: 0},
      theta: Vector.direction("up"),
      lineSize: 1700,
      lineDist: 260,
      decay: TensorMath.new.pow(0.5).finish,
      multiplier: FORWARD_SPEED
    }))
  }

  loop(){
  }
}