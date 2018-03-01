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

const ANGULAR_MULTIPLIER = 10

const GOAL_POSITION_X = 800

const Field = {
  width: 1700,
  TopLeft: {x: -775, y: 675},
  TopRight: {x: 775, y: 675},
  BottomLeft: {x: -775, y: -675},
  BottomRight: {x: 775, y: -675}
}

const AvoidWall_Decay = TensorMath.new.mult(-1).sum(1).finish
const AvoidWall_Speed = 100
const AvoidWall_Corridor = 200

const OffsetBallDistance = 150
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
        let OffsetForGoal = ((OffsetBallDistance*this.position.y)/(GOAL_POSITION_X-this.position.x))
        if (Math.abs(this.ball.y + OffsetForGoal) < 645){
          return {x: this.ball.x - OffsetBallDistance, y: this.ball.y + OffsetForGoal} 
        } else {
          return {x: this.ball.x - OffsetBallDistance, y: this.ball.y}
        }
      },
      radius: 450,
      decay: TensorMath.new.finish,
      multiplier: 500,
    }))
    
    this.$makeGoal = new Intention("makeGoal")
    this.addIntetion(this.$makeGoal)

    this.$makeGoal = this.addIntetion(new PointIntention('goGoal', {
      target: {x: GOAL_POSITION_X, y: 0},
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
    let toGoalAngle = Vector.toDegrees(Vector.angle({x: GOAL_POSITION_X, y: this.position.y}))

    let diffBetweenAngles =  toGoalAngle+toBallAngle

// // <<<<<<< Updated upstream
//        this.$goGoal.weight = 0.3
// //       // console.log('inside')
// // =======
// >>>>>>> Stashed changes
    // this.$prepareAttack.weight = 0

    // let speed = Math.max(160, Vector.size(this.ballSpeed) + 70) * 2
    // console.log('speed', speed.toFixed(0))
    // return speed

// <<<<<<< Updated upstream
//     this.$avoidWalls.weight = 1
//     console.log(this.getIntentionsInfo())
// =======

    // this.$avoidWalls.weight = 0.3
// >>>>>>> Stashed changes
    // this.$prepareAttack.weight = 1
    // this.$attackAccelerated.weight = 1
    // console.log(this.intentionGroup.output)
  }
}