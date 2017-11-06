const IntentionPlayer = require('./IntentionPlayer')

const TensorMath = require('../lib/TensorMath')

const LineIntention = require('../Intention/LineIntention')

module.exports = class TestIntention1 extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {x: this.ball.x, y: this.ball.y}
    }
    this.intentionGroup.addIntetion(new LineIntention('to_mid_field_x', {
      pos: ball,
      theta: 0,
      decay: TensorMath.new.deadWidth(10).div(3).finish
    }))
    this.intentionGroup.addIntetion(new LineIntention('to_mid_field_y', {
      pos: ball,
      theta: Math.PI/2,
      decay: TensorMath.new.deadWidth(10).div(3).finish
    }))
  }
  loop(){ 

  }
}