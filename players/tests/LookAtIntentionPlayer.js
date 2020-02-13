const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const LookAtIntention = require('../../Intention/LookAtIntention')

const FORWARD_SPEED = 480

module.exports = class LookAtIntentionPlayer extends IntentionPlayer {
  setup(){
    let ball = () => {return this.ball}

    this.addIntetion(new LookAtIntention('test', {
      target: ball,
      decay: TensorMath.new.pow(1/2).finish,
      multiplier: FORWARD_SPEED,
    }))
  }
  loop(){
  }
}