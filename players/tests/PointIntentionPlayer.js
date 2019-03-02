const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const Vector = require('../../lib/Vector')

const FORWARD_SPEED = 50

module.exports = class PointIntentionPlayer extends IntentionPlayer {
  setup(){
    this.addIntetion(new PointIntention('test', {
      target: {x: 0, y: 0},
      theta: Vector.direction("left"),
      radius: 100,
      decay: TensorMath.new.finish,
      multiplier: FORWARD_SPEED
    }))
  }
  loop(){
  }
}
