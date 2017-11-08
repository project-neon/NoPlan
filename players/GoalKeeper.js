const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

// const FORWARD_SPEED = 500 // ~4.3s
const FORWARD_SPEED = 500 // ~4.3s

const ANGULAR_MULTIPLIER = 10

module.exports = class GoalKeeper extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {x: this.ball.x,
              y: this.ball.y}
    }
    
    // ----------------------------- Go Goal up
    this.$goalkeeperIntetion = new Intention('goalkeeper')
    
    this.$goalkeeperIntetion.addIntetion(new LineIntention('follow_x', {
      target: ball,
      theta:0,
      decay: TensorMath.new.finish,
      multiplier: FORWARD_SPEED,
    }))

    this.addIntetion(this.$goalkeeperIntetion)
  }

  loop(){

  }
}