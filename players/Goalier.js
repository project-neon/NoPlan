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

    this.orientation = Math.PI / 2
    this.position = {x: 600, y: 400}

    this.$goGoalUp = new Intention('goGoalUp')
    this.$goGoalUp.addIntetion(new LineIntention('goal', {
      // target: ball,
      target: {x: 700, y: 0},
      lineDist:200,
      lineDistMax:650,
      lineSize:false,
      theta:Math.PI/2,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: FORWARD_SPEED,
    }))

    this.addIntetion(this.$goGoalUp)
  }

  loop(){

  }
}