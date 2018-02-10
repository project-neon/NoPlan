const IntentionPlayer = require('./IntentionPlayer')

const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

// const FORWARD_SPEED = 500 // ~4.3s
const FORWARD_SPEED = 500 // ~4.3s

const ANGULAR_MULTIPLIER = 10

module.exports = class TestIntention2 extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {x: this.ball.x,
              y: this.ball.y
             }
    }

    // ----------------------------- Go Center Up
    this.$goToGoal = new Intention('goToGoal')
    this.$goToGoal.addIntetion(new PointIntention('center', {
      // target: ball,
      target: {x: -620, y: 0},
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.pow(3).finish,
      multiplier: FORWARD_SPEED,
    }))

    this.$goToGoal.addIntetion(new LookAtIntention('lookUp', {
      // target: ,
      theta: Math.PI / 2,
      decay: TensorMath.new.finish,
      multiplier: ANGULAR_MULTIPLIER,
    }))

    this.addIntetion(this.$goToGoal)


    // ----------------------------- Go Goal up
    this.$goToAttack = new Intention('goToAttack')
    this.$goToAttack.addIntetion(new PointIntention('center', {
      target: {x: 450, y: 0},
      radius: 150,
      radiusMax: false,
      decay: TensorMath.new.pow(3).finish,
      multiplier: FORWARD_SPEED,
    }))

    this.$goToAttack.addIntetion(new LookAtIntention('lookUp', {
      // target: ,
      theta: Math.PI / 2,
      decay: TensorMath.new.finish,
      multiplier: ANGULAR_MULTIPLIER,
    }))

    this.addIntetion(this.$goToAttack)

  }
  loop(){
    if(this.frame){
      
      let frame = this.frame
      
      let side = this.match.state.state.team
      let robots = frame['robots_' + side]
      

      if(robots.length < 3){
        this.$goToAttack.weight = 0
        this.$goToGoal.weight = 0
      }else{
        this.$goToAttack.weight = 0
        this.$goToGoal.weight = 1
      }
    }
  }
}