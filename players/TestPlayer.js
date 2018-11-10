const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

const FORWARD_SPEED = 15 // ~4.3s

const ANGULAR_MULTIPLIER = 200

module.exports = class TestPlayer extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {x: this.ball.x,
              y: this.ball.y
             }
    }

    // ----------------------------- Go Center Up
    this.$goCenterUp = new Intention('goCenterUp')
    this.$goCenterUp.addIntetion(new PointIntention('center', {
      // target: ball,
      target: {x: -600, y: 0},
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.pow(3).finish,
      multiplier: FORWARD_SPEED,
    }))

    this.$goCenterUp.addIntetion(new LookAtIntention('lookUp', {
      // target: ,
      theta: Math.PI / 2,
      decay: TensorMath.new.finish,
      multiplier: ANGULAR_MULTIPLIER
    }))

    this.addIntetion(this.$goCenterUp)


    // ----------------------------- Go Goal up
    this.$goGoalUp = new Intention('goGoalUp')
    this.$goGoalUp.addIntetion(new PointIntention('center', {
      // target: ball,
      target: {x: 600, y: 0},
      radius: 150,
      radiusMax: false,
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


    // ----------------------------- Avoidance
    this.$playerAvoidance = new Intention('playerAvoidance')
    this.$playerAvoidance.addIntetion(new PointIntention('center', {
      // target: ball,
      target: {x: 0, y: 0},
      radius:150,
      radiusMax: 150,
      decay: TensorMath.new.pow(3).finish,
      multiplier: -FORWARD_SPEED,
    }))

    this.startTime = Date.now()
    this.states = [this.$goGoalUp, this.$goCenterUp]

  }
  loop(){

    let current = this.states[0]
    this.states.map(state => state.weight = 0)
    current.weight = 1

    if (current.isStabilized()) {

      // let now = Date.now()
      // let timeTaken = ((now - this.startTime) / 1000).toFixed(2)
      // this.startTime = now
      // console.log('completed', current.name, 'in', timeTaken+'s')

      current.output = null
      this.states.unshift(this.states.pop())
    }
    // console.log(this.frame)
    // if (this.$goGoalUp.active && this.$goGoalUp.isStabilized()) {
    //   this.$goGoalUp.weight = 0
    //   this.$goCenterUp.weight = 1
    // }

    // if (this.$goCenterUp.output) {
      // console.log(stabilizedIntention(this.$goCenterUp))
    // }
    // console.log(this.position)
  }
}