const IntentionPlayer = require('../IntentionPlayer')
const TensorMath = require('../../lib/TensorMath')
const Intention = require('../../Intention')
const OrbitalIntention = require('../../Intention/OrbitalIntention')
const Vector = require('../../lib/Vector')

const FORWARD_SPEED = 50

module.exports = class OrbitalIntentionPlayer extends IntentionPlayer {
  setup(){
    let ball = () => {return this.ball}

    this.addIntetion(new OrbitalIntention('test', {
      target: ball,
      radius: 100,
      multiplier: FORWARD_SPEED,
      clockwise: 1,
      K: 50
    }))
  }
  loop(){
  }
}