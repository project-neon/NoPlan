const IntentionPlayer = require('./IntentionPlayer')
const TensorMath = require('../lib/TensorMath')
const Intention = require('../Intention')
const LineIntention = require('../Intention/LineIntention')
const PointIntention = require('../Intention/PointIntention')
const LookAtIntention = require('../Intention/LookAtIntention')
const Vector = require('../lib/Vector')
// const FORWARD_SPEED = 500 // ~4.3s
const FORWARD_SPEED = 500 // ~4.3s

const ANGULAR_MULTIPLIER = 10

const Direction = {
  UP: Math.PI / 2,
  DOWN: - Math.PI / 2,
  RIGHT: 0,
  LEFT: Math.PI,
}

const AvoidWall_Decay = TensorMath.new.finish
const AvoidWall_Speed = 980
const AvoidWall_Corridor_max = 420
const AvoidWall_Corridor = 420
const OffsetBallDistance = 130

const Field = {
  width: 1700,
  TopLeft: {x: -775, y: 675},
  TopRight: {x: 775, y: 675},
  BottomLeft: {x: -775, y: -675},
  BottomRight: {x: 775, y: -675}
}

module.exports = class Defender extends IntentionPlayer {
  setup(){
    let ball = () => {
      return {x: this.ball.x,
              y: this.ball.y}
    }
       
    // ============================================== Follow Ball in y
    this.$followXIntetion = new Intention('goalkeeper_following')
    
    this.$followXIntetion.addIntetion(new LineIntention('follow_y', {
      target: ball,
      theta: Direction.RIGHT,
      lineSize: 1700,
      lineDist: 80,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 500,
    }))

    this.$followXIntetion.addIntetion(new LineIntention('follow_goalline', {
      target: {x: -250 , y: 0},
      theta: Direction.UP,
      lineSize: 1700,
      lineDist: 200,
      //lineDistMax: 200,
      // lineDist: 80,
      // lineDistMax: 200,
      decay: TensorMath.new.mult(-1).finish,
      multiplier: 500,
    }))
    this.addIntetion(this.$followXIntetion)
    // ============================================== Avoid Walls

    // this.$avoidWalls = new Intention('avoid_walls')
    // this.$avoidWalls.addIntetion(new LineIntention('topWall', {
    //   // target: ball,
    //   target: Field.TopRight,
    //   theta: Direction.RIGHT,
    //   lineSize: Field.width, // Largura do segmento de reta
    //   // lineSizeSingleSide: true,

    //   lineDist: AvoidWall_Corridor, // Tamanho da repelência
    //   lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
    //   // lineDistSingleSide: true,
      
    //   decay: AvoidWall_Decay,
    //   multiplier: AvoidWall_Speed,
    // }))

    // this.$avoidWalls.addIntetion(new LineIntention('bottomWall', {
    //   // target: ball,
    //   target: Field.BottomLeft,
    //   theta: Direction.LEFT,
    //   lineSize: Field.width, // Largura do segmento de reta
    //   // lineSizeSingleSide: true,

    //   lineDist: AvoidWall_Corridor, // Tamanho da repelência
    //   lineDistMax: AvoidWall_Corridor_max, // Tamanho da repelência
    //   // lineDistSingleSide: true,
      
    //   decay: AvoidWall_Decay,
    //   multiplier: AvoidWall_Speed,
    // }))
    // this.addIntetion(this.$avoidWalls)

    // ============================================== comportamento de libero
    this.$attackAccelerated = new Intention('attackAccelerated')
    this.addIntetion(this.$attackAccelerated)

    // ============================================== Make Goal
    this.$makeGoal = new Intention("makeGoal")
    this.addIntetion(this.$makeGoal)

    // this.$makeGoal = this.addIntetion(new PointIntention('goGoal', {
    //   target: {x: this.CENTER_ENEMY_GOAL, y: 0},
    //   radius: 800,
    //   radiusMax: 2000,
    //   decay: TensorMath.new.sub(1).mult(-2).finish,
    //   multiplier: 500,
    // }))
// 
    this.$makeGoal.addIntetion(new LineIntention('followYBall', {
      target: ball,
      theta: Vector.direction('left'),
      lineSize: 200,
      lineSizeSingleSide: true,
      lineDist: 150,
      multiplier: () => {
        return Vector.size(this.ballSpeed) * 3 + 500
      },
      decay: TensorMath.new.finish
    }))

    this.$attackAccelerated.addIntetion(new PointIntention('goBall', {
      target: ball,
      radius: 400,
      radiusMax: 900,
      decay: TensorMath.new.finish,
      multiplier: 600,
    }))

    // this.$attackAccelerated.addIntetion(new LineIntention('angularAvoidOwnGoal1', {
    //     target: ball,
    //     theta: Vector.direction("right"),
    //     lineSize: 400,
    //     lineSizeSingleSide: true,
    //     lineDist: 120,
    //     lineDistMax: 120,
    //     decay: TensorMath.new.sub(1).mult(-1).finish,
    //     multiplier: 600,
    //   }
    // ))
  }

  loop(){
    let toBall = Vector.sub({x: this.ball.x, y: this.ball.y}, this.position)
    let toBallDist = Vector.size(toBall)
    let toBallAngle = Vector.toDegrees(Vector.angle(toBall))
    
    if (this.ball.x > 0) {
      this.$followXIntetion.weight = 1
      // this.$makeGoal.weight = 0
      this.$attackAccelerated.weight = 0
    } else {
      this.$followXIntetion.weight = 0
      this.$attackAccelerated.weight = 1
        if (toBallDist < 150) {
          this.$makeGoal.weight = 1
          this.$followXIntetion.weight = 0
          this.$attackAccelerated.weight = 0
        }
      
      console.log("Protect")

    }
  }
}