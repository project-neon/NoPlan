const IntentionPlayer = require('./IntentionPlayer')

const TensorMath = require('../lib/TensorMath')

const LineIntention = require('../Intention/LineIntention')

module.exports = class TestIntention1 extends IntentionPlayer {
  setup(){
    this.intentionGroup.addIntetion(new LineIntention('to_mid_field_x', {
      pos: {x: 0, y: 0},
      theta: 0,
      lineSize: 400,
      decay: TensorMath.new.deadWidth(50).binarize(400).finish
    }))
  }

  loop(){

  }
}