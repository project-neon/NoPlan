const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

// const FORWARD_SPEED = 500 // ~4.3s
const FORWARD_SPEED = 500 // ~4.3s

const ANGULAR_MULTIPLIER = 10

module.exports = class Goalier extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {x: this.ball.x,
              y: this.ball.y}
    }
    
    // ----------------------------- Go Goal up
    this.$goGoalUp = new Intention('goGoalUp')
    this.$goGoalUp.addIntetion(new LineIntention('goal', {
      // target: ball,
      position: {x: 750, y: 0},
      theta:0,
      lineWidth: 200,
      decay: TensorMath.new.pow(3).finish,
      multiplier: FORWARD_SPEED,
    }))

    this.$goGoalUp.addIntetion(new LookAtIntention('lookUp', {
      // target: ,
      theta: Math.PI / 2,
      decay: TensorMath.new.finish,
      multiplier: ANGULAR_MULTIPLIER,
    }))

    this.addIntetion(this.$goGoalUp)

    this.startTime = Date.now()
    this.states = [this.$goGoalUp]

  }

  loop(){

  }
}