// Math and vetor libs
const Vector = require('../lib/Vector')
const TensorMath = require('../lib/TensorMath')

// Intentions lib
const Intention = require('../Intention')
const IntentionPlayer = require('./IntentionPlayer')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')

module.exports = class NewGoalKeeper extends IntentionPlayer {
  setup(){
    
    let ball = () => {return this.ball}
    this.orientation = Math.PI / 2
    this.position = {x: 0, y: 40}

    // ============================================== Defend the goal
    this.$defend = new Intention('defend')
    this.addIntetion(this.$defend)

    this.$defend.addIntetion(new PointIntention('followBallToDefend', 
      {
          target: () => {
            let OffsetForBall = (this.ball.y/(800+this.ball.x))*-100
            return {x: this.CENTER_OWN_GOAL + 180, y: OffsetForBall} 
          },
          radius: 200,
          decay: TensorMath.new.finish,
          multiplier: 400
      }
    ))
    this.$defend.addIntetion(new LookAtIntention('lookAtBall', 
    {
      target: () => {return {x: this.ball.x - 50, y: this.ball.y}},
      decay: TensorMath.new.finish,
      multiplier: 20
    }))

    this.$prepareAttack = new Intention()
    this.addIntetion(this.$prepareAttack)

    this.$prepareAttack.addIntetion(new PointIntention('followBallToAttack', {
      target: () => {return {x: this.ball.x - 10, y: this.ball.y}},
      radius: 250,
      decay: TensorMath.new.pow(0.5).sub(0.05).finish,
      multiplier: () => {
        return Vector.size(this.ballSpeed) + 300
      }
    }))
    this.$prepareAttack.addIntetion(new LineIntention('angularAvoidOwnGoal1', 
      {
        target: () => {return {x: this.ball.x + 20, y: this.ball.y}},
        theta: Vector.direction("right"),
        lineSize: 400,
        lineSizeSingleSide: true,
        lineDist: 120,
        lineDistMax: 120,
        decay: TensorMath.new.sub(1).mult(-1).finish,
        multiplier: 500,
      }
    ))

    // this.ballSpeedInit = this.ballSpeed
  }

  loop(){
    let toBall = Vector.sub(this.ball, this.position)
    let toBallDist = Vector.size(toBall)

    // let bola = this.ballSpeed
    // let realBallSpeed = Vector.size(Vector.sub(bola,this.ballSpeedInit)).toFixed(1)
    
    let toBallAngle = Vector.toDegrees(Vector.angle(toBall))
    let toGoalAngle = Vector.toDegrees(Vector.angle({x: this.CENTER_ENEMY_GOAL, y: this.position.y}))

    let diffBetweenAngles =  toGoalAngle+toBallAngle

    if (this.ball.x < -400) {
      this.$defend.weight = 0
      this.$prepareAttack.weight = 1
    }else {
      this.$defend.weight = 1
      this.$prepareAttack.weight = 0
    }
  }
}