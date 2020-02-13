const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const LineIntention = require('../../Intention/LineIntention')
const Vector = require('../../lib/Vector')

const FORWARD_SPEED = 50

module.exports = class LineIntentionPlayer extends IntentionPlayer {
  setup(){
    this.addIntetion(new LineIntention('test', {
      target: {x: 0, y: 0},
      theta: Vector.direction("up"),
      lineSize: 1700,
      lineDist: 260,
      lineDistMax: 400,
      decay: TensorMath.new.finish,
      multiplier: FORWARD_SPEED
    }))
  }
  loop(){
  }
}
