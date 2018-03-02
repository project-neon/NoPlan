// Math and vetor libs
const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')

// Intentions lib
const Intention = require('../Intention')
const IntentionPlayer = require('./IntentionPlayer')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

const FORWARD_SPEED = 500 // ~4.3s

const MinAttackSpeed = 120

module.exports = class NewAttacker extends IntentionPlayer {
  setup(){
    
    let ball = () => {return this.ball}
    this.orientation = Math.PI / 2
    this.position = {x: 0, y: 40}

    // ============================================== Prepare Attack
    this.$prepareAttack = new Intention('prepareAttack')
    this.addIntetion(this.$prepareAttack)

    this.$prepareAttack.addIntetion(new LineIntention('angularAvoidOwnGoal1', 
      {
        target: ball,
        theta: Vector.direction("right"),
        lineSize: 400,
        lineSizeSingleSide: true,
        lineDist: 120,
        lineDistMax: 120,
        decay: TensorMath.new.sub(1).mult(-1).finish,
        multiplier: 500,
      }
    ))

    this.$prepareAttack.addIntetion(new PointIntention('followBall', {
      target: () => {
        let OffsetForGoal = ((this.AtkOffsetBallDistance*this.position.y)/(Math.abs(this.CENTER_ENEMY_GOAL)-this.position.x))
        if (Math.abs(this.ball.y + this.AtkOffsetForGoal) < 645){
          return {x: this.ball.x - this.AtkOffsetBallDistance, y: this.ball.y + OffsetForGoal} 
        } else {
          return {x: this.ball.x - this.AtkOffsetBallDistance, y: this.ball.y}
        }
      },
      radius: 450,
      decay: TensorMath.new.finish,
      multiplier: 500,
    }))
    
    this.$makeGoal = new Intention("makeGoal")
    this.addIntetion(this.$makeGoal)

    this.$makeGoal = this.addIntetion(new PointIntention('goGoal', {
      target: {x: this.CENTER_ENEMY_GOAL, y: 0},
      radius: 100,
      decay: TensorMath.new.sub(1).mult(-1).finish,
      multiplier: 500,
    }))

    this.ballSpeedInit = this.ballSpeed
  }

  loop(){
    
    let toBall = Vector.sub(this.ball, this.position)
    let toBallDist = Vector.size(toBall)

    let bola = this.ballSpeed
    let realBallSpeed = Vector.size(Vector.sub(bola,this.ballSpeedInit)).toFixed(1)
    
    let toBallAngle = Vector.toDegrees(Vector.angle(toBall))
    let toGoalAngle = Vector.toDegrees(Vector.angle({x: this.CENTER_ENEMY_GOAL, y: this.position.y}))

    let diffBetweenAngles =  toGoalAngle+toBallAngle
  }
}