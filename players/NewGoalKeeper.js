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

    // ============================================== Defend the goal
    this.$defend = new Intention('defend')
    this.addIntetion(this.$defend)

    this.$defend.addIntetion(new LineIntention('followBall', 
      {
        target: () => {
          let OffsetForBall = (this.ball.y/(800+this.ball.x))*100
          return {x: 0, y: OffsetForBall} 
      },
        theta: Vector.direction("right"),
        lineSize: 1700,
        lineDist: 80,
        decay: TensorMath.new.mult(-1).finish,
        multiplier: 700,
    }))

    this.$defend.addIntetion(new LineIntention('followGoalLine', 
      {
        target: {x: -700, y: 0},
        theta: Vector.direction("up"),
        lineSize: 1350,
        lineDist: 80,
        decay: TensorMath.new.mult(-1).finish,
        multiplier: 700,
    }))

    // this.$defend.addIntetion(new PointIntention('followBall', {
    //   target: () => {
    //     let UseX = this.ball.x
    //     if(UseX == 0){
    //       UseX = 1
    //     }
    //     let OffsetForBall = ((800 + this.ball.y)/UseX) * -100
    //     return {x: -700, y: OffsetForBall} 
    //   },
    //   radius: 450,
    //   decay: TensorMath.new.finish,
    //   multiplier: 500,
    // }))

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
  }
}