const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const LineIntention = require('../../Intention/LineIntention')
const PointIntention = require('../../Intention/PointIntention')
const LookAtIntention = require('../../Intention/LookAtIntention')
const Vector = require('../../lib/Vector')

const FORWARD_SPEED = 80

module.exports = class LookAtIntentionPlayer extends IntentionPlayer {
  setup(){
    let ball = () => {return this.ball}

    this.addIntetion(new LookAtIntention('test', {
      target: ball,
      decay: TensorMath.new.constant(1).finish,
      multiplier: FORWARD_SPEED,
    }))
  }
  loop(){
  }
}