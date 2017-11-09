const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

// const FORWARD_SPEED = 500 // ~4.3s
const FORWARD_SPEED = 500 // ~4.3s

const ANGULAR_MULTIPLIER = 10

const AvoidWall_Decay = TensorMath.new.mult(-1).sum(1).finish

const Direction = {
  UP: Math.PI / 2,
  DOWN: - Math.PI / 2,
  RIGHT: 0,
  LEFT: Math.PI,
}

module.exports = class GoalKeeper extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {x: this.ball.x,
              y: this.ball.y}
    }
    
    this.$goalkeeperIntetion = new Intention('goalkeeper')
    
    this.$followXIntetion = new LineIntention('follow_x', {
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 1700,
      lineDist: 80,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 200,
    })
    this.$goalkeeperIntetion.addIntetion(this.$followXIntetion)
    this.$goalkeeperIntetion.addIntetion(new LineIntention('follow_goalline', {
      target: {x: 640 , y: 0},
      theta: Direction.UP,
      lineSize: 1700,
      lineDist: 80,
      lineDistMax: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 200,
    }))

    this.addIntetion(this.$goalkeeperIntetion)
  }

  loop(){
    if (this.ball.y < -300 || this.ball.y > 300) {
      console.log('not OK!', this.ball)
      this.$followXIntetion.weight = 0
    } else {
      console.log('OK!', this.ball)
      this.$followXIntetion.weight = 1
    }
  }
}