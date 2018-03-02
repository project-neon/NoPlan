// Math and vetor libs
const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')

// Intentions lib
const Intention = require('../Intention')
const IntentionPlayer = require('./IntentionPlayer')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

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
        if (Math.abs(this.ball.y + OffsetForGoal) < 630){
          return {x: this.ball.x - this.AtkOffsetBallDistance, y: this.ball.y + OffsetForGoal} 
        } else {
          return {x: this.ball.x - this.AtkOffsetBallDistance, y: this.ball.y}
        }
      },
      radius: 450,
      decay: TensorMath.new.pow(0.5).sub(0.05).finish,
      multiplier: () => {
        return Vector.size(this.ballSpeed) * 4 + 500
      }
      }))

    // ============================================== Make Goal
    this.$makeGoal = new Intention("makeGoal")
    this.addIntetion(this.$makeGoal)

    this.$makeGoal = this.addIntetion(new PointIntention('goGoal', {
      target: {x: this.CENTER_ENEMY_GOAL, y: 0},
      radius: 1800,
      radiusMax: false,
      decay: TensorMath.new.sub(1).mult(-2).finish,
      multiplier: 700,
    }))

    this.$makeGoal.addIntetion(new LineIntention('followYBall', {
      target: ball,
      theta: Vector.direction('left'),
      lineSize: 200,
      lineSizeSingleSide: true,
      lineDist: 150,
      multiplier: () => {
        return Vector.size(this.ballSpeed) * 4 + 500
      },
      decay: TensorMath.new.finish
    }))

    this.ballSpeedInit = this.ballSpeed

    this.$followBallOnBoarder = new Intention("followBallOnBoarder")

    this.$followBallOnBoarder = this.addIntetion(new PointIntention('followBallOnBoard', {
      target: ball,
      radius: 1800,
      radiusMax: false,
      decay: TensorMath.new.sub(1).mult(-2).finish,
      multiplier: () => {
        return Vector.size(this.ballSpeed) * 4 + 500
      },
    }))

    this.$rules = new Intention('rules')

    this.$rules = this.addIntetion(new PointIntention('avoidGoalArea', {
      target: {x: -300, y: 0},
      theta: Vector.direction('up'),
      radius: 150,
      decay: TensorMath.new.finish,
      multiplier: 700
    }))

  }

  loop(){
    
    let toBall = Vector.sub(this.ball, this.position)
    let toBallDist = Vector.size(toBall)
    
    let toBallAngle = Vector.toDegrees(Vector.angle(toBall))
    let toGoalAngle = Vector.toDegrees(Vector.angle({x: this.CENTER_ENEMY_GOAL, y: this.position.y}))

    let diffBetweenAngles =  toGoalAngle+toBallAngle

    if(Math.abs(diffBetweenAngles) < 20) {
      this.$makeGoal.weight = 1
    } else {
      this.$makeGoal.weight = 0
    } 

    if(this.ball.x < -400) {
      this.$rules.weight = 1
      this.$prepareAttack.weight = 0
    } else {
      this.$rules.weight = 0
      this.$prepareAttack.weight = 1
    }

    if(Math.abs(this.ball.y) > 640) {
      this.$followBallOnBoarder.weight = 1
    } else {
      this.$followBallOnBoarder.weight = 0
    }
  }
}