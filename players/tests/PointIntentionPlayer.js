const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const PointIntention = require('../../Intention/PointIntention')
const Vector = require('../../lib/Vector')

const FORWARD_SPEED = 35

module.exports = class PointIntentionPlayer extends IntentionPlayer {
  setup(){
    this.addIntetion(new PointIntention('test', {
      target: {x: 0, y: 0},
      theta: Vector.direction("left"),
      radius: 100, 
      decay: TensorMath.new.pow(2).finish,
      multiplier: FORWARD_SPEED
    }))
  }
  loop(){
  }
}
